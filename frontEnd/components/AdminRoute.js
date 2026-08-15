"use client";

// Wrap any page under /admin. Anonymous visitors get sent to the login page;
// signed-in customers get a clear "not allowed" message rather than a silent
// redirect, which makes the non-admin test case easy to demo.
//
// This is a convenience guard, not security — the real enforcement is
// requireAdmin on the backend. Never rely on this alone.

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return <Spinner fullPage label="Checking your permissions…" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ paddingBlock: "64px" }}>
        <EmptyState
          title="Admin access required"
          description="You are signed in, but this area is limited to administrator accounts."
          action={<Link href="/">Back to home</Link>}
        />
      </div>
    );
  }

  return children;
}
