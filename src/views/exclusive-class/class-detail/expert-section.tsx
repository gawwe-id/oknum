"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ExpertSectionProps {
  expert: {
    name: string;
    email?: string;
    bio?: string;
    profileImage?: string;
    userAvatar?: string;
    slug?: string;
  } | null;
}

export default function ExpertSection({ expert }: ExpertSectionProps) {
  if (!expert) return null;

  const initials = expert.name
    ? expert.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "E";

  const avatarUrl = expert.userAvatar || expert.profileImage;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Tentang Expert</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={expert.name}
              className="size-20 md:size-24 rounded-lg object-cover"
            />
          ) : (
            <div className="size-20 md:size-24 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-semibold">
              {initials}
            </div>
          )}
          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
            {expert.email && <p className="text-gray-600">{expert.email}</p>}
            {expert.bio && (
              <p className="text-gray-600 leading-relaxed mt-4 line-clamp-3">
                {expert.bio}
              </p>
            )}
            {expert.slug && (
              <div className="mt-4">
                <Link href={`/our-experts/${expert.slug}`}>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="w-full md:w-auto"
                  >
                    Lihat Profil Expert
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
