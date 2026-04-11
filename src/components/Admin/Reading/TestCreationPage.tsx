"use client";
import { submitReadingQuestions } from "@/services/data";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { RenderQuestionInput } from "./RenderQuestionInput";
import {
  updateParagraph,
  updatePassageField,
  updatePassageType,
} from "./UpdatePassage";
import ImageUploader from "../Common/ImageUploader";

// Define types for the test structure
interface Option {
  label: string;
  value: string;
}

interface Blank {
  blank_number: number;
  input_type: string;
  answer: string;
}

interface Question {
  question_number?: any;
  question_numbers?: number[];
  question: string;
  questions: any;
  answer?: string | string[];
  options?: Option[];
  input_type: string;
  min_selection?: number;
  max_selection?: number;
  correct_mapping?: string[];
  // Removed instruction from individual questions
  text?: string;
  blanks?: Blank[];
  passage?: string;
  answers?: string[];
  title: string;
  subtitle: string;
  extra: any;
}

// Define a new structure for fill_in_the_blanks_with_subtitle
interface FillInTheBlanksWithSubtitle {
  title: string;
  subtitle: string;
  extra: string[];
  questions: Question[];
}

interface QuestionGroup {
  instructions: string; // Instructions at the group level
  [key: string]: Question[] | string; // The actual question type with its questions
}

interface Passage {
  title: string;
  instructions: string;
  passage_title: string;
  passage_subtitle: string;
  passage: any;
  image: string;
  questions: QuestionGroup[]; // Updated type
  passageType: "type1" | "type2";
}

interface Test {
  title: string;
  type: "academic" | "general";
  duration: number;
  parts: Passage[];
}

const questionTypes = [
  "true_false_not_given",
  "fill_in_the_blanks",
  "matching_headings",
  "paragraph_matching",
  "multiple_mcq",
  "passage_fill_in_the_blanks",
  "mcq",
  "summary_fill_in_the_blanks",
  "fill_in_the_blanks_with_subtitle",
];

// Default instructions for each question type (used as placeholders)
const DEFAULT_INSTRUCTIONS: Record<string, string> = {
  true_false_not_given:
    "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
  fill_in_the_blanks:
    "Complete the sentences below. Write NO MORE THAN THREE WORDS for each answer.",
  matching_headings:
    "Choose the correct heading for each paragraph from the list of headings below.",
  paragraph_matching: "Which paragraph contains the following information?",
  multiple_mcq: "Choose the correct letter, A, B, C, D or E.",
  passage_fill_in_the_blanks:
    "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
  mcq: "Choose the correct letter, A, B, C or D.",
  summary_fill_in_the_blanks:
    "Complete the summary below. Choose your answers from the list of words below.",
  fill_in_the_blanks_with_subtitle:
    "Complete the sentences below. Write NO MORE THAN THREE WORDS for each answer.",
};

