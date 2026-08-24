'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Building,
  Calendar,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'departments' | 'sessions'>('programs');

  const departments = [
    {
      id: 'DEPT-NURSING',
      name: 'Department of Nursing & Clinical Care',
      code: 'DEPT-NURSING',
      programsCount: 3,
      facultyCount: 18,
      status: 'Active',
    },
    {
      id: 'DEPT-MEDICINE',
      name: 'Department of Allied Health Sciences',
      code: 'DEPT-MEDICINE',
      programsCount: 4,
      facultyCount: 24,
      status: 'Active',
    },
    {
      id: 'DEPT-PHARMACY',
      name: 'Department of Pharmaceutical Sciences',
      code: 'DEPT-PHARMACY',
      programsCount: 2,
      facultyCount: 12,
      status: 'Active',
    },
  ];

  const programs = [
    {
      id: 'BSN-4YR',
      name: 'Bachelor of Science in Nursing (Generic)',
      code: 'BSN-4YR',
      department: 'Department of Nursing & Clinical Care',
      duration: '4 Years (8 Semesters)',
      credits: 135,
      clinicalIncluded: true,
    },
    {
      id: 'POST-RN',
      name: 'Post-RN BSN Degree Program',
      code: 'POST-RN',
      department: 'Department of Nursing & Clinical Care',
      duration: '2 Years (4 Semesters)',
      credits: 68,
      clinicalIncluded: true,
    },
    {
      id: 'DPT-5YR',
      name: 'Doctor of Physical Therapy',
      code: 'DPT-5YR',
      department: 'Department of Allied Health Sciences',
      duration: '5 Years (10 Semesters)',
      credits: 175,
      clinicalIncluded: true,
    },
    {
      id: 'BS-MLT',
      name: 'BS Medical Laboratory Technology',
      code: 'BS-MLT',
      department: 'Department of Allied Health Sciences',
      duration: '4 Years (8 Semesters)',
      credits: 130,
      clinicalIncluded: true,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Academic Curriculum & Programs</h2>
        <p>Manage college programs, departments, semesters, credit hours, and clinical requirements.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('programs')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'programs' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'programs' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Programs ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'departments' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'departments' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Departments ({departments.length})
        </button>
      </div>

      {activeTab === 'programs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {programs.map((prog) => (
            <div key={prog.id} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="module-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <GraduationCap size={22} color="var(--accent-primary)" />
                  </div>
                  <span className="code-pill">{prog.code}</span>
                </div>
                <h4>{prog.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px' }}>{prog.department}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} color="var(--accent-primary)" />
                    <span>{prog.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={15} color="var(--accent-emerald)" />
                    <span>{prog.credits} Total Credit Hours</span>
                  </div>
                  {prog.clinicalIncluded && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#f43f5e" />
                      <span style={{ color: '#fda4af' }}>Clinical Rotations Required</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Code</th>
                <th>Programs Offered</th>
                <th>Faculty Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td style={{ fontWeight: 600 }}>{dept.name}</td>
                  <td><span className="code-pill">{dept.code}</span></td>
                  <td>{dept.programsCount} Programs</td>
                  <td>{dept.facultyCount} Instructors</td>
                  <td><span className="badge-pill success">{dept.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
