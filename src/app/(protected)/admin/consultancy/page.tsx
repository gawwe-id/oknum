'use client';

import { Protect } from '@clerk/nextjs';
import { useState } from 'react';
import { useQuery } from 'convex-helpers/react/cache';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { ButtonPrimary } from '@/components/ui/button-primary';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ConsultantForm,
  ConsultantRequestList,
  ConsultantRequestDialog
} from '@/components/admin/consultants';
import { toast } from 'sonner';

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

type ConsultantCardProps = {
  consultant: Consultant;
  onEdit: (consultant: Consultant) => void;
  onDelete: (consultantId: Id<'consultants'>) => void;
};

function ConsultantCard({ consultant, onEdit, onDelete }: ConsultantCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      fuchsia: 'bg-fuchsia-500',
      emerald: 'bg-emerald-500',
      cyan: 'bg-cyan-500',
      amber: 'bg-amber-500',
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      teal: 'bg-teal-500',
      sky: 'bg-sky-500',
      violet: 'bg-violet-500',
      rose: 'bg-rose-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Color indicator */}
      <div className={`h-2 ${getColorClasses(consultant.color)}`} />

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{consultant.title}</CardTitle>
            <CardDescription className="text-sm">
              {consultant.subtitle}
            </CardDescription>
          </div>
          <Badge
            variant={consultant.status === 'active' ? 'default' : 'outline'}
          >
            {consultant.status === 'active' ? (
              <>
                <CheckCircle2 className="size-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="size-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {consultant.description}
        </p>

        {/* Includes */}
        {consultant.includes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
              Includes:
            </h4>
            <ul className="space-y-1">
              {consultant.includes.slice(0, 3).map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-muted-foreground flex items-center gap-2"
                >
                  <span className="size-1 rounded-full bg-current" />
                  {item}
                </li>
              ))}
              {consultant.includes.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{consultant.includes.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {consultant.technologies.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
              Technologies:
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.technologies.slice(0, 4).map((tech, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {consultant.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{consultant.technologies.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Order */}
        <div className="text-xs text-muted-foreground">
          Order: {consultant.order}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(consultant)}
            className="flex-1"
          >
            <Edit2 className="size-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(consultant._id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminConsultancyPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'services' | 'requests'>('services');
  const [statusFilter, setStatusFilter] = useState<
    'pending' | 'in_progress' | 'completed' | 'cancelled' | null
  >(null);
  const [selectedRequestId, setSelectedRequestId] =
    useState<Id<'consultantRequests'> | null>(null);

  const consultants = (useQuery(api.consultants.getAllConsultants, {}) ||
    []) as Consultant[];
  const deleteConsultant = useMutation(api.consultants.deleteConsultant);

  const handleEdit = (consultant: Consultant) => {
    setEditingConsultant(consultant);
  };

  const handleDelete = async (consultantId: Id<'consultants'>) => {
    if (
      !confirm(
        'Are you sure you want to delete this consultant? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await deleteConsultant({ consultantId });
      toast.success('Consultant deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete consultant'
      );
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    toast.success('Consultant created successfully');
  };

  const handleUpdateSuccess = () => {
    setEditingConsultant(null);
    toast.success('Consultant updated successfully');
  };

  const handleRequestClick = (requestId: Id<'consultantRequests'>) => {
    setSelectedRequestId(requestId);
  };

  const handleRequestUpdateSuccess = () => {
    setSelectedRequestId(null);
  };

  // Get request count for badge
  const allRequests = useQuery(api.consultants.getConsultantRequests, {});
  const requestCount = allRequests?.length || 0;

  return (
    <Protect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Consultancy</h1>
            <p className="text-muted-foreground mt-1">
              Manage consultancy services and requests
            </p>
          </div>
          {activeTab === 'services' && (
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <ButtonPrimary variant="solid" size="md">
                  <Plus className="size-4" />
                  Add Consultant
                </ButtonPrimary>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Consultant</DialogTitle>
                </DialogHeader>
                <ConsultantForm
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Tabs */}
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
                Services
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className={cn(
                  'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground'
                )}
              >
                Requests ({requestCount})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            {consultants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {consultants.map((consultant) => (
                  <ConsultantCard
                    key={consultant._id}
                    consultant={consultant}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                <p className="text-muted-foreground text-lg mb-2">
                  No consultants found
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Get started by creating your first consultant service
                </p>
                <ButtonPrimary
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="size-4" />
                  Add Consultant
                </ButtonPrimary>
              </div>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={statusFilter === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(null)}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('in_progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </Button>
                <Button
                  variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Cancelled
                </Button>
              </div>

              {/* Requests List */}
              <ConsultantRequestList
                statusFilter={statusFilter}
                onRequestClick={handleRequestClick}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Consultant Dialog */}
        {editingConsultant && (
          <Dialog
            open={!!editingConsultant}
            onOpenChange={(open) => !open && setEditingConsultant(null)}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Consultant</DialogTitle>
              </DialogHeader>
              <ConsultantForm
                consultant={editingConsultant}
                onSuccess={handleUpdateSuccess}
                onCancel={() => setEditingConsultant(null)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Request Management Dialog */}
        {selectedRequestId && (
          <ConsultantRequestDialog
            requestId={selectedRequestId}
            open={!!selectedRequestId}
            onOpenChange={(open) => !open && setSelectedRequestId(null)}
            onSuccess={handleRequestUpdateSuccess}
          />
        )}
      </div>
    </Protect>
  );
}
