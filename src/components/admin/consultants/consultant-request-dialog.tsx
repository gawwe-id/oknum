'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex-helpers/react/cache';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ButtonPrimary } from '@/components/ui/button-primary';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, User, MessageSquare, Calendar, CheckCircle2, Phone } from 'lucide-react';
import { format } from 'date-fns';

type ConsultantRequestDialogProps = {
  requestId: Id<'consultantRequests'> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function ConsultantRequestDialog({
  requestId,
  open,
  onOpenChange,
  onSuccess
}: ConsultantRequestDialogProps) {
  const request = useQuery(
    api.consultants.getConsultantRequestById,
    requestId ? { requestId } : 'skip'
  );
  const updateRequest = useMutation(api.consultants.updateConsultantRequest);
  const deleteRequest = useMutation(api.consultants.deleteConsultantRequest);

  const [status, setStatus] = useState<
    'pending' | 'in_progress' | 'completed' | 'cancelled'
  >('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form when request loads
  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setAdminNotes(request.adminNotes || '');
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId) return;

    setIsSubmitting(true);

    try {
      await updateRequest({
        requestId,
        status,
        adminNotes: adminNotes.trim() || undefined
      });
      toast.success('Request updated successfully');
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!requestId) return;

    if (
      !confirm(
        'Are you sure you want to delete this request? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRequest({ requestId });
      toast.success('Request deleted successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete request'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!request) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-600">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-emerald-600">Completed</Badge>;
      case 'cancelled':
        return (
          <Badge variant="outline" className="text-destructive border-destructive">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Consultation Request</DialogTitle>
        </DialogHeader>

        {request === undefined ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Info */}
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">
                      {request.consultant?.title || 'Consultation Request'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.consultant?.subtitle || 'Consultancy Service'}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {request.user?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {request.user?.email || 'N/A'}
                      </div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {request.user?.role || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {request.phone ? (
                      <>
                        <Phone className="size-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Phone Number
                          </div>
                          <div className="font-medium">{request.phone}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Calendar className="size-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Submitted
                          </div>
                          <div className="font-medium">
                            {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Submitted
                      </div>
                      <div className="font-medium">
                        {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Request Message */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Request Message:
                </h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{request.message}</p>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <Field>
              <FieldLabel>Status *</FieldLabel>
              <FieldContent>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | 'pending'
                        | 'in_progress'
                        | 'completed'
                        | 'cancelled'
                    )
                  }
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  required
                  disabled={isSubmitting}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FieldContent>
            </Field>

            {/* Admin Notes */}
            <Field>
              <FieldLabel>Admin Notes</FieldLabel>
              <FieldContent>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request, response, or follow-up actions..."
                  rows={6}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  These notes will be visible to the user who made the request.
                </p>
              </FieldContent>
            </Field>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Request'
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancel
                </Button>
                <ButtonPrimary type="submit" variant="solid" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Update Request
                    </>
                  )}
                </ButtonPrimary>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


