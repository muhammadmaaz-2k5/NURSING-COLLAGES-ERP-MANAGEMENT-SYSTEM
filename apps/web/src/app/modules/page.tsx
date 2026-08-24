'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  UserPlus,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  CreditCard,
  Stethoscope,
  Building,
  Pill,
  FlaskConical,
  Hotel,
  BookOpen,
  Bus,
  UserCheck,
  Banknote,
  Boxes,
  ShoppingCart,
  MessageSquare,
  Globe,
  Bell,
  FileText,
  BadgeCheck,
  CheckCircle,
  Sliders,
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  icon: any;
  color: string;
}

const INITIAL_MODULES: ModuleItem[] = [
  {
    id: 'ACADEMIC',
    name: 'Academic Management',
    category: 'Core Education',
    description: 'Manage campuses, departments, programs, semester schedules, and timetables.',
    enabled: true,
    icon: GraduationCap,
    color: '#3b82f6',
  },
  {
    id: 'STUDENTS',
    name: 'Student Portal & Records',
    category: 'Core Education',
    description: 'Comprehensive student profile, enrollments, parents linking, and documents.',
    enabled: true,
    icon: Users,
    color: '#3b82f6',
  },
  {
    id: 'ADMISSIONS',
    name: 'Admissions & Inquiries',
    category: 'Core Education',
    description: 'Online application processing, document verification, and merit lists.',
    enabled: true,
    icon: UserPlus,
    color: '#3b82f6',
  },
  {
    id: 'FACULTY',
    name: 'Faculty & Teachers',
    category: 'Core Education',
    description: 'Faculty assignments, class allocation, workload, and performance.',
    enabled: true,
    icon: UserCheck,
    color: '#3b82f6',
  },
  {
    id: 'ATTENDANCE',
    name: 'Attendance Tracking',
    category: 'Academics',
    description: 'Biometric, QR code, and manual attendance for students and staff.',
    enabled: true,
    icon: CalendarCheck,
    color: '#10b981',
  },
  {
    id: 'EXAMINATIONS',
    name: 'Exams & Assessment',
    category: 'Academics',
    description: 'Exam scheduling, date sheets, seat allocations, and marks entry.',
    enabled: true,
    icon: FileSpreadsheet,
    color: '#10b981',
  },
  {
    id: 'RESULTS',
    name: 'Grades & Results',
    category: 'Academics',
    description: 'GPA/CGPA computation, transcript generation, and report cards.',
    enabled: true,
    icon: Award,
    color: '#10b981',
  },
  {
    id: 'FEES',
    name: 'Fees & Invoicing',
    category: 'Finance',
    description: 'Challan generation, online payment gateways, vouchers, and reconciliations.',
    enabled: true,
    icon: CreditCard,
    color: '#f59e0b',
  },
  {
    id: 'CLINICAL_TRAINING',
    name: 'Clinical Training Log',
    category: 'Medical / Healthcare',
    description: 'Track external clinical site rotations, ward duties, and nursing logbooks.',
    enabled: true,
    icon: Stethoscope,
    color: '#f43f5e',
  },
  {
    id: 'HOSPITAL',
    name: 'Hospital Management',
    category: 'Medical / Healthcare',
    description: 'OPD, IPD, doctor schedules, patient admissions, wards, and beds.',
    enabled: true,
    icon: Building,
    color: '#f43f5e',
  },
  {
    id: 'PHARMACY',
    name: 'Pharmacy & Dispensing',
    category: 'Medical / Healthcare',
    description: 'Medicine stocks, reorder thresholds, batch tracking, and e-prescriptions.',
    enabled: true,
    icon: Pill,
    color: '#f43f5e',
  },
  {
    id: 'LABORATORY',
    name: 'Diagnostic Laboratory',
    category: 'Medical / Healthcare',
    description: 'Test catalog, sample barcoding, test results, and reference ranges.',
    enabled: true,
    icon: FlaskConical,
    color: '#f43f5e',
  },
  {
    id: 'HOSTEL',
    name: 'Hostel & Accommodations',
    category: 'Facilities',
    description: 'Hostel buildings, rooms, bed allocations, and mess management.',
    enabled: true,
    icon: Hotel,
    color: '#8b5cf6',
  },
  {
    id: 'LIBRARY',
    name: 'Library Management',
    category: 'Facilities',
    description: 'Cataloging, ISBN search, book issuance, return tracking, and fines.',
    enabled: true,
    icon: BookOpen,
    color: '#8b5cf6',
  },
  {
    id: 'TRANSPORT',
    name: 'Transport & Fleet',
    category: 'Facilities',
    description: 'Routes, bus stops, vehicle assignments, and driver management.',
    enabled: false,
    icon: Bus,
    color: '#8b5cf6',
  },
  {
    id: 'HR',
    name: 'HR & Staff Directory',
    category: 'Administration',
    description: 'Employee profiles, designations, contracts, leaves, and attendance.',
    enabled: true,
    icon: UserCheck,
    color: '#06b6d4',
  },
  {
    id: 'PAYROLL',
    name: 'Payroll & Salaries',
    category: 'Administration',
    description: 'Salary structures, monthly payslips, allowances, and tax deductions.',
    enabled: true,
    icon: Banknote,
    color: '#06b6d4',
  },
  {
    id: 'INVENTORY',
    name: 'Inventory & Assets',
    category: 'Logistics',
    description: 'Asset tracking, departmental stock, SKU management, and audits.',
    enabled: true,
    icon: Boxes,
    color: '#ec4899',
  },
  {
    id: 'PROCUREMENT',
    name: 'Procurement & POs',
    category: 'Logistics',
    description: 'Vendor management, purchase orders, quotes, and approvals.',
    enabled: true,
    icon: ShoppingCart,
    color: '#ec4899',
  },
  {
    id: 'WEBSITE',
    name: 'Public Website CMS',
    category: 'Digital',
    description: 'Dynamic college landing pages, admissions forms, and announcements.',
    enabled: true,
    icon: Globe,
    color: '#3b82f6',
  },
  {
    id: 'CERTIFICATES',
    name: 'Certificates & Verifications',
    category: 'Digital',
    description: 'Character certificates, bonafide letters, and QR-verifiable degrees.',
    enabled: true,
    icon: BadgeCheck,
    color: '#3b82f6',
  },
];

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleItem[]>(INITIAL_MODULES);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Core Education', 'Academics', 'Medical / Healthcare', 'Facilities', 'Finance', 'Administration', 'Logistics', 'Digital'];

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const filteredModules = activeCategory === 'ALL'
    ? modules
    : modules.filter((m) => m.category === activeCategory);

  const activeCount = modules.filter((m) => m.enabled).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>SaaS Dynamic Module Switcher</h2>
          <p>
            Configure college features on-demand. Database tables & NestJS guards dynamically activate per tenant.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <CheckCircle size={18} color="var(--accent-emerald)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>
            {activeCount} of {modules.length} Modules Active
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--accent-primary)' : 'var(--border-color)',
              background: activeCategory === cat ? 'var(--accent-primary-gradient)' : 'var(--bg-card)',
              color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Modules */}
      <div className="modules-grid">
        {filteredModules.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="module-card">
              <div>
                <div className="module-top">
                  <div
                    className="module-icon"
                    style={{
                      background: `${item.color}20`,
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    <Icon size={22} color={item.color} />
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleModule(item.id)}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <span className="code-pill">{item.id}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: item.enabled ? '#34d399' : 'var(--text-muted)',
                  }}
                >
                  {item.enabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
