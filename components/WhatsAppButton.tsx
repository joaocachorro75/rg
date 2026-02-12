import React from 'react';
import { useContent } from '../context/ContentContext';

export const WhatsAppButton: React.FC = () => {
  const { content } = useContent();
  const whatsappUrl = `https://wa.me/${content.global.whatsapp}?text=Olá,%20vim%20pelo%20site%20da%20RG%20Frios!`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce-slow group"
      aria-label="Fale conosco no WhatsApp"
    >
      <div className="absolute -inset-2 bg-[#25D366]/30 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
      <svg 
        viewBox="0 0 24 24" 
        width="32" 
        height="32" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="relative z-10 fill-white stroke-white"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Peça já!
      </span>
    </a>
  );
};