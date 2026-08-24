'use client';

import React from 'react';
import { Award, FileSpreadsheet, Calendar, CheckCircle2 } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function ExamsPage() {
  const exams = [
    {
      id: 'EXM-2026-01',
      name: 'Midterm Examination Fall 2026',
      subject: 'Adult Health Nursing I (Theory)',
      program: 'BSN (Generic)',
      date: '2026-10-15',
      totalMarks: 100,
      passingMarks: 50,
      status: 'SCHEDULED',
    },
    {
      id: 'EXM-2026-02',
      name: 'Midterm OSPE & Clinical Viva',
      subject: 'Fundamental Nursing Skills Lab',
      program: 'BSN (Generic)',
      date: '2026-10-18',
      totalMarks: 50,
      passingMarks: 30,
      status: 'SCHEDULED',
    },
    {
      id: 'EXM-2026-03',
      name: 'Final Semester Assessment',
      subject: 'Pathophysiology & Pharmacology',
      program: 'Post-RN BSN',
      date: '2026-06-20',
      totalMarks: 100,
      passingMarks: 50,
      status: 'COMPLETED',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Examinations, Marks & Transcripts</h2>
        <p>Schedule semester exams, record marks, and auto-calculate GPA / PNC grades.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Scheduled Exams" value="8" icon={FileSpreadsheet} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Completed Exams" value="24" icon={CheckCircle2} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="College Avg GPA" value="3.42" icon={Award} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Passing Rate" value="96.5%" icon={Award} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
      </div>

      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Exam Code</th>
              <th>Assessment Name</th>
              <th>Course Subject</th>
              <th>Academic Program</th>
              <th>Exam Date</th>
              <th>Total Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((ex) => (
              <tr key={ex.id}>
                <td><span className="code-pill">{ex.id}</span></td>
                <td style={{ fontWeight: 600 }}>{ex.name}</td>
                <td>{ex.subject}</td>
                <td><span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{ex.program}</span></td>
                <td>{ex.date}</td>
                <td style={{ fontWeight: 600 }}>{ex.totalMarks} Marks</td>
                <td>
                  <span className={`badge-pill ${ex.status === 'COMPLETED' ? 'success' : 'primary'}`}>
                    {ex.status}
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
