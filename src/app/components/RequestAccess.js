"use client";

import React from "react";

export default function RequestAccess() {
    const handleRequestAccess = async () => {
        try {
          const token = await getSessionToken(); // Fetch the JWT token from NextAuth
          const response = await fetch("http://127.0.0.1:8000/request-access", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });
          if (response.ok) {
            setAccessRaised(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
          } else {
            console.error("Failed to request access:", response.status);
          }
        } catch (error) {
          console.error("Error requesting access:", error);
        }
      };
  return (
    <button
      className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-md shadow-md hover:bg-yellow-600"
      onClick={handleRequestAccess}
    >
      Request Access
    </button>
  );
}
