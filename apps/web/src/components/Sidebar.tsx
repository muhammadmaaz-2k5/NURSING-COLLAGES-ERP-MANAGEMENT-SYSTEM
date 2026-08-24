'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  Users,
  UserCheck,
  Stethoscope,
  Building,
  CalendarCheck,
  Award,
  CreditCard,
  Pill,
  Hotel,
  BookOpen,
  Bus,
  Briefcase,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Public Portal', href: '/portal', icon: Globe },
    { label: 'SaaS Modules', href: '/modules', icon: Layers },
    { label: 'Academics', href: '/academic', icon: GraduationCap },
    { label: 'Students', href: '/students', icon: Users },
    { label: 'Faculty', href: '/faculty', icon: UserCheck },
    { label: 'Clinical & Skills', href: '/clinical', icon: Stethoscope },
    { label: 'Hospital & OPD', href: '/hospital', icon: Building },
    { label: 'Pharmacy Stock', href: '/pharmacy', icon: Pill },
    { label: 'Hostel & Housing', href: '/hostel', icon: Hotel },
    { label: 'Library Catalog', href: '/library', icon: BookOpen },
    { label: 'Transport Fleet', href: '/transport', icon: Bus },
    { label: 'HR & Payroll', href: '/hr', icon: Briefcase },
    { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
    { label: 'Exams & Results', href: '/exams', icon: Award },
    { label: 'Fees & Finance', href: '/finance', icon: CreditCard },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">P</div>
        <div className="logo-text">
          <h1>PERN ERP</h1>
          <span>Nursing & Medical</span>
        </div>
      </div>

      <nav className="nav-links" style={{ overflowY: 'auto', paddingRight: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '14px 12px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>PNC / HEC Standard</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dedicated College DB</div>
          </div>
        </div>
      </div>
    </aside>
  );
}


