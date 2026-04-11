import { useState, useEffect } from "react";
import { FillBlanksGroup } from "./listeningTest";

interface FillBlanksGroupFormProps {
  group: FillBlanksGroup;
  updateGroup: (group: FillBlanksGroup) => void;
}

const FillBlanksGroupForm = ({
  group,
  updateGroup,
}: FillBlanksGroupFormProps) => {
  const [localGroup, setLocalGroup] = useState<FillBlanksGroup>(group);

  useEffect(() => {
    setLocalGroup(group);
  }, [group]);

  const handleBlur = () => {
    updateGroup(localGroup);
  };

  const handleInstructionChange = (value: string) => {
    setLocalGroup((prev) => ({
      ...prev,
      instruction: value,
    }));
  };

  const handleSectionChange = (
    sectionIndex: number,
    field: string,
    value: string
  ) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [field]: value,
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const handleExtraChange = (
    sectionIndex: number,
    extraIndex: number,
    value: string
  ) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];
      const updatedExtra = [...updatedSections[sectionIndex].extra];
      updatedExtra[extraIndex] = value;
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        extra: updatedExtra,
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const handleQuestionChange = (
    sectionIndex: number,
    questionIndex: number,
    field: string,
    value: string
  ) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];
      const updatedQuestions = [...updatedSections[sectionIndex].questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: updatedQuestions,
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const addSection = () => {
    setLocalGroup((prev) => ({
      ...prev,
      fill_in_the_blanks_with_subtitle: [
        ...prev.fill_in_the_blanks_with_subtitle,
        {
          subtitle: "",
          extra: [],
          questions: [],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex: number) => {
    setLocalGroup((prev) => {
      const updatedSections = prev.fill_in_the_blanks_with_subtitle.filter(
        (_, index) => index !== sectionIndex
      );
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const addExtra = (sectionIndex: number) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        extra: [...updatedSections[sectionIndex].extra, ""],
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const removeExtra = (sectionIndex: number, extraIndex: number) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];
      const updatedExtra = updatedSections[sectionIndex].extra.filter(
        (_, index) => index !== extraIndex
      );
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        extra: updatedExtra,
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const addQuestion = (sectionIndex: number) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: [
          ...updatedSections[sectionIndex].questions,
          {
            question_number: 0, // Will be set globally by PartForm
            answer: "",
            input_type: "text",
          },
        ],
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    setLocalGroup((prev) => {
      const updatedSections = [...prev.fill_in_the_blanks_with_subtitle];
      const updatedQuestions = updatedSections[sectionIndex].questions.filter(
        (_, index) => index !== questionIndex
      );
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: updatedQuestions,
      };
      return { ...prev, fill_in_the_blanks_with_subtitle: updatedSections };
    });
  };

  return (
    <div className="space-y-6" onBlur={handleBlur}>
      {/* Instruction Field - Only one for the entire component */}
      <div className="bg-base-100 p-4 rounded-lg">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-black">
              Instruction
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered border-black h-24"
            value={localGroup.instruction || ""}
            onChange={(e) => handleInstructionChange(e.target.value)}
            placeholder="Enter instruction for the entire fill-in-the-blanks component (e.g., 'Fill in the blanks with the correct words from the audio')"
          />
        </div>
      </div>

      {localGroup.fill_in_the_blanks_with_subtitle.map(
        (section, sectionIndex) => (
          <div key={sectionIndex} className="bg-base-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium font-semibold">
                Section {sectionIndex + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeSection(sectionIndex)}
                className="btn btn-error btn-sm"
              >
                Remove Section
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {sectionIndex === 0 && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-black">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered border-black"
                    value={section.title || ""}
                    onChange={(e) =>
                      handleSectionChange(sectionIndex, "title", e.target.value)
                    }
                  />
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-black">
                    Subtitle
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered border-black"
                  value={section.subtitle || ""}
                  onChange={(e) =>
                    handleSectionChange(
                      sectionIndex,
                      "subtitle",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium font-semibold">Extra Information</h5>
                <button
                  type="button"
                  onClick={() => addExtra(sectionIndex)}
                  className="btn btn-primary btn-sm"
                >
                  Add Extra
                </button>
              </div>

              {section.extra.map((extra, extraIndex) => (
                <div key={extraIndex} className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={extra}
                    onChange={(e) =>
                      handleExtraChange(
                        sectionIndex,
                        extraIndex,
                        e.target.value
                      )
                    }
                    placeholder="Enter extra information"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtra(sectionIndex, extraIndex)}
                    className="btn btn-ghost btn-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium font-semibold">Questions</h5>
                <button
                  type="button"
                  onClick={() => addQuestion(sectionIndex)}
                  className="btn btn-primary btn-sm"
                >
                  Add Question
                </button>
              </div>

              {section.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="bg-base-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h6 className="font-medium">
                      Question {question.question_number}
                    </h6>
                    <button
                      type="button"
                      onClick={() =>
                        removeQuestion(sectionIndex, questionIndex)
                      }
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-black">
                        Answer
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={question.answer}
                      onChange={(e) =>
                        handleQuestionChange(
                          sectionIndex,
                          questionIndex,
                          "answer",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <button type="button" onClick={addSection} className="btn btn-primary">
        Add Section
      </button>
    </div>
  );
};

export default FillBlanksGroupForm;
