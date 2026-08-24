'use client';

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  FileText,
  Clock,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function HrPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'leaves' | 'payroll'>('employees');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalEmployees: 64,
    activeHeadcount: 58,
    pendingLeaves: 3,
    monthlyPayrollTotal: 'PKR 4,820,000',
  };

  const employees = [
    { id: '1', empId: 'EMP-2024-001', name: 'Dr. Tariq Mahmood', designation: 'Professor & Head of Clinical Medicine', dept: 'Clinical Sciences', status: 'ACTIVE', salary: 'PKR 250,000', email: 'tariq.mahmood@college.edu.pk' },
    { id: '2', empId: 'EMP-2024-002', name: 'Ms. Ayesha Siddiqa', designation: 'Senior Nursing Instructor & Simulation Lead', dept: 'Nursing Education', status: 'ACTIVE', salary: 'PKR 120,000', email: 'ayesha.s@college.edu.pk' },
    { id: '3', empId: 'EMP-2025-014', name: 'Dr. Sarah Tariq', designation: 'Consultant Cardiologist', dept: 'Clinical Hospital', status: 'ACTIVE', salary: 'PKR 220,000', email: 'sarah.tariq@hospital.edu.pk' },
    { id: '4', empId: 'EMP-2025-022', name: 'Mr. Usman Ali', designation: 'Head Librarian & Archivist', dept: 'Library Administration', status: 'ACTIVE', salary: 'PKR 85,000', email: 'usman.ali@college.edu.pk' },
  ];

  const leaves = [
    { id: 'LV-101', employee: 'Ms. Ayesha Siddiqa', type: 'CASUAL', start: '2026-09-02', end: '2026-09-04', days: 3, reason: 'Family medical emergency', status: 'PENDING' },
    { id: 'LV-102', employee: 'Dr. Tariq Mahmood', type: 'ANNUAL', start: '2026-09-15', end: '2026-09-22', days: 8, reason: 'Annual conference attendance', status: 'APPROVED' },
    { id: 'LV-103', employee: 'Mr. Usman Ali', type: 'SICK', start: '2026-08-20', end: '2026-08-21', days: 2, reason: 'Viral fever recovery', status: 'APPROVED' },
  ];

  const payrolls = [
    { id: 'PAY-2026-08-01', employee: 'Dr. Tariq Mahmood', basic: 250000, allowances: 87500, bonuses: 0, tax: 16875, unpaidLeaves: 0, netSalary: 'PKR 320,625', status: 'APPROVED' },
    { id: 'PAY-2026-08-02', employee: 'Ms. Ayesha Siddiqa', basic: 120000, allowances: 42000, bonuses: 0, tax: 8100, unpaidLeaves: 0, netSalary: 'PKR 153,900', status: 'APPROVED' },
    { id: 'PAY-2026-08-03', employee: 'Dr. Sarah Tariq', basic: 220000, allowances: 77000, bonuses: 0, tax: 14850, unpaidLeaves: 0, netSalary: 'PKR 282,150', status: 'CALCULATED' },
    { id: 'PAY-2026-08-04', employee: 'Mr. Usman Ali', basic: 85000, allowances: 29750, bonuses: 0, tax: 0, unpaidLeaves: 0, netSalary: 'PKR 114,750', status: 'PAID' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Human Resources & Payroll Engine</h2>
          <p>College faculty & staff profiles, leave approval workflows, deterministic payroll computation, and audited reversals.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
            ● HR & Payroll Module Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Faculty & Staff Headcount" value={`${stats.totalEmployees} Staff`} icon={Users} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Active On Duty" value={`${stats.activeHeadcount} Active`} icon={Briefcase} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Pending Leave Requests" value={`${stats.pendingLeaves} Requests`} icon={Calendar} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Current Month Payroll" value={stats.monthlyPayrollTotal} icon={DollarSign} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'employees', label: 'Employee Staff Directory' },
          { id: 'leaves', label: 'Leave Applications & Approvals' },
          { id: 'payroll', label: 'Deterministic Payroll Engine' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-primary-gradient)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--border-color)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Employee Directory */}
      {activeTab === 'employees' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Faculty & Administrative Personnel</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search name, designation, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                />
              </div>
              <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                + Onboard Employee
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Staff Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Basic Scale</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td><span className="code-pill">{e.empId}</span></td>
                  <td>
                    <div>
                      <strong style={{ color: '#fff' }}>{e.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.email}</div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{e.designation}</td>
                  <td><span className="code-pill">{e.dept}</span></td>
                  <td><strong>{e.salary}</strong></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                      }}
                    >
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Leaves */}
      {activeTab === 'leaves' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Employee Leave Request Roster</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Approval decisions directly link with monthly unpaid payroll deductions.</p>
            </div>
            <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + Apply Leave
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Leave ID</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration & Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td><span className="code-pill">{l.id}</span></td>
                  <td><strong style={{ color: '#fff' }}>{l.employee}</strong></td>
                  <td><span className="code-pill">{l.type}</span></td>
                  <td>
                    <div>{l.start} &rarr; {l.end}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.days} Day(s)</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{l.reason}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: l.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: l.status === 'APPROVED' ? '#34d399' : '#fbbf24',
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td>
                    {l.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                        <button style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Decided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Payroll Engine */}
      {activeTab === 'payroll' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Deterministic Salary Computation (August 2026)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Formula: Net = (Basic + House 20% + Medical 10% + Utility 5% + Bonuses) - (Unpaid Leaves + Tax). Finalized records require audited reversal.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                Run Monthly Payroll Engine
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Payroll Slip</th>
                <th>Employee</th>
                <th>Basic Scale</th>
                <th>Allowances</th>
                <th>Income Tax</th>
                <th>Net Payable</th>
                <th>Status</th>
                <th>Audit Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p.id}>
                  <td><span className="code-pill">{p.id}</span></td>
                  <td><strong style={{ color: '#fff' }}>{p.employee}</strong></td>
                  <td>PKR {p.basic.toLocaleString()}</td>
                  <td style={{ color: '#34d399' }}>+PKR {p.allowances.toLocaleString()}</td>
                  <td style={{ color: '#f43f5e' }}>-PKR {p.tax.toLocaleString()}</td>
                  <td><strong style={{ color: '#38bdf8', fontSize: '14px' }}>{p.netSalary}</strong></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: p.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : p.status === 'APPROVED' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: p.status === 'PAID' ? '#34d399' : p.status === 'APPROVED' ? '#60a5fa' : '#fbbf24',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.status === 'CALCULATED' ? (
                      <button style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                    ) : p.status === 'APPROVED' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Disburse</button>
                        <button style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reverse</button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
