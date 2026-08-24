"use client";

import { LEARN_TYPES, type LearnPost } from "@/lib/contentful";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = { initialPosts: LearnPost[] };

// Slug used in the URL query string
const TYPE_TO_SLUG: Record<(typeof LEARN_TYPES)[number], string> = {
  "IELTS Guide": "ielts-guide",
  Reading: "reading",
  Listening: "listening",
  Writing: "writing",
  Speaking: "speaking",
};

const SLUG_TO_TYPE: Record<string, (typeof LEARN_TYPES)[number]> = {
  "ielts-guide": "IELTS Guide",
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  speaking: "Speaking",
};

const LearnClient = ({ initialPosts }: Props) => {
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type");
  const initialActive: (typeof LEARN_TYPES)[number] | "all" =
    queryType && SLUG_TO_TYPE[queryType] ? SLUG_TO_TYPE[queryType] : "all";

  const [activeFilter, setActiveFilter] = useState<
    (typeof LEARN_TYPES)[number] | "all"
  >(initialActive);

  useEffect(() => {
    const t = searchParams.get("type");
    setActiveFilter(t && SLUG_TO_TYPE[t] ? SLUG_TO_TYPE[t] : "all");
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return initialPosts;
    return initialPosts.filter((p) => p.fields.learnType === activeFilter);
  }, [initialPosts, activeFilter]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSelect = (value: (typeof LEARN_TYPES)[number] | "all") => {
    setActiveFilter(value);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (value === "all") {
        url.searchParams.delete("type");
      } else {
        url.searchParams.set("type", TYPE_TO_SLUG[value]);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Learn
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated guides, tips, and articles to help you master every section
            of the IELTS exam.
          </p>
        </div>

        {/* Filter pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleSelect("all")}
              className={`px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                activeFilter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
              }`}
            >
              All
            </button>
            {LEARN_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className={`px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  activeFilter === type
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {filteredPosts.length === 0 ? (
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 text-lg">
              Check back later for new content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.sys.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {post.fields.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={`https:${post.fields.image.fields.file.url}`}
                      alt={post.fields.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.fields.learnType}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight group-hover:text-red-600 transition-colors duration-300">
                    <Link href={`/learn/${post.fields.slug}`}>
                      {post.fields.title}
                    </Link>
                  </h2>

                  <div className="flex items-center text-sm text-gray-500 mb-5">
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
                    {formatDate(post.fields.date)}
                  </div>

                  <Link
                    href={`/learn/${post.fields.slug}`}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 shadow whitespace-nowrap"
                  >
                    Read article
                    <svg
                      className="w-4 h-4"
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnClient;