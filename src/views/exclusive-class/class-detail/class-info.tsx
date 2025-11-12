'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Monitor } from 'lucide-react';

interface ClassInfoProps {
  category: string;
  type: 'offline' | 'online' | 'hybrid';
  price: number;
  currency: string;
  duration: number;
  minStudents?: number;
  maxStudents?: number;
}

export default function ClassInfo({
  category,
  type,
  duration,
  minStudents,
  maxStudents
}: ClassInfoProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency === 'IDR' ? 'IDR' : 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours} jam ${mins} menit`;
    } else if (hours > 0) {
      return `${hours} jam`;
    }
    return `${mins} menit`;
  };

  const getTypeLabel = (type: 'offline' | 'online' | 'hybrid') => {
    switch (type) {
      case 'offline':
        return 'Offline';
      case 'online':
        return 'Online';
      case 'hybrid':
        return 'Hybrid';
    }
  };

  const getTypeIcon = (type: 'offline' | 'online' | 'hybrid') => {
    switch (type) {
      case 'offline':
        return <MapPin className="size-5" />;
      case 'online':
        return <Monitor className="size-5" />;
      case 'hybrid':
        return <Monitor className="size-5" />;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Informasi Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Kategori</p>
            <Badge
              variant="outline"
              className="text-emerald-700 border-emerald-200 bg-emerald-50"
            >
              {category}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Tipe Kelas</p>
            <div className="flex items-center gap-2">
              {getTypeIcon(type)}
              <Badge variant="outline" className="capitalize">
                {getTypeLabel(type)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Durasi</p>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-gray-400" />
              <p className="font-medium">{formatDuration(duration)}</p>
            </div>
          </div>

          {(minStudents || maxStudents) && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Kapasitas Peserta</p>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-gray-400" />
                <p className="font-medium">
                  {minStudents || 0} - {maxStudents || '∞'} peserta
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
