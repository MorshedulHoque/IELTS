"use client";

import type { LearnPost } from "@/lib/contentful";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function LearnDetail({ post }: { post: LearnPost }) {
  const [isLightboxMounted, setIsLightboxMounted] = useState(false);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  const openLightbox = () => {
    setIsLightboxMounted(true);
    requestAnimationFrame(() => setIsLightboxVisible(true));
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxVisible(false);
    setTimeout(() => setIsLightboxMounted(false), 200);
  }, []);

  useEffect(() => {
    if (!isLightboxMounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLightboxMounted, closeLightbox]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function renderRichText(content: LearnPost["fields"]["blogText"]) {
    if (!content?.content) return null;

    return content.content.map((node: any, index: number) => {
      if (node.nodeType === "paragraph") {
        return (
          <p key={index} className="mb-5 text-gray-700 leading-relaxed text-lg">
            {node.content?.map((textNode: any, textIndex: number) => {
              if (textNode.nodeType === "text") {
                let text: React.ReactNode = textNode.value;
                if (textNode.marks) {
                  textNode.marks.forEach((mark: any) => {
                    switch (mark.type) {
                      case "bold":
                        text = <strong key={textIndex}>{text}</strong>;
                        break;
                      case "italic":
                        text = <em key={textIndex}>{text}</em>;
                        break;
                      case "underline":
                        text = <u key={textIndex}>{text}</u>;
                        break;
                    }
                  });
                }
                return text;
              }
              return null;
            })}
          </p>
        );
      }

      if (node.nodeType === "heading-1") {
        return (
          <h1
            key={index}
            className="text-3xl font-bold mb-6 mt-2 text-gray-800"
          >
            {node.content
              ?.map((textNode: any) => textNode.value)
              .join("")}
          </h1>
        );
      }
      if (node.nodeType === "heading-2") {
        return (
          <h2
            key={index}
            className="text-2xl font-semibold mb-4 mt-8 text-gray-800"
          >
            {node.content
              ?.map((textNode: any) => textNode.value)
              .join("")}
          </h2>
        );
      }
      if (node.nodeType === "heading-3") {
        return (
          <h3
            key={index}
            className="text-xl font-semibold mb-3 mt-6 text-gray-800"
          >
            {node.content
              ?.map((textNode: any) => textNode.value)
              .join("")}
          </h3>
        );
      }
      if (node.nodeType === "unordered-list") {
        return (
          <ul
            key={index}
            className="list-disc list-inside mb-5 space-y-2 text-gray-700"
          >
            {node.content?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex}>
                {listItem.content
                  ?.map((textNode: any) => textNode.value)
                  .join("")}
              </li>
            ))}
          </ul>
        );
      }
      if (node.nodeType === "ordered-list") {
        return (
          <ol
            key={index}
            className="list-decimal list-inside mb-5 space-y-2 text-gray-700"
          >
            {node.content?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex}>
                {listItem.content
                  ?.map((textNode: any) => textNode.value)
                  .join("")}
              </li>
            ))}
          </ol>
        );
      }
      if (node.nodeType === "blockquote") {
        return (
          <blockquote
            key={index}
            className="border-l-4 border-red-500 bg-red-50/50 pl-4 pr-3 py-3 italic text-gray-700 mb-5 rounded-r-md"
          >
            {node.content?.map((child: any, cIdx: number) => (
              <p key={cIdx} className="mb-0">
                {child.content
                  ?.map((textNode: any) => textNode.value)
                  .join("")}
              </p>
            ))}
          </blockquote>
        );
      }

      return null;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with back link */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/learn"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Learn
          </Link>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
              {post.fields.learnType}
            </span>
            <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
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
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {post.fields.title}
          </h1>
        </header>

        {/* Featured image */}
        {post.fields.image && (
          <div className="mb-10">
            <button
              type="button"
              onClick={openLightbox}
              className="group relative block w-full text-left focus:outline-none focus:ring-0 outline-none rounded-2xl"
              aria-label="Open image"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={`https:${post.fields.image.fields.file.url}`}
                  alt={post.fields.title}
                  className="w-full h-72 md:h-[28rem] object-cover transition-transform duration-300 group-hover:scale-[1.02] cursor-zoom-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="pointer-events-none absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md hidden md:inline-flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  Click to enlarge
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {renderRichText(post.fields.blogText)}
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center whitespace-nowrap bg-white text-red-600 border border-red-600 px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors duration-200 shadow"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All articles
          </Link>

          {post.fields.learnType && (
            <Link
              href={`/learn?type=${encodeURIComponent(
                post.fields.learnType
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/^-/, ""),
              )}`}
              className="inline-flex items-center justify-center whitespace-nowrap bg-red-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors duration-200 shadow"
            >
              More in {post.fields.learnType}
            </Link>
          )}
        </div>
      </article>

      {/* Lightbox */}
      {isLightboxMounted && post.fields.image && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-out ${
            isLightboxVisible
              ? "bg-black/80 opacity-100"
              : "bg-black/0 opacity-0"
          }`}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div
            className={`relative max-w-5xl w-full transition-transform duration-200 ease-out ${
              isLightboxVisible ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/90 hover:text-white focus:outline-none"
              aria-label="Close"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={`https:${post.fields.image.fields.file.url}`}
              alt={post.fields.title}
              className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}