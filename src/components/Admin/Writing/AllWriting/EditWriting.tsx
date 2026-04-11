import React, { useEffect, useState } from "react";
import Loader from '@/components/Common/Loader';

const EditWriting = ({
  formData,
  handleInputChange,
  removePart,
  handlePartChange,
  addArrayItem,
  handleArrayChange,
  removeArrayItem,
  error,
  addPart,
  setShowEditModal,
  isSaving,
  handleSave,
}: any) => {
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
      <div className="modal-box w-11/12 max-w-5xl h-5/6 overflow-y-auto">
          <h3 className="font-bold text-xl mb-4">Edit Writing Test</h3>

          {/* Test Level Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="label">
                <span className="label-text">Test Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Test Type</span>
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Academic">Academic</option>
                <option value="General">General Training</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Duration (minutes)</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Parts Section */}
          <div className="divider">Parts</div>

          <div className="space-y-6">
            {formData.parts.map((part: any, partIndex: number) => (
              <div
                key={partIndex}
                className="border rounded-lg p-4 bg-base-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">
                    Part {partIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removePart(partIndex)}
                    className="btn btn-sm btn-error"
                    disabled={formData.parts.length <= 1}
                  >
                    Remove Part
                  </button>
                </div>

                {/* Part Fields */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="label">
                      <span className="label-text">Part Title</span>
                    </label>
                    <input
                      type="text"
                      value={part.title || ""}
                      onChange={(e) =>
                        handlePartChange(partIndex, "title", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Part Subtitle</span>
                    </label>
                    <input
                      type="text"
                      value={part.subtitle || ""}
                      onChange={(e) =>
                        handlePartChange(partIndex, "subtitle", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Image URL</span>
                    </label>
                    <input
                      type="text"
                      value={part.image || ""}
                      onChange={(e) =>
                        handlePartChange(partIndex, "image", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Questions</h5>
                    <button
                      type="button"
                      onClick={() => addArrayItem(partIndex, "Question")}
                      className="btn btn-sm btn-primary"
                    >
                      + Add Question
                    </button>
                  </div>

                  {(part.Question || []).map((question: string, qIndex: number) => (
                    <div key={qIndex} className="flex items-start gap-2 mb-2">
                      <textarea
                        value={question || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            partIndex,
                            "Question",
                            qIndex,
                            e.target.value
                          )
                        }
                        className="textarea textarea-bordered flex-grow"
                        rows={2}
                        placeholder="Question paragraph"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem(partIndex, "Question", qIndex)
                        }
                        className="btn btn-sm btn-error mt-1"
                        disabled={(part.Question || []).length <= 1}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Instructions Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Instructions</h5>
                    <button
                      type="button"
                      onClick={() => addArrayItem(partIndex, "instruction")}
                      className="btn btn-sm btn-primary"
                    >
                      + Add Instruction
                    </button>
                  </div>

                  {(part.instruction || []).map(
                    (instruction: string, iIndex: number) => (
                      <div key={iIndex} className="flex items-start gap-2 mb-2">
                        <textarea
                          value={instruction || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              partIndex,
                              "instruction",
                              iIndex,
                              e.target.value
                            )
                          }
                          className="textarea textarea-bordered flex-grow"
                          rows={2}
                          placeholder="Instruction text"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(partIndex, "instruction", iIndex)
                          }
                          className="btn btn-sm btn-error mt-1"
                          disabled={(part.instruction || []).length <= 1}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            <button type="button" onClick={addPart} className="btn btn-primary">
              + Add New Part
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-action mt-4">
            <button
              className="btn btn-ghost"
              onClick={() => setShowEditModal(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  Saving...
                  <Loader message="" className="!w-4 !h-4 !border-2 ml-2" />
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
    </div>
  );
};

export default EditWriting;
