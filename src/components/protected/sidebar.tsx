"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  DoorOpen,
  UserCircle,
  CreditCard,
  MessageCircle,
} from "lucide-react";

const menuItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/settings", label: "Setting", icon: Settings },
  { type: "separator" },
  { href: "/classes", label: "Classes", icon: GraduationCap },
  { href: "/room", label: "Room", icon: DoorOpen },
  { href: "/consultant", label: "Consultant", icon: UserCircle },
  { type: "separator" },
  { href: "/payment-invoices", label: "Payment & Invoices", icon: CreditCard },
  { href: "/contact-us", label: "Contact Us", icon: MessageCircle },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className={cn("flex flex-col w-64 border-r", className)}>
      {/* User Profile Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0 flex-1">
            <p className="font-medium text-sm truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress || "No email"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.type === "separator") {
            return <Separator key={`separator-${index}`} className="my-4" />;
          }

          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href as string}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
