'use client';

import * as React from 'react';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  User,
  Calendar,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';

type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | null;

interface ConsultantRequestListProps {
  statusFilter?: RequestStatus;
  onRequestClick?: (requestId: Id<'consultantRequests'>) => void;
}

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
  user?: {
    _id: Id<'users'>;
    name: string;
    email: string;
    role: 'student' | 'expert' | 'admin';
  } | null;
  consultant?: {
    _id: Id<'consultants'>;
    title: string;
    subtitle: string;
    color: string;
  } | null;
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
  statusFilter,
  onRequestClick
}: ConsultantRequestListProps) {
  const requests = useQuery(api.consultants.getConsultantRequests, {
    status: statusFilter || undefined
  }) as ConsultantRequest[] | undefined;

  if (requests === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No requests found</EmptyTitle>
        <EmptyContent>
          <p>
            {statusFilter
              ? `No ${statusFilter.replace('_', ' ')} requests found.`
              : 'No consultation requests found.'}
          </p>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card
          key={request._id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onRequestClick?.(request._id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">
                  {request.consultant?.title || 'Consultation Request'}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <User className="size-3" />
                    {request.user?.name || 'Unknown User'}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {request.user?.role || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    {request.consultant?.subtitle || 'Consultancy Service'}
                  </div>
                </div>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Request Message */}
            <div>
              <h4 className="text-xs font-semibold mb-1 text-muted-foreground">
                Request Message:
              </h4>
              <p className="text-sm text-foreground line-clamp-2">
                {request.message}
              </p>
            </div>

            {/* Admin Notes (if available) */}
            {request.adminNotes && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="text-xs font-semibold mb-1 text-muted-foreground">
                  Admin Notes:
                </h4>
                <p className="text-sm text-foreground line-clamp-2">
                  {request.adminNotes}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestClick?.(request._id);
                }}
              >
                <Edit className="size-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

