'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface Benefit {
  _id: string;
  emoji: string;
  text: string;
  order?: number;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
}

export default function BenefitsSection({ benefits }: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-emerald-600" />
          Manfaat yang Akan Anda Dapatkan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {benefits.map((benefit) => (
            <div
              key={benefit._id}
              className="flex items-start gap-3 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-2xl shrink-0">{benefit.emoji}</span>
              <p className="text-gray-700 leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
