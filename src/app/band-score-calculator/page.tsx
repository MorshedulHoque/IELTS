"use client";
import React, { useState } from "react";
import { FaCalculator, FaInfoCircle, FaChartLine } from "react-icons/fa";

const BandScoreCalculator: React.FC = () => {
  const [scores, setScores] = useState({
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
  });

  const handleScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    skill: string
  ) => {
    const value = e.target.value;
    // Allow empty string, numbers, and one decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // Validate range: 0 to 9 with max one decimal place
      const numValue = parseFloat(value);
      if (value === "" || (numValue >= 0 && numValue <= 9)) {
        setScores((prev) => ({
          ...prev,
          [skill]: value,
        }));
      }
    }
  };

  const calculateOverallBand = () => {
    const values = [
      parseFloat(scores.listening) || 0,
      parseFloat(scores.reading) || 0,
      parseFloat(scores.writing) || 0,
      parseFloat(scores.speaking) || 0,
    ];

    // Check if all values are provided
    const allProvided = values.every((v) => v > 0);
    if (!allProvided) return null;

    // Calculate average
    const average = values.reduce((sum, val) => sum + val, 0) / 4;

    // Round to nearest 0.5
    const rounded = Math.round(average * 2) / 2;

    return rounded;
  };

  const overallBand = calculateOverallBand();

  const getBandColor = (band: number | null) => {
    if (band === null) return "bg-gray-200";
    if (band >= 8) return "bg-green-500";
    if (band >= 7) return "bg-blue-500";
    if (band >= 6) return "bg-yellow-500";
    if (band >= 5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getBandDescription = (band: number | null) => {
    if (band === null) return "";
    if (band >= 8) return "Expert User";
    if (band >= 7) return "Good User";
    if (band >= 6) return "Competent User";
    if (band >= 5) return "Modest User";
    return "Limited User";
  };

  const skillCards = [
    {
      name: "Listening",
      key: "listening",
      color: "purple",
      description: "Enter your Listening band score (0-9)",
    },
    {
      name: "Reading",
      key: "reading",
      color: "blue",
      description: "Enter your Reading band score (0-9)",
    },
    {
      name: "Writing",
      key: "writing",
      color: "green",
      description: "Enter your Writing band score (0-9)",
    },
    {
      name: "Speaking",
      key: "speaking",
      color: "orange",
      description: "Enter your Speaking band score (0-9)",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-6">
              <FaCalculator className="text-red-600" />
              <span>IELTS Band Score Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Calculate Your Overall IELTS Band Score
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enter your individual band scores for each skill to calculate your
              overall IELTS band score. The overall score is the average of all
              four skills, rounded to the nearest 0.5.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaChartLine className="text-red-600" />
                Enter Your Scores
              </h2>
              <div className="space-y-6">
                {skillCards.map((skill) => (
                  <div key={skill.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {skill.name} Band Score
                    </label>
                    <input
                      type="text"
                      value={scores[skill.key as keyof typeof scores]}
                      onChange={(e) => handleScoreChange(e, skill.key)}
                      placeholder="0.0 - 9.0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-lg font-semibold"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Overall Band Score
              </h2>
              {overallBand !== null ? (
                <div className="text-center">
                  <div
                    className={`w-48 h-48 mx-auto rounded-full ${getBandColor(
                      overallBand
                    )} flex items-center justify-center mb-6 shadow-xl`}
                  >
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-2">
                        {overallBand}
                      </div>
                      <div className="text-white text-lg font-medium">
                        {getBandDescription(overallBand)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Score Breakdown
                    </h3>
                    <div className="space-y-3">
                      {skillCards.map((skill) => {
                        const score =
                          parseFloat(
                            scores[skill.key as keyof typeof scores]
                          ) || 0;
                        return (
                          <div
                            key={skill.key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-700 font-medium">
                              {skill.name}
                            </span>
                            <span className="text-gray-900 font-bold text-lg">
                              {score > 0 ? score.toFixed(1) : "-"}
                            </span>
                          </div>
                        );
                      })}
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-bold text-lg">
                            Overall Average
                          </span>
                          <span className="text-red-600 font-bold text-xl">
                            {overallBand.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setScores({
                        listening: "",
                        reading: "",
                        writing: "",
                        speaking: "",
                      })
                    }
                    className="btn btn-outline btn-primary w-full"
                  >
                    Reset Calculator
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-6">
                    <FaCalculator className="text-5xl text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Enter all four band scores above to calculate your overall
                    IELTS band score.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaInfoCircle className="text-red-600" />
              How IELTS Band Scores Work
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Overall Band Score Calculation
                </h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your overall IELTS band score is calculated by taking the
                  average of your four individual skill scores (Listening,
                  Reading, Writing, and Speaking) and rounding to the nearest
                  0.5 or whole number.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Example:</strong> If you score 7.5 in Listening, 8.0
                  in Reading, 7.0 in Writing, and 7.5 in Speaking, your average
                  is 7.5, so your overall band score is 7.5.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Band Score Descriptions
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>9.0 - Expert User:</strong> Fully operational
                    command of the language
                  </li>
                  <li>
                    <strong>8.0 - Very Good User:</strong> Fully operational
                    command with occasional inaccuracies
                  </li>
                  <li>
                    <strong>7.0 - Good User:</strong> Operational command with
                    occasional inaccuracies
                  </li>
                  <li>
                    <strong>6.0 - Competent User:</strong> Generally effective
                    command despite inaccuracies
                  </li>
                  <li>
                    <strong>5.0 - Modest User:</strong> Partial command of the
                    language
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💡 Tips for Improving Your Band Score
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Practice Regularly
                </h4>
                <p className="text-gray-600 text-sm">
                  Consistent practice with our free IELTS tests will help you
                  improve your scores across all four skills.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Focus on Weak Areas
                </h4>
                <p className="text-gray-600 text-sm">
                  Use our detailed analytics to identify your weakest skills and
                  dedicate more time to improving them.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Understand the Format
                </h4>
                <p className="text-gray-600 text-sm">
                  Familiarize yourself with the IELTS test format and question
                  types to maximize your performance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Get AI Feedback
                </h4>
                <p className="text-gray-600 text-sm">
                  Use our AI-powered evaluation for Writing and Speaking to get
                  detailed feedback and improve your scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BandScoreCalculator;

