// src/contexts/PortfolioContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  });

  const [themeConfig, setThemeConfig] = useState({
    template: 'professional',
    colors: {},
    fonts: {}
  });

  const updateData = (section, data) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        themeConfig,
        updateData,
        setThemeConfig
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);