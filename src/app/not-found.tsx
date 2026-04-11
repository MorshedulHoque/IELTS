"use client";
import Link from "next/link";
import React from "react";
import { FaHome, FaSearch, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-6">
            <FaExclamationTriangle className="text-6xl text-red-600" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-900 mb-4 leading-none">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Don't worry, let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <FaHome className="text-lg" />
            Go to Homepage
          </Link>
          <Link
            href="/test/reading"
            className="px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center gap-2"
          >
            <FaSearch className="text-lg" />
            Browse Tests
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { href: "/", label: "Home", icon: FaHome },
              { href: "/test/reading", label: "Reading Tests", icon: FaSearch },
              { href: "/test/listening", label: "Listening Tests", icon: FaSearch },
              { href: "/test/writing", label: "Writing Tests", icon: FaSearch },
              { href: "/test/speaking", label: "Speaking Tests", icon: FaSearch },
              { href: "/writing-samples", label: "Writing Samples", icon: FaSearch },
              { href: "/about", label: "About Us", icon: FaSearch },
              { href: "/contact", label: "Contact", icon: FaSearch },
            ].map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-gray-200"
                >
                  <IconComponent className="text-lg text-gray-400" />
                  <span className="font-medium text-gray-700">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12">
          <p className="text-gray-500 mb-4">
            If you believe this is an error, please{" "}
            <Link href="/contact" className="text-red-600 hover:underline font-medium">
              contact us
            </Link>
            {" "}and let us know.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

