'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonPrimary } from '@/components/ui/button-primary';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';

type Consultant = {
  _id: Id<'consultants'>;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  includes: string[];
  technologies: string[];
  illustration?: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: number;
  updatedAt: number;
};

type ConsultantServiceCardProps = {
  consultant: Consultant;
  onRequest: () => void;
};

export function ConsultantServiceCard({
  consultant,
  onRequest
}: ConsultantServiceCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      fuchsia: 'bg-fuchsia-500',
      emerald: 'bg-emerald-500',
      cyan: 'bg-cyan-500',
      amber: 'bg-amber-500',
      blue: 'bg-blue-500',
      indigo: 'bg-indigo-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      teal: 'bg-teal-500',
      sky: 'bg-sky-500',
      violet: 'bg-violet-500',
      rose: 'bg-rose-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      {/* Color indicator */}
      <div className={cn('h-2', getColorClasses(consultant.color))} />

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{consultant.title}</CardTitle>
            <CardDescription className="text-sm">
              {consultant.subtitle}
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-emerald-600">
            <CheckCircle2 className="size-3 mr-1" />
            Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {consultant.description}
        </p>

        {/* Includes */}
        {consultant.includes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
              What's Included:
            </h4>
            <ul className="space-y-1">
              {consultant.includes.slice(0, 4).map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-muted-foreground flex items-center gap-2"
                >
                  <span className="size-1 rounded-full bg-current" />
                  {item}
                </li>
              ))}
              {consultant.includes.length > 4 && (
                <li className="text-xs text-muted-foreground">
                  +{consultant.includes.length - 4} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {consultant.technologies.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
              Technologies:
            </h4>
            <div className="flex flex-wrap gap-1">
              {consultant.technologies.slice(0, 5).map((tech, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {consultant.technologies.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{consultant.technologies.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          <ButtonPrimary
            variant="solid"
            size="md"
            onClick={onRequest}
            className="w-full"
          >
            <MessageCircle className="size-4" />
            Request Consultation
          </ButtonPrimary>
        </div>
      </CardContent>
    </Card>
  );
}

