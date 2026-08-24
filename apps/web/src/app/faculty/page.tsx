'use client';

import React from 'react';
import { UserCheck, Award, BookOpen, Stethoscope, Mail, Phone } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function FacultyPage() {
  const faculty = [
    {
      id: 'EMP-FAC-01',
      name: 'Prof. Dr. Nusrat Parveen',
      designation: 'Dean & Professor of Nursing',
      qualification: 'PhD Nursing, MSN (UK), RN, RM',
      department: 'Department of Nursing & Clinical Care',
      specialization: 'Critical Care & Nursing Leadership',
      email: 'nusrat.parveen@nmc.edu.pk',
      phone: '+92-51-111-222-101',
      assignedSubjects: ['Advanced Nursing Practicum', 'Clinical Leadership'],
    },
    {
      id: 'EMP-FAC-02',
      name: 'Dr. Tariq Mahmood',
      designation: 'Associate Professor',
      qualification: 'MBBS, FCPS (Medicine)',
      department: 'Department of Allied Health Sciences',
      specialization: 'Internal Medicine & Pharmacology',
      email: 'tariq.m@nmc.edu.pk',
      phone: '+92-51-111-222-102',
      assignedSubjects: ['Applied Pharmacology', 'Pathophysiology'],
    },
    {
      id: 'EMP-FAC-03',
      name: 'Ms. Samina Noreen',
      designation: 'Senior Clinical Instructor',
      qualification: 'BSN, Post-RN, Clinical Nurse Specialist',
      department: 'Department of Nursing & Clinical Care',
      specialization: 'Maternal & Child Health Nursing',
      email: 'samina.n@nmc.edu.pk',
      phone: '+92-51-111-222-103',
      assignedSubjects: ['Obstetric Nursing', 'Pediatric Skills Lab'],
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Faculty & Clinical Supervisors</h2>
        <p>Manage professors, clinical instructors, teaching workload, and laboratory supervisions.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Faculty Members" value="48" icon={UserCheck} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Clinical Instructors" value="22" icon={Stethoscope} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
        <StatsCard label="PhD & Specialists" value="14" icon={Award} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Active Subjects" value="56" icon={BookOpen} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {faculty.map((f) => (
          <div key={f.id} className="module-card">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4>{f.name}</h4>
                  <div style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 600 }}>{f.designation}</div>
                </div>
                <span className="code-pill">{f.id}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{f.qualification}</p>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                <strong>Department:</strong> {f.department}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="var(--text-muted)" /> {f.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="var(--text-muted)" /> {f.phone}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Assigned Teaching Workload
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {f.assignedSubjects.map((sub) => (
                    <span key={sub} className="code-pill" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
