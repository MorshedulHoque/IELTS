"use client";

import { Suspense } from "react";
import AuthAnimated from "@/components/Auth/AuthAnimated";

function SignUpContent() {
  return <AuthAnimated initialMode="signup" />;
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading
          <span className="loading loading-dots loading-xs ml-1" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
};

export default Page;

