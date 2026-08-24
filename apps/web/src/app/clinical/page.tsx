'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  AlertCircle,
  FileCheck,
  Users,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function ClinicalPage() {
  const [activeTab, setActiveTab] = useState<'sites' | 'rotations' | 'skills' | 'logbook' | 'progress'>('progress');

  const sites = [
    {
      name: 'Holy Family Teaching Hospital',
      type: 'HOSPITAL',
      city: 'Rawalpindi',
      address: 'Murree Road, Rawalpindi',
      contact: 'Dr. Shahzad (MS) | +92 51 9290321',
      activeWards: 'ICU, Surgical Ward 3, Pediatric Emergency, CCU',
      rotatorsCount: 64,
    },
    {
      name: 'Benazir Bhutto District Headquarters Hospital',
      type: 'HOSPITAL',
      city: 'Rawalpindi',
      address: 'Chandni Chowk, Murree Road',
      contact: 'Dr. Farooq (AMS) | +92 51 9290300',
      activeWards: 'Medical Ward 2, Orthopedic Unit, Labour Room',
      rotatorsCount: 42,
    },
    {
      name: 'Rural Community Health Center (Tarlai Kalan)',
      type: 'COMMUNITY_CENTER',
      city: 'Islamabad',
      address: 'Lehtrar Road, Tarlai Kalan',
      contact: 'Dr. Ayesha (In-charge) | +92 51 2244111',
      activeWards: 'EPI Vaccination, Maternal Child Health, Outpatient',
      rotatorsCount: 18,
    },
  ];

  const rotations = [
    {
      studentId: 'STD-2026-0001',
      studentName: 'Muhammad Maaz',
      program: 'BSN Generic (Year 2)',
      site: 'Holy Family Teaching Hospital',
      ward: 'Intensive Care Unit (ICU)',
      dates: '2026-09-01 - 2026-09-30',
      supervisor: 'Prof. Dr. Nusrat Parveen',
      shift: 'Morning (08:00 - 14:00)',
      status: 'ACTIVE',
    },
    {
      studentId: 'STD-2026-0002',
      studentName: 'Ayesha Bibi',
      program: 'BSN Generic (Year 2)',
      site: 'Benazir Bhutto Hospital',
      ward: 'Labour & Delivery Suite',
      dates: '2026-09-01 - 2026-09-30',
      supervisor: 'Ms. Samina Noreen',
      shift: 'Morning (08:00 - 14:00)',
      status: 'ACTIVE',
    },
    {
      studentId: 'STD-2025-0144',
      studentName: 'Zainab Fatima',
      program: 'Post-RN BSN (Year 2)',
      site: 'Holy Family Teaching Hospital',
      ward: 'Surgical Ward 3 (Post-Op)',
      dates: '2026-08-01 - 2026-08-31',
      supervisor: 'Dr. Tariq Mahmood',
      shift: 'Evening (14:00 - 20:00)',
      status: 'COMPLETED',
    },
  ];

  const skillsCatalog = [
    { name: 'Intravenous (IV) Cannulation & Flow Calibration', category: 'Medication Administration', requiredLevel: 'Competent', verifierDesignation: 'Clinical Preceptor' },
    { name: 'Female & Male Urinary Catheterization (Foley)', category: 'Patient Assessment & Care', requiredLevel: 'Competent', verifierDesignation: 'Nursing Supervisor' },
    { name: 'Sterile Surgical Wound Dressing & Suture Removal', category: 'Wound Care & Asepsis', requiredLevel: 'Competent', verifierDesignation: 'Ward Instructor' },
    { name: '12-Lead Electrocardiogram (ECG) Recording', category: 'Emergency & Critical Care', requiredLevel: 'Competent', verifierDesignation: 'ICU Charge Nurse' },
    { name: 'Nasogastric (NG) Tube Insertion & Gavage Feeding', category: 'Basic Nursing Care', requiredLevel: 'Competent', verifierDesignation: 'Clinical Instructor' },
  ];

  const logbookRecords = [
    {
      studentName: 'Muhammad Maaz',
      skill: 'Intravenous (IV) Cannulation & Flow Calibration',
      site: 'Holy Family Hospital - ICU',
      date: '2026-08-22',
      status: 'VERIFIED',
      score: '95 / 100',
      verifier: 'Prof. Dr. Nusrat Parveen',
      remarks: 'Perfect aseptic vein entry on 1st attempt. Flow rate calibrated accurately.',
    },
    {
      studentName: 'Muhammad Maaz',
      skill: 'Sterile Surgical Wound Dressing & Suture Removal',
      site: 'Holy Family Hospital - Surgical Ward 3',
      date: '2026-08-20',
      status: 'VERIFIED',
      score: '90 / 100',
      verifier: 'Ms. Samina Noreen',
      remarks: 'Good sterile barrier maintenance. Debridement technique followed.',
    },
    {
      studentName: 'Ayesha Bibi',
      skill: 'Female & Male Urinary Catheterization (Foley)',
      site: 'Benazir Bhutto Hospital - Labour Suite',
      date: '2026-08-23',
      status: 'IN_PROGRESS',
      score: 'Pending',
      verifier: 'Awaiting Preceptor Sign-off',
      remarks: 'Procedure completed under direct bedside supervision.',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Clinical Training, Hospital Rotations & Skills Logbook</h2>
        <p>Specialized Nursing & Allied Health management: hospital ward postings, PNC procedural competencies, and preceptor sign-offs.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Partner Hospitals" value="8 Teaching Sites" icon={Building2} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Active Ward Rotators" value="124 Students" icon={Users} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Verified Skills Logged" value="1,840 Sign-offs" icon={CheckCircle2} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
        <StatsCard label="Clinical Hours Logged" value="28,400 Hours" icon={Clock} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('progress')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'progress' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'progress' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Clinical Hours & Competency Progress
        </button>
        <button
          onClick={() => setActiveTab('rotations')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'rotations' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'rotations' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Ward Rotations ({rotations.length})
        </button>
        <button
          onClick={() => setActiveTab('logbook')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'logbook' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'logbook' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Skills Logbook & Verifications ({logbookRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'skills' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'skills' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Procedural Skills Catalog
        </button>
        <button
          onClick={() => setActiveTab('sites')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'sites' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'sites' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Hospital Sites ({sites.length})
        </button>
      </div>

      {activeTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="code-pill">PNC BSN Nursing Competency Record</span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px' }}>Muhammad Maaz (STD-2026-0001)</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Bachelor of Science in Nursing (BSN Generic - 4 Years)
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge-pill success">On Track for Graduation</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clinical Hospital Hours</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#60a5fa', marginTop: '4px' }}>480 / 1,200 Hrs</div>
                <div style={{ fontSize: '11px', color: '#34d399', marginTop: '6px' }}>40.0% Required Hours Completed</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Procedural Skills</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>38 / 50 Skills</div>
                <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '6px' }}>76.0% Competency Portfolio Verified</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Active Ward Posting</div>
                <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>Intensive Care Unit (ICU)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Holy Family Teaching Hospital</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rotations' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Clinical Hospital Site</th>
                <th>Assigned Ward / Dept</th>
                <th>Rotation Duration</th>
                <th>Clinical Supervisor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rotations.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.studentName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.studentId} | {r.program}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.site}</td>
                  <td><span className="code-pill">{r.ward}</span></td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{r.dates}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.shift}</div>
                  </td>
                  <td>{r.supervisor}</td>
                  <td>
                    <span className={`badge-pill ${r.status === 'ACTIVE' ? 'success' : 'primary'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'logbook' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Procedural Skill Performed</th>
                <th>Hospital Site & Ward</th>
                <th>Date</th>
                <th>Assessment Score</th>
                <th>Clinical Supervisor Sign-off</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logbookRecords.map((l, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{l.studentName}</td>
                  <td><span style={{ fontWeight: 500 }}>{l.skill}</span></td>
                  <td><span className="code-pill">{l.site}</span></td>
                  <td style={{ fontSize: '12px' }}>{l.date}</td>
                  <td style={{ fontWeight: 600, color: '#34d399' }}>{l.score}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{l.verifier}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.remarks}</div>
                  </td>
                  <td>
                    <span className={`badge-pill ${l.status === 'VERIFIED' ? 'success' : 'warning'}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Nursing Skill Name</th>
                <th>Competency Category</th>
                <th>Required Competency Level</th>
                <th>Authorized Verifier</th>
              </tr>
            </thead>
            <tbody>
              {skillsCatalog.map((s, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><span className="badge-pill primary">{s.category}</span></td>
                  <td><span className="code-pill">{s.requiredLevel}</span></td>
                  <td>{s.verifierDesignation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sites' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {sites.map((st, idx) => (
            <div key={idx} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge-pill primary">{st.type}</span>
                  <span className="code-pill">{st.rotatorsCount} Active Rotators</span>
                </div>
                <h4>{st.name}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {st.address}, {st.city}
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <strong>Affiliated Wards:</strong> {st.activeWards}
                </div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <strong>Contact:</strong> {st.contact}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
