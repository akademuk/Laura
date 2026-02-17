'use client';

import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoBackground() {
  const { theme } = useTheme();

  // Only show video for certain themes to maintain the "vibe"
  // Neo: High energy video
  // Luxury: Slow, elegant video
  // Minimal: No video, just clean color
  // Pop: Maybe a wild glitched video?
  // Retro: Matrix rain or CRT static

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        
        {/* NEO THEME VIDEO (Default High Energy) */}
        {theme === 'neo' && (
          <motion.div
            key="neo-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 grayscale contrast-125"
          >
             {/* Placeholder for actual video file */}
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/neo-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-brand-neon/10 mix-blend-overlay" />
          </motion.div>
        )}

        {/* LUXURY THEME VIDEO (Slow, Gold dust) */}
        {theme === 'luxury' && (
          <motion.div
            key="luxury-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
             <div className="absolute inset-0 bg-black/60 z-10" />
             <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/luxury-bg.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* RETRO THEME (CRT Static/Grid) */}
        {theme === 'retro' && (
          <motion.div
            key="retro-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[url('/grid.png')] bg-repeat"
          >
             {/* We could use a CRT scanline effect here via CSS instead of video */}
             <div className="w-full h-full animate-scanlines bg-gradient-to-b from-transparent to-black/20 background-size-[100%_4px]" />
          </motion.div>
        )}
        
        {/* POP THEME (Dots/Pattern) */}
        {theme === 'pop' && (
            <motion.div
            key="pop-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-black to-transparent bg-[length:10px_10px]"
            />
        )}

      </AnimatePresence>
      
      {/* Global Grain/Noise Overlay (Always on top of video) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}
