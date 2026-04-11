import { Suspense } from "react";
import ResetPasswordClient from "@/components/User/ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading<span className="loading loading-dots loading-xs"></span>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
