'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createRoom } from '../services/hostel.api';
import { CreateHostelRoomDto, HostelRoomType } from '../types/hostel.types';

export interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateHostelRoomDto>({
    hostelId: 'hst-01',
    roomNumber: '',
    floor: '2nd Floor',
    type: 'DOUBLE',
    capacity: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomNumber) {
      toast.error('Validation Error', 'Room number is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createRoom(form);
      toast.success(
        'Room Created',
        `${form.roomNumber} created with ${form.capacity} automatic bed records.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Creation Failed', err?.message || 'Could not create hostel room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Hostel Room & Beds"
      description="Add a residential room and auto-generate physical bed allocations."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Create Room & Beds
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Hostel Building *"
          value={form.hostelId}
          onChange={(e) => setForm({ ...form, hostelId: e.target.value })}
          options={[
            { value: 'hst-01', label: 'Fatima Jinnah Female Residence (HST-F-01)' },
            { value: 'hst-02', label: 'Sir Syed Male Healthcare Hall (HST-M-01)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Room Number *"
            placeholder="e.g. Room 204"
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            required
          />
          <Input
            label="Floor / Level"
            placeholder="e.g. 2nd Floor"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Room Type *"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as HostelRoomType })}
            options={[
              { value: 'SINGLE', label: 'Single Occupancy (1 Bed)' },
              { value: 'DOUBLE', label: 'Double Occupancy (2 Beds)' },
              { value: 'TRIPLE', label: 'Triple Occupancy (3 Beds)' },
              { value: 'DORMITORY', label: 'Dormitory (4-6 Beds)' },
            ]}
          />
          <Input
            label="Bed Capacity *"
            type="number"
            min={1}
            max={8}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            required
          />
        </div>
      </form>
    </Modal>
  );
};
