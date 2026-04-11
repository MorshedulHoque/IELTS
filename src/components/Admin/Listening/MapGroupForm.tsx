import { MapGroup } from "./listeningTest";
import ImageUploader from "../Common/ImageUploader";

interface MapGroupFormProps {
  group: MapGroup;
  updateGroup: (group: MapGroup) => void;
}

const MapGroupForm = ({ group, updateGroup }: MapGroupFormProps) => {
  // Remove local state - work directly with props
  const handleMapItemChange = (
    mapIndex: number,
    field: string,
    value: string
  ) => {
    const updatedMap = [...group.map];
    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      [field]: value,
    };
    updateGroup({ ...group, map: updatedMap });
  };

  const handleLabelsChange = (mapIndex: number, labels: string[]) => {
    const updatedMap = [...group.map];
    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      labels,
    };
    updateGroup({ ...group, map: updatedMap });
  };

  const addLabel = (mapIndex: number) => {
    const updatedMap = [...group.map];
    const currentLabels = updatedMap[mapIndex].labels;
    const lastLabel = currentLabels[currentLabels.length - 1];
    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);

    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      labels: [...currentLabels, nextLabel],
    };
    updateGroup({ ...group, map: updatedMap });
  };

  const removeLabel = (mapIndex: number, labelIndex: number) => {
    const updatedMap = [...group.map];
    const labelToRemove = updatedMap[mapIndex].labels[labelIndex];
    const updatedLabels = updatedMap[mapIndex].labels.filter(
      (_, index) => index !== labelIndex
    );

    // Update any questions that were using the removed label
    const updatedQuestions = updatedMap[mapIndex].questions.map((q) => ({
      ...q,
      answer: q.answer === labelToRemove ? "" : q.answer,
    }));

    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      labels: updatedLabels,
      questions: updatedQuestions,
    };
    updateGroup({ ...group, map: updatedMap });
  };

  const handleQuestionChange = (
    mapIndex: number,
    questionIndex: number,
    field: string,
    value: string
  ) => {
    const updatedMap = [...group.map];
    const updatedQuestions = [...updatedMap[mapIndex].questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      questions: updatedQuestions,
    };
    updateGroup({ ...group, map: updatedMap });
  };

  const addMapItem = () => {
    const updatedGroup = {
      ...group,
      map: [
        ...group.map,
        {
          title: "",
          image: "",
          instructions: "",
          labels: ["A", "B", "C"],
          questions: [],
        },
      ],
    };
    updateGroup(updatedGroup);
  };

  const removeMapItem = (mapIndex: number) => {
    const updatedGroup = {
      ...group,
      map: group.map.filter((_, index) => index !== mapIndex),
    };
    updateGroup(updatedGroup);
  };

  const addQuestion = (mapIndex: number) => {
    const updatedMap = [...group.map];
    const currentQuestions = updatedMap[mapIndex].questions;

    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      questions: [
        ...currentQuestions,
        {
          question_number: 1, // Temporary number - will be renumbered globally
          question: "",
          answer: "",
          input_type: "radio",
          min_selection: 1,
          max_selection: 1,
        },
      ],
    };
    updateGroup({ ...group, map: updatedMap });
  };

  const removeQuestion = (mapIndex: number, questionIndex: number) => {
    const updatedMap = [...group.map];
    const updatedQuestions = updatedMap[mapIndex].questions.filter(
      (_, index) => index !== questionIndex
    );
    updatedMap[mapIndex] = {
      ...updatedMap[mapIndex],
      questions: updatedQuestions,
    };
    updateGroup({ ...group, map: updatedMap });
  };

  return (
    <div className="space-y-6">
      {group.map.map((mapItem, mapIndex) => (
        <div key={mapIndex} className="bg-base-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Map Section {mapIndex + 1}</h4>
            <button
              type="button"
              onClick={() => removeMapItem(mapIndex)}
              className="btn btn-error btn-sm"
            >
              Remove Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">
                  Title
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered border-black"
                value={mapItem.title}
                onChange={(e) =>
                  handleMapItemChange(mapIndex, "title", e.target.value)
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">
                  Upload Image (Optional)
                </span>
              </label>
              <ImageUploader
                onUploaded={(url) =>
                  handleMapItemChange(mapIndex, "image", url)
                }
              />
            </div>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Instructions
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered border-black"
              placeholder="Enter instructions for the map"
              value={mapItem.instructions || ""}
              onChange={(e) =>
                handleMapItemChange(mapIndex, "instructions", e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="form-control mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="label">
                <span className="label-text font-semibold text-black">
                  Labels
                </span>
              </label>
              <button
                type="button"
                onClick={() => addLabel(mapIndex)}
                className="btn btn-primary btn-sm"
              >
                Add Label
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mapItem.labels.map((label, labelIndex) => (
                <div
                  key={`${label}-${labelIndex}`}
                  className="flex items-center gap-2 bg-base-200 px-3 py-1 rounded"
                >
                  <span>{label}</span>
                  <button
                    type="button"
                    onClick={() => removeLabel(mapIndex, labelIndex)}
                    className="btn btn-ghost btn-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="font-medium">Questions</h5>
              <button
                type="button"
                onClick={() => addQuestion(mapIndex)}
                className="btn btn-primary btn-sm"
              >
                Add Question
              </button>
            </div>

            {mapItem.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-base-200 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h6 className="font-medium">
                    Question {question.question_number || questionIndex + 1}
                  </h6>
                  <button
                    type="button"
                    onClick={() => removeQuestion(mapIndex, questionIndex)}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black">Question</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered border-black"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          mapIndex,
                          questionIndex,
                          "question",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black">Answer</span>
                    </label>
                    <select
                      className="select select-bordered border-black"
                      value={question.answer}
                      onChange={(e) =>
                        handleQuestionChange(
                          mapIndex,
                          questionIndex,
                          "answer",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Answer</option>
                      {mapItem.labels.map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button type="button" onClick={addMapItem} className="btn btn-primary">
        Add Map Section
      </button>
    </div>
  );
};

export default MapGroupForm;
