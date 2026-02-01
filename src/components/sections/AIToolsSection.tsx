import { motion } from 'framer-motion';
import AIBlogWriterDemo from '../projects/AIBlogWriterDemo';
import LeadIntelligenceDemo from '../projects/LeadIntelligenceDemo';
import APIPlayground from '../projects/APIPlayground';

const AIToolsSection = () => {
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
            <span className="text-gradient-primary">AI Tools Playground</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive demos of AI-powered tools I've built. Try them out!
          </p>
        </motion.div>

        <div className="space-y-8">
          <AIBlogWriterDemo />
          <LeadIntelligenceDemo />
          <APIPlayground />
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;