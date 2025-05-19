// src/components/portfolio/TemplateRenderer.js
'use client';
import { useEffect, useState } from 'react';

export default function TemplateRenderer({ data, theme }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    setStyle({
      '--primary-color': theme.colors.primary,
      '--secondary-color': theme.colors.secondary,
      '--background-color': theme.colors.background,
      '--heading-font': theme.fonts.heading,
      '--body-font': theme.fonts.body
    });
  }, [theme]);

  return (
    <div 
      className="min-h-screen p-8"
      style={style}
    >
      <style jsx global>{`
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --background-color: ${theme.colors.background};
          --heading-font: ${theme.fonts.heading};
          --body-font: ${theme.fonts.body};
        }
        
        h1, h2, h3 {
          font-family: var(--heading-font);
        }
        
        body {
          font-family: var(--body-font);
          background-color: var(--background-color);
        }
      `}</style>

      <header className="bg-primary text-white p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-bold">{data.personalInfo.name}</h1>
        <p className="text-xl">{data.personalInfo.title}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold">{exp.position}</h3>
            <p className="text-secondary">{exp.company}</p>
            <p className="text-gray-600">{exp.duration}</p>
          </div>
        ))}
      </section>
    </div>
  );
}