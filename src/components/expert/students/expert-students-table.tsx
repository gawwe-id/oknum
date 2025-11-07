"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

type StudentWithEnrollments = {
  _id: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
  enrollments: Array<{
    bookingId: string;
    classId: string;
    className: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    bookingDate: number;
    createdAt: number;
  }>;
  totalEnrollments: number;
};

const columns: ColumnDef<StudentWithEnrollments>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const student = row.original;
      const initials = student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{student.name}</span>
            <span className="text-sm text-muted-foreground">
              {student.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalEnrollments",
    header: "Enrollments",
    cell: ({ row }) => {
      const total = row.original.totalEnrollments;
      return (
        <div className="text-sm">
          <Badge variant="secondary">{total} class{total !== 1 ? "es" : ""}</Badge>
        </div>
      );
    },
  },
  {
    id: "enrollments",
    header: "Classes",
    cell: ({ row }) => {
      const enrollments = row.original.enrollments;
      return (
        <div className="flex flex-col gap-1 max-w-md">
          {enrollments.slice(0, 2).map((enrollment) => (
            <div key={enrollment.bookingId} className="flex items-center gap-2">
              <span className="text-sm truncate">{enrollment.className}</span>
              <Badge
                variant={
                  enrollment.paymentStatus === "paid" &&
                  enrollment.status === "confirmed"
                    ? "default"
                    : enrollment.status === "cancelled"
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs"
              >
                {enrollment.paymentStatus === "paid" &&
                enrollment.status === "confirmed"
                  ? "Active"
                  : enrollment.status === "cancelled"
                  ? "Cancelled"
                  : enrollment.paymentStatus === "paid"
                  ? "Paid"
                  : "Pending"}
              </Badge>
            </div>
          ))}
          {enrollments.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{enrollments.length - 2} more
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "First Enrollment",
    cell: ({ row }) => {
      const enrollments = row.original.enrollments;
      if (enrollments.length === 0) return <span className="text-sm">-</span>;
      
      const earliestEnrollment = enrollments.reduce((earliest, current) =>
        current.createdAt < earliest.createdAt ? current : earliest
      );
      
      const date = new Date(earliestEnrollment.createdAt);
      return (
        <div className="text-sm">
          {date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      );
    },
  },
];

export function ExpertStudentsTable() {
  const students = useQuery(api.bookings.getStudentsByExpert) || [];
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} students
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

