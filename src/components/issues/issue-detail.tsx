'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';
import { Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { IssueReplyForm } from './issue-reply-form';

interface IssueDetailProps {
  issueId: Id<'issues'>;
}

export function IssueDetail({ issueId }: IssueDetailProps) {
  const issue = useQuery(api.issues.getIssueById, { issueId });

  if (issue === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (issue === null) {
    return (
      <Empty title="Issue not found">
        <p>This issue does not exist.</p>
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

  const hasAdminReply = issue.replies?.some(
    (reply) => reply.user?.role === 'admin'
  );

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
              <p>Waiting for admin response...</p>
            </EmptyContent>
          </Empty>
        )}

        {/* Reply Form - Only show if admin has replied or user is admin */}
        {hasAdminReply && (
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
        )}
      </div>
    </div>
  );
}
