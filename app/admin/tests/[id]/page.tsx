// app/admin/tests/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { getTestById } from "@/lib/db/tests";
import { getQuestionById } from "@/lib/db/questions";
import type { Test } from "@/lib/types/test";
import type { Question } from "@/lib/types/question";

export default function ViewTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const { role, loading: profileLoading } = useUserProfile();

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Map<string, Question>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTest = useCallback(async () => {
    if (!testId) return;

    console.log("[ViewTestPage] Fetching test:", testId);
    setLoading(true);
    setError(null);

    try {
      const testData = await getTestById(testId);
      if (!testData) {
        setError("Test not found.");
        setLoading(false);
        return;
      }

      setTest(testData);

      // Load all questions referenced in the test
      const questionPromises = testData.questions.map((tq) =>
        getQuestionById(tq.questionId)
      );
      const questionResults = await Promise.all(questionPromises);

      const questionsMap = new Map<string, Question>();
      questionResults.forEach((q) => {
        if (q) {
          questionsMap.set(q.id, q);
        }
      });
      setQuestions(questionsMap);

      console.log("[ViewTestPage] Test loaded successfully");
      setLoading(false);
    } catch (err) {
      console.error("[ViewTestPage] Error loading test:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load test.";
      setError(errorMessage);
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      console.log("[ViewTestPage] No user, redirecting to login");
      router.replace("/login");
      return;
    }

    if (role !== "admin") {
      console.log("[ViewTestPage] Non-admin user, redirecting to dashboard");
      router.replace("/dashboard");
      return;
    }

    fetchTest();
  }, [authLoading, profileLoading, user, role, router, fetchTest]);

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
        <p className="p-4 text-gray-600">Loading test...</p>
      </main>
    );
  }

  if (error || !test) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Error</h1>
            <p className="text-sm text-red-600 mb-4">{error || "Test not found"}</p>
            <Link
              href="/admin/tests"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Tests
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/admin/tests"
              className="text-sm text-blue-600 hover:text-blue-800 underline mb-2 inline-block"
            >
              ← Back to Tests
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              {test.title}
            </h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
          {/* Test Information */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900">
                {test.durationMinutes} minutes
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Questions</p>
              <p className="text-sm font-medium text-gray-900">
                {test.questions.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Marks</p>
              <p className="text-sm font-medium text-gray-900">
                {test.questions.reduce((sum, q) => sum + q.marks, 0)}
              </p>
            </div>
          </div>

          {test.description && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Description</p>
              <p className="text-sm text-gray-900">{test.description}</p>
            </div>
          )}

          {/* Questions List */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Questions</p>
            <div className="space-y-3">
              {test.questions.map((tq, index) => {
                const question = questions.get(tq.questionId);
                return (
                  <div
                    key={tq.questionId}
                    className="border border-gray-200 rounded p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">
                            Q{index + 1}.
                          </span>
                          {question?.customId && (
                            <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {question.customId}
                            </span>
                          )}
                          {question ? (
                            <>
                              <span className="text-xs text-gray-600">
                                {question.subject}
                                {question.chapter && ` / ${question.chapter}`}
                                {question.topic && ` / ${question.topic}`}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                                {question.type === "mcq_single"
                                  ? "MCQ (Single)"
                                  : question.type === "mcq_multiple"
                                  ? "MCQ (Multiple)"
                                  : "Numerical"}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Question not found
                            </span>
                          )}
                        </div>
                        {question && (
                          <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: question.text.substring(0, 200) + "...",
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500 mb-1">Scoring</div>
                        <div className="text-sm font-medium text-gray-900">
                          +{tq.marks}
                        </div>
                        {tq.negativeMarks > 0 && (
                          <div className="text-xs text-red-600">
                            -{tq.negativeMarks}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



