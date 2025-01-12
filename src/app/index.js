import React from 'react';
import UploadResume from './UploadResume';
import ChatbotUI from './ChatbotUI';
import { AuthProvider } from './AuthContext';
import './globals.css';

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col h-screen">
        <header className="bg-blue-600 text-white text-center py-4">
          <h1 className="text-2xl font-bold">Resume Chatbot TESTING</h1>
        </header>
        <main className="flex flex-grow">
          <UploadResume />
          <ChatbotUI />
        </main>
      </div>
    </AuthProvider>
  );
}
