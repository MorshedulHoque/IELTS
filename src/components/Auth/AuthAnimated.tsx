"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

import { getOnboardingData, postUser } from "@/services/data";

type Mode = "signin" | "signup";

interface SignUpData {
  email: string;
  password: string;
  role: string;
}

interface AuthAnimatedProps {
  initialMode?: Mode;
}

const AuthAnimated: React.FC<AuthAnimatedProps> = ({ initialMode = "signin" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlMode = (searchParams.get("mode") as Mode) || initialMode;

  const [mode, setMode] = useState<Mode>(urlMode);

  useEffect(() => {
    setMode(urlMode);
  }, [urlMode]);

  // Sign in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign up state
  const [signUpForm, setSignUpForm] = useState<SignUpData>({
    email: "",
    password: "",
    role: "user",
  });
  const [signUpLoading, setSignUpLoading] = useState(false);

  const isSignUp = mode === "signup";

  // Prevent page scroll on auth screens (lock body scroll)
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: `/api/auth/oauth-redirect?callbackUrl=${encodeURIComponent(
        callbackUrl,
      )}`,
      redirect: true,
    });
  };

  // SIGN IN HANDLER (copied from SignInForm with minimal changes)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setSignInLoading(false);
      let errorMessage = "Invalid Email or Password!";
      if (res.error.includes("Please sign in with")) {
        errorMessage = res.error;
      } else if (res.error.includes("Password not set")) {
        errorMessage = res.error;
      }
      toast.error(errorMessage);
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
        setSignInLoading(false);
        router.push(callbackUrl);
        return;
      }

      if (userId) {
        try {
          const onboardingResponse = await getOnboardingData(userId);
          const onboardingRecord = onboardingResponse?.data;
          const onboardingStatus = onboardingRecord?.status;

          if (onboardingRecord && onboardingStatus === "completed") {
            setSignInLoading(false);
            router.push(callbackUrl);
            return;
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      }

      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setSignInLoading(false);
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
          setSignInLoading(false);
          router.push(callbackUrl);
          return;
        }
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
      const encodedNext = encodeURIComponent(callbackUrl);
      router.push(`/user/onboarding?next=${encodedNext}`);
      setSignInLoading(false);
    }
  };

  // SIGN UP HANDLERS (based on existing SignUp component)
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);

    try {
      const usernameFallback =
        signUpForm.email?.split("@")[0] || `ielts_user_${Date.now()}`;

      const payload = {
        username: usernameFallback,
        email: signUpForm.email,
        password: signUpForm.password,
        role: signUpForm.role,
      };

      const res = await postUser(JSON.stringify(payload));
      console.log("sign up", res);

      if (res.success) {
        toast.success("Account created successfully! Redirecting to sign in...", {
          autoClose: 1500,
        });
        setTimeout(() => {
          window.location.assign("/user/signin");
        }, 1600);
      } else {
        throw new Error(res.error || "Failed to create account");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        (err?.response?.status === 409
          ? "This email already has an account. Please sign in instead."
          : err?.message) ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="grid h-[calc(100dvh-4rem)] w-full place-items-center bg-gray-50 font-sans antialiased overflow-hidden px-4">
      <div className="relative w-full max-w-6xl h-[min(640px,calc(100dvh-6rem))] rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Sliding track */}
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{
            transform: isSignUp ? "translateX(-50%)" : "translateX(0%)",
            width: "200%",
          }}
        >
          {/* LEFT HALF (Sign In view) */}
          <div className="flex w-1/2">
            {/* Red branding panel (left in sign-in mode) */}
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
                <h2 className="text-3xl font-bold mb-4">IELTS Workspace</h2>
                <p className="text-red-100 text-sm leading-relaxed">
                  Your comprehensive platform for IELTS preparation and practice.
                </p>
              </div>
            </div>

            {/* Sign in form */}
            <div className="flex w-full md:w-1/2 flex-col justify-center px-8 py-[22px] md:px-12 lg:px-16 overflow-hidden">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Welcome back
                  </h1>
                  <p className="text-gray-600 text-sm text-center">
                    Sign in to continue your learning journey.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-center text-sm text-gray-500">
                      Sign in with Google or your email
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn("google")}
                      className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
                    >
                      <span className="mr-2 h-5 w-5">G</span>
                      Continue with Google
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-3 text-gray-500">
                        Or sign in with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSignInSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="signin-email"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="signin-email"
                      type="email"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@university.edu"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="signin-password"
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
                      id="signin-password"
                      type="password"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {signInLoading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-medium text-red-700 hover:text-red-800"
                  >
                    Create account
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT HALF (Sign Up view) */}
          <div className="flex w-1/2">
            {/* Sign up form (left in sign-up mode) */}
            <div className="flex w-full md:w-1/2 flex-col justify-center px-8 py-12 md:px-12 lg:px-16 overflow-hidden">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 text-center">
                    Create Account
                  </h1>
                  <p className="mt-2 text-gray-600 text-sm text-center">
                    Start your IELTS preparation journey today.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-center text-sm text-gray-500">
                      Sign up with Google or create an account with email
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn("google")}
                      className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
                    >
                      <span className="mr-2 h-5 w-5">G</span>
                      Continue with Google
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-3 text-gray-500">
                        Or sign up with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSignUpSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="signup-email"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        name="email"
                        value={signUpForm.email}
                        onChange={handleSignUpChange}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                        required
                        placeholder="you@university.edu"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="signup-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <span className="text-xs text-gray-500">
                          Min. 8 characters
                        </span>
                      </div>
                      <input
                        id="signup-password"
                        type="password"
                        name="password"
                        value={signUpForm.password}
                        onChange={handleSignUpChange}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                        required
                        minLength={8}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={signUpLoading}
                      className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {signUpLoading ? "Creating account..." : "Create Account"}
                    </button>
                  </form>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-medium text-red-700 hover:text-red-800"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>

            {/* Red branding panel on the right when in sign-up mode */}
            <div className="relative hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-red-700 to-red-800 text-white px-10">
              <div className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <path d="M0,0 C50,15 50,85 0,100 L0,0 Z" fill="white" />
                </svg>
              </div>
              <div className="text-center max-w-sm z-0">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="font-bold text-2xl">I</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
                <p className="text-red-100 text-sm leading-relaxed">
                  Create your free account and unlock full IELTS preparation
                  tools.
                </p>
              </div>
            </div>
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

export default AuthAnimated;

