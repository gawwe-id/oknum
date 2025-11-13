'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { useQuery as useCachedQuery } from 'convex-helpers/react/cache';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ButtonPrimary } from '@/components/ui/button-primary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DialogPayment } from '@/components/dialog/dialog-payment';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useUser();
  const classId = params.classId as Id<'classes'>;

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (authLoaded && !isSignedIn) {
      const returnUrl = encodeURIComponent(
        `/exclusive-class/${classId}/checkout`
      );
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [authLoaded, isSignedIn, router, classId]);

  // Fetch public data (doesn't require auth) - hooks must be called at top level
  const classData = useCachedQuery(api.classes.getClassByIdPublic, { classId });
  const schedules = useQuery(api.schedules.getSchedulesByClass, { classId });

  // Only fetch auth-required queries if authenticated to prevent UNAUTHENTICATED error
  // Since hooks must be called at top level, we always call them but conditionally pass args
  // getCurrentUserQuery is safe (returns null if not authenticated)
  const currentUser = useQuery(api.users.getCurrentUserQuery, {});

  // getBookingsByUser requires authentication and will throw UNAUTHENTICATED error if not authenticated
  // We skip calling it by passing undefined when not authenticated
  // Convex useQuery will return undefined if args are undefined
  const userBookings = useQuery(
    api.bookings.getBookingsByUser,
    authLoaded && isSignedIn ? {} : undefined
  ) as any;
  const createBooking = useMutation(api.bookings.createBooking);

  const [isEnrolling, setIsEnrolling] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<Id<'bookings'> | null>(null);
  const [selectedScheduleIds, setSelectedScheduleIds] = React.useState<
    Id<'schedules'>[]
  >([]);

  // Check if user has already enrolled in this class
  const hasEnrolled = React.useMemo(() => {
    if (!userBookings || !classId) return false;
    return userBookings.some(
      (booking: any) =>
        booking.classId === classId &&
        (booking.status === 'pending' ||
          booking.status === 'confirmed' ||
          booking.status === 'completed')
    );
  }, [userBookings, classId]);

  // Get available schedules (upcoming only)
  const availableSchedules = React.useMemo(() => {
    if (!schedules) return [];
    return schedules.filter(
      (schedule) =>
        schedule.status === 'upcoming' &&
        schedule.bookedSeats < schedule.capacity
    );
  }, [schedules]);

  // Auto-select all available schedules if none selected
  React.useEffect(() => {
    if (availableSchedules.length > 0 && selectedScheduleIds.length === 0) {
      setSelectedScheduleIds(availableSchedules.map((s) => s._id));
    }
  }, [availableSchedules, selectedScheduleIds.length]);

  const handleScheduleToggle = (scheduleId: Id<'schedules'>) => {
    setSelectedScheduleIds((prev) => {
      if (prev.includes(scheduleId)) {
        return prev.filter((id) => id !== scheduleId);
      } else {
        return [...prev, scheduleId];
      }
    });
  };

  const handleEnroll = async () => {
    if (!classData || selectedScheduleIds.length === 0) {
      toast.error('Pilih setidaknya satu jadwal untuk mendaftar');
      return;
    }

    if (hasEnrolled) {
      toast.info('Anda sudah terdaftar di kelas ini');
      return;
    }

    if (!currentUser) {
      toast.error(
        'Informasi pengguna tidak tersedia. Silakan refresh halaman.'
      );
      return;
    }

    setIsEnrolling(true);
    try {
      // Step 1: Create booking first
      const newBookingId = await createBooking({
        classId: classData._id,
        scheduleIds: selectedScheduleIds
      });

      // Step 2: Open payment dialog
      setBookingId(newBookingId);
      setPaymentDialogOpen(true);
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal mendaftar. Silakan coba lagi.'
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Pembayaran berhasil diproses!');
    // Redirect to enrollments page after a short delay
    setTimeout(() => {
      router.push('/enrollments');
    }, 2000);
  };

  // Show loading if auth is not loaded yet
  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (
    classData === undefined ||
    schedules === undefined ||
    currentUser === undefined
  ) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-24" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="lg:col-span-4">
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!classData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-6">
            <Link href="/exclusive-class">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="size-4" />
                Kembali
              </Button>
            </Link>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Kelas Tidak Ditemukan
              </h1>
              <p className="text-gray-600 mb-6">
                Kelas yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Link href="/exclusive-class">
                <Button>Lihat Semua Kelas</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency === 'IDR' ? 'IDR' : 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/exclusive-class/${classId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Kembali ke Detail Kelas
            </Button>
          </Link>
        </div>

        {/* Already Enrolled Message */}
        {hasEnrolled && (
          <Card className="mb-6 border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    Anda sudah terdaftar di kelas ini
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Silakan cek halaman enrollments untuk detail lebih lanjut.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid Layout 8:4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8) - Detail Class */}
          <div className="lg:col-span-8 space-y-6">
            {/* Class Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Kelas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {classData.thumbnail && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={classData.thumbnail}
                        alt={classData.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {classData.title}
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      {classData.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{classData.category}</Badge>
                      <Badge variant="outline" className="capitalize">
                        {classData.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Pilih Jadwal</CardTitle>
              </CardHeader>
              <CardContent>
                {availableSchedules.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                    <AlertCircle className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Tidak ada jadwal tersedia
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Semua jadwal untuk kelas ini sudah penuh atau tidak
                        tersedia.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableSchedules.map((schedule) => {
                      const isSelected = selectedScheduleIds.includes(
                        schedule._id
                      );
                      const isFull = schedule.bookedSeats >= schedule.capacity;

                      return (
                        <button
                          key={schedule._id}
                          type="button"
                          onClick={() =>
                            !isFull && handleScheduleToggle(schedule._id)
                          }
                          disabled={isFull}
                          className={cn(
                            'w-full text-left p-4 border rounded-lg transition-all',
                            isSelected &&
                              'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2',
                            !isSelected &&
                              !isFull &&
                              'hover:border-primary/50 hover:bg-muted/50',
                            isFull && 'opacity-50 cursor-not-allowed bg-muted'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  Sesi {schedule.sessionNumber}
                                </h3>
                                {schedule.sessionTitle && (
                                  <span className="text-sm text-muted-foreground">
                                    - {schedule.sessionTitle}
                                  </span>
                                )}
                                {isSelected && (
                                  <CheckCircle2 className="size-4 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {formatDate(schedule.startDate)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {schedule.startTime} - {schedule.endTime} (
                                {schedule.timezone})
                              </p>
                              <div className="mt-2 flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">
                                  Kapasitas: {schedule.bookedSeats} /{' '}
                                  {schedule.capacity}
                                </span>
                                {schedule.location.type === 'online' &&
                                  schedule.location.onlineLink && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Online
                                    </Badge>
                                  )}
                                {schedule.location.type === 'offline' &&
                                  schedule.location.address && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {schedule.location.city || 'Offline'}
                                    </Badge>
                                  )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4) - Payment Summary & Actions */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Harga Kelas</span>
                      <span className="font-medium">
                        {formatPrice(classData.price, classData.currency)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatPrice(classData.price, classData.currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button */}
              <div className="space-y-3">
                <ButtonPrimary
                  onClick={handleEnroll}
                  disabled={
                    isEnrolling ||
                    classData.status !== 'published' ||
                    availableSchedules.length === 0 ||
                    selectedScheduleIds.length === 0 ||
                    hasEnrolled
                  }
                  className="w-full"
                  size="lg"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Lanjutkan ke Pembayaran'
                  )}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Dialog */}
        {bookingId && classData && currentUser && (
          <DialogPayment
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            bookingId={bookingId}
            classData={{
              title: classData.title,
              price: classData.price,
              currency: classData.currency || 'IDR'
            }}
            customerInfo={{
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
