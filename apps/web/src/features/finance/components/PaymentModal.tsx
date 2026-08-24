'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { recordPayment } from '../services/finance.api';
import { PaymentMethod } from '../types/finance.types';
import { formatCurrency } from '../../../lib/utils';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  challanNumber: string;
  studentName: string;
  remainingAmount: number;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  challanNumber,
  studentName,
  remainingAmount,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>(remainingAmount);
  const [method, setMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('Payment collected via bank deposit slip');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Validation Error', 'Please enter a valid payment amount.');
      return;
    }

    setIsLoading(true);
    try {
      await recordPayment({
        invoiceId,
        amount,
        method,
        transactionId,
        notes,
      });

      toast.success(
        'Payment Recorded Successfully',
        `Collected ${formatCurrency(amount)} against Challan ${challanNumber}.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Payment Failed', err?.message || 'Transaction could not be completed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Fee Payment & Issue Receipt"
      description="Atomic payment transaction with instant ledger update and idempotency protection."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            Confirm & Collect {formatCurrency(amount)}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Context Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Challan Number:</span>
            <span className="font-mono font-bold text-blue-400">{challanNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Student:</span>
            <span className="font-semibold text-slate-200">{studentName}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Remaining Balance:</span>
            <span className="font-mono font-bold text-rose-400">
              {formatCurrency(remainingAmount)}
            </span>
          </div>
        </div>

        {/* Payment Amount */}
        <Input
          label="Payment Amount to Collect (PKR) *"
          type="number"
          min={1}
          max={remainingAmount}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />

        {/* Payment Method */}
        <Select
          label="Payment Gateway / Channel *"
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          options={[
            { value: 'BANK_TRANSFER', label: 'Online Bank Transfer (FT / IBFT / 1LINK)' },
            { value: 'CASH', label: 'Cash at College Accounts Counter' },
            { value: 'CHEQUE', label: 'Bank Pay Order / Demand Draft' },
            { value: 'CREDIT_CARD', label: 'POS Terminal Card Swipe' },
            { value: 'ONLINE', label: 'Kuickpay / EasyPaisa / JazzCash' },
          ]}
        />

        {/* Transaction Reference */}
        <Input
          label="Bank Transaction ID / Deposit Slip No."
          placeholder="e.g. HBL-FT-9988776655"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />

        {/* Remarks */}
        <Input
          label="Accounts Ledger Remarks"
          placeholder="e.g. 1st installment payment"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
