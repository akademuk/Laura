import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import Philosophy from '@/components/Philosophy';
import CourseGrid from '@/components/CourseGrid';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-fg selection:bg-[var(--accent)] selection:text-black">
      <Header />
      <Hero />
      <div className="border-t-[length:var(--border-width)] border-b-[length:var(--border-width)] border-theme">
        <InfiniteMarquee 
            items={["Стратегія", "SEO", "SMM", "Контент", "Аналітика", "Ріст", "Бренд"]} 
            className="bg-[var(--accent)] text-[var(--bg)] border-none text-xl font-bold py-6"
            speed={60}
          />
      </div>
      <Philosophy />
      {/* Course Grid doubles as a marquee or we can add a connector */}
      <CourseGrid />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
