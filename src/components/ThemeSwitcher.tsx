'use client';

import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const themes = [
    { id: 'neo', label: 'NEO', color: '#D1F232' },
    { id: 'luxury', label: 'LUX', color: '#C5A065' },
    { id: 'minimal', label: 'MIN', color: '#f5f5f5' },
    { id: 'pop', label: 'POP', color: '#FF00FF' },
    { id: 'retro', label: 'RTR', color: '#FF7F50' }
  ];

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 p-2 bg-black/80 backdrop-blur-md rounded-lg shadow-2xl border border-white/20">
      <span className="text-white text-xs font-mono text-center uppercase mb-1">Theme</span>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id as any)}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${
            theme === t.id ? 'scale-110 ring-2 ring-white z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          style={{ backgroundColor: t.id === 'neo' ? '#000' : t.color, color: t.id === 'neo' ? '#D1F232' : (t.id === 'minimal' ? '#000' : '#fff') }}
          title={t.label}
        >
             {theme === t.id && (
                <motion.div 
                    layoutId="active-theme" 
                    className="absolute inset-0 rounded-full border-2 border-white"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
             )}
          {t.label}
        </button>
      ))}
    </div>
  );
}
