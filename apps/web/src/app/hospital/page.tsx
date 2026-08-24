'use client';

import React, { useState } from 'react';
import {
  Building,
  Bed,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Activity,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Pill,
  Search,
} from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';

export default function HospitalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'opd' | 'ipd' | 'prescriptions'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = {
    totalBeds: 84,
    occupiedBeds: 62,
    availableBeds: 22,
    occupancyRate: '73.8%',
    activeDoctors: 28,
    todayOpdVisits: 146,
    currentInpatients: 62,
  };

  const wards = [
    { name: 'Female Surgical Ward', type: 'SURGERY', floor: '2nd Floor', totalBeds: 24, occupied: 18, available: 6 },
    { name: 'Medical Intensive Care Unit (ICU)', type: 'ICU', floor: '1st Floor', totalBeds: 12, occupied: 10, available: 2 },
    { name: 'Pediatric General Care', type: 'PEDIATRICS', floor: '3rd Floor', totalBeds: 20, occupied: 14, available: 6 },
    { name: 'Gynecology & Maternity Ward', type: 'GYNECOLOGY', floor: '2nd Floor', totalBeds: 18, occupied: 14, available: 4 },
    { name: 'Cardiology HDU & CCU', type: 'MEDICINE', floor: '1st Floor', totalBeds: 10, occupied: 6, available: 4 },
  ];

  const patients = [
    { id: '1', mrn: 'MRN-2026-00101', name: 'Zubair Khan', age: 45, gender: 'Male', phone: '+92-300-1122334', bloodGroup: 'B+', status: 'ADMITTED', ward: 'Cardiology HDU (Bed 302)' },
    { id: '2', mrn: 'MRN-2026-00102', name: 'Salma Begum', age: 52, gender: 'Female', phone: '+92-333-5566778', bloodGroup: 'O+', status: 'OPD_VISIT', ward: 'Outpatient' },
    { id: '3', mrn: 'MRN-2026-00103', name: 'Hamza Ali', age: 29, gender: 'Male', phone: '+92-321-9988776', bloodGroup: 'A+', status: 'ADMITTED', ward: 'Female Surgical (Bed 208)' },
    { id: '4', mrn: 'MRN-2026-00104', name: 'Amina Bibi', age: 34, gender: 'Female', phone: '+92-345-4433221', bloodGroup: 'AB+', status: 'DISCHARGED', ward: 'Discharged' },
  ];

  const appointments = [
    { id: 'APP-101', token: 1, patient: 'Salma Begum', mrn: 'MRN-2026-00102', doctor: 'Dr. Sarah Tariq', dept: 'Cardiology OPD', time: '10:00 AM', status: 'IN_CONSULTATION' },
    { id: 'APP-102', token: 2, patient: 'Kashif Mehmood', mrn: 'MRN-2026-00105', doctor: 'Dr. Tariq Mahmood', dept: 'General Medicine', time: '10:30 AM', status: 'SCHEDULED' },
    { id: 'APP-103', token: 3, patient: 'Noreen Akhtar', mrn: 'MRN-2026-00106', doctor: 'Dr. Nusrat Parveen', dept: 'Gynecology', time: '11:00 AM', status: 'SCHEDULED' },
  ];

  const prescriptions = [
    { id: 'RX-2026-0091', patient: 'Zubair Khan', doctor: 'Dr. Sarah Tariq', date: '2026-08-24', diagnosis: 'Hypertension & Angina', medicines: ['Amlodipine 5mg OD', 'Aspirin 75mg OD', 'Atorvastatin 20mg HS'] },
    { id: 'RX-2026-0092', patient: 'Salma Begum', doctor: 'Dr. Nusrat Parveen', date: '2026-08-24', diagnosis: 'Acute Pharyngitis', medicines: ['Augmentin 625mg BD', 'Panadol 500mg TDS', 'Loratadine 10mg OD'] },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Hospital Operations & Clinical Care</h2>
          <p>Teaching hospital OPD clinics, IPD inpatient ward occupancy, doctor rosters, e-prescriptions, and lab investigation workflows.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
            ● Hospital Module Active
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Inpatient Beds" value={`${metrics.totalBeds} Beds`} icon={Bed} iconBg="rgba(59, 130, 246, 0.15)" iconColor="#60a5fa" />
        <StatsCard label="Occupancy Rate" value={metrics.occupancyRate} icon={Activity} iconBg="rgba(244, 63, 94, 0.15)" iconColor="#f43f5e" />
        <StatsCard label="Today OPD Visits" value={`${metrics.todayOpdVisits} Patients`} icon={Users} iconBg="rgba(16, 185, 129, 0.15)" iconColor="#34d399" />
        <StatsCard label="Active Inpatients" value={`${metrics.currentInpatients} Admitted`} icon={Stethoscope} iconBg="rgba(245, 158, 11, 0.15)" iconColor="#fbbf24" />
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Ward & Bed Occupancy' },
          { id: 'patients', label: 'Patient Medical Registry' },
          { id: 'opd', label: 'OPD Appointments & Queue' },
          { id: 'ipd', label: 'IPD Inpatient Admissions' },
          { id: 'prescriptions', label: 'E-Prescriptions & Rx' },
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

      {/* 1. Ward & Bed Occupancy */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {wards.map((ward) => (
            <div key={ward.name} className="module-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div className="module-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <Bed size={22} color="var(--accent-primary)" />
                </div>
                <span className="code-pill">{ward.floor}</span>
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>{ward.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>
                Department: {ward.type}
              </span>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Bed Availability</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>{ward.available} Available</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(ward.occupied / ward.totalBeds) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #3b82f6, #f43f5e)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Total: <strong>{ward.totalBeds}</strong></span>
                <span>Occupied: <strong style={{ color: '#f43f5e' }}>{ward.occupied}</strong></span>
                <span>Rate: <strong>{Math.round((ward.occupied / ward.totalBeds) * 100)}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Patient Medical Registry */}
      {activeTab === 'patients' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Registered Patients (Electronic Health Records)</h3>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search MRN, Name, Phone..."
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
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>MRN Number</th>
                <th>Patient Name</th>
                <th>Demographics</th>
                <th>Blood Group</th>
                <th>Phone Contact</th>
                <th>Care Status</th>
                <th>Current Location</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td><span className="code-pill">{p.mrn}</span></td>
                  <td><strong style={{ color: '#fff' }}>{p.name}</strong></td>
                  <td>{p.age} Yrs / {p.gender}</td>
                  <td><span style={{ color: '#f43f5e', fontWeight: 600 }}>{p.bloodGroup}</span></td>
                  <td>{p.phone}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: p.status === 'ADMITTED' ? 'rgba(245, 158, 11, 0.15)' : p.status === 'OPD_VISIT' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: p.status === 'ADMITTED' ? '#fbbf24' : p.status === 'OPD_VISIT' ? '#60a5fa' : '#34d399',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.ward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. OPD Appointments */}
      {activeTab === 'opd' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Today OPD Consultation Queue</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sequential patient token stream and doctor assignments</p>
            </div>
            <button
              style={{
                background: 'var(--accent-primary-gradient)',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              + Book New OPD Appointment
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Patient Details</th>
                <th>Assigned Doctor</th>
                <th>Department</th>
                <th>Schedule</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td><span className="code-pill" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontWeight: 700 }}>Token #{a.token}</span></td>
                  <td>
                    <div>
                      <strong style={{ color: '#fff' }}>{a.patient}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.mrn}</div>
                    </div>
                  </td>
                  <td>{a.doctor}</td>
                  <td>{a.dept}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="var(--text-muted)" /> {a.time}</div></td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: a.status === 'IN_CONSULTATION' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: a.status === 'IN_CONSULTATION' ? '#34d399' : '#60a5fa',
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. IPD Inpatient Admissions */}
      {activeTab === 'ipd' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Inpatient (IPD) Admission Management</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Bed allocation engine protected with strict interactive transaction locks ensuring zero double-occupancy.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="code-pill">BED-SURG-208</span>
                <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 600 }}>Occupied</span>
              </div>
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Hamza Ali (MRN-2026-00103)</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admitted: 2026-08-23 (Acute Appendicitis)</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Transfer Bed</button>
                <button style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Discharge</button>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="code-pill">BED-ICU-102</span>
                <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 600 }}>Occupied</span>
              </div>
              <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Zubair Khan (MRN-2026-00101)</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admitted: 2026-08-24 (Post-Angiography Care)</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Transfer Bed</button>
                <button style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Discharge</button>
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="code-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>BED-ICU-103</span>
                <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 600 }}>Available</span>
              </div>
              <h4 style={{ fontSize: '14px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Empty ICU Bed</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ready for admission</p>
              <div style={{ marginTop: '12px' }}>
                <button style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--accent-primary-gradient)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>+ Admit Patient Here</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {prescriptions.map((rx) => (
            <div key={rx.id} className="module-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="code-pill" style={{ color: '#38bdf8' }}>{rx.id}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rx.date}</span>
              </div>
              <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{rx.patient}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                Prescribed by: {rx.doctor}
              </span>
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '13px' }}>
                <strong>Diagnosis:</strong> {rx.diagnosis}
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Medications:</span>
                <ul style={{ paddingLeft: '16px', fontSize: '13px', lineHeight: 1.6 }}>
                  {rx.medicines.map((m, idx) => (
                    <li key={idx} style={{ color: '#fff' }}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
