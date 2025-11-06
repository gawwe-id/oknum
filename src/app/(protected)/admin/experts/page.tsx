"use client";

import { Protect } from "@clerk/nextjs";
import { ExpertsTable } from "@/components/admin/experts/experts-table";

export default function AdminExpertsPage() {
  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Experts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered experts
          </p>
        </div>
        <ExpertsTable />
      </div>
    </Protect>
  );
}
