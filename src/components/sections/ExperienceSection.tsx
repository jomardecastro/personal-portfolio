import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Award, ChevronDown, ChevronRight, MapPin, Calendar, Monitor, Gift, Users, ExternalLink, CalendarCheck } from 'lucide-react';

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  techStack: string[];
  color: string;
}

const experiences: Experience[] = [
  {
    id: 'asap',
    role: 'Freelance VA / Full-Stack Developer',
    company: 'ASAP Cash Offer & Cash For Houses',
    period: 'March 2021 - Present',
    location: 'United States (Remote)',
    description: 'Lead Generation Website, and the owner does SEO work for other websites too.',
    highlights: [
      'Developed AI-powered blog writing tool using Vue.js and Node.js integrated with OpenAI REST API, reducing content creation time by 80%',
      'Expanded the AI tool into a white-label API service accessible via webhooks, now serving multiple third-party clients',
      'Built intelligent lead processing automation using WordPress, Zapier, and Grok AI API for real-time skip tracing and comparative market analysis',
      'Created multiple funnel-type WordPress websites driving conversions and lead generation for real estate investment business',
      'Collaborated directly with client to enhance SEO strategies across 10+ websites, improving search rankings and organic traffic',
    ],
    techStack: ['Vue.js', 'Node.js', 'PHP', 'WordPress', 'OpenAI API', 'Grok AI', 'Zapier', 'MySQL'],
    color: 'text-primary',
  },
  {
    id: 'geer',
    role: 'Mid-Full Stack Web Developer',
    company: 'GEER IT Solutions',
    period: 'December 2019 - June 2025',
    location: 'Taguig, Philippines',
    description: 'Enterprise software development for MLM, POS, and e-commerce platforms.',
    highlights: [
      'Developed and maintained white-label MLM system serving 10,000+ active users across multiple client deployments',
      'Led small development team in migrating MLM system codebase to new architecture with zero downtime',
      'Built POS and Inventory Management Systems for multiple retail clients with real-time transaction processing',
      'Optimized compensation plan algorithms and refactored POS system, improving performance by 40%',
      'Converted Figma designs into responsive, pixel-perfect HTML/CSS for multiple web applications',
      'Received Leadership Award (December 2020) for mentoring junior developers and leading successful project deliveries',
    ],
    techStack: ['PHP', 'Laravel', 'CakePHP', 'Angular', 'Vue.js', 'MySQL', 'MariaDB', 'Git'],
    color: 'text-accent',
  },
  {
    id: 'digima',
    role: 'Junior Web Developer',
    company: 'Digima Web Solutions',
    period: 'March 2018 - December 2019',
    location: 'Taguig City, Philippines',
    description: 'MLM platform development with Angular and Laravel.',
    highlights: [
      'Developed Admin Panel and Member Areas for MLM platform using Angular (frontend) and Laravel (backend)',
      'Implemented role-based access control and user management systems',
      'Provided technical support and bug resolution, including after-hours emergency fixes for critical production issues',
      'Collaborated with senior developers to implement features and maintain code quality standards',
    ],
    techStack: ['Angular', 'Laravel', 'PHP', 'MySQL', 'JavaScript', 'HTML/CSS'],
    color: 'text-terminal-purple',
  },
];

const ExperienceSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>('asap');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4">
            <span className="text-muted-foreground">{'// '}</span>
            <span className="text-gradient-primary">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            6+ years building scalable web applications, SaaS platforms, and AI-powered systems.
          </p>
        </motion.div>

        {/* Terminal-style git log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl overflow-hidden mb-12"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/30">
            <div className="w-3 h-3 rounded-full bg-terminal-pink" />
            <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
            <div className="w-3 h-3 rounded-full bg-terminal-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">git log --career</span>
          </div>

          {/* Experience entries */}
          <div className="p-4 md:p-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Timeline connector */}
                {index < experiences.length - 1 && (
                  <div className="absolute left-[11px] top-10 bottom-0 w-px bg-border" />
                )}

                <div className="flex gap-4 mb-6">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 mt-1.5">
                    <div className={`w-6 h-6 rounded-full border-2 border-current ${exp.color} flex items-center justify-center bg-background`}>
                      <div className={`w-2 h-2 rounded-full bg-current ${exp.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => toggleExpand(exp.id)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-mono font-bold text-lg ${exp.color} group-hover:underline`}>
                            {exp.role}
                          </h3>
                          <p className="text-foreground font-mono text-sm mt-1">
                            <span className="text-terminal-orange">@</span> {exp.company}
                          </p>
                        </div>
                        <div className="flex-shrink-0 mt-1">
                          {expandedId === exp.id ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedId === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pl-4 border-l-2 border-border">
                            <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>

                            <ul className="space-y-2 mb-4">
                              {exp.highlights.map((highlight, i) => (
                                <li key={i} className="text-sm text-foreground/80 flex gap-2">
                                  <span className="text-primary flex-shrink-0 mt-0.5">{'>'}</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                              {exp.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-xs font-mono px-2 py-1 rounded bg-secondary/50 text-muted-foreground border border-border/50"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Side Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="text-lg font-mono font-bold mb-4 text-muted-foreground">
            {'> '}<span className="text-gradient-purple">Side Projects</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dental Clinic Booking */}
            <div className="glass-hover rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/50 text-terminal-green">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h4 className="font-mono font-bold text-terminal-green">Dental Clinic Booking</h4>
                <span className="text-xs font-mono text-muted-foreground ml-auto">March 2026</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Dental clinic website with an online booking system — customers can reserve time slots and manage their appointments.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {['React', 'Express', 'Prisma', 'PostgreSQL'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2 py-1 rounded bg-secondary/50 text-muted-foreground border border-border/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href="https://msangalang.jdecastro.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                msangalang.jdecastro.dev
              </a>
            </div>

            {/* Loyalty Rewards System */}
            <div className="glass-hover rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/50 text-terminal-orange">
                  <Monitor className="w-5 h-5" />
                </div>
                <h4 className="font-mono font-bold text-terminal-orange">Loyalty Rewards System</h4>
                <span className="text-xs font-mono text-muted-foreground ml-auto">January 2024</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Custom Loyalty Reward System for an internet cafe using Electron + Node.js, enabling point tracking, rewards redemption, and customer management.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Electron', 'Node.js', 'JavaScript'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2 py-1 rounded bg-secondary/50 text-muted-foreground border border-border/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Gift className="w-3 h-3 text-terminal-orange" />
                  Point Tracking & Rewards
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-terminal-blue" />
                  Customer Management
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education & Award */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-hover rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/50 text-terminal-blue">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-terminal-blue">Education</h3>
            </div>
            <p className="font-mono text-sm text-foreground font-semibold">
              Bachelor of Science in Information Technology
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              STI College Malolos · Malolos City, Bulacan
            </p>
          </motion.div>

          {/* Award */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-hover rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/50 text-terminal-yellow">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-terminal-yellow">Recognition</h3>
            </div>
            <p className="font-mono text-sm text-foreground font-semibold">
              Leadership Award
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              GEER IT Solutions · December 2020
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              For mentoring junior developers and leading successful project deliveries.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
