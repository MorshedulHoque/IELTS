import React from "react";
import FormattedInstructions from "./FormattedInstructions";

const McqSingle = ({
  instructions,
  question,
  answers,
  readOnly = false,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  return (
    <div>
      {/* <h5 className="font-medium mb-2">Multiple Choice Questions</h5> */}
      <FormattedInstructions instructions={instructions} />
      <div className="p-4 border border-black rounded-lg mb-2">
        {question.map((q: any, idx: number) => {
          // Handle both object and array formats for answers
          const answerObj = Array.isArray(answers)
            ? answers.find((a: any) => a.questionId === q.question_number)
            : answers?.[`${q.question_number}`];
          const currentValue = answerObj ? answerObj.value : "";
          return (
            <div key={idx} className="mb-4">
              <p>
                <strong>{q.question_number}. </strong>
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
                      name={`mcq-${q.question_number}`}
                      className="checkbox checkbox-primary"
                      onFocus={() => handleQuestionFocus(q.question_number)}
                      disabled={readOnly}
                      onChange={() => {
                        if (readOnly) return;
                        handleAnswerChange(
                          q.question_number,
                          option.label,
                          "MCQ Single",
                          q.answer,
                          option.label === q.answer[0] ? true : false
                        );
                      }}
                      checked={currentValue === option.label}
                    />
                    <span>{option.value}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default McqSingle;
