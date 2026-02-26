import { motion } from 'framer-motion';
import { ArrowDown, Terminal, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onContact: () => void;
}

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
            <span className="text-muted-foreground">Full-Stack Developer</span>
            <span className="text-primary">•</span>
            <span className="text-accent">AI Specialist</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono mb-6"
        >
          <span className="text-foreground">Hi, I'm </span>
          <span className="text-gradient-primary">Jose Marie</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-4 font-mono"
        >
          I build <span className="text-primary">AI-powered tools</span> and{' '}
          <span className="text-accent">automation systems</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          From intelligent content generation to complex MLM systems — I transform 
          ideas into scalable solutions that serve thousands of users.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* <button onClick={onExplore} className="btn-terminal flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Explore My Tools
          </button> */}
          <a onClick={onContact} className="btn-outline-terminal flex items-center gap-2">
            Let's Build Something
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
          className="hidden lg:block absolute left-10 top-1/3 glass rounded-lg p-4 text-left max-w-xs"
        >
          <pre className="text-xs font-mono text-muted-foreground">
            <code>
              <span className="text-terminal-purple">const</span>{' '}
              <span className="text-terminal-blue">developer</span> = {'{'}<br />
              {'  '}<span className="text-accent">name:</span> <span className="text-terminal-orange">"Jomar"</span>,<br />
              {'  '}<span className="text-accent">skills:</span> [<span className="text-terminal-orange">"Node"</span>, <span className="text-terminal-orange">"Vue"</span>, <span className="text-terminal-orange">"SEO"</span>],<br />
              {'  '}<span className="text-accent">coffee:</span> <span className="text-terminal-purple">true</span><br />
              {'}'};
            </code>
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden lg:block absolute right-10 top-1/2 glass rounded-lg p-4 text-left max-w-xs"
        >
          <pre className="text-xs font-mono text-muted-foreground">
            <code>
              <span className="text-terminal-purple">async function</span>{' '}
              <span className="text-terminal-blue">buildAI</span>() {'{'}<br />
              {'  '}<span className="text-terminal-purple">const</span> result = <span className="text-terminal-purple">await</span><br />
              {'    '}openai.<span className="text-terminal-blue">generate</span>();<br />
              {'  '}<span className="text-terminal-purple">return</span> <span className="text-accent">magic</span>;<br />
              {'}'}
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;