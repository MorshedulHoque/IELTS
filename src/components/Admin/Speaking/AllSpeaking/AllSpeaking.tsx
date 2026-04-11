"use client";
import { deleteSpeakingTest, editSpeakingTest } from "@/services/data";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AllDeleteModal from "../../Common/AllDeleteModal";
import EditSpeaking from "@/components/Admin/Speaking/AllSpeaking/EditSpeaking";

const AllSpeaking = ({ speakingData, setSpeakingData }: any) => {
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

  const saveChanges = async () => {
    if (!editedTest || !selectedTest) return;

    try {
      await editSpeakingTest(selectedTest._id, editedTest);

      // Update the speakingData state with the edited test
      setSpeakingData((prev: any) =>
        prev.map((test: any) =>
          test._id === selectedTest._id ? editedTest : test
        )
      );

      toast.success("Speaking test updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update operation failed");
    }
  };

  const confirmDelete = async () => {
    if (!selectedTest) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteSpeakingTest(selectedTest._id);

      // Update state to remove the deleted item
      setSpeakingData((prev: any) =>
        prev.filter((test: any) => test._id !== selectedTest._id)
      );

      toast.success("Speaking test deleted successfully");

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
          Speaking Tests Manager
        </h1>
        <Link href={`/admin/speaking`}>
          <button className="btn btn-primary">+ Add New Test</button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-4 px-6">Test Title</th>
              <th className="text-center py-4 px-6">Type</th>
              <th className="text-center py-4 px-6">Difficulty</th>
              <th className="text-center py-4 px-6">Questions</th>
              <th className="text-center py-4 px-6">Duration (min)</th>
              <th className="text-center py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakingData && speakingData.length > 0 ? (
              speakingData.map((test: any) => (
                <tr key={test._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{test.title || "Untitled"}</td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-info capitalize">
                      {test.type || "N/A"}
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-warning capitalize">
                      {test.difficulty || "N/A"}
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="badge badge-outline">
                      {test.questions?.length || 0} questions
                    </span>
                  </td>
                  <td className="text-center py-4 px-6">
                    {test.total_duration || 0}
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
                      <Link href={`/test/speaking/${test._id}`}>
                        <button className="btn btn-sm btn-outline">Preview</button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No speaking tests found. Create your first test!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedTest && editedTest && (
        <EditSpeaking
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

export default AllSpeaking;

