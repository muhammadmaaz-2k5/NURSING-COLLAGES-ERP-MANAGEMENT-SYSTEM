'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Hotel,
  BookOpen,
  Bus,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Layers,
  MapPin,
  Phone,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function FacilitiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const studentName = user?.name || 'Amina Bibi';
  const [activeTab, setActiveTab] = useState<'overview' | 'hostel' | 'library' | 'transport'>('overview');

  const hostels = [
    { name: 'Florence Nightingale Female Hostel', code: 'HSTL-FEM-01', rooms: 45, beds: 180, occupied: 165, available: 15 },
    { name: 'Iqbal Male Scholar Hostel', code: 'HSTL-MALE-01', rooms: 30, beds: 120, occupied: 98, available: 22 },
  ];

  // STUDENT VIEW
  if (isStudent) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                My Campus Resident & Commuter Services
              </h1>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                Active Campus Pass
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Student: <span className="font-bold text-white">{studentName}</span> (NUR-2022-0041) • Florence Nightingale Hostel Resident
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hostel Room</span>
              <span className="text-xl font-black text-purple-400">Room #204</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Hotel className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dual Cards: Residential & Transport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hostel Accommodation Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Residential Accommodation</h3>
                  <p className="text-xs text-slate-500">Florence Nightingale Female Hostel</p>
                </div>
              </div>
              <Badge variant="purple" size="sm">Allotted</Badge>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span>Allotted Room & Bed:</span>
                <strong className="text-slate-900 dark:text-slate-100">Room 204 (2nd Floor), Bed #2</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span>Room Type:</span>
                <strong className="text-slate-900 dark:text-slate-100">Double Occupancy (Attached Bath)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span>Hostel Warden / Superintendent:</span>
                <strong className="text-slate-900 dark:text-slate-100">Sister Farida Bano</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Mess & Dining Facility:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Standard 3-Meals Active</span>
              </div>
            </div>
          </Card>

          {/* Transport Bus Service Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Commuter Transport Route</h3>
                  <p className="text-xs text-slate-500">Route 1: Rawalpindi Saddar Corridor</p>
                </div>
              </div>
              <Badge variant="success" size="sm">Active Pass</Badge>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span>Assigned Vehicle:</span>
                <strong className="text-slate-900 dark:text-slate-100">Coaster # ICT-8921 (Seat #14)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span>Morning Pickup Stop:</span>
                <strong className="text-slate-900 dark:text-slate-100">Faizabad Interchange (07:15 AM)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span>Driver Contact:</span>
                <strong className="text-slate-900 dark:text-slate-100">Ustad Rafiq (+92 300 5518290)</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Evening Return Departure:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">04:30 PM from Campus Gate 1</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ADMIN VIEW
  const facilitySections = [
    {
      title: 'Hostel & Residential Accommodation',
      description: 'Single-occupant bed isolation locks, room matrices, and resident checkouts.',
      icon: Hotel,
      href: '/hostel',
      stats: '198 / 200 Beds (99%)',
      color: 'purple',
    },
    {
      title: 'Library & Accession Circulation',
      description: 'Book titles catalog, accession barcodes, loan desk, and automated overdue fines.',
      icon: BookOpen,
      href: '/library',
      stats: '12,450 Cataloged Titles',
      color: 'blue',
    },
    {
      title: 'Transport & Commuter Fleet',
      description: 'Campus vehicle roster, morning transit routes, scheduled pickup stops timeline.',
      icon: Bus,
      href: '/transport',
      stats: '4 Routes • 148 Seats',
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Campus Facilities & Infrastructure
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              All Services Operational
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional management hub for student hostel accommodation, physical library circulation, and commuter transport fleet.
          </p>
        </div>
      </div>

      {/* Facility Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilitySections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Card key={sec.title} hoverEffect className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{sec.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{sec.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{sec.stats}</span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => router.push(sec.href)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Manage
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
