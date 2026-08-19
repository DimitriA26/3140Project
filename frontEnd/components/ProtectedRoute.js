"use client";

// Wrap any page that requires a signed-in user:
//
//   export default function OrdersPage() {
//     return (
//       <ProtectedRoute>
//         <OrdersContent />
//       </ProtectedRoute>
//     );
//   }
//
// Anonymous visitors are sent to /auth/login?redirect=<page they wanted>, so the
// login page can send them back after a successful sign-in.

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for the session restore to finish, otherwise a page refresh would
    // redirect the user out before we know whether they are signed in.
    if (isLoading || isAuthenticated) {
      return;
    }

    router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return <Spinner fullPage label="Checking your session…" />;
  }

  // Render nothing for the frame between "not signed in" and the redirect.
  if (!isAuthenticated) {
    return null;
  }

  return children;
}
