"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Coffee, ShoppingCart, History, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "POS",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: Coffee,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: History,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Coffee className="h-6 w-6 text-primary" />
          <span>Meaningful Coffee</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="h-4 w-4 z-10" />
                <span className="z-10">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4 space-y-2">
        {user && (
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">{user.name}</span>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
