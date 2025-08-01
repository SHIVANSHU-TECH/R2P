import { NextResponse } from 'next/server';
import { parseResumeEnhanced } from '../../../lib/ResumeParseEnhanced.server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : 
                    fileName.endsWith('.docx') ? 'docx' : null;

    if (!fileType) {
      return NextResponse.json({ 
        error: 'Unsupported file type. Please upload a PDF or DOCX file.' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse the resume using enhanced parser
    const parsedData = await parseResumeEnhanced(buffer, fileType);

    console.log('Resume parsed successfully:', parsedData);

    return NextResponse.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json({ 
      error: 'Failed to parse resume. Please try again.' 
    }, { status: 500 });
  }
}