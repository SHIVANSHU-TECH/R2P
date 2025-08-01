import { useState } from 'react';

export default function ResumeUpload({ onParseComplete }) {
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setResumeData(result.data);
    setIsParsing(false);
    setIsUploaded(true);
        if (onParseComplete) {
          onParseComplete(result.data);
        }
      } else {
        setError(result.error || 'Failed to parse resume');
        setIsParsing(false);
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      setError('Failed to parse resume. Please try again.');
    setIsParsing(false);
    }
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
      
      {isParsing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Parsing your resume...</span>
          </div>
        </div>
      )}
      
      {resumeData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Parsed Resume Data</h3>
          <p className="text-sm text-green-600 mb-2">
            Resume successfully parsed! The data has been loaded into your portfolio.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Extracted Information:</h4>
            <ul className="text-sm space-y-1">
              {resumeData.personalInfo?.name && (
                <li>✅ Name: {resumeData.personalInfo.name}</li>
              )}
              {resumeData.personalInfo?.email && (
                <li>✅ Email: {resumeData.personalInfo.email}</li>
              )}
              {resumeData.personalInfo?.phone && (
                <li>✅ Phone: {resumeData.personalInfo.phone}</li>
              )}
              {resumeData.experience?.length > 0 && (
                <li>✅ Experience: {resumeData.experience.length} entries</li>
              )}
              {resumeData.education?.length > 0 && (
                <li>✅ Education: {resumeData.education.length} entries</li>
              )}
              {resumeData.skills?.length > 0 && (
                <li>✅ Skills: {resumeData.skills.length} skills extracted</li>
              )}
              {resumeData.projects?.length > 0 && (
                <li>✅ Projects: {resumeData.projects.length} projects</li>
              )}
              {resumeData.certifications?.length > 0 && (
                <li>✅ Certifications: {resumeData.certifications.length} certifications</li>
              )}
              {resumeData.languages?.length > 0 && (
                <li>✅ Languages: {resumeData.languages.length} languages</li>
              )}
              {resumeData.summary && (
                <li>✅ Summary: Professional summary extracted</li>
              )}
            </ul>
            
            {/* Show detailed breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-medium mb-2">Detailed Breakdown:</h5>
              <div className="text-xs space-y-1">
                {resumeData.personalInfo?.linkedin && (
                  <p>🔗 LinkedIn: {resumeData.personalInfo.linkedin}</p>
                )}
                {resumeData.personalInfo?.github && (
                  <p>💻 GitHub: {resumeData.personalInfo.github}</p>
                )}
                {resumeData.personalInfo?.website && (
                  <p>🌐 Website: {resumeData.personalInfo.website}</p>
                )}
                {resumeData.experience?.length > 0 && (
                  <div>
                    <p className="font-medium">💼 Experience Details:</p>
                    {resumeData.experience.slice(0, 2).map((exp, index) => (
                      <p key={index} className="ml-2">• {exp.title} at {exp.company}</p>
                    ))}
                    {resumeData.experience.length > 2 && (
                      <p className="ml-2 text-gray-500">... and {resumeData.experience.length - 2} more</p>
                    )}
                  </div>
                )}
                {resumeData.education?.length > 0 && (
                  <div>
                    <p className="font-medium">🎓 Education Details:</p>
                    {resumeData.education.slice(0, 2).map((edu, index) => (
                      <p key={index} className="ml-2">• {edu.degree} from {edu.institution}</p>
                    ))}
                    {resumeData.education.length > 2 && (
                      <p className="ml-2 text-gray-500">... and {resumeData.education.length - 2} more</p>
                    )}
                  </div>
                )}
                {resumeData.skills?.length > 0 && (
                  <div>
                    <p className="font-medium">🛠️ Skills (first 10):</p>
                    <p className="ml-2 text-gray-600">
                      {resumeData.skills.slice(0, 10).join(', ')}
                      {resumeData.skills.length > 10 && ` ... and ${resumeData.skills.length - 10} more`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}