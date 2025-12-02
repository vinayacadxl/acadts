// app/admin/tests/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { listTests, deleteTest } from "@/lib/db/tests";
import type { Test } from "@/lib/types/test";

export default function AdminTestsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: profileLoading } = useUserProfile();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    console.log("[AdminTestsPage] Fetching tests");
    setLoading(true);
    setError(null);

    try {
      const data = await listTests();
      console.log("[AdminTestsPage] Tests loaded:", {
        count: data.length,
      });
      setTests(data);
    } catch (err) {
      console.error("[AdminTestsPage] Error fetching tests:", err);
      setError("Failed to load tests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      console.log("[AdminTestsPage] No user, redirecting to login");
      router.replace("/login");
      return;
    }

    if (role !== "admin") {
      console.log("[AdminTestsPage] Non-admin user, redirecting to dashboard");
      router.replace("/dashboard");
      return;
    }

    fetchTests();
  }, [authLoading, profileLoading, user, role, router, fetchTests]);

  const handleCreateClick = useCallback(() => {
    router.push("/admin/tests/new");
  }, [router]);

  const handleDelete = useCallback(
    async (id: string) => {
      const test = tests.find((t) => t.id === id);
      const label = test ? test.title : id;

      const confirmed = typeof window !== "undefined"
        ? window.confirm(
            `Are you sure you want to delete this test?\n\n${label}`
          )
        : false;

      if (!confirmed) return;

      console.log("[AdminTestsPage] Deleting test:", id);
      setDeletingId(id);

      try {
        await deleteTest(id);
        console.log("[AdminTestsPage] Test deleted:", id);
        // Optimistically update local state
        setTests((prev) => prev.filter((t) => t.id !== id));
        setError(null); // Clear any previous errors on success
      } catch (err) {
        console.error("[AdminTestsPage] Error deleting test:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to delete test. Please try again.";
        setError(errorMessage);
        // Refresh the list to ensure consistency
        fetchTests();
      } finally {
        setDeletingId(null);
      }
    },
    [tests, fetchTests]
  );

  const handleView = useCallback(
    (id: string) => {
      router.push(`/admin/tests/${id}`);
    },
    [router]
  );

  // ---------- Render ----------

  if (authLoading || profileLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-4 text-gray-600">Checking admin access...</p>
      </main>
    );
  }

  if (!user || role !== "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-4 text-gray-600">Redirecting...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-4 text-gray-600">Loading tests...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Manage Tests
            </h1>
            <p className="text-sm text-gray-600">
              View, edit, and delete tests from the test bank.
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label="Create new test"
          >
            + New Test
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        {tests.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-white text-center">
            <p className="text-sm text-gray-600 mb-2">
              No tests found in the test bank.
            </p>
            <button
              onClick={handleCreateClick}
              className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Create your first test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    Title
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    Description
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    Duration
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    Questions
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr
                    key={test.id}
                    className="border-b last:border-b-0 border-gray-100"
                  >
                    <td className="px-4 py-2 text-gray-900 font-medium">
                      {test.title}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {test.description || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {test.durationMinutes} min
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {test.questions.length}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleView(test.id)}
                        className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                        aria-label={`View test ${test.id}`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        disabled={deletingId === test.id}
                        className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                        aria-label={`Delete test ${test.id}`}
                      >
                        {deletingId === test.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}





