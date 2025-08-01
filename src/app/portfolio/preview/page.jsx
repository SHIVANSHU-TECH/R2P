'use client';
import { usePortfolio, PortfolioProvider } from '../../../contexts/PortfolioContext';
import { templates } from '../../../lib/templates';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiDownload, FiShare2, FiEdit } from 'react-icons/fi';

function PortfolioPreviewContent() {
  const { portfolioData, themeConfig } = usePortfolio();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(themeConfig?.template || 'modern');

  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const TemplateComponent = currentTemplate?.component;

  const handlePublish = () => {
    router.push('/portfolio/publish');
  };

  const handleEdit = () => {
    router.push('/dashboard');
  };

  const handleDownload = () => {
    // Implementation for PDF download
    console.log('Downloading portfolio as PDF...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: portfolioData?.personalInfo?.name || 'My Portfolio',
        text: 'Check out my portfolio!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio URL copied to clipboard!');
    }
  };

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Portfolio Preview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding your information to see a live preview
          </p>
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            <FiEdit className="inline mr-2" />
            Edit Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
                <span>Back to Editor</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <FiShare2 size={16} />
                <span>Share</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <FiDownload size={16} />
                <span>Download</span>
              </button>
              
              <button
                onClick={handlePublish}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
              >
                Publish Portfolio
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden my-8">
          <TemplateComponent data={portfolioData} />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="Edit Portfolio"
          >
            <FiEdit size={20} />
          </button>
          
          <button
            onClick={handlePublish}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPreview() {
  return (
    <PortfolioProvider>
      <PortfolioPreviewContent />
    </PortfolioProvider>
  );
} 