import { deleteWritingTest, updateWritingTest } from "@/services/data";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from '@/components/Common/Loader';
import { ToastContainer, toast } from "react-toastify";
import AllDeleteModal from "../../Common/AllDeleteModal";
import EditWriting from "./EditWriting";

const AllWriting = ({ writingData, setWritingData }: any) => {
  const [selectedTest, setSelectedTest]: any = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localWritingData, setLocalWritingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
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

  useEffect(() => {
    if (writingData) {
      setLocalWritingData([...writingData]);
      setIsLoading(false);
    }
  }, [writingData]);

  // Initialize form data when a test is selected for editing
  useEffect(() => {
    if (selectedTest && showEditModal) {
      setFormData({
        ...selectedTest,
        parts: selectedTest.parts.map((part: any) => ({
          ...part,
          Question: [...part.Question],
          instruction: [...part.instruction],
        })),
      });
    }
  }, [selectedTest, showEditModal]);

  const handleEdit = (test: any) => {
    setSelectedTest(test);
    setShowEditModal(true);
  };

  const handleDelete = (test: any) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  // Initialize form data when a test is selected for editing
  useEffect(() => {
    if (selectedTest && showEditModal) {
      setFormData({
        ...selectedTest,
        parts: selectedTest.parts.map((part: any) => ({
          ...part,
          Question: [...part.Question],
          instruction: [...part.instruction],
        })),
      });
    }
  }, [selectedTest, showEditModal]);

  //   const handleEdit = (test: any) => {
  //     setSelectedTest(test);
  //     setShowEditModal(true);
  //   };

  //   const handleDelete = (test: any) => {
  //     setSelectedTest(test);
  //     setShowDeleteModal(true);
  //   };

  // Handle top-level field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duration" ? parseInt(value) : value,
    });
  };

  // Handle part field changes
  const handlePartChange = (index: number, field: string, value: string) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Handle question/instruction array changes
  const handleArrayChange = (
    partIndex: number,
    field: string,
    itemIndex: number,
    value: string
  ) => {
    const updatedParts = [...formData.parts];
    const updatedArray = [...updatedParts[partIndex][field]];
    updatedArray[itemIndex] = value;

    updatedParts[partIndex] = {
      ...updatedParts[partIndex],
      [field]: updatedArray,
    };

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Add new item to question/instruction array
  const addArrayItem = (partIndex: number, field: string) => {
    const updatedParts = [...formData.parts];
    updatedParts[partIndex] = {
      ...updatedParts[partIndex],
      [field]: [...updatedParts[partIndex][field], ""],
    };

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Remove item from question/instruction array
  const removeArrayItem = (
    partIndex: number,
    field: string,
    itemIndex: number
  ) => {
    if (formData.parts[partIndex][field].length <= 1) return;

    const updatedParts = [...formData.parts];
    const updatedArray = [...updatedParts[partIndex][field]];
    updatedArray.splice(itemIndex, 1);

    updatedParts[partIndex] = {
      ...updatedParts[partIndex],
      [field]: updatedArray,
    };

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  // Add new part
  const addPart = () => {
    setFormData({
      ...formData,
      parts: [
        ...formData.parts,
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

  // Remove part
  const removePart = (index: number) => {
    if (formData.parts.length <= 1) return;

    const updatedParts = [...formData.parts];
    updatedParts.splice(index, 1);

    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Update the test in the database
      const updatedTest = await updateWritingTest(selectedTest._id, formData);

      // Update LOCAL state immediately
      const updatedData = localWritingData.map((test) =>
        test._id === selectedTest._id ? updatedTest : test
      );

      setLocalWritingData(updatedData);

      // Propagate update to parent component
      setWritingData(updatedData);

      toast.success("Writing test updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError(err instanceof Error ? err.message : "Update operation failed");
      toast.error("Failed to update writing test");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;
    setIsDeleting(true);
    setError(null);

    try {
      await deleteWritingTest(selectedTest._id);

      // Update LOCAL state immediately
      const updatedData = localWritingData.filter(
        (test) => test._id !== selectedTest._id
      );
      setLocalWritingData(updatedData);

      // Propagate update to parent component
      setWritingData(updatedData);

      toast.success("Writing test deleted successfully");
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Delete operation failed");
      toast.error("Delete operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader message="Loading writing tests..." className="!flex-row gap-4 items-center !p-0" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Writing Tests Manager
        </h1>
        <Link href={`/admin/writing`}>
          <button className="btn btn-primary">+ Add New Test</button>
        </Link>
      </div>

      {localWritingData.length === 0 ? (
        <div className="alert alert-info">
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
          <span>No writing tests found. Create your first test!</span>
        </div>
      ) : (
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
              {localWritingData.map((test: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{test.title}</td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-info">{test.type}</span>
                  </td>
                  <td className="text-center py-4 px-6">{test.duration}</td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-outline">
                      {test.parts?.length} passages
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
                      <button className="btn btn-sm btn-outline">
                        Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        {showEditModal && selectedTest && formData && (
          <EditWriting
            formData={formData}
            handleInputChange={handleInputChange}
            removePart={removePart}
            handlePartChange={handlePartChange}
            addArrayItem={addArrayItem}
            handleArrayChange={handleArrayChange}
            error={error}
            addPart={addPart}
            setShowEditModal={setShowEditModal}
            isSaving={isSaving}
            handleSave={handleSave}
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
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllWriting;
