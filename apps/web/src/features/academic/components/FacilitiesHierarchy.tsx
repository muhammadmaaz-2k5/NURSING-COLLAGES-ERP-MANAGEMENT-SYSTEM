'use client';

import React, { useState } from 'react';
import { Building2, Layers, MapPin, Users, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { Campus, RoomType } from '../types/academic.types';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export interface FacilitiesHierarchyProps {
  campuses: Campus[];
}

export const FacilitiesHierarchy: React.FC<FacilitiesHierarchyProps> = ({ campuses }) => {
  const [expandedCampuses, setExpandedCampuses] = useState<Record<string, boolean>>({
    'camp-01': true,
  });

  const toggleCampus = (id: string) => {
    setExpandedCampuses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRoomTypeBadge = (type: RoomType) => {
    switch (type) {
      case 'CLASSROOM':
        return <Badge variant="primary" size="sm">Classroom</Badge>;
      case 'CLINICAL_SIMULATION':
        return <Badge variant="success" size="sm">Clinical Simulation Lab</Badge>;
      case 'LAB':
        return <Badge variant="purple" size="sm">Wet Science Lab</Badge>;
      case 'AUDITORIUM':
        return <Badge variant="warning" size="sm">Auditorium</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {campuses.map((camp) => (
        <Card key={camp.id} className="p-6 space-y-6">
          {/* Campus Header */}
          <div
            onClick={() => toggleCampus(camp.id)}
            className="flex items-center justify-between cursor-pointer select-none pb-4 border-b border-slate-800/80"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{camp.name}</h3>
                  <Badge variant="primary" size="sm">
                    {camp.code}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {camp.address}, {camp.city} • {camp.phone}
                </p>
              </div>
            </div>

            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
              {expandedCampuses[camp.id] ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Buildings & Rooms Nested List */}
          {expandedCampuses[camp.id] && (
            <div className="space-y-6 pt-2">
              {camp.buildings.map((bld) => (
                <div
                  key={bld.id}
                  className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-slate-100">{bld.name}</h4>
                      {bld.code && (
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {bld.code}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{bld.rooms.length} Allocated Rooms</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bld.rooms.map((rm) => (
                      <div
                        key={rm.id}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-xs font-bold text-blue-400">
                            {rm.roomNumber || 'RM'}
                          </span>
                          {getRoomTypeBadge(rm.type)}
                        </div>
                        <p className="text-xs font-semibold text-slate-200 truncate">{rm.name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>Capacity: {rm.capacity || 40} seats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
