'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Check,
  Lock,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { PermissionMatrix } from '../../../../features/settings/components/PermissionMatrix';
import { fetchRoleById, assignPermissionsToRole } from '../../../../features/settings/services/settings.api';
import { SystemRole } from '../../../../features/settings/types/settings.types';
import { useToast } from '../../../../context/ToastContext';

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const roleId = params?.id as string;

  const [role, setRole] = useState<SystemRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      if (!roleId) return;
      setIsLoading(true);
      try {
        const data = await fetchRoleById(roleId);
        setRole(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [roleId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const permissionCodes = Object.entries(currentPermissions)
        .filter(([_, isAllowed]) => isAllowed)
        .map(([code]) => code);

      await assignPermissionsToRole(roleId, permissionCodes);
      toast.success('Permissions Updated', `RBAC matrix saved for role ${role?.name}.`);
    } catch (err: any) {
      toast.error('Save Failed', err?.message || 'Unable to update role permissions');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Role Permission Matrix...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Role Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/settings/roles')}>
          Back to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/settings/roles')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Roles Directory
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Save Permission Matrix
        </Button>
      </div>

      {/* Role Header */}
      <div className="p-6 lg:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">
            {role.name}
          </Badge>
          {role.isSystem && (
            <Badge variant="neutral" size="sm">
              <Lock className="w-3 h-3 mr-1 inline" /> Builtin System Role
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{role.name}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">{role.description}</p>
      </div>

      {/* Interactive Permission Matrix */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Granular Functional Module Permissions</CardTitle>
            <CardDescription>
              Assign View, Create, Update, and Delete access rights for this security role
            </CardDescription>
          </div>
        </CardHeader>

        <PermissionMatrix
          isReadOnly={role.name === 'SUPER_ADMIN'}
          onChange={setCurrentPermissions}
        />
      </Card>
    </div>
  );
}
