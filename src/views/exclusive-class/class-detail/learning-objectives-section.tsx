'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface LearningObjectivesSectionProps {
  learningObjectives: string[];
}

export default function LearningObjectivesSection({
  learningObjectives
}: LearningObjectivesSectionProps) {
  if (!learningObjectives || learningObjectives.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-5 text-emerald-600" />
          Tujuan Pembelajaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {learningObjectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span className="text-gray-700">{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
