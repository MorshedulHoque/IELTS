import React from "react";
import FormattedInstructions from "./FormattedInstructions";
import Image from "next/image";

interface MapQuestion {
  question_number: number;
  question: string;
  answer: string;
  input_type: string;
  min_selection: number;
  max_selection: number;
}

interface MapProps {
  question: {
    title: string;
    image: string;
    instructions: string;
    labels: string[];
    questions: MapQuestion[];
  };
  readOnly?: boolean;
  handleAnswerChange: (
    questionId: number,
    value: string,
    inputType: string,
    answer: string,
    isCorrect?: boolean
  ) => void;
  handleQuestionFocus?: (questionId: number) => void;
  answers?: Record<string, any>;
}

const Map: React.FC<MapProps> = ({
  question,
  readOnly = false,
  handleAnswerChange,
  handleQuestionFocus,
  answers = {},
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* <h3 className="text-xl font-semibold mb-2">{question?.title}</h3> */}
      
      {question?.instructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 font-medium mb-1">Instructions:</p>
        <FormattedInstructions instructions={question.instructions} className="mb-2" />
        </div>
      )}
      
      <div className="w-full flex justify-center mb-4">
        <Image
          src={question?.image}
          alt={question?.title}
          width={600}
          height={400}
          className="rounded-lg mx-auto"
          unoptimized
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="text-black px-2 py-1 text-left font-normal"></th>
              {question?.labels.map((label) => (
                <th
                  key={label}
                  className="text-black px-4 py-1 font-bold text-center"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question?.questions.map((q) => (
              <tr key={q?.question_number} className="border-b border-black">
                <td className="pr-2 py-2 text-black whitespace-nowrap font-medium">
                  <span className="font-bold">{q?.question_number}.</span> {q.question}
                </td>
                {question?.labels.map((label) => (
                  <td key={label} className="text-center">
                    <input
                      type="radio"
                      name={`${q?.question_number}`}
                      value={label}
                      disabled={readOnly}
                      checked={
                        answers &&
                        answers[`${q?.question_number}`]?.value === label
                      }
                      onFocus={() => handleQuestionFocus?.(q?.question_number)}
                      onChange={() => {
                        if (readOnly) return;
                        handleAnswerChange(
                          q?.question_number,
                          label,
                          "Map",
                          q?.answer,
                          label === q?.answer
                        );
                      }}
                      className="form-radio h-5 w-5 accent-black"
                      style={{ accentColor: "black" }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Map;
