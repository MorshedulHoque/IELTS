import { TestPart, QuestionGroup } from "./listeningTest";
import QuestionGroupEditor from "./QuestionGroupEditor";

interface PartFormProps {
  part: TestPart;
  partIndex: number;
  allParts: TestPart[]; // Add this to get global context
  updatePart: (index: number, part: TestPart) => void;
  removePart: (index: number) => void;
  isLast: boolean;
}

const PartForm = ({
  part,
  partIndex,
  allParts,
  updatePart,
  removePart,
  isLast,
}: PartFormProps) => {
  // Get the next question number across ALL parts
  const getNextGlobalQuestionNumber = () => {
    let maxQuestionNumber = 0;

    // Find the highest question number across all parts
    allParts.forEach((currentPart) => {
      currentPart.questions.forEach((group) => {
        if ("fill_in_the_blanks_with_subtitle" in group) {
          group.fill_in_the_blanks_with_subtitle.forEach((section) => {
            section.questions.forEach((question) => {
              maxQuestionNumber = Math.max(
                maxQuestionNumber,
                question.question_number || 0
              );
            });
          });
        } else if ("questions" in group && "instruction" in group) {
          group.questions?.forEach((question) => {
            maxQuestionNumber = Math.max(
              maxQuestionNumber,
              question.question_number || 0
            );
          });
        } else if ("multiple_mcq" in group) {
          group.multiple_mcq?.forEach((question) => {
            question.question_numbers?.forEach((num) => {
              maxQuestionNumber = Math.max(maxQuestionNumber, num || 0);
            });
          });
        } else if ("box_matching" in group) {
          group.box_matching?.forEach((question) => {
            question.questions?.forEach((q) => {
              maxQuestionNumber = Math.max(
                maxQuestionNumber,
                q.question_number || 0
              );
            });
          });
        } else if ("map" in group) {
          group.map.forEach((mapItem) => {
            mapItem.questions?.forEach((question) => {
              maxQuestionNumber = Math.max(
                maxQuestionNumber,
                question.question_number || 0
              );
            });
          });
        }
      });
    });

    return maxQuestionNumber + 1;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePart(partIndex, { ...part, title: e.target.value });
  };

  const addQuestionGroup = (
    type: "fill" | "mcq" | "multiple_mcq" | "box_matching" | "map"
  ) => {
    const nextQuestionNumber = getNextGlobalQuestionNumber();
    let newGroup;

    switch (type) {
      case "fill":
        newGroup = {
          fill_in_the_blanks_with_subtitle: [
            {
              title: "",
              subtitle: "",
              extra: [],
              questions: [],
            },
          ],
        };
        break;
      case "mcq":
        newGroup = {
          instruction: "",
          questions: [
            {
              question_number: nextQuestionNumber,
              question: "",
              answer: "",
              options: [
                { label: "A", value: "" },
                { label: "B", value: "" },
                { label: "C", value: "" },
              ],
              input_type: "radio",
              min_selection: 1,
              max_selection: 1,
            },
          ],
        };
        break;
      case "multiple_mcq":
        newGroup = {
          instruction: "",
          multiple_mcq: [
            {
              question_numbers: [nextQuestionNumber, nextQuestionNumber + 1],
              question: "",
              options: [
                { label: "A", value: "" },
                { label: "B", value: "" },
                { label: "C", value: "" },
                { label: "D", value: "" },
                { label: "E", value: "" },
              ],
              input_type: "checkbox",
              min_selection: 2,
              max_selection: 2,
              correct_mapping: ["A", "B"],
            },
          ],
        };
        break;
      case "box_matching":
        newGroup = {
          instruction: "",
          box_matching: [
            {
              instructions: "",
              options_title: "",
              question_title: "",
              options: [
                { label: "A", value: "" },
                { label: "B", value: "" },
                { label: "C", value: "" },
                { label: "D", value: "" },
                { label: "E", value: "" },
                { label: "F", value: "" },
                { label: "G", value: "" },
                { label: "H", value: "" },
              ],
              questions: Array.from({ length: 6 }, (_, i) => ({
                question_number: nextQuestionNumber + i,
                topic: "",
                answer: "",
              })),
            },
          ],
        };
        break;
      case "map":
        newGroup = {
          map: [
            {
              title: "",
              image: "",
              instructions: "",
              labels: ["A", "B", "C"],
              questions: [],
            },
          ],
        };
        break;
      default:
        return;
    }

    const updatedPart = {
      ...part,
      questions: [...part.questions, newGroup],
    };
    updatePart(partIndex, updatedPart);
  };

  const updateQuestionGroup = (index: number, group: QuestionGroup) => {
    const updatedQuestions = [...part.questions];
    updatedQuestions[index] = group;
    updatePart(partIndex, { ...part, questions: updatedQuestions });
  };

  const removeQuestionGroup = (index: number) => {
    const updatedQuestions = part.questions.filter((_, i) => i !== index);
    updatePart(partIndex, { ...part, questions: updatedQuestions });
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Part {partIndex + 1}</h2>
        {!isLast && (
          <button
            type="button"
            onClick={() => removePart(partIndex)}
            className="btn btn-error btn-sm"
          >
            Remove Part
          </button>
        )}
      </div>

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text text-black">Part Title</span>
        </label>
        <input
          type="text"
          className="input input-bordered border-black"
          value={part.title}
          onChange={handleTitleChange}
          required
        />
      </div>

      <div className="space-y-8">
        {part.questions.map((group, groupIndex) => (
          <QuestionGroupEditor
            key={groupIndex}
            group={group}
            groupIndex={groupIndex}
            updateGroup={updateQuestionGroup}
            removeGroup={removeQuestionGroup}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => addQuestionGroup("fill")}
          className="btn btn-outline"
        >
          Add Fill-in-Blanks
        </button>
        <button
          type="button"
          onClick={() => addQuestionGroup("mcq")}
          className="btn btn-outline"
        >
          Add MCQ
        </button>
        <button
          type="button"
          onClick={() => addQuestionGroup("multiple_mcq")}
          className="btn btn-outline"
        >
          Add Multiple MCQ
        </button>
        <button
          type="button"
          onClick={() => addQuestionGroup("box_matching")}
          className="btn btn-outline"
        >
          Add Box Matching
        </button>
        <button
          type="button"
          onClick={() => addQuestionGroup("map")}
          className="btn btn-outline"
        >
          Add Map Questions
        </button>
      </div>
    </div>
  );
};

export default PartForm;
