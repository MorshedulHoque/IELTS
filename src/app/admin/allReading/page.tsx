"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from '@/components/Common/Loader';
import { getReadingTest } from "@/services/data";
import AllReading from "@/components/Admin/Reading/AllReading/AllReading";

const page: React.FC = () => {
  const [readingData, setReadingData]: any = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReadingTest();
        setReadingData(data.data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("reading data", readingData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader message="Loading reading tests..." />
      </div>
    );
  }

  if (error) {
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
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <AllReading readingData={readingData} setReadingData={setReadingData} />
  );
};

export default page;
