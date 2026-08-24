'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  FileText,
  User,
  Mail,
  Phone,
  BookOpen,
} from 'lucide-react';

export default function PublicAdmissionApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState('');
  const [formData, setFormData] = useState({
    programId: 'BSN-GEN',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnic: '',
    gender: 'Female',
    previousInstitute: '',
    marksObtained: '',
    totalMarks: '1100',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setAppRef(generatedRef);
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/portal" style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '12px' }}>
          <ArrowLeft size={14} /> Back to Public Portal
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <GraduationCap size={26} color="var(--accent-primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Online Admission Application (Fall 2026)</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Submit your credentials for accredited Generic BSN, Post-RN, LHV, or CNA programs.
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.08))',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            textAlign: 'center',
          }}
        >
          <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>Application Successfully Received</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
            Thank you, <strong>{formData.firstName}</strong>. Your online admission application has been registered with the admissions committee.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Your Application Tracking Reference:</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>{appRef}</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            A confirmation email has been dispatched to <strong>{formData.email}</strong> with entry test details and interview schedule.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link
              href="/portal"
              style={{
                background: 'var(--accent-primary-gradient)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            1. Select Degree / Diploma Program
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target Academic Program *</label>
            <select
              value={formData.programId}
              onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
              required
              style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
            >
              <option value="BSN-GEN">Bachelor of Science in Nursing (Generic BSN - 4 Years)</option>
              <option value="POST-RN">Post-RN BSN Degree Program (2 Years)</option>
              <option value="DIP-LHV">Diploma in Lady Health Visitor (LHV - 2 Years)</option>
              <option value="CNA">Certified Nursing Assistant (CNA - 2 Years)</option>
            </select>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            2. Personal & Contact Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Amina"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Last / Family Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Bibi"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. student@example.com"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Mobile Contact Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +923001234567"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>CNIC / B-Form Number *</label>
              <input
                type="text"
                required
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                placeholder="e.g. 37405-1234567-8"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            3. Prior Academic Qualifications
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Previous College / High School Institute *</label>
            <input
              type="text"
              required
              value={formData.previousInstitute}
              onChange={(e) => setFormData({ ...formData, previousInstitute: e.target.value })}
              placeholder="e.g. Govt Degree College for Women / Army Public School"
              style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Marks Obtained (FSc / Matric) *</label>
              <input
                type="number"
                required
                value={formData.marksObtained}
                onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
                placeholder="e.g. 960"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Total Maximum Marks *</label>
              <input
                type="number"
                required
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                placeholder="e.g. 1100"
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#fff', padding: '10px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'var(--accent-primary-gradient)',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={18} /> Submit Official Admission Application
          </button>
        </form>
      )}
    </div>
  );
}
