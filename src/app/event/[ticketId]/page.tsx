'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function TicketVerificationPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  // Try to parse ticketId as booking ID
  let bookingId: Id<'bookings'> | null = null;
  try {
    bookingId = ticketId as Id<'bookings'>;
  } catch (error) {
    // Invalid ID format
  }

  const ticketData = useQuery(
    api.bookings.verifyTicket,
    bookingId ? { bookingId } : 'skip'
  );

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-900">
                  Ticket Tidak Valid
                </CardTitle>
              </div>
              <CardDescription className="text-red-700">
                Format ticket ID tidak valid.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (ticketData === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticketData.valid) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-900">
                  Ticket Tidak Valid
                </CardTitle>
              </div>
              <CardDescription className="text-red-700">
                {ticketData.error || 'Ticket tidak ditemukan atau tidak valid.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">
                Pastikan ticket ID yang Anda scan benar dan pembayaran sudah
                dikonfirmasi.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Status Card */}
        <Card className="border-green-200 bg-green-50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-900">Ticket Valid</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Ticket ini valid dan dapat digunakan untuk mengikuti kelas.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Ticket Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Ticket</CardTitle>
              <CardDescription>Detail ticket dan booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nomor Ticket
                </p>
                <p className="text-lg font-semibold">
                  {ticketData.ticketNumber}
                </p>
              </div>
              {ticketData.booking && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="default" className="bg-green-600">
                        {ticketData.booking.status === 'confirmed'
                          ? 'Terkonfirmasi'
                          : ticketData.booking.status}
                      </Badge>
                      <Badge variant="default" className="bg-blue-600">
                        {ticketData.booking.paymentStatus === 'paid'
                          ? 'Lunas'
                          : ticketData.booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tanggal Pemesanan
                    </p>
                    <p className="text-sm">
                      {format(
                        new Date(ticketData.booking.bookingDate),
                        'dd MMMM yyyy HH:mm',
                        { locale: idLocale }
                      )}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Class Info */}
          {ticketData.classItem && (
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kelas</CardTitle>
                <CardDescription>Detail kelas yang didaftar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kelas
                  </p>
                  <p className="text-lg font-semibold">
                    {ticketData.classItem.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kategori
                  </p>
                  <p className="text-sm">{ticketData.classItem.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tipe
                  </p>
                  <Badge variant="outline">
                    {ticketData.classItem.type === 'online'
                      ? 'Online'
                      : ticketData.classItem.type === 'offline'
                      ? 'Offline'
                      : 'Hybrid'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Participant Info */}
          {ticketData.user && (
            <Card>
              <CardHeader>
                <CardTitle>Informasi Peserta</CardTitle>
                <CardDescription>Data peserta yang terdaftar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nama
                    </p>
                    <p className="text-sm font-semibold">
                      {ticketData.user.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{ticketData.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schedules */}
          {ticketData.schedules && ticketData.schedules.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Jadwal Kelas</CardTitle>
                <CardDescription>Semua sesi yang didaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketData.schedules.map((schedule, index) => (
                    <div
                      key={schedule._id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Sesi {index + 1}</Badge>
                            <p className="font-semibold">
                              {schedule.sessionNumber}
                              {schedule.sessionTitle &&
                                ` - ${schedule.sessionTitle}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{schedule.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment Info */}
        {ticketData.payment && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informasi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  className={
                    ticketData.payment.status === 'success'
                      ? 'bg-green-600'
                      : 'bg-yellow-600'
                  }
                >
                  {ticketData.payment.status === 'success'
                    ? 'Lunas'
                    : ticketData.payment.status}
                </Badge>
                {ticketData.payment.paidAt && (
                  <span className="text-sm text-muted-foreground">
                    Dibayar pada:{' '}
                    {format(
                      new Date(ticketData.payment.paidAt),
                      'dd MMMM yyyy HH:mm',
                      { locale: idLocale }
                    )}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
