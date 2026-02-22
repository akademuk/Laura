import type { Metadata } from 'next';
import { Inter_Tight, Unbounded } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter_Tight({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-unbounded' });

export const metadata: Metadata = {
  title: 'Aleksandrovska Hub — Системний маркетинг та управління бізнесом',
  description:
    'Проєктуємо маркетинг, що масштабується. 85 навчальних матеріалів та 4 місяці інтенсиву від практика з 5-річним досвідом.',
  openGraph: {
    title: 'Aleksandrovska Hub — Системний маркетинг та управління бізнесом',
    description:
      'Від хаотичних гіпотез — до системної архітектури бізнесу. Курси, системи та менторство.',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Laura Courses',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * JSON-LD structured data for SEO — EducationalOrganization + Person + Course list.
 * Gives Google rich snippets for educational platform results.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      name: 'Aleksandrovska Hub',
      url: 'https://aleksandrovska.hub',
      description:
        'Проєктуємо маркетинг, що масштабується. Від хаотичних гіпотез — до системної архітектури бізнесу.',
      founder: { '@type': 'Person', name: 'Laura Aleksandrovska' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kyiv',
        addressCountry: 'UA',
      },
    },
    {
      '@type': 'Person',
      name: 'Laura Aleksandrovska',
      jobTitle: 'CMO & Marketing Systems Architect',
      url: 'https://aleksandrovska.hub',
      knowsAbout: [
        'Системний маркетинг',
        'Управління бізнесом',
        'Побудова відділів продажів',
      ],
    },
    {
      '@type': 'Course',
      name: 'Архітектура Відділу Продажів',
      description:
        'Побудова команди, яка робить X2. Від групового найму до Книги продажів.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Aleksandrovska Hub',
      },
      inLanguage: 'uk',
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
      },
    },
    {
      '@type': 'Course',
      name: 'Системоутворюючий Маркетинг',
      description:
        'Перетворення хаосу в трафіку на прогнозовану систему лідогенерації.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Aleksandrovska Hub',
      },
      inLanguage: 'uk',
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
      },
    },
    {
      '@type': 'Course',
      name: 'Стратегічне Управління Бізнесом',
      description:
        'Операційний менеджмент без вигорання. Масштабування через стратегічні партнерства.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Aleksandrovska Hub',
      },
      inLanguage: 'uk',
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${unbounded.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('laura-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}else{document.documentElement.setAttribute('data-theme','dark')}}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`,
          }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--fg)] overflow-x-hidden min-h-screen font-[var(--font-b)] relative antialiased">
        <ThemeProvider>
          {/* Animated film grain — inline SVG so feTurbulence actually renders */}
          <svg className="noise-overlay" aria-hidden="true">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
