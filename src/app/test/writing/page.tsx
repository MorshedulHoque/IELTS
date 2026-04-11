"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getWritingTest } from "@/services/data";
import Loader from "@/components/Common/Loader";

const WritingPage: React.FC = () => {
  const [writingData, setWritingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = writingData.filter((test) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "academic" && test.type.toLowerCase().includes("academic")) ||
      (filter === "general" && test.type.toLowerCase().includes("general")) ||
      (filter === "task1" && test.type.toLowerCase().includes("task 1")) ||
      (filter === "task2" && test.type.toLowerCase().includes("task 2"));

    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.description &&
        test.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filter, searchQuery, totalPages]);

  const getTypeBadgeClass = (type: string) => {
    const typeMap: Record<string, string> = {
      academic: "bg-red-100 text-red-800 border-red-300",
      general: "bg-red-100 text-red-800 border-red-300",
      "task 1": "bg-red-100 text-red-800 border-red-300",
      "task 2": "bg-red-100 text-red-800 border-red-300",
    };

    const lowerType = type.toLowerCase();
    if (lowerType.includes("academic")) return typeMap.academic;
    if (lowerType.includes("general")) return typeMap.general;
    if (lowerType.includes("task 1")) return typeMap["task 1"];
    if (lowerType.includes("task 2")) return typeMap["task 2"];
    return "bg-red-100 text-red-800 border-red-300";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWritingTest();
        setWritingData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      {/* <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-4 px-4 border-b border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                IELTS Writing Practice
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Academic and General Training tests with expert evaluation
                criteria
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats & Controls */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tests</p>
                <p className="text-2xl font-bold text-red-800">
                  {writingData.length}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["all", "academic", "general"].map((filterType) => (
                  <button
                    key={filterType}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      filter === filterType
                        ? "bg-red-700 text-white border-red-800"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setFilter(filterType)}
                  >
                    {filterType === "all"
                      ? "All Tests"
                      : filterType === "academic"
                      ? "Academic"
                      : filterType === "general"
                      ? "General"
                      : filterType.charAt(0).toUpperCase() +
                        filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Search writing tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div> */}

        {/* Content Section */}
        {isLoading ? (
          <Loader message="Loading writing tests..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-8">
            <div className="text-red-600 font-medium flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {error}</span>
            </div>
          </div>
        ) : filteredTests.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTests.map((test) => (
                <div
                  key={test._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform duration-300 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full border ${getTypeBadgeClass(
                              test.type
                            )}`}
                          >
                            {test.type}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {test.duration || 60} min
                          </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {test.title}
                        </h2>
                        {/* <p className="text-gray-600 mb-4 text-sm">
                          {test.description ||
                            "Practice your writing skills with this IELTS task"}
                        </p> */}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {/* {test.type.includes("Task 1")
                          ? "150 words"
                          : "250 words"} */}
                        {"Full Test"}
                      </div>

                      <Link
                        href={`/test/writing/${test._id}`}
                        className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-lg flex items-center transition-colors"
                      >
                        Start Test
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        page === p ? "bg-red-700 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setPage(p)}
                      disabled={page === p}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No tests found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No tests match "${searchQuery}". Try different keywords.`
                : "No tests available in this category."}
            </p>
            <button
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Writing Task Examples */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-t border-gray-200 pt-12 mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Writing Task Types
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              IELTS Writing Structure
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center mb-5">
                <div className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Task 1</h3>
              </div>

              <div className="mb-5">
                <div className="flex items-center mb-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-300`}
                  >
                    Academic
                  </span>
                </div>
                <p className="text-gray-600 pl-14">
                  Describe visual information (graphs, charts, diagrams, or
                  processes) in your own words.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border bg-gray-100 text-gray-800 border-gray-300`}
                  >
                    General
                  </span>
                </div>
                <p className="text-gray-600 pl-14">
                  Write a letter responding to a given situation (formal,
                  semi-formal, or informal).
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center mb-5">
                <div className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Task 2</h3>
              </div>

              <p className="text-gray-600 mb-5">
                Write an essay in response to a point of view, argument, or
                problem (both Academic and General Training).
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 italic">
                  "Some people believe that unpaid community service should be a
                  compulsory part of high school programs. To what extent do you
                  agree or disagree?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Strategies Section */}
      {/* <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-t border-gray-200 pt-12 mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Writing Strategies
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Expert Recommendations
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Strategic Planning",
                content:
                  "Dedicate 5 minutes to outline essay structure before writing",
              },
              {
                title: "Formal Language",
                content:
                  "Utilize academic vocabulary and avoid colloquial expressions",
              },
              {
                title: "Task Response",
                content:
                  "Address all aspects of the prompt to maximize task achievement",
              },
              {
                title: "Time Allocation",
                content: "Spend 20 minutes on Task 1 and 40 minutes on Task 2",
              },
              {
                title: "Paragraph Structure",
                content: "Include clear topic sentences in each body paragraph",
              },
              {
                title: "Proofreading",
                content:
                  "Reserve final minutes to correct grammar and spelling errors",
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start">
                  <div className="bg-red-50 p-2 rounded mr-4">
                    <span className="text-red-700 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default WritingPage;
