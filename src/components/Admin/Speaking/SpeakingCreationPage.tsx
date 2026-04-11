"use client";
import React, { useState } from "react";
import { submitSpeakingQuestions } from "@/services/data";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus, FaTrash, FaSave, FaMicrophone, FaInfoCircle, FaCheck } from "react-icons/fa";

interface Question {
  question_number: number;
  question: string;
  question_type: "personal" | "cue_card" | "discussion";
  preparation_time?: number;
  speaking_time: number;
  instructions?: string;
}

interface SpeakingTest {
  title: string;
  type: "part1" | "part2" | "part3" | "full_test";
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  total_duration: number;
}

const SpeakingCreationPage: React.FC = () => {
  const [test, setTest] = useState<SpeakingTest>({
    title: "",
    type: "part1",
    description: "",
    difficulty: "medium",
    questions: [],
    total_duration: 0,
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question_number: 1,
    question: "",
    question_type: "personal",
    speaking_time: 2,
    instructions: "",
  });

  // Cue card specific UI state (not persisted directly)
  const [cueTitle, setCueTitle] = useState<string>("");
  const [cuePoints, setCuePoints] = useState<string>("");

  const questionTypes = [
    { value: "personal", label: "Personal Question (Part 1)" },
    { value: "cue_card", label: "Cue Card (Part 2)" },
    { value: "discussion", label: "Discussion (Part 3)" },
  ];

  const testTypes = [
    { value: "part1", label: "Part 1" },
    { value: "part2", label: "Part 2" },
    { value: "part3", label: "Part 3" },
    { value: "full_test", label: "Full Test" },
  ];

  const difficulties = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  // Get guidance based on test type
  const getTestTypeGuidance = () => {
    switch (test.type) {
      case "part1":
        return {
          title: "Part 1: Personal Questions",
          description: "Add 3-5 short personal questions about familiar topics. Each question should take 1-2 minutes to answer.",
          recommendedQuestions: "3-5 questions",
          questionType: "personal"
        };
      case "part2":
        return {
          title: "Part 2: Cue Card",
          description: "Add 1 cue card with preparation time. The candidate gets 1 minute to prepare and 2 minutes to speak.",
          recommendedQuestions: "1 question (cue card)",
          questionType: "cue_card"
        };
      case "part3":
        return {
          title: "Part 3: Discussion",
          description: "Add 3-5 follow-up discussion questions that relate to the Part 2 topic. Each question should take 1-2 minutes.",
          recommendedQuestions: "3-5 questions",
          questionType: "discussion"
        };
      case "full_test":
        return {
          title: "Full Test: Complete IELTS Speaking",
          description: "Add questions for all three parts: Part 1 (3-5 questions), Part 2 (1 cue card), Part 3 (3-5 questions).",
          recommendedQuestions: "7-11 questions total",
          questionType: "personal"
        };
      default:
        return {
          title: "Speaking Test",
          description: "Add questions for your speaking test.",
          recommendedQuestions: "Multiple questions",
          questionType: "personal"
        };
    }
  };

  const guidance = getTestTypeGuidance();

  // Update question type when test type changes
  React.useEffect(() => {
    setCurrentQuestion(prev => ({
      ...prev,
      question_type: guidance.questionType as any
    }));
  }, [test.type]);

  // Reset current question form with defaults for next question
  const resetQuestionForm = () => {
    setCurrentQuestion({
      question_number: test.questions.length + 1,
      question: "",
      question_type: guidance.questionType as any,
      speaking_time: 2,
      instructions: "",
    });
    setCueTitle("");
    setCuePoints("");
  };

  const addQuestion = () => {
    if (currentQuestion.question_type === "cue_card") {
      if (!cueTitle.trim()) {
        toast.error("Please enter the cue card title/topic");
        return;
      }
      if (!cuePoints.trim()) {
        toast.error("Please enter at least one bullet point");
        return;
      }
    } else {
      if (!currentQuestion.question.trim()) {
        toast.error("Please enter a question");
        return;
      }
    }

    // Validate question count based on test type
    if (test.type === "part2" && test.questions.length >= 1) {
      toast.error("Part 2 typically has only 1 cue card question");
      return;
    }

    // Build the final question text
    let builtQuestion = currentQuestion.question;
    if (currentQuestion.question_type === "cue_card") {
      const points = cuePoints
        .split(/\r?\n/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `- ${p}`)
        .join("\n");

      builtQuestion = `${cueTitle.trim()}\n\nYou should say:\n${points}`;
    }

    const newQuestion = {
      ...currentQuestion,
      question: builtQuestion,
      question_number: test.questions.length + 1,
    };

    setTest({
      ...test,
      questions: [...test.questions, newQuestion],
      total_duration: test.total_duration + newQuestion.speaking_time + (newQuestion.preparation_time || 0),
    });

    // Reset form for next question
    resetQuestionForm();

    toast.success(`Question ${newQuestion.question_number} added successfully! Add another question or create the test.`);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = test.questions.filter((_, i) => i !== index);
    const totalDuration = updatedQuestions.reduce(
      (sum, q) => sum + q.speaking_time + (q.preparation_time || 0),
      0
    );

    setTest({
      ...test,
      questions: updatedQuestions,
      total_duration: totalDuration,
    });

    // Update question numbers and reset form
    const renumberedQuestions = updatedQuestions.map((q, i) => ({
      ...q,
      question_number: i + 1
    }));

    setTest(prev => ({
      ...prev,
      questions: renumberedQuestions,
      total_duration: totalDuration,
    }));

    resetQuestionForm();

    toast.success("Question removed successfully!");
  };

  const handleSubmit = async () => {
    if (!test.title.trim()) {
      toast.error("Please enter a test title");
      return;
    }

    if (test.questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    // Validate question count based on test type
    if (test.type === "part2" && test.questions.length > 1) {
      toast.error("Part 2 should have exactly 1 cue card question");
      return;
    }

    if (test.type === "part1" && test.questions.length < 3) {
      toast.warning("Part 1 typically has 3-5 questions. Consider adding more questions.");
    }

    if (test.type === "part3" && test.questions.length < 3) {
      toast.warning("Part 3 typically has 3-5 questions. Consider adding more questions.");
    }

    try {
      await submitSpeakingQuestions(test);
      toast.success("Speaking test created successfully!");
      
      // Reset form
      setTest({
        title: "",
        type: "part1",
        description: "",
        difficulty: "medium",
        questions: [],
        total_duration: 0,
      });
      resetQuestionForm();
    } catch (error) {
      console.error("Error creating speaking test:", error);
      toast.error("Failed to create speaking test");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6 flex items-center gap-2">
              <FaMicrophone className="text-primary" />
              Create Speaking Test
            </h1>

            {/* Test Type Guidance */}
            <div className="alert alert-info mb-6">
              <FaInfoCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">{guidance.title}</h3>
                <p className="text-sm">{guidance.description}</p>
                <p className="text-sm mt-1">
                  <strong>Recommended:</strong> {guidance.recommendedQuestions}
                </p>
              </div>
            </div>

            {/* Test Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Test Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter test title"
                  className="input input-bordered"
                  value={test.title}
                  onChange={(e) => setTest({ ...test, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Test Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={test.type}
                  onChange={(e) => setTest({ ...test, type: e.target.value as any })}
                >
                  {testTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Difficulty</span>
                </label>
                <select
                  className="select select-bordered"
                  value={test.difficulty}
                  onChange={(e) => setTest({ ...test, difficulty: e.target.value as any })}
                >
                  {difficulties.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Total Duration (minutes)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={test.total_duration}
                  disabled
                />
              </div>
            </div>

            <div className="form-control mb-8">
              <label className="label">
                <span className="label-text font-semibold">Description (Optional)</span>
              </label>
              <textarea
                placeholder="Enter test description"
                className="textarea textarea-bordered h-24"
                value={test.description}
                onChange={(e) => setTest({ ...test, description: e.target.value })}
              />
            </div>

            {/* Add Question Section */}
            <div className="card bg-base-200 mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  Add Question {test.questions.length + 1}
                  {test.questions.length > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      ({test.questions.length} questions added)
                    </span>
                  )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Question Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={currentQuestion.question_type}
                      onChange={(e) => setCurrentQuestion({ 
                        ...currentQuestion, 
                        question_type: e.target.value as any 
                      })}
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Speaking Time (minutes)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="input input-bordered"
                      value={currentQuestion.speaking_time}
                      onChange={(e) => setCurrentQuestion({ 
                        ...currentQuestion, 
                        speaking_time: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                </div>

                {currentQuestion.question_type === "cue_card" && (
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Preparation Time (minutes)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      className="input input-bordered"
                      value={currentQuestion.preparation_time || 0}
                      onChange={(e) => setCurrentQuestion({ 
                        ...currentQuestion, 
                        preparation_time: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                )}

                {currentQuestion.question_type !== "cue_card" && (
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Question</span>
                    </label>
                    <textarea
                      placeholder="Enter the question"
                      className="textarea textarea-bordered h-32"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ 
                        ...currentQuestion, 
                        question: e.target.value 
                      })}
                    />
                  </div>
                )}

                {currentQuestion.question_type === "cue_card" && (
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Cue Card Title / Topic</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Describe a person you know who has chosen a career in the medical field"
                        className="input input-bordered"
                        value={cueTitle}
                        onChange={(e) => setCueTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Cue Card Bullet Points (one per line)</span>
                      </label>
                      <textarea
                        placeholder={"Who he/she is\nWhat he/she does\nWhy he/she chose this career\nHow you feel about him/her"}
                        className="textarea textarea-bordered h-32"
                        value={cuePoints}
                        onChange={(e) => setCuePoints(e.target.value)}
                      />
                      <label className="label">
                        <span className="label-text-alt text-gray-500">We will format this as a cue card with bullets.</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Instructions (Optional)</span>
                  </label>
                  <textarea
                    placeholder="Enter instructions for the candidate"
                    className="textarea textarea-bordered h-20"
                    value={currentQuestion.instructions}
                    onChange={(e) => setCurrentQuestion({ 
                      ...currentQuestion, 
                      instructions: e.target.value 
                    })}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={addQuestion}
                    className="btn btn-primary"
                    disabled={!currentQuestion.question.trim() || (test.type === "part2" && test.questions.length >= 1)}
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add Question
                  </button>
                  
                  {test.questions.length > 0 && (
                    <button
                      onClick={handleSubmit}
                      className="btn btn-success"
                      disabled={!test.title.trim()}
                    >
                      <FaCheck className="h-4 w-4 mr-2" />
                      Create Speaking Test
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Questions List */}
            {test.questions.length > 0 && (
              <div className="card bg-base-200 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    Questions Added ({test.questions.length})
                    {test.type === "part2" && test.questions.length === 1 && (
                      <span className="badge badge-success ml-2">Complete</span>
                    )}
                    {(test.type === "part1" || test.type === "part3") && test.questions.length >= 3 && (
                      <span className="badge badge-success ml-2">Good</span>
                    )}
                  </h2>
                  
                  <div className="space-y-4">
                    {test.questions.map((question, index) => (
                      <div key={index} className="card bg-base-100">
                        <div className="card-body">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="card-title text-lg">
                              Question {question.question_number}
                            </h3>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="btn btn-error btn-sm"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="flex gap-2 mb-2">
                            <span className="badge badge-primary">{question.question_type}</span>
                            <span className="badge badge-secondary">{question.speaking_time} min</span>
                            {question.preparation_time && (
                              <span className="badge badge-accent">{question.preparation_time} min prep</span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-2 whitespace-pre-line">{question.question}</p>
                          
                          {question.instructions && (
                            <p className="text-sm text-gray-500">
                              <strong>Instructions:</strong> {question.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SpeakingCreationPage; 