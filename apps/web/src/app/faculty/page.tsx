'use client';

import React from 'react';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function FacultyPage() {
  const facultyMembers = [
    {
      id: 'FAC-2026-001',
      name: 'Prof. Dr. Nusrat Parveen',
      designation: 'Dean & Professor of Nursing',
      qualification: 'PhD Nursing, MSN, RN, RM',
      department: 'Department of Nursing & Clinical Care',
      email: 'nusrat.parveen@nmc.edu.pk',
      phone: '+92 300 1239988',
      workload: '12 Credit Hours (3 Classes)',
      courses: ['Adult Health Nursing I', 'Clinical Simulations II'],
    },
    {
      id: 'FAC-2026-002',
      name: 'Dr. Tariq Mahmood',
      designation: 'Associate Professor of Pharmacology',
      qualification: 'Pharm-D, M.Phil Pharmacology',
      department: 'Department of Allied Health Sciences',
      email: 'tariq.mahmood@nmc.edu.pk',
      phone: '+92 301 8877665',
      workload: '9 Credit Hours (2 Classes)',
      courses: ['Applied Nursing Pharmacology', 'Clinical Pharmacy Practicum'],
    },
    {
      id: 'FAC-2026-003',
      name: 'Ms. Samina Noreen',
      designation: 'Assistant Professor & Nursing Skills Lead',
      qualification: 'MSN, BSN Generic, RN',
      department: 'Department of Nursing & Clinical Care',
      email: 'samina.noreen@nmc.edu.pk',
      phone: '+92 333 4455667',
      workload: '16 Credit Hours (4 Skills Labs)',
      courses: ['Fundamental Nursing Skills I & II', 'OSPE Skills Simulation'],
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Faculty Directory & Teaching Workloads</h2>
        <p>Manage professors, clinical instructors, departmental allocations, and course workload assignments.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Faculty Members" value="48 Instructors" icon={Users} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Professors & Deans" value="8 Leaders" icon={Award} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Allocated Courses" value="56 Course Sections" icon={BookOpen} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
        <StatsCard label="Avg. Teaching Load" value="12.5 Cr. Hours" icon={Calendar} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Faculty Name & Title</th>
              <th>Academic Department</th>
              <th>Qualifications & Specialization</th>
              <th>Weekly Workload</th>
              <th>Assigned Courses</th>
            </tr>
          </thead>
          <tbody>
            {facultyMembers.map((f) => (
              <tr key={f.id}>
                <td><span className="code-pill">{f.id}</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.designation}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.email}</div>
                </td>
                <td><span style={{ fontSize: '13px' }}>{f.department}</span></td>
                <td><span className="code-pill">{f.qualification}</span></td>
                <td style={{ fontWeight: 600, color: '#60a5fa' }}>{f.workload}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {f.courses.map((c, i) => (
                      <span key={i} className="badge-pill primary" style={{ fontSize: '11px' }}>{c}</span>
                    ))}
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
