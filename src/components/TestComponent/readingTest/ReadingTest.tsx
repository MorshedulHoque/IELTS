"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import TrueFalse from "../Common/TrueFalse";
import FillInTheBlanks from "../Common/FillInTheBlanks";
import MatchingHeadings from "../Common/MatchingHeadings";
import ParagraphMatching from "../Common/ParagraphMatching";
import McqSingle from "../Common/McqSingle";
import PassFillInTheBlanks from "../Common/PassFillInTheBlanks";
import McqMultiple from "../Common/McqMultiple";
import SumFillInTheBlanks from "../Common/SumFillInTheBlanks";
import SubFillInTheBlanks from "../Common/SubFillInTheBlanks";
import TextHighlighter from "./TextHighlighter";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { postSubmitReadingTest } from "@/services/data";

const ReadingTest = ({ test }: any) => {
  const [answers, setAnswers] = useState<any>({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [passageHighlights, setPassageHighlights] = useState<any[]>([]);
  const { data: session }: any = useSession();
  const [hasStarted, setHasStarted] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50); // Percentage
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Refs for scrollable containers
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  const currentPart = test.parts[currentPartIndex];

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const container = document.querySelector(".resize-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
    setLeftPanelWidth(constrainedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  // Function to get all question numbers for each part
  const getPartQuestionNumbers = () => {
    const partQuestions: { [key: number]: number[] } = {};

    test.parts.forEach((part: any, partIndex: number) => {
      const questionNumbers: number[] = [];

      part.questions.forEach((questionSet: any, questionSetIndex: number) => {
        console.log(
          `Processing question set ${questionSetIndex} in part ${
            partIndex + 1
          }:`,
          Object.keys(questionSet)
        );
        if (questionSet.true_false_not_given) {
          questionSet.true_false_not_given.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.fill_in_the_blanks) {
          questionSet.fill_in_the_blanks.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.matching_headings) {
          questionSet.matching_headings.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.paragraph_matching) {
          questionSet.paragraph_matching.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.mcq) {
          questionSet.mcq.forEach((q: any) => {
            questionNumbers.push(q.question_number);
          });
        }
        if (questionSet.multiple_mcq) {
          questionSet.multiple_mcq.forEach((q: any) => {
            if (Array.isArray(q.question_numbers)) {
              q.question_numbers.forEach((num: number) =>
                questionNumbers.push(num)
              );
            } else {
              questionNumbers.push(q.question_number);
            }
          });
        }
        if (questionSet.passage_fill_in_the_blanks) {
          questionSet.passage_fill_in_the_blanks.forEach((q: any) => {
            if (Array.isArray(q.question_number)) {
              q.question_number.forEach((num: number) =>
                questionNumbers.push(num)
              );
            } else {
              questionNumbers.push(q.question_number);
            }
          });
        }
        if (questionSet.summary_fill_in_the_blanks) {
          console.log(
            `Found summary_fill_in_the_blanks in part ${partIndex + 1}:`,
            questionSet.summary_fill_in_the_blanks
          );
          questionSet.summary_fill_in_the_blanks.forEach((q: any) => {
            if (Array.isArray(q.question_numbers)) {
              q.question_numbers.forEach((num: number) =>
                questionNumbers.push(num)
              );
              console.log(`Added question numbers:`, q.question_numbers);
            } else if (q.question_number) {
              questionNumbers.push(q.question_number);
              console.log(`Added question number:`, q.question_number);
            }
          });
        }
        if (questionSet.fill_in_the_blanks_with_subtitle) {
          questionSet.fill_in_the_blanks_with_subtitle.forEach(
            (blankSet: any) => {
              blankSet.questions?.forEach((q: any) => {
                questionNumbers.push(q.question_number);
              });
            }
          );
        }
      });

      partQuestions[partIndex] = questionNumbers.sort((a, b) => a - b);
      console.log(
        `Part ${partIndex + 1} question numbers:`,
        partQuestions[partIndex]
      );
    });

    return partQuestions;
  };

  const partQuestions = getPartQuestionNumbers();

  console.log("Parts", test.parts);

  console.log("Current Part", currentPart);

  // useEffect(() => {
  //   // Flatten all questions from all parts
  //   const flattenQuestions = (parts: any[]) => {
  //     return parts.flatMap((part) => {
  //       if (!Array.isArray(part.questions)) return [];

  //       return part?.questions.flatMap((value: any) => {
  //         if (Array.isArray(value)) {
  //           return value.map((q: any) => ({
  //             ...q,
  //             input_type: q.input_type || "text",
  //             question_number: q.question_number,
  //             question_type: q.input_type, // optional: add type info
  //           }));
  //         } else if (typeof value === "object" && value !== null) {
  //           return [
  //             {
  //               ...value,
  //               input_type: value.input_type || "text",
  //               question_number:
  //                 value.question_number || value.question_numbers,
  //               question_type: value.input_type, // optional
  //             },
  //           ];
  //         }

  //         return [];
  //       });
  //     });
  //   };

  //   const allQuestions = flattenQuestions(test.parts);

  //   console.log("All Questions", allQuestions);

  //   const initialAnswers = allQuestions.flatMap((q) => {
  //     if (q.input_type === "checkbox" && Array.isArray(q.question_numbers)) {
  //       // For multiple MCQ questions
  //       return q.question_numbers.map(
  //         (questionNumber: number, index: number) => ({
  //           questionId: questionNumber,
  //           value: "", // Will store the selected option
  //           answerText: q.correct_mapping[index], // The correct answer
  //           isCorrect: false,
  //           questionGroup: q.question_numbers, // Store the group of questions
  //         })
  //       );
  //     } else if (
  //       q.input_type === "checkbox" &&
  //       !Array.isArray(q.question_numbers)
  //     ) {
  //       return {
  //         questionId: q.question_number,
  //         answers: [],
  //         answerText: Array.isArray(q.answer) ? q.answer : [q.answer],
  //         isCorrect: false,
  //       };
  //     } else if (q.input_type === "text" && Array.isArray(q.questions)) {
  //       return q.questions.map((que: any) => ({
  //         questionId: que.question_number,
  //         value: "",
  //         answerText: que.answer,
  //         isCorrect: false,
  //       }));
  //     } else if (q.input_type === "text" && Array.isArray(q.question_number)) {
  //       // NEW CONDITION: Handle PassFillInTheBlanks where question_number is an array
  //       return q.question_number.map((questionNum: number, index: number) => ({
  //         questionId: questionNum,
  //         value: "",
  //         answerText: q.blanks ? q.blanks[index]?.answer : "", // Get answer from blanks array
  //         isCorrect: false,
  //       }));
  //     } else if (
  //       q.input_type === "drag_and_drop" &&
  //       Array.isArray(q.question_numbers)
  //     ) {
  //       return q.question_numbers.map((que: any, index: number) => ({
  //         questionId: q.question_numbers[index],
  //         value: "",
  //         answerText: q.answers[index],
  //         isCorrect: false,
  //       }));
  //     } else {
  //       // Ensure questionId is always a single number, not an array
  //       const questionId = Array.isArray(q.question_number)
  //         ? q.question_number[0]
  //         : q.question_number;
  //       return {
  //         questionId: questionId,
  //         value: "",
  //         answerText: q.answer,
  //         isCorrect: false,
  //       };
  //     }
  //   });

  //   setAnswers(initialAnswers);
  // }, [test.parts]);

  useEffect(() => {
    // Flatten all questions from all parts
    const flattenQuestions = (parts: any[]) => {
      return parts.flatMap((part) => {
        if (!Array.isArray(part.questions)) return [];

        return part.questions.flatMap((questionGroup: any) => {
          const allQuestions: any[] = [];

          // Extract questions from each question type
          Object.keys(questionGroup).forEach((questionType) => {
            const questionsArray = questionGroup[questionType];

            if (Array.isArray(questionsArray)) {
              questionsArray.forEach((question) => {
                allQuestions.push({
                  ...question,
                  questionType:
                    questionType === "true_false_not_given"
                      ? "True False Not Given"
                      : questionType === "fill_in_the_blanks"
                      ? "Fill in the Blanks"
                      : questionType === "matching_headings"
                      ? "Matching Headings"
                      : questionType === "paragraph_matching"
                      ? "Paragraph Matching"
                      : questionType === "multiple_mcq"
                      ? "Multiple MCQ"
                      : questionType === "passage_fill_in_the_blanks"
                      ? "Passage Fill in the Blanks"
                      : questionType === "mcq"
                      ? "MCQ"
                      : questionType === "summary_fill_in_the_blanks"
                      ? "Summary Fill in the Blanks"
                      : questionType === "fill_in_the_blanks_with_subtitle"
                      ? "Fill in the blanks with Subtitle"
                      : "",
                  input_type: question.input_type || "text",
                });
              });
            } else if (
              questionType === "summary_fill_in_the_blanks" &&
              questionsArray
            ) {
              // Handle summary_fill_in_the_blanks as an array
              questionsArray.forEach((question: any) => {
                allQuestions.push({
                  ...question,
                  questionType: "Summary Fill in the Blanks",
                  input_type: question.input_type || "drag_and_drop",
                });
              });
            }
          });

          return allQuestions;
        });
      });
    };

    const allQuestions = flattenQuestions(test.parts);
    console.log("All Questions", allQuestions);

    const initialAnswers = allQuestions.flatMap((q) => {
      if (q.input_type === "checkbox" && Array.isArray(q.question_numbers)) {
        // For multiple MCQ questions
        return q.question_numbers.map(
          (questionNumber: number, index: number) => ({
            questionId: questionNumber,
            questionType: q.questionType,
            value: "", // Will store the selected option
            answerText: q.correct_mapping ? q.correct_mapping[index] : "", // The correct answer
            isCorrect: false,
            questionGroup: q.question_numbers, // Store the group of questions
          })
        );
      } else if (
        q.input_type === "checkbox" &&
        !Array.isArray(q.question_numbers)
      ) {
        return {
          questionId: q.question_number,
          questionType: q.questionType,
          answers: [],
          answerText: Array.isArray(q.answer) ? q.answer : [q.answer],
          isCorrect: false,
        };
      } else if (q.input_type === "text" && Array.isArray(q.questions)) {
        return q.questions.map((que: any) => ({
          questionId: que.question_number,
          questionType: q.questionType,
          value: "",
          answerText: que.answer,
          isCorrect: false,
        }));
      } else if (q.input_type === "text" && Array.isArray(q.question_number)) {
        // Handle PassFillInTheBlanks where question_number is an array
        return q.question_number.map((questionNum: number, index: number) => ({
          questionId: questionNum,
          questionType: q.questionType,
          value: "",
          answerText: q.blanks ? q.blanks[index]?.answer : "", // Get answer from blanks array
          isCorrect: false,
        }));
      } else if (
        q.input_type === "drag_and_drop" &&
        Array.isArray(q.question_numbers)
      ) {
        return q.question_numbers.map((questionNumber: any, index: number) => ({
          questionId: questionNumber,
          questionType: q.questionType,
          value: "",
          answerText: q.answers ? q.answers[index] : "",
          isCorrect: false,
        }));
      } else {
        // Handle single questions (like true_false_not_given, mcq, etc.)
        const questionId = Array.isArray(q.question_number)
          ? q.question_number[0]
          : q.question_number;

        return {
          questionId: questionId,
          value: "",
          answerText: q.answer || "",
          isCorrect: false,
          questionType: q.questionType, // Store question type for debugging
        };
      }
    });

    console.log("Initial Answers:", initialAnswers);
    setAnswers(initialAnswers);
  }, [test.parts]);

  const handleQuestionFocus = (questionId: number) => {
    setCurrentQuestionNumber(questionId);
  };

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
      // Find the questions container (the RIGHT side scrollable area)
      // Look specifically for the right side container that contains questions
      let questionsContainer: any = null;

      // First, try to find the right side container by looking for the questions section
      const questionsSection = document.querySelector(".space-y-6");
      if (questionsSection) {
        questionsContainer = questionsSection.parentElement;
        console.log("Found questions container via parent of .space-y-6");
      }

      // If not found, look for the RIGHT side container specifically
      if (!questionsContainer) {
        // Look for the container that has the questions content (right side)
        const allContainers = document.querySelectorAll(
          ".lg\\:h-\\[80vh\\].lg\\:overflow-y-auto"
        );
        for (let container of allContainers) {
          // Check if this container has questions (look for question elements)
          if (
            container.querySelector('[id^="question-"]') ||
            container.querySelector(".space-y-6") ||
            container.textContent?.includes("Question") ||
            container.textContent?.includes("instructions")
          ) {
            questionsContainer = container;
            console.log(
              "Found RIGHT side questions container by content check"
            );
            break;
          }
        }
      }

      // If still not found, try alternative approach
      if (!questionsContainer) {
        // Look for the container that has border-l (right side has border-l)
        questionsContainer = document.querySelector(
          ".lg\\:h-\\[80vh\\].lg\\:overflow-y-auto.border-l"
        );
        if (questionsContainer) {
          console.log("Found questions container via border-l class");
        }
      }

      if (!questionsContainer) {
        console.log("No questions container found");
        return;
      }

      console.log("Using questions container:", questionsContainer);

      // Find the question element - first try direct ID, then look in groups
      let questionElement: any = document.getElementById(
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
        // Calculate the position of the question within the container
        const containerRect = questionsContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();
        const relativeTop = questionRect.top - containerRect.top;

        // Defer scrolling until we locate the exact target (avoid double scroll jitter)

        // Try to find the specific question within the group and scroll to it
        setTimeout(() => {
          console.log(
            "Looking for specific question",
            questionNumber,
            "within container:",
            questionElement
          );

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

            // Calculate the position of the specific question within the group
            const specificQuestionIndex = questionNumbers.indexOf(
              questionNumber.toString()
            );
            console.log(
              "Question index within group:",
              specificQuestionIndex,
              "for question",
              questionNumber
            );

            if (specificQuestionIndex >= 0) {
              console.log(
                "Looking for specific question within grouped container"
              );

              // Try a different approach: look for elements with specific question numbers
              const allElements = questionElement.querySelectorAll("*");
              let targetElement = null;

              // Look for elements that contain the specific question number
              for (let element of allElements) {
                const text = element.textContent || "";
                // Look for the exact question number pattern
                const questionPattern = new RegExp(
                  `Question\\s+${questionNumber}\\b`
                );
                if (questionPattern.test(text)) {
                  // Check if this element is likely to be the question container
                  const hasInputs = element.querySelector(
                    "input, textarea, select, button"
                  );
                  const hasQuestionText =
                    text.includes("Question") &&
                    text.includes(questionNumber.toString());

                  console.log(
                    "Found element with question",
                    questionNumber,
                    ":",
                    {
                      hasInputs: !!hasInputs,
                      hasQuestionText,
                      textLength: text.length,
                      element: element.tagName,
                    }
                  );

                  if (hasInputs && hasQuestionText) {
                    targetElement = element;
                    console.log("Found specific question element with inputs");
                    break;
                  }
                }
              }

              if (targetElement) {
                console.log(
                  "Scrolling to specific question element within container"
                );
                const containerRect2 =
                  questionsContainer.getBoundingClientRect();
                const targetRect = (
                  targetElement as HTMLElement
                ).getBoundingClientRect();
                const targetRelativeTop = targetRect.top - containerRect2.top;
                questionsContainer.scrollTo({
                  top: questionsContainer.scrollTop + targetRelativeTop - 50,
                  behavior: "smooth",
                });

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
                const containerRect3 =
                  questionsContainer.getBoundingClientRect();
                const groupRect = (
                  questionElement as HTMLElement
                ).getBoundingClientRect();
                const groupRelativeTop = groupRect.top - containerRect3.top;
                const groupHeight = (questionElement as HTMLElement)
                  .offsetHeight;
                const ratio =
                  specificQuestionIndex / Math.max(1, questionNumbers.length);
                const targetOffset = groupRelativeTop + ratio * groupHeight;
                questionsContainer.scrollTo({
                  top: questionsContainer.scrollTop + targetOffset - 50,
                  behavior: "smooth",
                });
                return;
              }
            }
          }

          // Fallback: focus the first input in the container
          const allInputs = questionElement.querySelectorAll(
            "input, textarea, select, button"
          );
          console.log(
            "All inputs found for question",
            questionNumber,
            ":",
            allInputs.length
          );

          // For MCQ questions, don't focus any input to avoid auto-selection
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
          } else {
            console.log("No input found for question", questionNumber);
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

            // Focus the appropriate input element in the question
            setTimeout(() => {
              // Try different input types in order of preference
              let inputElement =
                div.querySelector('input[type="text"]') ||
                div.querySelector('input[type="number"]') ||
                div.querySelector("textarea") ||
                div.querySelector('input[type="radio"]') ||
                div.querySelector('input[type="checkbox"]') ||
                div.querySelector("select") ||
                div.querySelector("input") ||
                div.querySelector("button");

              if (inputElement) {
                console.log("Focusing input element:", inputElement);
                (inputElement as HTMLElement).focus();

                // For text inputs, also select the text if it exists
                if (
                  inputElement.tagName === "INPUT" &&
                  (inputElement as HTMLInputElement).type === "text"
                ) {
                  (inputElement as HTMLInputElement).select();
                }

                // For radio buttons and checkboxes, trigger click
                if (
                  (inputElement as HTMLInputElement).type === "radio" ||
                  (inputElement as HTMLInputElement).type === "checkbox"
                ) {
                  (inputElement as HTMLElement).click();
                }
              }
            }, 100);

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

  const handleAnswerChange = (
    questionId: number,
    value: string,
    isCheckbox: string,
    answer: string,
    isCorrect?: boolean,
    questionGroup?: number[]
  ) => {
    setAnswers((prev: any) => {
      const currentArray = Array.isArray(prev) ? prev : [];

      if (isCheckbox === "checkbox" && questionGroup) {
        // For multiple MCQ questions
        return currentArray.map((obj) => {
          if (obj.questionId === questionId) {
            // If this is the question being answered
            return {
              ...obj,
              questionId: questionId,
              value: value, // Store the selected option value
              isCorrect: isCorrect, // Use the isCorrect parameter passed from McqMultiple
            };
          }
          return obj;
        });
      } else if (isCheckbox === "checkbox") {
        const existingEntryIndex = currentArray.findIndex(
          (obj) => obj.questionId === questionId
        );

        if (existingEntryIndex !== -1) {
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? {
                  questionId,
                  answers: Array.isArray(obj.answers)
                    ? obj.answers.includes(value)
                      ? obj.answers.filter((v: any) => v !== value)
                      : [...obj.answers, value]
                    : [value],
                  answerText: answer,
                  isCorrect: isCorrect,
                }
              : obj
          );
        } else {
          return [
            ...currentArray,
            {
              questionId,
              answers: [value],
              answerText: answer,
              isCorrect: isCorrect,
            },
          ];
        }
      } else {
        const existingEntryIndex = currentArray.findIndex(
          (obj) => String(obj.questionId) === String(questionId)
        );

        if (existingEntryIndex !== -1) {
          return currentArray.map((obj, index) =>
            index === existingEntryIndex
              ? {
                  ...obj,
                  questionId: questionId,
                  value: String(value),
                  answerText: answer,
                  isCorrect: isCorrect,
                }
              : obj
          );
        } else {
          return [
            ...currentArray,
            {
              questionId: String(questionId),
              value: String(value),
              answerText: answer,
              isCorrect: isCorrect,
            },
          ];
        }
      }
    });
  };

  const handleHighlightChange = (highlights: any[]) => {
    setPassageHighlights(highlights);
    console.log("Passage highlights updated:", highlights);
  };

  const handleNextPart = () => {
    if (currentPartIndex < test.parts.length - 1) {
      setCurrentPartIndex((prev: number) => prev + 1);
      // Set current question to first question of next part
      const nextPartQuestions = partQuestions[currentPartIndex + 1];
      if (nextPartQuestions && nextPartQuestions.length > 0) {
        setCurrentQuestionNumber(nextPartQuestions[0]);
      }

      // Scroll both containers to top
      if (passageContainerRef.current) {
        passageContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev: number) => prev - 1);
      // Set current question to first question of previous part
      const prevPartQuestions = partQuestions[currentPartIndex - 1];
      if (prevPartQuestions && prevPartQuestions.length > 0) {
        setCurrentQuestionNumber(prevPartQuestions[0]);
      }

      // Scroll both containers to top
      if (passageContainerRef.current) {
        passageContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Scroll to top whenever the part changes (backup/fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll main page to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Scroll both containers to top using refs
      if (passageContainerRef.current) {
        passageContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (questionsContainerRef.current) {
        questionsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentPartIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    const submissionTime = new Date();

    const totalPoint =
      answers?.filter((answer: any) => answer.isCorrect === true).length || 0;
    const testData = {
      userId: session?.user?.id,
      testId: test._id,
      answers: answers,
      totalScore: totalPoint,
      submittedAt: submissionTime.toLocaleString(),
      passageHighlights: passageHighlights,
    };

    // 3. Send POST to App Router route
    try {
      const res = await postSubmitReadingTest(testData);

      console.log("Response", res);

      console.log("This is Test Data", testData);

      // 4. Handle non-OK statuses
      if (!res.success) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }

      // 5. On success, optionally show a toast and redirect
      toast.success("Submission successful!");
      redirect(`getSubmittedAnswers/${testData.testId}`); // client-side navigation after success
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    }

    if (Object.keys(answers).length === 0) {
      toast.error("Please Select Answer");
    } else {
      redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/getSubmittedAnswers/${testData.testId}`
      );
    }
  };

  useEffect(() => {
    if (!hasStarted) return;
    if (timeLeft === 0) {
      setIsTimeUp(true);
      // handleSubmit(); // Automatically submit the test when time runs out
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
              aria-labelledby="reading-start-title"
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-red-100 text-red-700 p-3">
                    {/* play icon */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2
                      id="reading-start-title"
                      className="text-xl font-semibold leading-tight text-gray-900"
                    >
                      Ready to begin your Reading test?
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
                      {(test && (test.duration as number)) || 60} min
                    </div>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-red-600 font-medium">
                      Parts
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {test?.parts?.length || 3}
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
                      const durationMin =
                        (test && (test.duration as number)) || 60;
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
        <div className="card bg-base-100 shadow-xl mb-6">
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

        {/* Split Screen Layout */}
        <div className="resize-container flex flex-1 overflow-hidden">
          {/* Passage Section (Left) */}
          <div
            ref={passageContainerRef}
            className="h-full overflow-y-auto p-4 border-r-2"
            style={{ width: `${leftPanelWidth}%` }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {currentPart.passage_title}
            </h2>

            {currentPart?.image && (
              <Image
                src={currentPart.image}
                alt={currentPart.passage_title}
                width={600}
                height={400}
                className="rounded-lg mb-4"
                unoptimized
              />
            )}

            <div className="prose max-w-none space-y-4">
              <TextHighlighter
                content={currentPart.passage}
                onHighlightChange={handleHighlightChange}
              />
            </div>
          </div>

          {/* Resize Handle */}
          <div
            className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize flex-shrink-0 relative group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 w-3 -left-1 cursor-col-resize"></div>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-8 bg-gray-400 group-hover:bg-gray-500 rounded"></div>
            </div>
          </div>

          {/* Questions Section (Right) */}
          <div
            ref={questionsContainerRef}
            className="h-full overflow-y-auto p-4 border-l"
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <div className="space-y-6">
              {/* <h3 className="text-xl font-bold mb-4">{currentPart.title}</h3>
              <p className="italic text-gray-600 mb-6">
                {currentPart.instructions}
              </p> */}

              {currentPart.questions &&
                currentPart.questions.map((question: any, index: number) => {
                  // Create IDs for all questions in this group, not just the first one
                  const createQuestionIds = (): number[] => {
                    const questionIds: number[] = [];

                    // True/False questions
                    if (question.true_false_not_given) {
                      question.true_false_not_given.forEach((q: any) => {
                        questionIds.push(q.question_number);
                      });
                    }

                    // Fill in the blanks
                    if (question.fill_in_the_blanks) {
                      question.fill_in_the_blanks.forEach((q: any) => {
                        questionIds.push(q.question_number);
                      });
                    }

                    // Matching headings
                    if (question.matching_headings) {
                      question.matching_headings.forEach((q: any) => {
                        questionIds.push(q.question_number);
                      });
                    }

                    // Paragraph matching
                    if (question.paragraph_matching) {
                      question.paragraph_matching.forEach((q: any) => {
                        questionIds.push(q.question_number);
                      });
                    }

                    // MCQ questions
                    if (question.mcq) {
                      question.mcq.forEach((q: any) => {
                        questionIds.push(q.question_number);
                      });
                    }

                    // Multiple MCQ questions
                    if (question.multiple_mcq) {
                      question.multiple_mcq.forEach((q: any) => {
                        if (Array.isArray(q.question_numbers)) {
                          q.question_numbers.forEach((num: number) => {
                            questionIds.push(num);
                          });
                        } else {
                          questionIds.push(q.question_number);
                        }
                      });
                    }

                    // Passage fill in the blanks
                    if (question.passage_fill_in_the_blanks) {
                      question.passage_fill_in_the_blanks.forEach((q: any) => {
                        if (Array.isArray(q.question_number)) {
                          q.question_number.forEach((num: number) => {
                            questionIds.push(num);
                          });
                        } else {
                          questionIds.push(q.question_number);
                        }
                      });
                    }

                    // Summary fill in the blanks
                    if (question.summary_fill_in_the_blanks) {
                      question.summary_fill_in_the_blanks.forEach((q: any) => {
                        if (Array.isArray(q.question_numbers)) {
                          q.question_numbers.forEach((num: number) => {
                            questionIds.push(num);
                          });
                        } else {
                          questionIds.push(q.question_number);
                        }
                      });
                    }

                    // Fill in the blanks with subtitle
                    if (question.fill_in_the_blanks_with_subtitle) {
                      question.fill_in_the_blanks_with_subtitle.forEach(
                        (blankSet: any) => {
                          blankSet.questions?.forEach((q: any) => {
                            questionIds.push(q.question_number);
                          });
                        }
                      );
                    }

                    return questionIds;
                  };

                  const questionIds = createQuestionIds();
                  const firstQuestionNumber = questionIds[0] || index + 1;

                  console.log(
                    `Creating question container with IDs: ${questionIds.join(
                      ", "
                    )} for question set ${index}`
                  );

                  return (
                    <div
                      key={index}
                      id={`question-${firstQuestionNumber}`}
                      data-question-numbers={questionIds.join(",")}
                    >
                      {question.true_false_not_given && (
                        <TrueFalse
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.true_false_not_given}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.fill_in_the_blanks && (
                        <FillInTheBlanks
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.fill_in_the_blanks}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.matching_headings && (
                        <MatchingHeadings
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.matching_headings}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.paragraph_matching && (
                        <ParagraphMatching
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.paragraph_matching}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.mcq && (
                        <McqSingle
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.mcq}
                          answers={answers}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.multiple_mcq && (
                        <McqMultiple
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.multiple_mcq}
                          answers={answers}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.passage_fill_in_the_blanks && (
                        <PassFillInTheBlanks
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.passage_fill_in_the_blanks}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.summary_fill_in_the_blanks && (
                        <SumFillInTheBlanks
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.summary_fill_in_the_blanks}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}

                      {question.fill_in_the_blanks_with_subtitle && (
                        <SubFillInTheBlanks
                          instructions={
                            currentPart.questions[index]?.instructions || ""
                          }
                          question={question.fill_in_the_blanks_with_subtitle}
                          handleAnswerChange={handleAnswerChange}
                          handleQuestionFocus={handleQuestionFocus}
                        />
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Navigation */}
            {/* <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPart}
                disabled={currentPartIndex === 0}
                className="btn bg-red-600 hover:bg-red-700 border-0"
                type="button"
              >
                Previous
              </button>
              <button
                onClick={handleNextPart}
                disabled={currentPartIndex === test.parts.length - 1}
                className="btn bg-red-600 hover:bg-red-700 border-0"
                type="button"
              >
                Next
              </button>
            </div> */}
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
              className="btn bg-red-600 hover:bg-red-700 border-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              type="button"
            >
              Previous
            </button>

            {/* Question Numbers */}
            <div className="flex justify-center flex-1">
              {test.parts.map((part: any, partIndex: number) => (
                <div key={partIndex} className="flex-1 flex justify-center">
                  <div className="border-2 border-gray-300 rounded-lg p-1 flex gap-0.5 justify-center">
                    {partQuestions[partIndex]?.map((questionNumber: number) => {
                      const hasAnswered = Array.isArray(answers)
                        ? answers.some(
                            (answer: any) =>
                              String(answer.questionId) ===
                                String(questionNumber) &&
                              answer.value &&
                              answer.value.trim() !== ""
                          )
                        : answers[questionNumber]?.value &&
                          answers[questionNumber]?.value.trim() !== "";

                      return (
                        <button
                          key={`${questionNumber}-${partIndex}`}
                          type="button"
                          className={`w-6 h-6 text-xs rounded border transition-colors ${
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
              className="btn bg-green-600 hover:bg-green-700 border-0 text-white"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReadingTest;
