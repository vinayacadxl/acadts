// app/admin/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: profileLoading } = useUserProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("[AdminLayout] Render:", {
    authLoading,
    profileLoading,
    hasUser: !!user,
    userId: user?.uid,
    role,
  });

  // Perform redirect on client when not admin
  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      console.log("[AdminLayout] No user, redirecting to /login");
      router.replace("/login");
      return;
    }

    if (role !== "admin") {
      console.log("[AdminLayout] Non-admin user, redirecting to /dashboard");
      router.replace("/dashboard");
    }
  }, [authLoading, profileLoading, user, role, router]);

  if (authLoading || profileLoading) {
    console.log("[AdminLayout] Still loading auth/profile");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-4 text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  if (!user || role !== "admin") {
    // While redirecting, show a simple message (prevents flashing admin UI)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-4 text-gray-600">Redirecting...</p>
      </div>
    );
  }

  console.log("[AdminLayout] Admin verified, rendering children");

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {sidebarOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full md:w-auto">{children}</main>
    </div>
  );
}
