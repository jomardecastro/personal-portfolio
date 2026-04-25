import { useState } from 'react';
import { motion } from 'framer-motion';

const techStack = {
  Backend: [
    { name: 'Node.js', color: 'accent', projects: ['Pop Empire', 'Dental Clinic', 'GEER', 'Loyalty Rewards'] },
    { name: 'Express', color: 'primary', projects: ['Pop Empire', 'Dental Clinic', 'GEER'] },
    { name: 'Prisma', color: 'terminal-blue', projects: ['Pop Empire', 'Dental Clinic', 'GEER'] },
    { name: 'TypeScript', color: 'terminal-purple', projects: ['Pop Empire', 'Dental Clinic'] },
    { name: 'Python', color: 'terminal-yellow', projects: ['AI Scripts', 'Data Processing'] },
    { name: 'PHP', color: 'terminal-orange', projects: ['MLM System', 'WordPress Sites'] },
    { name: 'Laravel', color: 'destructive', projects: ['MLM Platform', 'Admin Panels'] },
    { name: 'CakePHP', color: 'terminal-yellow', projects: ['MLM System'] },
  ],
  Databases: [
    { name: 'PostgreSQL', color: 'terminal-blue', projects: ['Pop Empire', 'Dental Clinic', 'GEER'] },
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
    { name: 'Vue.js', color: 'accent', projects: ['GEER', 'MLM System'] },
    { name: 'Angular', color: 'terminal-pink', projects: ['MLM Platform', 'Admin Panels'] },
    { name: 'TailwindCSS', color: 'terminal-purple', projects: ['Pop Empire', 'Dental Clinic'] },
    { name: 'Quasar', color: 'terminal-orange', projects: ['Vue.js Apps'] },
  ],
};

const TechStackSection = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4">
            <span className="text-muted-foreground">{'// '}</span>
            <span className="text-gradient-purple">Tech Stack</span>
          </h2>
          <p className="text-muted-foreground">Hover to see which projects use each technology</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(techStack).map(([category, techs], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="glass rounded-xl p-6"
              style={{ zIndex: techs.some(t => t.name === hoveredTech) ? 50 : 'auto' }}
            >
              <h3 className="font-mono text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <div className="space-y-3">
                {techs.map((tech) => (
                  <motion.div
                    key={tech.name}
                    onHoverStart={() => setHoveredTech(tech.name)}
                    onHoverEnd={() => setHoveredTech(null)}
                    className="relative"
                  >
                    <motion.div
                      className={`p-3 rounded-lg glass-hover cursor-pointer border ${
                        hoveredTech === tech.name ? 'border-primary/50' : 'border-transparent'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <span className={`font-mono text-sm text-${tech.color}`}>
                        {tech.name}
                      </span>
                    </motion.div>

                    {/* Tooltip */}
                    {hoveredTech === tech.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-full top-0 ml-2 z-10 glass rounded-lg p-3 min-w-48"
                      >
                        <div className="text-xs font-mono  text-muted-foreground mb-2">
                          Used in:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tech.projects.map((project) => (
                            <span
                              key={project}
                              className="text-xs px-2 py-1 bg-primary/10 rounded text-primary"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
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