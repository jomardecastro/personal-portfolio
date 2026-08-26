import { motion } from 'framer-motion';
import { Server, UsersRound, CreditCard, Workflow } from 'lucide-react';

const capabilities = [
  {
    icon: <Server className="w-6 h-6" />,
    title: 'Backend APIs',
    color: 'text-primary',
    body: 'Build REST APIs with Express, Prisma, and PostgreSQL that handle real production workloads. Schema design, authentication, pagination, file uploads — the infrastructure an app actually needs to stay up.',
  },
  {
    icon: <UsersRound className="w-6 h-6" />,
    title: 'Role-Based Systems',
    color: 'text-primary',
    body: 'Multi-role portals where admin, staff, vendor, and customer each see a different slice of the data, with permissions that hold up when workflows get complicated. Audit trails, support-side impersonation, per-role scopes.',
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Payment & Tracking Systems',
    color: 'text-primary',
    body: 'Order lifecycles, manual-payment proof flows, status transitions, stock movement, refunds. Systems that deal with real money and real inventory — where the numbers have to match at the end of the day.',
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Automation & Integrations',
    color: 'text-primary',
    body: 'OpenAI, Zapier, webhooks, third-party APIs. Queue-driven workflows, scheduled jobs, notifications — internal tools that replace hours of manual work with a single endpoint.',
  },
];

const CapabilitiesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="hairline mb-5 w-12" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            What I can build
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            I focus on building systems that reflect real workflows — not just features. That
            means designing around how data moves, how roles interact, and how edge cases are
            handled in production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="surface-hover p-6"
            >
              <div className={`inline-flex p-3 rounded-lg bg-muted ${capability.color} mb-4`}>
                {capability.icon}
              </div>
              <h3 className={`font-semibold text-lg mb-3 tracking-tight ${capability.color}`}>
                {capability.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {capability.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
