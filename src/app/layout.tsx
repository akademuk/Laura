import type { Metadata } from 'next';
import { Inter_Tight, Unbounded, Playfair_Display, Montserrat, Comic_Neue, Courier_Prime } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import AccentSwitcher from '@/components/AccentSwitcher';
import VideoBackground from '@/components/VideoBackground';

const inter = Inter_Tight({ subsets: ['latin'], variable: '--font-inter' });
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
// Comic Neue as a fun pop option
const comic = Comic_Neue({ weight:['400', '700'], subsets: ['latin'], variable: '--font-comic' });
// Courier Prime for retro
const courier = Courier_Prime({ weight:['400', '700'], subsets: ['latin'], variable: '--font-courier' });

export const metadata: Metadata = {
  title: 'LAURA MARKETING COURSES',
  description: 'Neo-Brutalism Marketing Courses Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${unbounded.variable} ${playfair.variable} ${montserrat.variable} ${comic.variable} ${courier.variable}`} suppressHydrationWarning>
      <body className="bg-theme-bg text-theme-fg overflow-x-hidden min-h-screen font-theme-b uppercase relative transition-colors duration-500">
        <ThemeProvider>
          <SmoothScroll>
            {/* Background elements */}
            <div className="noise-overlay"></div>
            
            {/* Global Video/Effect Background */}
            <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
              <VideoBackground />
            </div>

            {/* UI */}
            <ThemeSwitcher />
            <AccentSwitcher />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
