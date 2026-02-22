import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MarqueeBand from '@/components/MarqueeBand';
import TheCore from '@/components/TheCore';
import About from '@/components/About';
import MarketingHouse from '@/components/MarketingHouse';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--fg)] selection:text-[var(--bg)]">
      <Header />
      <Hero />
      <MarqueeBand />
      <TheCore />
      <About />
      <MarketingHouse />
      <CTA />
      <Footer />
    </main>
  );
}
