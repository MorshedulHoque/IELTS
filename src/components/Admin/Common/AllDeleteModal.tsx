import { deleteListeningTest } from "@/services/data";
import React, { useState } from "react";
import Loader from '@/components/Common/Loader';
import { toast } from "react-toastify";

const AllDeleteModal = ({
  selectedTest,
  setShowDeleteModal,
  error,
  confirmDelete,
  isDeleting,
}: any) => {
  return (
    <div>
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-xl">Confirm Deletion</h3>

          {error && (
            <div className="alert alert-error mt-4">
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
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <p className="py-4">
            Are you sure you want to delete the reading test:
            <span className="font-semibold"> {selectedTest?.title}</span>?
          </p>

          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>

            <button
              className="btn btn-error"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  Deleting...
                  <Loader message="" className="!w-4 !h-4 !border-2 ml-2" />
                </>
              ) : (
                "Delete Permanently"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDeleteModal;
