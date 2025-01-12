import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const { user } = useAuth();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  return (
    <div className="w-1/2 p-4 border-r overflow-auto">
      <h2 className="text-lg font-bold">Upload Resume</h2>
      {!user ? (
        <p className="text-red-600">Sign in to upload your resume.</p>
      ) : (
        <>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} />
          {file && <p className="mt-2 text-sm">Uploaded: {file.name}</p>}
        </>
      )}
    </div>
  );
}
