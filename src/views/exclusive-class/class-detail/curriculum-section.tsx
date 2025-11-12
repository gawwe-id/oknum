'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Package } from 'lucide-react';

interface CurriculumSectionProps {
  curriculum: {
    modules: Array<{
      order: number;
      title: string;
      description: string;
      duration: number;
      topics: string[];
    }>;
    learningObjectives: string[];
    prerequisites?: string[];
    materials?: string[];
  } | null;
}

export default function CurriculumSection({
  curriculum
}: CurriculumSectionProps) {
  if (!curriculum) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours} jam ${mins} menit`;
    } else if (hours > 0) {
      return `${hours} jam`;
    }
    return `${mins} menit`;
  };

  return (
    <div className="space-y-6">
      {/* Modules */}
      {curriculum.modules.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-600" />
              Kurikulum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {curriculum.modules.map((module, index) => (
                <div
                  key={index}
                  className="border-l-4 border-emerald-500 pl-4 pb-4 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Modul {module.order}: {module.title}
                      </h4>
                      <p className="text-gray-600 mt-1">{module.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-4 shrink-0">
                      {formatDuration(module.duration)}
                    </Badge>
                  </div>
                  {module.topics.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Topik Pembahasan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic, topicIndex) => (
                          <Badge
                            key={topicIndex}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials */}
      {curriculum.materials && curriculum.materials.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5 text-emerald-600" />
              Materi & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {curriculum.materials.map((material, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span className="text-gray-700">{material}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

