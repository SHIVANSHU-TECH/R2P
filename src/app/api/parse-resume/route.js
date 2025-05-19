import { NextResponse } from 'next/server';
import { parseResume } from '../../../lib/ResumeParse';
import { storage, db } from '../../../lib/firebase/firebase'; // Import your Firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const runtime = 'nodejs';
export async function POST(request) {
  try {
    // Parse the FormData
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' }, 
        { status: 400 }
      );
    }
    
    // Get file type
    const fileType = file.type === 'application/pdf' ? 'pdf' : 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : 
                    null;
    
    if (!fileType) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Please upload a PDF or DOCX file.' }, 
        { status: 400 }
      );
    }
    
    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse resume using the imported function
    const resumeData = await parseResume(buffer, fileType);
    
    // Upload to Firebase Storage
    const timestamp = new Date().getTime();
    const fileName = `resumes/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    await uploadBytes(storageRef, buffer);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Store metadata and parsed data in Firestore
    const resumeDoc = await addDoc(collection(db, 'resumes'), {
      fileName: file.name,
      fileURL: downloadURL,
      fileType,
      parsedData: resumeData,
      createdAt: serverTimestamp()
    });
    
    // Return success with parsed data and document ID
    return NextResponse.json({ 
      success: true, 
      data: {
        id: resumeDoc.id,
        ...resumeData,
        fileURL: downloadURL
      }
    });
    
  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to parse resume', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}