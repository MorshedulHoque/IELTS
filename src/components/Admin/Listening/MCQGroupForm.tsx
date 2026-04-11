import React, { useState } from "react";
import { MCQItem } from "./listeningTest";

interface MCQGroupFormProps {
  questions?: MCQItem[];
  instruction?: string;
  onUpdate: (data: { questions: MCQItem[]; instruction: string }) => void;
}

const MCQGroupForm = ({
  questions = [],
  instruction = "",
  onUpdate,
}: MCQGroupFormProps) => {
  const [localQuestions, setLocalQuestions] = useState<MCQItem[]>(questions);
  const [localInstruction, setLocalInstruction] = useState<string>(instruction);

  // Sync local instruction when prop changes
  React.useEffect(() => {
    setLocalInstruction(instruction);
  }, [instruction]);

  const updateParent = (
    newQuestions: MCQItem[] = localQuestions,
    newInstruction: string = localInstruction
  ) => {
    onUpdate({ questions: newQuestions, instruction: newInstruction });
  };

  const handleInstructionChange = (value: string) => {
    setLocalInstruction(value);
    updateParent(localQuestions, value);
  };

  const addQuestion = () => {
    const newQuestion: MCQItem = {
      question_number: 0, // Will be set globally by parent component
      question: "",
      answer: "",
      options: [
        { label: "A", value: "" },
        { label: "B", value: "" },
        { label: "C", value: "" },
      ],
      input_type: "radio",
      min_selection: 1,
      max_selection: 1,
    };

    const updatedQuestions = [...localQuestions, newQuestion];
    setLocalQuestions(updatedQuestions);
    updateParent(updatedQuestions, localInstruction);
  };

  const updateQuestion = (index: number, field: keyof MCQItem, value: any) => {
    const updatedQuestions = [...localQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setLocalQuestions(updatedQuestions);
    updateParent(updatedQuestions, localInstruction);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updatedQuestions = [...localQuestions];
    const updatedOptions = [...updatedQuestions[qIndex].options];
    updatedOptions[optIndex] = { ...updatedOptions[optIndex], value };
    updatedQuestions[qIndex].options = updatedOptions;
    setLocalQuestions(updatedQuestions);
    updateParent(updatedQuestions, localInstruction);
  };

  const addOption = (qIndex: number) => {
    const updatedQuestions = [...localQuestions];
    const options = updatedQuestions[qIndex].options;
    const newLabel = String.fromCharCode(65 + options.length);

    updatedQuestions[qIndex].options = [
      ...options,
      { label: newLabel, value: "" },
    ];

    setLocalQuestions(updatedQuestions);
    updateParent(updatedQuestions, localInstruction);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updatedQuestions = [...localQuestions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setLocalQuestions(updatedQuestions);
    updateParent(updatedQuestions, localInstruction);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = localQuestions.filter((_, i) => i !== index);
    // Don't renumber locally - let the global system handle it
    setLocalQuestions(updatedQuestions);
    updateParent(updatedQuestions, localInstruction);
  };

  return (
    <div className="space-y-6">
      {/* Questions List */}
      {localQuestions.map((question, qIndex) => (
        <div key={qIndex} className="bg-base-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Question {question.question_number}</h4>
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="btn btn-error btn-xs"
            >
              Remove
            </button>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Question Text
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered border-black"
              value={question.question}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Correct Answer
              </span>
            </label>
            <select
              className="select select-bordered border-black"
              value={question.answer}
              onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
              required
            >
              <option value="">Select correct option</option>
              {question.options.map((opt, optIndex) => (
                <option key={optIndex} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Options
              </span>
            </label>
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <span className="font-medium w-6">{option.label}:</span>
                  <input
                    type="text"
                    className="input input-bordered border-black flex-1"
                    value={option.value}
                    onChange={(e) =>
                      updateOption(qIndex, optIndex, e.target.value)
                    }
                    required
                  />
                  {question.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, optIndex)}
                      className="btn btn-error btn-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="btn btn-xs mt-2"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="btn btn-sm">
        Add Question
      </button>
    </div>
  );
};

export default MCQGroupForm;
