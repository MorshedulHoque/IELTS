"use client";
import { useEffect, useState } from "react";
import { ListeningTest, TestPart } from "./listeningTest";
import PartForm from "./PartForm";
import { submitListeningQuestions } from "@/services/data";
import { toast, ToastContainer } from "react-toastify";
import AudioUploader from "../Common/AudioUploader";

const ListeningCreationPage = () => {
  const [test, setTest] = useState<ListeningTest>({
    title: "",
    type: "academic",
    duration: 30,
    audioUrl: "",
    cloudinaryPublicId: "",
    audioDuration: 0,
    audioFormat: "",
    audioSize: 0,
    parts: [{ title: "Part 1", questions: [] }],
  });

  const handleTestChange = (
    field: keyof ListeningTest,
    value: string | number
  ) => {
    setTest((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudioUploaded = (audioUrl: string, publicId: string) => {
    setTest((prev) => ({
      ...prev,
      audioUrl: audioUrl,
      cloudinaryPublicId: publicId,
    }));
  };

  // Helper function to renumber all questions globally across all parts
  const renumberAllQuestionsGlobally = (parts: TestPart[]) => {
    let globalQuestionNumber = 1;

    return parts.map((part) => ({
      ...part,
      questions: part.questions.map((group) => {
        // Handle FillBlanksGroup
        if ("fill_in_the_blanks_with_subtitle" in group) {
          return {
            ...group,
            fill_in_the_blanks_with_subtitle:
              group.fill_in_the_blanks_with_subtitle.map((section) => ({
                ...section,
                questions: section.questions.map((question) => ({
                  ...question,
                  question_number: globalQuestionNumber++,
                })),
              })),
          };
        }
        // Handle MCQ Group
        else if ("questions" in group && "instruction" in group) {
          // Ensure questions is an array before mapping
          const questionsArray = Array.isArray(group.questions)
            ? group.questions
            : [];
          return {
            ...group,
            questions: questionsArray.map((question) => ({
              ...question,
              question_number: globalQuestionNumber++,
            })),
          };
        }
        // Handle MCQ Group (alternative structure)
        else if ("mcq" in group) {
          return {
            ...group,
            mcq: Array.isArray(group.mcq)
              ? group.mcq.map((question) => ({
                  ...question,
                  question_number: globalQuestionNumber++,
                }))
              : [],
          };
        }
        // Handle Multiple MCQ Group
        else if ("multiple_mcq" in group) {
          return {
            ...group,
            multiple_mcq: Array.isArray(group.multiple_mcq)
              ? group.multiple_mcq.map((question) => {
                  const questionCount = question.question_numbers?.length || 0;
                  const newQuestionNumbers = [];
                  for (let i = 0; i < questionCount; i++) {
                    newQuestionNumbers.push(globalQuestionNumber++);
                  }
                  return {
                    ...question,
                    question_numbers: newQuestionNumbers,
                  };
                })
              : [],
          };
        }
        // Handle Box Matching Group
        else if ("box_matching" in group) {
          return {
            ...group,
            box_matching: Array.isArray(group.box_matching)
              ? group.box_matching.map((question) => ({
                  ...question,
                  questions: Array.isArray(question.questions)
                    ? question.questions.map((q) => ({
                        ...q,
                        question_number: globalQuestionNumber++,
                      }))
                    : [],
                }))
              : [],
          };
        }
        // Handle MapGroup
        else if ("map" in group) {
          return {
            ...group,
            map: Array.isArray(group.map)
              ? group.map.map((mapItem) => ({
                  ...mapItem,
                  questions: Array.isArray(mapItem.questions)
                    ? mapItem.questions.map((question) => ({
                        ...question,
                        question_number: globalQuestionNumber++,
                      }))
                    : [],
                }))
              : [],
          };
        }
        // Return group as-is if no recognized type
        return group;
      }),
    }));
  };

  const updateTestWithRenumbering = (updatedTest: ListeningTest) => {
    const renumberedParts = renumberAllQuestionsGlobally(updatedTest.parts);
    setTest({ ...updatedTest, parts: renumberedParts });
  };

  const updatePart = (index: number, part: TestPart) => {
    const parts = [...test.parts];
    parts[index] = part;
    updateTestWithRenumbering({ ...test, parts });
  };

  const removePart = (index: number) => {
    const filteredParts = test.parts.filter((_, i) => i !== index);
    updateTestWithRenumbering({ ...test, parts: filteredParts });
  };

  const addPart = () => {
    const newParts = [
      ...test.parts,
      { title: `Part ${test.parts.length + 1}`, questions: [] },
    ];
    updateTestWithRenumbering({ ...test, parts: newParts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that audio is uploaded
    if (!test.audioUrl) {
      toast.error("Please upload an audio file for the listening test");
      return;
    }

    console.log("Submitting test:", JSON.stringify(test, null, 2));

    try {
      const data = await submitListeningQuestions(JSON.stringify(test));
      console.log(data.success);
      if (data.success) {
        toast.success("Test created successfully!");
        // Reset form after successful creation
        setTest({
          title: "",
          type: "academic",
          duration: 30,
          audioUrl: "",
          cloudinaryPublicId: "",
          audioDuration: 0,
          audioFormat: "",
          audioSize: 0,
          parts: [{ title: "Part 1", questions: [] }],
        });
      } else {
        toast.error("Failed to create test. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the test.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Listening Test
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-black">Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered border-black"
              value={test.title}
              onChange={(e) => handleTestChange("title", e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-black">Type</span>
            </label>
            <select
              className="select select-bordered border-black"
              value={test.type}
              onChange={(e) => handleTestChange("type", e.target.value)}
            >
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-black">
                Duration (minutes)
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered border-black"
              value={test.duration}
              onChange={(e) =>
                handleTestChange("duration", parseInt(e.target.value))
              }
              required
            />
          </div>

          {/* Audio Upload Section */}
          <div className="md:col-span-2">
            <AudioUploader
              onAudioUploaded={handleAudioUploaded}
              label="Upload Listening Test Audio"
            />

            {/* Display uploaded audio info */}
            {test.audioUrl && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-green-800 font-medium">
                    Audio uploaded successfully!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="divider"></div>

        <div className="space-y-10">
          {test.parts.map((part, partIndex) => (
            <PartForm
              key={partIndex}
              part={part}
              partIndex={partIndex}
              allParts={test.parts}
              updatePart={updatePart}
              removePart={removePart}
              isLast={partIndex === test.parts.length - 1}
            />
          ))}

          <button type="button" onClick={addPart} className="btn btn-primary">
            Add Part
          </button>
        </div>

        <div className="flex justify-end mt-10">
          <button type="submit" className="btn btn-success">
            Create Test
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ListeningCreationPage;
