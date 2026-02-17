'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Олександр К.',
    text: 'Це не просто курс, це повне перезавантаження мозку. Я нарешті зрозумів, як працює сучасний маркетинг.',
  },
  {
    name: 'Ірина М.',
    text: 'Неймовірний дизайн платформи, круті ментори та спільнота, яка надихає.',
  },
  {
    name: 'Дмитро В.',
    text: 'Практичні завдання допомогли мені знайти перших клієнтів ще під час навчання.',
  },
];

export default function Testimonials() {
  const container = useRef(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
    //  gsap.from('.testimonial-card', {
    //    opacity: 0,
    //    y: 50,
    //    stagger: 0.2,
    //    scrollTrigger: {
    //      trigger: container.current,
    //      start: 'top 80%',
    //    }
    //  });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative py-20 bg-brand-black text-brand-white border-y border-brand-neon">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold uppercase leading-[0.8] mb-20 text-center tracking-tighter">
          Відгуки <span className="text-brand-neon">*</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card border border-brand-neon/50 p-8 hover:bg-brand-neon/10 transition-colors duration-300 backdrop-blur-sm">
              <p className="text-xl md:text-2xl mb-8 font-light italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-neon border border-brand-white flex items-center justify-center text-brand-black font-bold">
                  {t.name[0]}
                </div>
                <span className="text-lg font-bold uppercase tracking-wider">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
