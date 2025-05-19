// src/lib/resumeParser.js
import  pdfparse  from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Parse resume from PDF or DOCX file
 * @param {Buffer} fileBuffer - The file buffer to parse
 * @param {string} fileType - The file type ('pdf' or 'docx')
 * @returns {Object} Structured resume data
 */

  let parsePDF;

  if (typeof window !== 'undefined') {
    throw new Error('ResumeParse.server.js should never be imported in the browser');
  }

  export async function parsePDFBuffer(buffer) {
    if (!parsePDF) {
      throw new Error('PDF parsing only supported on the server');
    }

    return await parsePDF(buffer);
  }
export const parseResume = async (fileBuffer, fileType) => {
  let text = '';
  
  if (fileType === 'pdf') {
    
    const data = await pdfparse(fileBuffer);
    text = data.text;
  } else if (fileType === 'docx') {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    text = value;
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  // Clean the text to remove excessive whitespace and normalize
  const cleanedText = cleanText(text);
  
  // Structure parsed data
  return {
    personalInfo: extractPersonalInfo(cleanedText),
    education: extractEducation(cleanedText),
    experience: extractExperience(cleanedText),
    skills: extractSkills(cleanedText),
    languages: extractLanguages(cleanedText),
    certifications: extractCertifications(cleanedText),
    projects: extractProjects(cleanedText),
    summary: extractSummary(cleanedText)
  };
};

/**
 * Clean and normalize text
 * @param {string} text - Raw extracted text
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
};

/**
 * Extract personal information from resume text
 * @param {string} text - Resume text content
 * @returns {Object} Personal information
 */
const extractPersonalInfo = (text) => {
  // Email pattern
  const email = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/)?.[0] || '';
  
  // Phone pattern - handles various formats including international
  const phone = text.match(/(\+\d{1,3}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)?.[0] || '';
  
  // Name pattern - typically at the beginning of the resume
  // Extract the first line that looks like a name in all caps
  const nameMatch = text.match(/^([A-Z][A-Z\s]+)(?=\n)/);
  const name = nameMatch ? nameMatch[0].trim() : '';
  
  // LinkedIn URL pattern - improved to catch profile mentions
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin\.com\/|linkedin:?)([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';
  
  // GitHub URL pattern
  const githubMatch = text.match(/(?:github\.com\/|github:?)([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? githubMatch[0] : '';
  
  // Address pattern - looks for common address patterns
  const addressMatch = text.match(/(\d+\s+[\w\s]+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Ln|Rd|Blvd|Dr|St)\.?(?:\s+[A-Za-z]+,\s+[A-Z]{2}\s+\d{5}))/i);
  const address = addressMatch ? addressMatch[0].trim() : '';
  
  // Website/portfolio URL
  const website = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?)/i)?.[0] || '';

  return { 
    name,
    email, 
    phone,
    linkedin,
    github,
    address,
    website
  };
};

/**
 * Extract education information
 * @param {string} text - Resume text content
 * @returns {Array} Education entries
 */
    const extractEducation = (text) => {
      const education = [];
      
      // Look for education section with more flexible patterns
      const educationSection = extractSection(text, ['EDUCATION', 'ACADEMIC BACKGROUND', 'ACADEMIC CREDENTIALS']);
      
      if (!educationSection) return education;
      
      // Split by newlines to find potential entries
      const lines = educationSection.split('\n').filter(line => line.trim().length > 0);
      
      let currentEducation = {
        university: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: ''
      };
      
      // Process line by line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for university name at the beginning of a line
        if (i === 0 || line.match(/^[A-Z]+/)) {
          // If we have collected info for the previous entry, add it
          if (currentEducation.university && (currentEducation.degree || currentEducation.fieldOfStudy)) {
            education.push({...currentEducation});
          }
          
          // Start a new entry
          currentEducation = {
            university: line,
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: ''
          };
          
          // Try to extract dates from the same line
          const dates = line.match(/\d{4}-\d{4}|\d{4}\s*-\s*\d{4}|\d{4}\s*-\s*present/i);
          if (dates) {
            const [start, end] = dates[0].split('-').map(d => d.trim());
            currentEducation.startDate = start;
            currentEducation.endDate = end || 'Present';
          }
        } 
        // Look for GPA
        else if (line.match(/GPA|Grade/i)) {
          const gpaMatch = line.match(/(\d+\.\d+)\s*\/\s*(\d+\.\d+)/);
          if (gpaMatch) {
            currentEducation.gpa = `${gpaMatch[1]}/${gpaMatch[2]}`;
          }
        }
        // Look for degree and field of study
        else if (line.match(/Bachelor|Master|Doctor|Ph\.D|BSc|MSc|BA|MA|MBA/i)) {
          currentEducation.degree = line;
        }
        // Otherwise, it might be additional information
        else {
          if (!currentEducation.fieldOfStudy) {
            currentEducation.fieldOfStudy = line;
          }
        }
      }
      
      // Add the last entry if not empty
      if (currentEducation.university && (currentEducation.degree || currentEducation.fieldOfStudy)) {
        education.push(currentEducation);
      }
      
      return education;
    };

/**
 * Extract work experience information
 * @param {string} text - Resume text content
 * @returns {Array} Experience entries
 */
const extractExperience = (text) => {
  const experience = [];
  const experienceSection = extractSection(text, ['Experience', 'EXPERIENCE', 'WORK EXPERIENCE']);
  if (!experienceSection) return experience;

  const lines = experienceSection.split('\n').map(l => l.trim()).filter(Boolean);
  
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect company + date line (e.g., "Salesforce July 2022 - Sep 2022")
    const dateRegex = /(.+?)\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s*[-–]\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|Present|Current|Now)/i;
    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      if (current) experience.push(current);

      current = {
        company: dateMatch[1].trim(),
        startDate: dateMatch[2].trim(),
        endDate: dateMatch[3].trim(),
        title: '',
        location: '',
        description: ''
      };
    } else if (current) {
      // Assume next line is title + maybe location
      const locMatch = line.match(/(.+?)\s+([A-Za-z]+\s*,\s*[A-Za-z]+)/);
      if (!current.title && locMatch) {
        current.title = locMatch[1].trim();
        current.location = locMatch[2].trim();
      } else if (!current.title) {
        current.title = line;
      } else {
        current.description += line + '\n';
      }
    }
  }

  if (current) experience.push(current);
  return experience;
};

