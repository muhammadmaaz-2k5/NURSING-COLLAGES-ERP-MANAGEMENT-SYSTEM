'use client';

import React, { useState } from 'react';
import {
  FileText,
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  GraduationCap,
  Calendar,
  Lock,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<'exams' | 'transcript'>('exams');

  const scheduledExams = [
    {
      id: 'EXAM-2026-01',
      name: 'Midterm Examination Fall 2026',
      subject: 'Adult Health Nursing I',
      semester: 'Semester 3 (BSN)',
      type: 'MIDTERM',
      date: '2026-09-15',
      time: '09:00 - 11:00 AM',
      totalMarks: 50,
      passingMarks: 25,
      status: 'SCHEDULED',
    },
    {
      id: 'EXAM-2026-02',
      name: 'OSPE Clinical Simulation Evaluation',
      subject: 'Fundamental Nursing Skills I',
      semester: 'Semester 1 (BSN)',
      type: 'PRACTICAL',
      date: '2026-09-18',
      time: '10:00 - 02:00 PM',
      totalMarks: 100,
      passingMarks: 60,
      status: 'SCHEDULED',
    },
    {
      id: 'EXAM-2026-03',
      name: 'Final Examination Spring 2026',
      subject: 'Human Anatomy & Histology',
      semester: 'Semester 2 (BSN)',
      type: 'FINAL',
      date: '2026-06-20',
      time: '09:00 - 12:00 PM',
      totalMarks: 100,
      passingMarks: 50,
      status: 'COMPLETED',
    },
  ];

  const sampleTranscript = {
    studentId: 'STD-2026-0001',
    studentName: 'Muhammad Maaz',
    program: 'Bachelor of Science in Nursing (BSN Generic)',
    cgpa: 3.86,
    totalCredits: 34,
    semesters: [
      {
        semesterName: 'Semester 1 - Fall 2025',
        gpa: 3.82,
        courses: [
          { code: 'NUR-101', name: 'Fundamental Nursing Skills I', credits: 4, marks: 88, grade: 'A+', gp: 4.0 },
          { code: 'ANAT-102', name: 'Human Anatomy & Histology', credits: 4, marks: 82, grade: 'A', gp: 3.7 },
          { code: 'PHYS-103', name: 'Human Physiology', credits: 4, marks: 84, grade: 'A', gp: 3.7 },
          { code: 'ENG-101', name: 'English Functional Writing', credits: 3, marks: 91, grade: 'A+', gp: 4.0 },
        ],
      },
      {
        semesterName: 'Semester 2 - Spring 2026',
        gpa: 3.90,
        courses: [
          { code: 'NUR-201', name: 'Applied Nursing Pharmacology', credits: 3, marks: 86, grade: 'A+', gp: 4.0 },
          { code: 'NUR-202', name: 'Adult Health Nursing I', credits: 6, marks: 89, grade: 'A+', gp: 4.0 },
          { code: 'BIO-105', name: 'Biochemistry for Nurses', credits: 3, marks: 79, grade: 'B+', gp: 3.3 },
        ],
      },
    ],
  };

  return (
    <div>
      <div className="page-header">
        <h2>Examinations, Grade Engine & Transcripts</h2>
        <p>Schedule Midterm, Final, and OSPE practical evaluations, enter student marks, and calculate semester GPA & cumulative CGPA.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Scheduled Exams" value="14 Assessments" icon={Calendar} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Completed & Published" value="42 Results" icon={CheckCircle} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Average Campus GPA" value="3.42 / 4.00" icon={TrendingUp} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
        <StatsCard label="Pass Rate" value="96.8% Passed" icon={Award} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('exams')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'exams' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'exams' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Scheduled Examinations
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'transcript' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'transcript' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Transcript & GPA Engine Explorer
        </button>
      </div>

      {activeTab === 'exams' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Course Subject</th>
                <th>Semester Cohort</th>
                <th>Assessment Type</th>
                <th>Date & Time</th>
                <th>Total / Passing Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledExams.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td><span style={{ fontWeight: 500 }}>{e.subject}</span></td>
                  <td><span className="code-pill">{e.semester}</span></td>
                  <td><span className="badge-pill primary">{e.type}</span></td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{e.date}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.time}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{e.totalMarks} / {e.passingMarks}</td>
                  <td>
                    <span className={`badge-pill ${e.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{sampleTranscript.studentName}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Registration ID: <span className="code-pill">{sampleTranscript.studentId}</span> | {sampleTranscript.program}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cumulative CGPA</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#34d399' }}>{sampleTranscript.cgpa} / 4.00</div>
              </div>
            </div>

            {sampleTranscript.semesters.map((sem, i) => (
              <div key={i} style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{sem.semesterName}</h4>
                  <span className="badge-pill success">Semester GPA: {sem.gpa}</span>
                </div>

                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Obtained Marks</th>
                      <th>Letter Grade</th>
                      <th>Grade Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((c) => (
                      <tr key={c.code}>
                        <td><span className="code-pill">{c.code}</span></td>
                        <td>{c.name}</td>
                        <td>{c.credits} Cr.</td>
                        <td style={{ fontWeight: 600 }}>{c.marks} / 100</td>
                        <td><span className="badge-pill primary">{c.grade}</span></td>
                        <td style={{ fontWeight: 600, color: '#60a5fa' }}>{c.gp.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
