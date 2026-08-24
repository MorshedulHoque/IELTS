import LearnDetail from "@/components/User/LearnDetail";
import { getCachedLearnPostBySlug } from "@/lib/contentful-cached";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedLearnPostBySlug(slug);
  if (!post) return { title: "Learn article" };
  const title =
    post.fields.title.length > 64
      ? `${post.fields.title.slice(0, 61)}…`
      : post.fields.title;
  return {
    title,
    description: post.fields.title,
  };
}

export default async function LearnSlugPage({ params }: Props) {
  const { slug } = await params;
  const post = await getCachedLearnPostBySlug(slug);
  if (!post) notFound();
  return <LearnDetail post={post} />;
}