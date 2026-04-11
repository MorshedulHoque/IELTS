"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} from "libphonenumber-js";

import { getOnboardingData, saveOnboardingData } from "@/services/data";

type OnboardingData = {
  fullName: string;
  phoneNo: string;
  purpose: string;
  targetScore: string;
  examDateType: string;
  customExamDate: string;
  englishLevel: string;
  hardestModule: string | string[];
  targetCountries: string[];
};

const purposeOptions = [
  "Study Abroad",
  "Work Abroad",
  "Immigration / PR",
  "Professional Registration",
  "Other / Exploring",
];

const targetScoreOptions = ["6.0", "6.5", "7.0", "7.5", "8.0+", "Not sure yet"];

const englishLevels = [
  "Beginner",
  "Upper Beginner",
  "Intermediate",
  "Upper Intermediate",
  "Advanced",
];

const moduleOptions = [
  "Listening",
  "Reading",
  "Writing",
  "Speaking",
  "Not sure",
];

const countryOptions = [
  "UK",
  "Canada",
  "Australia",
  "USA",
  "New Zealand",
  "Europe (Other)",
  "Middle East",
  "Still exploring",
];

const examDateQuickSelect = [
  { id: "lt1", label: "Within 1 month" },
  { id: "1-3", label: "In 1–3 months" },
  { id: "3+", label: "3+ months away" },
];

const DEFAULT_FORM: OnboardingData = {
  fullName: "",
  phoneNo: "",
  purpose: "",
  targetScore: "",
  examDateType: "",
  customExamDate: "",
  englishLevel: "",
  hardestModule: [],
  targetCountries: [],
};

const ONBOARDING_STORAGE_KEY = "ielts-onboarding-status";

type Question = {
  id: keyof OnboardingData;
  title: string;
  description?: string;
  type: "single" | "multi" | "date" | "text" | "phone";
  options?: string[];
  quickSelect?: { id: string; label: string }[];
  placeholder?: string;
};

const questions: Question[] = [
  {
    id: "fullName",
    title: "What's your full name?",
    description: "Please enter your full name",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    id: "phoneNo",
    title: "What's your phone number?",
    description: "We'll use this to contact you about your IELTS prep",
    type: "phone",
    placeholder: "Enter your phone number",
  },
  {
    id: "purpose",
    title: "What's your purpose for taking IELTS?",
    description: "Help us understand your goals",
    type: "single",
    options: purposeOptions,
  },
  {
    id: "targetScore",
    title: "What's your target band score?",
    description: "Select your goal score",
    type: "single",
    options: targetScoreOptions,
  },
  {
    id: "examDateType",
    title: "When do you plan to take the exam?",
    description: "Choose a timeframe or select a specific date",
    type: "date",
    quickSelect: examDateQuickSelect,
  },
  {
    id: "englishLevel",
    title: "What's your current English level?",
    description: "Self-assess your proficiency",
    type: "single",
    options: englishLevels,
  },
  {
    id: "hardestModule",
    title: "Which IELTS module is most challenging for you?",
    description: "Tell us where you need the most help (select all that apply)",
    type: "multi",
    options: moduleOptions,
  },
  {
    id: "targetCountries",
    title: "Which countries or regions are you targeting?",
    description: "Select all that apply",
    type: "multi",
    options: countryOptions,
  },
];

