// components/Admin/Reading/AllReading/AllReading.tsx
import { deleteReadingTest, editReadingTest } from "@/services/data";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AllDeleteModal from "../../Common/AllDeleteModal";
import EditReading from "./EditReading";
// import { ReadingTest } from "@/types/reading"; // Define your types

const AllReading: React.FC<any> = ({ readingData, setReadingData }) => {
  const [selectedTest, setSelectedTest]: any = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedTest, setEditedTest] = useState<any>(null);

  const handleEdit = (test: any) => {
    setSelectedTest(test);
    // Initialize editedTest with a deep copy of the selected test
    setEditedTest(JSON.parse(JSON.stringify(test)));
    setShowEditModal(true);
  };

  const handleDelete = (test: any) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteReadingTest(selectedTest._id);

      // Update state to remove the deleted item
      setReadingData((prev: any) =>
        prev.filter((test: any) => test._id !== selectedTest._id)
      );

      toast.success("Reading test deleted successfully");

      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Delete operation failed");
      toast.error("Delete operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // const saveChanges = async () => {
  //   await editReadingTest(selectedTest._id, editedTest)
  //   console.log("Saving changes for:", selectedTest?._id);
  //   console.log('Edited Test', editedTest)
  //   setShowEditModal(false);
  // };

  const saveChanges = async () => {
    if (!editedTest) return;

    try {
      await editReadingTest(selectedTest._id, editedTest); // Use editedTest, not readingData

      console.log("Edited test", editedTest);

      // Update the readingData state with the edited test
      setReadingData((prev: any) =>
        prev.map((test: any) =>
          test._id === selectedTest._id ? editedTest : test
        )
      );

      toast.success("Reading test updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update operation failed");
    }
  };

  const handleQuestionChange = (
    partIndex: number,
    groupIndex: number,
    qIndex: number,
    field: string,
    value: any
  ) => {
    setEditedTest((prev: any) => {
      // if (!prev) return null;

      // Create a deep copy of the test
      const newTest = JSON.parse(JSON.stringify(prev));

      // Get the question type key for this group (skip 'instructions')
      const group = newTest.parts?.[partIndex]?.questions?.[groupIndex] || {};
      const questionType = Object.keys(group).find((k) => k !== "instructions");
      if (!questionType) {
        console.error("No question type found in group", { partIndex, groupIndex, group });
        return prev;
      }

      // Update the specific question field
      const target = newTest.parts[partIndex].questions[groupIndex][questionType][qIndex];
      if (typeof target !== "object" || target === null) {
        console.error("Target question is not an object", target);
        return prev;
      }
      target[field] = value;

      return newTest;
    });
  };

  const handleTestFieldChange = (field: any, value: any) => {
    setEditedTest((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePartFieldChange = (partIndex: any, field: any, value: any) => {
    setEditedTest((prev: any) => {
      const newTest = { ...prev };
      newTest.parts = [...newTest.parts];
      newTest.parts[partIndex] = {
        ...newTest.parts[partIndex],
        [field]: value,
      };
      return newTest;
    });
  };

  const handlePassageParagraphChange = (
    partIndex: any,
    paraIndex: any,
    value: any
  ) => {
    setEditedTest((prev: any) => {
      const newTest = { ...prev };
      newTest.parts = [...newTest.parts];
      newTest.parts[partIndex] = {
        ...newTest.parts[partIndex],
      };
      
      // Handle both array and object formats
      if (Array.isArray(newTest.parts[partIndex].passage)) {
        // Check if it's an array of objects (like [{A: "text1", B: "text2"}])
        if (newTest.parts[partIndex].passage.length === 1 && 
            typeof newTest.parts[partIndex].passage[0] === 'object' && 
            !Array.isArray(newTest.parts[partIndex].passage[0])) {
          // Object format wrapped in array: [{A: para1, B: para2, C: para3}]
          const obj = { ...newTest.parts[partIndex].passage[0] };
          const keys = Object.keys(obj);
          const keyToUpdate = keys[paraIndex];
          obj[keyToUpdate] = value;
          newTest.parts[partIndex].passage = [obj];
        } else {
          // Regular array format: [para1, para2, para3]
          newTest.parts[partIndex].passage = [...newTest.parts[partIndex].passage];
          newTest.parts[partIndex].passage[paraIndex] = value;
        }
      } else {
        // Direct object format: {A: para1, B: para2, C: para3}
        const keys = Object.keys(newTest.parts[partIndex].passage);
        const keyToUpdate = keys[paraIndex];
        newTest.parts[partIndex].passage = {
          ...newTest.parts[partIndex].passage,
          [keyToUpdate]: value
        };
      }
      
      return newTest;
    });
  };

  // Update fields that belong to a question group object itself (e.g., instructions)
  const handleQuestionGroupFieldChange = (
    partIndex: number,
    groupIndex: number,
    field: string,
    value: any
  ) => {
    setEditedTest((prev: any) => {
      const newTest = JSON.parse(JSON.stringify(prev));
      if (!newTest.parts?.[partIndex]?.questions?.[groupIndex]) {
        console.error("Invalid group indices", { partIndex, groupIndex });
        return prev;
      }
      newTest.parts[partIndex].questions[groupIndex][field] = value;
      return newTest;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Reading Tests Manager
        </h1>
        <Link href={`/admin/reading`}>
          <button className="btn btn-primary">+ Add New Test</button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-4 px-6">Test Title</th>
              <th className="text-center py-4 px-6">Type</th>
              <th className="text-center py-4 px-6">Duration (min)</th>
              <th className="text-center py-4 px-6">Passages</th>
              <th className="text-center py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {readingData.map((test: any) => (
              <tr key={test._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{test.title}</td>
                <td className="text-center py-4 px-6">
                  <span className="badge badge-info">{test.type}</span>
                </td>
                <td className="text-center py-4 px-6">{test.duration}</td>
                <td className="text-center py-4 px-6">
                  <span className="badge badge-outline">
                    {test.parts.length} passages
                  </span>
                </td>
                <td className="text-center py-4 px-6">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                    <button className="btn btn-sm btn-outline">Preview</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedTest && editedTest && (
        <EditReading
          editedTest={editedTest}
          handleTestFieldChange={handleTestFieldChange}
          handlePartFieldChange={handlePartFieldChange}
          handlePassageParagraphChange={handlePassageParagraphChange}
          handleQuestionGroupFieldChange={handleQuestionGroupFieldChange}
          handleQuestionChange={handleQuestionChange}
          setShowEditModal={setShowEditModal}
          saveChanges={saveChanges}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTest && (
        <AllDeleteModal
          selectedTest={selectedTest}
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
          isDeleting={isDeleting}
          error={error}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default AllReading;
