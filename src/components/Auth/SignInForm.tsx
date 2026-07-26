import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOnboardingData } from "@/services/data";
import { ToastContainer, toast } from "react-toastify";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verification related states
  const [verificationError, setVerificationError] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const verificationPending = params.get("verification_pending") === "true";
  const verified = params.get("verified") === "true";

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: `/api/auth/oauth-redirect?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`,
      redirect: true,
    });
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Verification email resent! Please check your inbox.");
      } else {
        toast.error(data.error || "Failed to resend verification email.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVerificationError(false);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setLoading(false);
      // Check for verification error
      if (res.error.toLowerCase().includes("verify your email")) {
        setVerificationError(true);
        setVerificationEmail(email);
        setError("Please verify your email before signing in.");
      } else if (res.error.includes("Please sign in with")) {
        setError(res.error);
      } else if (res.error.includes("Password not set")) {
        setError(res.error);
      } else {
        setError("Invalid Email or Password!");
      }
      return;
    }

    try {
      const userResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userResponse.json();
      const userId = userData?.data?.[0]?._id;
      const userRole = userData?.data?.[0]?.role;

      if (userRole === "admin") {
        setLoading(false);
        router.push(callbackUrl);
        return;
      }

      if (userId) {
        try {
          const onboardingResponse = await getOnboardingData(userId);
          const onboardingRecord = onboardingResponse?.data;
          const onboardingStatus = onboardingRecord?.status;

          if (onboardingRecord && onboardingStatus === "completed") {
            setLoading(false);
            router.push(callbackUrl);
            return;
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      }

      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setLoading(false);
    } catch (error) {
      console.error("Error after sign in:", error);
      try {
        const userResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const userData = await userResponse.json();
        const userRole = userData?.data?.[0]?.role;

        if (userRole === "admin") {
          setLoading(false);
          router.push(callbackUrl);
          return;
        }
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 font-sans antialiased">
      <div className="flex w-full h-full overflow-hidden bg-white md:flex-row">
        {/* LEFT PANEL: Simple Branding */}
        <div className="relative hidden md:flex w-full md:w-[45%] flex-col items-center justify-center bg-gradient-to-br from-red-700 to-red-800 text-white px-12">
          <div className="absolute right-0 top-0 h-full w-24 pointer-events-none z-10">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path d="M100,0 C50,15 50,85 100,100 L100,0 Z" fill="white" />
            </svg>
          </div>

          <div className="text-center max-w-md z-0">
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="font-bold text-3xl">I</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">IELTS Workspace</h2>
            <p className="text-red-100 text-base leading-relaxed">
              Your comprehensive platform for IELTS preparation and practice
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Sign In Form */}
        <div className="flex w-full md:w-[55%] flex-col justify-center px-8 py-12 md:px-16 lg:px-24 overflow-y-auto">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Verification Pending Banner */}
            {verificationPending && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  ✅ We sent a verification link to your email. Please check
                  your inbox (and spam folder) and click the link before signing
                  in.
                </p>
              </div>
            )}

            {/* Verified Success Banner */}
            {verified && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  ✅ Your email has been verified! You can now sign in.
                </p>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-400 mt-0.5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Error</p>
                    <p className="mt-1">{error}</p>
                    {verificationError && (
                      <button
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        className="mt-2 inline-flex items-center text-red-700 hover:text-red-800 font-medium text-sm focus:outline-none disabled:opacity-50"
                      >
                        {resendLoading
                          ? "Sending..."
                          : "Resend verification email"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@university.edu"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/user/forgot-password"
                    className="text-sm font-medium text-red-700 hover:text-red-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn("linkedin")}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="#0077B5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/user/signup"
                className="font-medium text-red-700 hover:text-red-800"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2600}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        theme="light"
        toastClassName={() =>
          "relative rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-medium leading-5 whitespace-normal break-words shadow-lg px-3 py-2 pr-8"
        }
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      />
    </div>
  );
};

export default SignInForm;
