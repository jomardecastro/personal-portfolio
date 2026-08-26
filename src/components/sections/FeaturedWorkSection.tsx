import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { featuredProjects, roleStyles } from '@/data/projects';

const FeaturedWorkSection = () => {
  return (
    <section id="work" className="scroll-mt-20 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="hairline mb-5 w-12" />
          <h2 className="section-title">Where these run</h2>
          <p className="lede mt-2 max-w-[60ch]">
            The systems above are not a catalogue of ideas — they are modules of platforms already
            in production.
          </p>
        </motion.div>

        {/* Flagship case studies */}
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={`/work/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {project.heroImage && (
                  <div
                    className={`aspect-[16/10] overflow-hidden border-b border-border bg-muted ${
                      project.heroImage.fit === 'contain' ? 'p-4' : ''
                    }`}
                  >
                    <img
                      src={project.heroImage.src}
                      alt={project.heroImage.alt}
                      width={project.heroImage.width}
                      height={project.heroImage.height}
                      loading="lazy"
                      className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${
                        project.heroImage.fit === 'contain'
                          ? 'object-contain'
                          : 'object-cover object-top'
                      }`}
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${roleStyles[project.role]}`}
                    >
                      {project.role}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>

                  {project.metrics && (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      {project.metrics.slice(0, 3).map((m) => (
                        <div key={m.label}>
                          <div className="metric-num text-lg">{m.value}</div>
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span key={tech} className="tech-pill font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read case study
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
};

export default FeaturedWorkSection;
