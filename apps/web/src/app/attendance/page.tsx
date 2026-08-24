'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('BSN Year 1 - Sec A');
  const [selectedSubject, setSelectedSubject] = useState('Fundamental Nursing Skills I');

  const attendanceRoster = [
    { id: 'STD-2026-0001', name: 'Muhammad Maaz', status: 'PRESENT', percentage: 94.5, eligible: true },
    { id: 'STD-2026-0002', name: 'Ayesha Bibi', status: 'PRESENT', percentage: 91.2, eligible: true },
    { id: 'STD-2026-0003', name: 'Usman Ali', status: 'LATE', percentage: 82.0, eligible: true },
    { id: 'STD-2026-0004', name: 'Fatima Zahra', status: 'ABSENT', percentage: 68.5, eligible: false },
    { id: 'STD-2026-0005', name: 'Zeeshan Khan', status: 'PRESENT', percentage: 88.0, eligible: true },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Attendance Tracking & Eligibility Matrix</h2>
        <p>Record daily class & lab attendance cohorts, compute PNC 75% examination eligibility thresholds, and monitor faculty logs.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Today's Attendance" value="92.4% Present" icon={CalendarCheck} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Exam Eligible (>75%)" value="812 Students" icon={UserCheck} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Low Attendance Warning" value="30 Students" icon={AlertCircle} iconBg="rgba(239, 68, 68, 0.15)" iconColor="#f87171" />
        <StatsCard label="Faculty Check-In" value="46/48 Logged" icon={Clock} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Class Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
            >
              <option>BSN Year 1 - Sec A</option>
              <option>BSN Year 1 - Sec B</option>
              <option>BSN Year 2 - Sec A</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Course Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
            >
              <option>Fundamental Nursing Skills I</option>
              <option>Human Anatomy & Histology</option>
              <option>Human Physiology</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              defaultValue="2026-08-24"
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Today's Status</th>
              <th>Overall Subject Attendance</th>
              <th>PNC Exam Eligibility (75%)</th>
              <th>Quick Mark Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRoster.map((r) => (
              <tr key={r.id}>
                <td><span className="code-pill">{r.id}</span></td>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td>
                  <span className={`badge-pill ${r.status === 'PRESENT' ? 'success' : r.status === 'LATE' ? 'warning' : 'danger'}`}>
                    {r.status}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{r.percentage}%</td>
                <td>
                  <span className={`badge-pill ${r.eligible ? 'success' : 'danger'}`}>
                    {r.eligible ? 'Eligible' : 'Warning (<75%)'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'none', cursor: 'pointer' }}>Present</button>
                    <button className="code-pill" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: 'none', cursor: 'pointer' }}>Late</button>
                    <button className="code-pill" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', cursor: 'pointer' }}>Absent</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
