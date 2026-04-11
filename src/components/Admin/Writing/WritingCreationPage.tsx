"use client";
import React, { useState } from "react";
import WritingPartForm from "./WritingPartForm";
import { WritingTest, WritingPart } from "./WritingTest";
import { ToastContainer, toast } from "react-toastify";
import { submitWritingQuestions } from "@/services/data";

const WritingCreationPage: React.FC = () => {
  const [testData, setTestData] = useState<WritingTest>({
    title: "",
    type: "Academic",
    duration: 60,
    parts: [
      {
        title: "",
        subtitle: "",
        Question: [""],
        instruction: [""],
        image: "",
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Format the JSON output to match writing.json format
    const formattedTest = {
      title: testData.title,
      type: testData.type,
      duration: testData.duration,
      parts: testData.parts.map((part) => ({
        title: part.title,
        subtitle: part.subtitle,
        Question: part.Question,
        instruction: part.instruction,
        ...(part.image && { image: part.image }), // Only include image if it exists
      })),
    };
    console.log("Writing Test JSON:", JSON.stringify(formattedTest, null, 2));

    try {
      const data = await submitWritingQuestions(formattedTest);
      console.log(data.success);
      if (data.success) {
        toast.success("Test created successfully!");
        // Optionally, redirect or reset the form
      } else {
        toast.error("Failed to create test. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the test.");
    }
  };

  const handleTestChange = (field: keyof WritingTest, value: any) => {
    setTestData({ ...testData, [field]: value });
  };

  const handlePartChange = (part: WritingPart, index: number) => {
    const newParts = [...testData.parts];
    newParts[index] = part;
    setTestData({ ...testData, parts: newParts });
  };

  const addPart = () => {
    setTestData({
      ...testData,
      parts: [
        ...testData.parts,
        {
          title: "",
          subtitle: "",
          Question: [""],
          instruction: [""],
          image: "",
        },
      ],
    });
  };

  const removePart = (index: number) => {
    if (testData.parts.length <= 1) return;
    const newParts = testData.parts.filter((_, i) => i !== index);
    setTestData({ ...testData, parts: newParts });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create IELTS Writing Test
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Test Title</span>
              </label>
              <input
                type="text"
                value={testData.title}
                onChange={(e) => handleTestChange("title", e.target.value)}
                className="input input-bordered border-black"
                placeholder="Writing Test 1"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Test Type</span>
              </label>
              <select
                value={testData.type}
                onChange={(e) => handleTestChange("type", e.target.value)}
                className="select select-bordered border-black"
              >
                <option value="Academic">Academic</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-black">Duration (minutes)</span>
              </label>
              <input
                type="number"
                value={testData.duration}
                onChange={(e) =>
                  handleTestChange("duration", parseInt(e.target.value))
                }
                className="input input-bordered border-black"
                min="1"
                required
              />
            </div>
          </div>

          <div className="border-t border-base-300 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Test Parts</h2>
              <button
                type="button"
                onClick={addPart}
                className="btn btn-primary"
              >
                Add Part
              </button>
            </div>

            {testData.parts.map((part, index) => (
              <WritingPartForm
                key={index}
                part={part}
                index={index}
                onChange={handlePartChange}
                onRemove={removePart}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button type="submit" className="btn btn-primary btn-wide">
              Create Test
            </button>
          </div>
        </form>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default WritingCreationPage;
