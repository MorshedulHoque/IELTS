"use client";
import { postUser } from "@/services/data";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const AddUser = () => {
  // Initialize formData with proper structure
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin", // Set default value
    type: "free",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "admin",
      type: "free",
    });
    try {
      await postUser(formData);
      toast.success("User Created Successfully");
    } catch (err) {
      toast.error("Failed to Create User");
    }
  };

  // Handler for clear button
  const handleClear = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "admin",
      type: "free",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Add New User</h1>
            <p className="text-indigo-200 mt-2">
              Create new accounts for IELTS platform users
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">User Name</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input input-bordered bg-base-100"
                  placeholder="John"
                  required
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered bg-base-100"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered bg-base-100"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text font-semibold">User Role</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-base-100"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {/* Type Selection */}
              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text font-semibold">User Type</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-base-100"
                >
                  <option value="paid">Paid</option>
                  <option value="free">Free</option>
                  <option value="others">Other Plan</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                className="btn btn-outline btn-error"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
