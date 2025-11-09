'use client';

import * as React from 'react';
import { Protect } from '@clerk/nextjs';
import { AdminIssueList, AdminIssueDetail } from '@/components/issues';
import { Id } from '../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';

type Status = 'pending' | 'open' | 'in_progress' | 'resolved' | 'closed' | null;
type Category = 'technical' | 'billing' | 'general' | null;

export default function AdminComplainsPage() {
  const [selectedIssueId, setSelectedIssueId] =
    React.useState<Id<'issues'> | null>(null);
  const [activeTab, setActiveTab] = React.useState<'list' | 'detail'>('list');
  const [statusFilter, setStatusFilter] = React.useState<Status>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<Category>(null);
  const [showFilters, setShowFilters] = React.useState(false);

  const handleIssueClick = (issueId: string) => {
    setSelectedIssueId(issueId as Id<'issues'>);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedIssueId(null);
    setActiveTab('list');
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setCategoryFilter(null);
  };

  const hasActiveFilters = statusFilter !== null || categoryFilter !== null;

  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complains</h1>
          <p className="text-muted-foreground">
            Manage and respond to all support tickets from students and experts.
          </p>
        </div>

        {activeTab === 'detail' && selectedIssueId ? (
          <div className="space-y-4">
            <button
              onClick={handleBackToList}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Issues
            </button>
            <AdminIssueDetail issueId={selectedIssueId} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {showFilters && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Status
                      </label>
                      <select
                        value={statusFilter || ''}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value ? (e.target.value as Status) : null
                          )
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <select
                        value={categoryFilter || ''}
                        onChange={(e) =>
                          setCategoryFilter(
                            e.target.value ? (e.target.value as Category) : null
                          )
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">All Categories</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issues List */}
            <AdminIssueList
              onIssueClick={handleIssueClick}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              onStatusFilterChange={setStatusFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          </div>
        )}
      </div>
    </Protect>
  );
}
