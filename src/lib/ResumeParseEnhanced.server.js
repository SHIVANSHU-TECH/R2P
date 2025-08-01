// src/lib/ResumeParseEnhanced.server.js
import pdfparse from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Enhanced resume parser with improved extraction capabilities
 * @param {Buffer} fileBuffer - The file buffer to parse
 * @param {string} fileType - The file type ('pdf' or 'docx')
 * @returns {Object} Structured resume data
 */
export const parseResumeEnhanced = async (fileBuffer, fileType) => {
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

  // Clean the text
  const cleanedText = cleanText(text);
  
  console.log('Raw extracted text:', cleanedText);
  
  // Structure parsed data with enhanced extraction
  const result = {
    personalInfo: extractPersonalInfoEnhanced(cleanedText),
    education: extractEducationEnhanced(cleanedText),
    experience: extractExperienceEnhanced(cleanedText),
    skills: extractSkillsEnhanced(cleanedText),
    languages: extractLanguagesEnhanced(cleanedText),
    certifications: extractCertificationsEnhanced(cleanedText),
    projects: extractProjectsEnhanced(cleanedText),
    summary: extractSummaryEnhanced(cleanedText)
  };
  
  console.log('Enhanced parser result:', JSON.stringify(result, null, 2));
  
  return result;
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
 * Enhanced personal information extraction with multiple strategies
 * @param {string} text - Resume text content
 * @returns {Object} Personal information
 */
const extractPersonalInfoEnhanced = (text) => {
  // Email pattern - more comprehensive
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';
  
  // Phone pattern - handles various formats including international
  const phonePatterns = [
    /(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?\s?[\s.-]?\d{3}[\s.-]?\d{4}/,
    /(\+\d{1,3}[\s.-]?)?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/,
    /(\+\d{1,3}[\s.-]?)?\d{10}/
  ];
  
  let phone = '';
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      phone = match[0];
      break;
    }
  }
  
  // Name extraction with multiple strategies
  let name = '';
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Strategy 1: First non-empty line that looks like a name
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && line.length < 50 && 
        !line.includes('@') && 
        !line.includes('http') && 
        !line.includes('www') &&
        !line.match(/^\d/) &&
        !line.includes('Resume') &&
        !line.includes('CV') &&
        line.match(/^[A-Za-z\s]+$/)) {
      name = line;
      break;
    }
  }
  
  // Strategy 2: Look for name patterns
  if (!name) {
    const namePatterns = [
      /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m,
      /^([A-Z]{2,}\s+[A-Z]{2,})/m,
      /Name[:\s]+([A-Za-z\s]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        name = match[1].trim();
        break;
      }
    }
  }
  
  // LinkedIn URL pattern
  const linkedinPatterns = [
    /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
    /linkedin\.com\/([a-zA-Z0-9_-]+)/i,
    /(https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i
  ];
  
  let linkedin = '';
  for (const pattern of linkedinPatterns) {
    const match = text.match(pattern);
    if (match) {
      linkedin = match[0].includes('http') ? match[0] : `https://${match[0]}`;
      break;
    }
  }
  
  // GitHub URL pattern
  const githubPatterns = [
    /github\.com\/([a-zA-Z0-9_-]+)/i,
    /(https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i
  ];
  
  let github = '';
  for (const pattern of githubPatterns) {
    const match = text.match(pattern);
    if (match) {
      github = match[0].includes('http') ? match[0] : `https://${match[0]}`;
      break;
    }
  }
  
  // Address pattern - more flexible
  const addressPatterns = [
    /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)[,\s]+[A-Za-z\s]+[,\s]+[A-Z]{2}\s+\d{5}/i,
    /[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5}/i,
    /[A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5}/i
  ];
  
  let address = '';
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) {
      address = match[0].trim();
      break;
    }
  }
  
  // Website/portfolio URL
  const websitePatterns = [
    /(https?:\/\/)?(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/i
  ];
  
  let website = '';
  for (const pattern of websitePatterns) {
    const match = text.match(pattern);
    if (match && !match[0].includes('linkedin') && !match[0].includes('github')) {
      website = match[0].includes('http') ? match[0] : `https://${match[0]}`;
      break;
    }
  }

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
 * Enhanced education extraction with multiple strategies
 * @param {string} text - Resume text content
 * @returns {Array} Education entries
 */
const extractEducationEnhanced = (text) => {
  const education = [];
  
  // Strategy 1: Look for education section
  const educationSection = extractSectionEnhanced(text, ['EDUCATION', 'ACADEMIC', 'ACADEMIC BACKGROUND', 'EDUCATIONAL BACKGROUND']);
  
  if (educationSection) {
    const lines = educationSection.split('\n').filter(line => line.trim().length > 0);
    
    let currentEntry = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this line contains institution or degree keywords
      const institutionKeywords = ['University', 'College', 'School', 'Institute', 'Academy'];
      const degreeKeywords = ['Bachelor', 'Master', 'PhD', 'BSc', 'MSc', 'MBA', 'BBA', 'BS', 'MS', 'MA', 'Ph.D', 'B.Tech', 'M.Tech', 'B.E', 'M.E', 'B.Com', 'M.Com', 'B.A', 'M.A'];
      
      const hasInstitution = institutionKeywords.some(keyword => trimmedLine.includes(keyword));
      const hasDegree = degreeKeywords.some(keyword => trimmedLine.includes(keyword));
      
      if (hasInstitution || hasDegree) {
        // Start a new education entry
        if (currentEntry) {
          education.push(currentEntry);
        }
        
        currentEntry = {
          institution: hasInstitution ? trimmedLine : '',
          degree: hasDegree ? trimmedLine : '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: ''
        };
        
        // Extract dates from the same line
        const dateMatch = trimmedLine.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
        if (dateMatch) {
          currentEntry.startDate = dateMatch[1];
          currentEntry.endDate = dateMatch[2];
        }
        
        // Extract GPA
        const gpaMatch = trimmedLine.match(/GPA[:\s]*(\d+\.\d+)/i);
        if (gpaMatch) {
          currentEntry.gpa = gpaMatch[1];
        }
      } else if (currentEntry) {
        // Add to description of current entry
        if (trimmedLine.match(/^\d{4}/)) {
          // This might be a date line
          const dateMatch = trimmedLine.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
          if (dateMatch) {
            currentEntry.startDate = dateMatch[1];
            currentEntry.endDate = dateMatch[2];
          }
        } else {
          currentEntry.description += (currentEntry.description ? ' ' : '') + trimmedLine;
        }
      }
    }
    
    if (currentEntry) {
      education.push(currentEntry);
    }
  }
  
  // Strategy 2: Look for education patterns in the entire text
  if (education.length === 0) {
    const educationPatterns = [
      // Pattern for "Institution, Degree, Year"
      /([A-Z][A-Za-z\s]+(?:University|College|School|Institute))[,\s]+([A-Za-z\s]+(?:Bachelor|Master|Science|Engineering|Technology|Computer))[,\s]*(\d{4}[-–]\d{4}|\d{4})/g,
      // Pattern for "Degree from Institution"
      /([A-Za-z\s]+(?:Bachelor|Master|Science|Engineering|Technology|Computer))[,\s]+(?:from\s+)?([A-Z][A-Za-z\s]+(?:University|College|School|Institute))[,\s]*(\d{4}[-–]\d{4}|\d{4})/g
    ];
    
    for (const pattern of educationPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const [, first, second, dates] = match;
        
        // Determine which is institution and which is degree
        const institutionKeywords = ['University', 'College', 'School', 'Institute'];
        const isFirstInstitution = institutionKeywords.some(keyword => first.includes(keyword));
        
        const institution = isFirstInstitution ? first.trim() : second.trim();
        const degree = isFirstInstitution ? second.trim() : first.trim();
        
        const dateMatch = dates.match(/(\d{4})(?:[-–](\d{4}))?/);
        const startDate = dateMatch ? dateMatch[1] : '';
        const endDate = dateMatch && dateMatch[2] ? dateMatch[2] : '';
        
        education.push({
          institution,
          degree,
          field: '',
          startDate,
          endDate,
          gpa: '',
          description: ''
        });
      }
    }
  }
  
  return education;
};

