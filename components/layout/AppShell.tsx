"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Sidebar } from "@/components/shared/Sidebar";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const publicPaths = ["/login", "/signup"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (!isLoading && !user && !isPublicPath) {
      router.push("/login");
    }
    if (!isLoading && user && isPublicPath) {
      router.push("/dashboard");
    }
  }, [user, isLoading, isPublicPath, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isPublicPath) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-muted/10">
        {children}
      </main>
    </div>
  );
}
