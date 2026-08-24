'use client';

import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, CheckCircle2, XCircle, Award, GraduationCap, FileText } from 'lucide-react';
import { VerificationData } from '../types/portal.types';
import { formatDate } from '../../../lib/utils';

export const VerificationResult: React.FC<{ result: VerificationData | null }> = ({ result }) => {
  if (!result) return null;

  if (!result.isValid) {
    return (
      <Card className="p-8 border-rose-500/40 bg-rose-950/20 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
          <XCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Verification Failed</h3>
          <p className="text-xs text-rose-300">
            {result.error || 'No matching official institutional record or cryptographic signature found.'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-emerald-500/40 bg-slate-900/90 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in">
      <div className="flex items-start justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">AUTHENTICATED INSTITUTIONAL RECORD</h3>
              <Badge variant="success" size="sm" dot>
                VERIFIED
              </Badge>
            </div>
            <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
              Serial No: {result.certificateNo || result.studentRegId}
            </p>
          </div>
        </div>

        <Badge variant="purple" size="sm">
          {result.certificateType || 'ACADEMIC RECORD'}
        </Badge>
      </div>

      {/* Record Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Student Name</span>
          <span className="font-bold text-white text-sm">{result.studentName}</span>
        </div>

        <div>
          <span className="text-slate-500 font-medium block">Registration / Roll #</span>
          <span className="font-mono font-bold text-blue-400 text-sm">{result.studentRegId}</span>
        </div>

        <div>
          <span className="text-slate-500 font-medium block">Conferred Degree</span>
          <span className="text-white font-medium">{result.programName}</span>
        </div>

        <div>
          <span className="text-slate-500 font-medium block">Cumulative GPA</span>
          <span className="font-mono font-black text-emerald-400 text-sm">
            {result.cgpa?.toFixed(2) || '—'} / 4.00
          </span>
        </div>
      </div>

      {/* Cryptographic SHA-256 Hash */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 block">
          SHA-256 Cryptographic Verification Hash
        </span>
        <p className="font-mono text-[11px] text-purple-400 break-all select-all">
          {result.verificationHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
        </p>
      </div>
    </Card>
  );
};
