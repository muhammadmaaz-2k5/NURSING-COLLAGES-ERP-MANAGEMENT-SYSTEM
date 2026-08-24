'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Search, GraduationCap, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function StudentsPage() {
  const [search, setSearch] = useState('');

  const students = [
    {
      id: 'STD-2026-001',
      name: 'Ayesha Bibi',
      email: 'ayesha.b@nmc.edu.pk',
      phone: '+92-301-4455667',
      program: 'BSN (Generic) - 4 Years',
      semester: 'Semester 4',
      status: 'Active',
      clinicalStatus: 'Ward Rotation - Surgery',
      city: 'Islamabad',
    },
    {
      id: 'STD-2026-002',
      name: 'Muhammad Usman',
      email: 'm.usman@nmc.edu.pk',
      phone: '+92-333-8899001',
      program: 'Post-RN BSN - 2 Years',
      semester: 'Semester 2',
      status: 'Active',
      clinicalStatus: 'ICU Rotation - Holy Family',
      city: 'Rawalpindi',
    },
    {
      id: 'STD-2026-003',
      name: 'Fatima Zahra',
      email: 'f.zahra@nmc.edu.pk',
      phone: '+92-321-7788990',
      program: 'BS Medical Lab Technology',
      semester: 'Semester 3',
      status: 'Active',
      clinicalStatus: 'Pathology Diagnostics Lab',
      city: 'Peshawar',
    },
  ];

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Student Management & Directory</h2>
          <p>Manage student profiles, enrollments, parents linking, and clinical training status.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Enrolled" value="640" icon={Users} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Active in Clinicals" value="280" icon={GraduationCap} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="New Admissions" value="125" icon={UserPlus} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="PNC Verified" value="100%" icon={ShieldCheck} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px 16px', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '13px' }}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Enrolled Program</th>
              <th>Current Rotation</th>
              <th>Contact Info</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((std) => (
              <tr key={std.id}>
                <td><span className="code-pill">{std.id}</span></td>
                <td style={{ fontWeight: 600 }}>{std.name}</td>
                <td>
                  <div>{std.program}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{std.semester}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 500 }}>{std.clinicalStatus}</span>
                </td>
                <td>
                  <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} color="var(--text-muted)" /> {std.email}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={12} /> {std.phone}
                  </div>
                </td>
                <td><span className="badge-pill success">{std.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
