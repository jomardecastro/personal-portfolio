import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number | string;
  suffix?: string;
  label: string;
  hint: string;
}

const stats: Stat[] = [
  { value: 8, label: 'Years shipping production code', hint: 'since March 2018' },
  { value: 20, suffix: '+', label: 'Sites and systems shipped', hint: 'agency work, client builds and my own products' },
  { value: 6, label: 'Businesses on one platform', hint: 'one codebase, no forks' },
  { value: '10,000+', label: 'Users served', hint: 'across MLM platforms built and maintained' },
];

const Counter = ({ value, suffix, inView }: { value: number; suffix?: string; inView: boolean }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setN(value);
      return;
    }
    let frame = 0;
    const total = 40;
    const id = window.setInterval(() => {
      frame += 1;
      setN(Math.round(value * (frame / total)));
      if (frame >= total) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [inView, value]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
};

/** Full-bleed dark band — the page's main contrast beat between work and experience. */
const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="band-ink px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="hairline mb-5 w-12" />
        <h2 className="section-title" style={{ color: 'hsl(var(--ink-foreground))' }}>
          The short version
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="font-mono text-4xl font-semibold tracking-tight md:text-5xl"
                style={{ color: 'hsl(var(--ink-foreground))', fontVariantNumeric: 'tabular-nums' }}
              >
                {typeof s.value === 'number' ? (
                  <Counter value={s.value} suffix={s.suffix} inView={inView} />
                ) : (
                  s.value
                )}
              </div>
              <div className="mt-3 text-sm font-medium" style={{ color: 'hsl(var(--ink-foreground))' }}>
                {s.label}
              </div>
              <div className="mt-1 text-xs" style={{ color: 'hsl(var(--ink-muted))' }}>
                {s.hint}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
