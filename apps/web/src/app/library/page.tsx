'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Users,
  AlertCircle,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Barcode,
  Calendar,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation' | 'overdue'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalTitles: 1420,
    physicalCopies: 4850,
    activeLoans: 312,
    overdueLoans: 14,
  };

  const books = [
    { id: '1', title: 'Fundamentals of Nursing', author: 'Patricia A. Potter', isbn: '978-0323677721', category: 'Nursing Care', totalCopies: 25, available: 18, edition: '10th Ed' },
    { id: '2', title: 'Brunner & Suddarth\'s Medical-Surgical Nursing', author: 'Janice L. Hinkle', isbn: '978-1975124465', category: 'Medical Surgical', totalCopies: 30, available: 8, edition: '15th Ed' },
    { id: '3', title: 'Pharmacology and the Nursing Process', author: 'Linda Lane Lilley', isbn: '978-0323827973', category: 'Pharmacology', totalCopies: 20, available: 15, edition: '10th Ed' },
    { id: '4', title: 'Anatomy & Physiology for Nursing', author: 'Ian Peate', isbn: '978-1119770169', category: 'Anatomy', totalCopies: 15, available: 0, edition: '3rd Ed' },
  ];

  const issues = [
    { id: 'ISS-101', book: 'Fundamentals of Nursing', copyNo: 'FON-004', student: 'Amina Bibi (NUR-2024-001)', issueDate: '2026-08-15', dueDate: '2026-08-29', status: 'ISSUED', daysLeft: 5 },
    { id: 'ISS-102', book: 'Brunner & Suddarth\'s Med-Surg', copyNo: 'BSN-012', student: 'Zubair Khan (BSN-2024-045)', issueDate: '2026-08-01', dueDate: '2026-08-15', status: 'OVERDUE', daysLeft: -9, fine: 'PKR 450' },
    { id: 'ISS-103', book: 'Pharmacology & Nursing Process', copyNo: 'PHR-008', student: 'Hamza Ali (NUR-2025-012)', issueDate: '2026-08-20', dueDate: '2026-09-03', status: 'ISSUED', daysLeft: 10 },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Central Library & Circulation Desk</h2>
          <p>Book title catalog, physical copy tracking with barcodes/accession numbers, loans circulation, and fine calculation.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
            ● Library Module Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Book Catalog Titles" value={`${stats.totalTitles} Titles`} icon={BookOpen} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Physical Volume Copies" value={`${stats.physicalCopies} Copies`} icon={Bookmark} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Active Issued Loans" value={`${stats.activeLoans} Books`} icon={Users} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Overdue Returns" value={`${stats.overdueLoans} Overdue`} icon={AlertCircle} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'catalog', label: 'Book Collection Catalog' },
          { id: 'circulation', label: 'Active Loans Circulation' },
          { id: 'overdue', label: 'Overdue & Fine Recovery' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-primary-gradient)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === tab.id ? 'none' : '1px solid var(--border-color)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Catalog */}
      {activeTab === 'catalog' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Library Books & Physical Volumes</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search title, author, ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                />
              </div>
              <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                + Add Book Title
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author & Edition</th>
                <th>Category</th>
                <th>ISBN Code</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td><strong style={{ color: '#fff' }}>{b.title}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.author} ({b.edition})</td>
                  <td><span className="code-pill">{b.category}</span></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Barcode size={14} color="var(--text-muted)" /> {b.isbn}</div></td>
                  <td>{b.totalCopies} Copies</td>
                  <td><strong style={{ color: b.available === 0 ? '#f43f5e' : '#34d399' }}>{b.available} Copies</strong></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: b.available === 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: b.available === 0 ? '#f43f5e' : '#34d399',
                      }}
                    >
                      {b.available === 0 ? 'ALL ISSUED' : 'AVAILABLE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Circulation */}
      {activeTab === 'circulation' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Circulation Issue & Return Desk</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Track individual physical copy barcodes and student loan tenures.</p>
            </div>
            <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + Issue Book Copy
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Accession #</th>
                <th>Book Title</th>
                <th>Borrower Student</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((iss) => (
                <tr key={iss.id}>
                  <td><span className="code-pill">{iss.id}</span></td>
                  <td><span className="code-pill" style={{ color: '#38bdf8' }}>{iss.copyNo}</span></td>
                  <td><strong style={{ color: '#fff' }}>{iss.book}</strong></td>
                  <td>{iss.student}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{iss.issueDate}</td>
                  <td style={{ color: iss.status === 'OVERDUE' ? '#f43f5e' : '#60a5fa', fontWeight: 600 }}>{iss.dueDate}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: iss.status === 'OVERDUE' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: iss.status === 'OVERDUE' ? '#f43f5e' : '#34d399',
                      }}
                    >
                      {iss.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Return Book</button>
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
