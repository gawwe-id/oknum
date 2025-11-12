'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';

interface AdditionalPerk {
  _id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
}

interface AdditionalPerksSectionProps {
  additionalPerks: AdditionalPerk[];
}

export default function AdditionalPerksSection({
  additionalPerks
}: AdditionalPerksSectionProps) {
  if (!additionalPerks || additionalPerks.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="size-5 text-emerald-600" />
          Additional Perks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalPerks.map((perk) => (
            <div
              key={perk._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-300 transition-colors"
            >
              {perk.image && (
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={perk.image}
                    alt={perk.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {perk.title}
                  </h4>
                  {perk.price > 0 && (
                    <Badge variant="outline" className="shrink-0 ml-2">
                      {formatPrice(perk.price)}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

