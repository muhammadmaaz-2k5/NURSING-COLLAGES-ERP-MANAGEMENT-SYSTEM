'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  Building,
  Users,
  Calendar,
  FileCheck,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export default function PublicPortalHomePage() {
  const stats = [
    { label: 'Active Students', value: '450+', icon: Users, color: '#60a5fa' },
    { label: 'Clinical Faculty', value: '38 Specialists', icon: Stethoscope, color: '#34d399' },
    { label: 'Teaching Hospital Beds', value: '250 Beds', icon: Building, color: '#fbbf24' },
    { label: 'PNC Licensure Pass Rate', value: '98.4%', icon: Award, color: '#f43f5e' },
  ];

  const programs = [
    {
      code: 'BSN-GEN',
      title: 'Bachelor of Science in Nursing (Generic)',
      duration: '4 Years (8 Semesters)',
      eligibility: 'FSc Pre-Medical (Minimum 50% Marks)',
      description: 'Accredited professional degree covering intensive clinical rotations, critical care simulation, community health, and evidence-based practice.',
    },
    {
      code: 'POST-RN',
      title: 'Post-RN BSN Degree Program',
      duration: '2 Years (4 Semesters)',
      eligibility: 'Diploma in General Nursing + 1 Year Midwifery/Specialization',
      description: 'Advanced degree for registered nursing practitioners aiming for supervisory, leadership, and instructional roles.',
    },
    {
      code: 'DIP-LHV',
      title: 'Diploma in Lady Health Visitor (LHV)',
      duration: '2 Years',
      eligibility: 'Matriculation with Science (45% Minimum)',
      description: 'Primary maternal, neonatal, and child health care diploma program focused on rural and urban community clinical units.',
    },
    {
      code: 'CNA',
      title: 'Certified Nursing Assistant (CNA)',
      duration: '2 Years',
      eligibility: 'Matriculation (Arts or Science with 45%)',
      description: 'Foundational bedside care, vital signs monitoring, patient hygiene, and auxiliary clinical assistance training.',
    },
  ];

  const latestNews = [
    {
      date: 'Aug 20, 2026',
      title: 'Annual Nursing Convocation 2026: 120 Graduate Nurses Conferred Degrees',
      excerpt: 'The convocation was presided over by the Provincial Health Minister and Pakistan Nursing Council dignitaries.',
    },
    {
      date: 'Aug 14, 2026',
      title: 'State-of-the-Art High-Fidelity ICU Clinical Simulation Lab Inaugurated',
      excerpt: 'Equipped with computerized adult, pediatric, and birthing simulators for immersive hands-on clinical training.',
    },
  ];

  const notices = [
    { date: 'Aug 24, 2026', title: 'Fall 2026 Admissions Open: Apply Online before September 15, 2026' },
    { date: 'Aug 18, 2026', title: 'Final Semester Comprehensive & OSCE Examination Date-Sheet Published' },
    { date: 'Aug 10, 2026', title: 'Clinical Hospital Rotation Schedule for 3rd & 4th Year BSN Students' },
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.08))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 32px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className="code-pill" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontWeight: 700 }}>
            PNC Recognized
          </span>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
            HEC & NEB Affiliated
          </span>
          <span className="code-pill" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: 700 }}>
            Teaching Hospital Attached
          </span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2, color: '#fff' }}>
          Excellence in Clinical Nursing & Health Sciences Education
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.6, marginBottom: '24px' }}>
          Empowering the next generation of healthcare professionals with high-fidelity simulation training, 250-bed attached hospital clinical rotations, and evidence-based medical curriculum.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            href="/portal/apply"
            style={{
              background: 'var(--accent-primary-gradient)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            }}
          >
            <Sparkles size={16} /> Apply Online for Fall 2026
          </Link>
          <Link
            href="/portal/verify"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FileCheck size={16} color="#34d399" /> Verify Certificates & Transcripts
          </Link>
          <Link
            href="/portal/notices"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Calendar size={16} color="#fbbf24" /> Public Notices
          </Link>
        </div>
      </div>

      {/* Key Institutional Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="module-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '12px', border: `1px solid ${s.color}40` }}>
                <Icon size={24} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic Offerings Showcase */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Degree & Diploma Academic Offerings</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Approved by Pakistan Nursing & Midwifery Council (PNMC) and Higher Education Commission</p>
          </div>
          <Link href="/portal/apply" style={{ color: '#60a5fa', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            Explore All <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {programs.map((p) => (
            <div key={p.code} className="module-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="code-pill" style={{ color: '#38bdf8' }}>{p.code}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.duration}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{p.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>{p.description}</p>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <strong>Eligibility:</strong> {p.eligibility}
                </div>
              </div>
              <Link
                href="/portal/apply"
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                Apply for {p.code} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* News & Public Notice Board Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Latest News */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Latest College News</h3>
            <Link href="/portal/news" style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>View Newsroom</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {latestNews.map((n, idx) => (
              <div key={idx} style={{ borderBottom: idx < latestNews.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>{n.date}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0 6px 0', color: '#fff' }}>{n.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Notice Board */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Public Notice Board & Circulars</h3>
            <Link href="/portal/notices" style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>All Notices</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notices.map((not, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>{not.date}</span>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', color: '#fff' }}>{not.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
