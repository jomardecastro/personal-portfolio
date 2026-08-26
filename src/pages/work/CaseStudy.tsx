import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { getProjectBySlug, roleStyles } from '@/data/projects';
import { systems } from '@/data/systems';

const CaseStudy = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) document.title = `${project.title} — Jose Marie De Castro`;
    return () => {
      document.title = 'Jose Marie De Castro';
    };
  }, [project]);

  // Only flagship projects have their own page; the rest live on the landing page.
  if (!project || !project.featured) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <article className="mx-auto max-w-4xl px-4 pb-24 pt-12">
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to work
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          <div className="hairline mb-6 w-12" />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleStyles[project.role]}`}
              >
                {project.role}
              </span>
              {project.isPrivate && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Private codebase
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{project.tagline}</p>
          <p className="mt-2 text-sm text-muted-foreground">{project.date}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-pill font-mono">
                {tech}
              </span>
            ))}
          </div>

          {project.liveLinks && project.liveLinks.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live deployments
              </p>
              <div className="flex flex-wrap gap-2">
                {project.liveLinks.map((link) => (
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
            </div>
          )}
        </motion.header>

        {project.heroImage && (
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-10 overflow-hidden rounded-xl border border-border bg-muted shadow-card"
          >
            <img
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              width={project.heroImage.width}
              height={project.heroImage.height}
              className="block w-full"
            />
          </motion.figure>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <div className="surface mt-8 grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="metric-num text-2xl">{m.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
                {m.hint && <div className="mt-0.5 text-xs text-muted-foreground/80">{m.hint}</div>}
              </div>
            ))}
          </div>
        )}

        {project.caseStudy?.map((block) => (
          <section key={block.title} className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{block.title}</h2>
            {Array.isArray(block.body) ? (
              <ul className="mt-3 space-y-2.5">
                {block.body.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 leading-relaxed text-muted-foreground">{block.body}</p>
            )}
          </section>
        ))}

        {project.myRole && project.myRole.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">What I built</h2>
            <ul className="mt-3 space-y-2.5">
              {project.myRole.map((item, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.slug === 'omni' && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              What it is made of
            </h2>
            <p className="mt-2 max-w-[62ch] text-muted-foreground">
              Omni is the platform these modules run inside. Each one also stands on its own.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {systems.map((s) => (
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
          </section>
        )}

        {project.gallery && project.gallery.length > 1 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Screens</h2>
            <div className="mt-5 space-y-8">
              {project.gallery.map((img) => (
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

        <div className="mt-14 border-t border-border pt-8">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            All work
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
};

export default CaseStudy;
