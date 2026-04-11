"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Common/Loader";
import { getSpeakingTests } from "@/services/data";
import Link from "next/link";
import { FaMicrophone, FaClock, FaPlay } from "react-icons/fa";

const SpeakingPage: React.FC = () => {
  const [speakingData, setSpeakingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "part1" | "part2" | "part3" | "full_test"
  >("part1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSpeakingTests();
        setSpeakingData(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTests = speakingData.filter((test) => test.type === activeTab);
  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const getDifficultyBadge = (difficulty: string) => {
    const colorMap: Record<string, string> = {
      easy: "badge-success",
      medium: "badge-warning",
      hard: "badge-error",
    };
    return (
      <span
        className={`badge gap-2 ${
          colorMap[difficulty.toLowerCase()] || "badge-info"
        }`}
      >
        {difficulty || "Not Rated"}
      </span>
    );
  };

  const getTabInfo = (tab: string) => {
    switch (tab) {
      case "part1":
        return {
          title: "Part 1: Personal Questions",
          description: "Short personal questions about familiar topics",
          icon: "🎤",
        };
      case "part2":
        return {
          title: "Part 2: Cue Card",
          description: "1 minute preparation + 2 minutes speaking",
          icon: "📝",
        };
      case "part3":
        return {
          title: "Part 3: Discussion",
          description: "Follow-up questions and deeper discussion",
          icon: "💬",
        };
      case "full_test":
        return {
          title: "Full Test",
          description: "Complete IELTS Speaking test (Parts 1-3)",
          icon: "📋",
        };
      default:
        return { title: "", description: "", duration: "", icon: "" };
    }
  };

  const tabInfo = getTabInfo(activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-red-50">
      {/* Header Section */}

      {/* <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-4 px-4 border-b border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                IELTS Speaking Practice
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Practice with authentic IELTS-style questions and get feedback
                on your responses
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats & Controls */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="stats stats-vertical md:stats-horizontal w-full">
            <div className="stat">
              <div className="stat-title">Total Tests</div>
              <div className="stat-value text-red-800">
                {speakingData.length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Parts</div>
              <div className="stat-value text-red-800">3</div>
            </div>
            <div className="stat">
              <div className="stat-title">Test Duration</div>
              <div className="stat-value text-red-800">11-14 min</div>
            </div>
          </div>
        </div> */}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: "part1", label: "Part 1" },
              { key: "part2", label: "Part 2" },
              { key: "part3", label: "Part 3" },
              { key: "full_test", label: "Full Test" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  activeTab === tab.key
                    ? "btn-active bg-red-700 text-white"
                    : "btn-ghost"
                }`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-2 text-center p-2 bg-red-50 rounded-lg">
            <div className="text-4xl">{tabInfo.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800">
              {tabInfo.title}
            </h2>
            <p className="text-gray-600">{tabInfo.description}</p>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <Loader message="Loading speaking tests..." />
        ) : error ? (
          <div className="alert alert-error shadow-lg my-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {error}</span>
            </div>
          </div>
        ) : filteredTests.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTests.map((test) => (
                <div
                  key={test._id}
                  className="card bg-base-100 border border-gray-200 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="card-title text-xl text-gray-800">
                        {test.title}
                      </h2>
                      <span className="font-bold">
                        {getDifficultyBadge(test.difficulty)}
                      </span>
                    </div>

                    {test.description && (
                      <p className="text-gray-600 mt-2 mb-4">
                        {test.description}
                      </p>
                    )}

                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <FaMicrophone className="h-4 w-4 mr-1 text-red-500" />
                        {test.questions.length} questions
                      </div>
                      <div className="flex items-center">
                        <FaClock className="h-4 w-4 mr-1 text-red-500" />
                        {test.total_duration} min
                      </div>
                    </div>

                    {/* <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Your progress</span>
                        <span>0%</span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value="0"
                        max="100"
                      ></progress>
                    </div> */}

                    <div className="card-actions justify-end mt-6">
                      <Link
                        href={`/test/speaking/${test._id}`}
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
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No {activeTab.replace("_", " ")} tests available
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Check back later for new speaking tests
            </p>
          </div>
        )}
      </div>

      {/* Test Tips Section */}
      {/* <div className="max-w-6xl mx-auto mt-8 px-4 pb-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-700 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              IELTS Speaking Tips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {[
              "Expand your answers beyond simple yes/no responses with explanations and examples",
              "Use fillers naturally (well, actually, you know) while you think of what to say next",
              "Speak at a natural pace - not too fast, not too slow - and enunciate clearly",
              "Ask for clarification if you don't understand a question",
              "Record yourself to identify areas for improvement in pronunciation and fluency",
              "Use a range of grammatical structures and vocabulary to demonstrate language proficiency",
            ].map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Speaking Test Structure */}
      <div className="max-w-6xl mx-auto px-4 pb-16 mt-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-700 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              Test Structure
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center mb-2">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Part 1</h3>
              </div>
              <p className="text-gray-600">
                Introduction and interview (4-5 minutes)
              </p>
              <div className="mt-3 bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-700 italic">
                  "Where are you from?"
                  <br />
                  "Do you enjoy reading books?"
                  <br />
                  "What type of music do you like?"
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center mb-2">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold text-red-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Part 2</h3>
              </div>
              <p className="text-gray-600">
                Individual long turn (3-4 minutes)
              </p>
              <div className="mt-3 bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-700 italic">
                  "Describe a place you visited that made an impression on you.
                  You should say:
                  <br />
                  - Where it is
                  <br />
                  - When you went there
                  <br />
                  - What you did there
                  <br />
                  And explain why it made an impression on you."
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center mb-2">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-xl font-bold text-red-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Part 3</h3>
              </div>
              <p className="text-gray-600">Two-way discussion (4-5 minutes)</p>
              <div className="mt-3 bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-700 italic">
                  "Why do you think people enjoy traveling to new places?"
                  <br />
                  "How has tourism changed in your country in recent years?"
                  <br />
                  "What are the benefits of cultural exchange through tourism?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
