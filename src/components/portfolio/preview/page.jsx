'use client';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PreviewPane from '@/components/dashboard/PreviewPane';

export default function PortfolioPreview() {
  const { portfolioData, themeConfig } = usePortfolio();

  return (
    <div className="container mx-auto p-8">
      <PreviewPane data={portfolioData} theme={themeConfig} />
    </div>
  );
}