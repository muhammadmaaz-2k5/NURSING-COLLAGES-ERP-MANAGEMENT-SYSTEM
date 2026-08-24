'use client';

import React from 'react';
import { CreditCard, Banknote, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function FinancePage() {
  const invoices = [
    { invoiceNo: 'INV-2026-0891', student: 'Ayesha Bibi', program: 'BSN (Generic)', amount: 'PKR 85,000', paid: 'PKR 85,000', method: 'Bank Transfer', status: 'PAID', dueDate: '2026-09-10' },
    { invoiceNo: 'INV-2026-0892', student: 'Muhammad Usman', program: 'Post-RN BSN', amount: 'PKR 65,000', paid: 'PKR 65,000', method: 'Online Portal', status: 'PAID', dueDate: '2026-09-10' },
    { invoiceNo: 'INV-2026-0893', student: 'Fatima Zahra', program: 'BS-MLT', amount: 'PKR 75,000', paid: 'PKR 0', method: '-', status: 'PENDING', dueDate: '2026-09-15' },
    { invoiceNo: 'INV-2026-0894', student: 'Bilal Farooq', program: 'BSN (Generic)', amount: 'PKR 85,000', paid: 'PKR 40,000', method: 'Cash Deposit', status: 'PARTIAL', dueDate: '2026-09-10' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Fees, Invoicing & Financial Operations</h2>
        <p>Manage student fee challans, tuition installment plans, scholarships, and payment collections.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Revenue Collected" value="PKR 42.8M" icon={Banknote} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Pending Invoices" value="PKR 3.4M" icon={Clock} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Fully Paid Students" value="88%" icon={CheckCircle} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Scholarships Awarded" value="45 Students" icon={CreditCard} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
      </div>

      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Student Name</th>
              <th>Program</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Method</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoiceNo}>
                <td><span className="code-pill">{inv.invoiceNo}</span></td>
                <td style={{ fontWeight: 600 }}>{inv.student}</td>
                <td>{inv.program}</td>
                <td style={{ fontWeight: 600 }}>{inv.amount}</td>
                <td style={{ color: inv.paid !== 'PKR 0' ? '#34d399' : 'var(--text-muted)' }}>{inv.paid}</td>
                <td><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inv.method}</span></td>
                <td>{inv.dueDate}</td>
                <td>
                  <span className={`badge-pill ${inv.status === 'PAID' ? 'success' : inv.status === 'PARTIAL' ? 'warning' : 'danger'}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
