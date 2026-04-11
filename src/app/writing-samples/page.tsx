import { Suspense } from "react";
import WritingSamplesClient from "@/components/User/WritingSamplesClient";
import Loader from "@/components/Common/Loader";

export default function WritingSamplesPage() {
  return (
    <Suspense fallback={<Loader message="Loading writing samples..." />}>
      <WritingSamplesClient />
    </Suspense>
  );
}
