import React, { useState } from "react";
import AudioUploader from "../../Common/AudioUploader";
import ImageUploader from "../../Common/ImageUploader";

const EditListening = ({
  editedTest,
  setEditedTest,
  setShowEditModal,
  saveChanges,
}: any) => {
  const [instructionModal, setInstructionModal] = useState<{
    partIndex: number;
    groupIndex: number;
    isOpen: boolean;
  } | null>(null);

  const handleAudioUploaded = (audioUrl: string, publicId: string) => {
    setEditedTest((prev: any) => ({
      ...prev,
      audioUrl: audioUrl,
      cloudinaryPublicId: publicId
    }));
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
        <h3 className="font-bold text-xl mb-6">Edit Listening Test</h3>

        {/* Test Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Test Title</span>
            </label>
            <input
              type="text"
              value={editedTest.title}
              onChange={(e) =>
                setEditedTest({ ...editedTest, title: e.target.value })
              }
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              value={editedTest.type}
              onChange={(e) =>
                setEditedTest({ ...editedTest, type: e.target.value })
              }
              className="select select-bordered"
            >
              <option value="general">General</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (minutes)</span>
            </label>
            <input
              type="number"
              value={editedTest.duration}
              onChange={(e) =>
                setEditedTest({
                  ...editedTest,
                  duration: parseInt(e.target.value),
                })
              }
              className="input input-bordered"
            />
          </div>
        </div>

        {/* Audio Upload Section */}
        <div className="mb-8">
          <AudioUploader 
            onAudioUploaded={handleAudioUploaded}
            label="Upload New Audio File (Optional)"
          />
          
          {/* Display current audio info */}
          {editedTest.audioUrl && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-11.314a5 5 0 00-1.414 1.414" />
                </svg>
                <span className="text-blue-800 font-medium">Current Audio File</span>
              </div>
              <div className="mt-2 text-sm text-blue-700">
                <p>Audio URL: {editedTest.audioUrl.substring(0, 50)}...</p>
                {editedTest.audioDuration && (
                  <p>Duration: {Math.round(editedTest.audioDuration / 60)} minutes {editedTest.audioDuration % 60} seconds</p>
                )}
                {editedTest.audioFormat && (
                  <p>Format: {editedTest.audioFormat.toUpperCase()}</p>
                )}
                {editedTest.audioSize && (
                  <p>Size: {(editedTest.audioSize / 1024 / 1024).toFixed(2)} MB</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Parts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Parts</h4>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setEditedTest({
                  ...editedTest,
                  parts: [
                    ...editedTest.parts,
                    {
                      title: `Part ${editedTest.parts.length + 1}`,
                      questions: [],
                    },
                  ],
                });
              }}
            >
              Add Part
            </button>
          </div>

          {editedTest.parts.map((part: any, partIndex: number) => (
            <div
              key={partIndex}
              className="collapse collapse-arrow bg-base-200 mb-4"
            >
              <input type="checkbox" defaultChecked={partIndex === 0} />
              <div className="collapse-title text-xl font-medium">
                <input
                  type="text"
                  value={part.title}
                  onChange={(e) => {
                    const newParts = [...editedTest.parts];
                    newParts[partIndex].title = e.target.value;
                    setEditedTest({ ...editedTest, parts: newParts });
                  }}
                  className="input input-sm w-full max-w-xs bg-transparent border-none"
                />
              </div>
              <div className="collapse-content">
                {/* Question Groups */}
                <div className="ml-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium">Question Groups</h5>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({
                            fill_in_the_blanks_with_subtitle: [],
                          });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add Fill Blanks
                      </button>
                      <button
                        className="btn btn-xs btn-secondary"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({ 
                            instruction: "",
                            mcq: [] 
                          });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add MCQ
                      </button>
                      <button
                        className="btn btn-xs btn-accent"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({ 
                            map: [{
                              title: '',
                              image: '',
                              instructions: '',
                              labels: ['A', 'B', 'C'],
                              questions: []
                            }]
                          });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add Map
                      </button>
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({ 
                            instruction: "",
                            multiple_mcq: [] 
                          });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add Multiple MCQ
                      </button>
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({ 
                            instruction: "",
                            box_matching: [] 
                          });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add Box Matching
                      </button>
                    </div>
                  </div>

                  {part.questions.map(
                    (questionGroup: any, groupIndex: number) => {
                      // Get question type (skip 'instruction' field)
                      const questionType = Object.keys(questionGroup).find(
                        (key) => key !== "instruction" && key !== "questions"
                      ) || (questionGroup.questions ? "questions" : Object.keys(questionGroup)[0]);
                      const questions = questionGroup[questionType] || questionGroup.questions || [];
                      const instruction = questionGroup.instruction || "";

                      // Check if this question type supports instructions
                      const supportsInstruction = ["mcq", "multiple_mcq", "box_matching", "questions", "fill_in_the_blanks_with_subtitle"].includes(questionType);

                      return (
                        <div
                          key={groupIndex}
                          className="mb-6 p-4 bg-base-100 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="badge badge-info capitalize">
                                {questionType.replace(/_/g, " ")}
                              </span>
                              {supportsInstruction && (
                                <button
                                  className="btn btn-xs btn-info"
                                  onClick={() => {
                                    setInstructionModal({
                                      partIndex,
                                      groupIndex,
                                      isOpen: true,
                                    });
                                  }}
                                >
                                  Instruction
                                </button>
                              )}
                            </div>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => {
                                const newParts = [...editedTest.parts];
                                newParts[partIndex].questions.splice(
                                  groupIndex,
                                  1
                                );
                                setEditedTest({
                                  ...editedTest,
                                  parts: newParts,
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>

                          {/* Fill in the blanks editor */}
                          {questionType ===
                            "fill_in_the_blanks_with_subtitle" && (
                            <div className="space-y-6">
                              {/* Instructions for Fill Blanks Group */}
                              {supportsInstruction && (
                                <div className="form-control mb-4">
                                  <label className="label">
                                    <span className="label-text font-semibold">
                                      Instructions
                                    </span>
                                  </label>
                                  <textarea
                                    className="textarea textarea-bordered"
                                    value={instruction}
                                    onChange={(e) => {
                                      const newParts = [...editedTest.parts];
                                      const questionGroup =
                                        newParts[partIndex].questions[groupIndex];
                                      newParts[partIndex].questions[groupIndex] = {
                                        ...questionGroup,
                                        instruction: e.target.value,
                                      };
                                      setEditedTest({ ...editedTest, parts: newParts });
                                    }}
                                    placeholder="Enter instructions for this question group..."
                                    rows={2}
                                  />
                                </div>
                              )}
                              {questions.map((item: any, itemIndex: number) => (
                                <div
                                  key={itemIndex}
                                  className="border rounded-lg p-4 bg-base-100"
                                >
                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">Title</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title || ""}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][itemIndex].title =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered w-full"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Subtitle
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.subtitle || ""}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][itemIndex].subtitle =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered w-full"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Content with Blanks
                                      </span>
                                    </label>
                                    <div className="space-y-2">
                                      {(item.extra || []).map((text: string, textIndex: number) => (
                                        <textarea
                                          key={textIndex}
                                          value={text}
                                          onChange={(e) => {
                                            const newParts = [...editedTest.parts];
                                            const newExtra = [...(item.extra || [])];
                                            newExtra[textIndex] = e.target.value;
                                            newParts[partIndex].questions[
                                              groupIndex
                                            ][questionType][itemIndex].extra =
                                              newExtra;
                                            setEditedTest({
                                              ...editedTest,
                                              parts: newParts,
                                            });
                                          }}
                                          className="textarea textarea-bordered w-full"
                                        />
                                      ))}
                                    </div>
                                    <button
                                      className="btn btn-xs btn-outline mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        const currentExtra = item.extra || [];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][itemIndex].extra = [
                                          ...currentExtra,
                                          "",
                                        ];
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      + Add Content Line
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    <h6 className="font-medium mb-2">
                                      Questions
                                    </h6>
                                    {(item.questions || []).map(
                                      (q: any, qIndex: number) => (
                                        <div
                                          key={qIndex}
                                          className="flex items-center gap-2 p-3 bg-base-200 rounded-lg"
                                        >
                                          <span className="badge badge-neutral">
                                            Q{q.question_number}
                                          </span>
                                          <div className="flex-1">
                                            <label className="label">
                                              <span className="label-text">Answer</span>
                                            </label>
                                            <input
                                              type="text"
                                              value={q.answer || ""}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  itemIndex
                                                ].questions[qIndex].answer =
                                                  e.target.value;
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="input input-bordered w-full"
                                            />
                                          </div>
                                          <div className="w-40">
                                            <label className="label">
                                              <span className="label-text">Input Type</span>
                                            </label>
                                            <select
                                              value={q.input_type || "text"}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  itemIndex
                                                ].questions[qIndex].input_type =
                                                  e.target.value;
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="select select-bordered w-full"
                                            >
                                              <option value="text">Text</option>
                                              <option value="number">Number</option>
                                            </select>
                                          </div>
                                          <button
                                            className="btn btn-xs btn-error mt-6"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                itemIndex
                                              ].questions.splice(qIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        const currentQuestions = item.questions || [];
                                        const newQuestion = {
                                          question_number:
                                            currentQuestions.length > 0
                                              ? Math.max(...currentQuestions.map((q: any) => q.question_number || 0)) + 1
                                              : 1,
                                          answer: "",
                                          input_type: "text",
                                        };
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          itemIndex
                                        ].questions = [
                                          ...currentQuestions,
                                          newQuestion,
                                        ];
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      + Add Question
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    title: "",
                                    subtitle: "",
                                    extra: [],
                                    questions: [],
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                + Add New Blank Section
                              </button>
                            </div>
                          )}

                          {/* MCQ Editor */}
                          {questionType === "mcq" && (
                            <div className="space-y-4">
                              {/* Instructions for MCQ Group */}
                              {supportsInstruction && (
                                <div className="form-control mb-4">
                                  <label className="label">
                                    <span className="label-text font-semibold">
                                      Instructions
                                    </span>
                                  </label>
                                  <textarea
                                    className="textarea textarea-bordered"
                                    value={instruction}
                                    onChange={(e) => {
                                      const newParts = [...editedTest.parts];
                                      const questionGroup =
                                        newParts[partIndex].questions[groupIndex];
                                      newParts[partIndex].questions[groupIndex] = {
                                        ...questionGroup,
                                        instruction: e.target.value,
                                      };
                                      setEditedTest({ ...editedTest, parts: newParts });
                                    }}
                                    placeholder="Enter instructions for this question group..."
                                    rows={2}
                                  />
                                </div>
                              )}
                              {questions.map((mcq: any, mcqIndex: number) => (
                                <div
                                  key={mcqIndex}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Question Number
                                      </span>
                                    </label>
                                    <input
                                      type="number"
                                      value={mcq.question_number}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          mcqIndex
                                        ].question_number = parseInt(
                                          e.target.value
                                        );
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered input-sm"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Question Text
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={mcq.question}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].question =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Correct Answer
                                      </span>
                                    </label>
                                    <select
                                      value={mcq.answer}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].answer =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="select select-bordered"
                                    >
                                      {mcq.options.map((opt: any) => (
                                        <option
                                          key={opt.label}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Options
                                    </h6>
                                    {mcq.options.map(
                                      (option: any, optIndex: number) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-3 mb-2"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Label"
                                            value={option.label}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][mcqIndex].options[
                                                optIndex
                                              ].label = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm w-16"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Value"
                                            value={option.value}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][mcqIndex].options[
                                                optIndex
                                              ].value = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm"
                                          />
                                          <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                mcqIndex
                                              ].options.splice(optIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].options.push({
                                          label: "New",
                                          value: "new",
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Option
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    question_number: questions.length + 1,
                                    question: "",
                                    answer: "A",
                                    options: [
                                      { label: "A", value: "a" },
                                      { label: "B", value: "b" },
                                    ],
                                    input_type: "radio",
                                    min_selection: 1,
                                    max_selection: 1,
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New MCQ
                              </button>
                            </div>
                          )}

                          {/* Map Editor */}
                          {questionType === "map" && (
                            <div className="space-y-4">
                              {questions.map((map: any, mapIndex: number) => (
                                <div
                                  key={mapIndex}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">Title</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={map.title}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].title =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">Instructions</span>
                                    </label>
                                    <textarea
                                      value={map.instructions || ""}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].instructions =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="textarea textarea-bordered"
                                      placeholder="Enter instructions for the map (e.g., 'Label the map below. Write the correct letter, A–H, next to Questions 16–20')"
                                      rows={3}
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Upload Map Image
                                      </span>
                                    </label>
                                    <ImageUploader
                                      onUploaded={(url) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].image = url;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    />
                                    {/* Show current image if exists */}
                                    {map.image && (
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                        <img 
                                          src={map.image} 
                                          alt="Map preview" 
                                          className="w-48 h-32 object-cover border rounded"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Labels (comma separated)
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={map.labels.join(", ")}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].labels =
                                          e.target.value
                                            .split(",")
                                            .map((l: string) => l.trim());
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Questions
                                    </h6>
                                    {map.questions.map(
                                      (q: any, qIndex: number) => (
                                        <div
                                          key={qIndex}
                                          className="border rounded p-3 mb-3"
                                        >
                                          <div className="form-control mb-2">
                                            <label className="label">
                                              <span className="label-text">
                                                Question Number
                                              </span>
                                            </label>
                                            <input
                                              type="number"
                                              value={q.question_number}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  mapIndex
                                                ].questions[
                                                  qIndex
                                                ].question_number = parseInt(
                                                  e.target.value
                                                );
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="input input-bordered input-sm"
                                            />
                                          </div>

                                          <div className="form-control mb-2">
                                            <label className="label">
                                              <span className="label-text">
                                                Question Text
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              value={q.question}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  mapIndex
                                                ].questions[qIndex].question =
                                                  e.target.value;
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="input input-bordered input-sm"
                                            />
                                          </div>

                                          <div className="form-control mb-2">
                                            <label className="label">
                                              <span className="label-text">
                                                Correct Answer
                                              </span>
                                            </label>
                                            <select
                                              value={q.answer}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  mapIndex
                                                ].questions[qIndex].answer =
                                                  e.target.value;
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="select select-bordered select-sm"
                                            >
                                              {map.labels.map(
                                                (label: string) => (
                                                  <option
                                                    key={label}
                                                    value={label}
                                                  >
                                                    {label}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          mapIndex
                                        ].questions.push({
                                          question_number:
                                            map.questions.length + 1,
                                          question: "",
                                          answer: map.labels[0] || "",
                                          input_type: "radio",
                                          min_selection: 1,
                                          max_selection: 1,
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Map Question
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    title: "",
                                    image: "",
                                    labels: ["A", "B", "C"],
                                    questions: [],
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New Map
                              </button>
                            </div>
                          )}

                          {/* Multiple MCQ Editor */}
                          {questionType === "multiple_mcq" && (
                            <div className="space-y-4">
                              {/* Instructions for Multiple MCQ Group */}
                              {supportsInstruction && (
                                <div className="form-control mb-4">
                                  <label className="label">
                                    <span className="label-text font-semibold">
                                      Instructions
                                    </span>
                                  </label>
                                  <textarea
                                    className="textarea textarea-bordered"
                                    value={instruction}
                                    onChange={(e) => {
                                      const newParts = [...editedTest.parts];
                                      const questionGroup =
                                        newParts[partIndex].questions[groupIndex];
                                      newParts[partIndex].questions[groupIndex] = {
                                        ...questionGroup,
                                        instruction: e.target.value,
                                      };
                                      setEditedTest({ ...editedTest, parts: newParts });
                                    }}
                                    placeholder="Enter instructions for this question group..."
                                    rows={2}
                                  />
                                </div>
                              )}
                              {questions.map((multipleMcq: any, mcqIndex: number) => (
                                <div
                                  key={mcqIndex}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Question Numbers (comma separated)
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={multipleMcq.question_numbers.join(", ")}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].question_numbers =
                                          e.target.value
                                            .split(",")
                                            .map((num: string) => parseInt(num.trim()));
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Question Text
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={multipleMcq.question}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].question =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="form-control">
                                      <label className="label">
                                        <span className="label-text">
                                          Min Selection
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        value={multipleMcq.min_selection}
                                        onChange={(e) => {
                                          const newParts = [...editedTest.parts];
                                          newParts[partIndex].questions[
                                            groupIndex
                                          ][questionType][mcqIndex].min_selection =
                                            parseInt(e.target.value);
                                          setEditedTest({
                                            ...editedTest,
                                            parts: newParts,
                                          });
                                        }}
                                        className="input input-bordered input-sm"
                                      />
                                    </div>

                                    <div className="form-control">
                                      <label className="label">
                                        <span className="label-text">
                                          Max Selection
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        value={multipleMcq.max_selection}
                                        onChange={(e) => {
                                          const newParts = [...editedTest.parts];
                                          newParts[partIndex].questions[
                                            groupIndex
                                          ][questionType][mcqIndex].max_selection =
                                            parseInt(e.target.value);
                                          setEditedTest({
                                            ...editedTest,
                                            parts: newParts,
                                          });
                                        }}
                                        className="input input-bordered input-sm"
                                      />
                                    </div>
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Correct Mapping (comma separated)
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={multipleMcq.correct_mapping.join(", ")}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].correct_mapping =
                                          e.target.value
                                            .split(",")
                                            .map((val: string) => val.trim());
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Options
                                    </h6>
                                    {multipleMcq.options.map(
                                      (option: any, optIndex: number) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-3 mb-2"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Label"
                                            value={option.label}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][mcqIndex].options[
                                                optIndex
                                              ].label = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm w-16"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Value"
                                            value={option.value}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][mcqIndex].options[
                                                optIndex
                                              ].value = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm"
                                          />
                                          <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                mcqIndex
                                              ].options.splice(optIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].options.push({
                                          label: "New",
                                          value: "new",
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Option
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    question_numbers: [1, 2],
                                    question: "",
                                    options: [
                                      { label: "A", value: "a" },
                                      { label: "B", value: "b" },
                                      { label: "C", value: "c" },
                                    ],
                                    input_type: "checkbox",
                                    min_selection: 2,
                                    max_selection: 2,
                                    correct_mapping: ["A", "B"],
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New Multiple MCQ
                              </button>
                            </div>
                          )}

                          {/* Box Matching Editor */}
                          {questionType === "box_matching" && (
                            <div className="space-y-4">
                              {/* Instructions for Box Matching Group */}
                              {supportsInstruction && (
                                <div className="form-control mb-4">
                                  <label className="label">
                                    <span className="label-text font-semibold">
                                      Instructions
                                    </span>
                                  </label>
                                  <textarea
                                    className="textarea textarea-bordered"
                                    value={instruction}
                                    onChange={(e) => {
                                      const newParts = [...editedTest.parts];
                                      const questionGroup =
                                        newParts[partIndex].questions[groupIndex];
                                      newParts[partIndex].questions[groupIndex] = {
                                        ...questionGroup,
                                        instruction: e.target.value,
                                      };
                                      setEditedTest({ ...editedTest, parts: newParts });
                                    }}
                                    placeholder="Enter instructions for this question group..."
                                    rows={2}
                                  />
                                </div>
                              )}
                              {questions.map((boxMatch: any, boxIndex: number) => (
                                <div
                                  key={boxIndex}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="form-control">
                                      <label className="label">
                                        <span className="label-text">
                                          Options Title
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={boxMatch.options_title || ""}
                                        onChange={(e) => {
                                          const newParts = [...editedTest.parts];
                                          newParts[partIndex].questions[
                                            groupIndex
                                          ][questionType][boxIndex].options_title =
                                            e.target.value;
                                          setEditedTest({
                                            ...editedTest,
                                            parts: newParts,
                                          });
                                        }}
                                        className="input input-bordered input-sm"
                                      />
                                    </div>

                                    <div className="form-control">
                                      <label className="label">
                                        <span className="label-text">
                                          Question Title
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        value={boxMatch.question_title || ""}
                                        onChange={(e) => {
                                          const newParts = [...editedTest.parts];
                                          newParts[partIndex].questions[
                                            groupIndex
                                          ][questionType][boxIndex].question_title =
                                            e.target.value;
                                          setEditedTest({
                                            ...editedTest,
                                            parts: newParts,
                                          });
                                        }}
                                        className="input input-bordered input-sm"
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Box Options
                                    </h6>
                                    {boxMatch.options.map(
                                      (option: any, optIndex: number) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-3 mb-2"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Label"
                                            value={option.label}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][boxIndex].options[
                                                optIndex
                                              ].label = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm w-16"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Value"
                                            value={option.value}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][boxIndex].options[
                                                optIndex
                                              ].value = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm"
                                          />
                                          <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                boxIndex
                                              ].options.splice(optIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        const newLabel = String.fromCharCode(65 + boxMatch.options.length);
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][boxIndex].options.push({
                                          label: newLabel,
                                          value: "",
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Option
                                    </button>
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Questions to Match
                                    </h6>
                                    {boxMatch.questions.map(
                                      (q: any, qIndex: number) => (
                                        <div
                                          key={qIndex}
                                          className="border rounded p-3 mb-3"
                                        >
                                          <div className="grid grid-cols-3 gap-3">
                                            <div className="form-control">
                                              <label className="label">
                                                <span className="label-text">
                                                  Question Number
                                                </span>
                                              </label>
                                              <input
                                                type="number"
                                                value={q.question_number}
                                                onChange={(e) => {
                                                  const newParts = [
                                                    ...editedTest.parts,
                                                  ];
                                                  newParts[partIndex].questions[
                                                    groupIndex
                                                  ][questionType][
                                                    boxIndex
                                                  ].questions[
                                                    qIndex
                                                  ].question_number = parseInt(
                                                    e.target.value
                                                  );
                                                  setEditedTest({
                                                    ...editedTest,
                                                    parts: newParts,
                                                  });
                                                }}
                                                className="input input-bordered input-sm"
                                              />
                                            </div>

                                            <div className="form-control">
                                              <label className="label">
                                                <span className="label-text">
                                                  Topic
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                value={q.topic}
                                                onChange={(e) => {
                                                  const newParts = [
                                                    ...editedTest.parts,
                                                  ];
                                                  newParts[partIndex].questions[
                                                    groupIndex
                                                  ][questionType][
                                                    boxIndex
                                                  ].questions[qIndex].topic =
                                                    e.target.value;
                                                  setEditedTest({
                                                    ...editedTest,
                                                    parts: newParts,
                                                  });
                                                }}
                                                className="input input-bordered input-sm"
                                              />
                                            </div>

                                            <div className="form-control">
                                              <label className="label">
                                                <span className="label-text">
                                                  Correct Answer
                                                </span>
                                              </label>
                                              <select
                                                value={q.answer}
                                                onChange={(e) => {
                                                  const newParts = [
                                                    ...editedTest.parts,
                                                  ];
                                                  newParts[partIndex].questions[
                                                    groupIndex
                                                  ][questionType][
                                                    boxIndex
                                                  ].questions[qIndex].answer =
                                                    e.target.value;
                                                  setEditedTest({
                                                    ...editedTest,
                                                    parts: newParts,
                                                  });
                                                }}
                                                className="select select-bordered select-sm"
                                              >
                                                <option value="">Select</option>
                                                {boxMatch.options.map(
                                                  (option: any) => (
                                                    <option
                                                      key={option.label}
                                                      value={option.label}
                                                    >
                                                      {option.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          </div>

                                          <button
                                            className="btn btn-xs btn-error mt-2"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                boxIndex
                                              ].questions.splice(qIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove Question
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          boxIndex
                                        ].questions.push({
                                          question_number:
                                            boxMatch.questions.length + 1,
                                          topic: "",
                                          answer: "",
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Question
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    instructions: "",
                                    options_title: "",
                                    question_title: "",
                                    options: [
                                      { label: "A", value: "" },
                                      { label: "B", value: "" },
                                      { label: "C", value: "" },
                                      { label: "D", value: "" },
                                    ],
                                    questions: [
                                      { question_number: 1, topic: "", answer: "" },
                                      { question_number: 2, topic: "", answer: "" },
                                    ],
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New Box Matching
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              saveChanges();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Instruction Modal */}
      {instructionModal && instructionModal.isOpen && (
        <div
          className="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setInstructionModal(null);
            }
          }}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Instructions</h3>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={
                editedTest.parts[instructionModal.partIndex]?.questions[
                  instructionModal.groupIndex
                ]?.instruction || ""
              }
              onChange={(e) => {
                const newParts = [...editedTest.parts];
                const questionGroup =
                  newParts[instructionModal.partIndex].questions[
                    instructionModal.groupIndex
                  ];
                newParts[instructionModal.partIndex].questions[
                  instructionModal.groupIndex
                ] = {
                  ...questionGroup,
                  instruction: e.target.value,
                };
                setEditedTest({ ...editedTest, parts: newParts });
              }}
              placeholder="Enter instructions for this question group..."
            />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setInstructionModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditListening;
