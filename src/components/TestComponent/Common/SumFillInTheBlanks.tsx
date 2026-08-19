import React, { useEffect, useState } from "react";
import FormattedInstructions from "./FormattedInstructions";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";

const SumFillInTheBlanks = ({
  instructions,
  question,
  answers,
  setAnswers,
  readOnly = false,
  handleAnswerChange,
  handleQuestionFocus,
}: any) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  // Initialize selected answers from the answers prop if available
  useEffect(() => {
    if (answers) {
      const initialAnswers: { [key: number]: string } = {};
      answers.forEach((answer: any) => {
        if (answer.value) {
          const index = question[0].question_numbers.indexOf(answer.questionId);
          if (index !== -1) {
            initialAnswers[index] = answer.value;
          }
        }
      });
      setSelectedAnswers(initialAnswers);
    }
  }, [answers, question]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) return;
    const { active, over } = event;
    if (over) {
      const blankIndex = parseInt(String(over.id));
      const selectedLabel = String(active.id);
      const questionNumber = question[0].question_numbers[blankIndex];
      const correctAnswer = question[0].answers[blankIndex];

      setSelectedAnswers((prev) => ({ ...prev, [blankIndex]: selectedLabel }));

      handleAnswerChange(
        questionNumber,
        selectedLabel,
        "Summary Fill in the Blanks",
        correctAnswer,
        selectedLabel === correctAnswer
      );
    }
  };

  // console.log("Summary", question);

  return (
    <div>
      {/* <h5 className="font-medium mb-2">Summary Completion</h5> */}
      <FormattedInstructions instructions={instructions} />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-4 border border-black rounded-lg mb-2">
          <div className="whitespace-pre-wrap leading-7">
            {question[0].passage
              ?.split("__________")
              .map((part: string, index: number) => {
                if (index < question[0].answers.length) {
                  return (
                    <span key={index} className="inline">
                      {part}
                      <span className="font-semibold">
                        {question[0].question_numbers[index]}.
                      </span>{" "}
                      <DropZone
                        blankIndex={index}
                        answer={selectedAnswers[index]}
                        questionNumber={question[0].question_numbers[index]}
                        handleQuestionFocus={handleQuestionFocus}
                      />
                    </span>
                  );
                }
                return <span key={index}>{part} </span>;
              })}
          </div>

          <div className="mt-4">
            <h6 className="text-medium mb-2 font-semibold">
              Drag the correct answers:
            </h6>
            <div className="flex gap-2 flex-wrap">
              {question[0].options?.map((opt: any) => (
                <DraggableOption
                  key={opt.label}
                  id={opt.label}
                  label={opt.label}
                  value={opt.value}
                  disabled={readOnly}
                />
              ))}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

const DraggableOption = ({
  id,
  label,
  value,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...(disabled ? {} : attributes)}
      {...(disabled ? {} : listeners)}
      className={`px-3 py-1 border border-black rounded ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-grab"
      }`}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <strong>{label}.</strong> {value}
    </div>
  );
};

const DropZone = ({
  blankIndex,
  answer,
  questionNumber,
  handleQuestionFocus,
}: {
  blankIndex: number;
  answer?: string;
  questionNumber: number;
  handleQuestionFocus: (questionId: number) => void;
}) => {
  const { setNodeRef } = useDroppable({ id: blankIndex.toString() });

  return (
    <span
      ref={setNodeRef}
      className="inline-block border-b-2 border-black border-dashed px-2 mx-1 min-w-[50px] text-center"
      onFocus={() => handleQuestionFocus(questionNumber)}
      tabIndex={0}
    >
      {answer}
    </span>
  );
};

export default SumFillInTheBlanks;
