import { useState } from 'react';
import { motion } from 'framer-motion';

const techStack = {
  Backend: [
    { name: 'Node.js', color: 'accent', projects: ['Pop Empire', 'Dental Clinic', 'School System', 'Loyalty Rewards'] },
    { name: 'Express', color: 'primary', projects: ['Pop Empire', 'Dental Clinic', 'School System'] },
    { name: 'Prisma', color: 'terminal-blue', projects: ['Pop Empire', 'Dental Clinic', 'School System'] },
    { name: 'TypeScript', color: 'terminal-purple', projects: ['Pop Empire', 'Dental Clinic'] },
    { name: 'Python', color: 'terminal-yellow', projects: ['AI Scripts', 'Data Processing'] },
    { name: 'PHP', color: 'terminal-orange', projects: ['MLM System', 'WordPress Sites'] },
    { name: 'Laravel', color: 'destructive', projects: ['MLM Platform', 'Admin Panels'] },
    { name: 'CakePHP', color: 'terminal-yellow', projects: ['MLM System'] },
  ],
  Databases: [
    { name: 'PostgreSQL', color: 'terminal-blue', projects: ['Pop Empire', 'Dental Clinic', 'School System'] },
    { name: 'MySQL', color: 'terminal-orange', projects: ['MLM System', 'POS System'] },
    { name: 'MariaDB', color: 'primary', projects: ['MLM System'] },
    { name: 'MongoDB', color: 'accent', projects: ['Real-time Apps'] },
    { name: 'Redis', color: 'destructive', projects: ['Caching', 'Sessions'] },
    { name: 'Firebase', color: 'terminal-yellow', projects: ['Real-time Features'] },
  ],
  'AI/Automation': [
    { name: 'OpenAI', color: 'accent', projects: ['Blog Writer', 'Content Generator'] },
    { name: 'Grok AI', color: 'terminal-orange', projects: ['Lead Intelligence'] },
    { name: 'n8n', color: 'terminal-pink', projects: ['Workflow Automation'] },
    { name: 'Zapier', color: 'terminal-yellow', projects: ['Integrations'] },
  ],
  Frontend: [
    { name: 'React', color: 'primary', projects: ['Pop Empire', 'Dental Clinic'] },
    { name: 'Vue.js', color: 'accent', projects: ['School System', 'MLM System'] },
    { name: 'Angular', color: 'terminal-pink', projects: ['MLM Platform', 'Admin Panels'] },
    { name: 'TailwindCSS', color: 'terminal-purple', projects: ['Pop Empire', 'Dental Clinic'] },
    { name: 'Quasar', color: 'terminal-orange', projects: ['Vue.js Apps'] },
  ],
};

const TechStackSection = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="hairline mb-5 w-12" />
          <h2 className="section-title">Tech stack</h2>
          <p className="lede mt-2 max-w-[60ch]">
            Hover any technology to see where I have used it.
          </p>
        </motion.div>

        {/* Grouped rows rather than four bordered cards — the page already has enough boxes. */}
        <div className="divide-y divide-border border-t border-border">
          {Object.entries(techStack).map(([category, techs], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid gap-3 py-5 sm:grid-cols-[170px_1fr] sm:gap-6"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span
                    key={tech.name}
                    onMouseEnter={() => setHoveredTech(tech.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                    className={`relative cursor-default rounded-lg border px-3 py-1.5 font-mono text-[13px] transition-colors ${
                      hoveredTech === tech.name
                        ? 'border-primary/50 bg-primary/5 text-foreground'
                        : 'border-border bg-muted/60 text-muted-foreground'
                    }`}
                  >
                    {tech.name}
                    {hoveredTech === tech.name && tech.projects?.length > 0 && (
                      <span className="absolute left-0 top-full z-20 mt-2 w-max max-w-xs rounded-lg border border-border bg-popover p-3 text-left shadow-lift">
                        <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">
                          Used in
                        </span>
                        <span className="block text-xs text-foreground">
                          {tech.projects.join(' · ')}
                        </span>
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
