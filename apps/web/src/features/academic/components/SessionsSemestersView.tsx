'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AcademicSession } from '../types/academic.types';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { formatDate } from '../../../lib/utils';

export interface SessionsSemestersViewProps {
  sessions: AcademicSession[];
}

export const SessionsSemestersView: React.FC<SessionsSemestersViewProps> = ({ sessions }) => {
  return (
    <div className="space-y-6">
      {sessions.map((sess) => (
        <Card key={sess.id} className="p-6 space-y-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{sess.name}</CardTitle>
                    {sess.isActive && (
                      <Badge variant="success" size="sm" dot>
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {formatDate(sess.startDate)} — {formatDate(sess.endDate)}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sess.semesters.map((sem) => (
              <div
                key={sem.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{sem.name}</h4>
                    <p className="text-[11px] text-blue-400 font-semibold">{sem.type} Cohort</p>
                  </div>
                  <Badge
                    variant={
                      sem.status === 'ACTIVE'
                        ? 'success'
                        : sem.status === 'COMPLETED'
                        ? 'neutral'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {sem.status}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Term Start:</span>
                    <span className="font-mono text-slate-300">{formatDate(sem.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Term Finish:</span>
                    <span className="font-mono text-slate-300">{formatDate(sem.endDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
