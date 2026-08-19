"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getReadingQuestions, getSubmitReadingTest } from "@/services/data";
import { useSession } from "next-auth/react";
import ReadingReview from "@/components/TestComponent/readingTest/ReadingReview";

// Define TypeScript interfaces for the data structure
interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: Answer[];
  submittedAt: string;
  totalScore: number;
  __v: number;
}

interface Answer {
  questionId: number | any[];
  value?: string;
  answers?: any[];
  answerText: string | any[];
  isCorrect: boolean;
  questionGroup?: number[];
  questionType?: string;
}

const SubmissionPage = () => {
  const Params = useParams();
  const { testId } = Params;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [readingTest, setReadingTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session }: any = useSession();
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

  // console.log("Submission", submission);

  // console.log("user id", session?.user?.id);

  // console.log(testId, "submissionId");

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmitReadingTest(testId, session?.user?.id);
        // console.log("Response", response);

        if (response.success) {
          // Handle array response or single object
          const data = Array.isArray(response.data)
            ? response.data[0] // Take first element if array
            : response.data;

          setSubmission(data || null); // Handle empty data
          setError(null); // Clear previous errors
        } else {
          setError("Failed to fetch submission data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    if (testId && session?.user?.id) {
      fetchSubmission();
    } else {
      setLoading(false);
    }
  }, [testId, session?.user?.id]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        if (!testId) return;
        const res = await getReadingQuestions(testId);
        if (res?.success) setReadingTest(res.data);
      } catch (e) {
        // keep table working even if review fails
        console.error("Failed to fetch reading test for review", e);
      }
    };
    fetchTest();
  }, [testId]);

  // Handle loading and error states
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span className="loading loading-spinner loading-md text-red-600" />
          <p className="mt-3 text-sm font-medium text-gray-600">
            Loading submitted answers...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  if (!submission) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            No submission data available.
          </p>
        </div>
      </div>
    );
  }

  const toggleExpanded = (key: string) => {
    setExpandedRowKey((prev) => (prev === key ? null : key));
  };

  const formatMaybeArray = (value: unknown) => {
    if (Array.isArray(value)) return value.filter(Boolean).join(", ");
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const renderUserAnswerControl = (answer: Answer, variantKey: string) => {
    const userValue = formatMaybeArray(answer.value);
    const correctValue = formatMaybeArray(answer.answerText);
    const qType = answer.questionType || "";

    // True/False/Not Given
    if (
      qType.toLowerCase().includes("true") ||
      qType.toLowerCase().includes("false")
    ) {
      const tfOptions = ["True", "False", "Not Given"];
      const safeUserValue = tfOptions.includes(userValue) ? userValue : "";
      const safeCorrectValue = tfOptions.includes(correctValue)
        ? correctValue
        : "";
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Your answer
              </span>
            </div>
            <select
              className="select select-bordered"
              disabled
              value={safeUserValue}
            >
              <option value="">(not answered)</option>
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Not Given">Not Given</option>
            </select>
          </div>
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Correct answer
              </span>
            </div>
            <select
              className="select select-bordered bg-base-100"
              disabled
              value={safeCorrectValue}
            >
              <option value="">(no correct answer)</option>
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Not Given">Not Given</option>
            </select>
          </div>
        </div>
      );
    }

    // Fill in the blanks
    if (qType.toLowerCase().includes("fill")) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Your answer
              </span>
            </div>
            <input
              key={`${variantKey}-user-fill`}
              type="text"
              className="input input-bordered"
              disabled
              value={userValue}
              placeholder="(not answered)"
            />
          </div>
          <div className="form-control">
            <div className="label py-0">
              <span className="label-text text-xs font-semibold text-gray-600">
                Correct answer
              </span>
            </div>
            <input
              key={`${variantKey}-correct-fill`}
              type="text"
              className="input input-bordered bg-base-100"
              disabled
              value={correctValue}
              placeholder="(not answered)"
            />
          </div>
        </div>
      );
    }

    // MCQ / Matching / others: we don't have the full option list here,
    // so we present answers as disabled pills similar to "selection boxes".
    const isCorrect = !!answer.isCorrect;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-control">
          <div className="label py-0">
            <span className="label-text text-xs font-semibold text-gray-600">
              Your answer
            </span>
          </div>
          <div
            className={`rounded-lg p-3 border ${
              isCorrect
                ? "border-success/40 bg-success/10"
                : "border-warning/40 bg-warning/10"
            }`}
          >
            {userValue ? (
              <div className="flex flex-wrap gap-2">
                {userValue.split(",").map((v, i) => (
                  <span
                    key={`${variantKey}-user-pill-${i}`}
                    className="badge badge-sm badge-primary badge-outline"
                  >
                    {v.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">(not answered)</span>
            )}
          </div>
        </div>
        <div className="form-control">
          <div className="label py-0">
            <span className="label-text text-xs font-semibold text-gray-600">
              Correct answer
            </span>
          </div>
          <div className="rounded-lg p-3 border border-gray-300 bg-base-100">
            {correctValue ? (
              <div className="flex flex-wrap gap-2">
                {correctValue.split(",").map((v, i) => (
                  <span
                    key={`${variantKey}-correct-pill-${i}`}
                    className="badge badge-sm badge-success badge-outline"
                  >
                    {v.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">(no correct answer)</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Group answers by questionGroup and maintain order
  const groupedAnswers = submission.answers.reduce(
    (acc: { [key: string]: Answer[] }, answer) => {
      if (answer.questionGroup) {
        const groupKey = answer.questionGroup.join("-");
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(answer);
      } else {
        const key = answer?.questionId?.toString();
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(answer);
      }
      return acc;
    },
    {}
  );

  // Sort groups by their first question number
  const sortedGroups = Object.entries(groupedAnswers).sort(([keyA], [keyB]) => {
    const numA = parseInt(keyA.split("-")[0]);
    const numB = parseInt(keyB.split("-")[0]);
    return numA - numB;
  });

  // Function to calculate partial correctness
  const getPartialCorrectness = (answers: Answer[]) => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = answers.length;
    return `${correctCount}/${totalCount}`;
  };

  const totalQuestions = submission.answers.length;
  const correctAnswersCount = submission.answers.filter(
    (a) => a.isCorrect
  ).length;
  const accuracy = totalQuestions
    ? Math.round((correctAnswersCount / totalQuestions) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Submitted Answers
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review your response details and check where you can improve.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Submitted: {new Date(submission.submittedAt).toLocaleString()}
        </div>
      </div>

      {/* Total Score Card */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total Score
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {submission.totalScore} / 40
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Correct
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {correctAnswersCount} / {totalQuestions}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Accuracy
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{accuracy}%</p>
        </div>
      </div>

      {/* Answers Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-semibold text-gray-700">Question</th>
              <th className="font-semibold text-gray-700">Your Answer</th>
              <th className="font-semibold text-gray-700">Correct Answer</th>
              <th className="font-semibold text-gray-700">Type</th>
              <th className="font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr:last-child]:border-b-0 [&_tr]:border-gray-100">
            {sortedGroups.map(([groupKey, answers]: any) => {
              // For grouped answers (multiple MCQ)
              if (answers[0].questionGroup) {
                const selectedAnswers = answers
                  .map((a: any) => a.value)
                  .filter(Boolean)
                  .join(", ");
                const correctAnswers = answers
                  .map((a: any) => a.answerText)
                  .filter(Boolean)
                  .join(", ");
                const isGroupCorrect = answers.every((a: any) => a.isCorrect);
                const partialCorrectness = getPartialCorrectness(answers);
                const rowKey = `group:${groupKey}`;

                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      key={groupKey}
                      onClick={() => toggleExpanded(rowKey)}
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                      aria-expanded={expandedRowKey === rowKey}
                      title="Click to reveal details"
                    >
                      <td className="font-medium text-gray-900">
                        {answers[0].questionGroup.join(", ")}
                      </td>
                      <td className="max-w-[260px] truncate text-gray-700">
                        {selectedAnswers || "Not answered"}
                      </td>
                      <td className="max-w-[260px] truncate text-gray-700">
                        {correctAnswers}
                      </td>
                      <td className="text-gray-600">
                        {answers[0].questionType || "-"}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isGroupCorrect
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {isGroupCorrect
                            ? "Correct"
                            : `Partial (${partialCorrectness})`}
                        </span>
                      </td>
                    </tr>
                    {expandedRowKey === rowKey && (
                      <tr>
                        <td colSpan={5}>
                          <div className="m-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="font-semibold text-gray-900">
                                Multiple question set (
                                {answers[0].questionGroup.join(", ")})
                              </div>
                              <div
                                className={`text-sm font-semibold ${
                                  isGroupCorrect
                                    ? "text-emerald-700"
                                    : "text-amber-700"
                                }`}
                              >
                                {isGroupCorrect
                                  ? "Correct"
                                  : `Partial (${partialCorrectness})`}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              {answers.map((answer: Answer, idx: number) => {
                                const perRowKey = `${rowKey}:q:${
                                  answer.questionId ?? idx
                                }`;
                                return (
                                  <div
                                    key={perRowKey}
                                    className="rounded-lg border border-gray-200 bg-white p-3"
                                  >
                                    <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                                      <div className="text-sm font-semibold text-gray-900">
                                        Question{" "}
                                        {Array.isArray(answer.questionId)
                                          ? answer.questionId.join(", ")
                                          : answer.questionId}
                                      </div>
                                      <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                          answer.isCorrect
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-rose-50 text-rose-700"
                                        }`}
                                      >
                                        {answer.isCorrect ? "Correct" : "Wrong"}
                                      </span>
                                    </div>
                                    {renderUserAnswerControl(answer, perRowKey)}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }

              // For individual answers
              return answers.map((answer: any, index: any) => {
                const rowKey = `single:${groupKey}:${
                  answer.questionId ?? index
                }`;
                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      key={`${groupKey}-${index}`}
                      onClick={() => toggleExpanded(rowKey)}
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                      aria-expanded={expandedRowKey === rowKey}
                      title="Click to reveal details"
                    >
                      <td className="font-medium text-gray-900">
                        {answer.questionId}
                      </td>
                      <td className="max-w-[260px] truncate text-gray-700">
                        {answer.value || "Not answered"}
                      </td>
                      <td className="max-w-[260px] truncate text-gray-700">
                        {answer.answerText as string}
                      </td>
                      <td className="text-gray-600">
                        {answer.questionType || "-"}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            answer.isCorrect
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {answer.isCorrect ? "Correct" : "Wrong"}
                        </span>
                      </td>
                    </tr>
                    {expandedRowKey === rowKey && (
                      <tr>
                        <td colSpan={5}>
                          <div className="m-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="font-semibold text-gray-900">
                                Question {answer.questionId} -{" "}
                                {answer.questionType || " "}
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  answer.isCorrect
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {answer.isCorrect ? "Correct" : "Wrong"}
                              </span>
                            </div>
                            {renderUserAnswerControl(answer, rowKey)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* Review Interface (same as test layout, but pre-filled + read-only) */}
      {readingTest && submission?.answers && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl text-center text-red-600">
            Detailed Review
          </h2>
          <ReadingReview
            test={readingTest}
            submissionAnswers={submission.answers as any}
          />
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;