/**
 * Extract skills from resume
 * @param {string} text - Resume text content
 * @returns {Object} Categorized skills
 */
const extractSkills = (text) => {
  const skillsSection = extractSection(text, ['TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'KEY SKILLS']);
  if (!skillsSection) return { technical: [], soft: [] };

  const technical = [];
  const soft = [];

  const lines = skillsSection.split('\n').map(l => l.trim()).filter(Boolean);
  const techKeywords = ['languages', 'frameworks', 'libraries', 'database', 'web design', 'software tools', 'version control'];

  lines.forEach(line => {
    const [label, ...rest] = line.split(':');
    const key = label.toLowerCase().trim();

    if (techKeywords.some(k => key.includes(k))) {
      const rawSkills = rest.join(':') || ''; // Handle multiple colons
      rawSkills.split(',').map(s => s.trim()).forEach(skill => {
        if (skill) technical.push(skill);
      });
    }
  });

  // Fallback: extract all comma-separated values
  if (technical.length === 0) {
    skillsSection
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill)
      .forEach(skill => technical.push(skill));
  }

  return { technical, soft }; // You can add soft skills logic later
};

/**
 * Extract languages from resume
 * @param {string} text - Resume text content
 * @returns {Array} Language proficiencies
 */
const extractLanguages = (text) => {
  const languages = [];
  
  // Look for languages section
  const languageSection = extractSection(text, ['LANGUAGES', 'LANGUAGE PROFICIENCY', 'FOREIGN LANGUAGES']);
  
  if (!languageSection) return languages;
  
  // Common language proficiency levels
  const proficiencyLevels = [
    'native', 'fluent', 'proficient', 'intermediate', 'beginner', 'basic',
    'advanced', 'business', 'conversational', 'elementary', 'professional'
  ];
  
  // Common languages
  const commonLanguages = [
    'english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'italian',
    'russian', 'portuguese', 'arabic', 'hindi', 'korean', 'dutch', 'swedish',
    'greek', 'turkish', 'polish', 'vietnamese', 'thai', 'indonesian', 'malay',
    'persian', 'urdu', 'bengali', 'tamil', 'telugu', 'marathi', 'kannada'
  ];
  
  // Split language entries by commas, semicolons, or newlines
  const languageEntries = languageSection
    .split(/[,;\n]/)
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);
  
  for (const entry of languageEntries) {
    // Look for language name
    let language = '';
    for (const lang of commonLanguages) {
      if (entry.toLowerCase().includes(lang)) {
        language = lang.charAt(0).toUpperCase() + lang.slice(1);
        break;
      }
    }
    
    // If no common language found, try to extract based on capitalization
    if (!language) {
      const langMatch = entry.match(/([A-Z][a-z]+)/);
      language = langMatch ? langMatch[0] : '';
    }
    
    // Look for proficiency level
    let proficiency = '';
    for (const level of proficiencyLevels) {
      if (entry.toLowerCase().includes(level)) {
        proficiency = level.charAt(0).toUpperCase() + level.slice(1);
        break;
      }
    }
    
    if (language) {
      languages.push({
        language,
        proficiency
      });
    }
  }
  
  return languages;
};

