"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
import McqSingle from "../Common/McqSingle";
import McqMultiple from "../Common/McqMultiple";
import BoxMatching from "../Common/BoxMatching";
import Map from "../Common/Map";
import { postSubmitListeningTest } from "@/services/data";
import { useRouter } from "next/navigation";

interface ListeningTestProps {
  test: {
    id: string;
    title: string;
    type: string;
    duration: number;
    audioUrl: string;
    parts: Array<{
      title: string;
      questions: Array<{
        fill_in_the_blanks_with_subtitle?: any[];
        mcq?: any[];
        map?: any[];
      }>;
    }>;
  };
}

const ListeningTest: React.FC<any> = ({ test }) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<any>({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60); // Convert minutes to seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { data: session }: any = useSession();

  const currentPart = test.parts[currentPartIndex];

  // Function to get all question numbers for each part
  const getPartQuestionNumbers = () => {
    const partQuestions: { [key: number]: number[] } = {};

    test.parts.forEach((part: any, partIndex: number) => {
      const questionNumbers: number[] = [];

      part.questions.forEach((questionSet: any) => {
        if (questionSet.fill_in_the_blanks_with_subtitle) {
          questionSet.fill_in_the_blanks_with_subtitle.forEach(
            (blankSet: any) => {
              blankSet.questions?.forEach((q: any) => {
                questionNumbers.push(q.question_number);
              });
            }
          );
        }
        if (questionSet.mcq) {
          questionSet.mcq.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.multiple_mcq) {
          questionSet.multiple_mcq.forEach((q: any) => {
            q.question_numbers.forEach((num: number) => {
              questionNumbers.push(num);
            });
          });
        }
        if (questionSet.box_matching) {
          questionSet.box_matching.forEach((q: any) => {
            q.questions.forEach((boxQuestion: any) => {
              questionNumbers.push(boxQuestion.question_number);
            });
          });
        }
        if (questionSet.map) {
          questionSet.map.forEach((mapSet: any) => {
            mapSet.questions.forEach((q: any) => {
              questionNumbers.push(q.question_number);
            });
          });
        }
      });

      partQuestions[partIndex] = questionNumbers.sort((a, b) => a - b);
    });

    return partQuestions;
  };

  const partQuestions = getPartQuestionNumbers();

  useEffect(() => {
    // Initialize answers state
    const initialAnswers: any = {};
    test.parts.forEach((part: any) => {
      part.questions.forEach((questionSet: any) => {
        if (questionSet.fill_in_the_blanks_with_subtitle) {
          questionSet.fill_in_the_blanks_with_subtitle.forEach(
            (blankSet: any) => {
              blankSet.questions?.forEach((q: any) => {
                initialAnswers[`${q.question_number}`] = {
                  value: "",
                  answerText: q.answer,
                  isCorrect: false,
                };
              });
            }
          );
        }
        if (questionSet.mcq) {
          questionSet.mcq.forEach((q: any) => {
            initialAnswers[`${q.question_number}`] = {
              value: "",
              answerText: q.answer,
              isCorrect: false,
            };
          });
        }
        if (questionSet.multiple_mcq) {
          questionSet.multiple_mcq.forEach((q: any) => {
            q.question_numbers.forEach((num: number) => {
              initialAnswers[`${num}`] = {
                value: "",
                answerText: q.correct_mapping[q.question_numbers.indexOf(num)],
                isCorrect: false,
                questionGroup: q.question_numbers, // Add questionGroup for multiple MCQ
              };
            });
          });
        }
        if (questionSet.box_matching) {
          questionSet.box_matching.forEach((q: any) => {
            q.questions.forEach((boxQuestion: any) => {
              initialAnswers[`${boxQuestion.question_number}`] = {
                value: "",
                answerText: boxQuestion.answer,
                isCorrect: false,
              };
            });
          });
        }
        if (questionSet.map) {
          questionSet.map.forEach((mapSet: any) => {
            mapSet.questions.forEach((q: any) => {
              initialAnswers[`${q.question_number}`] = {
                value: "",
                answerText: q.answer,
                isCorrect: false,
              };
            });
          });
        }
      });
    });
    setAnswers(initialAnswers);
  }, [test.parts]);

  const handleAnswerChange = (
    questionId: number,
    value: string,
    inputType: string,
    answer: string,
    isCorrect?: boolean,
    questionGroup?: number[]
  ) => {
    setAnswers((prev: any) => ({
      ...prev,
      [`${questionId}`]: {
        value,
        answerText: answer,
        isCorrect: isCorrect,
        questionType: inputType,
        questionGroup: questionGroup, // Add questionGroup for multiple MCQ
      },
    }));
  };

  const handleQuestionFocus = (questionId: number) => {
    setCurrentQuestionNumber(questionId);
  };

  // Navigate to a specific question number (switch part if needed and smooth-scroll to question)
  const handleQuestionNavigation = (
    questionNumber: number,
    partIndex: number
  ) => {
    console.log(
      `Navigating to question ${questionNumber} in part ${partIndex}`
    );

    // First, change to the correct part
    setCurrentPartIndex(partIndex);
    // Then set the current question number
    setCurrentQuestionNumber(questionNumber);

    // Wait for the part to change and then scroll to the specific question
    setTimeout(() => {
      // Find the questions container (the scrollable area with questions)
      let questionsContainer = null;

      // Look for the card with overflow-y-auto that contains questions
      const candidates = document.querySelectorAll(".card.overflow-y-auto");
      for (let container of candidates) {
        // Check if this container has questions (look for question elements)
        if (
          container.querySelector('[id^="question-"]') ||
          container.querySelector(".space-y-6") ||
          container.textContent?.includes("Question") ||
          container.textContent?.includes("instructions")
        ) {
          questionsContainer = container;
          console.log("Found questions container by content check");
          break;
        }
      }

      // If not found, try alternative approach - look for card with flex-1
      if (!questionsContainer) {
        questionsContainer = document.querySelector(
          ".card.bg-base-100.shadow-xl.flex-1.overflow-y-auto"
        );
        if (questionsContainer) {
          console.log("Found questions container via card classes");
        }
      }

      if (!questionsContainer) {
        console.log("No questions container found");
        return;
      }

      console.log("Using questions container:", questionsContainer);

      // Find the question element - first try direct ID, then look in groups
      let questionElement = document.getElementById(
        `question-${questionNumber}`
      );
      console.log(`Looking for question-${questionNumber}:`, questionElement);

      // If not found by direct ID, look for the container that contains this question number
      if (!questionElement) {
        console.log(
          "Direct ID not found, looking for container with this question number"
        );
        const allQuestionContainers = questionsContainer.querySelectorAll(
          "[data-question-numbers]"
        );
        for (let container of allQuestionContainers) {
          const questionNumbers =
            container.getAttribute("data-question-numbers")?.split(",") || [];
          if (questionNumbers.includes(questionNumber.toString())) {
            questionElement = container as HTMLElement;
            console.log(
              "Found question container with question number:",
              questionNumber
            );
            break;
          }
        }
      }

      if (questionElement) {
        console.log("Found question element, scrolling to it");

        // Check if this is a grouped question (multiple question numbers in one container)
        const questionNumbers =
          questionElement.getAttribute("data-question-numbers")?.split(",") ||
          [];
        const questionIndex = questionNumbers.indexOf(
          questionNumber.toString()
        );

        console.log("Question numbers in container:", questionNumbers);
        console.log(
          "Target question index:",
          questionIndex,
          "for question",
          questionNumber
        );

        if (questionNumbers.length > 1 && questionIndex >= 0) {
          console.log(
            "This is a grouped question, trying to find specific question within group"
          );

          // Try to find the specific question within the group
          const allElements = questionElement.querySelectorAll("*");
          let targetElement = null;

          // Look for elements that contain the specific question number
          // Collect all candidates first, then select the best one
          const candidates = [];

          for (let element of allElements) {
            const text = element.textContent || "";
            // Look for the exact question number pattern - be more specific
            const questionPattern = new RegExp(`\\b${questionNumber}\\b`);
            const specificPattern = new RegExp(
              `\\b${questionNumber}\\.\\b|Question\\s+${questionNumber}\\b`
            );
            if (questionPattern.test(text)) {
              // Check if this element is likely to be the question container
              const hasInputs = element.querySelector(
                "input, textarea, select, button"
              );
              const hasQuestionText = text.includes(questionNumber.toString());
              const rect = element.getBoundingClientRect();
              const isReasonableSize = rect.height < 200 && rect.height > 20;
              const hasSpecificQuestion =
                text.includes(`${questionNumber}.`) ||
                text.includes(`Question ${questionNumber}`);
              const hasExactPattern = specificPattern.test(text);

              console.log("Found element with question", questionNumber, ":", {
                hasInputs: !!hasInputs,
                hasQuestionText,
                textLength: text.length,
                element: element.tagName,
                elementRect: rect,
                isReasonableSize,
                hasSpecificQuestion,
                hasExactPattern,
              });

              if (hasInputs && hasQuestionText) {
                // Much higher score for exact pattern match
                const score =
                  (isReasonableSize ? 10 : 0) +
                  (hasSpecificQuestion ? 10 : 0) +
                  (hasExactPattern ? 50 : 0) + // 50 points for exact pattern
                  (text.length < 100 ? 5 : 0) +
                  (text.length < 50 ? 10 : 0); // Extra points for very small text

                candidates.push({
                  element,
                  textLength: text.length,
                  rect,
                  isReasonableSize,
                  hasSpecificQuestion,
                  hasExactPattern,
                  score,
                });
              }
            }
          }

          // Select the best candidate (smallest text, reasonable size, specific question)
          if (candidates.length > 0) {
            candidates.sort((a, b) => b.score - a.score);
            targetElement = candidates[0].element;
            console.log("Selected best candidate:", {
              textLength: candidates[0].textLength,
              score: candidates[0].score,
              isReasonableSize: candidates[0].isReasonableSize,
              hasSpecificQuestion: candidates[0].hasSpecificQuestion,
              hasExactPattern: candidates[0].hasExactPattern,
            });
          }

          if (targetElement) {
            console.log(
              "Scrolling to specific question element within container"
            );
            console.log("Target element:", targetElement);
            console.log(
              "Target element position:",
              (targetElement as HTMLElement).getBoundingClientRect()
            );

            // Use the target element directly, but ensure it's not the group container
            let questionContainer = targetElement;

            // If the target element is too large (likely the group container),
            // try to find a smaller child element that's more specific
            const targetRect = (
              targetElement as HTMLElement
            ).getBoundingClientRect();
            if (targetRect.height > 300) {
              // Likely the group container
              console.log(
                "Target element seems too large, looking for smaller child"
              );

              // Look for a child element that's more specific to this question
              const childElements = (
                targetElement as HTMLElement
              ).querySelectorAll("*");
              for (let child of childElements) {
                const childText = child.textContent || "";
                const childRect = (
                  child as HTMLElement
                ).getBoundingClientRect();

                if (
                  childText.includes(`${questionNumber}.`) &&
                  childRect.height < 200 &&
                  childRect.height > 20 &&
                  (child as HTMLElement).querySelector(
                    "input, textarea, select"
                  )
                ) {
                  questionContainer = child as HTMLElement;
                  console.log(
                    "Found smaller, more specific question container:",
                    questionContainer
                  );
                  break;
                }
              }
            }

            const containerRect = questionsContainer.getBoundingClientRect();
            const finalTargetRect = (
              questionContainer as HTMLElement
            ).getBoundingClientRect();
            const targetRelativeTop = finalTargetRect.top - containerRect.top;

            console.log("Container rect:", containerRect);
            console.log("Target rect:", finalTargetRect);
            console.log("Relative top:", targetRelativeTop);
            console.log("Current scroll top:", questionsContainer.scrollTop);
            console.log(
              "New scroll position:",
              questionsContainer.scrollTop + targetRelativeTop - 50
            );

            // Try scrollTo first
            questionsContainer.scrollTo({
              top: questionsContainer.scrollTop + targetRelativeTop - 50,
              behavior: "smooth",
            });

            // Also try scrollIntoView as a backup
            setTimeout(() => {
              (questionContainer as HTMLElement).scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              });
            }, 100);

            // For MCQ questions, don't focus any input to avoid auto-selection
            const hasRadioButtons = targetElement.querySelector(
              'input[type="radio"]'
            );
            const hasCheckboxes = targetElement.querySelector(
              'input[type="checkbox"]'
            );

            if (hasRadioButtons || hasCheckboxes) {
              console.log(
                "MCQ question detected, not focusing any input to avoid auto-selection"
              );
              return;
            }

            // For other question types, focus the first input
            const allInputs = targetElement.querySelectorAll(
              "input, textarea, select, button"
            );
            if (allInputs.length > 0) {
              const targetInput = allInputs[0];
              console.log(
                "Focusing input for question",
                questionNumber,
                ":",
                targetInput
              );
              (targetInput as HTMLElement).focus();

              // For text inputs, also select the text if it exists
              if (
                targetInput.tagName === "INPUT" &&
                (targetInput as HTMLInputElement).type === "text"
              ) {
                (targetInput as HTMLInputElement).select();
              }
            }
            return;
          } else {
            console.log(
              "Specific question element not found, using fallback approach"
            );
            // Fallback: compute a proportional offset within the group and do a single container scroll
            const containerRect = questionsContainer.getBoundingClientRect();
            const groupRect = (
              questionElement as HTMLElement
            ).getBoundingClientRect();
            const groupRelativeTop = groupRect.top - containerRect.top;
            const groupHeight = (questionElement as HTMLElement).offsetHeight;
            const ratio = questionIndex / Math.max(1, questionNumbers.length);
            const targetOffset = groupRelativeTop + ratio * groupHeight;
            questionsContainer.scrollTo({
              top: questionsContainer.scrollTop + targetOffset - 50,
              behavior: "smooth",
            });
            return;
          }
        }

        // For single questions or if specific question not found in group
        console.log("Treating as single question or fallback");
        const containerRect = questionsContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();
        const relativeTop = questionRect.top - containerRect.top;

        // Scroll to the question
        questionsContainer.scrollTo({
          top: questionsContainer.scrollTop + relativeTop - 50,
          behavior: "smooth",
        });

        // Focus the first input in the question (if it's not a choice question)
        setTimeout(() => {
          const hasRadioButtons = questionElement.querySelector(
            'input[type="radio"]'
          );
          const hasCheckboxes = questionElement.querySelector(
            'input[type="checkbox"]'
          );

          if (hasRadioButtons || hasCheckboxes) {
            console.log(
              "MCQ question detected, not focusing any input to avoid auto-selection"
            );
            return;
          }

          // For other question types, focus the first input
          const allInputs = questionElement.querySelectorAll(
            "input, textarea, select, button"
          );
          if (allInputs.length > 0) {
            const targetInput = allInputs[0];
            console.log(
              "Focusing input for question",
              questionNumber,
              ":",
              targetInput
            );
            (targetInput as HTMLElement).focus();

            // For text inputs, also select the text if it exists
            if (
              targetInput.tagName === "INPUT" &&
              (targetInput as HTMLInputElement).type === "text"
            ) {
              (targetInput as HTMLInputElement).select();
            }
          }
        }, 100);
      } else {
        console.log(
          "Question element not found, trying to find by question number"
        );
        // Alternative: find by looking for the question number in the text
        const allQuestionDivs = questionsContainer.querySelectorAll(
          'div[id^="question-"]'
        );
        console.log("All question divs found:", allQuestionDivs);

        // Look for the question by checking the content
        let found = false;
        for (let div of allQuestionDivs) {
          const questionText = div.textContent || "";
          if (
            questionText.includes(`Question ${questionNumber}`) ||
            questionText.includes(`${questionNumber}.`) ||
            div.id === `question-${questionNumber}`
          ) {
            console.log("Found question by content, scrolling to it");
            div.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            found = true;
            break;
          }
        }

        // If still not found, scroll to top of questions container
        if (!found) {
          console.log(
            "Question not found, scrolling to top of questions container"
          );
          questionsContainer.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }
    }, 500); // Increased delay to ensure part has fully loaded
  };

  const handleNextPart = () => {
    if (currentPartIndex < test.parts.length - 1) {
      setCurrentPartIndex((prev) => prev + 1);
      // Set current question to first question of next part
      const nextPartQuestions = partQuestions[currentPartIndex + 1];
      if (nextPartQuestions && nextPartQuestions.length > 0) {
        setCurrentQuestionNumber(nextPartQuestions[0]);
      }

      // Scroll to top of questions section
      setTimeout(() => {
        const questionsContainer = document.querySelector(
          ".card.bg-base-100.shadow-xl.flex-1.overflow-y-auto"
        );
        if (questionsContainer) {
          questionsContainer.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  const handlePrevPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
      // Set current question to first question of previous part
      const prevPartQuestions = partQuestions[currentPartIndex - 1];
      if (prevPartQuestions && prevPartQuestions.length > 0) {
        setCurrentQuestionNumber(prevPartQuestions[0]);
      }

      // Scroll to top of questions section
      setTimeout(() => {
        const questionsContainer = document.querySelector(
          ".card.bg-base-100.shadow-xl.flex-1.overflow-y-auto"
        );
        if (questionsContainer) {
          questionsContainer.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  // Scroll to top whenever the part changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll main page to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Also scroll the questions panel (right side) to top
      const questionsContainer = document.querySelector(
        ".lg\\:h-\\[80vh\\].lg\\:overflow-y-auto.border-l"
      );
      if (questionsContainer) {
        questionsContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentPartIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionTime = new Date();

    const totalPoint = Object.values(answers).filter(
      (answer: any) => answer.isCorrect === true
    ).length;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]: any) => ({
        questionId: parseInt(questionId),
        value: answer.value,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
        questionType: answer.questionType || "fill_in_the_blanks",
        questionGroup: answer.questionGroup, // Include questionGroup for multiple MCQ
      })
    );

    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: formattedAnswers,
      totalScore: totalPoint,
      submittedAt: submissionTime.toLocaleString(),
    };

    try {
      // TODO: Implement your submission API call here
      // const res = await postSubmitListeningTest(testData);

      const res = await postSubmitListeningTest(testData);

      console.log("This is Test Data", testData);
      console.log("Result", res);

      toast.success("Submission successful!");
      router.push(`/getSubmittedListeningAnswers/${testData.testId}`);
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!hasStarted) return;
    if (timeLeft === 0) {
      setIsTimeUp(true);
      handleSubmit(new Event("submit") as any);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasStarted]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto p-4 h-screen overflow-hidden flex flex-col pb-16">
        {!hasStarted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="listening-start-title"
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-red-100 text-red-700 p-3">
                    {/* headphones icon */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                        fill="currentColor"
                      />
                      <path
                        d="M19 10v2a7 7 0 0 1-14 0v-2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2
                      id="listening-start-title"
                      className="text-xl font-semibold leading-tight text-gray-900"
                    >
                      Ready to begin your Listening test?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      The timer will start as soon as you click{" "}
                      <strong>Start Test</strong>.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-red-600 font-medium">
                      Duration
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {test.duration} min
                    </div>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-red-600 font-medium">
                      Parts
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {test.parts?.length || 4}
                    </div>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-red-600 font-medium">
                      Questions
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {Object.values(partQuestions || {}).reduce(
                        (a: number, v: any) =>
                          a + (Array.isArray(v) ? v.length : 0),
                        0
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      if (typeof window !== "undefined") window.history.back();
                    }}
                  >
                    Back
                  </button>
                  <button
                    autoFocus
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md transition-colors"
                    onClick={() => {
                      const durationMin = test.duration || 30;
                      setTimeLeft(durationMin * 60);
                      setHasStarted(true);
                    }}
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Exam Header */}
        <div className="card bg-base-100 shadow-xl mb-2">
          <div className="py-2 px-6">
            <h2 className="card-title text-xl">{test.title}</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base">Duration: {test.duration} minutes</p>
              </div>
              <div className="text-lg font-bold text-red-600 px-4 bg-red-50 rounded-lg border border-red-200">
                {formatTime(timeLeft)}
                {isTimeUp && (
                  <span className="text-red-500 font-bold"> - Time's up!</span>
                )}
              </div>
              <div className="badge bg-red-600 hover:bg-red-700 text-white border-0">
                Part {currentPartIndex + 1} of {test.parts.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Audio Player */}
          <div className="card bg-base-100 shadow-xl mb-2">
            <div className="card-body py-2">
              <audio controls className="w-full">
                <source src={test.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

          {/* Questions Section */}
          <div className="card bg-base-100 shadow-xl flex-1 overflow-y-auto">
            <div className="card-body px-80">
              <h2 className="text-2xl font-bold mb-4">{currentPart.title}</h2>
              <div className="space-y-6">
                {currentPart.questions?.map((questionSet: any, index: any) => {
                  // gather question ids within this set to aid navigation
                  const ids: number[] = [];
                  if (questionSet.fill_in_the_blanks_with_subtitle) {
                    questionSet.fill_in_the_blanks_with_subtitle.forEach(
                      (blankSet: any) => {
                        blankSet.questions?.forEach((q: any) =>
                          ids.push(q.question_number)
                        );
                      }
                    );
                  }
                  if (questionSet.mcq) {
                    questionSet.mcq.forEach((q: any) =>
                      ids.push(q.question_number)
                    );
                  }
                  if (questionSet.multiple_mcq) {
                    questionSet.multiple_mcq.forEach((q: any) => {
                      if (Array.isArray(q.question_numbers))
                        q.question_numbers.forEach((n: number) => ids.push(n));
                      else if (q.question_number) ids.push(q.question_number);
                    });
                  }
                  if (questionSet.box_matching) {
                    questionSet.box_matching.forEach((q: any) => {
                      q.questions?.forEach((bq: any) =>
                        ids.push(bq.question_number)
                      );
                    });
                  }
                  if (questionSet.map) {
                    questionSet.map.forEach((m: any) => {
                      m.questions?.forEach((q: any) =>
                        ids.push(q.question_number)
                      );
                    });
                  }
                  const firstId = ids[0] || index + 1;

                  return (
                    <div
                      key={index}
                      id={`question-${firstId}`}
                      data-question-numbers={ids.join(",")}
                    >
                      {questionSet.fill_in_the_blanks_with_subtitle && (
                        <SubFillInTheBlanks
                          instructions={questionSet.instruction}
                          question={
                            questionSet.fill_in_the_blanks_with_subtitle
                          }
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}
                      {questionSet.mcq && (
                        <McqSingle
                          instructions={questionSet.instruction}
                          question={questionSet.mcq}
                          answers={answers}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}
                      {questionSet.multiple_mcq && (
                        <McqMultiple
                          instructions={questionSet.instruction}
                          question={questionSet.multiple_mcq}
                          answers={answers}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}
                      {questionSet.box_matching && (
                        <BoxMatching
                          instructions={questionSet.instruction}
                          question={questionSet.box_matching}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}
                      {questionSet.map && (
                        <Map
                          question={questionSet.map[0]}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                          answers={answers}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>

      {/* Fixed Question Navigation Panel at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Previous Button */}
            <button
              onClick={handlePrevPart}
              disabled={currentPartIndex === 0}
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed mx-2 text-white"
              type="button"
            >
              Previous
            </button>

            {/* Question Numbers */}
            <div className="flex justify-center flex-1">
              {test.parts.map((part: any, partIndex: number) => (
                <div key={partIndex} className="flex-1 flex justify-center">
                  <div className="border-2 border-gray-300 rounded-lg p-2 flex flex-wrap gap-1 justify-center">
                    {partQuestions[partIndex]?.map((questionNumber: number) => {
                      const hasAnswered =
                        answers[questionNumber]?.value &&
                        answers[questionNumber]?.value.trim() !== "";

                      return (
                        <button
                          key={`${questionNumber}-${partIndex}`}
                          type="button"
                          className={`w-8 h-8 text-xs rounded border transition-colors ${
                            questionNumber === currentQuestionNumber
                              ? "bg-blue-500 text-white border-blue-500"
                              : hasAnswered
                              ? "bg-green-200 text-green-700 border-green-400 hover:bg-green-300"
                              : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                          }`}
                          onClick={() =>
                            handleQuestionNavigation(questionNumber, partIndex)
                          }
                        >
                          {questionNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPart}
              disabled={currentPartIndex === test.parts.length - 1}
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed mx-2 text-white"
              type="button"
            >
              Next
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn bg-green-600 hover:bg-green-700 border-0 text-white mx-2"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ListeningTest;
