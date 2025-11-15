'use client';

import React, { useMemo } from 'react';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '@/../convex/_generated/api';
import { Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ClassItem from './class-item';
import type { ClassItem as ClassItemType } from './class-item';

export type SortOption = 'recency' | 'alphabetical';

interface ExclusiveClassIndexProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: SortOption;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function ExclusiveClassIndex({
  selectedCategory,
  onCategoryChange,
  sortBy,
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters
}: ExclusiveClassIndexProps) {
  const allClasses = useQuery(api.classes.getAllClassesPublic, {});
  const classesList = (allClasses ?? []) as ClassItemType[];
  const categories = useQuery(api.classes.getAllClassCategories, {});
  const categoriesList = categories ?? [];

  const filteredClasses = useMemo(() => {
    let filtered = classesList;

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'recency') {
      filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'alphabetical') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [classesList, selectedCategory, searchQuery, sortBy]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    }
    return `${mins} min`;
  };

  const getLessonsCount = (classItem: ClassItemType) => {
    return Math.max(1, Math.ceil(classItem.duration / 30));
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-8 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Left: Search and Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full md:w-64"
              />
            </div>
            <button
              onClick={onToggleFilters}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="size-5" />
            </button>
          </div>

          {/* Right: Category Tabs */}
          <div className="flex items-center flex-wrap justify-center">
            <button
              onClick={() => onCategoryChange(null)}
              className={`relative px-4 py-2 text-xs font-medium transition-colors rounded-lg ${
                selectedCategory === null
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Semua
              {selectedCategory === null && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
            {categoriesList.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`relative px-4 py-2 text-xs font-medium transition-colors rounded-lg ${
                  selectedCategory === category
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      {allClasses === undefined ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <div className="flex gap-4 mt-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        // Empty state
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? 'No courses found matching your search.'
              : 'No courses available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <ClassItem
              key={classItem._id}
              classItem={classItem}
              getLessonsCount={getLessonsCount}
              formatDuration={formatDuration}
            />
          ))}
        </div>
      )}
    </>
  );
}
