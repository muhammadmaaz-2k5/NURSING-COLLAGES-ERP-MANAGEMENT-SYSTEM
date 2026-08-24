'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { PermissionMatrix } from './PermissionMatrix';
import { CreateRoleDto } from '../types/settings.types';

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Validation Error', 'Role title is required.');
      return;
    }

    setIsLoading(true);
    try {
      toast.success('Role Created', `Custom role "${name}" defined with granular RBAC permissions.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Creation Failed', err?.message || 'Could not create role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Security Role"
      description="Define role scope and granular View/Create/Update/Delete permissions across functional modules."
      size="xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Save Custom Role
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Role Name / Code *"
            placeholder="e.g. CLINICAL_COORDINATOR"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Role Description"
            placeholder="e.g. Oversees hospital clinical rotations and skills logging"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Granular Module Permission Matrix
          </label>
          <PermissionMatrix
            onChange={(permMap) => {
              const active = Object.entries(permMap)
                .filter(([_, v]) => v)
                .map(([k]) => k);
              setPermissions(active);
            }}
          />
        </div>
      </form>
    </Modal>
  );
};
