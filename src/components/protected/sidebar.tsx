"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

export type MenuItem =
  | {
      href: string;
      label: string;
      icon: LucideIcon;
    }
  | {
      type: "separator";
    };

interface SidebarProps {
  className?: string;
  menuItems: MenuItem[];
}

export function Sidebar({ className, menuItems }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  // Find the most specific (longest) matching menu item
  const getActiveHref = () => {
    const validMenuItems = menuItems.filter(
      (item): item is Extract<MenuItem, { href: string }> =>
        !("type" in item && item.type === "separator")
    );

    let bestMatch: string | null = null;
    let bestMatchLength = 0;

    for (const item of validMenuItems) {
      const matches =
        pathname === item.href || pathname.startsWith(item.href + "/");
      if (matches && item.href.length > bestMatchLength) {
        bestMatch = item.href;
        bestMatchLength = item.href.length;
      }
    }

    return bestMatch;
  };

  const activeHref = getActiveHref();

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
          if ("type" in item && item.type === "separator") {
            return <Separator key={`separator-${index}`} className="my-4" />;
          }

          // TypeScript now knows item is a menu item (not separator)
          const menuItem = item as Extract<MenuItem, { href: string }>;
          const Icon = menuItem.icon;
          // Only active if it's the most specific match
          const isActive = activeHref === menuItem.href;

          return (
            <Link
              key={menuItem.href}
              href={menuItem.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{menuItem.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
