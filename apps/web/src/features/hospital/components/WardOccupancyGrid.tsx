'use client';

import React from 'react';
import { Bed, UserCheck, ShieldAlert, ArrowRightLeft, LogOut, Plus, Activity } from 'lucide-react';
import { HospitalWard, HospitalBed } from '../types/hospital.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export interface WardOccupancyGridProps {
  wards: HospitalWard[];
  onAdmitToBed?: (bed: HospitalBed) => void;
  onTransferBed?: (bed: HospitalBed) => void;
  onDischargeBed?: (bed: HospitalBed) => void;
}

export const WardOccupancyGrid: React.FC<WardOccupancyGridProps> = ({
  wards,
  onAdmitToBed,
  onTransferBed,
  onDischargeBed,
}) => {
  return (
    <div className="space-y-6">
      {wards.map((ward) => {
        const occupancyPct = Math.round((ward.occupiedBedsCount / (ward.capacity || 1)) * 100);

        return (
          <Card key={ward.id} className="p-6 space-y-4">
            {/* Ward Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{ward.name}</CardTitle>
                  <Badge variant="purple" size="sm">
                    {ward.floor || '1st Floor'}
                  </Badge>
                </div>
                <CardDescription>
                  Department: {ward.departmentName || 'General Healthcare Unit'}
                </CardDescription>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-300">
                    Occupied: <strong className="text-white">{ward.occupiedBedsCount}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300">
                    Available: <strong className="text-white">{ward.availableBedsCount}</strong>
                  </span>
                </div>
                <Badge
                  variant={occupancyPct > 85 ? 'danger' : occupancyPct > 50 ? 'warning' : 'success'}
                  size="sm"
                >
                  {occupancyPct}% Occupied
                </Badge>
              </div>
            </div>

            {/* Beds Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {ward.beds.map((bed) => {
                const isOccupied = bed.status === 'OCCUPIED';

                return (
                  <div
                    key={bed.id}
                    className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                      isOccupied
                        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                        : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                    }`}
                  >
                    {/* Bed Number & Status Pill */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bed
                          className={`w-4 h-4 ${
                            isOccupied ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        />
                        <span className="font-mono font-bold text-white text-xs">
                          {bed.bedNumber}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black font-mono uppercase tracking-wider ${
                          isOccupied
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                      </span>
                    </div>

                    {/* Occupant Context or Available State */}
                    {isOccupied && bed.currentAdmission ? (
                      <div className="my-2 space-y-0.5">
                        <p className="font-bold text-slate-100 text-xs truncate">
                          {bed.currentAdmission.patientName}
                        </p>
                        <p className="font-mono text-blue-400 text-[10px]">
                          {bed.currentAdmission.patientNo}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {bed.currentAdmission.diagnosis || 'Under Observation'}
                        </p>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-2">
                        <span className="text-[11px] text-emerald-400/80 font-medium">
                          Ready for Patient
                        </span>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                      {isOccupied ? (
                        <>
                          <button
                            title="Transfer Patient Bed"
                            onClick={() => onTransferBed?.(bed)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Discharge Patient"
                            onClick={() => onDischargeBed?.(bed)}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onAdmitToBed?.(bed)}
                          className="w-full py-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Admit Patient
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
