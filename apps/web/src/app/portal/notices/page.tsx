'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Plus, FileText, Download, ExternalLink } from 'lucide-react';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { NoticeModal } from '../../../features/portal/components/NoticeModal';
import { fetchNotices } from '../../../features/portal/services/portal.api';
import { NoticeItem } from '../../../features/portal/types/portal.types';
import { formatDate } from '../../../lib/utils';

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<NoticeItem>[] = [
    {
      header: 'Notice Title & Details',
      accessorKey: 'title',
      sortable: true,
      cell: (not) => (
        <div>
          <p className="font-bold text-slate-100">{not.title}</p>
          <span className="text-slate-400 text-xs line-clamp-1 mt-0.5">{not.content}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (not) => (
        <Badge variant="purple" size="sm">
          {not.category || 'General Circular'}
        </Badge>
      ),
    },
    {
      header: 'Published Date',
      accessorKey: 'publishedAt',
      sortable: true,
      cell: (not) => <span className="font-mono text-xs text-slate-300">{formatDate(not.publishedAt)}</span>,
    },
    {
      header: 'Document Attachment',
      cell: (not) =>
        not.attachmentUrl ? (
          <a
            href={not.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold"
          >
            <FileText className="w-3.5 h-3.5" /> PDF Notice
          </a>
        ) : (
          <span className="text-slate-500 text-xs">No File</span>
        ),
    },
    {
      header: 'Status',
      accessorKey: 'isPublished',
      cell: (not) => (
        <Badge variant={not.isPublished ? 'success' : 'neutral'} size="sm" dot>
          {not.isPublished ? 'ACTIVE' : 'DRAFT'}
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
          Post Notice
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Official Notice Board & Circulars</CardTitle>
            <CardDescription>
              Manage student circulars, date sheets, holiday notices, and clinical rosters
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={notices}
          isLoading={isLoading}
          searchPlaceholder="Search notices by title..."
          pageSize={10}
        />
      </Card>

      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
