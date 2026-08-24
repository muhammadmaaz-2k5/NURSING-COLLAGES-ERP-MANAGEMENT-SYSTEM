'use client';

import React from 'react';
import { CreditCard, Printer, ShieldCheck, DollarSign } from 'lucide-react';
import { StudentFinancialStatement } from '../types/finance.types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { formatCurrency, formatDate } from '../../../lib/utils';

export interface StudentLedgerViewProps {
  statement: StudentFinancialStatement;
}

export const StudentLedgerView: React.FC<StudentLedgerViewProps> = ({ statement }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Invoiced
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {formatCurrency(statement.totalBilled)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Tuition, Labs & Clinical</p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/20">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Scholarships & Grants
          </span>
          <h3 className="text-2xl font-black text-purple-300 mt-1">
            {formatCurrency(statement.totalScholarships)}
          </h3>
          <p className="text-xs text-purple-400/80 mt-1">Merit / Need Waivers</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Total Cleared / Paid
          </span>
          <h3 className="text-2xl font-black text-emerald-300 mt-1">
            {formatCurrency(statement.totalPaid)}
          </h3>
          <p className="text-xs text-emerald-400/80 mt-1">Bank verified payments</p>
        </div>

        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/20">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
            Outstanding Balance
          </span>
          <h3 className="text-2xl font-black text-rose-300 mt-1">
            {formatCurrency(statement.outstandingBalance)}
          </h3>
          <p className="text-xs text-rose-400/80 mt-1">Net pending dues</p>
        </div>
      </div>

      {/* Chronological Ledger Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Chronological Financial Statement</CardTitle>
            <CardDescription>
              Running balance statement for {statement.studentName} ({statement.regId})
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Statement
          </Button>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Date</th>
                <th className="pb-3 font-bold uppercase">Transaction Type</th>
                <th className="pb-3 font-bold uppercase">Description & Reference</th>
                <th className="pb-3 font-bold uppercase text-right">Debit (PKR)</th>
                <th className="pb-3 font-bold uppercase text-right">Credit (PKR)</th>
                <th className="pb-3 font-bold uppercase text-right">Running Balance</th>
                <th className="pb-3 font-bold uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {statement.ledger.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-400">{formatDate(tx.date)}</td>
                  <td className="py-3 font-semibold text-slate-300">{tx.type}</td>
                  <td className="py-3">
                    <p className="font-bold text-slate-200">{tx.description}</p>
                    {tx.challanNumber && (
                      <span className="font-mono text-blue-400 text-[11px]">
                        {tx.challanNumber}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-rose-400">
                    {tx.debit > 0 ? formatCurrency(tx.debit) : '—'}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    {tx.credit > 0 ? formatCurrency(tx.credit) : '—'}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white text-sm">
                    {formatCurrency(tx.balance)}
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant={tx.status === 'PAID' ? 'success' : 'danger'} size="sm">
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
