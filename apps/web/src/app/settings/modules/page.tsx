'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Layers, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ModuleToggleCard } from '../../../features/settings/components/ModuleToggleCard';
import { fetchModuleConfigs } from '../../../features/settings/services/settings.api';
import { ModuleConfigItem } from '../../../features/settings/types/settings.types';

export default function ModulesSettingsPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchModuleConfigs();
      setModules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeCount = modules.filter((m) => m.isEnabled).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/settings')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to System Administration
        </Button>

        <Badge variant="success" size="sm">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          {activeCount} of {modules.length} Modules Active
        </Badge>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-white tracking-tight">
          SaaS Module Architecture & Feature Gates
        </h1>
        <p className="text-xs text-slate-400">
          Enable or disable functional business modules dynamically across the entire multi-campus ERP.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modules.map((mod) => (
          <ModuleToggleCard key={mod.key} module={mod} onToggle={loadData} />
        ))}
      </div>
    </div>
  );
}
