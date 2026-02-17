'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT_COLORS = [
  { name: 'Неоновий Лайм', value: '#ccff00' }, // Current Default
  { name: 'Електрик Блу', value: '#06b6d4' },
  { name: 'Яскраво-рожевий', value: '#db2777' },
  { name: 'Вогняний Помаранч', value: '#ea580c' },
  { name: 'Насичений Фіолет', value: '#9333ea' },
  { name: 'Ціан', value: '#00ffff' },
];

export default function AccentSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  const [currentColor, setCurrentColor] = useState('#ccff00');

  const changeAccent = (color: string) => {
    setCurrentColor(color);
    document.documentElement.style.setProperty('--accent', color);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 isolate">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-2 mb-2 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/20"
          >
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => changeAccent(color.value)}
                className="w-10 h-10 rounded-full border-2 border-white/50 hover:scale-110 transition-transform relative group"
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                  <span className="absolute right-full mr-2 pointer-events-none opacity-0 group-hover:opacity-100 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded">
                      {color.name}
                  </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[var(--accent)] text-black rounded-full shadow-[0_0_15px_var(--accent)] hover:shadow-[0_0_25px_var(--accent)] transition-all flex items-center justify-center font-bold text-2xl border-4 border-black"
        aria-label="Change Accent Color"
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            +
        </div>
      </button>
    </div>
  );
}
