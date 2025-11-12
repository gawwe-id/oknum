'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';

interface PrerequisitesSectionProps {
  prerequisites: string[];
}

export default function PrerequisitesSection({
  prerequisites
}: PrerequisitesSectionProps) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="size-5 text-emerald-600" />
          Prasyarat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {prerequisites.map((prerequisite, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span className="text-gray-700">{prerequisite}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
