'use client';

import * as React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';
import { Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { IssueReplyForm } from './issue-reply-form';

interface AdminIssueDetailProps {
  issueId: Id<'issues'>;
}

export function AdminIssueDetail({ issueId }: AdminIssueDetailProps) {
  const issue = useQuery(api.issues.getIssueById, { issueId });
  const updateIssueStatus = useMutation(api.issues.updateIssueStatus);

  const [selectedStatus, setSelectedStatus] = React.useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  React.useEffect(() => {
    if (issue) {
      setSelectedStatus(issue.status);
    }
  }, [issue]);

  if (issue === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (issue === null) {
    return (
      <Empty>
        <EmptyTitle>Issue not found</EmptyTitle>
        <EmptyContent>
          <p>This issue does not exist.</p>
        </EmptyContent>
      </Empty>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'billing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === issue.status) return;

    setIsUpdatingStatus(true);
    try {
      await updateIssueStatus({
        issueId,
        status: selectedStatus as
          | 'pending'
          | 'open'
          | 'in_progress'
          | 'resolved'
          | 'closed'
      });
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update status. Please try again.'
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Issue Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-2xl">{issue.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status.replace('_', ' ')}
                </Badge>
                <Badge className={getCategoryColor(issue.category)}>
                  {issue.category}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {issue.user && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Submitted by</h3>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={issue.user.avatar} />
                  <AvatarFallback>
                    {issue.user.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{issue.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {issue.user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {issue.description}
            </p>
          </div>

          {issue.evidences && issue.evidences.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Evidence Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.evidences.map((evidence, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <img
                      src={evidence}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Update Status</h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-10 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUpdatingStatus}
              >
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus || selectedStatus === issue.status}
                size="sm"
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Replies ({issue.replies?.length || 0})
        </h2>

        {issue.replies && issue.replies.length > 0 ? (
          <div className="space-y-4">
            {issue.replies.map((reply) => (
              <Card key={reply._id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={reply.user?.avatar} />
                      <AvatarFallback>
                        {reply.user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {reply.user?.name || 'Unknown User'}
                        </span>
                        {reply.user?.role === 'admin' && (
                          <Badge variant="default" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(reply.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {reply.message}
                      </p>
                      {reply.attachments && reply.attachments.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {reply.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-md overflow-hidden border"
                            >
                              <img
                                src={attachment}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyTitle>No replies yet</EmptyTitle>
            <EmptyContent>
              <p>No one has replied to this issue yet.</p>
            </EmptyContent>
          </Empty>
        )}

        {/* Reply Form - Admin can always reply */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <IssueReplyForm
              issueId={issueId}
              onSuccess={() => {
                // Refetch will happen automatically via query
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