/**
 * Enhanced experience extraction with multiple strategies
 * @param {string} text - Resume text content
 * @returns {Array} Experience entries
 */
const extractExperienceEnhanced = (text) => {
  const experience = [];
  
  // Strategy 1: Look for experience section
  const experienceSection = extractSectionEnhanced(text, ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE', 'WORK HISTORY', 'CAREER']);
  
  if (experienceSection) {
    const lines = experienceSection.split('\n').filter(line => line.trim().length > 0);
    
    let currentEntry = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this line looks like a job title or company
      const jobTitleKeywords = ['Developer', 'Engineer', 'Manager', 'Analyst', 'Specialist', 'Coordinator', 'Assistant', 'Director', 'Lead', 'Senior', 'Junior', 'Intern', 'Consultant', 'Architect', 'Designer', 'Administrator', 'Officer', 'Representative', 'Associate', 'Founder', 'CEO', 'CTO', 'VP'];
      const companyKeywords = ['Inc', 'Corp', 'LLC', 'Ltd', 'Company', 'Technologies', 'Solutions', 'Systems', 'Software', 'Tech', 'Labs', 'Studio', 'Agency', 'Consulting', 'Services'];
      
      const hasJobTitle = jobTitleKeywords.some(keyword => line.includes(keyword));
      const hasCompany = companyKeywords.some(keyword => line.includes(keyword));
      
      // Check if line contains dates
      const hasDate = line.match(/\d{4}/);
      
      if ((hasJobTitle || hasCompany) && !hasDate) {
        // Start a new experience entry
        if (currentEntry) {
          experience.push(currentEntry);
        }
        
        currentEntry = {
          title: hasJobTitle ? line : '',
          company: hasCompany ? line : '',
          location: '',
          startDate: '',
          endDate: '',
          description: ''
        };
        
        // Check next line for additional info
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const nextHasJobTitle = jobTitleKeywords.some(keyword => nextLine.includes(keyword));
          const nextHasCompany = companyKeywords.some(keyword => nextLine.includes(keyword));
          
          if (hasJobTitle && nextHasCompany) {
            currentEntry.company = nextLine;
            i++; // Skip next line as we've processed it
          } else if (hasCompany && nextHasJobTitle) {
            currentEntry.title = nextLine;
            i++; // Skip next line as we've processed it
          }
        }
      } else if (hasDate && currentEntry) {
        // This line contains dates
        const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
        if (dateMatch) {
          currentEntry.startDate = dateMatch[1];
          currentEntry.endDate = dateMatch[2];
        }
      } else if (currentEntry && line.length > 10) {
        // Add to description
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          currentEntry.description += (currentEntry.description ? '\n' : '') + line;
        } else {
          currentEntry.description += (currentEntry.description ? ' ' : '') + line;
        }
      }
    }
    
    if (currentEntry) {
      experience.push(currentEntry);
    }
  }
  
  // Strategy 2: Look for experience patterns in the entire text
  if (experience.length === 0) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for job titles followed by company and dates
      const jobTitlePattern = /(Software Developer|Web Developer|Frontend Developer|Backend Developer|Full Stack Developer|Data Scientist|Product Manager|Project Manager|Business Analyst|Marketing Manager|Sales Representative|HR Manager|Financial Analyst|Graphic Designer|UX Designer|UI Designer|DevOps Engineer|System Administrator|Database Administrator|Network Engineer|Security Analyst|Quality Assurance|Technical Writer|Content Writer|Social Media Manager|Digital Marketing Specialist|SEO Specialist|Customer Service Representative|Operations Manager|Supply Chain Manager|Research Analyst|Consultant|Intern|Associate|Lead|Senior|Junior)/i;
      
      const jobMatch = line.match(jobTitlePattern);
      if (jobMatch) {
        const title = jobMatch[0];
        let company = '';
        let startDate = '';
        let endDate = '';
        let description = '';
        
        // Look for company in the same line or next line
        const companyPattern = /([A-Z][A-Za-z\s]+(?:Inc|Corp|LLC|Ltd|Company|Technologies|Solutions|Systems|Software|Tech|Labs|Studio|Agency|Consulting|Services))/;
        const companyMatch = line.match(companyPattern);
        if (companyMatch) {
          company = companyMatch[0];
        } else if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const nextCompanyMatch = nextLine.match(companyPattern);
          if (nextCompanyMatch) {
            company = nextCompanyMatch[0];
          }
        }
        
        // Look for dates in nearby lines
        for (let j = i; j < Math.min(i + 3, lines.length); j++) {
          const dateMatch = lines[j].match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
          if (dateMatch) {
            startDate = dateMatch[1];
            endDate = dateMatch[2];
            break;
          }
        }
        
        // Look for description in following lines
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const descLine = lines[j];
          if (descLine.startsWith('•') || descLine.startsWith('-') || descLine.startsWith('*')) {
            description += (description ? '\n' : '') + descLine;
          } else if (descLine.match(/^[A-Z]/) && descLine.length > 20) {
            break; // Likely start of next section
          }
        }
        
        experience.push({
          title,
          company,
          location: '',
          startDate,
          endDate,
          description
        });
      }
    }
  }
  
  return experience;
};

