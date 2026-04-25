import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  CalendarCheck,
  ShoppingBag,
  Monitor,
  Gift,
  Users,
  ShoppingCart,
  UserCircle,
  LayoutDashboard,
  Package,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

type Role = 'Owner / Developer' | 'Contributor';

interface CaseStudyBlock {
  title: string;
  body: string | string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  date: string;
  icon: React.ReactNode;
  color: string;
  role: Role;
  liveUrl?: string;
  features: { icon: React.ReactNode; label: string }[];
  caseStudy?: CaseStudyBlock[];
}

const projects: Project[] = [
  {
    id: 'pop-empire',
    title: 'Pop Empire',
    description:
      'Full-featured online store for collectibles ("Your Kingdom of Collectibles"). Shopping cart, checkout, user accounts, inventory management, and an admin CMS — all on a custom Express + Prisma + PostgreSQL backend.',
    techStack: ['React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
    date: 'April 2026',
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'text-terminal-pink',
    role: 'Owner / Developer',
    liveUrl: 'https://popempire.jdecastro.dev',
    features: [
      { icon: <ShoppingCart className="w-3 h-3 text-terminal-orange" />, label: 'Cart & Checkout' },
      { icon: <UserCircle className="w-3 h-3 text-terminal-blue" />, label: 'User Accounts' },
      { icon: <Package className="w-3 h-3 text-terminal-green" />, label: 'Inventory' },
      { icon: <LayoutDashboard className="w-3 h-3 text-terminal-purple" />, label: 'Admin CMS' },
    ],
    caseStudy: [
      {
        title: 'Problem',
        body: 'Collectible sellers were juggling orders across messaging apps, spreadsheets, and ad-hoc payment confirmations. No centralized inventory. No order history. Bank transfers were tracked manually, and "did you get my payment?" was a routine chat message.',
      },
      {
        title: 'Solution',
        body: 'A custom e-commerce backend that owns the full order lifecycle — cart to checkout to fulfillment — with manual payment verification built in, so local bank-transfer workflows map cleanly onto a digital system. No third-party payment processor required. Designed specifically for markets where bank transfers are standard, not card payments.',
      },
      {
        title: 'Key Features',
        body: [
          'Cart + checkout with stock validation at checkout (prevents overselling)',
          'Manual payment submission — customer uploads proof, admin verifies from dashboard',
          'Order tracking with status transitions: pending → paid → shipped → completed',
          'Inventory tied to orders — stock decrements on verified payment, not at cart-add',
          'Admin CMS for products, orders, payments, users',
          'Role-based auth: customer vs. admin',
        ],
      },
      {
        title: 'Business Value',
        body: 'Replaces five-plus manual touchpoints (chat confirmations, spreadsheets, manual inventory counts) with one system. Owner sees real-time stock and pending payments at a glance. Customers get order history and status updates instead of chasing the seller in chat.',
      },
    ],
  },
  {
    id: 'geer',
    title: 'GEER — School Management System',
    description:
      'Multi-role school management platform serving K-12 and college institutions. One centralized backend (Express + Prisma) feeds four independent frontends: admin, teacher, guardian (PWA), and a gate scanner for QR-based attendance.',
    techStack: ['Express', 'Prisma', 'PostgreSQL', 'Vue', 'PWA'],
    date: 'Contributed 2023 – 2025',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-terminal-blue',
    role: 'Contributor',
    features: [
      { icon: <Users className="w-3 h-3 text-terminal-blue" />, label: '4 Role-Based Frontends' },
      { icon: <LayoutDashboard className="w-3 h-3 text-terminal-purple" />, label: 'K-12 + College Grading' },
      { icon: <Package className="w-3 h-3 text-terminal-green" />, label: 'QR Attendance' },
    ],
    caseStudy: [
      {
        title: 'What I Worked On',
        body: [
          'Extended backend endpoints for grading and attendance workflows',
          'Maintained and adapted the Prisma schema as requirements evolved across institution types',
          'Implemented features across multiple role-based frontends via the shared API',
          "Debugged and hardened existing code in a codebase I didn't design — learning the patterns before touching them",
        ],
      },
      {
        title: 'Technical Complexity',
        body: [
          'Multi-tenant grading logic — K-12 uses a quarterly/transmutation system; college uses GPA with its own computation rules. Both live in the same codebase, switched by institution type.',
          'Four independent frontends on one API, each with a different permission scope.',
          'QR-based gate attendance — guardians get a push notification the instant a student is scanned in or out.',
          'Medical record tracking tied to student profiles with role-gated visibility.',
          'Notification fan-out across SMS, push, and email.',
        ],
      },
      {
        title: 'Why This Is a Strong System',
        body: 'School systems are the classic "simple in theory, messy in practice" problem. Grading rules change per institution. The role model has to cover teachers, guardians, admins, and gate staff. Attendance has to work under spotty connectivity. Working inside this system — without owning it — meant reading unfamiliar code fast, respecting existing patterns, and shipping features that fit a large, opinionated architecture.',
      },
    ],
  },
  {
    id: 'dental-clinic',
    title: 'Dental Clinic Booking',
    description:
      'Dental clinic booking portal. Customers reserve time slots and manage appointments; admins see the schedule and confirm bookings. Built to replace phone-based scheduling with a self-service flow.',
    techStack: ['React', 'Express', 'Prisma', 'PostgreSQL'],
    date: 'March 2026',
    icon: <CalendarCheck className="w-5 h-5" />,
    color: 'text-terminal-green',
    role: 'Owner / Developer',
    liveUrl: 'https://msangalang.jdecastro.dev',
    features: [
      { icon: <CalendarCheck className="w-3 h-3 text-terminal-green" />, label: 'Time Slot Booking' },
      { icon: <Users className="w-3 h-3 text-terminal-blue" />, label: 'Appointment Management' },
    ],
  },
  {
    id: 'loyalty-rewards',
    title: 'Loyalty Rewards System',
    description:
      'Custom Loyalty Reward System for an internet cafe using Electron + Node.js, enabling point tracking, rewards redemption, and customer management.',
    techStack: ['Electron', 'Node.js', 'JavaScript'],
    date: 'January 2024',
    icon: <Monitor className="w-5 h-5" />,
    color: 'text-terminal-orange',
    role: 'Owner / Developer',
    features: [
      { icon: <Gift className="w-3 h-3 text-terminal-orange" />, label: 'Point Tracking & Rewards' },
      { icon: <Users className="w-3 h-3 text-terminal-blue" />, label: 'Customer Management' },
    ],
  },
];

const roleStyles: Record<Role, string> = {
  'Owner / Developer': 'border-accent/40 text-accent bg-accent/5',
  Contributor: 'border-terminal-purple/40 text-terminal-purple bg-terminal-purple/5',
};

const FeaturedWorkSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>('pop-empire');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4">
            <span className="text-muted-foreground">{'// '}</span>
            <span className="text-gradient-purple">Featured Work</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selected projects and case studies — what I've built and what I've shipped.
          </p>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            const hasCaseStudy = !!project.caseStudy?.length;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-hover rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg bg-secondary/50 ${project.color} flex-shrink-0`}>
                      {project.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-mono font-bold text-lg ${project.color}`}>
                        {project.title}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">{project.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-shrink-0 items-end sm:items-center gap-2">
                    <span
                      className={`text-[10px] sm:text-xs font-mono px-2 py-1 rounded-full border ${roleStyles[project.role]} whitespace-nowrap`}
                    >
                      {project.role}
                    </span>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors whitespace-nowrap"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Live
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2 py-1 rounded bg-secondary/50 text-muted-foreground border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                  {project.features.map((feature) => (
                    <span key={feature.label} className="flex items-center gap-1">
                      {feature.icon}
                      {feature.label}
                    </span>
                  ))}
                </div>

                {hasCaseStudy && (
                  <>
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="mt-4 flex items-center gap-2 text-xs font-mono text-primary hover:underline"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      {isExpanded ? 'Hide case study' : 'Read case study'}
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pl-4 border-l-2 border-border space-y-5">
                            {project.caseStudy!.map((block) => (
                              <div key={block.title}>
                                <h4 className={`font-mono text-sm font-bold mb-2 ${project.color}`}>
                                  {block.title}
                                </h4>
                                {Array.isArray(block.body) ? (
                                  <ul className="space-y-2">
                                    {block.body.map((item, i) => (
                                      <li key={i} className="text-sm text-foreground/80 flex gap-2">
                                        <span className="text-primary flex-shrink-0 mt-0.5">{'>'}</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {block.body}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;
