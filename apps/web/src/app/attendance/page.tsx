'use client';

import React, { useState } from 'react';
import { CalendarCheck, Users, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState('2026-08-24');

  const attendanceRecords = [
    { studentId: 'STD-2026-001', name: 'Ayesha Bibi', class: 'BSN Year 2 - Sec A', subject: 'Adult Health Nursing I', status: 'PRESENT', time: '08:05 AM' },
    { studentId: 'STD-2026-002', name: 'Muhammad Usman', class: 'BSN Year 2 - Sec A', subject: 'Adult Health Nursing I', status: 'PRESENT', time: '08:12 AM' },
    { studentId: 'STD-2026-003', name: 'Fatima Zahra', class: 'BSN Year 2 - Sec A', subject: 'Adult Health Nursing I', status: 'LATE', time: '08:35 AM' },
    { studentId: 'STD-2026-004', name: 'Bilal Farooq', class: 'BSN Year 2 - Sec A', subject: 'Adult Health Nursing I', status: 'ABSENT', time: '-' },
    { studentId: 'STD-2026-005', name: 'Zainab Qazi', class: 'BSN Year 2 - Sec A', subject: 'Adult Health Nursing I', status: 'LEAVE', time: 'Approved' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Attendance Management & Biometrics</h2>
          <p>Real-time attendance logging for students, clinical ward rosters, and faculty.</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}
        />
      </div>

      <div className="stats-grid">
        <StatsCard label="Average Attendance" value="92.4%" icon={CalendarCheck} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Present Today" value="591" icon={CheckCircle} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Late Arrivals" value="18" icon={Clock} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Unexcused Absences" value="31" icon={XCircle} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
      </div>

      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Class & Section</th>
              <th>Subject / Lab</th>
              <th>Punch Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((rec) => (
              <tr key={rec.studentId}>
                <td><span className="code-pill">{rec.studentId}</span></td>
                <td style={{ fontWeight: 600 }}>{rec.name}</td>
                <td>{rec.class}</td>
                <td>{rec.subject}</td>
                <td style={{ color: 'var(--text-muted)' }}>{rec.time}</td>
                <td>
                  <span className={`badge-pill ${rec.status === 'PRESENT' ? 'success' : rec.status === 'LATE' ? 'warning' : 'danger'}`}>
                    {rec.status}
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
