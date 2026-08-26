import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { systems } from '@/data/systems';
import StatusPill from '../StatusPill';

const SystemsSection = () => (
  <section id="systems" className="scroll-mt-20 px-4 py-20">
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="hairline mb-5 w-12" />
        <h2 className="section-title">Systems I build</h2>
        <p className="lede mt-2 max-w-[60ch]">
          Each one runs independently. Take the whole platform, or just the piece your business
          actually needs.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((system, i) => (
          <motion.div
            key={system.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={`/systems/${system.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div
                className={`aspect-[16/10] overflow-hidden border-b border-border bg-muted ${
                  system.heroImage.fit === 'contain' ? 'p-3' : ''
                }`}
              >
                <img
                  src={system.heroImage.src}
                  alt={system.heroImage.alt}
                  width={system.heroImage.width}
                  height={system.heroImage.height}
                  loading="lazy"
                  className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${
                    system.heroImage.fit === 'contain'
                      ? 'object-contain'
                      : 'object-cover object-top'
                  }`}
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
                    {system.name}
                  </h3>
                  <span className="mt-0.5 flex-shrink-0 font-mono text-[11px] text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {system.subtitle && (
                  <p className="mb-2 text-xs text-muted-foreground">{system.subtitle}</p>
                )}

                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {system.tagline}
                </p>

                <div className="mt-4">
                  <StatusPill status={system.status} label={system.statusNote} />
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SystemsSection;
