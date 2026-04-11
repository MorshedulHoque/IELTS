"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import { BlogPost, getBlogPosts } from "@/lib/contentful";

const BlogClient: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (post: BlogPost, maxLength = 150) => {
    const body = post.fields.body;
    if (!body || !body.content) return "";

    const text = body.content
      .map((node: any) =>
        node.content?.map((child: any) => child.value || "").join(" ")
      )
      .join(" ")
      .trim();

    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading blog posts..." />
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
    <div className="min-h-screen bg-gray-50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            IELTS Tips & Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read expert tips, strategies, and detailed guides to improve your
            IELTS band score.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-500 text-lg">
              Check back later for new content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.sys.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 flex flex-col"
              >
                {post.fields.featuredImage && (
                  <div className="relative overflow-hidden">
                    <img
                      src={`https:${post.fields.featuredImage.fields.file.url}`}
                      alt={post.fields.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                    {post.fields.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                        {post.fields.category}
                      </span>
                    )}
                    <span>{formatDate(post.fields.createdDate)}</span>
                    {post.fields.author && (
                      <span>• By {post.fields.author}</span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.fields.slug}`}>
                      {post.fields.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {getExcerpt(post)}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/blog/${post.fields.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 ml-1"
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogClient;

