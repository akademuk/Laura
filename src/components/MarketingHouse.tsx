'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
/* ─── Premium thin-line SVG icons ─── */
const ib = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const IcoChevron = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><polyline points="6 9 12 15 18 9" /></svg>
);
const IcoTarget = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const IcoSearch = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IcoChart = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-8" /></svg>
);
const IcoUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><circle cx="19" cy="7" r="3" /><path d="M21 21v-1.5a3 3 0 0 0-2-2.83" /></svg>
);
const IcoServer = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
);
const IcoCpu = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>
);
const IcoGlobe = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="4" ry="10" /><path d="M2 12h20" /></svg>
);
const IcoBook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...ib} {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="13" y2="11" /></svg>
);

/* ─── Data ─── */

interface HouseItem {
  icon: (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  title: string;
  description: string;
}

interface HouseSection {
  id: string;
  label: string;
  title: string;
  color: string;
  items: HouseItem[];
}

const sections: HouseSection[] = [
  {
    id: 'foundation',
    label: '01',
    title: 'Фундамент — Стратегія, Аналітика та HR-базис',
    color: 'var(--fg)',
    items: [
      {
        icon: IcoTarget,
        title: 'SOSTACK Model',
        description:
          'Глибоке проектування стратегії (Situation, Objectives, Strategy, Tactics, Action, Control).',
      },
      {
        icon: IcoSearch,
        title: 'Пошук точки G',
        description:
          'Знаходження критичного вузла системи, де мінімальне зусилля створює максимальний прибуток та кратне масштабування.',
      },
      {
        icon: IcoChart,
        title: 'Економіка',
        description:
          'Unit-економіка (LTV, CAC, ROMI), сегментація ЦА через тригери та психографію.',
      },
      {
        icon: IcoUsers,
        title: 'Команда та Ресурс',
        description:
          'Груповий та індивідуальний найм, система онбордингу 2.0. Аналіз ефективності оргструктури: людський, часовий та моральний ресурс. Розробка посадових інструкцій (KPI/OKR), що виключають дублювання функцій.',
      },
    ],
  },
  {
    id: 'walls',
    label: '02',
    title: 'Стіни — Канали, Процеси та Технології',
    color: 'var(--fg)',
    items: [
      {
        icon: IcoServer,
        title: 'Infrastructure',
        description:
          'Налаштування CRM-архітектури, де не втрачається жоден лід.',
      },
      {
        icon: IcoCpu,
        title: 'Tech Stack',
        description:
          'Складна інтеграція через API та Webhooks, створення мультилендингів та висококонверсійних сайтів.',
      },
      {
        icon: IcoGlobe,
        title: 'Ecosystem',
        description:
          "Об'єднання соцмереж, реклами та контент-маркетингу в єдину мережу.",
      },
      {
        icon: IcoBook,
        title: 'Base of Knowledge',
        description:
          'Створення регламентів та бази знань, що робить бізнес незалежним від персоналій.',
      },
    ],
  },
];

/* ─── Accordion Section ─── */
function HouseLevel({
  section,
  index,
  isOpen,
  onToggle,
}: {
  section: HouseSection;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="border border-[var(--border-color)] group"
    >
      {/* Header (clickable) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 md:px-10 py-6 md:py-8 text-left cursor-pointer hover:bg-[var(--card-bg)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--fg)]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <span className="text-xs font-[var(--font-h)] font-bold text-[var(--muted)] tracking-wider flex-shrink-0">
            {section.label}
          </span>
          <h3 className="text-lg md:text-xl lg:text-2xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-snug truncate">
            {section.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <IcoChevron
            width={20}
            height={20}
            className="text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors"
          />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border-color)] px-6 md:px-10 py-8 md:py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="group/card p-5 md:p-6 border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-sm hover:border-[var(--fg)] transition-colors duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 border border-[var(--fg)]/[0.08] flex items-center justify-center flex-shrink-0 group-hover/card:border-[var(--fg)]/[0.25] transition-all duration-500">
                          <Icon
                            className="text-[var(--muted)] group-hover/card:text-[var(--fg)] transition-colors duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm md:text-base font-[var(--font-h)] font-bold text-[var(--fg)] mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-[var(--muted)] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── SVG House Illustration ─── */
function HouseSVG({
  activeSection,
  onSectionClick,
}: {
  activeSection: string | null;
  onSectionClick: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const wallHighlight = activeSection === 'walls' || hovered === 'walls';
  const foundHighlight = activeSection === 'foundation' || hovered === 'foundation';

  return (
    <svg
      viewBox="0 0 480 320"
      className="w-full max-w-lg mx-auto mb-12 md:mb-16"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="houseGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="houseGlowHover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Ground line ── */}
      <line
        x1="40" y1="262" x2="440" y2="262"
        stroke="var(--fg)" strokeWidth="0.5" opacity="0.1"
      />

      {/* ── Foundation block (clickable + hoverable) ── */}
      <motion.g
        animate={{ opacity: foundHighlight ? 1 : 0.35 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setHovered('foundation')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onSectionClick('foundation')}
        style={{ cursor: 'pointer' }}
      >
        {/* Hit area (invisible) */}
        <rect x="78" y="220" width="324" height="44" fill="transparent" />
        {/* Main foundation rect */}
        <motion.rect
          x="80" y="222" width="320" height="40" rx="2"
          fill={
            activeSection === 'foundation'
              ? 'url(#houseGlow)'
              : hovered === 'foundation'
                ? 'url(#houseGlowHover)'
                : 'none'
          }
          stroke="var(--fg)"
          animate={{ strokeWidth: foundHighlight ? 1.5 : 0.8 }}
          transition={{ duration: 0.3 }}
        />
        {/* Foundation hatching lines */}
        {[130, 180, 230, 280, 330, 370].map((lx) => (
          <motion.line
            key={lx} x1={lx} y1="226" x2={lx} y2="258"
            stroke="var(--fg)" strokeWidth="0.3"
            animate={{ opacity: foundHighlight ? 0.4 : 0.15 }}
            transition={{ duration: 0.3 }}
          />
        ))}
        {/* Label */}
        <motion.text
          x="240" y="247" textAnchor="middle"
          fill="var(--fg)" fontSize="9"
          fontFamily="var(--font-h)" letterSpacing="3"
          animate={{ opacity: foundHighlight ? 0.9 : 0.25 }}
          transition={{ duration: 0.3 }}
        >
          ФУНДАМЕНТ
        </motion.text>
      </motion.g>

      {/* ── Walls block (clickable + hoverable) ── */}
      <motion.g
        animate={{ opacity: wallHighlight ? 1 : 0.35 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setHovered('walls')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onSectionClick('walls')}
        style={{ cursor: 'pointer' }}
      >
        {/* Hit area (invisible) */}
        <rect x="98" y="106" width="284" height="118" fill="transparent" />
        {/* Main wall rect */}
        <motion.rect
          x="100" y="108" width="280" height="114" rx="1"
          fill={
            activeSection === 'walls'
              ? 'url(#houseGlow)'
              : hovered === 'walls'
                ? 'url(#houseGlowHover)'
                : 'none'
          }
          stroke="var(--fg)"
          animate={{ strokeWidth: wallHighlight ? 1.5 : 0.8 }}
          transition={{ duration: 0.3 }}
        />

        {/* Windows row — 3 elegant tall windows */}
        {[170, 240, 310].map((cx) => (
          <g key={cx}>
            <motion.rect
              x={cx - 16} y={128} width="32" height="48" rx="1"
              fill="none" stroke="var(--fg)"
              animate={{
                strokeWidth: wallHighlight ? 1 : 0.5,
                opacity: wallHighlight ? 0.7 : 0.2,
              }}
              transition={{ duration: 0.3 }}
            />
            {/* Window cross */}
            <motion.line
              x1={cx} y1={128} x2={cx} y2={176}
              stroke="var(--fg)" strokeWidth="0.4"
              animate={{ opacity: wallHighlight ? 0.5 : 0.12 }}
              transition={{ duration: 0.3 }}
            />
            <motion.line
              x1={cx - 16} y1={152} x2={cx + 16} y2={152}
              stroke="var(--fg)" strokeWidth="0.4"
              animate={{ opacity: wallHighlight ? 0.5 : 0.12 }}
              transition={{ duration: 0.3 }}
            />
          </g>
        ))}

        {/* Door — center */}
        <motion.rect
          x="224" y="184" width="32" height="38" rx="1"
          fill="none" stroke="var(--fg)"
          animate={{
            strokeWidth: wallHighlight ? 1 : 0.5,
            opacity: wallHighlight ? 0.6 : 0.15,
          }}
          transition={{ duration: 0.3 }}
        />
        {/* Door knob */}
        <motion.circle
          cx="250" cy="205" r="1.5"
          fill="var(--fg)"
          animate={{ opacity: wallHighlight ? 0.5 : 0.15 }}
          transition={{ duration: 0.3 }}
        />

        {/* Label */}
        <motion.text
          x="240" y="200" textAnchor="middle"
          fill="var(--fg)" fontSize="9"
          fontFamily="var(--font-h)" letterSpacing="3"
          animate={{ opacity: wallHighlight ? 0.9 : 0.25 }}
          transition={{ duration: 0.3 }}
        >
          СТІНИ
        </motion.text>
      </motion.g>

      {/* ── Roof ── */}
      <motion.g
        animate={{ opacity: hovered || activeSection ? 0.2 : 0.4 }}
        transition={{ duration: 0.4 }}
      >
        {/* Roof slopes */}
        <motion.path
          d="M240,42 L80,108 L400,108 Z"
          fill="none"
          stroke="var(--fg)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Chimney */}
        <rect
          x="310" y="55" width="18" height="35" rx="1"
          fill="none" stroke="var(--fg)" strokeWidth="0.5" opacity="0.4"
        />
        {/* Roof ridge line */}
        <line
          x1="240" y1="42" x2="240" y2="108"
          stroke="var(--fg)" strokeWidth="0.3" opacity="0.15"
        />
      </motion.g>

      {/* ── Decorative measurement lines (architectural style) ── */}
      <g opacity="0.12">
        {/* Left dimension */}
        <line x1="60" y1="42" x2="60" y2="262" stroke="var(--fg)" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="56" y1="42" x2="64" y2="42" stroke="var(--fg)" strokeWidth="0.5" />
        <line x1="56" y1="262" x2="64" y2="262" stroke="var(--fg)" strokeWidth="0.5" />
        {/* Right dimension */}
        <line x1="420" y1="108" x2="420" y2="262" stroke="var(--fg)" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="416" y1="108" x2="424" y2="108" stroke="var(--fg)" strokeWidth="0.5" />
        <line x1="416" y1="262" x2="424" y2="262" stroke="var(--fg)" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

/* ─── Main Component ─── */
export default function MarketingHouse() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="marketing-house"
      className="relative py-28 md:py-40 bg-[var(--secondary)] overflow-hidden"
      aria-label="Маркетинговий Будинок — структура програми"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs md:text-sm uppercase tracking-[0.5em] text-[var(--muted)] mb-6 font-medium"
          >
            Структура програми
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.05]"
          >
            Маркетинговий{' '}
            <span className="italic font-normal text-[var(--muted)]">
              Будинок
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-[var(--muted)] mt-4 max-w-lg mx-auto"
          >
            Кожен елемент — на своєму місці. Натисніть на рівень, щоб побачити
            деталізацію.
          </motion.p>
        </div>

        {/* SVG House */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HouseSVG
            activeSection={openSection}
            onSectionClick={(id) =>
              setOpenSection((prev) => (prev === id ? null : id))
            }
          />
        </motion.div>

        {/* Accordion Levels */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <HouseLevel
              key={section.id}
              section={section}
              index={i}
              isOpen={openSection === section.id}
              onToggle={() =>
                setOpenSection((prev) =>
                  prev === section.id ? null : section.id
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
