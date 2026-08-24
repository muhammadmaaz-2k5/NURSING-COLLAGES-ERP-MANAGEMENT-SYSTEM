import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface VehicleCapacityIndicatorProps {
  capacity: number;
  allocated: number;
  showDetails?: boolean;
}

export const VehicleCapacityIndicator: React.FC<VehicleCapacityIndicatorProps> = ({
  capacity,
  allocated,
  showDetails = true,
}) => {
  const percent = Math.min(100, Math.round((allocated / (capacity || 1)) * 100));
  const isFull = allocated >= capacity;
  const available = Math.max(0, capacity - allocated);

  return (
    <div className="space-y-1.5 w-full">
      {showDetails && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400">
            Seating Capacity:{' '}
            <strong className="text-white">
              {allocated} / {capacity}
            </strong>
          </span>
          <span
            className={`font-mono font-bold ${
              isFull
                ? 'text-rose-400'
                : percent > 75
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {percent}% Full
          </span>
        </div>
      )}

      {/* Visual Bar */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFull
              ? 'bg-rose-500'
              : percent > 75
              ? 'bg-amber-500'
              : 'bg-gradient-to-r from-blue-500 to-emerald-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          {isFull ? (
            <span className="text-rose-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3 h-3" /> Vehicle Capacity Reached (0 Seats)
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> {available} Seats Available
            </span>
          )}
        </div>
      )}
    </div>
  );
};