/**
 * Enhanced skills extraction
 * @param {string} text - Resume text content
 * @returns {Array} Skills list
 */
const extractSkillsEnhanced = (text) => {
  const skills = [];
  
  // Strategy 1: Look for skills section
  const skillsSection = extractSectionEnhanced(text, ['SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES', 'TECHNOLOGIES', 'PROGRAMMING LANGUAGES', 'TECHNICAL COMPETENCIES', 'CORE COMPETENCIES']);
  
  if (skillsSection) {
    // Split skills by common delimiters and clean them
    const skillsList = skillsSection
      .split(/[,|•\n\-\*]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1 && skill.length < 50 && !skill.match(/^(SKILLS|TECHNICAL|COMPETENCIES|TECHNOLOGIES|PROGRAMMING|LANGUAGES)$/i));
    
    skills.push(...skillsList);
  }
  
  // Strategy 2: Extract common technical skills from the entire text
  const commonSkills = [
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'TypeScript', 'Scala', 'Rust', 'Perl', 'R', 'MATLAB', 'SQL',
    
    // Web Technologies
    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js', 'Nuxt.js', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Less',
    
    // Backend Frameworks
    'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Express', 'Koa', 'Fastify',
    
    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Cassandra', 'DynamoDB', 'Firebase',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible',
    
    // Tools & Software
    'Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Slack', 'Trello', 'Asana', 'Figma', 'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign', 'Sketch', 'InVision',
    
    // Mobile Development
    'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin', 'Ionic',
    
    // Data Science & AI
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter', 'Tableau', 'Power BI',
    
    // Other Technologies
    'GraphQL', 'REST API', 'SOAP', 'Microservices', 'Serverless', 'WebSockets', 'OAuth', 'JWT', 'Elasticsearch', 'Apache Kafka', 'RabbitMQ'
  ];
  
  // Look for these skills in the text (case insensitive)
  const textLower = text.toLowerCase();
  for (const skill of commonSkills) {
    if (textLower.includes(skill.toLowerCase()) && !skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      skills.push(skill);
    }
  }
  
  // Remove duplicates and clean up
  return [...new Set(skills)].filter(skill => skill && skill.length > 1);
};

