// components/dashboard/PreviewPane.js
'use client';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { templates } from '../../lib/templates';
import { useState } from 'react';

export default function PreviewPane() {
  const { portfolioData, themeConfig } = usePortfolio();
  const [selectedTemplate, setSelectedTemplate] = useState(themeConfig?.template || 'modern');

  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const TemplateComponent = currentTemplate?.component;

  if (!TemplateComponent) {
  return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Portfolio Preview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start adding your information to see a live preview
          </p>
        </div>
              </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 overflow-auto">
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Live Preview
          </h3>
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
        </div>
          </div>

      <div className="preview-container">
        <TemplateComponent data={portfolioData} />
      </div>
    </div>
  );
}