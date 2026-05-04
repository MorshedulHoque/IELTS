"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaHeadphones,
  FaBookOpen,
  FaPencilAlt,
  FaMicrophone,
  FaChartLine,
  FaUserFriends,
  FaGraduationCap,
  FaChartBar,
  FaStar,
  FaArrowRight,
  FaAward,
  FaClock,
  FaUsers,
  FaRocket,
  FaLightbulb,
  FaTrophy,
  FaDesktop,
  FaRedo,
  FaGlobeAmericas,
  FaUserCheck,
} from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { IoMdTimer } from "react-icons/io";
import { GiProgression } from "react-icons/gi";

export default function IELTSLandingPage(): any {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    // Use setTimeout to ensure refs are set
    const timeoutId = setTimeout(() => {
      Object.values(sectionsRef.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      Object.values(sectionsRef.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const fadeInUp = (id: string) =>
    isVisible[id]
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-10 transition-all duration-700 ease-out";

  const fadeIn = (id: string) =>
    isVisible[id]
      ? "opacity-100 transition-all duration-1000 ease-out"
      : "opacity-0 transition-all duration-1000 ease-out";

  const scaleIn = (id: string) =>
    isVisible[id]
      ? "opacity-100 scale-100 transition-all duration-700 ease-out"
      : "opacity-0 scale-95 transition-all duration-700 ease-out";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 text-base-content overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-6 px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-24 -left-24 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
          <div className="absolute -top-24 right-0 w-[26rem] h-[26rem] bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-8rem] left-1/2 w-[22rem] h-[22rem] bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div
              ref={(el) => {
                sectionsRef.current["hero-left"] = el;
              }}
              id="hero-left"
              className={`${fadeInUp("hero-left")}`}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-xs md:text-sm font-semibold border border-emerald-200 shadow-sm">
                  <FaCheckCircle className="text-emerald-500" />
                  <span>100% Free, No Card</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-rose-700 text-xs md:text-sm font-medium border border-rose-100 shadow-sm">
                  <FaAward className="text-rose-500" />
                  <span>50,000+ Students</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-tight tracking-tight mb-5">
                <span className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                  Turn IELTS practice
                </span>
                <br />
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-800 bg-clip-text text-transparent">
                  into visible progress.
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-600 mb-7 leading-relaxed max-w-xl">
                Real exam-style tests for Listening, Reading, Writing, and Speaking,
                with clear analytics so you always know exactly{" "}
                <span className="font-semibold text-rose-600">
                  what to fix next
                </span>
                . Built to feel like a modern product, not a boring worksheet.
              </p>

              <div className="flex flex-wrap gap-3 md:gap-4 mb-9">
                <Link
                  href="/test/reading"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 px-7 md:px-9 py-3.5 md:py-4 text-sm md:text-base font-semibold text-white shadow-[0_14px_35px_rgba(248,113,113,0.6)] hover:shadow-[0_18px_45px_rgba(220,38,38,0.8)] transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start a free practice test
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-800 to-rose-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/80 border border-rose-200 px-7 md:px-8 py-3.5 md:py-4 text-sm md:text-base font-semibold text-rose-700 hover:border-rose-400 hover:bg-rose-50/70 hover:text-rose-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  See how it works
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { value: "98%", label: "Success rate", icon: FaTrophy },
                  { value: "50K+", label: "Students", icon: FaUsers },
                  { value: "4.9/5", label: "Average rating", icon: FaStar },
                  { value: "24/7", label: "Available", icon: FaClock },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-rose-100"
                  >
                    <stat.icon className="text-rose-500 text-xl mb-2" />
                    <div className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual - product-style preview card */}
            <div
              ref={(el) => {
                sectionsRef.current["hero-right"] = el;
              }}
              id="hero-right"
              className={`${scaleIn(
                "hero-right"
              )} flex justify-center lg:justify-end`}
            >
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="absolute -top-6 -right-6 h-20 w-20 rounded-3xl bg-gradient-to-tr from-rose-200 via-red-200 to-orange-200 blur-xl opacity-70" />

                <div className="relative rounded-3xl border border-rose-100 bg-white shadow-[0_22px_60px_rgba(148,27,45,0.18)] overflow-hidden backdrop-blur-xl">
                  {/* Fake window header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-amber-50">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs font-medium text-rose-700">
                      BandGrowth • Dashboard preview
                    </p>
                    <span className="h-5 w-10 rounded-full bg-rose-100/70 flex items-center justify-end px-1">
                      <span className="h-3 w-3 rounded-full bg-rose-500" />
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="p-5 md:p-6 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-rose-600 uppercase tracking-[0.16em] mb-1">
                          Today’s overview
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          IELTS progress snapshot
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <FaChartLine className="text-emerald-500" />
                        <span>+1.0 band vs last week</span>
                      </div>
                    </div>

                    {/* Skill chips */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: FaHeadphones, label: "Listening", score: "7.0" },
                        { icon: FaBookOpen, label: "Reading", score: "7.5" },
                        { icon: FaPencilAlt, label: "Writing", score: "6.5" },
                        { icon: FaMicrophone, label: "Speaking", score: "7.0" },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 hover:border-rose-200 hover:bg-rose-50/70 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-sm text-sm">
                                <Icon />
                              </span>
                              <div>
                                <p className="text-xs font-semibold text-slate-900">
                                  {item.label}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Mock tests • timed
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-semibold text-slate-900">
                                {item.score}
                              </p>
                              <p className="text-[10px] text-emerald-600">
                                +0.5
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mini chart-style block */}
                    <div className="mt-1 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-amber-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-slate-900">
                          Last 10 tests
                        </p>
                        <span className="rounded-full bg-white/80 border border-rose-100 px-2.5 py-1 text-[10px] font-medium text-rose-700">
                          Trend: steady improvement
                        </span>
                      </div>
                      <div className="h-20 w-full rounded-xl bg-gradient-to-t from-rose-200/60 via-rose-100/40 to-transparent overflow-hidden flex items-end gap-[3px] px-4 pb-3">
                        {[40, 55, 52, 60, 65, 70, 72, 74, 78, 80].map(
                          (h, i) => (
                            <span
                              key={i}
                              className="flex-1 rounded-sm bg-gradient-to-t from-rose-500 to-orange-400 scale-x-75 origin-bottom"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-6 -right-3 bg-white/95 rounded-2xl px-4 py-3 shadow-xl border border-rose-100 backdrop-blur-md animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-emerald-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">
                        Target band unlocked
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        Band 7.5 in 6 weeks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={(el) => {
          sectionsRef.current["features"] = el;
        }}
        className="py-24 px-4 bg-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("features")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaLightbulb className="text-red-600" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Everything You Need to
              <br />
              <span className="text-red-600">Excel in IELTS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with
              proven teaching methods to deliver exceptional results.{" "}
              <span className="font-semibold text-green-600">
                All features are completely free
              </span>{" "}
              - no hidden costs, no subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaCheckCircle,
                title: "Realistic Mock Tests",
                desc: "Full-length practice tests that perfectly mirror the actual IELTS exam format and difficulty level. Unlimited access, completely free.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaChartLine,
                title: "Advanced Analytics",
                desc: "Detailed performance insights with visual reports to track your progress and identify improvement areas.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaUserFriends,
                title: "Expert Feedback",
                desc: "Personalized evaluations from certified IELTS instructors with actionable recommendations.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaGraduationCap,
                title: "Comprehensive Learning",
                desc: "Video lessons, study materials, and practice exercises covering all four test sections.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`group ${fadeInUp(`feature-${index}`)}`}
                  ref={(el) => {
                    sectionsRef.current[`feature-${index}`] = el;
                  }}
                  id={`feature-${index}`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-2">
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`text-3xl ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section
        id="who-is-this-for"
        ref={(el) => {
          sectionsRef.current["who-is-this-for"] = el;
        }}
        className="py-24 px-4 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("who-is-this-for")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaUserCheck className="text-red-600" />
              <span>Perfect For You</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Who Is BandGrowth For?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're taking IELTS for the first time or aiming to
              improve your score, we're here to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FaGraduationCap,
                title: "First-time IELTS Takers",
                description:
                  "New to IELTS? Start your journey with confidence. Our platform guides you through every step.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaRedo,
                title: "Retakers",
                description:
                  "Aiming for a higher band score? Focus on your weak areas with targeted practice and detailed feedback.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaDesktop,
                title: "Computer-Based Candidates",
                description:
                  "Preparing for computer-delivered IELTS? Practice in the exact format you'll face on test day.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaGlobeAmericas,
                title: "Study, Work & Migration",
                description:
                  "Whether you're pursuing education, career opportunities, or immigration, achieve your target band score.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`${fadeInUp(`who-for-${index}`)}`}
                  ref={(el) => {
                    sectionsRef.current[`who-for-${index}`] = el;
                  }}
                  id={`who-for-${index}`}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-2 text-center">
                    <div
                      className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`text-3xl ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={(el) => {
          sectionsRef.current["how-it-works"] = el;
        }}
        className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("how-it-works")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaRocket className="text-red-600" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your path to IELTS success in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                step: "1",
                icon: TbTargetArrow,
                title: "Choose Your Module",
                desc: "Select from Listening, Reading, Writing, or Speaking. Each module is designed to match the real IELTS exam format.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                step: "2",
                icon: IoMdTimer,
                title: "Take Practice Tests",
                desc: "Experience the real exam environment with built-in timers, progress tracking, and interactive question types.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                step: "3",
                icon: FaChartBar,
                title: "Analyze Performance",
                desc: "Get detailed feedback, review your answers, and understand your strengths and areas for improvement.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                step: "4",
                icon: GiProgression,
                title: "Improve & Succeed",
                desc: "Use insights to focus your study, practice more, and watch your band score improve over time.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`relative group ${fadeInUp(`step-${index}`)}`}
                  ref={(el) => {
                    sectionsRef.current[`step-${index}`] = el;
                  }}
                  id={`step-${index}`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 z-10">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>

                  {/* Main Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-2">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`text-3xl ${item.color}`} />
                      </div>
                      <h4 className="text-xl font-bold mb-4 text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-7 z-0">
                      <FaArrowRight className="text-gray-300 text-2xl" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Box */}
          <div
            className={`text-center ${fadeIn("cta-box")}`}
            ref={(el) => {
              sectionsRef.current["cta-box"] = el;
            }}
            id="cta-box"
          >
            <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-3xl p-12 border border-red-100 max-w-5xl mx-auto shadow-xl">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Your IELTS Journey?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of successful test-takers who have improved their
                band scores with our comprehensive practice platform.{" "}
                <span className="font-semibold text-green-600">
                  Everything is free
                </span>{" "}
                - unlimited practice tests, analytics, and feedback.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/test/reading"
                  className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Start Free Test
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/user/signup"
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-600 hover:text-red-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why BandGrowth Section */}
      <section
        id="why-bandgrowth"
        ref={(el) => {
          sectionsRef.current["why-bandgrowth"] = el;
        }}
        className="py-24 px-4 bg-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("why-bandgrowth")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaTrophy className="text-red-600" />
              <span>Trust & Value</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why Choose BandGrowth?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another practice platform. We're your partner in
              achieving IELTS success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: FaDesktop,
                title: "Designed for Computer-Based IELTS",
                description:
                  "Our platform mirrors the exact computer-delivered IELTS format. Practice in the same interface you'll see on test day.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaChartLine,
                title: "Focus on Band Improvement",
                description:
                  "We don't just test you—we help you improve. Get actionable insights and targeted practice to boost your band score.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaChartBar,
                title: "Clear Analytics, Not Confusion",
                description:
                  "Understand your performance with intuitive visual reports. No complex scoring systems—just clear, actionable insights.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
              {
                icon: FaClock,
                title: "Practice Anytime, Anywhere",
                description:
                  "Access full practice tests, writing samples, and analytics 24/7. Study at your own pace, on any device.",
                color: "text-rose-600",
                bgColor: "bg-rose-50",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`${fadeInUp(`why-${index}`)}`}
                  ref={(el) => {
                    sectionsRef.current[`why-${index}`] = el;
                  }}
                  id={`why-${index}`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-2">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`text-2xl ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Writing Samples Section */}
      <section
        id="writing-samples"
        ref={(el) => {
          sectionsRef.current["writing-samples"] = el;
        }}
        className="py-24 px-4 bg-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("writing-samples")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaBookOpen className="text-red-600" />
              <span>Learn from Examples</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Explore Writing Samples
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Study model answers for Task 1 and Task 2 questions. Learn from
              expertly crafted responses that demonstrate high band score
              techniques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                task: "Task 1",
                title: "Academic Writing Task 1",
                description:
                  "View sample answers for charts, graphs, maps, and process diagrams. Learn how to describe data effectively and achieve Band 7+ scores.",
                questionTypes: [
                  "Line Graph",
                  "Bar Chart",
                  "Pie Chart",
                  "Table",
                  "Map",
                  "Process",
                ],
                link: "/writing-samples?task=1",
                bgColor: "bg-blue-50",
              },
              {
                task: "Task 2",
                title: "Academic Writing Task 2",
                description:
                  "Study model essays for opinion, discussion, and problem-solution questions. Understand structure, vocabulary, and argumentation techniques.",
                questionTypes: [
                  "Agree/Disagree",
                  "Discussion",
                  "Problem/Solution",
                  "Advantages/Disadvantages",
                ],
                link: "/writing-samples?task=2",
                bgColor: "bg-purple-50",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${fadeInUp(`writing-sample-${index}`)}`}
                ref={(el) => {
                  sectionsRef.current[`writing-sample-${index}`] = el;
                }}
                id={`writing-sample-${index}`}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 h-full transform hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center`}
                    >
                      <FaPencilAlt
                        className={`text-3xl ${
                          index === 0 ? "text-blue-600" : "text-purple-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="badge badge-primary bg-red-600 border-0 text-white mb-2">
                        {item.task}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Question Types:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.questionTypes.map((type, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={item.link}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    View {item.task} Samples
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`text-center mt-12 ${fadeIn("writing-samples-cta")}`}
            ref={(el) => {
              sectionsRef.current["writing-samples-cta"] = el;
            }}
            id="writing-samples-cta"
          >
            <Link
              href="/writing-samples"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Browse All Writing Samples
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        ref={(el) => {
          sectionsRef.current["testimonials"] = el;
        }}
        className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-20 ${fadeInUp("testimonials")}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-4">
              <FaStar className="text-red-600" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Trusted by Thousands of Students
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real students who achieved their dream band
              scores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Kim",
                score: "7.5",
                role: "University Student",
                text: "The practice tests were incredibly realistic and helped me understand the exam format. I improved my writing score by 1.5 bands in just 3 months!",
                avatar: "SK",
                country: "South Korea",
              },
              {
                name: "David Martinez",
                score: "8.0",
                role: "Software Engineer",
                text: "The AI-powered feedback on my speaking practice was game-changing. I finally overcame my hesitation and achieved my target score.",
                avatar: "DM",
                country: "Mexico",
              },
              {
                name: "Priya Sharma",
                score: "8.5",
                role: "Medical Professional",
                text: "The comprehensive analytics helped me identify my weak areas. The vocabulary builder and reading strategies were particularly helpful.",
                avatar: "PS",
                country: "India",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`${fadeInUp(`testimonial-${index}`)}`}
                ref={(el) => {
                  sectionsRef.current[`testimonial-${index}`] = el;
                }}
                id={`testimonial-${index}`}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-2">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="badge badge-primary bg-red-600 border-0 text-white">
                          Band {testimonial.score}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {testimonial.role} • {testimonial.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={(el) => {
          sectionsRef.current["final-cta"] = el;
        }}
        id="final-cta"
        className="py-24 px-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <FaTrophy className="text-6xl mb-6 mx-auto opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Achieve Your IELTS Goals?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95">
            Join thousands of successful test-takers and start your journey to a
            higher band score today.{" "}
            <span className="font-bold">100% free</span> - no credit card, no
            trial period, just free practice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/user/signup"
              className="group px-10 py-5 bg-white text-red-700 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-2 text-lg"
            >
              Get Started Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="#features"
              className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