/**
 * Enhanced languages extraction
 * @param {string} text - Resume text content
 * @returns {Array} Language entries
 */
const extractLanguagesEnhanced = (text) => {
  const languages = [];
  
  // Look for languages section
  const languagesSection = extractSectionEnhanced(text, ['LANGUAGES', 'LANGUAGE SKILLS']);
  
  if (!languagesSection) return languages;
  
  // Common languages
  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish'];
  const proficiencyLevels = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic', 'Beginner', 'Conversational'];
  
  // Split by language entries
  const entries = languagesSection.split(/[,|•\n]/);
  
  for (const entry of entries) {
    if (entry.trim().length === 0) continue;
    
    const trimmedEntry = entry.trim();
    
    // Look for language name and proficiency
    let language = '';
    let proficiency = 'Intermediate';
    
    // Check if entry contains a common language
    for (const lang of commonLanguages) {
      if (trimmedEntry.toLowerCase().includes(lang.toLowerCase())) {
        language = lang;
        break;
      }
    }
    
    // Check for proficiency level
    for (const level of proficiencyLevels) {
      if (trimmedEntry.toLowerCase().includes(level.toLowerCase())) {
        proficiency = level;
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
 * Enhanced certifications extraction
 * @param {string} text - Resume text content
 * @returns {Array} Certification entries
 */
const extractCertificationsEnhanced = (text) => {
  const certifications = [];
  
  // Look for certifications section
  const certificationsSection = extractSectionEnhanced(text, ['CERTIFICATIONS', 'CERTIFICATES', 'LICENSES', 'CREDENTIALS']);
  
  if (!certificationsSection) return certifications;
  
  const lines = certificationsSection.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.length < 5) continue;
    
    // Extract certification name (everything before date or issuer)
    let name = trimmedLine;
    let issuer = '';
    let date = '';
    
    // Look for date
    const dateMatch = trimmedLine.match(/(\d{4}(?:-\d{2})?)/);
    if (dateMatch) {
      date = dateMatch[0];
      name = trimmedLine.replace(dateMatch[0], '').trim();
    }
    
    // Look for issuer
    const issuerKeywords = ['Microsoft', 'Google', 'Amazon', 'AWS', 'Oracle', 'Cisco', 'Adobe', 'Salesforce', 'IBM', 'CompTIA', 'PMI'];
    for (const keyword of issuerKeywords) {
      if (trimmedLine.includes(keyword)) {
        issuer = keyword;
        name = name.replace(keyword, '').trim();
        break;
      }
    }
    
    certifications.push({
      name: name.replace(/^[-•*]\s*/, '').trim(),
      issuer,
      date,
      description: ''
    });
  }
  
  return certifications;
};

/**
 * Enhanced projects extraction
 * @param {string} text - Resume text content
 * @returns {Array} Project entries
 */
const extractProjectsEnhanced = (text) => {
  const projects = [];
  
  // Strategy 1: Look for projects section
  const projectsSection = extractSectionEnhanced(text, ['PROJECTS', 'PERSONAL PROJECTS', 'ACADEMIC PROJECTS', 'PORTFOLIO', 'KEY PROJECTS']);
  
  if (projectsSection) {
    const lines = projectsSection.split('\n').filter(line => line.trim().length > 0);
    
    let currentProject = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this line looks like a project title
      if (trimmedLine.length > 5 && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('*')) {
        // Save previous project
        if (currentProject) {
          projects.push(currentProject);
        }
        
        // Start new project
        let title = trimmedLine;
        let technologies = [];
        
        // Check if line contains technologies (separated by |, -, or :)
        const techSeparators = ['|', ':', '–', '-'];
        for (const separator of techSeparators) {
          if (trimmedLine.includes(separator)) {
            const parts = trimmedLine.split(separator);
            title = parts[0].trim();
            if (parts[1]) {
              technologies = parts[1].split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
            }
            break;
          }
        }
        
        currentProject = {
          title,
          technologies,
          description: '',
          startDate: '',
          endDate: ''
        };
      } else if (currentProject && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*'))) {
        // Add to description
        currentProject.description += (currentProject.description ? '\n' : '') + trimmedLine;
      }
    }
    
    if (currentProject) {
      projects.push(currentProject);
    }
  }
  
  // Strategy 2: Look for project patterns in the entire text
  if (projects.length === 0) {
    const projectPatterns = [
      // Pattern for "Project Name | Technologies"
      /([A-Z][A-Za-z\s]+)\s*\|\s*([A-Za-z\s,]+)/g,
      // Pattern for "Project Name - Technologies"
      /([A-Z][A-Za-z\s]+)\s*[-–]\s*([A-Za-z\s,]+)/g
    ];
    
    for (const pattern of projectPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const title = match[1].trim();
        const techString = match[2].trim();
        
        const technologies = techString
          .split(/[,]/)
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0 && tech.length < 30);
        
        projects.push({
          title,
          technologies,
          description: '',
          startDate: '',
          endDate: ''
        });
      }
    }
  }
  
  return projects;
};

