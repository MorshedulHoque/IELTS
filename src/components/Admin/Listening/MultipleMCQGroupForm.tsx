import React, { useState } from "react";
import { MultipleMCQGroup, MultipleMCQItem } from "./listeningTest";

interface MultipleMCQGroupFormProps {
  questions: MultipleMCQItem[];
  onUpdate: (questions: MultipleMCQItem[]) => void;
}

const MultipleMCQGroupForm = ({
  questions,
  onUpdate,
}: MultipleMCQGroupFormProps) => {
  const [localQuestions, setLocalQuestions] =
    useState<MultipleMCQItem[]>(questions);

  // Sync local state when props change
  React.useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  const updateParent = (newQuestions: MultipleMCQItem[]) => {
    setLocalQuestions(newQuestions);
    onUpdate(newQuestions);
  };

  const updateQuestion = (index: number, updatedQuestion: MultipleMCQItem) => {
    const newQuestions = [...localQuestions];
    newQuestions[index] = updatedQuestion;
    updateParent(newQuestions);
  };

  const addQuestion = () => {
    const newQuestion: MultipleMCQItem = {
      question_numbers: [1, 2], // Temporary - will be renumbered globally
      question: "",
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
      correct_mapping: ["A", "B"],
    };
    const newQuestions = [...localQuestions, newQuestion];
    updateParent(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = localQuestions.filter((_, i) => i !== index);
    updateParent(newQuestions);
  };

  const updateQuestionField = (
    index: number,
    field: keyof MultipleMCQItem,
    value: any
  ) => {
    const updatedQuestion = { ...localQuestions[index], [field]: value };
    updateQuestion(index, updatedQuestion);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: "label" | "value",
    value: string
  ) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.options[optionIndex] = {
      ...updatedQuestion.options[optionIndex],
      [field]: value,
    };
    updateQuestion(questionIndex, updatedQuestion);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    const newLabel = String.fromCharCode(65 + updatedQuestion.options.length);
    updatedQuestion.options.push({ label: newLabel, value: "" });
    updateQuestion(questionIndex, updatedQuestion);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.options.splice(optionIndex, 1);
    updatedQuestion.options.forEach((option, index) => {
      option.label = String.fromCharCode(65 + index);
    });
    updateQuestion(questionIndex, updatedQuestion);
  };

  const updateCorrectMapping = (
    questionIndex: number,
    mappingIndex: number,
    value: string
  ) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.correct_mapping[mappingIndex] = value;
    updateQuestion(questionIndex, updatedQuestion);
  };

  const addCorrectMapping = (questionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.correct_mapping.push("A");
    updateQuestion(questionIndex, updatedQuestion);
  };

  const removeCorrectMapping = (
    questionIndex: number,
    mappingIndex: number
  ) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.correct_mapping.splice(mappingIndex, 1);
    updateQuestion(questionIndex, updatedQuestion);
  };

  const addQuestionNumber = (questionIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    const newQuestionNumbers = [...updatedQuestion.question_numbers, 1]; // Temporary - will be renumbered globally
    updatedQuestion.question_numbers = newQuestionNumbers;
    // Add corresponding correct mapping
    updatedQuestion.correct_mapping.push("A");
    updateQuestion(questionIndex, updatedQuestion);
  };

  const removeQuestionNumber = (questionIndex: number, numberIndex: number) => {
    const updatedQuestion = { ...localQuestions[questionIndex] };
    updatedQuestion.question_numbers.splice(numberIndex, 1);
    // Remove corresponding correct mapping
    updatedQuestion.correct_mapping.splice(numberIndex, 1);
    updateQuestion(questionIndex, updatedQuestion);
  };

  return (
    <div className="space-y-6">
      {/* Questions List */}
      {localQuestions.map((question, questionIndex) => (
        <div key={questionIndex} className="card bg-base-100 p-4 border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">
              Multiple MCQ Question {questionIndex + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeQuestion(questionIndex)}
              className="btn btn-error btn-sm"
            >
              Remove Question
            </button>
          </div>

          <div className="space-y-4">
            {/* Question Text */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Question Text</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={question.question}
                onChange={(e) =>
                  updateQuestionField(questionIndex, "question", e.target.value)
                }
                placeholder="Enter the question text..."
                rows={3}
              />
            </div>

            {/* Question Numbers - Display Only */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Question Numbers (Auto-assigned)
                </span>
              </label>
              <div className="flex gap-2 flex-wrap items-center">
                {question.question_numbers.map((num, numIndex) => (
                  <div key={numIndex} className="flex items-center gap-2">
                    <div className="bg-base-200 rounded px-3 py-1">
                      <span className="font-medium">
                        Q{num || numIndex + 1}
                      </span>
                    </div>
                    {question.question_numbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeQuestionNumber(questionIndex, numIndex)
                        }
                        className="btn btn-error btn-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addQuestionNumber(questionIndex)}
                  className="btn btn-sm btn-outline"
                >
                  Add Question Number
                </button>
              </div>
            </div>

            {/* Selection Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Min Selection
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={question.min_selection}
                  onChange={(e) =>
                    updateQuestionField(
                      questionIndex,
                      "min_selection",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Max Selection
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={question.max_selection}
                  onChange={(e) =>
                    updateQuestionField(
                      questionIndex,
                      "max_selection",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                />
              </div>
            </div>

            {/* Options */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Options</span>
              </label>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex gap-2 items-center">
                    <span className="font-medium w-8">{option.label}</span>
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={option.value}
                      onChange={(e) =>
                        updateOption(
                          questionIndex,
                          optionIndex,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder={`Option ${option.label}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      className="btn btn-error btn-sm"
                      disabled={question.options.length <= 2}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  className="btn btn-outline btn-sm"
                >
                  Add Option
                </button>
              </div>
            </div>

            {/* Correct Mapping */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Correct Answers (in order of question numbers)
                </span>
              </label>
              <div className="space-y-2">
                {question.correct_mapping.map((mapping, mappingIndex) => (
                  <div key={mappingIndex} className="flex gap-2 items-center">
                    <span className="font-medium">
                      Q
                      {question.question_numbers[mappingIndex] ||
                        mappingIndex + 1}
                      :
                    </span>
                    <select
                      className="select select-bordered"
                      value={mapping}
                      onChange={(e) =>
                        updateCorrectMapping(
                          questionIndex,
                          mappingIndex,
                          e.target.value
                        )
                      }
                    >
                      {question.options.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="btn btn-primary">
        Add Multiple MCQ Question
      </button>
    </div>
  );
};

export default MultipleMCQGroupForm;
