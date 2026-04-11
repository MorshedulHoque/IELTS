export const RenderReadingQuestionFields = (
  type: string,
  question: any,
  partIndex: number,
  groupIndex: number,
  qIndex: number,
  handleQuestionChange: (
    partIndex: number,
    groupIndex: number,
    qIndex: number,
    field: string,
    value: any
  ) => void
) => {
  // Helper function to simplify onChange calls
  const handleChange = (field: string, value: any) => {
    handleQuestionChange(partIndex, groupIndex, qIndex, field, value);
  };

  // Helper for nested blank changes
  const handleBlankChange = (blankIndex: number, field: string, value: any) => {
    const newBlanks = [...question.blanks];
    newBlanks[blankIndex] = { ...newBlanks[blankIndex], [field]: value };
    handleChange("blanks", newBlanks);
  };

  // Helper for option changes
  const handleOptionChange = (optIndex: number, field: string, value: any) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = { ...newOptions[optIndex], [field]: value };
    handleChange("options", newOptions);
  };

  // Helper for nested question changes
  const handleSubQuestionChange = (
    subQIndex: number,
    field: string,
    value: any
  ) => {
    const newQuestions = [...question.questions];
    newQuestions[subQIndex] = { ...newQuestions[subQIndex], [field]: value };
    handleChange("questions", newQuestions);
  };

  switch (type) {
    case "true_false_not_given":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <select
              value={question.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="True">True</option>
              <option value="False">False</option>
              <option value="Not Given">Not Given</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange("input_type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="dropdown">Dropdown</option>
              <option value="radio">Radio Buttons</option>
            </select>
          </div>
        </div>
      );

    case "fill_in_the_blanks":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <input
              type="text"
              value={question.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange("input_type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
            </select>
          </div>
        </div>
      );

    case "matching_headings":
    case "paragraph_matching":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <input
              type="text"
              value={question.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "label", e.target.value)
                    }
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "value", e.target.value)
                    }
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() =>
                handleChange("options", [
                  ...question.options,
                  { label: "", value: "" },
                ])
              }
            >
              + Add Option
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange("input_type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="dropdown">Dropdown</option>
              <option value="drag_and_drop">Drag and Drop</option>
            </select>
          </div>
        </div>
      );

    case "multiple_mcq":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Numbers</span>
            </label>
            <input
              type="text"
              value={question.question_numbers.join(", ")}
              onChange={(e) =>
                handleChange(
                  "question_numbers",
                  e.target.value.split(",").map((n: string) => n.trim())
                )
              }
              className="input input-bordered w-full"
              placeholder="Comma separated numbers (e.g., 9,10)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "label", e.target.value)
                    }
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "value", e.target.value)
                    }
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() =>
                handleChange("options", [
                  ...question.options,
                  { label: "", value: "" },
                ])
              }
            >
              + Add Option
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answers</span>
            </label>
            <input
              type="text"
              value={question.correct_mapping.join(", ")}
              onChange={(e) =>
                handleChange(
                  "correct_mapping",
                  e.target.value.split(",").map((v: string) => v.trim())
                )
              }
              className="input input-bordered w-full"
              placeholder="Comma separated values (e.g., A,B)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Min Selection</span>
              </label>
              <input
                type="number"
                value={question.min_selection}
                onChange={(e) =>
                  handleChange("min_selection", parseInt(e.target.value))
                }
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Selection</span>
              </label>
              <input
                type="number"
                value={question.max_selection}
                onChange={(e) =>
                  handleChange("max_selection", parseInt(e.target.value))
                }
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange("input_type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="checkbox">Checkbox</option>
              <option value="multi-select">Multi-select</option>
            </select>
          </div>
        </div>
      );

    case "passage_fill_in_the_blanks":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Instruction</span>
            </label>
            <textarea
              value={question.instruction}
              onChange={(e) => handleChange("instruction", e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Passage with Blanks</span>
            </label>
            <textarea
              value={question.text}
              onChange={(e) => handleChange("text", e.target.value)}
              className="textarea textarea-bordered w-full h-32"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Numbers</span>
            </label>
            <input
              type="text"
              value={question.question_number.join(", ")}
              onChange={(e) =>
                handleChange(
                  "question_number",
                  e.target.value
                    .split(",")
                    .map((n: string) => parseInt(n.trim()))
                )
              }
              className="input input-bordered w-full"
              placeholder="Comma separated numbers (e.g., 13,14)"
            />
          </div>

          <div className="space-y-2">
            {question.blanks.map((blank: any, blankIndex: number) => (
              <div
                key={blankIndex}
                className="flex items-center gap-2 p-3 bg-base-200 rounded-lg"
              >
                <span className="badge badge-neutral">
                  Blank {blank.blank_number}
                </span>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text">Answer</span>
                  </label>
                  <input
                    type="text"
                    value={blank.answer}
                    onChange={(e) =>
                      handleBlankChange(blankIndex, "answer", e.target.value)
                    }
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="w-40">
                  <label className="label">
                    <span className="label-text">Input Type</span>
                  </label>
                  <select
                    value={blank.input_type}
                    onChange={(e) =>
                      handleBlankChange(
                        blankIndex,
                        "input_type",
                        e.target.value
                      )
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "mcq":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Answer</span>
            </label>
            <input
              type="text"
              value={question.answer[0]}
              onChange={(e) => handleChange("answer", [e.target.value])}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "label", e.target.value)
                    }
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "value", e.target.value)
                    }
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() =>
                handleChange("options", [
                  ...question.options,
                  { label: "", value: "" },
                ])
              }
            >
              + Add Option
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Min Selection</span>
              </label>
              <input
                type="number"
                value={question.min_selection}
                onChange={(e) =>
                  handleChange("min_selection", parseInt(e.target.value))
                }
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Selection</span>
              </label>
              <input
                type="number"
                value={question.max_selection}
                onChange={(e) =>
                  handleChange("max_selection", parseInt(e.target.value))
                }
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange("input_type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="radio">Radio Buttons</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
        </div>
      );

    case "summary_fill_in_the_blanks":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Passage with Blanks</span>
            </label>
            <textarea
              value={question.passage}
              onChange={(e) => handleChange("passage", e.target.value)}
              className="textarea textarea-bordered w-full h-32"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Question Numbers</span>
            </label>
            <input
              type="text"
              value={question.question_numbers.join(", ")}
              onChange={(e) =>
                handleChange(
                  "question_numbers",
                  e.target.value
                    .split(",")
                    .map((n: string) => parseInt(n.trim()))
                )
              }
              className="input input-bordered w-full"
              placeholder="Comma separated numbers (e.g., 17,18)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Options</span>
            </label>
            <div className="space-y-2">
              {question.options.map((option: any, optIndex: number) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "label", e.target.value)
                    }
                    className="input input-bordered input-sm w-full"
                  />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(optIndex, "value", e.target.value)
                    }
                    className="input input-bordered input-sm w-20"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn btn-xs btn-outline mt-2"
              onClick={() =>
                handleChange("options", [
                  ...question.options,
                  { label: "", value: "" },
                ])
              }
            >
              + Add Option
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Correct Answers</span>
            </label>
            <input
              type="text"
              value={question.answers.join(", ")}
              onChange={(e) =>
                handleChange(
                  "answers",
                  e.target.value.split(",").map((v: string) => v.trim())
                )
              }
              className="input input-bordered w-full"
              placeholder="Comma separated values (e.g., A,C)"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Input Type</span>
            </label>
            <select
              value={question.input_type}
              onChange={(e) => handleChange("input_type", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="drag_and_drop">Drag and Drop</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
        </div>
      );

    case "fill_in_the_blanks_with_subtitle":
      return (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={question.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Subtitle</span>
            </label>
            <input
              type="text"
              value={question.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Content with Blanks</span>
            </label>
            <div className="space-y-2">
              {question.extra.map((text: string, textIndex: number) => (
                <textarea
                  key={textIndex}
                  value={text}
                  onChange={(e) => {
                    const newExtra = [...question.extra];
                    newExtra[textIndex] = e.target.value;
                    handleChange("extra", newExtra);
                  }}
                  className="textarea textarea-bordered w-full"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {question.questions.map((q: any, qIndex: number) => (
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
                    value={q.answer}
                    onChange={(e) =>
                      handleSubQuestionChange(qIndex, "answer", e.target.value)
                    }
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="w-40">
                  <label className="label">
                    <span className="label-text">Input Type</span>
                  </label>
                  <select
                    value={q.input_type}
                    onChange={(e) =>
                      handleSubQuestionChange(
                        qIndex,
                        "input_type",
                        e.target.value
                      )
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="alert alert-warning">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Custom editor for this question type not implemented yet</span>
        </div>
      );
  }
};
