'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createEvent } from '../services/portal.api';
import { CreateEventDto } from '../types/portal.types';

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateEventDto>({
    title: '',
    slug: '',
    description: '',
    location: 'Main Auditorium',
    startDate: '2026-09-25T09:00',
    endDate: '2026-09-26T17:00',
  });

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm({ ...form, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.startDate) {
      toast.error('Validation Error', 'Event title and start date are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createEvent({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      });
      toast.success('Event Scheduled', `"${form.title}" is now added to the campus calendar.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Scheduling Failed', err?.message || 'Could not schedule event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Campus Event / Clinical Workshop"
      description="Publish upcoming seminars, clinical training sessions, and academic ceremonies."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Schedule Event
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Title *"
          placeholder="e.g. Clinical Nursing Simulation Workshop 2026"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="URL Slug *"
            placeholder="clinical-nursing-workshop-2026"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <Input
            label="Location / Venue"
            placeholder="e.g. Simulation Lab B"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date & Time *"
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <Input
            label="End Date & Time"
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        <Input
          label="Event Summary & Agenda"
          placeholder="Brief description of the seminar or workshop..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </form>
    </Modal>
  );
};
