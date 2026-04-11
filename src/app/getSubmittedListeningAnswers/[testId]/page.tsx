"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getListeningTestById, getSubmitListeningTest } from "@/services/data";
import ListeningReview from "@/components/TestComponent/listeningTest/ListeningReview";

interface AnswerEntry {
  questionId: number | any[];
  value?: string;
  answers?: any[];
  answerText: string | any[];
  isCorrect: boolean;
  questionGroup?: number[];
  questionType?: string;
}

interface Submission {
  _id: string;
  userId: string;
  testId: string;
  answers: AnswerEntry[];
  submittedAt: string;
  totalScore: number;
  __v: number;
}

const SubmissionPage = () => {
  const params = useParams();
  const { testId }: any = params;
  const { data: session, status } = useSession();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [listeningTest, setListeningTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmitListeningTest(
          testId,
          session?.user?.id
        );

        if (response.success) {
          const data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

          setSubmission(data || null);
          setError(null);
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
  }, [testId, session?.user?.id, status]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        if (!testId) return;
        const res = await getListeningTestById(String(testId));
        if (res?.success) setListeningTest(res.data);
      } catch (e) {
        console.error("Failed to fetch listening test for review", e);
      }
    };
    fetchTest();
  }, [testId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-error">{error}</div>;
  if (!submission)
    return <div className="text-center p-4">No submission data available</div>;

  // Group answers by questionGroup and maintain order
  const groupedAnswers = submission.answers.reduce(
    (acc: { [key: string]: AnswerEntry[] }, answer) => {
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
  const getPartialCorrectness = (answers: AnswerEntry[]) => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = answers.length;
    return `${correctCount}/${totalCount}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Submitted Answers</h1>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">
            Total Score: {submission.totalScore} / 40
          </h2>
          <p>
            Submitted at: {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="font-bold text-black">Question</th>
              <th className="font-bold text-black">Your Answer</th>
              <th className="font-bold text-black">Correct Answer</th>
              <th className="font-bold text-black">Type</th>
              <th className="font-bold text-black">Status</th>
            </tr>
          </thead>
          <tbody>
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

                return (
                  <tr key={groupKey}>
                    <td>{answers[0].questionGroup.join(", ")}</td>
                    <td>{selectedAnswers || "Not answered"}</td>
                    <td>{correctAnswers}</td>
                    <td>{answers[0].questionType || " "}</td>
                    <td
                      className={
                        isGroupCorrect ? "text-success" : "text-warning"
                      }
                    >
                      {isGroupCorrect ? "✅" : `⚠️ (${partialCorrectness})`}
                    </td>
                  </tr>
                );
              }

              // For individual answers
              return answers.map((answer: any, index: any) => (
                <tr key={`${groupKey}-${index}`}>
                  <td>{answer.questionId}</td>
                  <td>{answer.value || "Not answered"}</td>
                  <td>{answer.answerText as string}</td>
                  <td>{answer.questionType || " "}</td>
                  <td
                    className={answer.isCorrect ? "text-success" : "text-error"}
                  >
                    {answer.isCorrect ? "✅" : "❌"}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Review Interface (same as listening test UI, but pre-filled + read-only) */}
      {listeningTest && submission?.answers && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Review (same interface)</h2>
          <ListeningReview
            test={listeningTest}
            submissionAnswers={submission.answers as any}
          />
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;
