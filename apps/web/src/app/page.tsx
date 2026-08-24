'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  GraduationCap,
  Users,
  Building2,
  Stethoscope,
  Database,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Shield,
  FileCode2,
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { fetchHealth } from '../lib/api';

export default function DashboardPage() {
  const [health, setHealth] = useState<{ status: string; database: { status: string; collegesRegistered: number } }>({
    status: 'connected',
    database: { status: 'ready', collegesRegistered: 1 },
  });

  useEffect(() => {
    fetchHealth().then((res) => {
      if (res) setHealth(res);
    });
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Multi-College ERP & SaaS Monolith</h2>
          <p>Full-stack Architecture powered by NestJS API + Next.js App Router + Prisma ORM</p>
        </div>
        <Link
          href="/modules"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-primary-gradient)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          }}
        >
          <Sliders size={16} />
          <span>Configure College Modules</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <StatsCard
          label="Registered Tenants"
          value={health.database.collegesRegistered || 1}
          icon={Building2}
          iconBg="rgba(59, 130, 246, 0.15)"
          iconColor="#60a5fa"
        />
        <StatsCard
          label="Prisma Models"
          value="45+ Models"
          icon={Database}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#34d399"
        />
        <StatsCard
          label="Configurable Modules"
          value="25 Modules"
          icon={Layers}
          iconBg="rgba(245, 158, 11, 0.15)"
          iconColor="#fbbf24"
        />
        <StatsCard
          label="RBAC & Multi-Tenancy"
          value="Active"
          icon={Shield}
          iconBg="rgba(139, 92, 246, 0.15)"
          iconColor="#a78bfa"
        />
      </div>

      {/* Monolith Architecture Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FileCode2 size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Monolith Structure</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
            Both the backend API and frontend portal coexist in a unified workspace repository sharing Prisma types, TypeScript models, and environment definitions:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span><strong>apps/api</strong>: NestJS REST API with Swagger docs at <code>/api/docs</code></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span><strong>apps/web</strong>: Next.js frontend with App Router & dynamic layouts</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span><strong>prisma/schema.prisma</strong>: Enterprise schema for Multi-College ERP</span>
            </li>
          </ul>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Stethoscope size={20} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Medical & Clinical Ready</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
            Specifically tailored for healthcare, nursing, and general colleges with specialized clinical and hospital management modules:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Clinical Training', 'Hospital Wards & Beds', 'Nursing Skills Log', 'Doctors & Patients', 'Pharmacy & Medicines', 'Lab Tests'].map((item) => (
              <span key={item} className="code-pill" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#fda4af' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Schema Highlights Table */}
      <div className="page-header" style={{ marginBottom: '12px' }}>
        <h3>Prisma Schema Subsystem Highlights</h3>
      </div>
      <div className="table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Subsystem</th>
              <th>Key Prisma Models</th>
              <th>Purpose & Capabilities</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: '#60a5fa' }}>Tenant & RBAC</td>
              <td><code>College, CollegeSettings, User, Role, Permission</code></td>
              <td>Multi-tenant data isolation, configurable timezone/currency, custom role permissions</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#34d399' }}>Dynamic Modules</td>
              <td><code>CollegeModule (ModuleType enum)</code></td>
              <td>On-demand toggle of modules (Hostel, Transport, Hospital, HR, etc.) per college</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#fbbf24' }}>Academic & Classes</td>
              <td><code>Campus, Department, Program, Semester, Subject, ClassSection, Timetable</code></td>
              <td>Curriculum management, class schedule, semester subjects, multi-campus support</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#a78bfa' }}>Admissions & Students</td>
              <td><code>AdmissionApplication, Student, Parent, StudentEnrollment, Attendance</code></td>
              <td>Online application portal, student bio/records, parent link, biometric attendance</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#f43f5e' }}>Healthcare & Hospital</td>
              <td><code>ClinicalSite, ClinicalTraining, NursingSkill, Hospital, Patient, Doctor, Pharmacy</code></td>
              <td>Clinical rotation tracker, skills verification, hospital OPD/IPD, beds & prescriptions</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#38bdf8' }}>Finance & Operations</td>
              <td><code>FeeStructure, Payment, Hostel, Library, Vehicle, Employee, Payroll, Inventory</code></td>
              <td>Fee generation, payments, room allocation, book catalog, HR leaves, payroll & stock</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
