'use client';

import React, { useState } from 'react';
import ExclusiveClassHero from '@/views/exclusive-class/hero';
import ExclusiveClassIndex, { SortOption } from '@/views/exclusive-class/index';
import QnA from '@/views/exclusive-class/qna';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ExclusiveClassPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recency');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8 mb-20">
        <ExclusiveClassHero />
        <ExclusiveClassIndex
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
      </div>
      <QnA />
      <Footer />
    </div>
  );
}
