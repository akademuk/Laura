'use client';

import Marquee from 'react-fast-marquee';
import { twMerge } from 'tailwind-merge';

interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  autoFill?: boolean; 
}

const InfiniteMarquee: React.FC<MarqueeProps> = ({ 
  items, 
  direction = 'left', 
  speed = 40, 
  className = '', 
  autoFill = true 
}) => {
  return (
    <div className={twMerge("w-full overflow-hidden border-y-[length:var(--border-width)] border-theme bg-[var(--accent)] text-[var(--bg)] py-3 select-none", className)}>
      <Marquee speed={speed} direction={direction} gradient={false} autoFill={autoFill} className="overflow-y-hidden">
        {items.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="text-4xl md:text-6xl font-theme-h font-black uppercase text-inherit flex-shrink-0 tracking-tighter mx-4">
              {item}
            </span>
             <span className="text-inherit opacity-30 text-4xl md:text-6xl px-4 font-black">•</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default InfiniteMarquee;
