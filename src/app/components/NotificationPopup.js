"use client";

export default function NotificationPopup({ message, onClose }) {
  return (
    <div className="fixed top-5 right-5 bg-lime-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      <p>{message}</p>
      <button
        className="mt-2 text-sm text-gray-200 underline"
        onClick={onClose}
      >
        Dismiss
      </button>
    </div>
  );
}
