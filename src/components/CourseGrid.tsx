'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string; 
  videoUrl?: string; // Optional video preview
}

const courses: Course[] = [
  { id: 1, title: 'SEO Мастеринг', description: 'Органічний ріст та семантика', price: '₴12 000', imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad602110242e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80' },
  { id: 2, title: 'SMM Стратегія', description: 'Контент-маркетинг 2025', price: '₴8 000', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80' },
  { id: 3, title: 'Email Маркетинг', description: 'Конверсія лідів миттєво', price: '₴6 000', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80' },
  { id: 4, title: 'Психологія Бренду', description: 'Як закохати клієнта', price: '₴15 000', imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80' },
  { id: 5, title: 'Таргетована Реклама', description: 'ROI 500% і більше', price: '₴10 000', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80' },
  { id: 6, title: 'Креативний Дизайн', description: 'Візуал, що продає', price: '₴14 000', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80' },
];

const CourseCard = ({ course }: { course: Course }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div 
      className={`relative group flex flex-col justify-between h-[500px] overflow-hidden transition-all duration-300 bg-[var(--bg)] border-r-[length:var(--border-width)] border-b-[length:var(--border-width)] border-theme rounded-theme hover:z-10 hover:shadow-theme hover:border-[var(--accent)]`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-20 bg-[url('/noise.png')]">
      </div>

      <div className="relative z-10 p-8 flex flex-col h-full justify-between">
        <div>
           <span className="block font-mono text-xs border-[length:var(--border-width)] border-theme w-fit px-2 py-1 mb-6 uppercase tracking-widest bg-[var(--bg)] text-[var(--fg)]">
             0{course.id} / курс
          </span>
          <h3 className="text-4xl font-theme-h font-black leading-[0.9] uppercase mb-4 decoration-4 underline-offset-4 text-theme-fg">
             {course.title}
          </h3>
          <p className="font-theme-b text-lg font-medium opacity-80 group-hover:opacity-100 transition-opacity text-theme-fg">
            {course.description}
          </p>
        </div>

        <div className="mt-auto z-20">
             {/* CTA Button */}
            <button className="w-full bg-[var(--fg)] text-[var(--bg)] font-theme-h font-bold py-4 text-lg uppercase border-[length:var(--border-width)] border-transparent hover:bg-[var(--accent)] hover:text-black hover:border-theme transition-all active:scale-95 flex items-center justify-between px-6 z-20 relative cursor-pointer rounded-theme shadow-theme">
                <span>Записатись</span>
                <span>{course.price}</span>
            </button>
        </div>
      </div>
      
      {/* Image Reveal on Hover */}
      <motion.div 
        className="absolute bottom-20 right-[-20%] w-[70%] h-[60%] z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ 
            x: hovered ? -30 : 0, 
            rotate: hovered ? -5 : 0,
            scale: hovered ? 1.1 : 1
        }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Image 
          src={course.imageUrl} 
          alt={course.title} 
          fill 
          className="object-cover border-[length:var(--border-width)] border-theme grayscale group-hover:grayscale-0 transition-all duration-500 rounded-theme"
        />
      </motion.div>
    </motion.div>
  );
};

export default function CourseGrid() {
  return (
    <section className="border-t-[length:var(--border-width)] border-theme border-collapse" id="courses">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full bg-[var(--border-color)] gap-0 border-collapse">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
       <div className="border-b-[length:var(--border-width)] border-theme py-20 flex justify-center bg-[var(--accent)] text-[var(--bg)]">
         <h2 className="text-[clamp(2rem,5vw,5rem)] font-theme-h uppercase font-black text-center px-4 leading-none text-[var(--bg)]">
            Стань маркетинговою <br/> <span className="underline decoration-[length:var(--border-width)] underline-offset-8">акулою</span>
         </h2>
      </div>
    </section>
  );
}
