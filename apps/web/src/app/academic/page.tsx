'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Building,
  Calendar,
  Layers,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'subjects' | 'campuses' | 'timetable'>('programs');

  const departments = [
    {
      name: 'Department of Nursing & Clinical Care',
      code: 'NUR-DEPT',
      programs: [
        {
          name: 'Bachelor of Science in Nursing (BSN Generic)',
          code: 'BSN-GEN',
          duration: '4 Years (8 Semesters)',
          credits: '135 Credit Hours',
          clinicalHours: '1,200 Clinical Hours',
          pncApproved: true,
        },
        {
          name: 'Post-RN BSN Degree Program',
          code: 'POST-RN',
          duration: '2 Years (4 Semesters)',
          credits: '64 Credit Hours',
          clinicalHours: '600 Clinical Hours',
          pncApproved: true,
        },
      ],
    },
    {
      name: 'Department of Allied Health Sciences',
      code: 'AHS-DEPT',
      programs: [
        {
          name: 'Doctor of Physical Therapy (DPT)',
          code: 'DPT',
          duration: '5 Years (10 Semesters)',
          credits: '175 Credit Hours',
          clinicalHours: '800 Clinical Hours',
          pncApproved: true,
        },
        {
          name: 'BS Medical Laboratory Technology (BS-MLT)',
          code: 'BS-MLT',
          duration: '4 Years (8 Semesters)',
          credits: '130 Credit Hours',
          clinicalHours: '500 Diagnostic Lab Hours',
          pncApproved: true,
        },
      ],
    },
  ];

  const subjects = [
    { code: 'NUR-101', name: 'Fundamental Nursing Skills I', type: 'Clinical / Lab', credits: 4, theory: 2, lab: 2, clinical: true },
    { code: 'ANAT-102', name: 'Human Anatomy & Histology', type: 'Theory & Practical', credits: 4, theory: 3, lab: 1, clinical: false },
    { code: 'PHYS-103', name: 'Human Physiology', type: 'Theory & Practical', credits: 4, theory: 3, lab: 1, clinical: false },
    { code: 'PHARM-201', name: 'Applied Nursing Pharmacology', type: 'Theory', credits: 3, theory: 3, lab: 0, clinical: false },
    { code: 'NUR-202', name: 'Adult Health Nursing I (Medical-Surgical)', type: 'Clinical', credits: 6, theory: 3, lab: 3, clinical: true },
  ];

  const campuses = [
    {
      name: 'Main Healthcare & Nursing Campus',
      code: 'MC-01',
      city: 'Islamabad',
      address: 'Sector H-8/4, Educational Area',
      buildings: [
        { name: 'Nursing Academic Block A', rooms: '12 Classrooms, 4 Skills Labs' },
        { name: 'Allied Health Sciences Block B', rooms: '8 Lecture Halls, 2 Pathology Labs' },
        { name: 'Anatomy & Simulation Center', rooms: '3 Virtual Dissection & Simulation Suites' },
      ],
    },
  ];

  const timetable = [
    { day: 'Monday', time: '08:30 - 10:00 AM', subject: 'Adult Health Nursing I', room: 'Lecture Hall 1 (Block A)', faculty: 'Prof. Dr. Nusrat Parveen', class: 'BSN Year 2 - Sec A' },
    { day: 'Monday', time: '10:30 - 01:30 PM', subject: 'Fundamental Skills Lab Practicum', room: 'Simulation Skills Lab 2', faculty: 'Ms. Samina Noreen', class: 'BSN Year 1 - Sec B' },
    { day: 'Tuesday', time: '09:00 - 10:30 AM', subject: 'Applied Nursing Pharmacology', room: 'Lecture Hall 2 (Block B)', faculty: 'Dr. Tariq Mahmood', class: 'BSN Year 2 - Sec A' },
    { day: 'Wednesday', time: '08:00 - 02:00 PM', subject: 'Hospital Bedside Clinical Ward Duty', room: 'Holy Family Teaching Hospital', faculty: 'Clinical Preceptor Staff', class: 'BSN Year 3' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Academic Curriculum, Degree Programs & Timetables</h2>
        <p>Manage curriculum syllabi, PNC-recognized degree programs, semester progressions, and lecture scheduling.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Academic Programs" value="4 Degree Programs" icon={GraduationCap} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Curriculum Courses" value="56 Subjects" icon={BookOpen} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Classrooms & Labs" value="24 Facilities" icon={Building} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
        <StatsCard label="Current Session" value="Fall 2026" icon={Calendar} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
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
          Departments & Programs
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'subjects' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'subjects' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Courses & Syllabus ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('campuses')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'campuses' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'campuses' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Campuses & Labs
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'timetable' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'timetable' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Live Timetables
        </button>
      </div>

      {activeTab === 'programs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {departments.map((dept) => (
            <div key={dept.code} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="var(--accent-primary)" /> {dept.name}
                </h3>
                <span className="code-pill">{dept.code}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {dept.programs.map((prog) => (
                  <div key={prog.code} className="module-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span className="code-pill">{prog.code}</span>
                        <span className="badge-pill success">PNC Approved</span>
                      </div>
                      <h4 style={{ fontSize: '15px' }}>{prog.name}</h4>
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <div><strong>Duration:</strong> {prog.duration}</div>
                        <div><strong>Credits:</strong> {prog.credits}</div>
                        <div style={{ color: '#fda4af' }}><strong>Clinical Requirement:</strong> {prog.clinicalHours}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Category</th>
                <th>Total Credits</th>
                <th>Theory / Lab Hours</th>
                <th>Clinical Practicum</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => (
                <tr key={sub.code}>
                  <td><span className="code-pill">{sub.code}</span></td>
                  <td style={{ fontWeight: 600 }}>{sub.name}</td>
                  <td><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.type}</span></td>
                  <td style={{ fontWeight: 600 }}>{sub.credits} Cr.</td>
                  <td>{sub.theory}h Theory / {sub.lab}h Lab</td>
                  <td>
                    <span className={`badge-pill ${sub.clinical ? 'warning' : 'primary'}`}>
                      {sub.clinical ? 'Hospital Ward Duty' : 'Campus Classroom'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'campuses' && (
        <div>
          {campuses.map((camp) => (
            <div key={camp.code} className="module-card" style={{ maxWidth: '650px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="module-icon">
                    <Building size={22} color="var(--accent-primary)" />
                  </div>
                  <span className="code-pill">{camp.code}</span>
                </div>
                <h4>{camp.name}</h4>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--accent-emerald)" /> {camp.address}, {camp.city}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {camp.buildings.map((b) => (
                    <div key={b.name} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{b.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.rooms}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time Slot</th>
                <th>Course Subject</th>
                <th>Room / Facility</th>
                <th>Instructor</th>
                <th>Class Cohort</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((t, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{t.day}</td>
                  <td style={{ color: '#60a5fa', fontWeight: 600 }}>{t.time}</td>
                  <td style={{ fontWeight: 600 }}>{t.subject}</td>
                  <td><span className="code-pill">{t.room}</span></td>
                  <td>{t.faculty}</td>
                  <td><span className="badge-pill success">{t.class}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
