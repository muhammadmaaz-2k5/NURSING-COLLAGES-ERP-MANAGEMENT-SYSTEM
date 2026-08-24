'use client';

import React, { useState } from 'react';
import { Building, Bed, Users, Calendar, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function HospitalPage() {
  const [activeTab, setActiveTab] = useState<'wards' | 'patients' | 'appointments'>('wards');

  const wards = [
    { name: 'Female Surgical Ward', floor: '2nd Floor', totalBeds: 24, occupied: 18, available: 6 },
    { name: 'Medical ICU', floor: '1st Floor', totalBeds: 12, occupied: 10, available: 2 },
    { name: 'Pediatric General Ward', floor: '3rd Floor', totalBeds: 20, occupied: 14, available: 6 },
    { name: 'Gynecology & Obstetrics', floor: '2nd Floor', totalBeds: 18, occupied: 15, available: 3 },
  ];

  const appointments = [
    { patient: 'Zubair Khan', patientNo: 'PAT-0091', doctor: 'Dr. Tariq Mahmood', dept: 'Medicine OPD', time: '10:30 AM', status: 'Scheduled' },
    { patient: 'Salma Begum', patientNo: 'PAT-0092', doctor: 'Dr. Nusrat Parveen', dept: 'Cardiology', time: '11:00 AM', status: 'In Consultation' },
    { patient: 'Hamza Ali', patientNo: 'PAT-0093', doctor: 'Dr. Aftab Hussain', dept: 'Orthopedics', time: '11:45 AM', status: 'Scheduled' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Hospital OPD, IPD, Wards & Bed Occupancy</h2>
        <p>Manage patient electronic health records, daily ward bed occupancy, appointments, and e-prescriptions.</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Inpatient Beds" value="74 Beds" icon={Bed} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Bed Occupancy Rate" value="77%" icon={Building} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
        <StatsCard label="Today OPD Visits" value="142" icon={Users} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Admitted Patients" value="57" icon={Stethoscope} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('wards')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'wards' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'wards' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Wards & Beds Status ({wards.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'appointments' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderBottom: activeTab === 'appointments' ? '2px solid var(--accent-primary)' : 'none',
          }}
        >
          Today Appointments ({appointments.length})
        </button>
      </div>

      {activeTab === 'wards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {wards.map((ward) => (
            <div key={ward.name} className="module-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="module-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <Bed size={22} color="var(--accent-primary)" />
                  </div>
                  <span className="code-pill">{ward.floor}</span>
                </div>
                <h4>{ward.name}</h4>
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Beds:</span>
                    <span style={{ fontWeight: 600 }}>{ward.totalBeds}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Occupied:</span>
                    <span style={{ color: '#f43f5e', fontWeight: 600 }}>{ward.occupied} Beds</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Available:</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>{ward.available} Beds</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>MR Number</th>
                <th>Patient Name</th>
                <th>Consultant Doctor</th>
                <th>Department</th>
                <th>Appointment Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.patientNo}>
                  <td><span className="code-pill">{apt.patientNo}</span></td>
                  <td style={{ fontWeight: 600 }}>{apt.patient}</td>
                  <td>{apt.doctor}</td>
                  <td>{apt.dept}</td>
                  <td style={{ color: '#60a5fa', fontWeight: 600 }}>{apt.time}</td>
                  <td><span className="badge-pill success">{apt.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
