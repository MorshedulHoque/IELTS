"use client";
import React from "react";

const EditSpeaking = ({
  editedTest,
  setEditedTest,
  setShowEditModal,
  saveChanges,
}: any) => {
  const testTypes = [
    { value: "part1", label: "Part 1" },
    { value: "part2", label: "Part 2" },
    { value: "part3", label: "Part 3" },
    { value: "full_test", label: "Full Test" },
  ];

  const difficulties = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const questionTypes = [
    { value: "personal", label: "Personal Question (Part 1)" },
    { value: "cue_card", label: "Cue Card (Part 2)" },
    { value: "discussion", label: "Discussion (Part 3)" },
  ];

  const handleQuestionChange = (
    qIndex: number,
    field: string,
    value: any
  ) => {
    const newTest = JSON.parse(JSON.stringify(editedTest));
    newTest.questions[qIndex][field] = value;
    
    // Recalculate total duration
    const totalDuration = newTest.questions.reduce(
      (sum: number, q: any) => sum + (q.speaking_time || 0) + (q.preparation_time || 0),
      0
    );
    newTest.total_duration = totalDuration;
    
    setEditedTest(newTest);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const newTest = JSON.parse(JSON.stringify(editedTest));
    newTest.questions.splice(qIndex, 1);
    
    // Renumber questions
    newTest.questions.forEach((q: any, index: number) => {
      q.question_number = index + 1;
    });
    
    // Recalculate total duration
    const totalDuration = newTest.questions.reduce(
      (sum: number, q: any) => sum + (q.speaking_time || 0) + (q.preparation_time || 0),
      0
    );
    newTest.total_duration = totalDuration;
    
    setEditedTest(newTest);
  };

  const handleAddQuestion = () => {
    const newTest = JSON.parse(JSON.stringify(editedTest));
    const newQuestion = {
      question_number: newTest.questions.length + 1,
      question: "",
      question_type: "personal",
      speaking_time: 2,
      instructions: "",
    };
    newTest.questions.push(newQuestion);
    setEditedTest(newTest);
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
        <h3 className="font-bold text-xl mb-6">Edit Speaking Test</h3>

        {/* Test Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Test Title</span>
            </label>
            <input
              type="text"
              value={editedTest.title || ""}
              onChange={(e) =>
                setEditedTest({ ...editedTest, title: e.target.value })
              }
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Test Type</span>
            </label>
            <select
              value={editedTest.type || ""}
              onChange={(e) =>
                setEditedTest({ ...editedTest, type: e.target.value })
              }
              className="select select-bordered"
            >
              {testTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Difficulty</span>
            </label>
            <select
              value={editedTest.difficulty || ""}
              onChange={(e) =>
                setEditedTest({ ...editedTest, difficulty: e.target.value })
              }
              className="select select-bordered"
            >
              {difficulties.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Total Duration (minutes)</span>
            </label>
            <input
              type="number"
              value={editedTest.total_duration || 0}
              disabled
              className="input input-bordered"
            />
          </div>
        </div>

        <div className="form-control mb-8">
          <label className="label">
            <span className="label-text">Description (Optional)</span>
          </label>
          <textarea
            value={editedTest.description || ""}
            onChange={(e) =>
              setEditedTest({ ...editedTest, description: e.target.value })
            }
            className="textarea textarea-bordered h-24"
            placeholder="Enter test description"
          />
        </div>

        {/* Questions Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Questions</h4>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAddQuestion}
            >
              + Add Question
            </button>
          </div>

          <div className="space-y-4">
            {editedTest.questions?.map((question: any, qIndex: number) => (
              <div
                key={qIndex}
                className="border rounded-lg p-4 bg-base-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="badge badge-info">
                    Question {question.question_number || qIndex + 1}
                  </span>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Question Type</span>
                    </label>
                    <select
                      value={question.question_type || ""}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "question_type", e.target.value)
                      }
                      className="select select-bordered"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Speaking Time (minutes)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={question.speaking_time || 2}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "speaking_time",
                          parseInt(e.target.value)
                        )
                      }
                      className="input input-bordered"
                    />
                  </div>
                </div>

                {question.question_type === "cue_card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Preparation Time (minutes)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        value={question.preparation_time || 1}
                        onChange={(e) =>
                          handleQuestionChange(
                            qIndex,
                            "preparation_time",
                            parseInt(e.target.value)
                          )
                        }
                        className="input input-bordered"
                      />
                    </div>
                  </div>
                )}

                <div className="form-control mb-3">
                  <label className="label">
                    <span className="label-text">Question</span>
                  </label>
                  <textarea
                    value={question.question || ""}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    className="textarea textarea-bordered"
                    rows={3}
                    placeholder="Enter the question"
                  />
                </div>

                <div className="form-control mb-3">
                  <label className="label">
                    <span className="label-text">Instructions (Optional)</span>
                  </label>
                  <textarea
                    value={question.instructions || ""}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "instructions", e.target.value)
                    }
                    className="textarea textarea-bordered"
                    rows={2}
                    placeholder="Enter instructions for this question"
                  />
                </div>

                {question.question_type === "cue_card" && question.cue_card && (
                  <div className="space-y-3 mb-3 p-3 bg-base-200 rounded">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Cue Card Title</span>
                      </label>
                      <input
                        type="text"
                        value={question.cue_card.title || ""}
                        onChange={(e) => {
                          const newTest = JSON.parse(JSON.stringify(editedTest));
                          if (!newTest.questions[qIndex].cue_card) {
                            newTest.questions[qIndex].cue_card = {};
                          }
                          newTest.questions[qIndex].cue_card.title = e.target.value;
                          setEditedTest(newTest);
                        }}
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Cue Card Points (one per line)</span>
                      </label>
                      <textarea
                        value={
                          Array.isArray(question.cue_card.points)
                            ? question.cue_card.points.join("\n")
                            : question.cue_card.points || ""
                        }
                        onChange={(e) => {
                          const newTest = JSON.parse(JSON.stringify(editedTest));
                          if (!newTest.questions[qIndex].cue_card) {
                            newTest.questions[qIndex].cue_card = {};
                          }
                          newTest.questions[qIndex].cue_card.points =
                            e.target.value.split("\n").filter((p: string) => p.trim());
                          setEditedTest(newTest);
                        }}
                        className="textarea textarea-bordered"
                        rows={4}
                        placeholder="Enter cue card points, one per line"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default EditSpeaking;

