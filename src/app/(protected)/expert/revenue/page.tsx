"use client";

import { Protect } from "@clerk/nextjs";
import { ExpertRevenueTable } from "@/components/expert/revenue";

export default function ExpertRevenuePage() {
  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Revenue</h1>
          <p className="text-muted-foreground mt-1">
            View your revenue from class enrollments
          </p>
        </div>
        <ExpertRevenueTable />
      </div>
    </Protect>
  );
}
