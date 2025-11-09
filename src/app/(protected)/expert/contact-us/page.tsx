'use client';

import * as React from 'react';
import { Protect } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { IssueForm, IssueList } from '@/components/issues';
import { useRouter } from 'next/navigation';

export default function ExpertContactUsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'list' | 'create'>('list');

  const handleIssueClick = (issueId: string) => {
    router.push(`/contact-us/${issueId}`);
  };

  const handleCreateSuccess = () => {
    setActiveTab('list');
  };

  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Get in touch with our support team. Create a ticket or view your
            existing issues.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        >
          <div className="w-full border-b">
            <TabsList className="w-fit justify-start h-auto p-0 bg-transparent border-0 rounded-none gap-0">
              <TabsTrigger
                value="list"
                className={cn(
                  'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
                )}
              >
                My Issues
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className={cn(
                  'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
                )}
              >
                Create Issue
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list" className="mt-6">
            <IssueList onIssueClick={handleIssueClick} />
          </TabsContent>
          <TabsContent value="create" className="mt-6">
            <IssueForm onSuccess={handleCreateSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </Protect>
  );
}
