"use client";
import React, { useEffect, useState } from "react";
import { getSpeakingTestById } from "@/services/data";
import { useParams } from "next/navigation";
import SpeakingTest from "@/components/TestComponent/speakingTest/SpeakingTest";

const SpeakingTestPage: React.FC = () => {
  const params = useParams();
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getSpeakingTestById(params.id as string);
        if (data.success) {
          setTest(data.data);
        } else {
          setError("Failed to load speaking test");
        }
      } catch (err) {
        console.error("Error loading test:", err);
        setError(err instanceof Error ? err.message : "Failed to load test");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTest();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
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
          <span>Error: {error || "Test not found"}</span>
        </div>
      </div>
    );
  }

  return <SpeakingTest test={test} />;
};

export default SpeakingTestPage; 