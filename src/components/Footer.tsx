'use client';

import Link from 'next/link';
import InfiniteMarquee from './InfiniteMarquee';

export default function Footer() {
  return (
    <footer className="relative min-h-[80vh] bg-[var(--fg)] text-[var(--bg)] flex flex-col justify-between overflow-hidden transition-colors duration-500 rounded-t-[var(--radius)]">
      
      {/* Top Border Marquee */}
      <div className="bg-[var(--accent)] text-[var(--bg)] border-b-[length:var(--border-width)] border-[var(--bg)]">
        <InfiniteMarquee 
          items={["Маркетинг", "Контент", "Стратегія", "Креатив", "Laura Marketing", "Ріст"]} 
          speed={40} 
          className="font-theme-b uppercase text-2xl font-black py-4"
        />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-4 md:space-y-8 py-20 relative z-10">
        <Link href="#" className="font-theme-h font-black text-6xl md:text-[8rem] uppercase hover:text-[var(--accent)] transition-colors leading-none tracking-tighter">
          Instagram
        </Link>
        <Link href="#" className="font-theme-h font-black text-6xl md:text-[8rem] uppercase hover:text-[var(--accent)] transition-colors leading-none tracking-tighter">
          Telegram
        </Link>
        <Link href="#" className="font-theme-h font-black text-6xl md:text-[8rem] uppercase hover:text-[var(--accent)] transition-colors leading-none tracking-tighter">
          TikTok
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-t-[length:var(--border-width)] border-[var(--bg)] w-full text-lg uppercase font-mono tracking-widest">
         <div className="p-8 border-b-[length:var(--border-width)] md:border-b-0 md:border-r-[length:var(--border-width)] border-[var(--bg)] flex flex-col justify-between">
            <p>Based in Kyiv, Ukraine</p>
            <p className="mt-4 text-white/50">&copy; 2026 Laura Marketing.</p>
         </div>
         <div className="p-8 flex flex-col justify-between items-end text-right">
             <a href="mailto:hello@laura.com" className="hover:underline text-2xl mb-4">hello@laura.com</a>
             <p>All rights reserved.</p>
         </div>
      </div>
    </footer>
  );
}
