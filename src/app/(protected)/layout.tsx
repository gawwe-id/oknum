"use client";

import { useState } from "react";
import { ProtectedNavbar } from "@/components/protected/navbar";
import { Sidebar } from "@/components/protected/sidebar";
import { MobileSidebar } from "@/components/protected/mobile-sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ProtectedNavbar onMenuClick={() => setMobileSidebarOpen(true)} />

      <div className="container max-w-5xl mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 md:ml-0">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
