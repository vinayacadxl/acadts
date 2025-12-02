// app/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function AdminHome() {
  const router = useRouter();

  const handleQuestionsClick = useCallback(() => {
    router.push("/admin/questions");
  }, [router]);

  const handleTestsClick = useCallback(() => {
    router.push("/admin/tests");
  }, [router]);

  const handleTestSeriesClick = useCallback(() => {
    router.push("/admin/test-series");
  }, [router]);

  return (
    <div className="pt-16 md:pt-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Manage questions, tests, and platform data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={handleQuestionsClick}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left cursor-pointer"
          aria-label="Manage questions"
        >
          <div className="text-3xl mb-3">❓</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Questions</h2>
          <p className="text-sm text-gray-600">Manage question bank</p>
        </button>

        <button
          onClick={handleTestsClick}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left cursor-pointer"
          aria-label="Manage tests"
        >
          <div className="text-3xl mb-3">📝</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Tests</h2>
          <p className="text-sm text-gray-600">Create and manage tests</p>
        </button>

        <button
          onClick={handleTestSeriesClick}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left cursor-pointer"
          aria-label="Manage test series"
        >
          <div className="text-3xl mb-3">📚</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Test Series</h2>
          <p className="text-sm text-gray-600">Group tests into series</p>
        </button>
      </div>
    </div>
  );
}
