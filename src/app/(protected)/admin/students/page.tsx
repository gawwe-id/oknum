"use client";

import { Protect } from "@clerk/nextjs";
import { StudentsTable } from "@/components/admin/students/students-table";

export default function AdminStudentsPage() {
  return (
    <Protect>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all registered students
          </p>
        </div>
        <StudentsTable />
      </div>
    </Protect>
  );
}
