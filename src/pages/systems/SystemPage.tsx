import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import StatusPill from '@/components/StatusPill';
import { getSystemBySlug, systems } from '@/data/systems';

const SystemPage = () => {
  const { slug } = useParams();
  const system = getSystemBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (system) document.title = `${system.name} — Jose Marie De Castro`;
    return () => {
      document.title = 'Jose Marie De Castro';
    };
  }, [system]);

  if (!system) return <Navigate to="/" replace />;

  // Photographic screenshots carry an overlaid title; light diagrams need the title above them.
  const overlayHero = system.heroImage.fit !== 'contain';
  const others = systems.filter((s) => s.slug !== system.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <article className="pb-24">
        <div className="mx-auto max-w-5xl px-4 pt-10">
          <Link
            to="/#systems"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All systems
          </Link>
        </div>

        {overlayHero ? (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mt-8 max-w-5xl px-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src={system.heroImage.src}
                alt={system.heroImage.alt}
                width={system.heroImage.width}
                height={system.heroImage.height}
                className="block w-full"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-6 md:p-10"
                style={{
                  background:
                    'linear-gradient(transparent, hsl(var(--ink) / 0.94) 45%)',
                  color: 'hsl(var(--ink-foreground))',
                }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusPill status={system.status} label={system.statusNote} />
                </div>
                <h1 className="display-sm" style={{ color: 'hsl(var(--ink-foreground))' }}>
                  {system.name}
                </h1>
                <p
                  className="mt-3 max-w-[60ch] text-base leading-relaxed md:text-lg"
                  style={{ color: 'hsl(var(--ink-muted))' }}
                >
                  {system.tagline}
                </p>
              </div>
            </div>
          </motion.header>
        ) : (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mt-8 max-w-5xl px-4"
          >
            <div className="hairline mb-6 w-12" />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="display-sm">{system.name}</h1>
                {system.subtitle && (
                  <p className="mt-1.5 text-sm text-muted-foreground">{system.subtitle}</p>
                )}
              </div>
              <StatusPill status={system.status} label={system.statusNote} />
            </div>
            <p className="lede mt-4 max-w-[62ch]">{system.tagline}</p>

            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-muted p-3">
              <img
                src={system.heroImage.src}
                alt={system.heroImage.alt}
                width={system.heroImage.width}
                height={system.heroImage.height}
                className="block w-full"
              />
            </div>
          </motion.header>
        )}

        <div className="mx-auto max-w-5xl px-4">
          <div className="mt-8 flex flex-wrap gap-2">
            {system.techStack.map((tech) => (
              <span key={tech} className="tech-pill font-mono">
                {tech}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-[70ch] text-base leading-relaxed text-muted-foreground">
            {system.description}
          </p>

          {system.runsAt && system.runsAt.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Running in production at
              </h2>
              <div className="flex flex-wrap gap-2">
                {system.runsAt.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12">
            <h2 className="section-title text-2xl">What it does</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {system.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Contrast band — the engineering argument, not the feature list */}
        <section className="band-ink mt-16 px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="hairline mb-5 w-12" />
            <h2 className="section-title" style={{ color: 'hsl(var(--ink-foreground))' }}>
              Why it holds up
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {system.highlights.map((h) => (
                <p
                  key={h}
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--ink-muted))' }}
                >
                  {h}
                </p>
              ))}
            </div>
            <div
              className="mt-10 rounded-xl border p-5"
              style={{ borderColor: 'hsl(var(--ink-border))' }}
            >
              <h3
                className="mb-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(var(--ink-muted))' }}
              >
                Deploying it on its own
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--ink-foreground))' }}>
                {system.gating}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4">
          {system.gallery && system.gallery.length > 1 && (
            <section className="mt-16">
              <h2 className="section-title text-2xl">Screens</h2>
              <div className="mt-5 space-y-8">
                {system.gallery.map((img) => (
                  <figure key={img.src}>
                    <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-card">
                      <img
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        loading="lazy"
                        className="block w-full"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="mt-2.5 text-sm text-muted-foreground">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 border-t border-border pt-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Other systems
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  to={`/systems/${s.slug}`}
                  className="surface-hover flex items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <p className="truncate text-sm text-muted-foreground">{s.tagline}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              These all run together as{' '}
              <Link to="/work/omni" className="font-medium text-primary hover:underline">
                Omni
              </Link>{' '}
              — one codebase behind six live businesses.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
};

export default SystemPage;
