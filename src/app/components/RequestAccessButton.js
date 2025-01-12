'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function RequestAccessButton() {
  const { data: session } = useSession();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestAccess = async () => {
    if (!session) {
      toast.error("Please sign in first");
      return;
    }

    try {
      setIsRequesting(true);
      
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to request access");
      }

      const data = await response.json();
      toast.success("Access request submitted successfully");
      
    } catch (error) {
      console.error("Request access error:", error);
      toast.error(error.message || "Failed to request access");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <button
      onClick={handleRequestAccess}
      disabled={isRequesting || !session}
      className={`px-4 py-2 rounded-lg ${
        isRequesting 
          ? "bg-gray-400" 
          : "bg-blue-600 hover:bg-blue-700"
      } text-white font-semibold transition-colors`}
    >
      {isRequesting ? "Requesting..." : "Request Access"}
    </button>
  );
} 