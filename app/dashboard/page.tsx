// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useEffect, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: profileLoading } = useUserProfile();

  // All hooks must be called before any early returns
  const handleLogout = useCallback(async () => {
    if (!user) return;
    console.log("[DashboardPage] Logout initiated:", user.uid);
    try {
      await signOut(auth);
      console.log("[DashboardPage] Sign out successful, redirecting");
      router.replace("/login");
    } catch (err) {
      console.error("[DashboardPage] Logout error:", err);
    }
  }, [user, router]);

  // Redirect admins to admin panel
  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (user && role === "admin") {
      router.replace("/admin");
    }
  }, [authLoading, profileLoading, user, role, router]);

  console.log("[DashboardPage] Component rendered:", {
    authLoading,
    profileLoading,
    hasUser: !!user,
    userId: user?.uid,
    userEmail: user?.email,
    role,
  });

  // Wait for BOTH auth + role to load
  if (authLoading || profileLoading) {
    console.log("[DashboardPage] Loading auth/profile...");
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm sm:text-base text-gray-600">Checking session...</p>
      </main>
    );
  }

  if (!user) {
    console.log("[DashboardPage] No user, redirecting to login");
    if (typeof window !== "undefined") {
      router.replace("/login");
    }
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm sm:text-base text-gray-600">Redirecting...</p>
      </main>
    );
  }

  console.log("[DashboardPage] User authenticated, rendering dashboard");

  const displayName = user.displayName || user.email || "User";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm w-full max-w-md bg-white">
        <h1 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
          Welcome, {displayName}
        </h1>

        <p className="text-xs sm:text-sm mb-4 text-gray-600">
          You are logged in as{" "}
          <span className="font-semibold">Student</span>.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 sm:py-2 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
          aria-label="Log out"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