/**
 * Extract certifications from resume
 * @param {string} text - Resume text content
 * @returns {Array} Certification entries
 */
const extractCertifications = (text) => {
  const certifications = [];
  
  // Look for certifications section
  const certSection = extractSection(text, ['CERTIFICATIONS', 'CERTIFICATES', 'PROFESSIONAL CERTIFICATIONS']);
  
  if (!certSection) return certifications;
  
  // Common certification keywords
  const certKeywords = [
    'certified', 'certificate', 'certification', 'license', 'aws', 'microsoft',
    'oracle', 'cisco', 'comptia', 'pmp', 'scrum', 'agile', 'itil', 'six sigma',
    'cpa', 'cfa', 'cma', 'cissp', 'ceh', 'rhce', 'mcse', 'ccna', 'prince2'
  ];
  
  // Date pattern
  const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{4}|(?:19|20)\d{2}/gi;
  
  // Split entries by bullet points or newlines
  const certEntries = certSection
    .split(/[•\-\n]/)
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);
  
  for (const entry of certEntries) {
    // Check if entry contains certification keywords
    const hasCertKeyword = certKeywords.some(keyword => 
      entry.toLowerCase().includes(keyword)
    );
    
    if (!hasCertKeyword) continue;
    
    // Look for dates
    const dates = entry.match(datePattern);
    const issueDate = dates && dates.length > 0 ? dates[0] : '';
    const expireDate = dates && dates.length > 1 ? dates[1] : '';
    
    // Extract certification name - this is complex but we'll use a simple approach
    let name = entry;
    if (issueDate) name = name.replace(issueDate, '');
    if (expireDate) name = name.replace(expireDate, '');
    name = name.replace(/issued by|provider:|certificate:|certification:/i, '').trim();
    
    // Extract issuer if present
    const issuerMatch = entry.match(/(?:issued by|provider:)\s+([A-Za-z][A-Za-z\s]+)/i);
    const issuer = issuerMatch ? issuerMatch[1].trim() : '';
    
    certifications.push({
      name,
      issuer,
      issueDate,
      expireDate
    });
  }
  
  return certifications;
};

