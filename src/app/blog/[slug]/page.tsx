"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Common/Loader";
import { BlogPost, getBlogPostBySlug } from "@/lib/contentful";
import Link from "next/link";
import { useParams } from "next/navigation";

const BlogDetailPage = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (params.slug) {
          const data = await getBlogPostBySlug(params.slug as string);
          if (data) {
            setPost(data);
          } else {
            setError("Blog post not found");
          }
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

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
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
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
            className="text-3xl font-bold mb-6 text-gray-800 leading-tight"
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
            className="text-2xl font-semibold mb-4 text-gray-800"
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
            className="text-xl font-semibold mb-3 text-gray-800"
          >
            {node.content
              ?.map((textNode: any) => textNode.value)
              .join("")}
          </h3>
        );
      }

      if (node.nodeType === "unordered-list") {
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2">
            {node.content?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex} className="text-gray-700">
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
          <ol key={index} className="list-decimal list-inside mb-4 space-y-2">
            {node.content?.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex} className="text-gray-700">
                {listItem.content
                  ?.map((textNode: any) => textNode.value)
                  .join("")}
              </li>
            ))}
          </ol>
        );
      }

      return null;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading blog post..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error || "Blog post not found"}</span>
          <Link href="/blog" className="btn btn-sm btn-outline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 select-none">
      {/* <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-3">
          <Link
            href="/blog"
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
            Back to Blog
          </Link>
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                {post.fields.category}
              </span>
              <span>{formatDate(post.fields.createdDate)}</span>
              {post.fields.author && (
                <span>• By {post.fields.author}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight text-center">
              {post.fields.title}
            </h1>

            {post.fields.metaDescription && (
              <p className="text-lg text-gray-600 max-w-full text-center">
                {post.fields.metaDescription}
              </p>
            )}
          </header>

          {post.fields.image && (
            <div className="mb-4">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={`https:${post.fields.image.fields.file.url}`}
                  alt={post.fields.title}
                  className="w-full max-h-[26rem] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}

          <section className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100">
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {renderRichText(post.fields.body)}
            </div>
          </section>
        </article>

        <div className="mt-6">
          <Link
            href="/blog"
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
            All Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;


