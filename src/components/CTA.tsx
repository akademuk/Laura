'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const container = useRef(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.cta-btn', {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-32 bg-brand-white text-brand-black flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl px-4">
        <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-bold uppercase leading-[0.9] text-brand-black mb-8 tracking-tighter">
          Не гай часу.
          <br />
          <span className="text-brand-neon bg-black px-2">Почни зараз.</span>
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
          Це твій шанс створити кар'єру мрії. Натискай на кнопку, і ми підберемо найкращий варіант для тебе.
        </p>

        <a href="#register" className="cta-btn inline-block bg-brand-neon hover:bg-brand-black hover:text-brand-neon text-brand-black font-bold uppercase py-6 px-12 text-2xl border-4 border-brand-black transition-all duration-300">
          Записатися на курс
        </a>
      </div>
    </section>
  );
}
