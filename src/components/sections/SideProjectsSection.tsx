import { motion } from 'framer-motion';
import { ExternalLink, CalendarCheck, ShoppingBag, Monitor, Gift, Users, ShoppingCart, UserCircle, LayoutDashboard, Package } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  techStack: string[];
  date: string;
  icon: React.ReactNode;
  color: string;
  liveUrl?: string;
  features: { icon: React.ReactNode; label: string }[];
}

const projects: Project[] = [
  {
    title: 'Pop Empire',
    description: 'E-commerce platform for collectibles — "Your Kingdom of Collectibles." Full-featured online store with shopping cart, checkout, user accounts, inventory management, and an admin CMS.',
    techStack: ['React', 'Express', 'Prisma', 'PostgreSQL'],
    date: 'April 2026',
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'text-terminal-pink',
    liveUrl: 'https://popempire.jdecastro.dev',
    features: [
      { icon: <ShoppingCart className="w-3 h-3 text-terminal-orange" />, label: 'Cart & Checkout' },
      { icon: <UserCircle className="w-3 h-3 text-terminal-blue" />, label: 'User Accounts' },
      { icon: <Package className="w-3 h-3 text-terminal-green" />, label: 'Inventory' },
      { icon: <LayoutDashboard className="w-3 h-3 text-terminal-purple" />, label: 'Admin CMS' },
    ],
  },
  {
    title: 'Dental Clinic Booking',
    description: 'Dental clinic website with an online booking system — customers can reserve time slots and manage their appointments.',
    techStack: ['React', 'Express', 'Prisma', 'PostgreSQL'],
    date: 'March 2026',
    icon: <CalendarCheck className="w-5 h-5" />,
    color: 'text-terminal-green',
    liveUrl: 'https://msangalang.jdecastro.dev',
    features: [
      { icon: <CalendarCheck className="w-3 h-3 text-terminal-green" />, label: 'Time Slot Booking' },
      { icon: <Users className="w-3 h-3 text-terminal-blue" />, label: 'Appointment Management' },
    ],
  },
  {
    title: 'Loyalty Rewards System',
    description: 'Custom Loyalty Reward System for an internet cafe using Electron + Node.js, enabling point tracking, rewards redemption, and customer management.',
    techStack: ['Electron', 'Node.js', 'JavaScript'],
    date: 'January 2024',
    icon: <Monitor className="w-5 h-5" />,
    color: 'text-terminal-orange',
    features: [
      { icon: <Gift className="w-3 h-3 text-terminal-orange" />, label: 'Point Tracking & Rewards' },
      { icon: <Users className="w-3 h-3 text-terminal-blue" />, label: 'Customer Management' },
    ],
  },
];

const SideProjectsSection = () => {
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
            <span className="text-gradient-purple">Side Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personal projects built to explore ideas and sharpen skills.
          </p>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-hover rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary/50 ${project.color}`}>
                    {project.icon}
                  </div>
                  <div>
                    <h3 className={`font-mono font-bold text-lg ${project.color}`}>
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">{project.date}</span>
                  </div>
                </div>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Live
                  </a>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>

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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideProjectsSection;
