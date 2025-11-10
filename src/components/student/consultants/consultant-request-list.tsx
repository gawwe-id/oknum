'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { format } from 'date-fns';

type ConsultantRequest = {
  _id: Id<'consultantRequests'>;
  userId: Id<'users'>;
  consultantId: Id<'consultants'>;
  message: string;
  phone?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  adminNotes?: string;
  createdAt: number;
  updatedAt: number;
  consultant?: {
    _id: Id<'consultants'>;
    title: string;
    subtitle: string;
    color: string;
  } | null;
};

type ConsultantRequestListProps = {
  requests: ConsultantRequest[];
};

const getStatusBadge = (status: ConsultantRequest['status']) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" />
          Pending
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="default" className="bg-blue-600 gap-1">
          <Loader2 className="size-3 animate-spin" />
          In Progress
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="default" className="bg-emerald-600 gap-1">
          <CheckCircle2 className="size-3" />
          Completed
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="outline" className="text-destructive border-destructive gap-1">
          <XCircle className="size-3" />
          Cancelled
        </Badge>
      );
    default:
      return null;
  }
};

export function ConsultantRequestList({
  requests
}: ConsultantRequestListProps) {
  if (requests.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>You don't have any consultation requests yet.</p>
            <p className="text-sm mt-2">
              Browse available services to submit your first request!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">
                  {request.consultant?.title || 'Consultation Request'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {request.consultant?.subtitle || 'Consultancy Service'}
                </p>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Request Message */}
            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                Your Request:
              </h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {request.message}
              </p>
            </div>

            {/* Admin Notes (if available) */}
            {request.adminNotes && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                  Admin Response:
                </h4>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {request.adminNotes}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
              <span>
                Submitted:{' '}
                {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
              </span>
              {request.updatedAt !== request.createdAt && (
                <span>
                  Updated:{' '}
                  {format(new Date(request.updatedAt), 'MMM dd, yyyy HH:mm')}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

