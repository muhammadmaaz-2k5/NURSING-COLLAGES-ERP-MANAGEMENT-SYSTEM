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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function FacilitiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'hostel' | 'library' | 'transport'>('overview');

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

  const hostels = [
    { name: 'Florence Nightingale Female Hostel', code: 'HSTL-FEM-01', rooms: 45, beds: 180, occupied: 165, available: 15 },
    { name: 'Iqbal Male Scholar Hostel', code: 'HSTL-MALE-01', rooms: 30, beds: 120, occupied: 98, available: 22 },
  ];

  const libraryStats = [
    { title: 'Brunner & Suddarth Textbook of Medical-Surgical Nursing', author: 'Janice L. Hinkle', copies: 25, available: 12, category: 'Clinical Nursing' },
    { title: 'Pharmacology for Nurses: A Pathophysiologic Approach', author: 'Michael Adams', copies: 20, available: 8, category: 'Pharmacology' },
    { title: 'Guyton and Hall Textbook of Medical Physiology', author: 'John E. Hall', copies: 15, available: 4, category: 'Physiology' },
  ];

  const routes = [
    { name: 'Route 1: Rawalpindi Saddar Corridor', bus: 'Coaster (ICT-8921)', stops: 'Saddar > Chandni Chowk > Faizabad > H-8 Campus', studentsAssigned: 32 },
    { name: 'Route 2: Islamabad F-Sector Route', bus: 'Bus (ICT-4402)', stops: 'F-10 > F-8 > G-8 > H-8 Campus', studentsAssigned: 28 },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Campus Facilities & Infrastructure
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              All Services Operational
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional management hub for student hostel accommodation, physical library circulation, and commuter transport fleet.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hostel Occupancy
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">87.6%</h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">263 / 300 Boarders</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Library Catalog
          </span>
          <h3 className="text-2xl font-black text-blue-400 mt-1">12,450</h3>
          <p className="text-xs text-blue-300 mt-2 font-medium">Accession Barcodes Active</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Transit Fleet
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">4 Routes</h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">148 Seating Capacity</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Facility Utilization
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">94.2%</h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">High Campus Engagement</p>
        </Card>
      </div>

      {/* 3 Domain Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilitySections.map((sec) => {
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
                    {sec.stats}
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
                <span>Open Dedicated Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'overview' as const, label: 'Facility Workspaces', icon: Layers },
          { id: 'hostel' as const, label: 'Hostel Buildings & Rooms', icon: Hotel },
          { id: 'library' as const, label: 'Library Catalog Preview', icon: BookOpen },
          { id: 'transport' as const, label: 'Transport Corridors', icon: Bus },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'hostel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hostels.map((h) => (
            <Card key={h.code} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="purple" size="sm">
                    {h.code}
                  </Badge>
                  <h4 className="text-base font-bold text-white mt-1">{h.name}</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/hostel')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Manage Beds
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Rooms</span>
                  <span className="font-bold text-white">{h.rooms} Rooms</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bed Capacity</span>
                  <span className="font-bold text-white">{h.beds} Beds</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Occupied</span>
                  <span className="font-bold text-rose-400">{h.occupied} Residents</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Available</span>
                  <span className="font-bold text-emerald-400">{h.available} Beds</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'library' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-base">Library Catalog Overview</CardTitle>
                <CardDescription>
                  Accession barcoding and textbook lending statistics
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/library')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Library Desk
              </Button>
            </div>
          </CardHeader>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                  <th className="p-4 font-bold uppercase">Book Title</th>
                  <th className="p-4 font-bold uppercase">Author</th>
                  <th className="p-4 font-bold uppercase">Category</th>
                  <th className="p-4 font-bold uppercase">Total Copies</th>
                  <th className="p-4 font-bold uppercase">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {libraryStats.map((b) => (
                  <tr key={b.title} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">{b.title}</td>
                    <td className="p-4 text-slate-300">{b.author}</td>
                    <td className="p-4">
                      <Badge variant="purple" size="sm">
                        {b.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{b.copies} Copies</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {b.available} Available
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routes.map((r) => (
            <Card key={r.name} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="purple" size="sm">
                    {r.bus}
                  </Badge>
                  <h4 className="text-base font-bold text-white mt-1">{r.name}</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/transport')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Route
                </Button>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-slate-500 block">Stops Timeline:</span>
                <p className="font-semibold text-slate-200">{r.stops}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-500">Subscribed Students:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {r.studentsAssigned} Bus Passes
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
