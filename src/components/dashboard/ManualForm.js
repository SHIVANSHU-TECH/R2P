'use client';
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiAward, FiLink, FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiMail, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineLightBulb, HiOutlineSparkles, HiOutlineCode, HiOutlineDocumentText } from 'react-icons/hi';

export default function ManualForm({ onComplete }) {
  const { portfolioData, updateData } = usePortfolio();
  const [expanded, setExpanded] = useState({
    personalInfo: true,
    aboutMe: false,
    experience: false,
    education: false,
    skills: false, 
    projects: false,
    certifications: false,
    socialLinks: false
  });
  const [activeExperience, setActiveExperience] = useState(null);
  const [activeEducation, setActiveEducation] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const toggleSection = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section]
    });
  };

  const handleInputChange = (section, field, value) => {
    updateData(section, {
      ...portfolioData[section],
      [field]: value
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        handleInputChange('personalInfo', 'photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...portfolioData.experience];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    updateData('experience', newExperiences);
  };

  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: []
    };
    updateData('experience', [...portfolioData.experience, newExperience]);
    setTimeout(() => {
      setActiveExperience(portfolioData.experience.length);
    }, 100);
  };

  const removeExperience = (index) => {
    const newExperiences = [...portfolioData.experience];
    newExperiences.splice(index, 1);
    updateData('experience', newExperiences);
    setActiveExperience(null);
  };

  const addHighlight = (experienceIndex) => {
    const newExperiences = [...portfolioData.experience];
    if (!newExperiences[experienceIndex].highlights) {
      newExperiences[experienceIndex].highlights = [];
    }
    newExperiences[experienceIndex].highlights.push('');
    updateData('experience', newExperiences);
  };

  const updateHighlight = (experienceIndex, highlightIndex, value) => {
    const newExperiences = [...portfolioData.experience];
    newExperiences[experienceIndex].highlights[highlightIndex] = value;
    updateData('experience', newExperiences);
  };

  const removeHighlight = (experienceIndex, highlightIndex) => {
    const newExperiences = [...portfolioData.experience];
    newExperiences[experienceIndex].highlights.splice(highlightIndex, 1);
    updateData('experience', newExperiences);
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...portfolioData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    updateData('education', newEducation);
  };

  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: []
    };
    updateData('education', [...portfolioData.education, newEducation]);
    setTimeout(() => {
      setActiveEducation(portfolioData.education.length);
    }, 100);
  };

  const removeEducation = (index) => {
    const newEducation = [...portfolioData.education];
    newEducation.splice(index, 1);
    updateData('education', newEducation);
    setActiveEducation(null);
  };

  const addSkill = (category) => {
    const newSkills = { ...portfolioData.skills };
    if (!newSkills[category]) {
      newSkills[category] = [];
    }
    newSkills[category].push({ name: '', level: 70 });
    updateData('skills', newSkills);
  };

  const updateSkill = (category, index, field, value) => {
    const newSkills = { ...portfolioData.skills };
    newSkills[category][index] = {
      ...newSkills[category][index],
      [field]: value
    };
    updateData('skills', newSkills);
  };

  const removeSkill = (category, index) => {
    const newSkills = { ...portfolioData.skills };
    newSkills[category].splice(index, 1);
    if (newSkills[category].length === 0) {
      delete newSkills[category];
    }
    updateData('skills', newSkills);
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...(portfolioData.projects || [])];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value
    };
    updateData('projects', newProjects);
  };

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      repoUrl: '',
      image: '',
      startDate: '',
      endDate: ''
    };
    updateData('projects', [...(portfolioData.projects || []), newProject]);
    setTimeout(() => {
      setActiveProject(portfolioData.projects?.length || 0);
    }, 100);
  };

  const removeProject = (index) => {
    const newProjects = [...(portfolioData.projects || [])];
    newProjects.splice(index, 1);
    updateData('projects', newProjects);
    setActiveProject(null);
  };

  const addCertification = () => {
    const newCertification = {
      name: '',
      issuer: '',
      date: '',
      url: ''
    };
    updateData('certifications', [...(portfolioData.certifications || []), newCertification]);
  };

  const updateCertification = (index, field, value) => {
    const newCertifications = [...(portfolioData.certifications || [])];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value
    };
    updateData('certifications', newCertifications);
  };

  const removeCertification = (index) => {
    const newCertifications = [...(portfolioData.certifications || [])];
    newCertifications.splice(index, 1);
    updateData('certifications', newCertifications);
  };

  const updateSocialLink = (platform, value) => {
    const newSocialLinks = { ...(portfolioData.socialLinks || {}) };
    newSocialLinks[platform] = value;
    updateData('socialLinks', newSocialLinks);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">Build Your Professional Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-300">Complete the sections below to create a stunning portfolio that showcases your skills and experience.</p>
      </motion.div>

      {/* === PERSONAL INFORMATION === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('personalInfo')}
        >
          <div className="flex items-center space-x-2">
            <FiUser className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h3>
          </div>
          {expanded.personalInfo ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.personalInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={portfolioData.personalInfo?.name || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      placeholder="Frontend Developer"
                      value={portfolioData.personalInfo?.title || ''}
                      onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="johndoe@example.com"
                        value={portfolioData.personalInfo?.email || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={portfolioData.personalInfo?.phone || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="San Francisco, CA"
                        value={portfolioData.personalInfo?.location || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiGlobe className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={portfolioData.personalInfo?.website || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <FiUser className="text-gray-400" size={30} />
                      )}
                    </div>
                    <label className="cursor-pointer bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                      Upload Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === ABOUT ME === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('aboutMe')}
        >
          <div className="flex items-center space-x-2">
            <FiUser className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">About Me</h3>
          </div>
          {expanded.aboutMe ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.aboutMe && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    placeholder="Write a compelling summary about yourself and your professional experience..."
                    value={portfolioData.aboutMe?.summary || ''}
                    onChange={(e) => handleInputChange('aboutMe', 'summary', e.target.value)}
                    rows={5}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Keep it concise and highlight your key achievements and strengths.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Career Objective
                  </label>
                  <textarea
                    placeholder="What are your career goals and aspirations?"
                    value={portfolioData.aboutMe?.objective || ''}
                    onChange={(e) => handleInputChange('aboutMe', 'objective', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === WORK EXPERIENCE === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('experience')}
        >
          <div className="flex items-center space-x-2">
            <HiOutlineBriefcase className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Work Experience</h3>
          </div>
          {expanded.experience ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.experience && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                <div className="mb-4">
                  <motion.button 
                    onClick={addExperience}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiPlus size={18} />
                    <span>Add Work Experience</span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <AnimatePresence>
                    {portfolioData.experience?.map((exp, index) => (
                      <motion.div 
                        key={index}
                        className={`border rounded-lg overflow-hidden ${activeExperience === index ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div 
                          className={`p-4 cursor-pointer flex justify-between items-center ${activeExperience === index ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-750'}`}
                          onClick={() => setActiveExperience(activeExperience === index ? null : index)}
                        >
                          <div>
                            <h4 className="font-medium">
                              {exp.position || 'New Position'} {exp.company ? `at ${exp.company}` : ''}
                            </h4>
                            {exp.startDate && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate || ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExperience(index);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                            {activeExperience === index ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {activeExperience === index && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="p-4 bg-white dark:bg-gray-800"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Job Title
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Senior Developer"
                                    value={exp.position || ''}
                                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Acme Inc."
                                    value={exp.company || ''}
                                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="San Francisco, CA (or Remote)"
                                    value={exp.location || ''}
                                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div className="flex space-x-2">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Start Date
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="May 2018"
                                      value={exp.startDate || ''}
                                      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      End Date
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="June 2021"
                                      value={exp.endDate || ''}
                                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                      disabled={exp.current}
                                      className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${exp.current ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="checkbox"
                                    id={`current-job-${index}`}
                                    checked={exp.current || false}
                                    onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <label htmlFor={`current-job-${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    I currently work here
                                  </label>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Job Description
                                </label>
                                <textarea
                                  placeholder="Describe your responsibilities and achievements..."
                                  value={exp.description || ''}
                                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                  rows={3}
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Key Achievements
                                  </label>
                                  <button
                                    onClick={() => addHighlight(index)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 text-sm"
                                  >
                                    <FiPlus size={14} />
                                    <span>Add Achievement</span>
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {exp.highlights?.map((highlight, highlightIndex) => (
                                    <div key={highlightIndex} className="flex items-center">
                                      <input
                                        type="text"
                                        placeholder="Led a team of 5 developers to deliver project ahead of schedule"
                                        value={highlight}
                                        onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      />
                                      <button
                                        onClick={() => removeHighlight(index, highlightIndex)}
                                        className="ml-2 text-red-500 hover:text-red-700 p-1"
                                      >
                                        <FiTrash2 size={16} />
                                      </button>
                                    </div>
                                  ))}
                                  
                                  {!exp.highlights?.length && (
                                    <p className="text-sm text-gray-500 italic">Add key achievements or responsibilities to make your experience stand out.</p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {!portfolioData.experience?.length && (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <HiOutlineBriefcase className="mx-auto text-gray-400" size={30} />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No work experience added yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to add your work history.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === EDUCATION === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('education')}
        >
          <div className="flex items-center space-x-2">
            <HiOutlineAcademicCap className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Education</h3>
          </div>
          {expanded.education ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.education && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                <div className="mb-4">
                  <motion.button 
                    onClick={addEducation}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiPlus size={18} />
                    <span>Add Education</span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <AnimatePresence>
                    {portfolioData.education?.map((edu, index) => (
                      <motion.div 
                        key={index}
                        className={`border rounded-lg overflow-hidden ${activeEducation === index ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div 
                          className={`p-4 cursor-pointer flex justify-between items-center ${activeEducation === index ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-750'}`}
                          onClick={() => setActiveEducation(activeEducation === index ? null : index)}
                        >
                          <div>
                            <h4 className="font-medium">
                              {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''} {edu.institution ? `at ${edu.institution}` : ''}
                            </h4>
                            {edu.startDate && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {edu.startDate} - {edu.current ? 'Present' : edu.endDate || ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeEducation(index);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                            {activeEducation === index ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {activeEducation === index && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="p-4 bg-white dark:bg-gray-800"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Institution
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="University of California, Berkeley"
                                    value={edu.institution || ''}
                                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Degree
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Bachelor of Science"
                                    value={edu.degree || ''}
                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Field of Study
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Computer Science"
                                    value={edu.field || ''}
                                    onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Berkeley, CA"
                                    value={edu.location || ''}
                                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div className="flex space-x-2">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Start Date
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Sep 2015"
                                      value={edu.startDate || ''}
                                      onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      End Date
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="May 2019"
                                      value={edu.endDate || ''}
                                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                      disabled={edu.current}
                                      className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${edu.current ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    GPA
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="3.8"
                                    value={edu.gpa || ''}
                                    onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div className="col-span-2">
                                  <div className="flex items-center mb-2">
                                    <input
                                      type="checkbox"
                                      id={`current-education-${index}`}
                                      checked={edu.current || false}
                                      onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor={`current-education-${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                      I'm currently studying here
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {!portfolioData.education?.length && (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <HiOutlineAcademicCap className="mx-auto text-gray-400" size={30} />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No education added yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to add your education history.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === SKILLS === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('skills')}
        >
          <div className="flex items-center space-x-2">
            <HiOutlineLightBulb className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Skills</h3>
          </div>
          {expanded.skills ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.skills && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Skills */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800 dark:text-white flex items-center">
                        <HiOutlineCode className="mr-2 text-blue-500" />
                        Technical Skills
                      </h4>
                      <button
                        onClick={() => addSkill('technical')}
                        className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 text-sm"
                      >
                        <FiPlus size={14} />
                        <span>Add Skill</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {portfolioData.skills?.technical?.map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex-1 mr-2">
                              <input
                                type="text"
                                placeholder="React.js"
                                value={skill.name}
                                onChange={(e) => updateSkill('technical', index, 'name', e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <button
                              onClick={() => removeSkill('technical', index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => updateSkill('technical', index, 'level', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>Beginner</span>
                              <span>Advanced</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {!portfolioData.skills?.technical?.length && (
                        <p className="text-sm text-gray-500 italic">Add programming languages, frameworks, tools, etc.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Soft Skills */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800 dark:text-white flex items-center">
                        <HiOutlineSparkles className="mr-2 text-blue-500" />
                        Soft Skills
                      </h4>
                      <button
                        onClick={() => addSkill('soft')}
                        className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 text-sm"
                      >
                        <FiPlus size={14} />
                        <span>Add Skill</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {portfolioData.skills?.soft?.map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex-1 mr-2">
                              <input
                                type="text"
                                placeholder="Team Leadership"
                                value={skill.name}
                                onChange={(e) => updateSkill('soft', index, 'name', e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <button
                              onClick={() => removeSkill('soft', index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => updateSkill('soft', index, 'level', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>Beginner</span>
                              <span>Advanced</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {!portfolioData.skills?.soft?.length && (
                        <p className="text-sm text-gray-500 italic">Add communication, leadership, problem-solving skills, etc.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === PROJECTS === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('projects')}
        >
          <div className="flex items-center space-x-2">
            <HiOutlineDocumentText className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Projects</h3>
          </div>
          {expanded.projects ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.projects && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                <div className="mb-4">
                  <motion.button 
                    onClick={addProject}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiPlus size={18} />
                    <span>Add Project</span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <AnimatePresence>
                    {portfolioData.projects?.map((project, index) => (
                      <motion.div 
                        key={index}
                        className={`border rounded-lg overflow-hidden ${activeProject === index ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div 
                          className={`p-4 cursor-pointer flex justify-between items-center ${activeProject === index ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-750'}`}
                          onClick={() => setActiveProject(activeProject === index ? null : index)}
                        >
                          <div>
                            <h4 className="font-medium">{project.title || 'New Project'}</h4>
                            {project.technologies && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{project.technologies}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeProject(index);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                            {activeProject === index ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {activeProject === index && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="p-4 bg-white dark:bg-gray-800"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Project Title
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="E-commerce Website"
                                    value={project.title || ''}
                                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    placeholder="Describe what this project is about..."
                                    value={project.description || ''}
                                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Technologies Used
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="React, Node.js, MongoDB"
                                    value={project.technologies || ''}
                                    onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Live URL
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <FiLink className="text-gray-400" />
                                    </div>
                                    <input
                                      type="url"
                                      placeholder="https://project-demo.com"
                                      value={project.liveUrl || ''}
                                      onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)}
                                      className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Repository URL
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <FiGithub className="text-gray-400" />
                                    </div>
                                    <input
                                      type="url"
                                      placeholder="https://github.com/username/project"
                                      value={project.repoUrl || ''}
                                      onChange={(e) => handleProjectChange(index, 'repoUrl', e.target.value)}
                                      className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Start Date
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Jan 2023"
                                      value={project.startDate || ''}
                                      onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      End Date
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Mar 2023"
                                      value={project.endDate || ''}
                                      onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {!portfolioData.projects?.length && (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <HiOutlineDocumentText className="mx-auto text-gray-400" size={30} />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No projects added yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to add your projects.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === CERTIFICATIONS === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('certifications')}
        >
          <div className="flex items-center space-x-2">
            <FiAward className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Certifications</h3>
          </div>
          {expanded.certifications ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.certifications && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                <div className="mb-4">
                  <motion.button 
                    onClick={addCertification}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiPlus size={18} />
                    <span>Add Certification</span>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {portfolioData.certifications?.map((cert, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Certification Name
                          </label>
                          <input
                            type="text"
                            placeholder="AWS Certified Solutions Architect"
                            value={cert.name || ''}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Issuing Organization
                          </label>
                          <input
                            type="text"
                            placeholder="Amazon Web Services"
                            value={cert.issuer || ''}
                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                          </label>
                          <input
                            type="text"
                            placeholder="June 2022"
                            value={cert.date || ''}
                            onChange={(e) => updateCertification(index, 'date', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Credential URL
                          </label>
                          <div className="flex">
                            <input
                              type="url"
                              placeholder="https://credential.net/abc123"
                              value={cert.url || ''}
                              onChange={(e) => updateCertification(index, 'url', e.target.value)}
                              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button 
                              onClick={() => removeCertification(index)}
                              className="bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 p-2 rounded-r-md transition-colors"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!portfolioData.certifications?.length && (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <FiAward className="mx-auto text-gray-400" size={30} />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No certifications added yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Click the button above to add your certifications.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === SOCIAL LINKS === */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('socialLinks')}
        >
          <div className="flex items-center space-x-2">
            <FiLink className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Social Media & Links</h3>
          </div>
          {expanded.socialLinks ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        <AnimatePresence>
          {expanded.socialLinks && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLinkedin className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={portfolioData.socialLinks?.linkedin || ''}
                        onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiGithub className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={portfolioData.socialLinks?.github || ''}
                        onChange={(e) => updateSocialLink('github', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter / X
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTwitter className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://twitter.com/username"
                        value={portfolioData.socialLinks?.twitter || ''}
                        onChange={(e) => updateSocialLink('twitter', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Personal Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiGlobe className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={portfolioData.socialLinks?.website || ''}
                        onChange={(e) => updateSocialLink('website', e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === SUBMIT BUTTON === */}
      <motion.div 
        className="flex justify-end mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={onComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md font-medium flex items-center space-x-2 transition-colors"
        >
          <span>Save and Continue</span>
        </button>
      </motion.div>
    </div>
  );
}