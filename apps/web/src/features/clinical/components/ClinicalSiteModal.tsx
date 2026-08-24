'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createClinicalSite } from '../services/clinical.api';
import { CreateClinicalSiteDto, ClinicalSiteType } from '../types/clinical.types';

export interface ClinicalSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClinicalSiteModal: React.FC<ClinicalSiteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateClinicalSiteDto>({
    name: '',
    type: 'HOSPITAL',
    address: '',
    city: 'Islamabad',
    phone: '',
    contactPerson: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Validation Error', 'Please specify Facility / Hospital Name.');
      return;
    }

    setIsLoading(true);
    try {
      await createClinicalSite(form);
      toast.success(
        'Site Registered',
        `${form.name} added to affiliated clinical training network.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Registration Failed', err?.message || 'Could not register clinical site');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Partner Hospital / Clinical Site"
      description="Add an affiliated tertiary hospital, trauma center, or community clinic for clinical postings."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Register Clinical Partner
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Hospital / Clinical Facility Name *"
          placeholder="e.g. National Teaching Hospital & Complex"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Facility Type *"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ClinicalSiteType })}
            options={[
              { value: 'HOSPITAL', label: 'Tertiary Teaching Hospital' },
              { value: 'COMMUNITY_HEALTH_CENTER', label: 'Community Health Center (BHU/RHC)' },
              { value: 'TRAUMA_CENTER', label: 'Emergency & Trauma Center' },
              { value: 'CLINIC', label: 'Specialized Outpatient Clinic' },
              { value: 'REHAB_CENTER', label: 'Physical Rehabilitation Center' },
            ]}
          />
          <Input
            label="City *"
            placeholder="e.g. Islamabad"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <Input
          label="Facility Physical Address"
          placeholder="Sector / Road, City"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Contact Person (MS / Focal Person)"
            placeholder="e.g. Dr. Shahzad (MS)"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          />
          <Input
            label="Official Phone Contact"
            placeholder="+92 51 9290321"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
