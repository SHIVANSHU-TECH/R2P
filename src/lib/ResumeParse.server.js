// src/lib/ResumeParse.server.js
import pdfparse from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Parse resume from PDF or DOCX file
 * @param {Buffer} fileBuffer - The file buffer to parse
 * @param {string} fileType - The file type ('pdf' or 'docx')
 * @returns {Object} Structured resume data
 */
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
  
  // Name pattern - look for name at the beginning, typically in all caps or title case
  const nameMatch = text.match(/^([A-Z][a-zA-Z\s]+)(?=\n|$)/);
  const name = nameMatch ? nameMatch[0].trim() : '';
  
  // LinkedIn URL pattern
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin\.com\/|linkedin:?)([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';
  
  // GitHub URL pattern
  const githubMatch = text.match(/(?:github\.com\/|github:?)([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? githubMatch[0] : '';
  
  // Address pattern
  const addressMatch = text.match(/(\d+\s+[\w\s]+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Ln|Rd|Blvd|Dr|St)\.?(?:\s+[A-Za-z]+,\s+[A-Z]{2}\s+\d{5}))/i);
  const address = addressMatch ? addressMatch[0].trim() : '';
  
  // Website/portfolio URL
  const website = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?)/i)?.[0] || '';

  return { 
    name,
    email, 
    phone,
    address,
    linkedin,
    github,
    website
  };
};

/**
 * Extract education information from resume text
 * @param {string} text - Resume text content
 * @returns {Array} Education entries
 */
    const extractEducation = (text) => {
      const education = [];
      
  // Look for education section with multiple patterns
  const educationSection = extractSection(text, ['EDUCATION', 'ACADEMIC', 'ACADEMIC BACKGROUND', 'EDUCATIONAL BACKGROUND']);
      
      if (!educationSection) return education;
      
  // Split by education entries
  const entries = educationSection.split(/\n(?=[A-Z][a-zA-Z\s]+(?:University|College|School|Institute|Academy|University|College))/);
  
  for (const entry of entries) {
    if (entry.trim().length === 0) continue;
    
    const lines = entry.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) continue;
    
    const firstLine = lines[0];
    
    // Extract degree
    const degreeMatch = firstLine.match(/([A-Z][a-zA-Z\s]+(?:Bachelor|Master|PhD|BSc|MSc|MBA|BBA|BS|MS|MA|Ph\.D|B\.Tech|M\.Tech|B\.E|M\.E))/);
    const degree = degreeMatch ? degreeMatch[0].trim() : '';
    
    // Extract institution
    const institutionMatch = firstLine.match(/([A-Z][a-zA-Z\s]+(?:University|College|School|Institute|Academy|University|College))/);
    const institution = institutionMatch ? institutionMatch[0].trim() : '';
    
    // Extract dates
    const dateMatch = firstLine.match(/(\d{4}(?:-\d{4}|-\s*Present)?)/);
    const dates = dateMatch ? dateMatch[0] : '';
    
    // Extract GPA
    const gpaMatch = firstLine.match(/GPA[:\s]*(\d+\.\d+)/i);
    const gpa = gpaMatch ? gpaMatch[1] : '';
    
    // Description is everything else
    const description = lines.slice(1).join('\n').trim();
    
    education.push({
      institution,
      degree,
      field: '',
      startDate: dates.split('-')[0] || '',
      endDate: dates.includes('-') ? dates.split('-')[1] : dates,
      gpa,
      description
    });
      }
      
      return education;
    };

/**
 * Extract work experience from resume text
 * @param {string} text - Resume text content
 * @returns {Array} Experience entries
 */
const extractExperience = (text) => {
  const experience = [];
  
  // Look for experience section with multiple patterns
  const experienceSection = extractSection(text, ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE', 'WORK HISTORY']);
  
  if (!experienceSection) return experience;

  // Split by experience entries
  const entries = experienceSection.split(/\n(?=[A-Z][a-zA-Z\s]+(?:Inc|Corp|LLC|Ltd|Company|Technologies|Solutions|Systems|Software|Tech))/);
  
  for (const entry of entries) {
    if (entry.trim().length === 0) continue;
    
    const lines = entry.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) continue;
    
    const firstLine = lines[0];
    
    // Extract job title
    const titleMatch = firstLine.match(/([A-Z][a-zA-Z\s]+(?:Developer|Engineer|Manager|Analyst|Specialist|Coordinator|Assistant|Director|Lead|Senior|Junior|Full Stack|Frontend|Backend|DevOps|Data|Software|Web|Mobile|UI|UX|Product|Project|Business|Marketing|Sales|HR|Finance|Operations))/);
    const title = titleMatch ? titleMatch[0].trim() : '';
    
    // Extract company name
    const companyMatch = firstLine.match(/([A-Z][a-zA-Z\s]+(?:Inc|Corp|LLC|Ltd|Company|Technologies|Solutions|Systems|Software|Tech|Labs|Studio|Agency|Consulting|Services))/);
    const company = companyMatch ? companyMatch[0].trim() : '';
    
    // Extract dates
    const dateMatch = firstLine.match(/(\d{4}(?:-\d{4}|-\s*Present)?)/);
    const dates = dateMatch ? dateMatch[0] : '';
    
    // Description is everything else
    const description = lines.slice(1).join('\n').trim();
    
    experience.push({
      title,
      company,
        location: '',
      startDate: dates.split('-')[0] || '',
      endDate: dates.includes('-') ? dates.split('-')[1] : dates,
      description
    });
  }
  
  return experience;
};

/**
 * Extract skills from resume text
 * @param {string} text - Resume text content
 * @returns {Array} Skills list
 */
