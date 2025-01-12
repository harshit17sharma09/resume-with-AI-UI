"use client";

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function ChatInterface({ jwtToken, resumeFile, setJwtToken }) {
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your AI resume assistant. I can help you analyze your resume and provide feedback. Feel free to ask me anything about your resume or just say hello!`
    }
  ]);
  const chatContainerRef = useRef(null);

  const MAX_MESSAGES = 3; // Adjust this number based on your needs

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleChat = async (e) => {
    if (e) e.preventDefault();
    
    if (!chatMessage.trim() || !resumeFile) {
      toast.error('Please provide both a message and a resume file');
      return;
    }

    // Store current values
    const currentMessage = chatMessage.trim();
    const currentFile = resumeFile;

    // Update UI immediately
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: currentMessage }]);
    setIsLoading(true);

    try {
      // Trim chat history if it exceeds MAX_MESSAGES
      const recentMessages = chatHistory.slice(-MAX_MESSAGES);
      
      const formData = new FormData();
      formData.append('query', currentMessage);
      formData.append('file', currentFile);
      formData.append('history', JSON.stringify(recentMessages));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const data = await response.json();
      
      if (data.new_token) {
        setJwtToken(data.new_token);
      }
      
      setChatHistory(prev => {
        const newHistory = [...prev, { role: 'assistant', content: data.response }];
        // Keep only the most recent messages
        return newHistory.slice(-MAX_MESSAGES);
      });

    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message');
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
        style={{ height: 'calc(600px - 80px)' }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#a8ff60] text-black'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {message.content}
              </pre>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <form 
          onSubmit={handleChat}
          className="flex gap-2"
        >
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#a8ff60]/50 
              bg-white text-gray-800 placeholder-gray-400"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !chatMessage.trim() || !resumeFile}
            className="px-4 py-2 bg-[#a8ff60] text-black rounded-lg 
              hover:bg-[#a8ff60]/80 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 