'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Award,
  Layers,
  Clock,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'structures' | 'scholarships' | 'statement'>('invoices');

  const invoices = [
    {
      invoiceNo: 'INV-2026-00101',
      studentId: 'STD-2026-0001',
      studentName: 'Muhammad Maaz',
      feeName: 'BSN Year 1 Semester 1 Tuition Fee',
      amount: 85000,
      paidAmount: 85000,
      dueDate: '2026-09-10',
      status: 'PAID',
      method: 'BANK_TRANSFER',
      transactionId: 'HBL-FT-998811',
    },
    {
      invoiceNo: 'INV-2026-00102',
      studentId: 'STD-2026-0002',
      studentName: 'Ayesha Bibi',
      feeName: 'BSN Year 1 Semester 1 Tuition Fee',
      amount: 42500, // 50% merit scholarship applied
      paidAmount: 0,
      dueDate: '2026-09-10',
      status: 'PENDING',
      method: null,
      transactionId: null,
    },
    {
      invoiceNo: 'INV-2026-00088',
      studentId: 'STD-2025-0144',
      studentName: 'Zainab Fatima',
      feeName: 'Post-RN Year 2 Clinical Fee',
      amount: 45000,
      paidAmount: 20000,
      dueDate: '2026-08-15',
      status: 'PARTIAL',
      method: 'ONLINE',
      transactionId: 'EP-99882233',
    },
  ];

  const feeStructures = [
    { program: 'BSN Generic (4 Years)', feeType: 'TUITION', name: 'Semester Tuition Fee', amount: 'PKR 85,000 / Sem' },
    { program: 'BSN Generic (4 Years)', feeType: 'CLINICAL', name: 'Hospital Ward Practicum Fee', amount: 'PKR 25,000 / Year' },
    { program: 'Post-RN BSN (2 Years)', feeType: 'TUITION', name: 'Semester Tuition Fee', amount: 'PKR 65,000 / Sem' },
    { program: 'Doctor of Physical Therapy (DPT)', feeType: 'TUITION', name: 'Semester Tuition Fee', amount: 'PKR 95,000 / Sem' },
  ];

  const scholarships = [
    { name: 'PNC Nursing Merit Excellence Award', type: 'MERIT', benefit: '50% Tuition Concession', recipients: 12 },
    { name: 'Shuhada & Healthcare Workers Children Concession', type: 'SPECIAL', benefit: 'PKR 40,000 Fixed Aid / Year', recipients: 8 },
    { name: 'Need-Based Financial Assistance Endowment', type: 'NEED_BASED', benefit: '25% - 75% Variable Support', recipients: 24 },
  ];

  const sampleLedger = [
    { date: '2026-08-10', type: 'DEBIT', desc: 'Tuition Fee - Fall 2026 (INV-2026-00101)', amount: '85,000', balance: '85,000' },
    { date: '2026-08-14', type: 'CREDIT', desc: 'PNC Merit Scholarship 50% Concession', amount: '-42,500', balance: '42,500' },
    { date: '2026-08-20', type: 'CREDIT', desc: 'Bank Transfer Payment (HBL-FT-998811)', amount: '-42,500', balance: '0' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Fees, Invoices, Financial Ledger & Scholarships</h2>
        <p>Manage program fee tariffs, generate student fee challans, process idempotent payments, and maintain immutable running ledgers.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Revenue Billed" value="PKR 42.8M" icon={DollarSign} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Collected Revenue" value="PKR 38.2M (89.2%)" icon={CheckCircle} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Outstanding Receivables" value="PKR 4.6M" icon={AlertCircle} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Scholarships Awarded" value="PKR 3.4M" icon={Award} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('invoices')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'invoices' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'invoices' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Invoices & Challans ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'structures' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'structures' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Fee Structures ({feeStructures.length})
        </button>
        <button
          onClick={() => setActiveTab('scholarships')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'scholarships' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'scholarships' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Scholarships ({scholarships.length})
        </button>
        <button
          onClick={() => setActiveTab('statement')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'statement' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'statement' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Student Financial Statement
        </button>
      </div>

      {activeTab === 'invoices' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Challan / Invoice No</th>
                <th>Student</th>
                <th>Fee Particulars</th>
                <th>Payable Amount</th>
                <th>Paid Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoiceNo}>
                  <td><span className="code-pill">{inv.invoiceNo}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.studentName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.studentId}</div>
                  </td>
                  <td><span style={{ fontSize: '13px' }}>{inv.feeName}</span></td>
                  <td style={{ fontWeight: 600 }}>PKR {inv.amount.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: inv.paidAmount > 0 ? '#34d399' : 'var(--text-muted)' }}>
                    PKR {inv.paidAmount.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '12px' }}>{inv.dueDate}</td>
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
      )}

      {activeTab === 'structures' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Fee Category</th>
                <th>Fee Name</th>
                <th>Tariff Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((f, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{f.program}</td>
                  <td><span className="badge-pill primary">{f.feeType}</span></td>
                  <td>{f.name}</td>
                  <td style={{ fontWeight: 600, color: '#60a5fa' }}>{f.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'scholarships' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {scholarships.map((s, idx) => (
            <div key={idx} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge-pill success">{s.type}</span>
                  <span className="code-pill">{s.recipients} Beneficiaries</span>
                </div>
                <h4>{s.name}</h4>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#34d399', fontWeight: 600 }}>
                  Benefit: {s.benefit}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'statement' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Student Financial Running Ledger</h3>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Muhammad Maaz (<span className="code-pill">STD-2026-0001</span>) | BSN Generic
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Net Outstanding Balance</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#34d399' }}>PKR 0 (Clear)</div>
            </div>
          </div>

          <table className="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction Type</th>
                <th>Particulars / Description</th>
                <th>Amount (PKR)</th>
                <th>Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {sampleLedger.map((l, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: '12px' }}>{l.date}</td>
                  <td>
                    <span className={`badge-pill ${l.type === 'DEBIT' ? 'warning' : 'success'}`}>
                      {l.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{l.desc}</td>
                  <td style={{ fontWeight: 600, color: l.type === 'DEBIT' ? '#f87171' : '#34d399' }}>
                    {l.amount}
                  </td>
                  <td style={{ fontWeight: 700 }}>PKR {l.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
