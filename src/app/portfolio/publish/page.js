// src/app/portfolio/publish/page.js
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { savePortfolio } from '@/services/firestore';
import { generateUniqueSlug } from '@/lib/utils';

export default function PublishPage() {
  const { user } = useAuth();
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publish = async () => {
      try {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
        const themeConfig = JSON.parse(localStorage.getItem('themeConfig'));
        
        const slug = generateUniqueSlug(user.uid);
        const fullData = {
          ...portfolioData,
          theme: themeConfig,
          publishedAt: new Date().toISOString(),
          slug
        };

        await savePortfolio(user.uid, fullData);
        setPortfolioUrl(`${window.location.origin}/portfolio/${slug}`);
      } catch (error) {
        console.error('Publishing failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) publish();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Portfolio Published! 🎉</h1>
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
              onClick={() => navigator.clipboard.writeText(portfolioUrl)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <button className="w-full p-2 bg-green-500 text-white rounded">
            Share on LinkedIn
          </button>
          <button className="w-full p-2 bg-gray-800 text-white rounded">
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}