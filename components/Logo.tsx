import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '', height = 'h-20' }) => {
  const { content } = useContent();
  const [hasError, setHasError] = useState(false);

  // Reset error state when the URL changes so we try to load the new image
  useEffect(() => {
    setHasError(false);
  }, [content.global.logoUrl]);

  const containerClasses = variant === 'light'
    ? 'bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 ring-1 ring-white/20'
    : '';

  if (hasError || !content.global.logoUrl) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${height} ${className} ${containerClasses}`}>
        <span className="font-bold text-rg-red text-xl border-2 border-dashed border-rg-red p-2 rounded whitespace-nowrap">
          RG FRIOS
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-block select-none ${height} ${className} ${containerClasses}`}>
      <img 
        src={content.global.logoUrl} 
        alt="RG Frios e Fatiados" 
        className="h-full w-auto object-contain transition-transform hover:scale-105 duration-300"
        onError={() => setHasError(true)}
      />
    </div>
  );
};