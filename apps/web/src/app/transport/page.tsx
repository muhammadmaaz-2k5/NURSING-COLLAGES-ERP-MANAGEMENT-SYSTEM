'use client';

import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Users,
  Navigation,
  Clock,
  Plus,
  Phone,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'routes' | 'passes'>('fleet');

  const stats = {
    totalFleet: 6,
    totalRoutes: 4,
    totalCapacity: 192,
    activePasses: 168,
    fleetUtilization: '87.5%',
  };

  const vehicles = [
    { id: '1', regNo: 'ICT-BUS-901', name: 'Campus Coaster 01', type: 'Toyota Coaster (32 Seats)', capacity: 32, occupied: 30, driver: 'Muhammad Rafiq', phone: '+92-300-9988771', route: 'Route 1: Rawalpindi Saddar' },
    { id: '2', regNo: 'ICT-BUS-902', name: 'Campus Coaster 02', type: 'Toyota Coaster (32 Seats)', capacity: 32, occupied: 32, driver: 'Ghulam Rasool', phone: '+92-300-9988772', route: 'Route 2: Islamabad Expressway' },
    { id: '3', regNo: 'ICT-BUS-903', name: 'Campus Coaster 03', type: 'Toyota Coaster (32 Seats)', capacity: 32, occupied: 28, driver: 'Tariq Mehmood', phone: '+92-300-9988773', route: 'Route 3: Kashmir Highway & G-Sectors' },
    { id: '4', regNo: 'ICT-BUS-904', name: 'Campus Bus 04', type: 'Hino Large Bus (50 Seats)', capacity: 50, occupied: 45, driver: 'Altaf Hussain', phone: '+92-300-9988774', route: 'Route 4: I-9 & Satellite Town' },
  ];

  const passes = [
    { id: 'PAS-001', student: 'Amina Bibi', rollNo: 'NUR-2024-001', vehicle: 'ICT-BUS-901', stop: 'Saddar Metro Station', pickup: '07:15 AM', status: 'ACTIVE' },
    { id: 'PAS-002', student: 'Zubair Khan', rollNo: 'BSN-2024-045', vehicle: 'ICT-BUS-902', stop: 'Faizabad Interchange', pickup: '07:25 AM', status: 'ACTIVE' },
    { id: 'PAS-003', student: 'Hamza Ali', rollNo: 'NUR-2025-012', vehicle: 'ICT-BUS-903', stop: 'G-9 Markaz Karachi Company', pickup: '07:35 AM', status: 'ACTIVE' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Transport & Student Shuttle Fleet</h2>
          <p>Fleet vehicle capacity management, route schedules, pickup stops, and passenger bus pass allocations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
            ● Transport Module Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Fleet Vehicles" value={`${stats.totalFleet} Buses`} icon={Bus} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Operating Routes" value={`${stats.totalRoutes} Routes`} icon={Navigation} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Active Student Passes" value={`${stats.activePasses} Passes`} icon={Users} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
        <StatsCard label="Fleet Utilization" value={stats.fleetUtilization} icon={Percent} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'fleet', label: 'Fleet Vehicle Inventory' },
          { id: 'passes', label: 'Active Passenger Bus Passes' },
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

      {/* 1. Fleet */}
      {activeTab === 'fleet' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {vehicles.map((v) => (
            <div key={v.id} className="module-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div className="module-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <Bus size={22} color="var(--accent-primary)" />
                </div>
                <span className="code-pill">{v.regNo}</span>
              </div>

              <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{v.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
                {v.type} &bull; {v.route}
              </span>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Seating Occupancy</span>
                  <span style={{ fontWeight: 700, color: v.occupied >= v.capacity ? '#f43f5e' : '#34d399' }}>
                    {v.occupied} / {v.capacity} Seats
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(v.occupied / v.capacity) * 100}%`,
                      height: '100%',
                      background: v.occupied >= v.capacity ? '#f43f5e' : 'linear-gradient(90deg, #3b82f6, #10b981)',
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Driver: <strong>{v.driver}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#60a5fa' }}><Phone size={12} /> {v.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Bus Passes */}
      {activeTab === 'passes' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Student Bus Pass Registrations</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Capacity-enforced assignment prevents vehicle overcrowding.</p>
            </div>
            <button style={{ background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              + Issue Transport Pass
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Pass ID</th>
                <th>Student Passenger</th>
                <th>Roll #</th>
                <th>Assigned Vehicle</th>
                <th>Designated Stop</th>
                <th>Pickup Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {passes.map((p) => (
                <tr key={p.id}>
                  <td><span className="code-pill">{p.id}</span></td>
                  <td><strong style={{ color: '#fff' }}>{p.student}</strong></td>
                  <td><span className="code-pill">{p.rollNo}</span></td>
                  <td><strong style={{ color: '#60a5fa' }}>{p.vehicle}</strong></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="var(--text-muted)" /> {p.stop}</div></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} color="var(--text-muted)" /> {p.pickup}</div></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                      }}
                    >
                      {p.status}
                    </span>
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
