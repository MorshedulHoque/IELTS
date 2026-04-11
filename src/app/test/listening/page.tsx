"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Common/Loader";
import listeningTests from "../../../../data/listening.json";
import Link from "next/link";
import { getListeningTests } from "@/services/data";

const ListeningPage: React.FC = () => {
  const [listeningData, setListeningData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = listeningData.filter((test) => {
    const matchesFilter =
      filter === "all" || test.type.toLowerCase() === filter;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getSectionBadge = (type: string) => {
    const sectionMap: Record<string, string> = {
      academic: "bg-red-100 text-red-800 border-red-300",
      general: "bg-red-100 text-red-800 border-red-300",
      "section 3": "bg-red-100 text-red-800 border-red-300",
      "section 4": "bg-red-100 text-red-800 border-red-300",
    };
    return (
      sectionMap[type.toLowerCase()] ||
      "bg-red-100 text-red-800 border-red-300"
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListeningTests();
        setListeningData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset to page 1 if filters/search change and current page goes out of bounds
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filter, searchQuery, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      {/* <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-4 px-4 border-b border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                IELTS Listening Practice
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Authentic test simulations with academic and general training
                materials
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
                  {listeningData.length}
                </p>
              </div>

              <div className="flex space-x-2">
                {["all", "academic", "general"].map((section) => (
                  <button
                    key={section}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      filter === section
                        ? "bg-red-700 text-white border-red-800"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setFilter(section)}
                  >
                    {section.replace("all", "All Sections")}
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
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div> */}

        {/* Content Section */}
        {isLoading ? (
          <Loader message="Loading listening tests..." />
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
                            className={`text-xs font-medium px-3 py-1 rounded-full border ${getSectionBadge(
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
                            {test.duration} min
                          </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {test.title}
                        </h2>
                        <p className="text-gray-600 mb-4 text-sm">
                          {test.description}
                        </p>
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        {test.questions || 30} questions
                      </div>

                      <Link
                        href={`/test/listening/${test._id}`}
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

      {/* Test Tips Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-t border-gray-200 pt-12 mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Listening Test Strategies
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
                title: "Predictive Listening",
                content:
                  "Anticipate content based on question context before audio begins",
              },
              {
                title: "Keyword Identification",
                content:
                  "Focus on recognizing synonyms and paraphrases in questions",
              },
              {
                title: "Speaker Transition Awareness",
                content:
                  "Note when speakers change as new information often follows",
              },
              {
                title: "Accuracy in Transcription",
                content:
                  "Verify spelling and grammatical correctness during answer transfer",
              },
              {
                title: "Accent Familiarization",
                content:
                  "Practice with diverse English accents (British, Australian, American)",
              },
              {
                title: "Note-taking Efficiency",
                content:
                  "Develop personal shorthand system for rapid information capture",
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
      </div>
    </div>
  );
};

export default ListeningPage;
