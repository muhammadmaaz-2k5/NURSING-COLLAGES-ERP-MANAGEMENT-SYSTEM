'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createStop } from '../services/transport.api';
import { CreateStopDto } from '../types/transport.types';

export interface StopModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  routeName: string;
  nextSequence: number;
  onSuccess?: () => void;
}

export const StopModal: React.FC<StopModalProps> = ({
  isOpen,
  onClose,
  routeId,
  routeName,
  nextSequence,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateStopDto>({
    routeId,
    name: '',
    sequence: nextSequence || 1,
    pickupTime: '07:15 AM',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Validation Error', 'Stop name is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createStop({ ...form, routeId });
      toast.success('Stop Added', `Stop "${form.name}" added to ${routeName}.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Failed to Add Stop', err?.message || 'Could not create stop');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Scheduled Pickup Stop"
      description={`Add stop to "${routeName}".`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Add Scheduled Stop
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Stop Name / Location *"
          placeholder="e.g. Faizabad Interchange Terminal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stop Sequence Order *"
            type="number"
            min={1}
            value={form.sequence}
            onChange={(e) => setForm({ ...form, sequence: Number(e.target.value) })}
            required
          />
          <Input
            label="Scheduled Pickup Time"
            placeholder="e.g. 07:15 AM"
            value={form.pickupTime}
            onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
