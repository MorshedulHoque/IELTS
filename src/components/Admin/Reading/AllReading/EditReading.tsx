import React from "react";
import { RenderReadingQuestionFields } from "./RenderReadingQuestionFields";

const EditReading = ({
  editedTest,
  handleTestFieldChange,
  handlePartFieldChange,
  handlePassageParagraphChange,
  handleQuestionGroupFieldChange,
  handleQuestionChange,
  setShowEditModal,
  saveChanges,
}: any) => {
  const formatQuestionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper to get question number
  const getQuestionNumber = (question: any) => {
    if (question.question_number) return question.question_number;
    if (question.question_numbers) return question.question_numbers.join("-");
    return null;
  };

  return (
    <div 
      className="modal modal-open"
      onClick={(e) => {
        // Close modal when clicking on the backdrop (outside the modal-box)
        if (e.target === e.currentTarget) {
          setShowEditModal(false);
        }
      }}
    >
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-2xl mb-4">Edit Reading Test</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Test Title</span>
            </label>
            <input
              type="text"
              value={editedTest.title || ""} // ✅ Use editedTest and value
              onChange={(e) => handleTestFieldChange("title", e.target.value)} // ✅ Add onChange
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (minutes)</span>
            </label>
            <input
              type="number"
              value={editedTest.duration || ""} // ✅ Use editedTest
              onChange={(e) =>
                handleTestFieldChange("duration", parseInt(e.target.value))
              }
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="label">
            <span className="label-text">Test Type</span>
          </label>
          <div className="flex space-x-4">
            <label className="cursor-pointer label">
              <input
                type="radio"
                name="type"
                checked={editedTest.type === "academic"} // ✅ Use checked instead of defaultChecked
                onChange={() => handleTestFieldChange("type", "academic")}
                className="radio radio-primary"
              />
              <span className="label-text ml-2">Academic</span>
            </label>
            <label className="cursor-pointer label">
              <input
                type="radio"
                name="type"
                checked={editedTest.type === "general"} // ✅ Use checked
                onChange={() => handleTestFieldChange("type", "general")}
                className="radio radio-primary"
              />
              <span className="label-text ml-2">General</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Passages</h4>
          <div className="space-y-4">
            {editedTest.parts.map(
              (
                part: any,
                partIndex: any // ✅ Use editedTest.parts
              ) => (
                <div
                  key={partIndex}
                  className="collapse collapse-arrow bg-base-200 border border-base-300"
                >
                  <input type="checkbox" defaultChecked />
                  <div className="collapse-title font-medium">
                    Passage {partIndex + 1}: {part.passage_title || "Untitled"}
                  </div>
                  <div className="collapse-content pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Passage Title</span>
                        </label>
                        <input
                          type="text"
                          value={part.passage_title || ""} // ✅ Use value
                          onChange={(e) =>
                            handlePartFieldChange(
                              partIndex,
                              "passage_title",
                              e.target.value
                            )
                          }
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Passage Subtitle</span>
                        </label>
                        <input
                          type="text"
                          value={part.passage_subtitle || ""}
                          onChange={(e) =>
                            handlePartFieldChange(
                              partIndex,
                              "passage_subtitle",
                              e.target.value
                            )
                          }
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Instructions</span>
                      </label>
                      <textarea
                        value={part.instructions || ""} // ✅ Use value
                        onChange={(e) =>
                          handlePartFieldChange(
                            partIndex,
                            "instructions",
                            e.target.value
                          )
                        }
                        className="textarea textarea-bordered h-24 w-full"
                      />
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Passage Content</span>
                      </label>
                      <div className="space-y-2">
                        {(() => {
                          
                          // Handle null/undefined passage
                          if (!part.passage) {
                            return <div className="text-red-500">No passage content found</div>;
                          }
                          
                          // Handle array format
                          if (Array.isArray(part.passage)) {
                            // Check if it's an array of objects (like [{A: "text1", B: "text2"}])
                            if (part.passage.length === 1 && typeof part.passage[0] === 'object' && !Array.isArray(part.passage[0])) {
                              // This is the object format wrapped in an array
                              const obj = part.passage[0];
                              return Object.keys(obj).map((key, paraIndex) => (
                                <div
                                  key={key}
                                  className="flex items-start gap-2"
                                >
                                  <span className="badge badge-neutral mt-1">
                                    {key}
                                  </span>
                                  <textarea
                                    value={String(obj[key] || "")}
                                    onChange={(e) =>
                                      handlePassageParagraphChange(
                                        partIndex,
                                        paraIndex,
                                        e.target.value
                                      )
                                    }
                                    className="textarea textarea-bordered w-full h-32"
                                  />
                                </div>
                              ));
                            } else {
                              // This is a regular array of strings
                              return part.passage.map((paragraph: any, paraIndex: any) => (
                                <div
                                  key={paraIndex}
                                  className="flex items-start gap-2"
                                >
                                  <span className="badge badge-neutral mt-1">
                                    {paraIndex + 1}
                                  </span>
                                  <textarea
                                    value={String(paragraph || "")}
                                    onChange={(e) =>
                                      handlePassageParagraphChange(
                                        partIndex,
                                        paraIndex,
                                        e.target.value
                                      )
                                    }
                                    className="textarea textarea-bordered w-full h-32"
                                  />
                                </div>
                              ));
                            }
                          }
                          
                          // Handle object format
                          if (part.passage && typeof part.passage === 'object' && !Array.isArray(part.passage)) {
                            const keys = Object.keys(part.passage);
                            return keys.map((key, paraIndex) => (
                              <div
                                key={key}
                                className="flex items-start gap-2"
                              >
                                <span className="badge badge-neutral mt-1">
                                  {key}
                                </span>
                                <textarea
                                  value={String(part.passage[key] || "")}
                                  onChange={(e) =>
                                    handlePassageParagraphChange(
                                      partIndex,
                                      paraIndex,
                                      e.target.value
                                    )
                                  }
                                  className="textarea textarea-bordered w-full h-32"
                                />
                              </div>
                            ));
                          }
                          
                          // Fallback for unexpected format
                          return (
                            <div className="text-red-500">
                              Unexpected passage format: {typeof part.passage}
                            </div>
                          );
                        })()}
                      </div>
                      <button className="btn btn-sm btn-outline mt-2">
                        + Add Paragraph
                      </button>
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Image URL</span>
                      </label>
                      <input
                        type="text"
                        value={part.image || ""} // ✅ Use value
                        onChange={(e) =>
                          handlePartFieldChange(
                            partIndex,
                            "image",
                            e.target.value
                          )
                        }
                        className="input input-bordered w-full"
                        placeholder="https://example.com/image.png"
                      />
                    </div>

                    {/* Questions section remains the same as your existing handleQuestionChange already works */}
                    <div className="mt-6">
                      <h5 className="text-md font-semibold mb-3">Questions</h5>
                      <div className="space-y-4">
                        {part.questions.map(
                          (questionGroup: any, groupIndex: any) => {
                            // Pick the first key that is not 'instructions'
                            const groupKeys = Object.keys(questionGroup).filter(
                              (k) => k !== "instructions"
                            );
                            const questionType = groupKeys[0];
                            const questions = questionGroup[questionType] || [];

                            return (
                              <div
                                key={groupIndex}
                                className="collapse collapse-arrow bg-base-100 border border-base-300"
                              >
                                <input type="checkbox" />
                                <div className="collapse-title font-medium">
                                  {formatQuestionType(questionType)} (
                                  {questions.length} questions)
                                </div>
                                <div className="collapse-content pt-4">
                                  {/* Group-level instructions editor */}
                                  {typeof questionGroup.instructions === 'string' && (
                                    <div className="form-control mb-4">
                                      <label className="label">
                                        <span className="label-text">Instructions</span>
                                      </label>
                                      <textarea
                                        value={questionGroup.instructions}
                                        onChange={(e) =>
                                          handleQuestionGroupFieldChange(
                                            partIndex,
                                            groupIndex,
                                            "instructions",
                                            e.target.value
                                          )
                                        }
                                        className="textarea textarea-bordered w-full"
                                      />
                                    </div>
                                  )}
                                  <div className="space-y-6">
                                    {questions.map(
                                      (question: any, qIndex: any) => (
                                        <div
                                          key={qIndex}
                                          className="border rounded-lg p-4 bg-base-100"
                                        >
                                          <div className="flex justify-between items-start mb-3">
                                            <div className="badge badge-primary">
                                              Question{" "}
                                              {getQuestionNumber(question) ||
                                                qIndex + 1}
                                            </div>
                                            <button className="btn btn-xs btn-error">
                                              Delete
                                            </button>
                                          </div>

                                          {/* Only show Question Text for question types that need it */}
                                          {questionType !== "fill_in_the_blanks_with_subtitle" && (
                                            <div className="form-control mb-3">
                                              <label className="label">
                                                <span className="label-text">
                                                  Question Text
                                                </span>
                                              </label>
                                              <textarea
                                                value={question.question || ""}
                                                onChange={(e) =>
                                                  handleQuestionChange(
                                                    partIndex,
                                                    groupIndex,
                                                    qIndex,
                                                    "question",
                                                    e.target.value
                                                  )
                                                }
                                                className="textarea textarea-bordered w-full"
                                              />
                                            </div>
                                          )}

                                          {RenderReadingQuestionFields(
                                            questionType,
                                            question,
                                            partIndex,
                                            groupIndex,
                                            qIndex,
                                            handleQuestionChange
                                          )}
                                        </div>
                                      )
                                    )}
                                    <button className="btn btn-sm btn-outline">
                                      + Add Question to this Type
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <button className="btn btn-outline mt-4">+ Add New Passage</button>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReading;
