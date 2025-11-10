'use client';

import * as React from 'react';
import { Protect } from '@clerk/nextjs';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import {
  ConsultantServiceCard,
  ConsultantRequestForm,
  ConsultantRequestList
} from '@/components/student/consultants';

type Consultant = {
  _id: Id<'consultants'>;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  includes: string[];
  technologies: string[];
  illustration?: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: number;
  updatedAt: number;
};

export default function ExpertConsultancyPage() {
  const [activeTab, setActiveTab] = React.useState<'services' | 'requests'>(
    'services'
  );
  const [selectedConsultant, setSelectedConsultant] =
    React.useState<Consultant | null>(null);

  const consultants = useQuery(api.consultants.getConsultants, {});
  const requests = useQuery(api.consultants.getConsultantRequestsByUser, {});

  const handleRequestSuccess = () => {
    setSelectedConsultant(null);
    setActiveTab('requests');
  };

  if (consultants === undefined || requests === undefined) {
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
          <h1 className="text-3xl font-bold mb-2">Consultancy</h1>
          <p className="text-muted-foreground">
            Find and request consultancy services from Oknum Studio experts
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        >
          <div className="w-full border-b">
            <TabsList className="w-fit justify-start h-auto p-0 bg-transparent border-0 rounded-none gap-0">
              <TabsTrigger
                value="services"
                className={cn(
                  'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
                )}
              >
                Available Services
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className={cn(
                  'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
                )}
              >
                My Requests ({requests.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="services" className="mt-6">
            {consultants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {consultants.map((consultant: Consultant) => (
                  <ConsultantServiceCard
                    key={consultant._id}
                    consultant={consultant}
                    onRequest={() => setSelectedConsultant(consultant)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                <p className="text-muted-foreground text-lg mb-2">
                  No consultancy services available
                </p>
                <p className="text-muted-foreground text-sm">
                  Check back later for new services
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <ConsultantRequestList requests={requests} />
          </TabsContent>
        </Tabs>

        {/* Request Dialog */}
        {selectedConsultant && (
          <ConsultantRequestForm
            consultant={selectedConsultant}
            open={!!selectedConsultant}
            onOpenChange={(open) => !open && setSelectedConsultant(null)}
            onSuccess={handleRequestSuccess}
          />
        )}
      </div>
    </Protect>
  );
}
