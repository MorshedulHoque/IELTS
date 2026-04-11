"use client";
import { getSingleUser, updateUser, getOnboardingData } from "@/services/data";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Loader from '@/components/Common/Loader';
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData]: any = useState();
  const [onboardingData, setOnboardingData]: any = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const { data }: any = useSession();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      await updateUser(data?.user.id, userData);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);

    try {
      // Create form data to send to your API route
      const formData = new FormData();
      formData.append("image", file);

      // Upload to your API endpoint
      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const { url } = await uploadResponse.json();

      // Update user data with new image URL
      setUserData((prev: any) => ({
        ...prev,
        image: url,
      }));

      // Immediately update the image in the backend
      await updateUser(data?.user.id, { image: url });

      toast.success("Profile image updated");
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Upload error:", error);
    } finally {
      setIsImageUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchSingleUser = async () => {
      if (data) {
        const result = await getSingleUser(data?.user.id);
        setUserData(result?.data);
        return result;
      }
    };
    
    const fetchOnboardingData = async () => {
      if (data?.user?.id) {
        try {
          const result = await getOnboardingData(data.user.id);
          setOnboardingData(result?.data);
        } catch (error) {
          console.error("Error fetching onboarding data:", error);
          setOnboardingData(null);
        }
      }
    };
    
    fetchSingleUser();
    fetchOnboardingData();
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Update your personal information"
              : "Manage your IELTS profile"}
          </p>
        </div>

        {userData ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 h-40 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="avatar">
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-white bg-red-100 flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 ${
                      isEditing ? "cursor-pointer group" : ""
                    }`}
                    onClick={isEditing ? triggerFileInput : undefined}
                    onMouseEnter={() => setIsHoveringImage(true)}
                    onMouseLeave={() => setIsHoveringImage(false)}
                  >
                    {isImageUploading ? (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Loader message="" className="!w-6 !h-6 !border-2 !border-white" />
                      </div>
                    ) : null}

                    <img
                      alt="Profile"
                      src={
                        userData.image ||
                        "https://img.daisyui.com/images/profile/demo/averagebulk@192.webp"
                      }
                      className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Camera icon overlay */}
                    {isEditing && (
                      <div
                        className={`
                        absolute inset-0 bg-black/40 flex items-center justify-center 
                        transition-opacity duration-300 rounded-full
                        ${isHoveringImage ? "opacity-100" : "opacity-0"}
                      `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Edit indicator badge */}
                    {isEditing && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                        Edit
                      </div>
                    )}
                  </div>
                </div>

                {/* Image change hint text */}
                {isEditing && (
                  <p className="text-xs text-center text-red-700 mt-2 animate-pulse">
                    Click on image to change
                  </p>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isImageUploading}
              />
              <div className="absolute right-6 top-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-light hover:bg-white/20 text-white transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost text-white hover:bg-white/20"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-6 pb-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <div className="text-lg font-semibold text-gray-900">
                        {userData.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <div className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {userData.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <div className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {userData.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={userData.location}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      <div className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {userData.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="textarea textarea-bordered w-full focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <p className="text-gray-700">{userData.bio}</p>
                  )}
                </div>

                {/* Onboarding Information Section */}
                {onboardingData && onboardingData.status === "completed" && (
                  <div className="mb-8 border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      IELTS Journey Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Purpose for IELTS */}
                      {onboardingData.purpose && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Purpose for IELTS
                          </label>
                          <div className="text-gray-900 font-medium">
                            {onboardingData.purpose}
                          </div>
                        </div>
                      )}

                      {/* Target Band Score */}
                      {onboardingData.targetScore && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Target Band Score
                          </label>
                          <div className="text-gray-900 font-medium">
                            {onboardingData.targetScore}
                          </div>
                        </div>
                      )}

                      {/* Expected Exam Date */}
                      {(onboardingData.examDate || onboardingData.examDateType || onboardingData.customExamDate) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Expected Exam Date
                          </label>
                          <div className="text-gray-900 font-medium">
                            {onboardingData.customExamDate || onboardingData.examDateType || onboardingData.examDate || "Not specified"}
                          </div>
                        </div>
                      )}

                      {/* Current English Level */}
                      {onboardingData.englishLevel && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Current English Level
                          </label>
                          <div className="text-gray-900 font-medium">
                            {onboardingData.englishLevel}
                          </div>
                        </div>
                      )}

                      {/* Hardest IELTS Module */}
                      {onboardingData.hardestModule && 
                       Array.isArray(onboardingData.hardestModule) && 
                       onboardingData.hardestModule.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Most Challenging Module(s)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {onboardingData.hardestModule.map((module: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
                              >
                                {module}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Target Countries */}
                      {onboardingData.targetCountries && 
                       Array.isArray(onboardingData.targetCountries) && 
                       onboardingData.targetCountries.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Target Country/Region
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {onboardingData.targetCountries.map((country: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
                              >
                                {country}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-6">
                  {isEditing && (
                    <button
                      type="submit"
                      className="btn btn-primary px-8 py-3 font-medium transition-transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader message="Loading profile..." className="!w-8 !h-8 !border-2 !border-red-800" />
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Profile;
