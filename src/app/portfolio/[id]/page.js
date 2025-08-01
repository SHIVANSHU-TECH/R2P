'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPortfolioBySlug } from '@/services/firestore';
import { templates } from '@/lib/templates';
import { FiArrowLeft, FiShare2, FiDownload, FiMail, FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';
import Link from 'next/link';

export default function PortfolioPage() {
  const params = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioData = await getPortfolioBySlug(params.id);
        
        if (portfolioData) {
          setPortfolio(portfolioData);
        } else {
          setError('Portfolio not found');
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPortfolio();
    }
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: portfolio?.personalInfo?.name || 'Portfolio',
        text: 'Check out this portfolio!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio URL copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // Implementation for PDF download
    console.log('Downloading portfolio as PDF...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This portfolio doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Get the template component
  const templateId = portfolio.theme?.template || 'modern';
  const currentTemplate = templates.find(t => t.id === templateId);
  const TemplateComponent = currentTemplate?.component;

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Template Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The template for this portfolio is not available.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go Home
          </Link>
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
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden my-8">
          <TemplateComponent data={portfolio} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Portfolio created with{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Resume 2 Portfolio
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
