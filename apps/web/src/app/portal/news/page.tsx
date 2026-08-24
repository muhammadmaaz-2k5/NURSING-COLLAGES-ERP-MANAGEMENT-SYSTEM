'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowLeft, Search, User, ChevronRight } from 'lucide-react';

export default function PublicNewsPage() {
  const [search, setSearch] = useState('');

  const articles = [
    {
      id: '1',
      date: 'August 20, 2026',
      title: 'Annual Nursing Convocation 2026: 120 Graduate Nurses Conferred Degrees',
      category: 'Campus Event',
      author: 'Office of Communications',
      excerpt: 'The convocation was presided over by the Provincial Health Minister and Pakistan Nursing Council dignitaries. Outstanding academic and clinical performance awards were conferred.',
      readTime: '3 min read',
    },
    {
      id: '2',
      date: 'August 14, 2026',
      title: 'State-of-the-Art High-Fidelity ICU Clinical Simulation Lab Inaugurated',
      category: 'Infrastructure',
      author: 'Clinical Directorate',
      excerpt: 'Equipped with computerized adult, pediatric, and birthing simulators for immersive hands-on clinical training before hospital ward placements.',
      readTime: '4 min read',
    },
    {
      id: '3',
      date: 'July 28, 2026',
      title: 'Research Paper on Maternal Critical Care Published in International Journal of Nursing',
      category: 'Research & Faculty',
      author: 'Faculty of Clinical Sciences',
      excerpt: 'Our faculty research team collaborated with global health researchers on improving postpartum hemodynamic monitoring protocols in tertiary care units.',
      readTime: '5 min read',
    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/portal" style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginBottom: '12px' }}>
          <ArrowLeft size={14} /> Back to Public Portal
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Newsroom & Press Releases</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Official institutional announcements, academic milestones, and clinical research updates.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {articles.map((art) => (
          <div key={art.id} className="module-card">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
              <span className="code-pill" style={{ color: '#38bdf8' }}>{art.category}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{art.date}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>&bull; {art.readTime}</span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{art.title}</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>{art.excerpt}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>By {art.author}</span>
              <span style={{ color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Read Full Article <ChevronRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
