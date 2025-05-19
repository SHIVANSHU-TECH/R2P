import { useState } from 'react';
import { parseResume } from '../../lib/ResumeParse';
import { storage, db } from '../../lib/firebase/firebase'; // You'll need to create this
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ParseResume({ file, onComplete, onError }) {
  const [parseProgress, setParseProgress] = useState(0);

  const parseAndStoreResume = async () => {
    try {
      // Set initial progress
      setParseProgress(10);

      // Convert file to buffer for parsing
      const fileBuffer = await file.arrayBuffer();
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'docx';
      
      // Parse the resume
      setParseProgress(30);
      const parsedResume = await parseResume(fileBuffer, fileType);
      setParseProgress(50);
      
      // Create a reference to the file in Firebase Storage
      const timestamp = new Date().getTime();
      const fileName = `resumes/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload the original file to Firebase Storage
      setParseProgress(70);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Store the parsed data in Firestore
      setParseProgress(90);
      const resumeDoc = await addDoc(collection(db, 'resumes'), {
        fileName: file.name,
        fileURL: downloadURL,
        fileType,
        parsedData: parsedResume,
        createdAt: serverTimestamp()
      });
      
      setParseProgress(100);
      
      // Call the completion callback with the parsed data and document ID
      onComplete({
        id: resumeDoc.id,
        ...parsedResume,
        fileURL: downloadURL
      });
      
    } catch (error) {
      console.error('Error parsing and storing resume:', error);
      onError(error.message || 'Failed to parse and store resume');
    }
  };

  // Start parsing when the component renders
  useState(() => {
    if (file) {
      parseAndStoreResume();
    }
  }, [file]);

  return (
    <div className="w-full">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${parseProgress}%` }}
        ></div>
      </div>
      <p className="text-center mt-2 text-sm text-gray-600">
        {parseProgress < 100 ? 'Parsing resume...' : 'Resume parsed successfully!'}
      </p>
    </div>
  );
}