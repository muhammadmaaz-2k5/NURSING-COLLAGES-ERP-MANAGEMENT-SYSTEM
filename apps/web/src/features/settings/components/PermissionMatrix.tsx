'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Lock } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

export interface PermissionRow {
  key: string;
  label: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface PermissionMatrixProps {
  isReadOnly?: boolean;
  initialPermissions?: Record<string, boolean>;
  onChange?: (permissions: Record<string, boolean>) => void;
}

const DEFAULT_MODULES = [
  { key: 'students', label: 'Student Management & 360° Profile' },
  { key: 'academic', label: 'Academic Programs, Semesters & Timetable' },
  { key: 'faculty', label: 'Faculty Profiles & Workload Allocations' },
  { key: 'attendance', label: 'Student & Faculty Daily Attendance' },
  { key: 'exams', label: 'Examinations, Marks Entry & Transcripts' },
  { key: 'clinical', label: 'Clinical Skills, 1200h PNC Logbook & Verification' },
  { key: 'hospital', label: 'Teaching Hospital OPD, IPD & Bed Matrices' },
  { key: 'pharmacy', label: 'Pharmacy Formulary, Expiry & FIFO Dispensary' },
  { key: 'finance', label: 'Finance, Fee Challans & Double-Entry Ledgers' },
  { key: 'hostel', label: 'Hostel Buildings & Room-Bed Allocations' },
  { key: 'library', label: 'Library Catalog, Accession Barcodes & Loans' },
  { key: 'transport', label: 'Transport Fleet, Routes & Commuter Bus Passes' },
  { key: 'hr', label: 'Human Resources, Payroll Engine & Leaves' },
  { key: 'cms', label: 'Public Website, News, Events & Admissions' },
  { key: 'settings', label: 'System Administration & Security Audit Logs' },
];

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  isReadOnly = false,
  initialPermissions = {},
  onChange,
}) => {
  const [matrix, setMatrix] = useState<Record<string, { view: boolean; create: boolean; update: boolean; delete: boolean }>>(() => {
    const res: Record<string, { view: boolean; create: boolean; update: boolean; delete: boolean }> = {};
    for (const mod of DEFAULT_MODULES) {
      res[mod.key] = {
        view: initialPermissions[`${mod.key}.read`] ?? true,
        create: initialPermissions[`${mod.key}.create`] ?? (mod.key !== 'settings'),
        update: initialPermissions[`${mod.key}.update`] ?? (mod.key !== 'settings'),
        delete: initialPermissions[`${mod.key}.delete`] ?? false,
      };
    }
    return res;
  });

  const toggle = (modKey: string, action: 'view' | 'create' | 'update' | 'delete') => {
    if (isReadOnly) return;
    setMatrix((prev) => {
      const current = prev[modKey] || { view: true, create: false, update: false, delete: false };
      const updated = {
        ...prev,
        [modKey]: {
          ...current,
          [action]: !current[action],
        },
      };

      // Notify parent
      const flat: Record<string, boolean> = {};
      Object.entries(updated).forEach(([k, v]) => {
        flat[`${k}.read`] = v.view;
        flat[`${k}.create`] = v.create;
        flat[`${k}.update`] = v.update;
        flat[`${k}.delete`] = v.delete;
      });
      onChange?.(flat);

      return updated;
    });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
            <th className="p-4 font-bold uppercase">Functional ERP Module</th>
            <th className="p-4 font-bold uppercase text-center w-24">View / Read</th>
            <th className="p-4 font-bold uppercase text-center w-24">Create / Add</th>
            <th className="p-4 font-bold uppercase text-center w-24">Update / Edit</th>
            <th className="p-4 font-bold uppercase text-center w-24">Delete / Revoke</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {DEFAULT_MODULES.map((mod) => {
            const row = matrix[mod.key] || { view: true, create: false, update: false, delete: false };

            return (
              <tr key={mod.key} className="hover:bg-slate-900/40">
                <td className="p-4">
                  <p className="font-bold text-slate-100">{mod.label}</p>
                  <span className="font-mono text-slate-500 text-[10px] uppercase">
                    module.{mod.key}.*
                  </span>
                </td>

                {/* View */}
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={row.view}
                    disabled={isReadOnly}
                    onChange={() => toggle(mod.key, 'view')}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>

                {/* Create */}
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={row.create}
                    disabled={isReadOnly}
                    onChange={() => toggle(mod.key, 'create')}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>

                {/* Update */}
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={row.update}
                    disabled={isReadOnly}
                    onChange={() => toggle(mod.key, 'update')}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>

                {/* Delete */}
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={row.delete}
                    disabled={isReadOnly}
                    onChange={() => toggle(mod.key, 'delete')}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
