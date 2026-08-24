'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ModuleToggleCard } from '../../features/settings/components/ModuleToggleCard';
import { fetchModuleConfigs } from '../../features/settings/services/settings.api';
import { ModuleConfigItem } from '../../features/settings/types/settings.types';

export default function ModulesPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleConfigItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
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

  const categories = [
    'ALL',
    'Core Academics',
    'Clinical & Healthcare',
    'Administration & Finance',
    'Facilities & Campus',
    'Public & CMS',
  ];

  const filtered = modules.filter((m) => {
    if (activeCategory !== 'ALL' && m.category !== activeCategory) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = modules.filter((m) => m.isEnabled).length;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              SaaS Dynamic Module Manager
            </h1>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {activeCount} of {modules.length} Modules Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure institutional SaaS capabilities on demand. Feature gates dynamically activate or deactivate per tenant across the whole ERP.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/settings')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          System Control Plane
        </Button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((mod) => (
          <ModuleToggleCard key={mod.key} module={mod} onToggle={loadData} />
        ))}
      </div>
    </div>
  );
}
