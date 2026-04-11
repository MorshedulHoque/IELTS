"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Common/Loader";
import { getSpeakingTestById, getSubmitSpeakingTest } from "@/services/data";
import SpeakingReview from "@/components/TestComponent/speakingTest/SpeakingReview";

export default function SubmittedSpeakingPage() {
  const params = useParams();
  const submissionId = useMemo(() => {
    const raw = (params as any)?.submissionId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!submissionId) return;

        const subRes = await getSubmitSpeakingTest(submissionId);
        if (!subRes?.success) {
          setError(subRes?.error || "Failed to load speaking submission");
          return;
        }

        const subData = Array.isArray(subRes.data) ? subRes.data[0] : subRes.data;
        if (!subData) {
          setError("No submission data found");
          return;
        }

        // Optional: basic client-side guard (still rely on server auth)
        if (session?.user?.id && subData.userId && subData.userId !== session.user.id) {
          setError("You are not allowed to view this submission.");
          return;
        }

        setSubmission(subData);

        const testRes = await getSpeakingTestById(subData.testId);
        if (!testRes?.success) {
          setError(testRes?.error || "Failed to load speaking test");
          return;
        }
        setTest(testRes.data);
      } catch (e: any) {
        setError(e?.message || "Something went wrong while loading data");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [submissionId, session?.user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader message="Loading speaking submission..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!submission || !test) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-warning max-w-md">
          <span>Submission or test not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Speaking Test Submission
          </h1>
          <div className="text-xs text-gray-500">
            ID: <span className="font-mono">{submissionId}</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Your recording, analysis, and the original question prompts in one place.
        </div>
      </div>

      <SpeakingReview test={test} submission={submission} />
    </div>
  );
}

