"use client";

import { Suspense } from "react";
import AuthAnimated from "@/components/Auth/AuthAnimated";

function SignInContent() {
  return <AuthAnimated initialMode="signin" />;
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading
          <span className="loading loading-dots loading-xs ml-1" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