const OnboardingWizard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const { data: session, status } = useSession();
  const [form, setForm] = useState<OnboardingData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const storageKey = session?.user?.id
    ? `${ONBOARDING_STORAGE_KEY}-${session.user.id}`
    : ONBOARDING_STORAGE_KEY;

  useEffect(() => {
    if (status === "loading") return;
    if (typeof window === "undefined") return;

    if (status === "unauthenticated") {
      setIsCheckingStatus(false);
      router.replace("/user/signin");
      return;
    }

    if (!session?.user?.id) {
      setIsCheckingStatus(false);
      return;
    }

    // Skip onboarding for admin users
    if (session?.user?.role === "admin") {
      setIsCheckingStatus(false);
      router.replace(nextPath);
      return;
    }

    let isMounted = true;

    const hydrateStatus = async () => {
      try {
        const response = await getOnboardingData(session.user.id);
        const onboardingRecord = response?.data ?? null;
        const onboardingStatus = onboardingRecord?.status;

        console.log("Onboarding check:", {
          hasRecord: !!onboardingRecord,
          status: onboardingStatus,
          record: onboardingRecord,
        });

        // Only if onboarding is completed, redirect immediately
        // If skipped, user must see onboarding again until they submit
        if (onboardingRecord && onboardingStatus === "completed") {
          localStorage.setItem(storageKey, onboardingStatus);
          router.replace(nextPath);
          return;
        }

        // If no record exists, status is skipped, or status is in-progress, show wizard
        localStorage.setItem(storageKey, "in-progress");
      } catch (error) {
        console.error("Failed to load onboarding status", error);
        // If error occurs, show wizard (safe default)
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      }
    };

    hydrateStatus();

    return () => {
      isMounted = false;
    };
  }, [
    session?.user?.id,
    session?.user?.role,
    status,
    router,
    nextPath,
    storageKey,
  ]);

  // Calculate progress based on filled fields
  const progressValue = useMemo(() => {
    const hardestModuleFilled = Array.isArray(form.hardestModule)
      ? form.hardestModule.length > 0
      : form.hardestModule !== "";
    const fields = [
      form.fullName,
      form.phoneNo,
      form.purpose,
      form.targetScore,
      form.examDateType || form.customExamDate,
      form.englishLevel,
      hardestModuleFilled,
      form.targetCountries.length > 0,
    ];
    const filledCount = fields.filter(Boolean).length;
    return Math.round((filledCount / fields.length) * 100);
  }, [form]);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    // Validate phone number
    let isPhoneValid = false;
    if (form.phoneNo) {
      try {
        const phoneWithPlus = form.phoneNo.startsWith("+")
          ? form.phoneNo
          : `+${form.phoneNo}`;
        isPhoneValid = isValidPhoneNumber(phoneWithPlus);
      } catch {
        isPhoneValid = false;
      }
    }

    return (
      form.fullName.trim() !== "" &&
      form.phoneNo !== "" &&
      isPhoneValid &&
      form.purpose !== "" &&
      form.targetScore !== "" &&
      (form.examDateType !== "" || form.customExamDate !== "") &&
      form.englishLevel !== "" &&
      (form.hardestModule as string[]).length > 0 &&
      form.targetCountries.length > 0
    );
  }, [form]);

  const handleSelect = (field: keyof OnboardingData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    // react-phone-input-2 returns value without + prefix (e.g., "1234567890")
    // We'll add the + prefix when validating and storing
    setForm((prev) => ({ ...prev, phoneNo: value }));
  };

  const toggleMultiSelect = (field: keyof OnboardingData, value: string) => {
    setForm((prev) => {
      const current = new Set(prev[field] as string[]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (status === "loading") return;
    if (!session?.user?.id) {
      setSubmitError(
        "We couldn't verify your account. Please sign in again to continue."
      );
      return;
    }

    // Validate all required fields
    if (!isFormValid) {
      setSubmitError("Please answer all questions before submitting.");
      // Scroll to first unanswered question
      const firstUnanswered = questions.find((q) => {
        if (q.type === "multi") {
          return (form[q.id] as string[]).length === 0;
        }
        if (q.id === "examDateType") {
          return !form.examDateType && !form.customExamDate;
        }
        if (q.type === "text") {
          return !(form[q.id] as string)?.trim();
        }
        if (q.type === "phone") {
          if (!form.phoneNo) return true;
          try {
            const phoneWithPlus = form.phoneNo.startsWith("+")
              ? form.phoneNo
              : `+${form.phoneNo}`;
            return !isValidPhoneNumber(phoneWithPlus);
          } catch {
            return true;
          }
        }
        return !form[q.id];
      });
      if (firstUnanswered) {
        const element = document.querySelector(
          `[data-question-id="${firstUnanswered.id}"]`
        );
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Validate and format phone number before submission
    let formattedPhoneNo = form.phoneNo;
    if (form.phoneNo) {
      try {
        // react-phone-input-2 returns value without + prefix, add it for validation
        const phoneWithPlus = form.phoneNo.startsWith("+")
          ? form.phoneNo
          : `+${form.phoneNo}`;
        const phoneNumber = parsePhoneNumberFromString(phoneWithPlus);

        if (phoneNumber && isValidPhoneNumber(phoneNumber.number)) {
          // Store in E.164 format (e.g., +1234567890)
          formattedPhoneNo = phoneNumber.format("E.164");
        } else {
          setSubmitError("Please enter a valid phone number.");
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Phone number validation error:", error);
        setSubmitError("Please enter a valid phone number.");
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        phoneNo: formattedPhoneNo, // Use formatted phone number
        examDate:
          form.customExamDate?.trim() ||
          (form.examDateType ? form.examDateType : ""),
        status: "completed",
        completedAt: new Date().toISOString(),
      };

      console.log("Saving onboarding data:", {
        userId: session.user.id,
        payload,
      });
      const result = await saveOnboardingData(session.user.id, payload);
      console.log("Onboarding save result:", result);

      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, "completed");
      }
      setIsComplete(true);
      setTimeout(() => {
        router.push(nextPath);
      }, 1500);
    } catch (error) {
      console.error("Failed to save onboarding", error);
      setSubmitError(
        "We couldn't save your preferences. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render wizard if we're checking status or if user is not authenticated
  if (status === "loading" || isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-dots loading-lg text-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome! Let's get started
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              A few quick questions to personalize your experience. Completing
              this takes under 90 seconds.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, "skipped");
              }
              if (session?.user?.id) {
                try {
                  await saveOnboardingData(session.user.id, {
                    status: "skipped",
                  });
                } catch (error) {
                  console.error("Failed to persist onboarding skip", error);
                }
              }
              router.push("/");
            }}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for Now
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs font-medium text-gray-500">
            <span>{Math.round(progressValue)}% complete</span>
            <span>{questions.length} questions</span>
          </div>
        </div>

        {/* All Questions Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          {submitError && (
            <div className="alert alert-error mb-4">
              <span>{submitError}</span>
            </div>
          )}

          <div className="space-y-5">
            {questions.map((question, qIdx) => {
              const isAnswered =
                question.type === "multi"
                  ? (form[question.id] as string[]).length > 0
                  : question.id === "examDateType"
                  ? form.examDateType !== "" || form.customExamDate !== ""
                  : question.id === "hardestModule"
                  ? Array.isArray(form.hardestModule)
                    ? form.hardestModule.length > 0
                    : form.hardestModule !== ""
                  : question.type === "text"
                  ? (form[question.id] as string).trim() !== ""
                  : question.type === "phone"
                  ? form.phoneNo !== "" &&
                    (() => {
                      try {
                        const phoneWithPlus = form.phoneNo.startsWith("+")
                          ? form.phoneNo
                          : `+${form.phoneNo}`;
                        return isValidPhoneNumber(phoneWithPlus);
                      } catch {
                        return false;
                      }
                    })()
                  : form[question.id] !== "";

              return (
                <div
                  key={question.id}
                  data-question-id={question.id}
                  className={`border-b border-gray-100 last:border-0 pb-5 last:pb-0 relative ${
                    question.type === "phone" ? "z-[999]" : "z-0"
                  } ${!isAnswered ? "opacity-90" : ""}`}
                >
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold flex-shrink-0 ${
                          isAnswered
                            ? "bg-gradient-to-br from-red-500 to-red-600"
                            : "bg-gray-400"
                        }`}
                      >
                        {qIdx + 1}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {question.title}
                        <span className="text-red-500 ml-1">*</span>
                      </h3>
                    </div>
                    {question.description && (
                      <p className="text-xs text-gray-500 ml-7">
                        {question.description}
                      </p>
                    )}
                    {/* {!isAnswered && (
                    <p className="text-xs text-red-500 ml-7 mt-1">
                      This field is required
                    </p>
                  )} */}
                  </div>

                  <div className="ml-7">
                    {question.type === "text" && (
                      <input
                        type="text"
                        value={form[question.id] as string}
                        onChange={(e) =>
                          handleSelect(question.id, e.target.value)
                        }
                        placeholder={question.placeholder}
                        className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all text-sm"
                      />
                    )}

                    {question.type === "phone" && (
                      <div className="phone-input-wrapper w-full relative z-[1000]">
                        <PhoneInput
                          country={"us"}
                          value={form.phoneNo}
                          onChange={handlePhoneChange}
                          inputProps={{
                            required: true,
                            autoFocus: false,
                          }}
                          containerClass="phone-input-container"
                          inputClass="phone-input-field"
                          buttonClass="phone-input-button"
                          dropdownClass="phone-input-dropdown"
                          searchClass="phone-input-search"
                          placeholder="Enter your phone number"
                          enableSearch={true}
                          disableSearchIcon={true}
                          countryCodeEditable={true}
                          specialLabel=""
                        />
                      </div>
                    )}

                    {question.type === "single" && (
                      <div className="flex flex-wrap gap-2">
                        {question.options?.map((option) => {
                          const isSelected = form[question.id] === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleSelect(question.id, option)}
                              className={`px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                                isSelected
                                  ? "border-red-500 bg-red-50 text-red-700 font-medium"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50/50"
                              }`}
                            >
                              <span className="text-sm">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {question.type === "multi" && (
                      <div className="flex flex-wrap gap-2">
                        {question.options?.map((option) => {
                          const isSelected = (
                            form[question.id] as string[]
                          ).includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                toggleMultiSelect(question.id, option)
                              }
                              className={`px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                                isSelected
                                  ? "border-red-500 bg-red-50 text-red-700 font-medium"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50/50"
                              }`}
                            >
                              <span className="text-sm">{option}</span>
                              {isSelected && (
                                <svg
                                  className="w-3.5 h-3.5 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {question.type === "date" && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {question.quickSelect?.map((item) => {
                            const isSelected = form.examDateType === item.label;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  handleSelect("examDateType", item.label)
                                }
                                className={`px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                                  isSelected
                                    ? "border-red-500 bg-red-50 text-red-700 font-medium"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50/50"
                                }`}
                              >
                                <span className="text-sm">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-400">
                              OR
                            </span>
                          </div>
                        </div>
                        <input
                          type="date"
                          value={form.customExamDate}
                          onChange={(e) =>
                            handleSelect("customExamDate", e.target.value)
                          }
                          className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-200 transition-all text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 shadow-md ${
                isSubmitting || !isFormValid
                  ? "opacity-50 cursor-not-allowed bg-gray-400"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </span>
              ) : (
                "Complete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
