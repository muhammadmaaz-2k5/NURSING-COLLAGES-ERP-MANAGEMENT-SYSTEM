'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createVehicle } from '../services/transport.api';
import { CreateVehicleDto } from '../types/transport.types';

export interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateVehicleDto>({
    registrationNo: '',
    name: '',
    type: 'Toyota Coaster 32-Seater',
    capacity: 32,
    driverName: '',
    driverPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.registrationNo) {
      toast.error('Validation Error', 'Vehicle registration number is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createVehicle(form);
      toast.success(
        'Vehicle Registered',
        `Vehicle ${form.registrationNo} added to college transport fleet.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Registration Failed', err?.message || 'Could not register vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Transport Fleet Vehicle"
      description="Add campus bus, coaster, or clinical shuttle van with driver credentials and seating capacity."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Register Fleet Vehicle
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Registration / Number Plate *"
            placeholder="e.g. ICT-BUS-905"
            value={form.registrationNo}
            onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
            required
          />
          <Input
            label="Bus Identifier / Call Name"
            placeholder="e.g. Campus Coaster 05"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Vehicle Model / Type *"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { value: 'Toyota Coaster 32-Seater', label: 'Toyota Coaster (32-Seater)' },
              { value: 'Hino 52-Seater Transit Bus', label: 'Hino Transit Bus (52-Seater)' },
              { value: 'Toyota HiAce 16-Seater Van', label: 'Toyota HiAce Van (16-Seater)' },
            ]}
          />
          <Input
            label="Seating Capacity (Seats) *"
            type="number"
            min={1}
            max={70}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Assigned Driver Name"
            placeholder="e.g. Muhammad Rafiq"
            value={form.driverName}
            onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          />
          <Input
            label="Driver Contact Phone"
            placeholder="e.g. +92 300 9988771"
            value={form.driverPhone}
            onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
