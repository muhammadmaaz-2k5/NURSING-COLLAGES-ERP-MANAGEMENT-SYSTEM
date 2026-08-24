'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createRoute } from '../services/transport.api';
import { CreateRouteDto } from '../types/transport.types';

export interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateRouteDto>({
    vehicleId: 'veh-01',
    name: '',
    startPoint: '',
    endPoint: 'Nursing College Main Gate, Sector H-8/4 Islamabad',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Validation Error', 'Route name is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createRoute(form);
      toast.success('Route Defined', `Route "${form.name}" created.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Route Creation Failed', err?.message || 'Could not create route');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Transport Route"
      description="Define bus transit corridor with origin, destination, and vehicle allocation."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Create Route
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Route Name / Identifier *"
          placeholder="e.g. Route 5 — Bahria Town to Campus"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Select
          label="Assigned Vehicle *"
          value={form.vehicleId}
          onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          options={[
            { value: 'veh-01', label: 'ICT-BUS-901 (Toyota Coaster — 32 Seats)' },
            { value: 'veh-02', label: 'ICT-BUS-902 (Toyota Coaster — 32 Seats)' },
            { value: 'veh-03', label: 'ICT-BUS-903 (Hino Transit Bus — 52 Seats)' },
            { value: 'veh-04', label: 'ICT-BUS-904 (HiAce Van — 16 Seats)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Origin / Start Point *"
            placeholder="e.g. Bahria Phase 7 Gate"
            value={form.startPoint}
            onChange={(e) => setForm({ ...form, startPoint: e.target.value })}
          />
          <Input
            label="Destination / End Point *"
            value={form.endPoint}
            onChange={(e) => setForm({ ...form, endPoint: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
