// lib/templates.js
import React from 'react';

export const templates = [
    {
      id: 'modern',
      name: 'Modern',
    description: 'Clean and professional design with gradient accents',
      previewComponent: () => (
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold">Modern Theme</h3>
          <p className="text-sm opacity-90">Clean & Professional</p>
        </div>
        </div>
      ),
      component: ModernTemplate
    },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design with focus on content',
    previewComponent: () => (
      <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border">
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Minimal Theme</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Simple & Elegant</p>
        </div>
      </div>
    ),
    component: MinimalTemplate
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and colorful design for creative professionals',
    previewComponent: () => (
      <div className="h-32 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold">Creative Theme</h3>
          <p className="text-sm opacity-90">Bold & Colorful</p>
        </div>
      </div>
    ),
    component: CreativeTemplate
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate-style design for business professionals',
    previewComponent: () => (
      <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg">
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold">Professional Theme</h3>
          <p className="text-sm opacity-90">Corporate & Trusted</p>
        </div>
      </div>
    ),
    component: ProfessionalTemplate
  }
];

// Modern Template Component
  function ModernTemplate({ data }) {
  // Handle missing data gracefully
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const summary = data?.summary || '';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center space-x-6">
            {personalInfo.photo && (
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{personalInfo.name || 'Your Name'}</h1>
              <p className="text-xl opacity-90 mb-4">{personalInfo.title || 'Professional Title'}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {personalInfo.email && (
                  <span className="flex items-center">
                    📧 {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center">
                    📞 {personalInfo.phone}
                  </span>
                )}
                {personalInfo.address && (
                  <span className="flex items-center">
                    📍 {personalInfo.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Summary Section */}
        {summary && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-800">{exp.title || 'Position'}</h3>
                  <p className="text-blue-600 font-medium">{exp.company || 'Company'}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-3">
                      <p className="text-blue-600 text-sm">
                        {project.technologies.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Education</h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-800">{edu.degree || 'Degree'}</h3>
                  <p className="text-green-600 font-medium">{edu.institution || 'Institution'}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-600 text-sm mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
          <div className="flex flex-wrap gap-4">
            {personalInfo.linkedin && (
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
              >
                GitHub
              </a>
            )}
            {personalInfo.email && (
              <a 
                href={`mailto:${personalInfo.email}`}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Email Me
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Minimal Template Component
function MinimalTemplate({ data }) {
  // Handle missing data gracefully
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const summary = data?.summary || '';

    return (
      <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-4">{personalInfo.name || 'Your Name'}</h1>
          <p className="text-xl text-gray-600 mb-6">{personalInfo.title || 'Professional Title'}</p>
          <div className="flex justify-center space-x-6 text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-12 text-center">
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="border-b border-gray-200 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.title || 'Position'}</h3>
                  <p className="text-gray-600 font-medium">{exp.company || 'Company'}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Skills</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-gray-500 text-sm">{project.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Education</h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                  <p className="text-gray-600 font-medium">{edu.institution || 'Institution'}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="text-center border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <div className="flex justify-center space-x-4">
            {personalInfo.linkedin && (
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            )}
            {personalInfo.email && (
              <a 
                href={`mailto:${personalInfo.email}`}
                className="text-gray-600 hover:text-gray-900"
              >
                Email
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Creative Template Component
function CreativeTemplate({ data }) {
  // Handle missing data gracefully
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const summary = data?.summary || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">{personalInfo.name || 'Your Name'}</h1>
            <p className="text-xl opacity-90 mb-6">{personalInfo.title || 'Professional Title'}</p>
            <div className="flex justify-center space-x-6 text-sm">
              {personalInfo.email && <span>📧 {personalInfo.email}</span>}
              {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Summary */}
        {summary && (
          <section className="mb-12 text-center">
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto text-lg">{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Skills</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800">{exp.title || 'Position'}</h3>
                  <p className="text-orange-600 font-medium">{exp.company || 'Company'}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {education.map((edu, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center">
                  <h3 className="text-xl font-bold text-gray-800">{edu.degree || 'Degree'}</h3>
                  <p className="text-orange-600 font-medium">{edu.institution || 'Institution'}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
          <div className="flex justify-center space-x-6">
            {personalInfo.linkedin && (
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-shadow"
              >
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-shadow"
              >
                GitHub
              </a>
            )}
            {personalInfo.email && (
              <a 
                href={`mailto:${personalInfo.email}`}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-shadow"
              >
                Email Me
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Professional Template Component
function ProfessionalTemplate({ data }) {
  // Handle missing data gracefully
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const summary = data?.summary || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{personalInfo.name || 'Your Name'}</h1>
            <p className="text-xl opacity-90 mb-6">{personalInfo.title || 'Professional Title'}</p>
            <div className="flex justify-center space-x-8 text-sm">
              {personalInfo.email && <span>📧 {personalInfo.email}</span>}
              {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
              {personalInfo.address && <span>📍 {personalInfo.address}</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Summary */}
        {summary && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Professional Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title || 'Position'}</h3>
                      <p className="text-blue-600 font-medium">{exp.company || 'Company'}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Core Competencies</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-blue-600 text-sm">{project.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Education</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              {education.map((edu, index) => (
                <div key={index} className={index > 0 ? 'border-t border-gray-200 pt-6 mt-6' : ''}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                      <p className="text-blue-600 font-medium">{edu.institution || 'Institution'}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-gray-600 text-sm mt-2">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="flex flex-wrap gap-4">
            {personalInfo.linkedin && (
              <a 
                href={personalInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a 
                href={personalInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition-colors"
              >
                GitHub
              </a>
            )}
            {personalInfo.email && (
              <a 
                href={`mailto:${personalInfo.email}`}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Email
              </a>
            )}
          </div>
        </section>
      </div>
      </div>
    );
  }