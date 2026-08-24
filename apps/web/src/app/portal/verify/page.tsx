'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  Award,
  ArrowLeft,
  Building,
  Calendar,
  Lock,
} from 'lucide-react';

export default function CertificateVerificationPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate instant verification check with structured data
    setTimeout(() => {
      setLoading(false);
      if (query.trim().toUpperCase().includes('FAIL') || query.trim().toUpperCase().includes('INVALID')) {
        setError('No authentic academic certificate or transcript was found matching the entered serial code. Please confirm the number or contact the Controller of Examinations.');
      } else {
        setResult({
          valid: true,
          status: 'OFFICIALLY_VERIFIED_AUTHENTIC',
          certificateNo: query.trim().toUpperCase().startsWith('CERT') ? query.trim().toUpperCase() : `CERT-2026-${query.trim().toUpperCase()}`,
          studentName: 'Amina Bibi',
          fatherName: 'Muhammad Sharif',
          rollNo: 'NUR-2022-0041',
          program: 'Bachelor of Science in Nursing (Generic)',
          degreeLevel: 'UNDERGRADUATE_4_YEAR',
          division: 'First Division with Distinction (CGPA 3.84 / 4.00)',
          conferralDate: '2026-08-20',
          issuingBody: 'Directorate of Examinations & Academic Accreditation',
          verificationHash: 'A89F-442B-E910-77C1',
          tamperEvidence: 'Cryptographic SHA-256 Signature Matches Database Ledger',
        });
      }
    }, 600);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/portal" style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '12px' }}>
          <ArrowLeft size={14} /> Back to Public Portal
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <FileCheck size={26} color="#34d399" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Public Document & Certificate Verification</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Online verification gateway for degrees, diplomas, and official academic transcripts issued by the institution.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Form */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleVerify}>
          <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px', color: '#fff' }}>
            Enter Certificate Serial Number or Scan QR Code Payload:
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CERT-2026-BSN-089 or Roll No NUR-2022-0041"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--accent-primary-gradient)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Validating Hash...' : 'Verify Authenticity'}
            </button>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Tip: Try any serial code like <strong>CERT-2026-BSN-089</strong> or roll number to test verification.
          </span>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start', color: '#f43f5e' }}>
          <XCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Verification Unsuccessful</h4>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.8)' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Verified Certificate Certificate Modal/Card */}
      {result && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.05))',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={28} color="#34d399" />
              <div>
                <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                  ● OFFICIAL VERIFIED DOCUMENT
                </span>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Verification Hash: <code>{result.verificationHash}</code>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="code-pill" style={{ color: '#38bdf8' }}>{result.certificateNo}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', fontSize: '13px', marginBottom: '20px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Student Graduate Name:</span>
              <strong style={{ color: '#fff', fontSize: '15px' }}>{result.studentName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Father Name:</span>
              <strong style={{ color: '#fff', fontSize: '15px' }}>{result.fatherName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Institutional Roll #:</span>
              <strong style={{ color: '#60a5fa' }}>{result.rollNo}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Degree Program:</span>
              <strong style={{ color: '#34d399' }}>{result.program}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Graduation Standing:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{result.division}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Conferral Date:</span>
              <span style={{ color: '#fff' }}>{result.conferralDate}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
              <Lock size={14} />
              <span>{result.tamperEvidence}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{result.issuingBody}</span>
          </div>
        </div>
      )}
    </div>
  );
}
