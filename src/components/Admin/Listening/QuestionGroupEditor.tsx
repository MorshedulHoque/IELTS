import {
  QuestionGroup,
  FillBlanksGroup,
  MCQGroup,
  MultipleMCQGroup,
  BoxMatchingGroup,
  MapGroup,
  MCQItem,
} from "./listeningTest";
import FillBlanksGroupForm from "./FillBlanksGroupForm";
import MCQGroupForm from "./MCQGroupForm";
import MultipleMCQGroupForm from "./MultipleMCQGroupForm";
import BoxMatchingGroupForm from "./BoxMatchingGroupForm";
import MapGroupForm from "./MapGroupForm";

interface QuestionGroupEditorProps {
  group: QuestionGroup;
  groupIndex: number;
  updateGroup: (index: number, group: QuestionGroup) => void;
  removeGroup: (index: number) => void;
}

const QuestionGroupEditor = ({
  group,
  groupIndex,
  updateGroup,
  removeGroup,
}: QuestionGroupEditorProps) => {
  const handleGroupUpdate = (updatedGroup: QuestionGroup) => {
    updateGroup(groupIndex, updatedGroup);
  };

  // Handle MCQ updates with new structure (instruction + mcq)
  const handleMCQUpdate = (data: { questions: MCQItem[]; instruction: string }) => {
    const updatedGroup = {
      instruction: data?.instruction ?? (group as any).instruction ?? "",
      mcq: data?.questions ?? [],
    } as QuestionGroup;
    updateGroup(groupIndex, updatedGroup);
  };

  // Handle Multiple MCQ updates with new structure (instruction + multiple_mcq)
  const handleMultipleMCQUpdate = (questions: any[], instruction?: string) => {
    const updatedGroup = {
      instruction: instruction || (group as any).instruction || "",
      multiple_mcq: questions,
    };
    updateGroup(groupIndex, updatedGroup);
  };

  // Handle Box Matching updates with new structure (instruction + box_matching)
  const handleBoxMatchingUpdate = (questions: any[], instruction?: string) => {
    // Remove per-item 'instructions' to avoid duplicate instructions
    const cleaned = questions.map((item: any) => {
      if (item && typeof item === "object" && "instructions" in item) {
        const { instructions, ...rest } = item as any;
        return rest;
      }
      return item;
    });

    const updatedGroup = {
      instruction: instruction || (group as any).instruction || "",
      box_matching: cleaned,
    };
    updateGroup(groupIndex, updatedGroup);
  };

  const renderForm = () => {
    // Check for new MCQ structure (instruction + questions)
    if ("questions" in group && "instruction" in group) {
      return (
        <div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Instructions
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered border-black"
              value={(group as any).instruction || ""}
              onChange={(e) => {
                const updatedGroup = {
                  ...group,
                  instruction: e.target.value,
                };
                updateGroup(groupIndex, updatedGroup);
              }}
              placeholder="Enter instructions for this question group..."
              rows={2}
            />
          </div>
          <MCQGroupForm
            questions={(group as any).questions || []}
            instruction={(group as any).instruction || ""}
            onUpdate={handleMCQUpdate}
          />
        </div>
      );
    }

    // Check for new Multiple MCQ structure (instruction + multiple_mcq)
    if ("multiple_mcq" in group && "instruction" in group) {
      return (
        <div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Instructions
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered border-black"
              value={(group as any).instruction || ""}
              onChange={(e) => {
                const updatedGroup = {
                  ...group,
                  instruction: e.target.value,
                };
                updateGroup(groupIndex, updatedGroup);
              }}
              placeholder="Enter instructions for this question group..."
              rows={2}
            />
          </div>
          <MultipleMCQGroupForm
            questions={(group as any).multiple_mcq || []}
            onUpdate={(questions) =>
              handleMultipleMCQUpdate(questions, (group as any).instruction)
            }
          />
        </div>
      );
    }

    // Check for new Box Matching structure (instruction + box_matching)
    if ("box_matching" in group && "instruction" in group) {
      return (
        <div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Instructions
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered border-black"
              value={(group as any).instruction || ""}
              onChange={(e) => {
                const updatedGroup = {
                  ...group,
                  instruction: e.target.value,
                };
                updateGroup(groupIndex, updatedGroup);
              }}
              placeholder="Enter instructions for this question group..."
              rows={2}
            />
          </div>
          <BoxMatchingGroupForm
            questions={(group as any).box_matching || []}
            onUpdate={(questions) =>
              handleBoxMatchingUpdate(questions, (group as any).instruction)
            }
          />
        </div>
      );
    }

    // Handle MCQ structure (alternative format)
    if ("mcq" in group) {
      return (
        <MCQGroupForm
          questions={(group as any).mcq || []}
          instruction={(group as any).instruction || ""}
          onUpdate={(data) => handleMCQUpdate(data)}
        />
      );
    }

    // Handle Multiple MCQ structure (alternative format)
    if ("multiple_mcq" in group && !("instruction" in group)) {
      return (
        <MultipleMCQGroupForm
          questions={(group as any).multiple_mcq || []}
          onUpdate={handleMultipleMCQUpdate}
        />
      );
    }

    // Handle Box Matching structure (alternative format)
    if ("box_matching" in group && !("instruction" in group)) {
      return (
        <BoxMatchingGroupForm
          questions={(group as any).box_matching || []}
          onUpdate={handleBoxMatchingUpdate}
        />
      );
    }

    // Handle Map questions
    if ("map" in group) {
      return (
        <MapGroupForm
          group={group as MapGroup}
          updateGroup={handleGroupUpdate}
        />
      );
    }

    // Handle Fill in the blanks
    if ("fill_in_the_blanks_with_subtitle" in group) {
      return (
        <FillBlanksGroupForm
          group={group as FillBlanksGroup}
          updateGroup={handleGroupUpdate}
        />
      );
    }

    return <div>Unsupported question type</div>;
  };

  const getGroupTitle = () => {
    if ("questions" in group && "instruction" in group)
      return "Multiple Choice Questions";
    if ("multiple_mcq" in group) return "Multiple MCQ Questions";
    if ("box_matching" in group) return "Box Matching Questions";
    if ("map" in group) return "Map Questions";
    if ("fill_in_the_blanks_with_subtitle" in group)
      return "Fill in the Blanks";
    if ("mcq" in group) return "Multiple Choice Questions";
    return "Unknown Question Type";
  };

  return (
    <div className="card bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{getGroupTitle()}</h3>
        <button
          type="button"
          onClick={() => removeGroup(groupIndex)}
          className="btn btn-error btn-sm"
        >
          Remove
        </button>
      </div>

      {renderForm()}
    </div>
  );
};

export default QuestionGroupEditor;
