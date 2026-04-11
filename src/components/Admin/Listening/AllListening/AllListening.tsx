"use client";
import { deleteListeningTest, editListeningTest } from "@/services/data";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AllDeleteModal from "../../Common/AllDeleteModal";
import EditListening from "./EditListening";

const AllListening = ({ listeningData, setListeningData }: any) => {
  const [selectedTest, setSelectedTest]: any = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedTest, setEditedTest] = useState<any>(null);

  const handleEdit = (test: any) => {
    setSelectedTest(test);
    setEditedTest(JSON.parse(JSON.stringify(test)));
    setShowEditModal(true);
  };

  const handleDelete = (test: any) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const saveChanges = () => {
    // Here you would typically save the changes to your database
    // For now, just update the state and close the modal
    setListeningData(
      listeningData.map((t: any) => (t._id === editedTest._id ? editedTest : t))
    );
    setShowEditModal(false);
    editListeningTest(selectedTest._id, editedTest);
    console.log("Listening Data", listeningData);
    toast.success("Listening test updated successfully");
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteListeningTest(selectedTest._id);

      // Update state to remove the deleted item
      setListeningData((prev: any) =>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Listening Tests Manager
        </h1>
        <Link href={`/admin/listening`}>
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
            {listeningData.map((test: any) => (
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
        <EditListening
          editedTest={editedTest}
          setEditedTest={setEditedTest}
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

export default AllListening;
