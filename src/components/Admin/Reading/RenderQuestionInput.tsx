export const RenderQuestionInput = (
  questionType: string,
  questions: any[],
  passageIndex: number,
  groupIndex: number,
  test: any,
  setTest: any,
  setSummaryPassage: any,
  setBlanks: any,
  blanks: any,
  setAnswers: any,
  setOptions: any
) => {
  // const updateQuestion = (field: string, value: any, qIndex: number) => {
  //   const updatedParts = [...test.parts];
  //   updatedParts[passageIndex].questions[groupIndex][questionType][qIndex][
  //     field as keyof Question
  //   ] = value;
  //   setTest({ ...test, parts: updatedParts });
  // };

  const updateQuestion = (field: string, value: any, qIndex: number) => {
    const updatedParts = [...test.parts];

    // Create a deep copy of the specific question
    const currentQuestion = {
      ...updatedParts[passageIndex].questions[groupIndex][questionType][qIndex],
    };

    // Update the specific field
    currentQuestion[field as keyof any] = value;

    // Update the question in the parts array
    updatedParts[passageIndex].questions[groupIndex][questionType][qIndex] =
      currentQuestion;

    // Update the test state
    setTest({ ...test, parts: updatedParts });

    // Debug log to verify the update
    console.log(`Updated ${field} for question ${qIndex}:`, value);
  };

  // Add remove question function
  const removeQuestion = (qIndex: number) => {
    const updatedParts = [...test.parts];
    updatedParts[passageIndex].questions[groupIndex][questionType].splice(
      qIndex,
      1
    );
    setTest({ ...test, parts: updatedParts });
  };

  switch (questionType) {
    case "true_false_not_given":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => updateQuestion("question", e.target.value, idx)}
            className="border p-2 mr-2 flex-1"
          />
          <select
            value={q.answer as string}
            onChange={(e) => updateQuestion("answer", e.target.value, idx)}
            className="border p-2"
          >
            <option>True</option>
            <option>False</option>
            <option>Not Given</option>
          </select>
          <button
            onClick={() => removeQuestion(idx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this question"
          >
            ×
          </button>
        </div>
      ));
    case "fill_in_the_blanks":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Question with blank (e.g., The ___ is red)"
            value={q.question}
            onChange={(e) => updateQuestion("question", e.target.value, idx)}
            className="border p-2 mr-2 flex-1"
          />
          <input
            type="text"
            placeholder="Answer"
            value={q.answer as string}
            onChange={(e) => updateQuestion("answer", e.target.value, idx)}
            className="border p-2"
          />
          <button
            onClick={() => removeQuestion(idx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this question"
          >
            ×
          </button>
        </div>
      ));
    case "matching_headings":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-2">
          {/* Question input box */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Question reference (e.g., reference to two chemical compounds which impact on performance)"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 flex-1"
            />
            <button
              onClick={() => removeQuestion(idx)}
              className="bg-red-500 text-white p-2 rounded text-sm"
              title="Remove this question"
            >
              ×
            </button>
          </div>
          {/* Dropdown to select the matching heading */}
          <select
            value={(q.answer as string) || "A"} // Ensure there's always a default value
            onChange={(e) => updateQuestion("answer", e.target.value, idx)}
            className="border p-2 mb-2 w-full"
          >
            <option value="">-- Select Answer --</option>{" "}
            {/* Add default option */}
            {q.options?.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}: {opt.value}{" "}
                {/* Show both label and value if needed */}
              </option>
            ))}
          </select>
        </div>
      ));

    case "paragraph_matching":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-2">
          {/* Question input box */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Question reference (e.g., Which paragraph discusses piracy?)"
              value={q.question}
              onChange={(e) => updateQuestion("question", e.target.value, idx)}
              className="border p-2 flex-1"
            />
            <button
              onClick={() => removeQuestion(idx)}
              className="bg-red-500 text-white p-2 rounded text-sm"
              title="Remove this question"
            >
              ×
            </button>
          </div>
          {/* Dropdown to select the matching paragraph */}
          <select
            value={(q.answer as string) || "A"} // Ensure there's always a default value
            onChange={(e) => updateQuestion("answer", e.target.value, idx)}
            className="border p-2 mb-2 w-full"
          >
            <option value="">-- Select Answer --</option>{" "}
            {/* Add default option */}
            {q.options?.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}: {opt.value}{" "}
                {/* Show both label and value if needed */}
              </option>
            ))}
          </select>
        </div>
      ));

    // For 'multiple_mcq' rendering
    case "multiple_mcq":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-2">
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => updateQuestion("question", e.target.value, idx)}
            className="border p-2 mb-2 w-full"
          />
          {q.options?.map((opt: any, optIdx: any) => (
            <div key={opt.label} className="mb-2">
              <input
                type="text"
                placeholder={`Option ${opt.label}`}
                value={opt.value}
                onChange={(e) => {
                  const updatedOptions = [...q.options!];
                  updatedOptions[optIdx].value = e.target.value;
                  updateQuestion("options", updatedOptions, idx);
                }}
                className="border p-2 mb-2 w-full"
              />
            </div>
          ))}
          <div className="mb-2">
            <label>Select correct answers:</label>
            {q.options?.map((opt: any, optIdx: any) => (
              <div key={opt.label}>
                <input
                  type="checkbox"
                  checked={q.correct_mapping?.includes(opt.label) || false}
                  onChange={(e) => {
                    const updatedCorrectMapping = q.correct_mapping
                      ? [...q.correct_mapping]
                      : [];
                    if (e.target.checked) {
                      updatedCorrectMapping.push(opt.label);
                    } else {
                      const index = updatedCorrectMapping.indexOf(opt.label);
                      if (index !== -1) updatedCorrectMapping.splice(index, 1);
                    }
                    updateQuestion(
                      "correct_mapping",
                      updatedCorrectMapping,
                      idx
                    );
                  }}
                />
                {opt.label}: {opt.value}
              </div>
            ))}
          </div>
          <button
            onClick={() => removeQuestion(idx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this question"
          >
            ×
          </button>
        </div>
      ));

    case "mcq":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-2">
          {/* Question input box */}
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => updateQuestion("question", e.target.value, idx)}
            className="border p-2 mb-2 w-full"
          />
          {/* Input fields for options */}
          {q.options?.map((option: any, optionIdx: any) => (
            <div key={option.label} className="mb-2">
              <input
                type="text"
                placeholder={`Option ${option.label} (e.g., Misinformation is a relatively recent phenomenon.)`}
                value={option.value}
                onChange={(e) => {
                  // Create a new array of options where we only update the current option
                  const updatedOptions = [...q.options!];
                  updatedOptions[optionIdx].value = e.target.value;
                  // Update only the options for the specific question
                  updateQuestion("options", updatedOptions, idx);
                }}
                className="border p-2 mb-2 w-full"
              />
            </div>
          ))}
          {/* Dropdown to select the correct answer */}
          <select
            value={q.answer?.[0] || ""} // Provide fallback if answer is undefined
            onChange={(e) => updateQuestion("answer", [e.target.value], idx)} // Ensure answer is an array of labels
            className="border p-2 mb-2 w-full"
          >
            <option value="">Select correct answer</option>
            {q.options?.map((opt: any) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}: {opt.value}
              </option>
            ))}
          </select>
          <button
            onClick={() => removeQuestion(idx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this question"
          >
            ×
          </button>
        </div>
      ));

    // Replace the "passage_fill_in_the_blanks" case in your renderQuestionInput function with this:

    // Replace your existing "passage_fill_in_the_blanks" case in renderQuestionInput with this fixed version:

    case "passage_fill_in_the_blanks":
      return questions.map((q, idx) => (
        <div key={idx} className="mb-4 border p-4">
          {/* Display question numbers */}
          <div className="mb-2">
            <span className="font-medium">Question Numbers: </span>
            <span className="text-blue-600">
              {q.question_number ? q.question_number.join(", ") : "N/A"}
            </span>
          </div>

          {/* Instruction input */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Instruction:</label>
            <input
              type="text"
              placeholder="Instruction"
              value={
                q.instruction ||
                "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer."
              }
              onChange={(e) =>
                updateQuestion("instruction", e.target.value, idx)
              }
              className="border p-2 mb-2 w-full"
            />
          </div>

          {/* Passage text with blanks */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Passage text (use __________ for blanks):
            </label>
            <textarea
              placeholder="Enter the passage text with __________ where blanks should be"
              value={q.text || ""}
              onChange={(e) => {
                const newText = e.target.value;

                // Get existing blanks to preserve answers
                const existingBlanks = q.blanks || [];
                const existingAnswers = existingBlanks.reduce(
                  (acc: any, blank: any) => {
                    acc[blank.blank_number] = blank.answer;
                    return acc;
                  },
                  {} as Record<number, string>
                );

                // Extract new blanks from text
                const extractedBlanks = getBlanksFromText(
                  newText,
                  q.question_number
                );

                // Map the blanks to use the question numbers and preserve existing answers
                const blanksWithQuestionNumbers = extractedBlanks.map(
                  (blank, blankIdx) => ({
                    blank_number: q.question_number
                      ? q.question_number[blankIdx]
                      : blankIdx + 1,
                    input_type: "text",
                    answer:
                      existingAnswers[
                        q.question_number
                          ? q.question_number[blankIdx]
                          : blankIdx + 1
                      ] || "",
                  })
                );

                // Update both the text and the blanks
                updateQuestion("text", newText, idx);
                updateQuestion("blanks", blanksWithQuestionNumbers, idx);
              }}
              className="border p-2 w-full"
              rows={6}
            />
          </div>

          {/* Render blanks for answers */}
          {q.blanks && q.blanks.length > 0 && (
            <div className="mb-2">
              <label className="block mb-1 font-medium">
                Answers for blanks:
              </label>
              {q.blanks.map((blank: any, blankIdx: any) => (
                <div
                  key={`${blank.blank_number}-${blankIdx}`}
                  className="mb-2 flex items-center"
                >
                  <span className="mr-2 font-medium">
                    Question {blank.blank_number}:
                  </span>
                  <input
                    type="text"
                    placeholder="Answer"
                    value={blank.answer || ""}
                    onChange={(e) => {
                      // Create a deep copy of the blanks array
                      const updatedBlanks = q.blanks ? [...q.blanks] : [];

                      // Update the specific blank's answer
                      if (updatedBlanks[blankIdx]) {
                        updatedBlanks[blankIdx] = {
                          ...updatedBlanks[blankIdx],
                          answer: e.target.value,
                        };
                      }

                      // Update the question with the new blanks array
                      updateQuestion("blanks", updatedBlanks, idx);
                    }}
                    className="border p-2 flex-1"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Show message if no blanks detected */}
          {(!q.blanks || q.blanks.length === 0) && q.text && (
            <div className="text-red-500 text-sm">
              No blanks detected. Use __________ (10 underscores) to create
              blanks in your text.
            </div>
          )}

          {/* Warning if blanks exceed question numbers */}
          {q.blanks &&
            q.question_number &&
            q.blanks.length > q.question_number.length && (
              <div className="text-orange-500 text-sm">
                Warning: You have {q.blanks.length} blanks but only{" "}
                {q.question_number.length} question numbers allocated. Some
                blanks may not have proper question numbers.
              </div>
            )}

          {/* Debug info - you can remove this after testing */}
          <div className="mt-4 p-2 bg-gray-100 text-xs">
            <strong>Debug Info:</strong>
            <pre>{JSON.stringify(q.blanks, null, 2)}</pre>
          </div>
          <button
            onClick={() => removeQuestion(idx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this question"
          >
            ×
          </button>
        </div>
      ));

    case "fill_in_the_blanks_with_subtitle":
      return questions.map((section, sectionIdx) => (
        <div key={sectionIdx} className="mb-4 border p-4">
          {/* Title Input - Only show for the first question */}
          {sectionIdx === 0 && (
            <div className="mb-2">
              <input
                type="text"
                placeholder="Title (optional)"
                value={section.title || ""}
                onChange={(e) => {
                  const updatedParts = [...test.parts];
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].title = e.target.value;
                  setTest({ ...test, parts: updatedParts });
                }}
                className="border p-2 mb-2 w-full"
              />
            </div>
          )}

          {/* Subtitle input */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Subtitle"
              value={section.subtitle || ""}
              onChange={(e) => {
                const updatedParts = [...test.parts];
                updatedParts[passageIndex].questions[groupIndex][questionType][
                  sectionIdx
                ].subtitle = e.target.value;
                setTest({ ...test, parts: updatedParts });
              }}
              className="border p-2 mb-2 w-full font-medium"
            />
          </div>

          {/* Extra text with blanks */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Text with blanks:</label>
            {section.extra?.map((text: any, textIdx: any) => (
              <div key={textIdx} className="mb-2">
                <textarea
                  placeholder={`Text line ${
                    textIdx + 1
                  } (use __________ for blanks)`}
                  value={text || ""}
                  onChange={(e) => {
                    const updatedParts = [...test.parts];
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].extra[textIdx] = e.target.value;
                    setTest({ ...test, parts: updatedParts });
                  }}
                  className="border p-2 w-full"
                  rows={2}
                />
              </div>
            ))}

            {/* Add new text line button */}
            <button
              type="button"
              onClick={() => {
                const updatedParts = [...test.parts];
                if (
                  !updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].extra
                ) {
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].extra = [];
                }
                updatedParts[passageIndex].questions[groupIndex][questionType][
                  sectionIdx
                ].extra.push("");
                setTest({ ...test, parts: updatedParts });
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Add Text Line
            </button>
          </div>

          {/* Questions/Answers */}
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Answers for Questions:
            </label>
            {section.questions?.map((question: any, qIdx: number) => (
              <div key={qIdx} className="mb-2 flex items-center">
                <span className="mr-2">
                  Question {question.question_number}:
                </span>
                <input
                  type="text"
                  placeholder="Answer"
                  value={question.answer || ""}
                  onChange={(e) => {
                    const updatedParts = [...test.parts];
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].questions[qIdx].answer = e.target.value;
                    setTest({ ...test, parts: updatedParts });
                  }}
                  className="border p-2 flex-1"
                />
                <select
                  value={question.input_type || "text"}
                  onChange={(e) => {
                    const updatedParts = [...test.parts];
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].questions[qIdx].input_type = e.target.value;
                    setTest({ ...test, parts: updatedParts });
                  }}
                  className="border p-2 ml-2"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const updatedParts = [...test.parts];
                    updatedParts[passageIndex].questions[groupIndex][
                      questionType
                    ][sectionIdx].questions.splice(qIdx, 1);
                    setTest({ ...test, parts: updatedParts });

                    // Recalculate question numbers to ensure sequential numbering
                    setTimeout(() => {
                      recalculateFillInTheBlanksQuestionNumbers(
                        passageIndex,
                        groupIndex,
                        test,
                        setTest
                      );
                    }, 0);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add new question button */}
            <button
              type="button"
              onClick={() => {
                const updatedParts = [...test.parts];
                const allQuestions =
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ];

                // Get the next question number across ALL sections
                const getNextQuestionNumber = () => {
                  let maxNumber = 0;
                  allQuestions.forEach((section: any) => {
                    if (section.questions && Array.isArray(section.questions)) {
                      section.questions.forEach((q: any) => {
                        if (
                          q.question_number &&
                          typeof q.question_number === "number"
                        ) {
                          maxNumber = Math.max(maxNumber, q.question_number);
                        }
                      });
                    }
                  });
                  return maxNumber + 1;
                };

                if (
                  !updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].questions
                ) {
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ][sectionIdx].questions = [];
                }

                updatedParts[passageIndex].questions[groupIndex][questionType][
                  sectionIdx
                ].questions.push({
                  question_number: getNextQuestionNumber(),
                  answer: "",
                  input_type: "text",
                });

                setTest({ ...test, parts: updatedParts });

                // Recalculate question numbers to ensure sequential numbering
                setTimeout(() => {
                  recalculateFillInTheBlanksQuestionNumbers(
                    passageIndex,
                    groupIndex,
                    test,
                    setTest
                  );
                }, 0);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Add Answer
            </button>
          </div>

          {/* Remove section button - only show for sections after the first one */}
          {sectionIdx > 0 && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  const updatedParts = [...test.parts];
                  updatedParts[passageIndex].questions[groupIndex][
                    questionType
                  ].splice(sectionIdx, 1);
                  setTest({ ...test, parts: updatedParts });

                  // Recalculate question numbers to ensure sequential numbering
                  setTimeout(() => {
                    recalculateFillInTheBlanksQuestionNumbers(
                      passageIndex,
                      groupIndex,
                      test,
                      setTest
                    );
                  }, 0);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                Remove This Section
              </button>
            </div>
          )}
          <button
            onClick={() => removeQuestion(sectionIdx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this section"
          >
            ×
          </button>
        </div>
      ));

    case "summary_fill_in_the_blanks":
      return questions.map((q, idx) => (
        <div key={idx}>
          {/* Passage input - update both local state and test object */}
          <div className="mb-2">
            <textarea
              placeholder="Enter Passage for summary fill-in-the-blanks"
              value={q.passage || ""} // Use value from test object, not local state
              onChange={(e) => {
                const newPassage = e.target.value;
                // Update the test object directly
                updateQuestion("passage", newPassage, idx);

                // Also update local state for blank detection
                setSummaryPassage(newPassage);
                const extractedBlanks = getBlanksFromTextForSummary(newPassage);
                setBlanks(extractedBlanks);
              }}
              className="border p-2 mb-2 w-full"
              rows={6}
            />
          </div>

          {/* Dynamically render dropdowns for each blank */}
          <div className="mb-2">
            {blanks.map((blank: any, blankIdx: any) => (
              <div key={blank}>
                <label>{`Select answer for blank ${blank}:`}</label>
                <select
                  value={q.answers?.[blankIdx] || ""} // Use value from test object
                  onChange={(e) => {
                    const updatedAnswers = [...(q.answers || [])];
                    updatedAnswers[blankIdx] = e.target.value;
                    updateQuestion("answers", updatedAnswers, idx);
                    setAnswers(updatedAnswers); // Keep local state in sync
                  }}
                  className="border p-2 mb-2"
                >
                  <option value="">Select an option</option>
                  {(q.options || []).map((option: any) => (
                    <option key={option.label} value={option.label}>
                      {option.label}: {option.value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          <button
            type="button"
            onClick={() => {
              const label = String.fromCharCode(65 + (q.options?.length || 0));
              const newOption = { label, value: "" };
              const updatedOptions = [...(q.options || []), newOption];
              updateQuestion("options", updatedOptions, idx);
              setOptions(updatedOptions); // Keep local state in sync
            }}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Option
          </button>

          {/* Render Inputs for Options */}
          {(q.options || []).map((option: any, optIdx: any) => (
            <div key={optIdx} className="mb-2">
              <input
                type="text"
                placeholder={`Option Value ${option.label}`}
                value={option.value}
                onChange={(e) => {
                  const updatedOptions = [...(q.options || [])];
                  updatedOptions[optIdx] = {
                    ...updatedOptions[optIdx],
                    value: e.target.value,
                  };
                  updateQuestion("options", updatedOptions, idx);
                  setOptions(updatedOptions); // Keep local state in sync
                }}
                className="border p-2 mb-2 w-full"
              />
            </div>
          ))}
          <button
            onClick={() => removeQuestion(idx)}
            className="bg-red-500 text-white p-2 rounded text-sm"
            title="Remove this question"
          >
            ×
          </button>
        </div>
      ));

    default:
      return null;
  }
};

const getBlanksFromText = (text: string, questionNumbers?: number[]) => {
  const regex = /__________/g;
  const matches = [...text.matchAll(regex)];

  return matches.map((match, index) => ({
    blank_number: questionNumbers ? questionNumbers[index] : index + 1,
    input_type: "text",
    answer: "",
  }));
};

const recalculateFillInTheBlanksQuestionNumbers = (
  passageIndex: number,
  groupIndex: number,
  test: any,
  setTest: any
) => {
  const updatedParts = [...test.parts];
  const questionType = "fill_in_the_blanks_with_subtitle";
  const sections =
    updatedParts[passageIndex].questions[groupIndex][questionType];

  if (sections && Array.isArray(sections)) {
    let questionCounter = 1;
    sections.forEach((section: any) => {
      if (section.questions && Array.isArray(section.questions)) {
        section.questions.forEach((q: any) => {
          q.question_number = questionCounter++;
        });
      }
    });
    setTest({ ...test, parts: updatedParts });
  }
};

const getBlanksFromTextForSummary = (text: string) => {
  const regex = /__________/g; // Match all occurrences of "__________"
  const matches = [...text.matchAll(regex)];
  return matches.map((match, index) => index + 1); // Return blank numbers (e.g., 1, 2, 3...)
};
