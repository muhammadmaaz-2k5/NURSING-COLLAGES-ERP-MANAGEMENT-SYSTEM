'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Users,
  Shield,
  Layers,
  Building,
  Sliders,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { fetchSettingsOverview } from '../../features/settings/services/settings.api';
import { SettingsOverviewData } from '../../features/settings/types/settings.types';

export default function SettingsPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<SettingsOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSettingsOverview();
        setOverview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const sections = [
    {
      title: 'Users & Accounts',
      description: 'Manage institutional accounts, password resets, active login sessions, and status locks.',
      icon: Users,
      href: '/settings/users',
      badge: `${overview?.totalUsers || 148} Accounts`,
    },
    {
      title: 'Roles & RBAC Permissions',
      description: 'Define custom access roles and granular View/Create/Update/Delete module matrices.',
      icon: Shield,
      href: '/settings/roles',
      badge: `${overview?.totalRoles || 8} Active Roles`,
    },
    {
      title: 'SaaS Module Management',
      description: 'System-wide feature gating for 24 functional modules with real-time runtime toggles.',
      icon: Layers,
      href: '/settings/modules',
      badge: `${overview?.enabledModulesCount || 22} / 24 Active`,
    },
    {
      title: 'Institution & PNC Profile',
      description: 'College branding, PNC registration numbers, affiliation details, and campus addresses.',
      icon: Building,
      href: '/settings/institution',
      badge: 'Verified Accreditation',
    },
    {
      title: 'System Rules & Thresholds',
      description: 'Attendance exam eligibility thresholds (75%), GPA passing rules, and fee fine policies.',
      icon: Sliders,
      href: '/settings/system',
      badge: 'Operational Engine',
    },
    {
      title: 'Security Audit Logs',
      description: 'Immutable compliance audit trail tracking all create, update, approve, and reversal events.',
      icon: FileText,
      href: '/settings/audit-logs',
      badge: `${overview?.auditLogsTodayCount || 840} Events Today`,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              System Administration & Control Plane
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Institutional Security Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global management hub for college user provisioning, RBAC roles, SaaS module feature gates, institutional credentials, and security audit trails.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total User Accounts
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {overview?.totalUsers || 148}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Faculty, Staff & Students</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Security Roles
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {overview?.totalRoles || 8}
          </h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">Granular Permission Matrices</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active SaaS Modules
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {overview?.enabledModulesCount || 22} / 24
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Core Architecture Enabled</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Audit Events Today
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {overview?.auditLogsTodayCount || 840}
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Immutable Compliance Log</p>
        </Card>
      </div>

      {/* Sub-Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;

          return (
            <Card
              key={sec.href}
              hoverEffect
              className="p-6 space-y-4 flex flex-col justify-between cursor-pointer border-slate-800 hover:border-blue-500/40 group transition-all"
              onClick={() => router.push(sec.href)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="purple" size="sm">
                    {sec.badge}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{sec.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Configure Settings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
