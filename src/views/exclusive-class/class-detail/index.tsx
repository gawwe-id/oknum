'use client';

import React from 'react';
import ClassDetailHero from './hero';
import ClassInfo from './class-info';
import ExpertSection from './expert-section';
import CurriculumSection from './curriculum-section';
import SchedulesSection from './schedules-section';
import BenefitsSection from './benefits-section';
import JourneySection from './journey-section';
import AdditionalPerksSection from './additional-perks-section';
import LearningObjectivesSection from './learning-objectives-section';
import PrerequisitesSection from './prerequisites-section';

interface ClassDetailData {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  type: 'offline' | 'online' | 'hybrid';
  duration: number;
  thumbnail?: string;
  images?: string[];
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  minStudents?: number;
  maxStudents?: number;
  expert: {
    name: string;
    email?: string;
    bio?: string;
    profileImage?: string;
    userAvatar?: string;
  } | null;
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
  schedules: Array<{
    _id: string;
    sessionNumber: string;
    sessionTitle?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
    capacity: number;
    bookedSeats: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  }>;
  benefits: Array<{
    _id: string;
    emoji: string;
    text: string;
    order?: number;
  }>;
  journey: {
    steps: Array<{
      order: number;
      title: string;
      description: string;
    }>;
  } | null;
  additionalPerks: Array<{
    _id: string;
    title: string;
    description: string;
    image?: string;
    price: number;
  }>;
}

interface ClassDetailProps {
  classData: ClassDetailData;
}

export default function ClassDetail({ classData }: ClassDetailProps) {
  return (
    <div className="space-y-10 pb-10">
      {/* Hero Section */}
      <ClassDetailHero
        classId={classData._id}
        title={classData.title}
        description={classData.description}
        category={classData.category}
        price={classData.price}
        currency={classData.currency}
        thumbnail={classData.thumbnail}
        status={classData.status}
      />

      {/* Class Info */}
      <ClassInfo
        category={classData.category}
        type={classData.type}
        price={classData.price}
        currency={classData.currency}
        duration={classData.duration}
        minStudents={classData.minStudents}
        maxStudents={classData.maxStudents}
      />

      {/* Main Content Grid 8:4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8) - Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Curriculum Section */}
          <CurriculumSection curriculum={classData.curriculum} />

          {/* Journey Section */}
          <JourneySection journey={classData.journey} />

          <LearningObjectivesSection
            learningObjectives={classData.curriculum!.learningObjectives}
          />
          <PrerequisitesSection
            prerequisites={classData.curriculum!.prerequisites!}
          />

          {/* Additional Perks Section */}
          <AdditionalPerksSection additionalPerks={classData.additionalPerks} />
        </div>

        {/* Right Column (4) - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Expert Section */}
          <ExpertSection expert={classData.expert} />

          {/* Schedules Section */}
          <SchedulesSection schedules={classData.schedules} />

          {/* Benefits Section */}
          {classData.benefits.length > 0 && (
            <BenefitsSection benefits={classData.benefits} />
          )}
        </div>
      </div>
    </div>
  );
}
