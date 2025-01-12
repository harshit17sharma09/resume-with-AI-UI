"use client";

import { signIn } from "next-auth/react";

export default function SignInModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-lime-600 mb-4">Sign In Required</h2>
        <p className="text-gray-500 mb-6">
          Please sign in with Google to upload your resume and access the chatbot.
        </p>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 bg-lime-600 text-white font-bold rounded-lg shadow-md hover:bg-lime-500 transition-all"
        >
          Sign In with Google
        </button>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