/**
 * Enhanced summary extraction
 * @param {string} text - Resume text content
 * @returns {string} Summary text
 */
const extractSummaryEnhanced = (text) => {
  // Strategy 1: Look for summary section
  const summarySection = extractSectionEnhanced(text, ['SUMMARY', 'PROFESSIONAL SUMMARY', 'CAREER OBJECTIVE', 'OBJECTIVE', 'PROFILE', 'ABOUT', 'OVERVIEW']);
  
  if (summarySection) {
    return summarySection
      .replace(/^(?:SUMMARY|PROFESSIONAL SUMMARY|CAREER OBJECTIVE|OBJECTIVE|PROFILE|ABOUT|OVERVIEW):?\s*/i, '')
      .trim();
  }
  
  // Strategy 2: Look for the first substantial paragraph that looks like a summary
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const line of lines.slice(0, 10)) { // Check first 10 lines
    if (line.length > 50 && line.length < 500 && 
        (line.includes('experience') || line.includes('skilled') || line.includes('professional') || 
         line.includes('developer') || line.includes('engineer') || line.includes('manager'))) {
      return line;
    }
  }
  
  // Strategy 3: Return the first paragraph that's long enough
  for (const line of lines.slice(0, 5)) {
    if (line.length > 30 && line.length < 300) {
      return line;
    }
  }
  
  return '';
};

