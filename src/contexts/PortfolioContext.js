// src/contexts/PortfolioContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  });

  const [themeConfig, setThemeConfig] = useState({
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
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedPortfolioData = localStorage.getItem('portfolioData');
      const savedThemeConfig = localStorage.getItem('themeConfig');
      
      if (savedPortfolioData) {
        setPortfolioData(JSON.parse(savedPortfolioData));
      }
      
      if (savedThemeConfig) {
        setThemeConfig(JSON.parse(savedThemeConfig));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    } catch (error) {
      console.error('Error saving portfolio data to localStorage:', error);
    }
  }, [portfolioData]);

  useEffect(() => {
    try {
      localStorage.setItem('themeConfig', JSON.stringify(themeConfig));
    } catch (error) {
      console.error('Error saving theme config to localStorage:', error);
    }
  }, [themeConfig]);

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