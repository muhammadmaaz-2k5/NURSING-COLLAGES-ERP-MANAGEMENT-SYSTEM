'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createNotice } from '../services/portal.api';
import { CreateNoticeDto } from '../types/portal.types';

export interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateNoticeDto>({
    title: '',
    content: '',
    attachmentUrl: '',
    isPublished: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('Validation Error', 'Title and notice content are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createNotice(form);
      toast.success(
        'Notice Published',
        `"${form.title}" published to student and public circular boards.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Publishing Failed', err?.message || 'Could not post notice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Institutional Circular / Notice"
      description="Publish examination schedules, date sheets, holiday circulars, or clinical duty notices."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Post Notice
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Notice Title *"
          placeholder="e.g. Fall 2026 Examination Date Sheet"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Notice Body / Circular Details *
          </label>
          <textarea
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Official circular announcement details..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <Input
          label="Document Attachment PDF URL (Optional)"
          placeholder="https://storage.college.edu.pk/notices/datesheet.pdf"
          value={form.attachmentUrl}
          onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })}
        />
      </form>
    </Modal>
  );
};
