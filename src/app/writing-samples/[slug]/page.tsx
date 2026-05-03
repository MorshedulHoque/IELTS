import WritingSampleDetail from "@/components/User/WritingSampleDetail";
import { getCachedWritingSampleBySlug } from "@/lib/contentful-cached";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sample = await getCachedWritingSampleBySlug(slug);
  if (!sample) return { title: "Writing sample" };
  const title =
    sample.fields.question.length > 64
      ? `${sample.fields.question.slice(0, 61)}…`
      : sample.fields.question;
  return {
    title,
    description: sample.fields.question,
  };
}

export default async function WritingSampleSlugPage({ params }: Props) {
  const { slug } = await params;
  const sample = await getCachedWritingSampleBySlug(slug);
  if (!sample) notFound();
  return <WritingSampleDetail sample={sample} />;
}
