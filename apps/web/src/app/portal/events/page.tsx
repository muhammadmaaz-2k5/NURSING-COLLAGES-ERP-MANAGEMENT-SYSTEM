'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Plus, MapPin, Clock } from 'lucide-react';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { EventModal } from '../../../features/portal/components/EventModal';
import { fetchEvents } from '../../../features/portal/services/portal.api';
import { PortalEvent } from '../../../features/portal/types/portal.types';
import { formatDate } from '../../../lib/utils';

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<PortalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<PortalEvent>[] = [
    {
      header: 'Event Title & Venue',
      accessorKey: 'title',
      sortable: true,
      cell: (evt) => (
        <div>
          <p className="font-bold text-slate-100">{evt.title}</p>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>{evt.location || 'College Campus'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Start Date & Time',
      accessorKey: 'startDate',
      sortable: true,
      cell: (evt) => (
        <span className="font-mono text-xs text-blue-400 font-semibold">
          {formatDate(evt.startDate)}
        </span>
      ),
    },
    {
      header: 'Description & Summary',
      accessorKey: 'description',
      cell: (evt) => <span className="text-xs text-slate-400 line-clamp-2">{evt.description || '—'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'isPublished',
      cell: (evt) => (
        <Badge variant={evt.isPublished ? 'success' : 'neutral'} size="sm" dot>
          {evt.isPublished ? 'UPCOMING' : 'DRAFT'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Portal Command Center
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Schedule Event
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Campus Events & Clinical Workshops</CardTitle>
            <CardDescription>
              Manage public seminar schedules, ICU simulation training, and academic conferences
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={events}
          isLoading={isLoading}
          searchPlaceholder="Search events..."
          pageSize={10}
        />
      </Card>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
