'use client';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { templates } from '../../lib/templates';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiType, FiCheck, FiGlobe } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function ThemeCustomizer() {
  const { themeConfig, setThemeConfig, portfolioData } = usePortfolio();
  const [selectedTemplate, setSelectedTemplate] = useState(themeConfig?.template || 'modern');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    setThemeConfig(prev => ({
      ...prev,
      template: templateId
    }));
  };

  const handleColorChange = (colorType, value) => {
    setThemeConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleFontChange = (fontType, value) => {
    setThemeConfig(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value
      }
    }));
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      // Save theme config to localStorage
      localStorage.setItem('themeConfig', JSON.stringify(themeConfig));
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      
      // Show success message
      alert('Theme saved successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Error saving theme. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetTheme = () => {
    const defaultTheme = {
      template: 'modern',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        background: '#FFFFFF',
        text: '#1F2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    };
    setThemeConfig(defaultTheme);
    setSelectedTemplate('modern');
  };

  const handlePublish = () => {
    // Save current data to localStorage
    localStorage.setItem('themeConfig', JSON.stringify(themeConfig));
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    
    // Navigate to publish page
    router.push('/portfolio/publish');
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">Customize Your Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-300">Choose a template and customize the appearance to match your personal brand.</p>
      </motion.div>

      {/* Template Selection */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Choose Template</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Select a template that best represents your style</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleTemplateChange(template.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2">
                    <FiCheck className="text-blue-500" size={20} />
                  </div>
                )}
                
                <div className="mb-3">
                  {template.previewComponent()}
                </div>
                
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Color Customization */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4">
          <div className="flex items-center space-x-2">
            <FiDroplet className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Color Scheme</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={themeConfig?.colors?.primary || '#3B82F6'}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig?.colors?.primary || '#3B82F6'}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={themeConfig?.colors?.secondary || '#8B5CF6'}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig?.colors?.secondary || '#8B5CF6'}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                  placeholder="#8B5CF6"
                />
        </div>
      </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex space-x-2">
              <input
                type="color"
                  value={themeConfig?.colors?.background || '#FFFFFF'}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig?.colors?.background || '#FFFFFF'}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Color
              </label>
              <div className="flex space-x-2">
              <input
                type="color"
                  value={themeConfig?.colors?.text || '#1F2937'}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig?.colors?.text || '#1F2937'}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                  placeholder="#1F2937"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Font Customization */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4">
          <div className="flex items-center space-x-2">
            <FiType className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Typography</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heading Font
              </label>
              <select
                value={themeConfig?.fonts?.heading || 'Inter'}
                onChange={(e) => handleFontChange('heading', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
        </div>

        <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Body Font
              </label>
            <select
                value={themeConfig?.fonts?.body || 'Inter'}
                onChange={(e) => handleFontChange('body', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
            </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">See how your customizations look</p>
        </div>
        
        <div className="p-6">
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
            <div 
              className="text-center p-6 rounded-lg"
              style={{
                backgroundColor: themeConfig?.colors?.primary || '#3B82F6',
                color: themeConfig?.colors?.headerText || 'white'
              }}
            >
              <h1 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: themeConfig?.fonts?.heading || 'Inter' }}
              >
                Your Name
              </h1>
              <p 
                className="text-lg"
                style={{ fontFamily: themeConfig?.fonts?.body || 'Inter' }}
              >
                Professional Title
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h2 
                className="text-lg font-semibold mb-2"
                style={{ 
                  fontFamily: themeConfig?.fonts?.heading || 'Inter',
                  color: themeConfig?.colors?.secondary || '#8B5CF6'
                }}
              >
                Sample Section
              </h2>
              <p 
                className="text-sm"
                style={{ 
                  fontFamily: themeConfig?.fonts?.body || 'Inter',
                  color: themeConfig?.colors?.text || '#1F2937'
                }}
              >
                This is how your content will appear with the selected colors and fonts.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-4">
          <button 
            onClick={handleResetTheme}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset to Default
          </button>
          <button 
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
      </div>
        
        <button 
          onClick={handlePublish}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center space-x-2"
        >
          <FiGlobe size={16} />
          <span>Publish Portfolio</span>
        </button>
      </motion.div>
    </div>
  );
}