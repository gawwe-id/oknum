"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ClassDetailTabContent } from "./class-detail-tab-content";
import { ClassCurriculumTabContent } from "./class-curriculum-tab-content";
import { ClassSchedulesTabContent } from "./class-schedules-tab-content";

type ViewType = "detail" | "curriculum" | "schedules";

interface ClassDetailTabsProps {
  view: ViewType;
  onViewChange: (value: ViewType) => void;
  classData: any;
}

export function ClassDetailTabs({
  view,
  onViewChange,
  classData,
}: ClassDetailTabsProps) {
  return (
    <Tabs
      value={view}
      onValueChange={(value) => onViewChange(value as ViewType)}
    >
      <div className="w-full border-b">
        <TabsList className="w-fit justify-start h-auto p-0 bg-transparent border-0 rounded-none gap-0">
          <TabsTrigger
            value="detail"
            className={cn(
              "rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
            )}
          >
            Detail
          </TabsTrigger>
          <TabsTrigger
            value="curriculum"
            className={cn(
              "rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
            )}
          >
            Curriculum
          </TabsTrigger>
          <TabsTrigger
            value="schedules"
            className={cn(
              "rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
            )}
          >
            Schedules
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="detail" className="mt-6">
        <ClassDetailTabContent classData={classData} />
      </TabsContent>

      <TabsContent value="curriculum" className="mt-6">
        <ClassCurriculumTabContent />
      </TabsContent>

      <TabsContent value="schedules" className="mt-6">
        <ClassSchedulesTabContent />
      </TabsContent>
    </Tabs>
  );
}
