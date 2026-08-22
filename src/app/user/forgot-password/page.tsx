"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

function ForgotPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        toast.success(
          data.message ||
            "If an account exists for that email, a reset link has been sent."
        );
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-[100vh] w-full place-items-center bg-gray-50 font-sans antialiased overflow-hidden px-4">
      <div className="relative w-full max-w-6xl h-[min(640px,calc(100dvh-6rem))] rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="relative hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-red-700 to-red-800 text-white px-10">
            <div className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <path d="M100,0 C50,15 50,85 100,100 L100,0 Z" fill="white" />
              </svg>
            </div>
            <div className="text-center max-w-sm z-0">
              <div className="mb-8 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="font-bold text-2xl">I</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Forgot your password?</h2>
              <p className="text-red-100 text-sm leading-relaxed">
                No worries — it happens. Enter the email associated with your
                BandGrowth account and we&apos;ll send you a secure link to
                reset your password.
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-1/2 flex-col justify-center px-8 py-[22px] md:px-12 lg:px-16 overflow-hidden">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Reset your password
                </h1>
                <p className="text-gray-600 text-sm text-center">
                  We&apos;ll email you a secure link to set a new password.
                </p>
              </div>

              {/* {isSubmitted && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-6">
                  <p className="text-sm font-medium text-green-800">
                    ✅ Check your inbox
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    If an account exists for{" "}
                    <span className="font-semibold">{email}</span>, we&apos;ve
                    sent a password reset link. The link expires in 1 hour.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="mt-4 text-sm font-medium text-green-700 hover:text-green-800"
                  >
                    Try a different email
                  </button>
                </div>
              )} */}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    disabled={isSubmitted}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="you@university.edu"
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSubmitted}
                  className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/user/signin")}
                  className="font-medium text-red-700 hover:text-red-800"
                >
                  Back to sign in
                </button>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable={false}
          theme="light"
        />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading
          <span className="loading loading-dots loading-xs ml-1" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
