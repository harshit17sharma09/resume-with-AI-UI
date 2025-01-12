"use client";

import { useState, useEffect, useRef } from "react";
import SignInModal from "./components/SignInModal";
import NotificationPopup from "./components/NotificationPopup";
import { useSession, signOut } from "next-auth/react";
import SignInButton from "./components/SignInButton";
import { toast } from "react-hot-toast";
import ChatInterface from "./components/ChatInterface";

const getJwtToken = async (email) => {
  try {
    console.log("Getting JWT for email:", email);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });

    console.log("Request body:", JSON.stringify({ email: email }));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login error response:", errorText);
      throw new Error('Failed to get JWT token');
    }

    const data = await response.json();
    console.log("JWT token received:", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error getting JWT:', error);
    throw error;
  }
};

export default function Home() {
  const { data: session, status } = useSession();
  console.log("Session data:", session);
  const [resumeFile, setResumeFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [accessStatus, setAccessStatus] = useState({
    hasAccess: false,
    canRequest: true,
    lastUpdatedAt: null,
    minutesUntilNextRequest: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: `Welcome! I can help you analyze your resume. Here are some example questions you can ask:
      
• What are the key skills in my resume?
• How can I improve my work experience section?
• Is my education section well formatted?
• What suggestions do you have for my resume?
• Can you help me tailor this resume for a specific job?`
    }
  ]);
  const [jwtToken, setJwtToken] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const chatContainerRef = useRef(null);

  const checkAccessStatus = async () => {
    if (!jwtToken) {
      console.log("No JWT token available");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-access`, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check access status');
      }

      const data = await response.json();
      
      if (data.hasAccess !== accessStatus.hasAccess) {
        console.log("Access status changed:", data.hasAccess ? "Access granted" : "Access revoked");
        if (data.hasAccess) {
          toast.success("Access has been granted!");
        }
      }
      
      setAccessStatus(data);
    } catch (error) {
      console.error("Error checking access:", error);
      toast.error(error.message || "Failed to check access status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!jwtToken) {
      toast.error("Please sign in first");
      return;
    }

    try {
      setIsRequesting(true);
      
      console.log("Sending JWT in request-access:", jwtToken);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request-access`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json"
        },
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        
        try {
          const error = JSON.parse(errorText);
          throw new Error(error.detail || "Failed to request access");
        } catch (e) {
          throw new Error(errorText || "Failed to request access");
        }
      }

      toast.success("Access request submitted successfully");
      await checkAccessStatus();
      
    } catch (error) {
      console.error("Request access error:", error);
      toast.error(error.message || "Failed to request access");
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    if (session) {
      checkAccessStatus();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  const handleUploadClick = () => {
    if (!session) {
      setShowModal(true);
    } else {
      document.getElementById("fileInput").click();
    }
  };

  // Get JWT token when session is available
  useEffect(() => {
    const initializeJwt = async () => {
      if (session?.user?.email && !jwtToken) {
        try {
          console.log("Initializing JWT for email:", session.user.email);
          const jwt = await getJwtToken(session.user.email);
          setJwtToken(jwt);
        } catch (error) {
          console.error('Failed to initialize JWT:', error);
          toast.error('Authentication failed');
          setIsLoading(false);
        }
      } else if (!session) {
        setIsLoading(false);
      }
    };

    initializeJwt();
  }, [session]);

  // Add polling interval for access status
  useEffect(() => {
    let intervalId;

    const pollAccessStatus = () => {
      if (jwtToken) {
        checkAccessStatus();
      } else {
        setIsLoading(false);
      }
    };

    if (jwtToken) {
      // Initial check
      checkAccessStatus();
      
      // Set up polling every 10 seconds
      intervalId = setInterval(pollAccessStatus, 10000);
    }

    // Cleanup interval on unmount or when jwtToken changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jwtToken]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Add console logs to debug rendering conditions
  useEffect(() => {
    console.log("State updated:", {
      session: !!session,
      isLoading,
      accessStatus,
      jwtToken: !!jwtToken
    });
  }, [session, isLoading, accessStatus, jwtToken]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white py-4 shadow-md relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-lime-600">AI Resume Chatbot</h1>
          {session && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-500 transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 mt-2 text-center">
          Upload your resume and chat with our AI-powered assistant.
        </p>
      </header>

      <main className="flex-grow flex">
        {resumeFile ? (
          <div className="flex flex-grow">
            <div className="w-1/2 bg-white shadow-lg flex items-center justify-center h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border rounded-lg"
                title="Resume Viewer"
              ></iframe>
            </div>

            <div className="w-1/2 bg-gray-50 shadow-lg p-8">
              {session ? (
                isLoading ? (
                  <div className="text-center">
                    <p>Loading...</p>
                  </div>
                ) : accessStatus.hasAccess ? (
                  <div className="h-full flex flex-col">
                    <ChatInterface 
                      jwtToken={jwtToken}
                      resumeFile={resumeFile}
                      setJwtToken={setJwtToken}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Access Required</h2>
                    <p className="text-gray-500 mb-6">
                      {!accessStatus.canRequest 
                        ? `Please wait ${accessStatus.minutesUntilNextRequest} minute(s) before requesting again.`
                        : "You need access to use the chatbot. Please request access below."}
                    </p>
                    {accessStatus.canRequest && (
                      <button
                        onClick={handleRequestAccess}
                        disabled={isRequesting}
                        className={`px-6 py-3 ${
                          isRequesting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-lime-600 hover:bg-lime-500"
                        } text-white font-bold rounded-lg shadow-md transition-all`}
                      >
                        {isRequesting ? "Requesting..." : "Request Access"}
                      </button>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Please sign in to use the chatbot</p>
                  <SignInButton />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow">
            
            <button
              onClick={handleUploadClick}
              className="px-6 py-3 bg-lime-600 text-white font-bold rounded-lg shadow-md hover:bg-lime-500 transition-all"
            >
              Upload Resume
            </button>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
        )}
      </main>

      <footer className="bg-white py-4 text-center text-gray-500 shadow-md">
        <p>&copy; 2024 AI Resume Chatbot. All rights reserved.</p>
      </footer>

      {showModal && <SignInModal onClose={() => setShowModal(false)} />}
      {showNotification && (
        <NotificationPopup
          message="Access request successfully raised!"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}