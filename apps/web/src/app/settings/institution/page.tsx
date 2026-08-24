'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building,
  ShieldCheck,
  Save,
  Loader2,
  Upload,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { fetchCollegeProfile, updateCollegeProfile } from '../../../features/settings/services/settings.api';
import { CollegeProfile } from '../../../features/settings/types/settings.types';
import { useToast } from '../../../context/ToastContext';

export default function InstitutionSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchCollegeProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateCollegeProfile(profile);
      toast.success('Institution Profile Updated', 'Institutional credentials and PNC accreditation saved.');
    } catch (err: any) {
      toast.error('Update Failed', err?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Institution Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/settings')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to System Administration
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Institutional Profile
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Institution Card */}
        <Card className="p-6 space-y-6">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">College Institutional Profile & Accreditation</CardTitle>
              <CardDescription>
                Official college credentials displayed across receipts, fee challans, and transcripts
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College Name *"
              value={profile?.name || ''}
              onChange={(e) => profile && setProfile({ ...profile, name: e.target.value })}
              required
            />
            <Input
              label="Institutional Code *"
              value={profile?.code || ''}
              onChange={(e) => profile && setProfile({ ...profile, code: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="PNC Registration Number"
              value={profile?.pncRegistrationNo || ''}
              onChange={(e) =>
                profile && setProfile({ ...profile, pncRegistrationNo: e.target.value })
              }
            />
            <Input
              label="Accreditation Certificate #"
              value={profile?.accreditationNo || ''}
              onChange={(e) =>
                profile && setProfile({ ...profile, accreditationNo: e.target.value })
              }
            />
            <Input
              label="Affiliated Medical University"
              value={profile?.affiliatedUniversity || ''}
              onChange={(e) =>
                profile && setProfile({ ...profile, affiliatedUniversity: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Official Contact Email"
              type="email"
              value={profile?.email || ''}
              onChange={(e) => profile && setProfile({ ...profile, email: e.target.value })}
            />
            <Input
              label="Official Phone / PBX"
              value={profile?.phone || ''}
              onChange={(e) => profile && setProfile({ ...profile, phone: e.target.value })}
            />
            <Input
              label="Official Website URL"
              value={profile?.website || ''}
              onChange={(e) => profile && setProfile({ ...profile, website: e.target.value })}
            />
          </div>

          <Input
            label="Campus Physical Address"
            value={profile?.address || ''}
            onChange={(e) => profile && setProfile({ ...profile, address: e.target.value })}
          />
        </Card>
      </form>
    </div>
  );
}
