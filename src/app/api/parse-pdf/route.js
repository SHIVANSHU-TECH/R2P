// app/api/parse-pdf/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export const runtime = 'nodejs';
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse PDF
    const data = await pdfParse(buffer);
    
    return NextResponse.json({ text: data.text, info:data.info, numPages:data.numpages });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}