'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sliders,
  ShieldCheck,
  Save,
  Loader2,
  Percent,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { fetchSystemSettings, updateSystemSettings } from '../../../features/settings/services/settings.api';
import { SystemSettings } from '../../../features/settings/types/settings.types';
import { useToast } from '../../../context/ToastContext';

export default function SystemSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSystemSettings();
        setSettings(data);
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
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSystemSettings(settings);
      toast.success('System Rules Updated', 'Attendance thresholds, GPA scales, and fine policies saved.');
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
        <p className="text-xs text-slate-400 font-medium">Loading System Configuration...</p>
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
          Save System Configuration
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic & Attendance Rules */}
        <Card className="p-6 space-y-6">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Academic & Examination Policy Thresholds</CardTitle>
              <CardDescription>
                Automated business rules for examination eligibility and minimum passing GPA
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Attendance Examination Eligibility (%) *"
              type="number"
              min={50}
              max={100}
              value={settings?.attendanceEligibilityThreshold || 75}
              onChange={(e) =>
                settings &&
                setSettings({
                  ...settings,
                  attendanceEligibilityThreshold: Number(e.target.value),
                })
              }
              required
            />
            <Input
              label="Minimum Passing Cumulative GPA (CGPA) *"
              type="number"
              step="0.1"
              min={1.0}
              max={4.0}
              value={settings?.gpaPassingThreshold || 2.0}
              onChange={(e) =>
                settings &&
                setSettings({
                  ...settings,
                  gpaPassingThreshold: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </Card>

        {/* Facilities & Loan Limits */}
        <Card className="p-6 space-y-6">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Facilities, Library & Billing Policies</CardTitle>
              <CardDescription>
                Concurrent borrowing limits, hostel allocations, and automated late fines
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Max Concurrent Library Book Loans / Student *"
              type="number"
              min={1}
              max={10}
              value={settings?.maxLibraryLoansPerStudent || 3}
              onChange={(e) =>
                settings &&
                setSettings({
                  ...settings,
                  maxLibraryLoansPerStudent: Number(e.target.value),
                })
              }
              required
            />

            <Select
              label="Operational Currency *"
              value={settings?.currency || 'PKR (₨)'}
              onChange={(e) =>
                settings && setSettings({ ...settings, currency: e.target.value })
              }
              options={[
                { value: 'PKR (₨)', label: 'PKR (Pakistani Rupee — ₨)' },
                { value: 'USD ($)', label: 'USD (US Dollar — $)' },
              ]}
            />
          </div>
        </Card>
      </form>
    </div>
  );
}
