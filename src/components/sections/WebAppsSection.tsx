import { motion } from 'framer-motion';
import MLMDashboardDemo from '../projects/MLMDashboardDemo';
import POSSystemDemo from '../projects/POSSystemDemo';

const WebAppsSection = () => {
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
            <span className="text-gradient-primary">Web Applications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Full-stack applications serving thousands of users daily.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <MLMDashboardDemo />
          <POSSystemDemo />
        </div>
      </div>
    </section>
  );
};

export default WebAppsSection;