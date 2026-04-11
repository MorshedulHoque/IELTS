"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Common/Loader";
import { getWritingSamples, WritingSample } from "@/lib/contentful";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const WritingSamplesPage = () => {
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [filteredSamples, setFilteredSamples] = useState<WritingSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string>("all");
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("all");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        const data = await getWritingSamples();
        setSamples(data);
        setFilteredSamples(data);
      } catch (err) {
        setError("Failed to load writing samples");
        console.error("Error fetching samples:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  // Handle URL parameters for filtering
  useEffect(() => {
    const taskParam = searchParams.get("task");
    if (taskParam === "1") {
      setSelectedTask("task1");
      setSelectedQuestionType("all");
      filterSamples("task1", "all");
    } else if (taskParam === "2") {
      setSelectedTask("task2");
      setSelectedQuestionType("all");
      filterSamples("task2", "all");
    } else {
      setSelectedTask("all");
      setSelectedQuestionType("all");
      setFilteredSamples(samples);
    }
  }, [searchParams, samples]);

  // Question types for each task
  const task1QuestionTypes = [
    "Line Graph",
    "Bar Graph",
    "Pie Chart",
    "Table",
    "Mixed Chart",
    "Map",
    "Process Chart",
  ];

  const task2QuestionTypes = [
    "Agree or Disagree",
    "What is your opinion about this",
    "Positive or Negative Development",
    "Discuss Both Views",
    "Advantages Outweigh Disadvantages",
    "Advantages and Disadvantages",
    "Double Questions",
    "Causes and Solutions",
    "Problem and Solutions",
  ];

  const filterSamples = (task: string, questionType: string) => {
    let filtered = samples;

    // Filter by task
    if (task === "task1") {
      filtered = filtered.filter(
        (sample) => sample.fields.taskType === "Task 1"
      );
    } else if (task === "task2") {
      filtered = filtered.filter(
        (sample) => sample.fields.taskType === "Task 2"
      );
    }

    // Filter by question type
    if (questionType !== "all") {
      filtered = filtered.filter(
        (sample) => sample.fields.questionType === questionType
      );
    }

    setFilteredSamples(filtered);
  };

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task);
    setSelectedQuestionType("all");
    filterSamples(task, "all");
  };

  const handleQuestionTypeSelect = (questionType: string) => {
    setSelectedQuestionType(questionType);
    filterSamples(selectedTask, questionType);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderRichText = (content: any) => {
    if (!content || !content.content) return "";

    return content.content.map((node: any, index: number) => {
      if (node.nodeType === "paragraph") {
        return (
          <p key={index} className="mb-4">
            {node.content?.map((textNode: any, textIndex: number) => {
              if (textNode.nodeType === "text") {
                return <span key={textIndex}>{textNode.value}</span>;
              }
              return null;
            })}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading writing samples..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
              IELTS Writing Samples
            </h1>
            <p className="text-xl md:text-xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              Master IELTS writing with our comprehensive collection of sample questions, model answers, and expert tips
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Task 1 & 2</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Academic & General</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-sm font-medium">Model Answers</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filter Section */}
        <div className="mb-6">
          {/* <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse by Category</h2>
          </div> */}

          {/* Task Selection */}
          {/* <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => handleTaskSelect('all')}
              className={`px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                selectedTask === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
              }`}
            >
              All Samples
            </button>
            <button
              onClick={() => handleTaskSelect('task1')}
              className={`px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                selectedTask === 'task1'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
              }`}
            >
              Task 1
            </button>
            <button
              onClick={() => handleTaskSelect('task2')}
              className={`px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                selectedTask === 'task2'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
              }`}
            >
              Task 2
            </button>
          </div> */}

          {/* Question Type Selection */}
          {selectedTask !== "all" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {selectedTask === "task1"
                  ? "Task 1 Question Types"
                  : "Task 2 Question Types"}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleQuestionTypeSelect("all")}
                  className={`px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
                    selectedQuestionType === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  All {selectedTask === "task1" ? "Task 1" : "Task 2"}
                </button>
                {(selectedTask === "task1"
                  ? task1QuestionTypes
                  : task2QuestionTypes
                ).map((questionType) => (
                  <button
                    key={questionType}
                    onClick={() => handleQuestionTypeSelect(questionType)}
                    className={`px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
                      selectedQuestionType === questionType
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {questionType}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Samples Grid */}
        {filteredSamples.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {selectedTask === "all"
                ? "No writing samples found"
                : selectedQuestionType === "all"
                ? `No ${
                    selectedTask === "task1" ? "Task 1" : "Task 2"
                  } samples found`
                : `No ${selectedQuestionType} samples found`}
            </h3>
            <p className="text-gray-500 text-lg">
              Check back later for new samples
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSamples.map((sample) => (
              <div
                key={sample.sys.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Image */}
                {sample.fields.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={`https:${sample.fields.image.fields.file.url}`}
                      alt={sample.fields.question}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-6">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {sample.fields.taskType}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {sample.fields.questionType}
                    </span>
                  </div>

                  {/* Question */}
                  <h2 className="text-l font-bold text-gray-800 mb-4 leading-tight transition-colors duration-300">
                    <Link
                      href={`/writing-samples/${sample.fields.slug}`}
                      className="hover:text-red-600"
                    >
                      {sample.fields.question}
                    </Link>
                  </h2>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(sample.fields.date)}
                  </div>

                  {/* Preview of Answer */}
                  {/* <div className="text-gray-600 mb-6 line-clamp-4 text-sm leading-relaxed">
                    {renderRichText(sample.fields.answer)}
                  </div> */}

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/writing-samples/${sample.fields.slug}`}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 shadow whitespace-nowrap"
                    >
                      View Sample
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingSamplesPage;
