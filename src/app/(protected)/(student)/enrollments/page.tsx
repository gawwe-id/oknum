'use client';

import { Protect } from '@clerk/nextjs';
import * as React from 'react';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  CardEnrollment,
  type BookingWithDetails
} from '@/components/admin/enrollments/card-enrollment';

export default function EnrollmentsPage() {
  const bookings = useQuery(api.bookings.getBookingsByUser, {});
  const currentUser = useQuery(api.users.getCurrentUserQuery, {});

  if (bookings === undefined || currentUser === undefined) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Enrollments</h1>
          <p className="text-muted-foreground">Manage your enrolled classes</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="shadow-none">
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any enrollments yet.</p>
                <p className="text-sm mt-2">
                  Browse classes to start enrolling!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking: BookingWithDetails) => (
              <CardEnrollment key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </Protect>
  );
}
