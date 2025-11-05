"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar, MenuItem } from "./sidebar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItem[];
}

export function MobileSidebar({ open, onOpenChange, menuItems }: MobileSidebarProps) {
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <Sidebar className="md:hidden border-0 h-full" menuItems={menuItems} />
      </SheetContent>
    </Sheet>
  );
}
