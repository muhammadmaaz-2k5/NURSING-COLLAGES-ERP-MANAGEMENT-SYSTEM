'use client';

import React, { useState } from 'react';
import {
  Building2,
  Bed,
  Users,
  DoorOpen,
  ArrowRightLeft,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function HostelPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'allocations' | 'roster'>('overview');

  const stats = {
    totalHostels: 3,
    totalBeds: 240,
    occupiedBeds: 198,
    availableBeds: 42,
    occupancyRate: '82.5%',
  };

  const hostels = [
    { id: '1', name: 'Fatima Jinnah Female Hostel', code: 'HST-F-01', gender: 'Female', rooms: 40, totalBeds: 120, occupied: 104, available: 16 },
    { id: '2', name: 'Iqbal Male Student Hostel', code: 'HST-M-01', gender: 'Male', rooms: 30, totalBeds: 90, occupied: 76, available: 14 },
    { id: '3', name: 'Postgraduate Resident Doctors Block', code: 'HST-PG-01', gender: 'Mixed', rooms: 15, totalBeds: 30, occupied: 18, available: 12 },
  ];

  const allocations = [
    { id: 'AL-101', student: 'Amina Bibi', rollNo: 'NUR-2024-001', hostel: 'Fatima Jinnah Female Hostel', room: 'R-204 (Double)', bed: 'BED-204-1', startDate: '2026-02-01', status: 'ACTIVE' },
    { id: 'AL-102', student: 'Zainab Tariq', rollNo: 'NUR-2024-002', hostel: 'Fatima Jinnah Female Hostel', room: 'R-204 (Double)', bed: 'BED-204-2', startDate: '2026-02-01', status: 'ACTIVE' },
    { id: 'AL-103', student: 'Bilal Ahmed', rollNo: 'BSN-2025-014', hostel: 'Iqbal Male Student Hostel', room: 'R-102 (Triple)', bed: 'BED-102-1', startDate: '2026-03-10', status: 'ACTIVE' },
    { id: 'AL-104', student: 'Usman Farooq', rollNo: 'BSN-2025-018', hostel: 'Iqbal Male Student Hostel', room: 'R-102 (Triple)', bed: 'BED-102-2', startDate: '2026-03-10', status: 'ACTIVE' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Hostel & Residential Accommodation</h2>
          <p>Student hostel buildings, room inventory, single-occupancy bed allocation engine, and checkout clearance.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
            ● Hostel Module Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Hostel Buildings" value={`${stats.totalHostels} Blocks`} icon={Building2} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Total Accommodation Beds" value={`${stats.totalBeds} Beds`} icon={Bed} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Active Resident Students" value={`${stats.occupiedBeds} Residents`} icon={Users} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Campus Occupancy Rate" value={stats.occupancyRate} icon={Percent} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Hostel Occupancy Overview' },
          { id: 'buildings', label: 'Buildings & Room Inventory' },
          { id: 'allocations', label: 'Active Bed Allocation Roster' },
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

      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {hostels.map((h) => (
            <div key={h.id} className="module-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div className="module-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <Building2 size={22} color="var(--accent-primary)" />
                </div>
                <span className="code-pill">{h.code}</span>
              </div>

              <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{h.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>
                Designated: <strong>{h.gender} Students</strong>
              </span>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Occupancy Status</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>{h.available} Vacant Beds</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(h.occupied / h.totalBeds) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Rooms: <strong>{h.rooms}</strong></span>
                <span>Beds: <strong>{h.totalBeds}</strong></span>
                <span>Occupied: <strong style={{ color: '#fbbf24' }}>{h.occupied}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Allocations */}
      {activeTab === 'allocations' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Student Bed Allocations</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Protected single-occupancy invariant ensures zero duplicate allotments.</p>
            </div>
            <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + Allocate Bed to Student
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Allocation ID</th>
                <th>Student Resident</th>
                <th>Roll Number</th>
                <th>Hostel Building</th>
                <th>Room & Bed Details</th>
                <th>Allotted Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => (
                <tr key={a.id}>
                  <td><span className="code-pill">{a.id}</span></td>
                  <td><strong style={{ color: '#fff' }}>{a.student}</strong></td>
                  <td><span className="code-pill">{a.rollNo}</span></td>
                  <td>{a.hostel}</td>
                  <td>
                    <span style={{ color: '#60a5fa', fontWeight: 600 }}>{a.room}</span> &rarr; {a.bed}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{a.startDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Transfer</button>
                      <button style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Checkout</button>
                    </div>
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
