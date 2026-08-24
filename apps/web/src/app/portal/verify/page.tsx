'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Search, QrCode, FileText, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { VerificationResult } from '../../../features/portal/components/VerificationResult';
import { verifyCertificate, verifyTranscript } from '../../../features/portal/services/portal.api';
import { VerificationData } from '../../../features/portal/types/portal.types';

export default function VerificationPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [verifyType, setVerifyType] = useState<'certificate' | 'transcript'>('certificate');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationData | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      if (verifyType === 'certificate') {
        const data = await verifyCertificate(query.trim());
        setResult(data);
      } else {
        const data = await verifyTranscript(query.trim());
        setResult(data);
      }
    } catch (err: any) {
      setResult({ isValid: false, error: err?.message || 'Certificate record not found' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Portal
        </Button>

        <Badge variant="purple" size="sm">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          SHA-256 Cryptographic Gateway
        </Badge>
      </div>

      {/* Main Search Box */}
      <Card className="p-6 lg:p-8 space-y-6">
        <CardHeader className="pb-2 text-center">
          <div>
            <CardTitle className="text-2xl">Official Credential & Transcript Verifier</CardTitle>
            <CardDescription>
              Verify authenticity of student degrees, diplomas, and official transcripts issued by the College
            </CardDescription>
          </div>
        </CardHeader>

        {/* Toggle Type */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setVerifyType('certificate');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              verifyType === 'certificate'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Verify Certificate / Degree
          </button>
          <button
            type="button"
            onClick={() => {
              setVerifyType('transcript');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              verifyType === 'transcript'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Verify Academic Transcript
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 max-w-xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder={
                verifyType === 'certificate'
                  ? 'Enter Certificate # (e.g. CERT-2026-BSN-089)'
                  : 'Enter Student Roll # (e.g. NUR-2022-0041)'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              required
            />
            <Button variant="primary" size="md" isLoading={isLoading} leftIcon={<Search className="w-4 h-4" />}>
              Verify
            </Button>
          </div>
        </form>
      </Card>

      {/* Verification Output */}
      {result && <VerificationResult result={result} />}
    </div>
  );
}
