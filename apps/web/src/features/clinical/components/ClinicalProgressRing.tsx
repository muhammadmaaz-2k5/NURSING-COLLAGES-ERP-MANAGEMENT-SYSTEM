'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

export interface ClinicalProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: 'blue' | 'emerald' | 'purple' | 'amber';
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ClinicalProgressRing: React.FC<ClinicalProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = 'emerald',
  label,
  sublabel,
  className,
}) => {
  const cleanPercentage = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cleanPercentage / 100) * circumference;

  const colorStyles = {
    blue: 'text-blue-500 stroke-blue-500',
    emerald: 'text-emerald-500 stroke-emerald-500',
    purple: 'text-purple-500 stroke-purple-500',
    amber: 'text-amber-500 stroke-amber-500',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center relative', className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800/80"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn('transition-all duration-1000 ease-out', colorStyles[color])}
          />
        </svg>

        {/* Inner Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-xl font-black text-white leading-none font-mono">
            {cleanPercentage}%
          </span>
          {sublabel && (
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && <span className="text-xs font-bold text-slate-200 mt-2">{label}</span>}
    </div>
  );
};
