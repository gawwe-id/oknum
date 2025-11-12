'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Schedule {
  _id: string;
  sessionNumber: string;
  sessionTitle?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  capacity: number;
  bookedSeats: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface SchedulesSectionProps {
  schedules: Schedule[];
}

export default function SchedulesSection({
  schedules
}: SchedulesSectionProps) {
  if (!schedules || schedules.length === 0) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge className="bg-emerald-600 text-white">Akan Datang</Badge>
        );
      case 'ongoing':
        return <Badge className="bg-blue-600 text-white">Berlangsung</Badge>;
      case 'completed':
        return <Badge className="bg-gray-600 text-white">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600 text-white">Dibatalkan</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Jadwal Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      Sesi {schedule.sessionNumber}
                    </h4>
                    {getStatusBadge(schedule.status)}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>
                        {format(new Date(schedule.startDate), 'EEEE, d MMMM yyyy', {
                          locale: id
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      <span>
                        {schedule.bookedSeats}/{schedule.capacity} peserta
                      </span>
                    </div>
                  </div>
                  {schedule.sessionTitle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {schedule.sessionTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

