'use client';

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  GraduationCap,
  FileCheck2,
  Phone,
  Mail,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'admissions' | 'documents'>('students');

  const students = [
    {
      id: 'STD-2026-0001',
      name: 'Muhammad Maaz',
      email: 'maaz@nmc.edu.pk',
      phone: '+92 300 1234567',
      program: 'BSN Generic (4 Years)',
      semester: 'Semester 1',
      section: 'BSN-Y1-SecA',
      status: 'ACTIVE',
      guardian: 'Abdul Rashid (Father)',
      guardianPhone: '+92 300 9988776',
    },
    {
      id: 'STD-2026-0002',
      name: 'Ayesha Bibi',
      email: 'ayesha.bibi@nmc.edu.pk',
      phone: '+92 301 4455667',
      program: 'BSN Generic (4 Years)',
      semester: 'Semester 1',
      section: 'BSN-Y1-SecA',
      status: 'ACTIVE',
      guardian: 'Tariq Mehmood (Father)',
      guardianPhone: '+92 302 5566778',
    },
    {
      id: 'STD-2025-0144',
      name: 'Zainab Fatima',
      email: 'zainab.f@nmc.edu.pk',
      phone: '+92 333 8899001',
      program: 'Post-RN BSN (2 Years)',
      semester: 'Semester 3',
      section: 'PRN-Y2',
      status: 'ACTIVE',
      guardian: 'Farooq Ahmed (Husband)',
      guardianPhone: '+92 334 1122334',
    },
    {
      id: 'STD-2024-0089',
      name: 'Hamza Tariq',
      email: 'hamza.t@nmc.edu.pk',
      phone: '+92 345 6677889',
      program: 'Doctor of Physical Therapy (DPT)',
      semester: 'Semester 5',
      section: 'DPT-Y3',
      status: 'ACTIVE',
      guardian: 'Tariq Javed (Father)',
      guardianPhone: '+92 300 3344556',
    },
  ];

  const admissions = [
    {
      appNo: 'APP-2026-0012',
      name: 'Sana Malik',
      email: 'sana.malik99@gmail.com',
      phone: '+92 300 5544332',
      program: 'BSN Generic',
      qualification: 'FSc Pre-Medical (89.2%)',
      status: 'APPROVED',
      appliedAt: '2026-08-20',
      docsCount: 4,
    },
    {
      appNo: 'APP-2026-0013',
      name: 'Bilal Khan',
      email: 'bilal.k@gmail.com',
      phone: '+92 312 7766554',
      program: 'BS Medical Laboratory Technology',
      qualification: 'FSc Pre-Medical (78.5%)',
      status: 'UNDER_REVIEW',
      appliedAt: '2026-08-22',
      docsCount: 3,
    },
    {
      appNo: 'APP-2026-0014',
      name: 'Mariam Ali',
      email: 'mariam.ali@yahoo.com',
      phone: '+92 321 9988771',
      program: 'Post-RN BSN',
      qualification: 'General Nursing Diploma (3Y)',
      status: 'PENDING',
      appliedAt: '2026-08-23',
      docsCount: 5,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Student Lifecycle, Admissions & Biographic Profiles</h2>
        <p>Manage prospective admissions applications, student registration, parent relationships, and semester cohorts.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Active Students" value="842 Enrolled" icon={Users} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Pending Applications" value="28 Under Review" icon={Clock} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Verified Documents" value="3,120 Files" icon={FileCheck2} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Graduated Alumni" value="450 Nurses" icon={GraduationCap} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('students')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'students' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'students' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Enrolled Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('admissions')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'admissions' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'admissions' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Admissions Pipeline ({admissions.length})
        </button>
      </div>

      {activeTab === 'students' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Degree Program</th>
                <th>Current Semester</th>
                <th>Section</th>
                <th>Parent / Emergency Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td><span className="code-pill">{s.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.email}</div>
                  </td>
                  <td><span style={{ fontSize: '13px' }}>{s.program}</span></td>
                  <td style={{ fontWeight: 600, color: '#60a5fa' }}>{s.semester}</td>
                  <td><span className="badge-pill primary">{s.section}</span></td>
                  <td>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.guardian}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.guardianPhone}</div>
                  </td>
                  <td><span className="badge-pill success">{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'admissions' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Application No</th>
                <th>Applicant Name</th>
                <th>Applied Program</th>
                <th>Previous Qualification</th>
                <th>Uploaded Docs</th>
                <th>Application Date</th>
                <th>Review Status</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <tr key={a.appNo}>
                  <td><span className="code-pill">{a.appNo}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.phone}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{a.program}</td>
                  <td><span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{a.qualification}</span></td>
                  <td>
                    <span className="badge-pill primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <FileCheck2 size={12} /> {a.docsCount} Docs
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.appliedAt}</td>
                  <td>
                    <span className={`badge-pill ${a.status === 'APPROVED' ? 'success' : a.status === 'UNDER_REVIEW' ? 'warning' : 'primary'}`}>
                      {a.status}
                    </span>
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
