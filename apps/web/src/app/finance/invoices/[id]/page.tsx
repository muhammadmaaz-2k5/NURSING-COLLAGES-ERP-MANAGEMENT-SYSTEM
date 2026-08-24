'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  CreditCard,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  DollarSign,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { InvoiceStatusBadge } from '../../../../features/finance/components/InvoiceStatusBadge';
import { PaymentModal } from '../../../../features/finance/components/PaymentModal';
import { fetchInvoiceById } from '../../../../features/finance/services/finance.api';
import { InvoiceDetail } from '../../../../features/finance/types/finance.types';
import { formatCurrency, formatDate } from '../../../../lib/utils';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const loadInvoice = async () => {
    if (!invoiceId) return;
    setIsLoading(true);
    try {
      const data = await fetchInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const handlePrintChallan = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Fee Challan Workspace...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Invoice Challan Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/finance')}>
          Back to Finance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/finance')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Invoices Roster
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintChallan}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Official Challan (3-Part)
          </Button>

          {invoice.remainingAmount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Collect Payment
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Overview Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xl text-blue-400">
                {invoice.challanNumber}
              </span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="text-sm font-bold text-white mt-1">{invoice.feeStructureName}</p>
            <p className="text-xs text-slate-400">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-right min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Remaining Balance</span>
            <p
              className={`text-2xl font-black font-mono mt-0.5 ${
                invoice.remainingAmount > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {formatCurrency(invoice.remainingAmount)}
            </p>
          </div>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Gross Fee Amount</span>
            <span className="font-mono font-bold text-white text-base">
              {formatCurrency(invoice.grossAmount)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Scholarship Concession</span>
            <span className="font-mono font-bold text-purple-400 text-base">
              -{formatCurrency(invoice.scholarshipAmount)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Net Payable Amount</span>
            <span className="font-mono font-bold text-blue-400 text-base">
              {formatCurrency(invoice.netAmount)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Total Cleared</span>
            <span className="font-mono font-bold text-emerald-400 text-base">
              {formatCurrency(invoice.paidAmount)}
            </span>
          </div>
        </div>

        {/* Student Context */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <img
              src={
                invoice.avatarUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
              }
              alt={invoice.studentName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div>
              <p className="font-bold text-slate-100">{invoice.studentName}</p>
              <span className="font-mono text-blue-400">{invoice.studentRegId}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/finance/student/${invoice.studentId}`)}
          >
            View Student Ledger
          </Button>
        </div>
      </div>

      {/* Payment History Card */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Recorded Payment Transactions</CardTitle>
            <CardDescription>
              Bank transaction audit trail for this fee challan
            </CardDescription>
          </div>
        </CardHeader>

        {invoice.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-bold uppercase">Payment Timestamp</th>
                  <th className="pb-3 font-bold uppercase">Method / Gateway</th>
                  <th className="pb-3 font-bold uppercase">Bank Reference / TX ID</th>
                  <th className="pb-3 font-bold uppercase text-right">Amount Paid</th>
                  <th className="pb-3 font-bold uppercase">Ledger Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoice.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono text-slate-300">{p.paidAt}</td>
                    <td className="py-3 font-semibold text-blue-400">{p.method}</td>
                    <td className="py-3 font-mono text-slate-200">{p.transactionId || '—'}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3 text-slate-400">{p.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No payments have been recorded for this challan yet.
          </div>
        )}
      </Card>

      {/* Collect Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoiceId={invoice.id}
        challanNumber={invoice.challanNumber}
        studentName={invoice.studentName}
        remainingAmount={invoice.remainingAmount}
        onSuccess={loadInvoice}
      />
    </div>
  );
}
