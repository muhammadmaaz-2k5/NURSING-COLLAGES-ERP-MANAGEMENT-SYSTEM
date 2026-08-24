'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Newspaper,
  Bell,
  Calendar,
  GraduationCap,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArticleModal } from '../../features/portal/components/ArticleModal';
import { NoticeModal } from '../../features/portal/components/NoticeModal';
import { EventModal } from '../../features/portal/components/EventModal';
import { fetchPortalOverview } from '../../features/portal/services/portal.api';
import { PortalOverviewData } from '../../features/portal/types/portal.types';

export default function PortalPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<PortalOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPortalOverview();
      setOverview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sections = [
    {
      title: 'News & Press Releases',
      description: 'Publish official institutional articles, convocation reports, and media coverage.',
      icon: Newspaper,
      href: '/portal/news',
      badge: `${overview?.publishedNewsCount || 8} Articles`,
    },
    {
      title: 'Notice Board & Circulars',
      description: 'Post examination datesheets, clinical ward rosters, and academic announcements.',
      icon: Bell,
      href: '/portal/notices',
      badge: `${overview?.activeNoticesCount || 6} Active Notices`,
    },
    {
      title: 'Events & Workshops',
      description: 'Schedule clinical simulation workshops, nursing conferences, and campus seminars.',
      icon: Calendar,
      href: '/portal/events',
      badge: `${overview?.upcomingEventsCount || 4} Upcoming`,
    },
    {
      title: 'Academic Degree Catalog',
      description: 'Public BSN and Post-RN degree program curricula, durations, and fee schemes.',
      icon: GraduationCap,
      href: '/portal/programs',
      badge: `${overview?.activeProgramsCount || 4} Programs`,
    },
    {
      title: 'Online Admission Applications',
      description: 'Review and process incoming student admissions, CNIC verification, and merit lists.',
      icon: FileCheck,
      href: '/portal/admissions',
      badge: `${overview?.pendingAdmissionsCount || 14} Applications`,
    },
    {
      title: 'Cryptographic Verification Gateway',
      description: 'Tamper-evident SHA-256 certificate authentication and official transcript verifier.',
      icon: ShieldCheck,
      href: '/portal/verify',
      badge: `${overview?.verificationsCount || 320} Authenticated`,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Public Portal & Content Management System
            </h1>
            <Badge variant="success" size="sm">
              <Globe className="w-3.5 h-3.5 mr-1" />
              Public Website Live
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage public institutional content, news press releases, official notice boards, academic degree catalogs, online admissions, and credential verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNoticeModalOpen(true)}
            leftIcon={<Bell className="w-4 h-4" />}
          >
            Post Notice
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEventModalOpen(true)}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Schedule Event
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsArticleModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Publish Article
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Published Articles
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {overview?.publishedNewsCount || 8}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">News & Press Releases</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Circulars
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {overview?.activeNoticesCount || 6}
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Exam Datesheets & Rosters</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pending Admissions
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {overview?.pendingAdmissionsCount || 14}
          </h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">Awaiting Merit Evaluation</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Verified Credentials
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {overview?.verificationsCount || 320}
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">SHA-256 Verifications</p>
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
                <span>Manage Section</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSuccess={loadData}
      />

      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        onSuccess={loadData}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
