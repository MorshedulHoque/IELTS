import React, { useEffect, useState } from "react";
import FormattedInstructions from "./FormattedInstructions";

interface BoxMatchingProps {
  instructions?: any;
  question: any[];
  answers?: any;
  readOnly?: boolean;
  handleAnswerChange: (
    questionId: number,
    value: string,
    inputType: string,
    answer: string,
    isCorrect?: boolean
  ) => void;
  handleQuestionFocus: (questionId: number) => void;
}

const BoxMatching: React.FC<BoxMatchingProps> = ({
  instructions,
  question,
  answers,
  readOnly = false,
  handleAnswerChange,
  handleQuestionFocus,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    if (!answers) return;
    const initial: { [key: number]: string } = {};
    const findValue = (questionNumber: number) => {
      if (Array.isArray(answers)) {
        return (
          answers.find((a: any) => String(a.questionId) === String(questionNumber))
            ?.value || ""
        );
      }
      return answers?.[`${questionNumber}`]?.value || "";
    };

    // Pre-fill selects from saved answers
    question?.forEach((group: any) => {
      group?.questions?.forEach((q: any) => {
        initial[q.question_number] = findValue(q.question_number);
      });
    });
    setSelectedAnswers(initial);
  }, [answers, question]);

  const handleAnswerSelect = (
    questionNumber: number,
    selectedOption: string,
    correctAnswer: string
  ) => {
    if (readOnly) return;
    const isCorrect = selectedOption === correctAnswer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: selectedOption,
    }));

    handleAnswerChange(
      questionNumber,
      selectedOption,
      "box_matching",
      correctAnswer,
      isCorrect
    );
  };

  return (
    <div>
      {/* <h5 className="font-medium mb-2">Box Matching Questions</h5> */}
      <FormattedInstructions instructions={instructions} />
      {question.map((q: any, idx: number) => (
        <div key={idx} className="p-4 border border-black rounded-lg mb-4">
          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">{q.instructions}</p>
          </div>

          {/* Box Options */}
          <div className="mb-4">
            <h6 className="font-semibold mb-2 text-center">
              {q.options_title || "Options"}
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((option: any) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <span className="font-semibold w-6">
                    {option.label}.
                  </span>
                  <span className="text-sm">{option.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div>
            <h6 className="font-semibold mb-2 text-center">
              {q.question_title || "Questions"}
            </h6>
            <div className="space-y-3 max-w-2xl mx-auto">
              {q.questions.map((boxQuestion: any) => (
                <div
                  key={boxQuestion.question_number}
                  className="grid grid-cols-[auto,1fr,auto] items-center gap-x-1"
                >
                  <span className="font-semibold w-6 text-Left">
                    {boxQuestion.question_number}.
                  </span>
                  <span className="text-sm">{boxQuestion.topic}</span>
                  <select
                    className="select select-bordered select-sm w-24 justify-self-end"
                    value={selectedAnswers[boxQuestion.question_number] || ""}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleAnswerSelect(
                        boxQuestion.question_number,
                        e.target.value,
                        boxQuestion.answer
                      )
                    }
                    onFocus={() =>
                      handleQuestionFocus(boxQuestion.question_number)
                    }
                  >
                    <option value="">-</option>
                    {q.options.map((option: any) => (
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
      ))}
    </div>
  );
};

export default BoxMatching;
