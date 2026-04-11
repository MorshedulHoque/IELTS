import { Suspense } from "react";
import OnboardingWizard from "@/components/Auth/OnboardingWizard";
import Loader from "@/components/Common/Loader";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<Loader message="Loading onboarding..." />}>
      <OnboardingWizard />
    </Suspense>
  );
}
