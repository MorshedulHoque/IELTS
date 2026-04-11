import React from "react";
import FormattedInstructions from "./FormattedInstructions";

const PassFillInTheBlanks = ({
  instructions,
  question,
  answers,
  readOnly = false,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  const getValue = (blankNumber: number) => {
    const found = Array.isArray(answers)
      ? answers.find((a: any) => String(a.questionId) === String(blankNumber))
      : answers?.[`${blankNumber}`];
    return found?.value || "";
  };

  // Function to render text with input fields dynamically
  const renderTextWithBlanks = () => {
    const parts = [];
    let lastIndex = 0;

    // Regex to find placeholders like "__________"
    const regex = /__________/g;
    let match;

    let blankIndex = 0; // Index to track which blank we're currently processing

    while ((match = regex.exec(question[0].text)) !== null) {
      // Add the part of text before the blank
      if (lastIndex < match.index) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {question[0].text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Get the current blank data
      const currentBlank = question[0].blanks[blankIndex];
      const blankNumber = currentBlank.blank_number;
      const correctAnswer = currentBlank.answer;

      // Add the number before the input box
      parts.push(
        <span key={`number-${blankNumber}`} className="font-bold">
          {blankNumber}.{" "}
        </span>
      );

      // Add the input field for the blank
      parts.push(
        <input
          key={`input-${blankNumber}`}
          type="text"
          placeholder=""
          className="border-b-2 border-black mx-1 w-24 text-center"
          style={{
            height: "20px",
            padding: "5px 5px",
            fontSize: "14px",
          }}
          onFocus={() => handleQuestionFocus(blankNumber)}
          disabled={readOnly}
          {...(readOnly
            ? { value: getValue(blankNumber) }
            : { defaultValue: getValue(blankNumber) })}
          onChange={(e) => {
            if (readOnly) return;
            handleAnswerChange(
              blankNumber,
              e.target.value,
              "text",
              correctAnswer,
              e.target.value.toLowerCase().trim() ===
                correctAnswer.toLowerCase().trim()
            );
          }}
        />
      );

      blankIndex++; // Move to the next blank
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last blank
    if (lastIndex < question[0].text?.length) {
      parts.push(
        <span key={`text-final`}>{question[0].text.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div>
      {/* <h5 className="font-medium mb-2">Passage Fill in the Blanks</h5> */}
      <FormattedInstructions instructions={instructions} />
      <div className="p-4 border border-black rounded-lg mb-2">
        <p className="mb-2">{question[0]?.instruction}</p>
        <div className="text-justify leading-relaxed">
          {renderTextWithBlanks()}
        </div>
      </div>
    </div>
  );
};

export default PassFillInTheBlanks;
