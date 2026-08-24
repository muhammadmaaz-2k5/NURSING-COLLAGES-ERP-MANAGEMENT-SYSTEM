'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { TimetableSlot } from '../types/academic.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../context/ToastContext';

export interface TimetableGridProps {
  slots: TimetableSlot[];
}

const days = [
  { day: 1, name: 'Monday' },
  { day: 2, name: 'Tuesday' },
  { day: 3, name: 'Wednesday' },
  { day: 4, name: 'Thursday' },
  { day: 5, name: 'Friday' },
];

const timeRows = ['08:30', '10:00', '11:30', '13:00', '14:30'];

export const TimetableGrid: React.FC<TimetableGridProps> = ({ slots }) => {
  const toast = useToast();
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(slots);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clashError, setClashError] = useState<string | null>(null);

  const [form, setForm] = useState({
    subject: 'Fundamentals of Nursing II',
    subjectCode: 'FON-102',
    facultyName: 'Dr. Sarah Khan',
    roomName: 'Clinical Skills Lab 1',
    dayOfWeek: 1,
    startTime: '08:30',
    endTime: '10:00',
    sectionName: 'BSN-SecA',
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setClashError(null);

    // Conflict detection business rules check
    const roomConflict = timetableSlots.find(
      (s) =>
        s.dayOfWeek === Number(form.dayOfWeek) &&
        s.startTime === form.startTime &&
        s.roomName === form.roomName,
    );

    if (roomConflict) {
      setClashError(
        `🚨 Room Conflict: "${form.roomName}" is already occupied on ${days.find((d) => d.day === Number(form.dayOfWeek))?.name} at ${form.startTime} by ${roomConflict.subjectName}.`,
      );
      toast.error('Schedule Clash Detected', 'Room is double-booked.');
      return;
    }

    const facultyConflict = timetableSlots.find(
      (s) =>
        s.dayOfWeek === Number(form.dayOfWeek) &&
        s.startTime === form.startTime &&
        s.facultyName === form.facultyName,
    );

    if (facultyConflict) {
      setClashError(
        `🚨 Faculty Conflict: ${form.facultyName} is already assigned to a lecture in ${facultyConflict.roomName} at ${form.startTime}.`,
      );
      toast.error('Schedule Clash Detected', 'Faculty member double-booked.');
      return;
    }

    const newSlot: TimetableSlot = {
      id: `slot-${Date.now()}`,
      classId: 'cls-1',
      dayOfWeek: Number(form.dayOfWeek),
      startTime: form.startTime,
      endTime: form.endTime,
      subjectName: form.subject,
      subjectCode: form.subjectCode,
      facultyName: form.facultyName,
      roomName: form.roomName,
      sectionName: form.sectionName,
    };

    setTimetableSlots([...timetableSlots, newSlot]);
    toast.success('Lecture Scheduled', `${form.subject} added to timetable.`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Conflict Detection Guarantee */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-purple-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Interactive Weekly Timetable Engine</h3>
            <Badge variant="success" size="sm">
              Clash Detection Active
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated conflict prevention for faculty allocations, clinical labs, and classroom capacities.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setClashError(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Timetable Slot
        </Button>
      </div>

      {/* 5-Day Weekly Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-xs">
              <th className="p-4 w-28 font-bold uppercase">Time</th>
              {days.map((d) => (
                <th key={d.day} className="p-4 font-bold uppercase">
                  {d.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {timeRows.map((time) => (
              <tr key={time} className="hover:bg-slate-900/30">
                <td className="p-4 font-mono font-bold text-slate-400 bg-slate-950/90">{time}</td>
                {days.map((d) => {
                  const match = timetableSlots.find(
                    (s) => s.dayOfWeek === d.day && s.startTime === time,
                  );

                  return (
                    <td key={d.day} className="p-3 align-top min-h-[90px]">
                      {match ? (
                        <div className="p-3 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800/90 border border-blue-500/30 hover:border-blue-400 transition-all space-y-1.5 shadow-lg group">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                              {match.subjectCode}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {match.startTime} - {match.endTime}
                            </span>
                          </div>

                          <h5 className="font-bold text-slate-100 text-xs leading-tight group-hover:text-blue-300 transition-colors">
                            {match.subjectName}
                          </h5>

                          <div className="space-y-0.5 pt-1 text-[11px] text-slate-400">
                            <p className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-500" />
                              {match.facultyName}
                            </p>
                            <p className="flex items-center gap-1 font-medium text-emerald-400">
                              <MapPin className="w-3 h-3 text-emerald-500" />
                              {match.roomName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 rounded-xl border border-dashed border-slate-800/50 flex items-center justify-center text-[10px] text-slate-600">
                          Free Slot
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Slot Creation Modal with Clash Detection */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Timetable Slot"
        description="Allocate faculty, subject, and physical venue with automatic clash verification."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSlot}>
              Verify & Add Slot
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSlot} className="space-y-4">
          {clashError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2 animate-scale-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{clashError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject / Module *"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              options={[
                { value: 'Fundamentals of Nursing II', label: 'Fundamentals of Nursing II' },
                { value: 'Human Anatomy & Physiology II', label: 'Human Anatomy & Physiology II' },
                { value: 'Clinical Pharmacology', label: 'Clinical Pharmacology' },
                { value: 'Adult Health Nursing II', label: 'Adult Health Nursing II' },
                { value: 'Microbiology in Nursing', label: 'Microbiology in Nursing' },
              ]}
            />
            <Select
              label="Assigned Faculty *"
              value={form.facultyName}
              onChange={(e) => setForm({ ...form, facultyName: e.target.value })}
              options={[
                { value: 'Dr. Sarah Khan', label: 'Dr. Sarah Khan (Assistant Prof)' },
                { value: 'Dr. Tariq Mahmood', label: 'Dr. Tariq Mahmood (Associate Prof)' },
                { value: 'Dr. Usman Ali', label: 'Dr. Usman Ali (Senior Lecturer)' },
                { value: 'Dr. Nabila Akram', label: 'Dr. Nabila Akram (Clinical Supervisor)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Classroom / Simulation Lab *"
              value={form.roomName}
              onChange={(e) => setForm({ ...form, roomName: e.target.value })}
              options={[
                { value: 'Clinical Skills Lab 1', label: 'Clinical Skills Lab 1 (Cap: 30)' },
                { value: 'Lecture Hall 101', label: 'Lecture Hall 101 (Cap: 60)' },
                { value: 'Lecture Hall 102', label: 'Lecture Hall 102 (Cap: 60)' },
                { value: 'Anatomy Lab', label: 'Anatomy Wet Lab (Cap: 35)' },
                { value: 'Teaching Hospital Ward 4', label: 'Teaching Hospital Ward 4' },
              ]}
            />
            <Select
              label="Day of Week *"
              value={String(form.dayOfWeek)}
              onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
              options={[
                { value: '1', label: 'Monday' },
                { value: '2', label: 'Tuesday' },
                { value: '3', label: 'Wednesday' },
                { value: '4', label: 'Thursday' },
                { value: '5', label: 'Friday' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Start Time *"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              options={[
                { value: '08:30', label: '08:30 AM' },
                { value: '10:00', label: '10:00 AM' },
                { value: '11:30', label: '11:30 AM' },
                { value: '13:00', label: '01:00 PM' },
                { value: '14:30', label: '02:30 PM' },
              ]}
            />
            <Select
              label="End Time *"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              options={[
                { value: '10:00', label: '10:00 AM' },
                { value: '11:30', label: '11:30 AM' },
                { value: '13:00', label: '01:00 PM' },
                { value: '14:30', label: '02:30 PM' },
                { value: '16:00', label: '04:00 PM' },
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
