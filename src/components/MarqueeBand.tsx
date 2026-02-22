'use client';

import Marquee from 'react-fast-marquee';

const WORDS = [
  'СТРАТЕГІЯ',
  'СИСТЕМА',
  'АРХІТЕКТУРА',
  'МАСШТАБУВАННЯ',
  'МАРКЕТИНГ',
  'ТЕХНОЛОГІЇ',
  'ПРОЦЕСИ',
  'DATA-DRIVEN',
];

export default function MarqueeBand() {
  return (
    <div className="relative border-y border-[var(--border-color)] bg-[var(--bg)] overflow-hidden select-none">
      {/* Primary marquee — large */}
      <Marquee
        speed={35}
        direction="left"
        gradient={false}
        autoFill
        className="py-5 md:py-6"
      >
        {WORDS.map((word, i) => (
          <div key={i} className="flex items-center">
            <span className="text-2xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold uppercase text-[var(--fg)] tracking-tighter mx-4 md:mx-6 opacity-10 hover:opacity-100 transition-opacity duration-500">
              {word}
            </span>
            <span className="text-[var(--fg)] opacity-10 text-lg md:text-2xl mx-2">
              ◆
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
