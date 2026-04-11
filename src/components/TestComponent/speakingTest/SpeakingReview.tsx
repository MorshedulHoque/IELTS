"use client";

import React, { useMemo } from "react";

type SpeakingQuestion = {
  question_number: number;
  question: string;
  question_type: string;
  preparation_time?: number;
  speaking_time: number;
  instructions?: string;
};

type SpeakingTest = {
  _id: string;
  title: string;
  type: string;
  questions: SpeakingQuestion[];
};

type SpeakingFeedback = {
  transcript: string;
  filler_words: Array<{ word: string; count: number }>;
  total_filler_words: number;
  fluency_score: number;
  feedback_tips: string[];
  audio_url: string;
  recording_duration: number;
  total_words?: number;
};

type SpeakingSubmission = {
  _id: string;
  userId: string;
  testId: string;
  testType?: string;
  questionNumbers?: number[];
  questionNumber?: number; // legacy
  audioFile?: string;
  cloudinaryPublicId?: string;
  feedback?: SpeakingFeedback;
  submittedAt?: string;
};

function formatDurationSeconds(totalSeconds: number) {
  const mins = Math.floor((totalSeconds || 0) / 60);
  const secs = Math.floor((totalSeconds || 0) % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function SpeakingReview({
  test,
  submission,
}: {
  test: SpeakingTest;
  submission: SpeakingSubmission;
}) {
  const answeredSet = useMemo(() => {
    const nums =
      submission.questionNumbers && submission.questionNumbers.length > 0
        ? submission.questionNumbers
        : submission.questionNumber
          ? [submission.questionNumber]
          : [];
    return new Set(nums);
  }, [submission.questionNumbers, submission.questionNumber]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{test.title}</h2>
              <div className="mt-1 text-sm text-gray-600">
                Submitted speaking review (recording + analysis)
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="badge bg-red-600 text-white border-0">
                {test.type?.replaceAll("_", " ")}
              </div>
              {submission.submittedAt ? (
                <div className="badge badge-outline">
                  Submitted: {submission.submittedAt}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Questions
              </div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {test.questions?.length ?? 0}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Marked answered
              </div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {answeredSet.size}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Recording duration
              </div>
              <div className="mt-1 text-2xl font-bold text-gray-900">
                {submission.feedback?.recording_duration !== undefined
                  ? formatDurationSeconds(submission.feedback.recording_duration)
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recording</h3>
              <div className="text-sm text-gray-600">
                Listen to your submitted audio.
              </div>
            </div>
            {submission.cloudinaryPublicId ? (
              <div className="badge badge-outline">Saved</div>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            {submission.audioFile ? (
              <audio controls className="w-full">
                <source src={submission.audioFile} />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="text-sm text-gray-700">
                No audio file found for this submission.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analysis</h3>
              <div className="text-sm text-gray-600">
                Auto-generated feedback from your submission.
              </div>
            </div>
            {submission.feedback ? (
              <div className="badge bg-green-600 text-white border-0">Available</div>
            ) : (
              <div className="badge badge-outline">Missing</div>
            )}
          </div>

          {submission.feedback ? (
            <>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Fluency score
                  </div>
                  <div className="mt-1 text-3xl font-bold text-red-600">
                    {submission.feedback.fluency_score}
                  </div>
                  <progress
                    className="progress progress-error w-full mt-3"
                    value={Math.min(100, Math.max(0, submission.feedback.fluency_score))}
                    max={100}
                  />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Filler words
                  </div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">
                    {submission.feedback.total_filler_words}
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    Lower is usually better.
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Total words
                  </div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">
                    {submission.feedback.total_words ?? "-"}
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    Based on transcript (if available).
                  </div>
                </div>
              </div>

              {submission.feedback.feedback_tips?.length ? (
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-800">
                    {submission.feedback.feedback_tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {submission.feedback.filler_words?.length ? (
                <div className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Filler word breakdown
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.feedback.filler_words.map((fw) => (
                      <span key={fw.word} className="badge badge-outline">
                        {fw.word}: {fw.count}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {submission.feedback.transcript ? (
                <div className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Transcript</h4>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 whitespace-pre-wrap text-gray-800">
                    {submission.feedback.transcript}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
              No analysis data found for this submission.
            </div>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
              <div className="text-sm text-gray-600">
                Reference of the original test prompts.
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {test.questions?.map((q) => {
              const answered = answeredSet.has(q.question_number);
              return (
                <details
                  key={q.question_number}
                  className={`rounded-xl border ${
                    answered ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <summary className="cursor-pointer select-none px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-gray-900">
                      Q{q.question_number}{" "}
                      <span className="text-sm font-normal text-gray-600">
                        ({q.question_type})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {answered ? (
                        <span className="badge bg-green-600 text-white border-0">
                          Answered
                        </span>
                      ) : (
                        <span className="badge badge-outline">Not marked</span>
                      )}
                      <span className="badge badge-outline">
                        Speak: {q.speaking_time} min
                      </span>
                      {q.preparation_time ? (
                        <span className="badge badge-outline">
                          Prep: {q.preparation_time} min
                        </span>
                      ) : null}
                    </div>
                  </summary>
                  <div className="px-4 pb-4">
                    <div className="mt-1 whitespace-pre-wrap text-gray-800">
                      {q.question}
                    </div>
                    {q.instructions ? (
                      <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3">
                        <div className="text-sm text-red-700 whitespace-pre-wrap">
                          {q.instructions}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

