'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.philosophy-text', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        stagger: 0.1,
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-20 border-t border-brand-black w-full min-h-[80vh] flex flex-col justify-center px-4 md:px-12 bg-white text-brand-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="philosophy-text text-[clamp(2rem,5vw,5rem)] font-bold uppercase leading-[0.9] tracking-tighter mb-12">
          Ми не просто вчимо <br />
          <span className="text-brand-neon">маркетингу.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <p className="philosophy-text text-xl md:text-2xl font-light leading-relaxed">
            Ми створюємо нове покоління креативних лідерів, здатних ламати стереотипи та будувати бренди, що змінюють світ.
          </p>
          <p className="philosophy-text text-xl md:text-2xl font-light leading-relaxed">
            Наш підхід — це 100% практика, реальні кейси та менторство від найкращих експертів індустрії. Жодної води, лише чистий досвід.
          </p>
        </div>
      </div>
    </section>
  );
}
