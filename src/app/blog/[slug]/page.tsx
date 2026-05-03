import BlogPostDetail from "@/components/User/BlogPostDetail";
import { getCachedBlogPostBySlug } from "@/lib/contentful-cached";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedBlogPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.fields.title,
    description: post.fields.metaDescription ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getCachedBlogPostBySlug(slug);
  if (!post) notFound();
  return <BlogPostDetail post={post} />;
}
