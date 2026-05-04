"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import { FaChartLine } from "react-icons/fa";
import { useSession } from "next-auth/react";
import {
  getAllListeningAnswers,
  getAllReadingAnswers,
  getAllWritingAnswers,
  getAllSpeakingAnswers,
  getSingleUser,
  getOnboardingData,
} from "@/services/data";
import HistoryTable from "./HistoryTable";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  Title
);

const Dashboard = () => {
  const { data } = useSession();
  const [selectedSkill, setSelectedSkill] = useState<
    "listening" | "reading" | "writing" | "speaking"
  >("listening");

  // Store all test data for all skills
  const [allSkillData, setAllSkillData] = useState<{
    listening: any[];
    reading: any[];
    writing: any[];
    speaking: any[];
  }>({ listening: [], reading: [], writing: [], speaking: [] });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  const skills = [
    { id: "listening", name: "Listening", color: "bg-red-500" },
    { id: "reading", name: "Reading", color: "bg-red-500" },
    { id: "writing", name: "Writing", color: "bg-red-500" },
    { id: "speaking", name: "Speaking", color: "bg-red-500" },
  ];

  useEffect(() => {
    const fetchAllSkills = async () => {
      if (!data?.user?.id) return;
      setLoading(true);
      const userId = data.user.id;
      try {
        const [listening, reading, writing, speaking] = await Promise.all([
          getAllListeningAnswers(userId),
          getAllReadingAnswers(userId),
          getAllWritingAnswers(userId),
          getAllSpeakingAnswers(userId),
        ]);
        setAllSkillData({
          listening: listening?.data || [],
          reading: reading?.data || [],
          writing: writing?.data || [],
          speaking: speaking?.data || [],
        });
      } catch (error) {
        console.error("Error fetching all skill data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUserData = async () => {
      if (!data?.user?.id) return;
      try {
        const result = await getSingleUser(data.user.id);
        setUserData(result?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    const fetchOnboardingData = async () => {
      if (!data?.user?.id) return;
      try {
        const result = await getOnboardingData(data.user.id);
        setOnboardingData(result?.data);
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
        setOnboardingData(null);
      }
    };
    
    if (data?.user?.id) {
      fetchAllSkills();
      fetchUserData();
      fetchOnboardingData();
    }
  }, [data?.user]);

  // For the selected skill, build testHistory for chart/table as before
  const testHistory = useMemo(() => {
    const arr = allSkillData[selectedSkill] || [];
    return arr
      .map((test: any) => {
        let writingScore = 0;
        let speakingScore = 0;
        
        if (selectedSkill === 'writing' && Array.isArray(test.answers) && test.answers.length > 0) {
          // For writing, calculate total word count instead of score
          const totalWords = test.answers.reduce((sum: number, answer: any) => {
            const wordCount = answer.response?.trim().split(/\s+/).filter((word: string) => word.length > 0).length || 0;
            return sum + wordCount;
          }, 0);
          writingScore = totalWords;
        }
        
        if (selectedSkill === 'speaking') {
          // For speaking, use recording duration as the metric
          speakingScore = test.feedback?.recording_duration || 0;
        }
        
        return {
          ...test,
          id: test._id,
          date: new Date(test.submittedAt).toISOString().split("T")[0],
          listening: 0,
          reading: 0,
          writing: selectedSkill === 'writing' ? writingScore : 0,
          speaking: selectedSkill === 'speaking' ? speakingScore : 0,
          [selectedSkill]: selectedSkill === 'writing' ? writingScore : 
                          selectedSkill === 'speaking' ? speakingScore : test.totalScore,
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [allSkillData, selectedSkill]);

  // min/max for y-axis
  const [minScore, maxScore] = useMemo(() => {
    if (testHistory.length === 0) return [0, 9];

    const all = testHistory.flatMap((t: any) => [
      t.listening,
      t.reading,
      t.writing,
      t.speaking,
    ]);

    return [
      Math.floor(Math.min(...all) - 0.5),
      Math.ceil(Math.max(...all) + 0.5),
    ];
  }, [testHistory]);

  // Chart.js data & options
  const chartData = useMemo(() => {
    // Reverse to show chronological order in chart (oldest to newest)
    const chronologicalTests = [...testHistory].reverse();

    const labels = chronologicalTests.map((t: any) =>
      new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    const dataPoints = chronologicalTests.map((t: any) => t[selectedSkill]);

    return {
      labels,
      datasets: [
        {
          label: selectedSkill === 'writing' 
            ? "Word Count Progression" 
            : selectedSkill === 'speaking'
            ? "Recording Duration (seconds)"
            : `${skills.find((s) => s.id === selectedSkill)?.name} Score`,
          data: dataPoints,
          fill: true,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.2)",
          pointBackgroundColor: "#6366f1",
          tension: 0.3,
        },
      ],
    };
  }, [testHistory, selectedSkill, skills]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: minScore,
          max: maxScore,
          title: { 
            display: true, 
            text: selectedSkill === 'writing' ? "Word Count" : 
                  selectedSkill === 'speaking' ? "Duration (seconds)" : "Score" 
          },
        },
        x: {
          title: { display: true, text: "Test Date" },
        },
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
    }),
    [minScore, maxScore, selectedSkill]
  );

  // Trend indicator
  const trend = (() => {
    if (testHistory.length < 2) return "stable";
    const first = testHistory[testHistory.length - 1][selectedSkill];
    const last = testHistory[0][selectedSkill];
    if (last > first + 0.5) return "up";
    if (last < first - 0.5) return "down";
    return "stable";
  })();

  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 text-slate-900 overflow-x-hidden">
      {/* background orbs / glow */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-rose-300/50 blur-3xl" />
        <div className="absolute top-40 -left-32 h-72 w-72 rounded-full bg-red-300/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-6 md:py-10">
        {/* Hero / Welcome */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="flex-1 space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-rose-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Live IELTS Progress
            </p>
            <h1 className="text-2.5xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                Turn your IELTS practice into a live,
              </span>{" "}
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-800 bg-clip-text text-transparent">
                beautifully visual dashboard.
              </span>
            </h1>
            <p className="max-w-xl text-sm md:text-base text-slate-600">
              See your Listening, Reading, Writing and Speaking progress in one clean,
              real‑time view. Built for focused prep, not boring spreadsheets.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(225,29,72,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(220,38,38,0.75)]"
              >
                Start a practice test
                <span className="text-xs opacity-80">↗</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-rose-700 backdrop-blur transition hover:border-rose-400 hover:bg-rose-50"
              >
                View full history
              </button>
              <p className="text-[11px] text-slate-500">
                No setup required. Just practice — we track everything.
              </p>
            </div>
          </div>

        </div>

        {/* Stats Cards - Highlight selected skill */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6 mb-8">
          {skills.map((skill) => {
            const arr = allSkillData[skill.id as keyof typeof allSkillData] || [];
            
            // Calculate highest score properly for each skill
            let highestScore = 0;
            let scoreLabel = "Highest score";
            
            if (skill.id === 'writing') {
              // For writing, show total tests taken
              highestScore = arr.length;
              scoreLabel = "Total Tests Taken";
            } else if (skill.id === 'speaking') {
              // For speaking, show total tests taken and average duration
              highestScore = arr.length;
              scoreLabel = "Total Tests Taken";
            } else {
              // For other skills, use totalScore as before
              highestScore = arr.length > 0 ? Math.max(...arr.map((test: any) => {
                return test.totalScore || 0;
              })) : 0;
              scoreLabel = "Highest score";
            }
            
            const isSelected = selectedSkill === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill.id as any)}
                className={`group cursor-pointer rounded-2xl border p-4 md:p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(248,113,113,0.25)] ${
                  isSelected
                    ? "border-rose-400 bg-gradient-to-br from-rose-600 via-red-600 to-orange-500 text-white"
                    : "border-rose-100 bg-white/90 hover:border-rose-300"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                        isSelected ? "text-rose-50/90" : "text-slate-500"
                      }`}
                    >
                      {skill.name}
                    </div>
                    <div
                      className={`mt-1 text-2xl md:text-3xl font-semibold tracking-tight ${
                        isSelected ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {highestScore}
                    </div>
                    <div
                      className={`mt-1 text-xs md:text-sm ${
                        isSelected ? "text-rose-100/90" : "text-slate-500"
                      }`}
                    >
                      {scoreLabel}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-2">
                      {/* <span className="h-7 w-7 rounded-full bg-white/30 ring-2 ring-rose-200 flex items-center justify-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_rgba(252,231,243,0.9)]" />
                      </span> */}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Skill & Range Select + Chart */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Filter Panel */}
          <div className="w-full lg:w-1/3">
            <div className="h-full rounded-2xl border border-rose-100 bg-white/90 p-5 shadow-[0_18px_40px_rgba(248,113,113,0.18)] backdrop-blur-xl">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500 mb-4">
                Skill focus
              </h2>

              {/* Skill Selector */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((s) => {
                    const active = selectedSkill === s.id;
                    return (
                      <button
                        key={s.id}
                        className={`flex items-center justify-center rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                          active
                            ? "border-rose-400 bg-rose-50 text-rose-700 shadow-[0_0_22px_rgba(248,113,113,0.45)]"
                            : "border-rose-100 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/80"
                        }`}
                        onClick={() => setSelectedSkill(s.id as any)}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-3">
                <h3 className="text-xs font-semibold text-rose-700 mb-1.5">
                  Data window
                </h3>
                <p className="text-[11px] leading-relaxed text-rose-700/80">
                  Showing the latest{" "}
                  <span className="font-semibold text-rose-800">
                    10 tests
                  </span>{" "}
                  for your{" "}
                  <span className="font-semibold text-rose-800">
                    {selectedSkill}
                  </span>{" "}
                  skill. Switch skills to compare trends.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-[11px] text-slate-500">
                  Tip: a smooth upward line usually means your preparation
                  routine is working. Use sudden drops as a signal to review
                  those tests.
                </p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Chart Card */}
            <div className="rounded-2xl border border-rose-100 bg-white shadow-[0_18px_45px_rgba(248,113,113,0.18)] overflow-hidden backdrop-blur-xl">
              <div className="flex justify-between items-center gap-3 border-b border-rose-100 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Latest 10 Tests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visualizing your{" "}
                    <span className="font-semibold text-rose-700">
                      {selectedSkill}
                    </span>{" "}
                    progression over time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium rounded-full px-2.5 py-1 border ${
                      trend === "up"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : trend === "down"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-slate-300 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {trend === "up"
                      ? "↑ Improving"
                      : trend === "down"
                      ? "↓ Declining"
                      : "→ Stable"}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
                    {testHistory.length} tests
                  </span>
                </div>
              </div>
              <div className="p-5 h-72 md:h-80">
                {testHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <FaChartLine className="text-4xl mb-4 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">
                      No test data yet
                    </p>
                    <p className="text-xs mt-1 text-slate-500 max-w-xs text-center">
                      Once you complete some IELTS practice tests, this area
                      will light up with your progress.
                    </p>
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent History Table */}
        <div className="mt-4 rounded-2xl border border-rose-100 bg-white/95 p-4 md:p-5 shadow-[0_22px_55px_rgba(248,113,113,0.16)] backdrop-blur-xl">
          <HistoryTable selectedSkill={selectedSkill} testHistory={testHistory} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
