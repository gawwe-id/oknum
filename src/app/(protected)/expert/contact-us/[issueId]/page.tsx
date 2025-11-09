'use client';

import { Protect } from '@clerk/nextjs';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { IssueDetail } from '@/components/issues';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';

export default function StudentIssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as Id<'issues'>;

  const issue = useQuery(api.issues.getIssueById, { issueId });

  // Loading state
  if (issue === undefined) {
    return (
      <Protect>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Protect>
    );
  }

  // Not found state
  if (!issue) {
    return (
      <Protect>
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/contact-us')}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Contact Us
          </Button>
          <Empty>
            <EmptyTitle>Issue not found</EmptyTitle>
            <EmptyContent>
              <p>
                This issue does not exist or you don't have permission to view
                it.
              </p>
            </EmptyContent>
          </Empty>
        </div>
      </Protect>
    );
  }

  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            View your support ticket details and responses.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/contact-us')}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back to Issues
        </Button>
        <IssueDetail issueId={issueId} />
      </div>
    </Protect>
  );
}
