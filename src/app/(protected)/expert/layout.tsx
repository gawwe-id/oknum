"use client";

import { useState } from "react";
import { ProtectedNavbar } from "@/components/protected/navbar";
import { Sidebar, MenuItem } from "@/components/protected/sidebar";
import { MobileSidebar } from "@/components/protected/mobile-sidebar";
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  DoorOpen,
  Users,
  DollarSign,
  MessageCircle,
} from "lucide-react";

const expertMenuItems: MenuItem[] = [
  { href: "/expert/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/expert/settings", label: "Settings", icon: Settings },
  { type: "separator" },
  { href: "/expert/classes", label: "Classes", icon: GraduationCap },
  { href: "/expert/room", label: "Room", icon: DoorOpen },
  { type: "separator" },
  { href: "/expert/students", label: "Students", icon: Users },
  { href: "/expert/revenue", label: "Revenue", icon: DollarSign },
  { type: "separator" },
  { href: "/expert/contact-us", label: "Contact Us", icon: MessageCircle },
];

export default function ExpertLayout({
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
        <Sidebar className="hidden md:flex" menuItems={expertMenuItems} />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
          menuItems={expertMenuItems}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 md:ml-0">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
