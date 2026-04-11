import React, { useState, useEffect, useRef } from "react";
import FormattedInstructions from "./FormattedInstructions";

const McqMultiple = ({
  instructions,
  question,
  answers,
  readOnly = false,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  // Track selected options locally
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { [key: number]: string };
  }>({});

  // Use ref to track initial mount and prevent unnecessary updates
  const isInitialMount = useRef(true);
  const skipNextUpdate = useRef(false);

  // Initialize only once when component mounts
  useEffect(() => {
    const initialSelections: { [key: string]: { [key: number]: string } } = {};
    question.forEach((q: any) => {
      const groupKey = q.question_numbers.join("-");
      initialSelections[groupKey] = {};
      q.question_numbers.forEach((num: number) => {
        const answerObj = Array.isArray(answers)
          ? answers.find((a: any) => String(a.questionId) === String(num))
          : answers?.[`${num}`];
        const answerValue = answerObj?.value || "";
        initialSelections[groupKey][num] = answerValue;
      });
    });
    setSelectedOptions(initialSelections);
    isInitialMount.current = false;
  }, [question]); // Only depend on question structure, not answers

  // Handle checkbox change without triggering parent during render
  const handleCheckboxChange = (
    groupKey: string,
    optionLabel: string,
    q: any,
    questionNumber: number
  ) => {
    if (readOnly) return;
    const currentSelections = selectedOptions[groupKey] || {};
    const selectedCount = Object.values(currentSelections).filter(
      (v) => v !== ""
    ).length;

    let newSelections = { ...currentSelections };

    // Toggle selection
    if (currentSelections[questionNumber] === optionLabel) {
      newSelections[questionNumber] = "";
    } else {
      if (selectedCount < q.max_selection) {
        newSelections[questionNumber] = optionLabel;
      } else {
        alert(
          `You can only select ${q.max_selection} options for this question.`
        );
        return;
      }
    }

    // Update local state first
    setSelectedOptions((prev) => ({
      ...prev,
      [groupKey]: newSelections,
    }));

    // Then update parent - use setTimeout to ensure this happens after render
    setTimeout(() => {
      // Multiple MCQ should be order-insensitive:
      // selected [A, D] should match correct [D, A].
      const normalize = (v: any) => String(v ?? "").trim().toUpperCase();
      const selectedValues = q.question_numbers
        .map((num: number) => newSelections[num])
        .filter((v: string) => v && v !== "")
        .map(normalize);
      const correctValues = (q.correct_mapping || [])
        .filter((v: string) => v && v !== "")
        .map(normalize);

      const selectedSet = new Set(selectedValues);
      const correctSet = new Set(correctValues);
      const isGroupCorrect =
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((v) => correctSet.has(v));

      q.question_numbers.forEach((num: number) => {
        const idx = q.question_numbers.indexOf(num);
        const correctAnswer = q.correct_mapping?.[idx] || "";
        const currentValue = normalize(newSelections[num]);
        const isCorrect = isGroupCorrect || (currentValue !== "" && correctSet.has(currentValue));

        handleAnswerChange(
          num,
          newSelections[num] || "",
          q.input_type,
          correctAnswer,
          isCorrect,
          q.question_numbers
        );
      });
    }, 0);
  };

  return (
    <div>
      <FormattedInstructions instructions={instructions} />
      {question.map((q: any, idx: number) => {
        const groupKey = q.question_numbers.join("-");
        const currentSelections = selectedOptions[groupKey] || {};

        return (
          <div key={idx} className="p-4 border border-black rounded-lg mb-2">
            <p>
              <strong>{q.question_numbers.join(", ")}. </strong>
              {q.question}
            </p>
            <div className="mt-2 space-y-2">
              {q.options.map((option: any) => (
                <label
                  key={option.label}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onFocus={() => handleQuestionFocus(q.question_numbers[0])}
                    disabled={readOnly}
                    checked={Object.values(currentSelections).includes(
                      option.label
                    )}
                    onChange={() => {
                      if (readOnly) return;
                      // Find available question for this option
                      const availableQuestion = q.question_numbers.find(
                        (num: number) =>
                          !currentSelections[num] ||
                          currentSelections[num] === option.label
                      );
                      if (availableQuestion) {
                        handleCheckboxChange(
                          groupKey,
                          option.label,
                          q,
                          availableQuestion
                        );
                      }
                    }}
                  />
                  <span>{option.value}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default McqMultiple;
