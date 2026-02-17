'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number;
}

export default function TypewriterText({
  text,
  speed = 50,
  className = '',
  delay = 0,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const startTyping = () => {
      let index = 0;
      intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) {
          clearInterval(intervalId);
        }
      }, speed);
    };

    const timeoutId = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Invisible text to reserve space */}
      <span className="invisible select-none" aria-hidden="true">
        {text}
      </span>
      
      {/* Visible animated text overlay */}
      <span className="absolute top-0 left-0 text-left">
        {displayedText}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
          className="inline-block w-[3px] h-[0.9em] bg-current ml-1 align-baseline translate-y-[0.1em]"
        />
      </span>
    </div>
  );
}
