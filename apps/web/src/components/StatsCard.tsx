'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconBg = 'rgba(59, 130, 246, 0.15)',
  iconColor = '#60a5fa',
}: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span>{label}</span>
        <h3>{value}</h3>
      </div>
      <div className="stat-icon-wrapper" style={{ background: iconBg }}>
        <Icon size={24} color={iconColor} />
      </div>
    </div>
  );
}