/**
 * Enhanced helper function to extract sections from text
 * @param {string} text - Full text content
 * @param {Array} sectionHeaders - Possible section header names
 * @returns {string|null} Section content or null if not found
 */
const extractSectionEnhanced = (text, sectionHeaders) => {
  const lines = text.split('\n');
  
  for (const header of sectionHeaders) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line matches header (case insensitive, with optional colons/dashes)
      if (line.match(new RegExp(`^${header}[:\\s-]*$`, 'i'))) {
        // Found header, collect content until next section
        let content = '';
        let j = i + 1;
        
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          
          // Check if this is the start of another section
          const sectionKeywords = ['EDUCATION', 'EXPERIENCE', 'SKILLS', 'LANGUAGES', 'CERTIFICATIONS', 'PROJECTS', 'SUMMARY', 'PROFESSIONAL', 'WORK', 'EMPLOYMENT', 'ACADEMIC', 'PERSONAL', 'CONTACT', 'REFERENCES', 'OBJECTIVE', 'PROFILE', 'ABOUT', 'OVERVIEW'];
          const isNewSection = sectionKeywords.some(keyword => 
            nextLine.match(new RegExp(`^${keyword}[:\\s-]*$`, 'i'))
          );
          
          if (isNewSection) {
            break;
          }
          
          if (nextLine.length > 0) {
            content += (content ? '\n' : '') + nextLine;
          }
          
          j++;
        }
        
        if (content.trim().length > 0) {
          return content.trim();
        }
      }
    }
  }
  
  return null;
};

export default parseResumeEnhanced;