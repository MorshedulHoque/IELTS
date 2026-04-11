import { Suspense } from "react";
import Loader from "@/components/Common/Loader";
import BlogClient from "@/components/User/BlogClient";

export default function BlogPage() {
  return (
    <Suspense fallback={<Loader message="Loading blog posts..." />}>
      <BlogClient />
    </Suspense>
  );
}


