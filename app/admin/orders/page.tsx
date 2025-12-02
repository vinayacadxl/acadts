// app/admin/orders/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useEffect } from "react";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authLoading, profileLoading, user, role, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Orders</h1>
        <p className="text-sm text-gray-600">View and manage customer orders.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-sm text-gray-600">Orders feature coming soon.</p>
      </div>
    </div>
  );
}

