"use client";

import { Protect } from "@clerk/nextjs";
import { ExpertStudentsTable } from "@/components/expert/students";

export default function ExpertStudentsPage() {
  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            View students enrolled in your classes
          </p>
        </div>
        <ExpertStudentsTable />
      </div>
    </Protect>
  );
}