const TestCreationPage: React.FC = () => {
  const [test, setTest] = useState<Test>({
    title: "",
    type: "academic",
    duration: 60,
    parts: [],
  });

  const [currentPassageIndex, setCurrentPassageIndex] = useState<number | null>(
    null
  );
  const [currentQuestionType, setCurrentQuestionType] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [summaryPassage, setSummaryPassage] = useState<string>("");
  const [blanks, setBlanks] = useState<number[]>([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [extra, setExtra] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState<string>("");
  const [editingInstruction, setEditingInstruction] = useState<{
    passageIndex: number;
    groupIndex: number;
  } | null>(null);
  const [editingInstructionText, setEditingInstructionText] =
    useState<string>("");

  const addPassage = () => {
    setTest({
      ...test,
      parts: [
        ...test.parts,
        {
          title: "",
          instructions: "",
          passage_title: "",
          passage_subtitle: "",
          passage: [],
          image: "",
          questions: [],
          passageType: "type1",
        },
      ],
    });
    setCurrentPassageIndex(test.parts.length - 1);
  };

  const addOption = () => {
    const label = String.fromCharCode(65 + options.length);
    const newOption = { label, value: "" };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const addParagraph = (passageIndex: number) => {
    const updatedParts = [...test.parts];
    const passage = updatedParts[passageIndex].passage;
    if (Array.isArray(passage)) {
      passage.push("");
    } else {
      const paragraphKey = String.fromCharCode(
        65 + Object.keys(passage).length
      );
      passage[paragraphKey] = "";
    }
    setTest({ ...test, parts: updatedParts });
  };

  const removeParagraph = (passageIndex: number, paraIndex: number) => {
    const updatedParts = [...test.parts];
    const passage = updatedParts[passageIndex].passage;
    
    if (Array.isArray(passage)) {
      // For type1 (array) - remove by index
      passage.splice(paraIndex, 1);
    } else {
      // For type2 (object) - remove by key
      const keys = Object.keys(passage);
      const keyToRemove = keys[paraIndex];
      delete passage[keyToRemove];
    }
    
    setTest({ ...test, parts: updatedParts });
  };

  const updateGroupInstruction = (
    passageIndex: number,
    groupIndex: number,
    newInstruction: string
  ) => {
    const updatedParts = [...test.parts];
    const group = updatedParts[passageIndex].questions[groupIndex];

    // Update the instructions at the group level
    group.instructions = newInstruction;

    setTest({ ...test, parts: updatedParts });
  };

  const addQuestionGroup = (passageIndex: number) => {
    if (!currentQuestionType || questionCount < 1) return;

    const updatedParts = [...test.parts];
    const newQuestions: any = [];

    const getGlobalMaxQuestionNumber = () => {
      let maxNumber = 0;
      test.parts.forEach((part) => {
        part.questions.forEach((questionGroup) => {
          // Get the question type key (exclude 'instructions')
          const questionTypeKey = Object.keys(questionGroup).find(
            (key) => key !== "instructions"
          );
          if (questionTypeKey) {
            const questionsArray = questionGroup[questionTypeKey] as Question[];
            questionsArray.forEach((q: any) => {
              if (q.question_number && typeof q.question_number === "number") {
                maxNumber = Math.max(maxNumber, q.question_number);
              }
              if (q.question_numbers && Array.isArray(q.question_numbers)) {
                const arrayMax = Math.max(...q.question_numbers);
                maxNumber = Math.max(maxNumber, arrayMax);
              }
              if (q.question_number && Array.isArray(q.question_number)) {
                const arrayMax = Math.max(...q.question_number);
                maxNumber = Math.max(maxNumber, arrayMax);
              }
              if (q.questions && Array.isArray(q.questions)) {
                q.questions.forEach((nestedQ: any) => {
                  if (
                    nestedQ.question_number &&
                    typeof nestedQ.question_number === "number"
                  ) {
                    maxNumber = Math.max(maxNumber, nestedQ.question_number);
                  }
                });
              }
            });
          }
        });
      });
      return maxNumber;
    };

    const globalMaxQuestionNumber = getGlobalMaxQuestionNumber();
    let nextQuestionNumber = globalMaxQuestionNumber + 1;

    switch (currentQuestionType) {
      case "fill_in_the_blanks_with_subtitle":
        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            title: i === 0 ? title : undefined,
            subtitle: subtitle,
            extra: extra.length > 0 ? extra : [""],
            questions: [
              {
                question_number: nextQuestionNumber + i,
                answer: "",
                input_type: "text",
                // Removed instruction from individual question
              },
            ],
          });
        }
        break;

      case "true_false_not_given":
      case "fill_in_the_blanks":
      case "mcq":
        for (let i = 0; i < questionCount; i++) {
          const questionData: any = {
            question_number: nextQuestionNumber + i,
            question: "",
            // Removed instruction from individual question
            input_type:
              currentQuestionType === "fill_in_the_blanks"
                ? "text"
                : currentQuestionType === "true_false_not_given"
                ? "dropdown"
                : "radio",
          };

          if (currentQuestionType === "true_false_not_given") {
            questionData.answer = "True";
          } else if (currentQuestionType === "fill_in_the_blanks") {
            questionData.answer = "";
          } else if (currentQuestionType === "mcq") {
            questionData.answer = [];
            questionData.options = [
              { label: "A", value: "" },
              { label: "B", value: "" },
              { label: "C", value: "" },
              { label: "D", value: "" },
            ];
            questionData.min_selection = 1;
            questionData.max_selection = 1;
          }

          newQuestions.push(questionData);
        }
        break;

      case "matching_headings":
      case "paragraph_matching":
        const passage = updatedParts[passageIndex].passage;
        let optionsList;
        if (Array.isArray(passage)) {
          optionsList = passage.map((_, index) => ({
            label: String.fromCharCode(65 + index),
            value: String.fromCharCode(65 + index),
          }));
        } else {
          optionsList = Object.keys(passage).map((key) => ({
            label: key,
            value: key,
          }));
        }

        for (let i = 0; i < questionCount; i++) {
          newQuestions.push({
            question_number: nextQuestionNumber + i,
            question: "",
            // Removed instruction from individual question
            answer: optionsList[0]?.value || "A",
            options: optionsList,
            input_type: "dropdown",
          });
        }
        break;

      case "multiple_mcq":
        for (let i = 0; i < questionCount; i++) {
          const questionNumbers = [
            nextQuestionNumber + i * 2,
            nextQuestionNumber + i * 2 + 1,
          ];
          newQuestions.push({
            question_numbers: questionNumbers,
            question: "",
            // Removed instruction from individual question
            options: [
              { label: "A", value: "" },
              { label: "B", value: "" },
              { label: "C", value: "" },
              { label: "D", value: "" },
              { label: "E", value: "" },
            ],
            input_type: "checkbox",
            min_selection: 2,
            max_selection: 2,
            correct_mapping: [],
          });
        }
        nextQuestionNumber += questionCount * 2;
        break;

      case "summary_fill_in_the_blanks":
        const summaryQuestionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => nextQuestionNumber + idx
        );
        newQuestions.push({
          question_numbers: summaryQuestionNumbers,
          passage: summaryPassage || "",
          answers: Array(questionCount).fill(""),
          options: [...options],
          // Removed instruction from individual question
          input_type: "drag_and_drop",
          question: "",
        });
        break;

      case "passage_fill_in_the_blanks":
        const passageQuestionNumbers = Array.from(
          { length: questionCount },
          (_, idx) => nextQuestionNumber + idx
        );
        newQuestions.push({
          question_number: passageQuestionNumbers,
          // Removed instruction from individual question
          text: "",
          blanks: [],
        });
        break;

      default:
        return;
    }

    if (currentQuestionType === "fill_in_the_blanks_with_subtitle") {
      const existingQuestions = updatedParts[passageIndex].questions;
      const existingFillBlanksGroup = existingQuestions.find((group) => {
        const questionTypeKey = Object.keys(group).find(
          (key) => key !== "instructions"
        );
        return questionTypeKey === "fill_in_the_blanks_with_subtitle";
      });

      if (existingFillBlanksGroup) {
        // Find the highest question number in existing questions
        let maxQuestionNumber = 0;
        const questionsArray = existingFillBlanksGroup[
          "fill_in_the_blanks_with_subtitle"
        ] as any[];
        questionsArray.forEach((section: any) => {
          if (section.questions && Array.isArray(section.questions)) {
            section.questions.forEach((q: any) => {
              if (q.question_number && typeof q.question_number === "number") {
                maxQuestionNumber = Math.max(
                  maxQuestionNumber,
                  q.question_number
                );
              }
            });
          }
        });

        // Assign new numbers starting from maxQuestionNumber + 1
        let questionCounter = maxQuestionNumber + 1;
        newQuestions.forEach((newQuestion: any) => {
          if (newQuestion.questions && Array.isArray(newQuestion.questions)) {
            newQuestion.questions.forEach((q: any) => {
              q.question_number = questionCounter++;
            });
          }
        });

        // Merge with existing questions without renumbering existing ones
        questionsArray.push(...newQuestions);
      } else {
        // Create new question group with instructions at group level
        updatedParts[passageIndex].questions.push({
          instructions: currentInstruction,
          [currentQuestionType]: newQuestions,
        });
      }
    } else {
      // Create new question group with instructions at group level
      updatedParts[passageIndex].questions.push({
        instructions: currentInstruction,
        [currentQuestionType]: newQuestions,
      });
    }

    setTest({ ...test, parts: updatedParts });
    setCurrentQuestionType("");
    setQuestionCount(1);
    setSummaryPassage("");
    setOptions([]);
    setAnswers([]);
    setBlanks([]);
    setTitle("");
    setSubtitle("");
    setExtra([]);
    setQuestions([]);
    setCurrentInstruction("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPassageIndex]);

  const removeQuestionGroup = (passageIndex: number, groupIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions.splice(groupIndex, 1);
    setTest({ ...test, parts: updatedParts });
  };

  const removePassage = (passageIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts.splice(passageIndex, 1);
    setTest({ ...test, parts: updatedParts });
  };

  const handleReadingTestSubmit = async (formData: any) => {
    try {
      const data = await submitReadingQuestions(formData);
      if (data.success) {
        toast.success("Test created successfully!");
      } else {
        toast.error("Failed to create test. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the test.");
    }
  };

  const cleanTestData = (testData: any) => {
    const cleaned = {
      title: testData.title,
      type: testData.type,
      duration: testData.duration,
      parts: testData.parts.map((part: any) => ({
        title: part.title,
        instructions: part.instructions,
        passage_title: part.passage_title,
        passage_subtitle: part.passage_subtitle,
        passage: part.passage,
        image: part.image || "",
        questions: part.questions,
      })),
    };
    return cleaned;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create IELTS Test</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Test Title"
          value={test.title}
          onChange={(e) => setTest({ ...test, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={test.type}
          onChange={(e) =>
            setTest({ ...test, type: e.target.value as "academic" | "general" })
          }
          className="border p-2 mr-2"
        >
          <option value="academic">Academic</option>
          <option value="general">General</option>
        </select>
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={test.duration}
          onChange={(e) =>
            setTest({ ...test, duration: parseInt(e.target.value) })
          }
          className="border p-2"
        />
      </div>

      <button
        onClick={addPassage}
        className="bg-blue-500 text-white p-2 rounded mb-4 mx-2"
      >
        Add Passage
      </button>

      {test.parts.map((passage, passageIndex) => (
        <div key={passageIndex} className="border p-4 mb-4">
          <h2 className="text-xl font-semibold">Passage {passageIndex + 1}</h2>
          <input
            type="text"
            placeholder="Title (e.g., READING PASSAGE 1)"
            value={passage.title}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "title",
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Instructions"
            value={passage.instructions}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "instructions",
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Passage Title"
            value={passage.passage_title}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "passage_title",
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Passage Subtitle"
            value={passage.passage_subtitle}
            onChange={(e) =>
              updatePassageField(
                passageIndex,
                "passage_subtitle",
                e.target.value,
                test,
                setTest
              )
            }
            className="border p-2 mb-2 w-full"
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Upload Image (Optional)
              </span>
            </label>
            <ImageUploader
              onUploaded={(url) =>
                updatePassageField(passageIndex, "image", url, test, setTest)
              }
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Select Passage Type</label>
            <select
              value={passage.passageType}
              onChange={(e) =>
                updatePassageType(
                  passageIndex,
                  e.target.value as "type1" | "type2",
                  test,
                  setTest
                )
              }
              className="border p-2"
            >
              <option value="type1">Type 1 (Array)</option>
              <option value="type2">Type 2 (Object)</option>
            </select>
          </div>

          <div className="mb-2">
            {Array.isArray(passage.passage)
              ? passage.passage.map((para, paraIndex) => (
                  <div key={paraIndex} className="mb-2 flex gap-2">
                    <textarea
                      placeholder={`Paragraph ${String.fromCharCode(
                        65 + paraIndex
                      )}`}
                      value={para}
                      onChange={(e) =>
                        updateParagraph(
                          passageIndex,
                          paraIndex,
                          e.target.value,
                          test,
                          setTest
                        )
                      }
                      className="border p-2 flex-1"
                    />
                    <button
                      onClick={() => removeParagraph(passageIndex, paraIndex)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      title="Remove paragraph"
                    >
                      ✕
                    </button>
                  </div>
                ))
              : Object.keys(passage.passage).map((key, paraIndex) => (
                  <div key={key} className="mb-2 flex gap-2">
                    <textarea
                      placeholder={`Paragraph ${key}`}
                      value={passage.passage[key]}
                      onChange={(e) =>
                        updateParagraph(
                          passageIndex,
                          parseInt(key, 36) - 10,
                          e.target.value,
                          test,
                          setTest
                        )
                      }
                      className="border p-2 flex-1"
                    />
                    <button
                      onClick={() => removeParagraph(passageIndex, paraIndex)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      title="Remove paragraph"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            <button
              onClick={() => addParagraph(passageIndex)}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Add Paragraph
            </button>
          </div>

          <div className="mb-2">
            <select
              value={currentQuestionType}
              onChange={(e) => {
                setCurrentQuestionType(e.target.value);
                // Set default instruction when question type changes
                setCurrentInstruction(
                  DEFAULT_INSTRUCTIONS[e.target.value] || ""
                );
              }}
              className="border p-2 mr-2"
            >
              <option value="">Select Question Type</option>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {currentQuestionType && (
              <>
                <textarea
                  value={currentInstruction}
                  onChange={(e) => setCurrentInstruction(e.target.value)}
                  placeholder="Enter instruction for this question group"
                  className="border p-2 mr-2 w-full mb-2"
                  rows={2}
                />
                <input
                  type="number"
                  min="1"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="border p-2 mr-2"
                  placeholder="Number of questions"
                />
              </>
            )}
            <button
              onClick={() => addQuestionGroup(passageIndex)}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={!currentQuestionType}
            >
              Add Questions
            </button>
          </div>

          {passage.questions.map((questionGroup, groupIndex) => {
            const questionTypeKey = Object.keys(questionGroup).find(
              (key) => key !== "instructions"
            );
            const questions = questionTypeKey
              ? (questionGroup[questionTypeKey] as Question[])
              : [];
            const instruction = questionGroup.instructions || "";

            return (
              <div key={groupIndex} className="border p-2 mb-2">
                <h3 className="font-semibold">{questionTypeKey}</h3>
                {editingInstruction?.passageIndex === passageIndex &&
                editingInstruction?.groupIndex === groupIndex ? (
                  <div className="mb-2">
                    <textarea
                      value={editingInstructionText}
                      onChange={(e) =>
                        setEditingInstructionText(e.target.value)
                      }
                      placeholder="Enter instruction for this question group"
                      className="border p-2 w-full mb-2"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          updateGroupInstruction(
                            passageIndex,
                            groupIndex,
                            editingInstructionText
                          );
                          setEditingInstruction(null);
                        }}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingInstruction(null)}
                        className="bg-gray-500 text-white p-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {instruction ? (
                      <div className="mb-2 p-3 bg-blue-50 rounded-md border border-blue-200 text-sm font-medium text-blue-800">
                        {instruction}
                        <button
                          onClick={() => {
                            setEditingInstruction({ passageIndex, groupIndex });
                            setEditingInstructionText(instruction);
                          }}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingInstruction({ passageIndex, groupIndex });
                          setEditingInstructionText("");
                        }}
                        className="mb-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Instruction
                      </button>
                    )}
                  </>
                )}
                {RenderQuestionInput(
                  questionTypeKey || "",
                  questions,
                  passageIndex,
                  groupIndex,
                  test,
                  setTest,
                  setSummaryPassage,
                  setBlanks,
                  blanks,
                  setAnswers,
                  setOptions
                )}
                <button
                  onClick={() => removeQuestionGroup(passageIndex, groupIndex)}
                  className="bg-red-500 text-white p-2 rounded mt-2"
                >
                  Remove Question Group
                </button>
              </div>
            );
          })}

          <button
            onClick={() => removePassage(passageIndex)}
            className="bg-red-500 text-white p-2 rounded mt-2"
          >
            Remove Passage
          </button>
        </div>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          console.log(
            "Test object before submission:",
            JSON.stringify(test, null, 2)
          );
          if (
            !test.title ||
            !test.type ||
            !test.duration ||
            !test.parts ||
            test.parts.length === 0
          ) {
            toast.error(
              "Please fill in all required fields: title, type, duration, and at least one passage"
            );
            return;
          }

          const hasQuestions = test.parts.some(
            (part) => part.questions && part.questions.length > 0
          );
          if (!hasQuestions) {
            toast.error("Please add at least one question to a passage");
            return;
          }

          const hasUnansweredSummaryBlanks = test.parts.some((part) =>
            part.questions.some((questionGroup) => {
              const questionTypeKey = Object.keys(questionGroup).find(
                (key) => key !== "instructions"
              );
              if (questionTypeKey === "summary_fill_in_the_blanks") {
                const questions = questionGroup[questionTypeKey] as any[];
                return questions.some((question: any) => {
                  return (
                    !question.answers ||
                    question.answers.some(
                      (answer: string) => !answer || answer === ""
                    )
                  );
                });
              }
              return false;
            })
          );

          if (hasUnansweredSummaryBlanks) {
            toast.error(
              "Please select answers for all summary fill-in-the-blanks questions"
            );
            return;
          }

          handleReadingTestSubmit(cleanTestData(test));
        }}
        className="btn btn-success btn-md text-white"
      >
        Submit
      </button>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default TestCreationPage;
