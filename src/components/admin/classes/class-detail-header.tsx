"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ClassDetailHeaderProps {
  title: string;
  description: string;
}

export function ClassDetailHeader({
  title,
  description,
}: ClassDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/admin/classes")}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
