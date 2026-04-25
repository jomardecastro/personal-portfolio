import { motion } from 'framer-motion';
import WorkflowVisualizerDemo from '../projects/WorkflowVisualizerDemo';

const AutomationSection = () => {
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
            <span className="text-gradient-purple">Workflow Automation & Integrations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Workflow automation with webhooks, queues, and scheduled jobs. Integrations with
            OpenAI, Zapier, and internal tools — replacing manual touchpoints with code.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <WorkflowVisualizerDemo />
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;