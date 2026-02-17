'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] border-b-2 border-black bg-brand-white flex justify-between items-center h-20 px-8 transition-all duration-300">
      <Link href="/" className="font-unbounded font-black text-3xl uppercase tracking-tighter hover:text-brand-neon transition-colors">
        Laura
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-12 font-inter font-bold uppercase tracking-widest text-lg items-center">
        <Link href="#courses" className="hover:line-through decoration-4 underline-offset-4 decoration-brand-neon">Курси</Link>
        <Link href="#about" className="hover:line-through decoration-4 underline-offset-4 decoration-brand-neon">Про нас</Link>
        <Link href="#contact" className="hover:line-through decoration-4 underline-offset-4 decoration-brand-neon">Контакти</Link>
        
        {/* Language Switcher */}
        <div className="flex gap-2 text-sm border-l-2 border-brand-black pl-4 ml-4">
          <button className="hover:text-brand-neon font-black transition-colors">UA</button>
          <span className="text-gray-400">/</span>
          <button className="hover:text-brand-neon font-normal text-gray-500 transition-colors">EN</button>
          <span className="text-gray-400">/</span>
          <button className="hover:text-brand-neon font-normal text-gray-500 transition-colors">RU</button>
        </div>
      </nav>

      {/* Mobile Trigger */}
      <button 
        className="md:hidden flex flex-col gap-1.5 focus:outline-none"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className={`block w-8 h-1 bg-black transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
        <span className={`block w-8 h-1 bg-black transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-8 h-1 bg-black transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-brand-white flex flex-col items-center justify-center gap-8 z-[-1] transition-transform duration-500 ease-in-out ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <Link href="#courses" className="font-unbounded text-5xl uppercase hover:text-brand-neon" onClick={() => setMobileOpen(false)}>Courses</Link>
        <Link href="#about" className="font-unbounded text-5xl uppercase hover:text-brand-neon" onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="#contact" className="font-unbounded text-5xl uppercase hover:text-brand-neon" onClick={() => setMobileOpen(false)}>Contact</Link>
      </div>
    </header>
  );
}
