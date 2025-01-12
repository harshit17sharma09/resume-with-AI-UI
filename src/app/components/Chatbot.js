"use client";

import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const response = await fetch('/api/openai/route', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    setMessages([...messages, { user: input, bot: data.reply }]);
    setInput('');
  };

  return (
    <div className="w-full p-4 bg-gray-700 rounded-lg shadow-lg">
      <div className="h-64 overflow-y-auto bg-gray-800 p-4 rounded-md mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 text-gray-300">
            <p><strong className="text-limeGreen">User:</strong> {msg.user}</p>
            <p><strong className="text-limeGreen">Bot:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        className="w-full p-2 bg-gray-600 text-white rounded-md mb-4"
        placeholder="Ask a question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-limeGreen text-gray-800 font-bold rounded-lg hover:bg-metallicGreen"
      >
        Send
      </button>
    </div>
  );
}
