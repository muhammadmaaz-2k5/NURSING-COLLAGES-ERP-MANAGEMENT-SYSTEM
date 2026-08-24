'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GraduationCap, Clock, Award, DollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { fetchPrograms } from '../../../features/portal/services/portal.api';
import { PublicProgram } from '../../../features/portal/types/portal.types';
import { formatCurrency } from '../../../lib/utils';

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchPrograms();
        setPrograms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Portal Command Center
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Accredited Academic Degree Programs
        </h1>
        <p className="text-xs text-slate-400">
          Recognized by Pakistan Nursing Council (PNC) and Higher Education Commission (HEC).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <Card key={prog.id} hoverEffect className="p-6 space-y-5 border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="purple" size="sm">
                  {prog.code}
                </Badge>
                <h3 className="text-lg font-bold text-white mt-2">{prog.name}</h3>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{prog.description}</p>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="font-bold text-white">
                  {prog.durationYears} Years ({prog.totalSemesters} Semesters)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Tuition Fee</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(prog.annualTuitionFee)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Eligibility Criteria
              </span>
              <p className="text-xs text-slate-300">{prog.eligibilityCriteria}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
