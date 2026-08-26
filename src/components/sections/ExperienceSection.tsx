import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, ChevronDown, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { roles as experiences, education, recognition, yearsOfExperience } from '@/data/experience';

const ExperienceSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>('asap');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="experience" className="scroll-mt-20 py-20 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="hairline mb-5 w-12" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Experience
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {yearsOfExperience()} years building scalable web applications, SaaS platforms, and
            AI-powered systems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface mb-12 overflow-hidden"
        >
          {/* Experience entries */}
          <div className="p-5 md:p-6">
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
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <div className="h-2 w-2 rounded-full bg-primary" />
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
                          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline">
                            {exp.role}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="flex-shrink-0 mt-1">
                          {expandedId === exp.id ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
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
                                  className="tech-pill"
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

        {/* Education & Award */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="surface-hover p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-muted text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">Education</h3>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {education.degree}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {education.school} · {education.location}
            </p>
          </motion.div>

          {/* Award */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="surface-hover p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-muted text-primary">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">Recognition</h3>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {recognition.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {recognition.org} · {recognition.date}
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              {recognition.note}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
