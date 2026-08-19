"use client";

// The account control in the site header. Shows a plain sign-in link when
// nobody is signed in, and a dropdown with the user's name, their links, and
// sign out when they are. Admins additionally get a link into /admin.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, LayoutDashboard, Package, LogOut } from "lucide-react";

import styles from "./AccountMenu.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AccountMenu({ iconClassName }) {
  const { currentUser, isAdmin, isLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSignOut() {
    setOpen(false);
    signOut();
    router.push("/");
  }

  // While the session is being restored, keep the header stable by rendering
  // the same icon — just not interactive yet.
  if (isLoading || !currentUser) {
    return (
      <Link
        href="/auth/login"
        className={iconClassName}
        aria-label={isLoading ? "Loading account" : "Sign in"}
      >
        <UserRound size={20} strokeWidth={1.8} />
      </Link>
    );
  }

  const firstName = currentUser.name?.split(" ")[0] || "Account";

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={iconClassName}
        aria-label={`Account menu for ${currentUser.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        <UserRound size={20} strokeWidth={1.8} />
        <span className={styles.signedInDot} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.identity}>
            <strong>{firstName}</strong>
            <span>{currentUser.email}</span>

            {isAdmin && <span className={styles.roleBadge}>Admin</span>}
          </div>

          <div className={styles.links}>
            <Link href="/account" role="menuitem" onClick={() => setOpen(false)}>
              <UserRound size={16} strokeWidth={1.8} />
              My account
            </Link>

            <Link href="/order-history" role="menuitem" onClick={() => setOpen(false)}>
              <Package size={16} strokeWidth={1.8} />
              Order history
            </Link>

            {isAdmin && (
              <Link href="/admin" role="menuitem" onClick={() => setOpen(false)}>
                <LayoutDashboard size={16} strokeWidth={1.8} />
                Admin dashboard
              </Link>
            )}
          </div>

          <button
            type="button"
            className={styles.signOut}
            role="menuitem"
            onClick={handleSignOut}
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
