// components/dashboard/PreviewPane.js
'use client';
import { usePortfolio } from '@/contexts/PortfolioContext';

export default function PreviewPane() {
  const { portfolioData, themeConfig } = usePortfolio();

  return (
    <div className="border rounded-lg p-6 h-[800px] overflow-y-auto">
      <div className="space-y-6" style={{
        fontFamily: themeConfig.fonts?.body || 'sans-serif',
        color: themeConfig.colors?.text || '#1a202c'
      }}>
        {/* Header Section */}
        <header className="text-center" style={{
          backgroundColor: themeConfig.colors?.primary,
          color: themeConfig.colors?.headerText || 'white',
          padding: '2rem',
          borderRadius: '0.5rem'
        }}>
          <h1 style={{
            fontFamily: themeConfig.fonts?.heading || 'sans-serif',
            fontSize: '2.25rem',
            fontWeight: 'bold'
          }}>
            {portfolioData.personalInfo?.name || 'Your Name'}
          </h1>
          <p className="mt-2">
            {portfolioData.personalInfo?.title || 'Professional Title'}
          </p>
        </header>

        {/* Experience Section */}
        <section>
          <h2 style={{
            fontFamily: themeConfig.fonts?.heading,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: themeConfig.colors?.secondary
          }}>
            Experience
          </h2>
          <div className="mt-4 space-y-4">
            {portfolioData.experience?.map((exp, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Add more sections for Skills, Education, etc. */}
      </div>
    </div>
  );
}