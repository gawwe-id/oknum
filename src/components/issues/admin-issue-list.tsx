'use client';

import * as React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';
import { Loader2, MessageSquare, Calendar, User, Filter } from 'lucide-react';
import { format } from 'date-fns';

type Status = 'pending' | 'open' | 'in_progress' | 'resolved' | 'closed';
type Category = 'technical' | 'billing' | 'general';

interface AdminIssueListProps {
  onIssueClick?: (issueId: string) => void;
  statusFilter?: Status | null;
  categoryFilter?: Category | null;
  onStatusFilterChange?: (status: Status | null) => void;
  onCategoryFilterChange?: (category: Category | null) => void;
}

export function AdminIssueList({
  onIssueClick,
  statusFilter,
  categoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange
}: AdminIssueListProps) {
  const issues = useQuery(api.issues.getIssues, {
    status: statusFilter || undefined,
    category: categoryFilter || undefined
  });

  if (issues === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No issues found</EmptyTitle>
        <EmptyContent>
          <p>No issues match the current filters.</p>
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

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card
          key={issue._id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onIssueClick?.(issue._id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <CardTitle className="text-lg">{issue.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {issue.description}
                </p>
                {issue.user && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{issue.user.name}</span>
                    <span>•</span>
                    <span>{issue.user.email}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status.replace('_', ' ')}
                </Badge>
                <Badge className={getCategoryColor(issue.category)}>
                  {issue.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{issue.repliesCount || 0} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(issue.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
              {issue.evidences && issue.evidences.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">
                    {issue.evidences.length} image
                    {issue.evidences.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

