'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Download, FileText, Bell } from 'lucide-react';

export default function PublicNoticesPage() {
  const notices = [
    {
      id: 'NOT-101',
      date: 'August 24, 2026',
      title: 'Fall 2026 Admissions Open: Apply Online before September 15, 2026',
      department: 'Admissions Office',
      category: 'ADMISSIONS',
      description: 'Online applications are invited for Generic BSN (4 Years), Post-RN BSN (2 Years), LHV, and CNA programs. Prospectus and fee schedules are accessible through the online portal.',
      hasDownload: true,
      downloadName: 'Admissions-Policy-Fall-2026.pdf',
    },
    {
      id: 'NOT-102',
      date: 'August 18, 2026',
      title: 'Final Semester Comprehensive & OSCE Examination Date-Sheet Published',
      department: 'Examination Branch',
      category: 'EXAMINATIONS',
      description: 'The date-sheet for the 8th Semester BSN and 4th Semester Post-RN terminal examinations has been officially notified. OSCE clinical evaluations will commence from September 5, 2026.',
      hasDownload: true,
      downloadName: 'OSCE-Datesheet-Fall-2026.pdf',
    },
    {
      id: 'NOT-103',
      date: 'August 10, 2026',
      title: 'Clinical Hospital Rotation Schedule for 3rd & 4th Year BSN Students',
      department: 'Clinical Training Directorate',
      category: 'CLINICAL',
      description: 'Rosters for Emergency ICU, Pediatric Ward, and Operation Theater clinical postings for the upcoming academic cycle are now active. All students must wear designated scrubs and badges.',
      hasDownload: true,
      downloadName: 'Clinical-Rotation-Roster.pdf',
    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/portal" style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '12px' }}>
          <ArrowLeft size={14} /> Back to Public Portal
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Bell size={26} color="#fbbf24" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Public Notice Board & Official Circulars</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Examination dates, academic calendars, admissions schedules, and institutional policies.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notices.map((n) => (
          <div key={n.id} className="module-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="code-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>{n.category}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{n.department}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{n.date}</span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{n.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{n.description}</p>

            {n.hasDownload && (
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: '#60a5fa',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} /> Download Official Circular ({n.downloadName})
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
