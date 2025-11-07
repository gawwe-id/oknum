"use client";

import { useState } from "react";
import { ProtectedNavbar } from "@/components/protected/navbar";
import { Sidebar, MenuItem } from "@/components/protected/sidebar";
import { MobileSidebar } from "@/components/protected/mobile-sidebar";
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  UserCircle,
  CreditCard,
  MessageCircle,
  BookOpen,
} from "lucide-react";

const studentMenuItems: MenuItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
  { type: "separator" },
  { href: "/classes", label: "Classes", icon: GraduationCap },
  { href: "/enrollments", label: "Enrollments", icon: BookOpen },
  { href: "/consultant", label: "Consultant", icon: UserCircle },
  { type: "separator" },
  { href: "/payment-invoices", label: "Payment & Invoices", icon: CreditCard },
  { href: "/contact-us", label: "Contact Us", icon: MessageCircle },
];

export default function StudentLayout({
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
        <Sidebar className="hidden md:flex" menuItems={studentMenuItems} />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
          menuItems={studentMenuItems}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 md:ml-0">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
