'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GraduationCap, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { submitAdmission } from '../../../features/portal/services/portal.api';
import { PublicAdmissionDto } from '../../../features/portal/types/portal.types';
import { useToast } from '../../../context/ToastContext';

export default function PublicApplyPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingRef, setTrackingRef] = useState('');

  const [form, setForm] = useState<PublicAdmissionDto>({
    programId: 'prog-01',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnic: '',
    previousInstitute: '',
    marksObtained: 950,
    totalMarks: 1100,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.phone) {
      toast.error('Validation Error', 'First name, email, and phone number are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await submitAdmission(form);
      const ref = res?.referenceNo || `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setTrackingRef(ref);
      setIsSubmitted(true);
      toast.success('Application Submitted', `Your tracking ID is ${ref}.`);
    } catch (err: any) {
      toast.error('Submission Error', err?.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-fade-in text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Application Received!</h2>
          <p className="text-xs text-slate-300">
            Thank you for applying to the College of Nursing & Health Sciences. Your application has been logged into our admissions registry.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Your Tracking Reference #</span>
          <p className="text-2xl font-mono font-black text-blue-400">{trackingRef}</p>
          <span className="text-[11px] text-slate-500 block">
            Keep this number safe for merit list verification and admission counseling.
          </span>
        </div>

        <Button variant="primary" size="sm" onClick={() => router.push('/portal')}>
          Back to Public Portal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Portal
        </Button>

        <Badge variant="success" size="sm">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Fall 2026 Admissions Open
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 lg:p-8 space-y-6">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-xl">Online Admission Application</CardTitle>
              <CardDescription>
                Apply for Bachelor of Science in Nursing (BSN) or Post-RN degree programs
              </CardDescription>
            </div>
          </CardHeader>

          <Select
            label="Degree Program *"
            value={form.programId}
            onChange={(e) => setForm({ ...form, programId: e.target.value })}
            options={[
              { value: 'prog-01', label: 'Bachelor of Science in Nursing (Generic BSN — 4 Years)' },
              { value: 'prog-02', label: 'Post-RN Bachelor of Science in Nursing (2 Years)' },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="e.g. Amina"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Bibi"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. amina@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Mobile Phone *"
              placeholder="e.g. +92 300 1234567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Input
              label="CNIC / B-Form Number"
              placeholder="e.g. 37405-1234567-8"
              value={form.cnic}
              onChange={(e) => setForm({ ...form, cnic: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Previous Institute (F.Sc / College)"
              placeholder="e.g. Govt Girls College"
              value={form.previousInstitute}
              onChange={(e) => setForm({ ...form, previousInstitute: e.target.value })}
            />
            <Input
              label="Marks Obtained"
              type="number"
              value={form.marksObtained}
              onChange={(e) => setForm({ ...form, marksObtained: Number(e.target.value) })}
            />
            <Input
              label="Total Marks"
              type="number"
              value={form.totalMarks}
              onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Submit Official Admission Application
          </Button>
        </Card>
      </form>
    </div>
  );
}