const extractSkills = (text) => {
  // Look for skills section with multiple patterns
  const skillsSection = extractSection(text, ['SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES', 'TECHNOLOGIES', 'PROGRAMMING LANGUAGES']);
  
  if (!skillsSection) return [];
  
  // Split skills by common delimiters and clean them
  const skills = skillsSection
    .split(/[,|•\n]/)
      .map(skill => skill.trim())
    .filter(skill => skill.length > 0 && skill.length < 50 && !skill.match(/^(SKILLS|TECHNICAL|COMPETENCIES|TECHNOLOGIES|PROGRAMMING|LANGUAGES)$/i));

  return skills;
};

/**
 * Extract languages from resume text
 * @param {string} text - Resume text content
 * @returns {Array} Language entries
 */
const extractLanguages = (text) => {
  const languages = [];
  
  // Look for languages section
  const languagesSection = extractSection(text, ['LANGUAGES', 'LANGUAGE SKILLS']);
  
  if (!languagesSection) return languages;
  
  // Split by language entries
  const entries = languagesSection.split(/[,|•\n]/);
  
  for (const entry of entries) {
    if (entry.trim().length === 0) continue;
    
    // Look for language name and proficiency
    const languageMatch = entry.match(/([A-Z][a-zA-Z\s]+)(?:\s*[-–]\s*(Native|Fluent|Advanced|Intermediate|Basic|Beginner))?/);
    
    if (languageMatch) {
      const language = languageMatch[1].trim();
      const proficiency = languageMatch[2] || 'Intermediate';
      
      languages.push({
        language,
        proficiency
      });
    }
  }
  
  return languages;
};

/**
 * Extract certifications from resume text
 * @param {string} text - Resume text content
 * @returns {Array} Certification entries
 */
const extractCertifications = (text) => {
  const certifications = [];
  
  // Look for certifications section
  const certificationsSection = extractSection(text, ['CERTIFICATIONS', 'CERTIFICATES', 'LICENSES']);
  
  if (!certificationsSection) return certifications;
  
  // Split by certification entries
  const entries = certificationsSection.split(/\n(?=[A-Z][a-zA-Z\s]+)/);
  
  for (const entry of entries) {
    if (entry.trim().length === 0) continue;
    
    const lines = entry.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) continue;
    
    const firstLine = lines[0];
    
    // Look for certification name
    const nameMatch = firstLine.match(/([A-Z][a-zA-Z\s]+(?:Certification|Certificate|License|AWS|Azure|Google|Microsoft|Cisco|Oracle|Adobe|Salesforce))/);
    const name = nameMatch ? nameMatch[0].trim() : firstLine.trim();
    
    // Look for issuing organization
    const issuerMatch = firstLine.match(/([A-Z][a-zA-Z\s]+(?:Corporation|Inc|LLC|Institute|University|College|Academy))/);
    const issuer = issuerMatch ? issuerMatch[0].trim() : '';
    
    // Look for date
    const dateMatch = firstLine.match(/(\d{4}(?:-\d{2})?)/);
    const date = dateMatch ? dateMatch[0] : '';
    
    // Description is everything else
    const description = lines.slice(1).join('\n').trim();
    
    certifications.push({
      name,
      issuer,
      date,
      description
    });
  }
  
  return certifications;
};

/**
 * Extract projects from resume text
 * @param {string} text - Resume text content
 * @returns {Array} Project entries
 */
  const extractProjects = (text) => {
    const projects = [];
    
  // Look for projects section with multiple patterns
  const projectsSection = extractSection(text, ['PROJECTS', 'PERSONAL PROJECTS', 'ACADEMIC PROJECTS', 'PORTFOLIO']);
    
    if (!projectsSection) return projects;
    
  // Split by project entries - look for project names followed by technologies
    const entries = projectsSection.split(/\n(?=[A-Z][a-zA-Z\s]+\s*[\|\|])/);
    
    for (const entry of entries) {
      if (entry.trim().length === 0) continue;
      
      const lines = entry.split('\n').filter(line => line.trim().length > 0);
      if (lines.length === 0) continue;
      
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
      startDate: '',
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
  // Look for summary section with multiple patterns
  const summarySection = extractSection(text, ['SUMMARY', 'PROFESSIONAL SUMMARY', 'CAREER OBJECTIVE', 'OBJECTIVE', 'PROFILE', 'ABOUT']);
  
  // If found, clean it up
  if (summarySection) {
    return summarySection
      .replace(/^(?:SUMMARY|PROFESSIONAL SUMMARY|CAREER OBJECTIVE|OBJECTIVE|PROFILE|ABOUT):?\s*/i, '')
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
  // Try multiple patterns to find sections
  for (const header of sectionHeaders) {
    // Pattern 1: Header followed by content until next section
    const pattern1 = new RegExp(`${header}[\\s\\S]*?(?=(EDUCATION|EXPERIENCE|SKILLS|LANGUAGES|CERTIFICATIONS|PROJECTS|SUMMARY|PROFESSIONAL|WORK|EMPLOYMENT|ACADEMIC|PERSONAL|CONTACT|REFERENCES|$))`, 'i');
    let match = text.match(pattern1);
    if (match) return match[0].replace(new RegExp(`^${header}`, 'i'), '').trim();
    
    // Pattern 2: Header with colon
    const pattern2 = new RegExp(`${header}:\\s*([\\s\\S]*?)(?=(EDUCATION|EXPERIENCE|SKILLS|LANGUAGES|CERTIFICATIONS|PROJECTS|SUMMARY|PROFESSIONAL|WORK|EMPLOYMENT|ACADEMIC|PERSONAL|CONTACT|REFERENCES|$))`, 'i');
    match = text.match(pattern2);
    if (match) return match[1].trim();
  }
  
  return null;
};

export default parseResume;