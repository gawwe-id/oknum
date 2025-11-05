"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ProtectedNavbarProps {
  onMenuClick?: () => void;
}

export function ProtectedNavbar({ onMenuClick }: ProtectedNavbarProps) {
  const currentUser = useQuery(api.users.getCurrentUserQuery);
  const userRole = currentUser?.role;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="container max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/oknum-logo.png"
              alt="Oknum Studio"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Role badge and logout button */}
        <div className="flex items-center gap-3">
          {userRole === "admin" && (
            <Badge variant="default" className="bg-primary">
              Admin
            </Badge>
          )}
          {userRole === "expert" && (
            <Badge variant="default" className="bg-primary">
              Expert
            </Badge>
          )}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
