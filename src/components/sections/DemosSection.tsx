import { useState } from 'react';
import { motion } from 'framer-motion';
import MLMGenealogyTree from '../projects/mlm/MLMGenealogyTree';
import POSInventorySystem from '../projects/pos/POSInventorySystem';
import WorkflowVisualizerDemo from '../projects/WorkflowVisualizerDemo';
import AIBlogWriterDemo from '../projects/AIBlogWriterDemo';
import LeadIntelligenceDemo from '../projects/LeadIntelligenceDemo';
import APIPlayground from '../projects/APIPlayground';

const TABS = [
  {
    id: 'genealogy',
    label: 'Genealogy tree',
    blurb:
      'Downline placement with binary spillover and commission math — the mechanic behind the Omni genealogy screen.',
    render: () => <MLMGenealogyTree />,
  },
  {
    id: 'pos',
    label: 'POS + inventory',
    blurb:
      'Every sale, refund, and stock movement as an auditable event, so the numbers always reconcile.',
    render: () => <POSInventorySystem />,
  },
  {
    id: 'automation',
    label: 'Workflow automation',
    blurb: 'Webhooks, queues, and scheduled jobs replacing manual touchpoints.',
    render: () => <WorkflowVisualizerDemo />,
  },
  {
    id: 'ai',
    label: 'AI tools',
    blurb: 'Small AI-assisted tools and a live API playground.',
    render: () => (
      <div className="space-y-8">
        <AIBlogWriterDemo />
        <LeadIntelligenceDemo />
        <APIPlayground />
      </div>
    ),
  },
] as const;

const DemosSection = () => {
  const [active, setActive] = useState<string>(TABS[0].id);
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section id="demos" className="scroll-mt-20 border-y border-border bg-muted/40 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="hairline mb-5 w-12" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Interactive demos
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Working demos of the mechanics behind the systems above — running live on this site, not
            the production apps themselves.
          </p>
        </motion.div>

        <div
          role="tablist"
          aria-label="Interactive demos"
          className="mb-6 flex flex-wrap gap-2 border-b border-border"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                active === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm text-muted-foreground">{current.blurb}</p>

        <div>{current.render()}</div>
      </div>
    </section>
  );
};

export default DemosSection;
