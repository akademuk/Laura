'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import InfiniteMarquee from './InfiniteMarquee';
import HeroBackground3D from './HeroBackground3D';
import TypewriterText from './TypewriterText';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Staggered fade up with more dramatic reveal
      gsap.from('.hero-element', {
        y: 100,
        opacity: 0,
        rotate: 2,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex flex-col justify-end pt-32 pb-0 overflow-hidden bg-transparent transition-colors duration-500">
      
      {/* 3D WebGL Background */}
      <HeroBackground3D />
      
      {/* Readability Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-0" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 flex-grow flex flex-col justify-center pointer-events-none">
        <h1 className="font-theme-h font-black leading-[0.85] tracking-tighter uppercase mb-8 md:mb-12 pointer-events-auto text-white drop-shadow-2xl">
          <div className="hero-element text-[clamp(4rem,10vw,12rem)] hover:text-[var(--accent)] transition-colors duration-300">Laura</div>
          <div className="hero-element text-[clamp(4rem,10vw,12rem)] flex items-center gap-4">
             Marketing
          </div>
          <div className="hero-element text-[clamp(4rem,10vw,12rem)] text-transparent stroke-text hover:text-white transition-colors duration-500 cursor-pointer" style={{ WebkitTextStroke: '2px white' }}>
            Courses
          </div>
        </h1>
        
        <div className="hero-element flex flex-col md:flex-row justify-between items-end gap-6 py-8 mt-auto mb-12 pointer-events-auto">
           <div className="text-lg md:text-2xl font-theme-b font-bold uppercase tracking-wide max-w-xl leading-snug text-white min-h-[3em] drop-shadow-md">
            <TypewriterText 
              text="Опануй мистецтво цифрового маркетингу. Реальні навички для сучасного світу." 
              speed={40}
              delay={1000}
              className="block"
            />
          </div>
          <div className="flex gap-4">
            <button className="bg-white text-black hover:bg-[var(--accent)] hover:text-black transition-colors px-12 py-6 font-black uppercase text-xl border-2 border-transparent rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
              Розпочати
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black transition-colors px-12 py-6 font-black uppercase text-xl rounded-none">
              Програма
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
