import { motion } from 'framer-motion';
import { ArrowDown, Terminal, Download } from 'lucide-react';

interface HeroSectionProps {
  onContact: () => void;
}

const bullets = [
  'REST APIs — Express, Prisma, PostgreSQL',
  'Role-based portals — admin, staff, vendor, customer',
  'Payment flows, order tracking, inventory transactions',
  'Workflow automation — Zapier, webhooks, OpenAI integrations',
  'Complex domain logic — commissions, grading, booking, attendance',
];

const HeroSection = ({ onContact }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center relative py-20 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-mono mb-8">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Backend / Fullstack Developer</span>
            <span className="text-primary">—</span>
            <span className="text-accent">Node.js · Express · Prisma · PostgreSQL</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-mono mb-3 leading-tight"
        >
          <span className="text-gradient-primary">Backend / Fullstack Developer</span>
          <br />
          <span className="text-foreground">Building systems with real-world business logic</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm font-mono text-muted-foreground mb-6"
        >
          — Jose Marie De Castro
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-4 font-mono"
        >
          I build <span className="text-primary">backend systems</span> with real-world{' '}
          <span className="text-accent">business logic and workflows</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          6+ years building APIs, role-based systems, and transactional workflows using
          Node.js, Express, Prisma, and PostgreSQL. Worked on MLM platforms serving 10,000+
          users, POS/inventory systems, and multi-frontend applications handling complex
          domain logic.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-12 max-w-2xl mx-auto space-y-2 text-left font-mono text-sm md:text-base text-muted-foreground"
        >
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="text-primary flex-shrink-0">{'>'}</span>
              <span>{bullet}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a onClick={onContact} className="btn-outline-terminal flex items-center gap-2">
            Let's Build Something
          </a>
          <a
            href="/resume.pdf"
            download="Jose Marie De Castro - Resume.pdf"
            className="btn-outline-terminal flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </motion.div>

        {/* Decorative code block */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:block absolute left-10 top-1/3 glass rounded-lg p-4 text-left max-w-sm"
        >
          <pre className="text-xs font-mono text-muted-foreground">
            <code>
              <span className="text-terminal-purple">const</span>{' '}
              <span className="text-terminal-blue">engineer</span> = {'{'}<br />
              {'  '}<span className="text-accent">name:</span>{' '}
              <span className="text-terminal-orange">"Jomar"</span>,<br />
              {'  '}<span className="text-accent">stack:</span> [
              <span className="text-terminal-orange">"Node"</span>,{' '}
              <span className="text-terminal-orange">"Express"</span>,{' '}
              <span className="text-terminal-orange">"Prisma"</span>,{' '}
              <span className="text-terminal-orange">"Postgres"</span>],<br />
              {'  '}<span className="text-accent">ships:</span>{' '}
              <span className="text-terminal-purple">true</span><br />
              {'}'};
            </code>
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden lg:block absolute right-10 top-1/2 glass rounded-lg p-4 text-left max-w-sm"
        >
          <pre className="text-xs font-mono text-muted-foreground">
            <code>
              router.<span className="text-terminal-blue">post</span>(
              <span className="text-terminal-orange">"/orders"</span>,{' '}
              <span className="text-terminal-purple">async</span> (req, res) =&gt; {'{'}<br />
              {'  '}<span className="text-terminal-purple">const</span> order ={' '}
              <span className="text-terminal-purple">await</span><br />
              {'    '}prisma.order.<span className="text-terminal-blue">create</span>({'{'}<br />
              {'      '}<span className="text-accent">data:</span> req.body<br />
              {'    '}{'}'});<br />
              {'  '}<span className="text-terminal-purple">return</span> res.
              <span className="text-terminal-blue">json</span>(order);<br />
              {'}'});
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
