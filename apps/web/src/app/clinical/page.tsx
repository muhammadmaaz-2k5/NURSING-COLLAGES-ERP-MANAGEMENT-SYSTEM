'use client';

import React, { useState } from 'react';
import { Stethoscope, Building, Award, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function ClinicalPage() {
  const [activeTab, setActiveTab] = useState<'rotations' | 'skills'>('rotations');

  const sites = [
    {
      name: 'Holy Family Teaching Hospital',
      type: 'Tertiary Care Hospital',
      city: 'Rawalpindi',
      beds: '850 Beds',
      activeStudents: 120,
    },
    {
      name: 'National Medical Center IPD',
      type: 'Campus Hospital',
      city: 'Islamabad',
      beds: '350 Beds',
      activeStudents: 95,
    },
    {
      name: 'Community Health Outreach Center',
      type: 'Primary Care & Immunization',
      city: 'Islamabad Rural',
      beds: 'OPD / Daycare',
      activeStudents: 45,
    },
  ];

  const nursingSkills = [
    { id: 'SKL-01', name: 'Intravenous (IV) Cannulation & Infusion', category: 'Fundamental Skills', status: 'VERIFIED', score: 95 },
    { id: 'SKL-02', name: 'Nasogastric (NG) Tube Insertion & Care', category: 'Gastrointestinal', status: 'VERIFIED', score: 90 },
    { id: 'SKL-03', name: 'Aseptic Wound Dressing & Suture Removal', category: 'Surgical Nursing', status: 'VERIFIED', score: 98 },
    { id: 'SKL-04', name: 'Blood Transfusion Protocol & Monitoring', category: 'Hematology', status: 'IN_PROGRESS', score: null },
    { id: 'SKL-05', name: 'CPR & Basic Life Support (BLS)', category: 'Emergency Care', status: 'VERIFIED', score: 100 },
    { id: 'SKL-06', name: 'Pediatric Medication Dosage Calculation', category: 'Pediatrics', status: 'NOT_STARTED', score: null },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Nursing Clinical Rotations & Skill Competency Logbook</h2>
        <p>Track student hospital ward postings, supervisor verifications, and procedural competencies.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Partner Clinical Sites" value={sites.length} icon={Building} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
        <StatsCard label="Students in Wards" value="260" icon={Stethoscope} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Standard Nursing Skills" value="45" icon={Award} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Logbook Completion Rate" value="88%" icon={CheckCircle2} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('rotations')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'rotations' ? 'var(--accent-rose)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'rotations' ? '2px solid var(--accent-rose)' : 'none',
          }}
        >
          Clinical Sites & Postings ({sites.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'skills' ? 'var(--accent-rose)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'skills' ? '2px solid var(--accent-rose)' : 'none',
          }}
        >
          Nursing Skill Checklist Logbook ({nursingSkills.length})
        </button>
      </div>

      {activeTab === 'rotations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {sites.map((site) => (
            <div key={site.name} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="module-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                    <Building size={22} color="var(--accent-rose)" />
                  </div>
                  <span className="badge-pill success">Active Site</span>
                </div>
                <h4>{site.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{site.type}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--accent-primary)" /> {site.city}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--accent-emerald)" /> {site.beds} Capacity
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#fda4af' }}>
                    <Stethoscope size={14} /> {site.activeStudents} Trainee Nurses On Duty
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Skill Code</th>
                <th>Nursing Procedure / Competency</th>
                <th>Category</th>
                <th>Verification Status</th>
                <th>Assessment Score</th>
              </tr>
            </thead>
            <tbody>
              {nursingSkills.map((sk) => (
                <tr key={sk.id}>
                  <td><span className="code-pill">{sk.id}</span></td>
                  <td style={{ fontWeight: 600 }}>{sk.name}</td>
                  <td><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sk.category}</span></td>
                  <td>
                    <span className={`badge-pill ${sk.status === 'VERIFIED' ? 'success' : sk.status === 'IN_PROGRESS' ? 'primary' : 'warning'}`}>
                      {sk.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: sk.score ? '#34d399' : 'var(--text-muted)' }}>
                    {sk.score ? `${sk.score} / 100` : 'Pending Sign-Off'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
