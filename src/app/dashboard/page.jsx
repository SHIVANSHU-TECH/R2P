'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import ResumeUpload from '../../components/dashboard/ResumeUpload';
import ManualForm from '../../components/dashboard/ManualForm';
import ThemeCustomizer from '../../components/dashboard/ThemeCustomizer';
import PreviewPane from "../../components/dashboard/PreviewPane";
import { PortfolioProvider, usePortfolio } from '@/contexts/PortfolioContext'; // Import usePortfolio hook
import { FiUpload, FiEdit, FiSettings, FiUser, FiLogOut, FiExternalLink, FiGlobe } from 'react-icons/fi';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [portfolioPreview, setPortfolioPreview] = useState(null);
  const router = useRouter();
  
  // Wrap the component content with PortfolioProvider
  return (
    <PortfolioProvider>
      <DashboardContent 
        user={user}
        loading={loading}
        logout={logout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        portfolioPreview={portfolioPreview}
        setPortfolioPreview={setPortfolioPreview}
        router={router}
      />
    </PortfolioProvider>
  );
}

// Move the component logic to an inner component that can use the context
function DashboardContent({ 
  user, 
  loading, 
  logout, 
  activeTab, 
  setActiveTab, 
  showProfileMenu, 
  setShowProfileMenu, 
  portfolioPreview, 
  setPortfolioPreview, 
  router 
}) {
  // Get portfolioData and themeConfig from context
  const { portfolioData, themeConfig, updateData } = usePortfolio();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
    
    if (user) {
      // Calculate actual completion percentage
      const completion = calculateCompletion(portfolioData);
      setPortfolioPreview({
        theme: themeConfig.template || 'modern',
        completionPercent: completion,
        lastEdited: new Date().toLocaleDateString()
      });
    }
  }, [user, loading, router, portfolioData, themeConfig]);

  const calculateCompletion = (data) => {
    let filledFields = 0;
    const totalFields = 8; // Adjust based on your requirements
    
    if (data.personalInfo?.name) filledFields++;
    if (data.personalInfo?.email) filledFields++;
    if (data.experience?.length > 0) filledFields += 2;
    if (data.skills?.length > 0) filledFields++;
    if (data.education?.length > 0) filledFields++;
    if (themeConfig?.colors) filledFields++;
    if (themeConfig?.fonts) filledFields++;
  
    return Math.round((filledFields / totalFields) * 100);
  };

  const handleResumeParseComplete = (parsedData) => {
    // Update portfolio data with parsed resume data
    if (parsedData.personalInfo) {
      updateData('personalInfo', parsedData.personalInfo);
    }
    if (parsedData.experience) {
      updateData('experience', parsedData.experience);
    }
    if (parsedData.education) {
      updateData('education', parsedData.education);
    }
    if (parsedData.skills) {
      updateData('skills', parsedData.skills);
    }
    if (parsedData.projects) {
      updateData('projects', parsedData.projects);
    }
    if (parsedData.certifications) {
      updateData('certifications', parsedData.certifications);
    }
    
    setActiveTab('customize');
  };

  if (loading || !user) {
    return null; // Loading component will handle the loading state
  }

  const tabVariants = {
    inactive: { opacity: 0.6, y: 5 },
    active: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">ResumeToPortfolio</h1>
          </motion.div>

          <div className="relative">
            <motion.button 
              className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 py-2 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                {user.displayName || user.email.split('@')[0]}
              </span>
            </motion.button>
            
            {showProfileMenu && (
              <motion.div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                  <FiUser size={16} />
                  <span>Profile</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                  <FiSettings size={16} />
                  <span>Settings</span>
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <FiLogOut size={16} />
                  <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome card */}
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {user.displayName || user.email.split('@')[0]}!</h2>
          <p className="text-blue-100">Let's transform your resume into an impressive portfolio that showcases your talents.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {[
                  { id: 'upload', label: 'Upload Resume', icon: <FiUpload /> },
                  { id: 'manual', label: 'Manual Input', icon: <FiEdit /> },
                  { id: 'customize', label: 'Customize', icon: <FiSettings /> }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 focus:outline-none transition-colors ${
                      activeTab === tab.id 
                        ? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                    }`}
                    variants={tabVariants}
                    initial="inactive"
                    animate={activeTab === tab.id ? "active" : "inactive"}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="p-6">
                <motion.div
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {activeTab === 'upload' && (
                    <ResumeUpload onParseComplete={handleResumeParseComplete} />
                  )}
                  {activeTab === 'manual' && (
                    <ManualForm onComplete={() => setActiveTab('customize')} />
                  )}
                  {activeTab === 'customize' && (
                    <ThemeCustomizer />
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Portfolio Preview Card */}
            {portfolioPreview && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              >
                <div className="p-1">
                  <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PreviewPane />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800 dark:text-white">My Portfolio</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {portfolioPreview.theme} theme
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Completion</span>
                      <span className="text-blue-600">{portfolioPreview.completionPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${portfolioPreview.completionPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Last edited: {portfolioPreview.lastEdited}
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                      onClick={() => router.push(`/portfolio/preview`)}
                    >
                      <FiExternalLink size={16} />
                      <span>Preview Portfolio</span>
                    </button>
                    
                    <button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                      onClick={() => {
                        // Save current data to localStorage
                        localStorage.setItem('themeConfig', JSON.stringify(themeConfig));
                        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                        router.push('/portfolio/publish');
                      }}
                    >
                      <FiGlobe size={16} />
                      <span>Publish Portfolio</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tips Card */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            >
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Portfolio Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Add a professional headshot to increase engagement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Include links to your social profiles and GitHub</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Customize colors to match your personal brand</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}