/**
 * Extract projects from resume
 * @param {string} text - Resume text content
 * @returns {Array} Project entries
 */
  const extractProjects = (text) => {
    const projects = [];
    
    // Look for projects section
    const projectsSection = extractSection(text, ['PROJECTS', 'PERSONAL PROJECTS', 'ACADEMIC PROJECTS']);
    
    if (!projectsSection) return projects;
    
    // Split by project entries (each project likely starts with its name in a new line)
    const entries = projectsSection.split(/\n(?=[A-Z][a-zA-Z\s]+\s*[\|\|])/);
    
    for (const entry of entries) {
      if (entry.trim().length === 0) continue;
      
      const lines = entry.split('\n').filter(line => line.trim().length > 0);
      if (lines.length === 0) continue;
      
      // First line typically contains the project title and technologies
      const firstLine = lines[0];
      
      // Split by pipe or vertical bar to separate title from technologies
      const parts = firstLine.split(/[\|\|]/);
      
      const title = parts[0].trim();
      const techString = parts.length > 1 ? parts[1].trim() : '';
      
      // Parse technologies as a list
      const technologies = techString
        .split(/[,]/)
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      // Description is everything else
      const description = lines.slice(1).join('\n').trim();
      
      projects.push({
        title,
        technologies,
        description,
        startDate: '',  // These may not be present in the format
        endDate: ''
      });
    }
    
    return projects;
  };


/**
 * Extract professional summary or objective
 * @param {string} text - Resume text content
 * @returns {string} Summary text
 */
const extractSummary = (text) => {
  // Look for summary section
  const summarySection = extractSection(text, ['SUMMARY', 'PROFESSIONAL SUMMARY', 'CAREER OBJECTIVE', 'OBJECTIVE', 'PROFILE']);
  
  // If found, clean it up
  if (summarySection) {
    return summarySection
      .replace(/^(?:SUMMARY|PROFESSIONAL SUMMARY|CAREER OBJECTIVE|OBJECTIVE|PROFILE):?\s*/i, '')
      .trim();
  }
  
  // If no explicit summary section, try to find the first paragraph
  const firstParagraphMatch = text.match(/^([^A-Z]{0,20}[A-Z][^\.]+\.)(?=\s)/);
  return firstParagraphMatch ? firstParagraphMatch[0].trim() : '';
};

/**
 * Helper function to extract sections from text
 * @param {string} text - Full text content
 * @param {Array} sectionHeaders - Possible section header names
 * @returns {string|null} Section content or null if not found
 */
const extractSection = (text, sectionHeaders) => {
  // First try the original pattern
  const originalPattern = new RegExp(
    `(${sectionHeaders.join('|')})(?::|\n|\\s)+((?:[\\s\\S](?!${sectionHeaders.join('|')}|EDUCATION|EXPERIENCE|SKILLS|LANGUAGES|CERTIFICATIONS|PROJECTS|SUMMARY|PROFESSIONAL|WORK|EMPLOYMENT|ACADEMIC|PERSONAL|CONTACT|REFERENCES))*?)(?=(EDUCATION|EXPERIENCE|SKILLS|LANGUAGES|CERTIFICATIONS|PROJECTS|SUMMARY|PROFESSIONAL|WORK|EMPLOYMENT|ACADEMIC|PERSONAL|CONTACT|REFERENCES|$))`,
    'i'
  );
  
  let match = text.match(originalPattern);
  if (match) return match[2].trim();
  
  // Try a simpler pattern for sections that might be formatted differently
  for (const header of sectionHeaders) {
    const simplePattern = new RegExp(`${header}[\\s\\S]*?(?=(EDUCATION|EXPERIENCE|SKILLS|LANGUAGES|CERTIFICATIONS|PROJECTS|SUMMARY|PROFESSIONAL|WORK|EMPLOYMENT|ACADEMIC|PERSONAL|CONTACT|REFERENCES|$))`, 'i');
    match = text.match(simplePattern);
    if (match) return match[0].replace(new RegExp(`^${header}`, 'i'), '').trim();
  }
  
  return null;
};


export default parseResume;