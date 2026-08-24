'use client';

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, Lock } from 'lucide-react';
import { ModuleConfigItem } from '../types/settings.types';
import { toggleModule } from '../services/settings.api';
import { useToast } from '../../../context/ToastContext';

export const ModuleToggleCard: React.FC<{
  module: ModuleConfigItem;
  onToggle?: () => void;
}> = ({ module, onToggle }) => {
  const toast = useToast();
  const [isEnabled, setIsEnabled] = useState(module.isEnabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (module.isCore) {
      toast.error('Core Module Protected', 'Core architectural modules cannot be disabled.');
      return;
    }

    const nextState = !isEnabled;
    setIsLoading(true);
    try {
      await toggleModule(module.key, nextState);
      setIsEnabled(nextState);
      toast.success(
        nextState ? 'Module Activated' : 'Module Suspended',
        `${module.name} has been ${nextState ? 'enabled' : 'disabled'} system-wide.`,
      );
      onToggle?.();
    } catch (err: any) {
      toast.error('Toggle Failed', err?.message || 'Could not update module');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      hoverEffect
      className={`p-6 space-y-4 transition-all ${
        isEnabled ? 'border-slate-800' : 'opacity-60 bg-slate-950/40 border-slate-900'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">{module.name}</h3>
            {module.isCore && (
              <Badge variant="purple" size="sm">
                <Lock className="w-3 h-3 mr-1 inline" /> Core
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">{module.description}</p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          disabled={module.isCore || isLoading}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed ${
            isEnabled ? 'bg-blue-600' : 'bg-slate-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <Badge variant="neutral" size="sm">
          {module.category}
        </Badge>
        <span
          className={`font-mono text-[11px] font-bold ${
            isEnabled ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          {isEnabled ? 'SYSTEM ACTIVE' : 'INACTIVE / DISABLED'}
        </span>
      </div>
    </Card>
  );
};
