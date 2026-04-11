import React from "react";

interface LoaderProps {
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading...", className = "" }) => (
  <div className={`flex flex-col items-center justify-center min-h-screen ${className}`} role="status" aria-busy="true">
    <div className="border-t-2 border-red-700 rounded-full w-12 h-12 animate-spin" aria-hidden="true"></div>
    {message && (
      <p className="mt-4 text-lg text-gray-600">
        {message}
      </p>
    )}
  </div>
);

export default Loader;
