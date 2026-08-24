import LearnClient from "@/components/User/LearnClient";
import Loader from "@/components/Common/Loader";
import { getCachedLearnPosts } from "@/lib/contentful-cached";
import { Suspense } from "react";

export default async function LearnPage() {
  const posts = await getCachedLearnPosts();
  return (
    <Suspense fallback={<Loader message="Loading learn articles..." />}>
      <LearnClient initialPosts={posts} />
    </Suspense>
  );
}