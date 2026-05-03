import Loader from "@/components/Common/Loader";
import WritingSamplesClient from "@/components/User/WritingSamplesClient";
import { getCachedWritingSamples } from "@/lib/contentful-cached";
import { Suspense } from "react";

export default async function WritingSamplesPage() {
  const samples = await getCachedWritingSamples();
  return (
    <Suspense fallback={<Loader message="Loading writing samples..." />}>
      <WritingSamplesClient initialSamples={samples} />
    </Suspense>
  );
}
