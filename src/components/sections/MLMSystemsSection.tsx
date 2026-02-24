import { motion } from 'framer-motion';
import MLMGenealogyTree from '../projects/mlm/MLMGenealogyTree';

const MLMSystemsSection = () => {
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
            <span className="text-gradient-primary">MLM Systems</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multi-level marketing platforms with real-time commission tracking.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <MLMGenealogyTree />
        </div>
      </div>
    </section>
  );
};

export default MLMSystemsSection;
