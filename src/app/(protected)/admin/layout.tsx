'use client';

import { useState } from 'react';
import { ProtectedNavbar } from '@/components/protected/navbar';
import { Sidebar, MenuItem } from '@/components/protected/sidebar';
import { MobileSidebar } from '@/components/protected/mobile-sidebar';
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  MessageCircle,
  DollarSign,
  UserCog,
  Users,
  AlertTriangle
} from 'lucide-react';

const adminMenuItems: MenuItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { type: 'separator' },
  { href: '/admin/classes', label: 'Classes', icon: GraduationCap },
  { href: '/admin/consultancy', label: 'Consultancy', icon: MessageCircle },
  { type: 'separator' },
  { href: '/admin/experts', label: 'Experts', icon: UserCog },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { type: 'separator' },
  { href: '/admin/complains', label: 'Complains', icon: AlertTriangle }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ProtectedNavbar onMenuClick={() => setMobileSidebarOpen(true)} />

      <div className="container max-w-5xl mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" menuItems={adminMenuItems} />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
          menuItems={adminMenuItems}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 md:ml-0">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
