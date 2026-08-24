import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { TransportStop } from '../types/transport.types';

export const RouteTimeline: React.FC<{ stops: TransportStop[] }> = ({ stops }) => {
  const sorted = [...stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {sorted.map((stop, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === sorted.length - 1;

        return (
          <div key={stop.id} className="relative flex items-start gap-4">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isFirst
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : isLast
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <div className="flex-1 bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                    Stop #{stop.sequence}
                  </span>
                  {isFirst && (
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.2 rounded">
                      ORIGIN
                    </span>
                  )}
                  {isLast && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                      TERMINAL
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">{stop.name}</h4>
              </div>

              {stop.pickupTime && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{stop.pickupTime}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
