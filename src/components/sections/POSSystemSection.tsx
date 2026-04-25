import { motion } from 'framer-motion';
import POSInventorySystem from '../projects/pos/POSInventorySystem';

const POSSystemSection = () => {
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
            <span className="text-gradient-primary">POS + Inventory — Transactional Systems</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transactional inventory system — every sale, refund, and stock movement is an
            auditable event. Built for businesses where "the numbers have to match" is non-negotiable.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <POSInventorySystem />
        </div>
      </div>
    </section>
  );
};

export default POSSystemSection;
