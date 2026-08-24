'use client';

import React, { useState } from 'react';
import { Hotel, BookOpen, Bus, Bed, Users, CheckCircle2, Clock } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<'hostel' | 'library' | 'transport'>('hostel');

  const hostels = [
    { name: 'Fatima Jinnah Female Hostel', code: 'HSTL-FEM-01', rooms: 45, beds: 180, occupied: 165, available: 15 },
    { name: 'Iqbal Male Hostel', code: 'HSTL-MALE-01', rooms: 30, beds: 120, occupied: 98, available: 22 },
  ];

  const libraryStats = [
    { title: 'Brunner & Suddarth Textbook of Medical-Surgical Nursing', author: 'Janice L. Hinkle', copies: 25, available: 12, category: 'Clinical Nursing' },
    { title: 'Pharmacology for Nurses: A Pathophysiologic Approach', author: 'Michael Adams', copies: 20, available: 8, category: 'Pharmacology' },
    { title: 'Guyton and Hall Textbook of Medical Physiology', author: 'John E. Hall', copies: 15, available: 4, category: 'Physiology' },
  ];

  const routes = [
    { name: 'Route 1: Rawalpindi Saddar - College Campus', bus: 'Coaster (ISB-9988)', stops: 'Saddar > Chandni Chowk > Faizabad > H-8', studentsAssigned: 42 },
    { name: 'Route 2: Islamabad F-Sector Route', bus: 'Bus (ISB-1122)', stops: 'F-10 > F-8 > G-8 > H-8 Campus', studentsAssigned: 38 },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Campus Facilities & Operations</h2>
        <p>Manage on-campus accommodations, library catalog & lending, and transportation fleet routes.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Hostel Beds Occupancy" value="87%" icon={Hotel} iconBg="rgba(139, 92, 246, 0.15)" iconColor="#a78bfa" />
        <StatsCard label="Cataloged Books" value="12,450" icon={BookOpen} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Transport Routes" value="6 Active" icon={Bus} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Boarding Students" value="263" icon={Users} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('hostel')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'hostel' ? 'var(--accent-purple)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'hostel' ? '2px solid var(--accent-purple)' : 'none',
          }}
        >
          Hostels & Rooms ({hostels.length})
        </button>
        <button
          onClick={() => setActiveTab('library')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'library' ? 'var(--accent-purple)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'library' ? '2px solid var(--accent-purple)' : 'none',
          }}
        >
          Library Catalog ({libraryStats.length})
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'transport' ? 'var(--accent-purple)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'transport' ? '2px solid var(--accent-purple)' : 'none',
          }}
        >
          Transport Fleet & Routes ({routes.length})
        </button>
      </div>

      {activeTab === 'hostel' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {hostels.map((h) => (
            <div key={h.code} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="module-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    <Hotel size={22} color="var(--accent-purple)" />
                  </div>
                  <span className="code-pill">{h.code}</span>
                </div>
                <h4>{h.name}</h4>
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Rooms:</span>
                    <span style={{ fontWeight: 600 }}>{h.rooms} Rooms</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Bed Capacity:</span>
                    <span style={{ fontWeight: 600 }}>{h.beds} Beds</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Occupied:</span>
                    <span style={{ color: '#f43f5e', fontWeight: 600 }}>{h.occupied} Residents</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Available:</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>{h.available} Beds</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'library' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {libraryStats.map((b) => (
                <tr key={b.title}>
                  <td style={{ fontWeight: 600 }}>{b.title}</td>
                  <td>{b.author}</td>
                  <td><span className="code-pill">{b.category}</span></td>
                  <td>{b.copies} Copies</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>{b.available} Available</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transport' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {routes.map((r) => (
            <div key={r.name} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="module-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <Bus size={22} color="var(--accent-emerald)" />
                  </div>
                  <span className="code-pill">{r.bus}</span>
                </div>
                <h4>{r.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <strong>Route Stops:</strong> {r.stops}
                </p>
                <div style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  {r.studentsAssigned} Subscribed Students
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
