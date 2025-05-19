import { useState } from 'react';
import ParseResume from '../../lib/ResumeParse.server';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setIsUploaded(false);
    setIsParsing(false);
    setResumeData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Check if file is PDF or DOCX
    const fileType = file.type;
    if (fileType !== 'application/pdf' && 
        fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Start the parsing process
    setIsParsing(true);
    setError(null);
  };

  const handleParseComplete = (data) => {
    setResumeData(data);
    setIsParsing(false);
    setIsUploaded(true);
  };

  const handleParseError = (errorMessage) => {
    setError(errorMessage);
    setIsParsing(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="resume" 
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Select PDF or DOCX file
          </label>
          
          <input
            type="file"
            id="resume"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={isParsing || !file || isUploaded}
          className={`w-full py-2.5 px-4 rounded-md font-medium text-white 
            ${isParsing || !file || isUploaded
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isParsing ? 'Processing...' : 'Parse Resume'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isParsing && file && (
        <div className="mt-4">
          <ParseResume 
            file={file}
            onComplete={handleParseComplete}
            onError={handleParseError}
          />
        </div>
      )}
      
      {resumeData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Parsed Resume Data</h3>
          <p className="text-sm text-green-600 mb-2">
            Resume successfully stored in Firebase!
          </p>
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
            {JSON.stringify(resumeData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}