'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

interface JourneyStep {
  order: number;
  title: string;
  description: string;
}

interface JourneySectionProps {
  journey: {
    steps: JourneyStep[];
  } | null;
}

export default function JourneySection({ journey }: JourneySectionProps) {
  if (!journey || !journey.steps || journey.steps.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="size-5 text-emerald-600" />
          Perjalanan Pembelajaran
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {journey.steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              {/* Step Number */}
              <div className="shrink-0">
                <div className="flex items-center justify-center size-10 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  {step.order}
                </div>
                {index < journey.steps.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mx-auto mt-2 min-h-[40px]" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-6 last:pb-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

