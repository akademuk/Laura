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
      {/* Global Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}
