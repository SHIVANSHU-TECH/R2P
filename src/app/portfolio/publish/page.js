// src/app/portfolio/publish/page.js
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { savePortfolio, savePortfolioBySlug } from '@/services/firestore';
import { generateUniqueSlug } from '@/lib/utils';

export default function PublishPage() {
  const { user } = useAuth();
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const publish = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        if (!user) {
          setError('You must be logged in to publish a portfolio.');
          setLoading(false);
          return;
        }

        // Test Firebase connection
        console.log('Testing Firebase connection...');
        console.log('User UID:', user.uid);
        console.log('User email:', user.email);

        // Get data from localStorage
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        const themeConfig = JSON.parse(localStorage.getItem('themeConfig') || '{}');
        
        console.log('Portfolio Data:', portfolioData);
        console.log('Theme Config:', themeConfig);
        console.log('User:', user);
        
        if (!portfolioData || Object.keys(portfolioData).length === 0) {
          setError('No portfolio data found. Please add some information to your portfolio first.');
          setLoading(false);
          return;
        }
        
        // Generate unique slug
        const slug = generateUniqueSlug(user.uid);
        console.log('Generated slug:', slug);
        
        const fullData = {
          ...portfolioData,
          theme: themeConfig,
          publishedAt: new Date().toISOString(),
          slug,
          userId: user.uid
        };

        console.log('Full data to save:', fullData);

        // Try to save portfolio with retry mechanism
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            await savePortfolioBySlug(slug, fullData);
            console.log('Portfolio saved successfully');
            setPortfolioUrl(`${window.location.origin}/portfolio/${slug}`);
            return; // Success, exit the function
          } catch (saveError) {
            retryCount++;
            console.error(`Save attempt ${retryCount} failed:`, saveError);
            
            if (retryCount >= maxRetries) {
              throw saveError; // Re-throw the error after all retries
            }
            
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      } catch (error) {
        console.error('Publishing failed:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        
        // Provide user-friendly error messages
        let errorMessage = 'Failed to publish portfolio. Please try again.';
        
        if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please check your Firebase security rules.';
        } else if (error.message.includes('unauthenticated')) {
          errorMessage = 'You must be logged in to publish a portfolio.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('Missing or insufficient permissions')) {
          errorMessage = 'Firebase permissions error. Please check your security rules.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      publish();
    } else {
      setLoading(false);
      setError('Please log in to publish your portfolio.');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Publishing your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Publishing Failed</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={() => window.history.back()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors ml-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Portfolio Published! 🎉</h1>
          <div className="mb-6">
            <p className="text-lg mb-2">Your portfolio is now live at:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(portfolioUrl);
                  alert('URL copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-2 bg-green-500 text-white rounded text-center hover:bg-green-600 transition-colors"
            >
              View Portfolio
            </a>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Portfolio',
                    text: 'Check out my portfolio!',
                    url: portfolioUrl
                  });
                } else {
                  navigator.clipboard.writeText(portfolioUrl);
                  alert('Portfolio URL copied to clipboard!');
                }
              }}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Share Portfolio
            </button>
            <button className="w-full p-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors">
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}