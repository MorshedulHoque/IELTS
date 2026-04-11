"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface TestPart {
  title: string;
  subtitle: string;
  Question: string[];
  instruction: string[];
  image: string;
  _id: string;
}

interface WritingTest {
  title: string;
  _id: string;
  type: string;
  duration: number;
  parts: TestPart[];
}

interface SubmissionAnswer {
  partId: string;
  question: string;
  response: string;
  instructions: string[];
  image?: string;
}

interface WritingSubmission {
  _id: string;
  userId: string;
  testId: string;
  answers: SubmissionAnswer[];
  submittedAt: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

export default function WritingReview({
  test,
  submission,
}: {
  test: WritingTest;
  submission: WritingSubmission;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [panelWidths, setPanelWidths] = useState<Record<number, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const responsesByPartId = useMemo(() => {
    const map: Record<string, string> = {};
    submission.answers?.forEach((a) => {
      map[a.partId] = a.response || "";
    });
    return map;
  }, [submission.answers]);

  const wordCounts = useMemo(() => {
    const map: Record<string, number> = {};
    test.parts?.forEach((p) => {
      map[p._id] = countWords(responsesByPartId[p._id] || "");
    });
    return map;
  }, [responsesByPartId, test.parts]);

  // Initialize split widths
  useEffect(() => {
    const initial: Record<number, number> = {};
    test.parts?.forEach((_, idx) => {
      initial[idx] = 50;
    });
    setPanelWidths(initial);
  }, [test.parts]);

  const handleMouseDown = (e: React.MouseEvent, taskIndex: number) => {
    setIsDragging(true);
    setCurrentTaskIndex(taskIndex);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || currentTaskIndex === null) return;

    const containers = document.querySelectorAll(".writing-split-container");
    const container = containers[currentTaskIndex] as HTMLElement | undefined;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setPanelWidths((prev) => ({
        ...prev,
        [currentTaskIndex]: newLeftWidth,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentTaskIndex(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, currentTaskIndex]);

  const getImageForPart = (part: TestPart, index: number) => {
    const submissionAnswer = submission.answers?.[index];
    return submissionAnswer?.image || part.image || undefined;
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="card bg-base-100 shadow-xl mb-4">
        <div className="py-4 px-6">
          <h2 className="card-title text-2xl">{test.title}</h2>
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="text-lg">Type: {test.type}</p>
              <p className="text-sm text-gray-600">
                Review mode (submitted answers are pre-filled)
              </p>
            </div>
            <div className="badge bg-red-600 text-white border-0">
              Task {activeTab + 1} of {test.parts.length}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl overflow-hidden flex flex-col">
        <div className="card-body overflow-hidden p-4">
          {test.parts.map((part, index) => (
            <div
              key={part._id}
              className={`h-full ${activeTab === index ? "block" : "hidden"}`}
            >
              <h2 className="text-2xl font-semibold mb-4">{part.title}</h2>

              <div className="writing-split-container flex relative h-[70vh]">
                {/* Left Side - Question and Instructions */}
                <div
                  className="bg-base-200 p-4 rounded-lg overflow-auto"
                  style={{ width: `${panelWidths[index] ?? 50}%` }}
                >
                  <h3 className="mb-2">{part.subtitle}</h3>

                  <div className="prose max-w-none mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50 font-semibold">
                    {Array.isArray(part.Question) && part.Question.length > 0 ? (
                      part.Question.map((q, i) => (
                        <p
                          key={i}
                          className="mb-2 whitespace-pre-line leading-relaxed italic"
                        >
                          {q}
                        </p>
                      ))
                    ) : (
                      <p>No questions available.</p>
                    )}
                  </div>

                  {getImageForPart(part, index) && (
                    <div className="my-4">
                      <img
                        src={getImageForPart(part, index)}
                        alt={part.title}
                        className="rounded-lg max-w-full h-auto mx-auto"
                      />
                    </div>
                  )}

                  <div className="mt-6 p-4 rounded-lg">
                    {Array.isArray(part.instruction) && part.instruction.length > 0 ? (
                      part.instruction.map((instruction, i) => (
                        <p key={i}>{instruction}</p>
                      ))
                    ) : (
                      <p>No instructions available.</p>
                    )}
                  </div>
                </div>

                {/* Resizer */}
                <div
                  className={`w-1 bg-base-300 cursor-col-resize transition-colors ${
                    isDragging && currentTaskIndex === index ? "bg-primary" : "hover:bg-primary"
                  }`}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                />

                {/* Right Side - Response (read-only) */}
                <div
                  className="bg-base-200 p-4 rounded-lg overflow-hidden flex flex-col"
                  style={{ width: `${100 - (panelWidths[index] ?? 50)}%` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-bold">
                      Word count: {wordCounts[part._id] || 0}
                    </div>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full flex-1 resize-none bg-base-100"
                    value={responsesByPartId[part._id] || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Task Navigation (review) */}
      <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-2">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              disabled={activeTab === 0}
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              type="button"
            >
              Previous
            </button>

            <div className="flex justify-center flex-1">
              {test.parts.map((_, partIndex) => (
                <div key={partIndex} className="flex-1 flex justify-center">
                  <div className="border-2 border-gray-300 rounded-lg p-1 flex gap-0.5 justify-center">
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm rounded border transition-colors ${
                        partIndex === activeTab
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                      }`}
                      onClick={() => setActiveTab(partIndex)}
                    >
                      Task {partIndex + 1}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab(Math.min(test.parts.length - 1, activeTab + 1))}
              disabled={activeTab === test.parts.length - 1}
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

