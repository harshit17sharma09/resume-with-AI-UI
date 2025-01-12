"use client";

import React from "react";

export default function ResumeUploader({ onUpload, isSignedIn }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      onUpload(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold text-limeGreen mb-4">Upload Your Resume</h2>
      {!isSignedIn ? (
        <p className="text-gray-400">Sign in to upload your resume.</p>
      ) : (
        <input
          type="file"
          accept=".pdf"
          className="block w-full px-4 py-2 text-gray-900 bg-gray-300 rounded-md"
          onChange={handleFileUpload}
        />
      )}
    </div>
  );
}
