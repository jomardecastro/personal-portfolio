/**
 * Single source of truth for career history.
 *
 * Both the site's Experience section and the résumé generator
 * (`scripts/build-resume.mjs`) read from here, so the two can never drift —
 * which is exactly how the published PDF ended up two years behind the site.
 */

export interface Role {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description?: string;
  highlights: string[];
  techStack: string[];
}

export const CAREER_START = 'March 2018';

/** Whole years since CAREER_START — derived, so it can never go stale again. */
export const yearsOfExperience = (now: Date = new Date()): number => {
  const start = new Date(2018, 2, 1); // March 2018
  let y = now.getFullYear() - start.getFullYear();
  if (now.getMonth() < start.getMonth()) y -= 1;
  return y;
};

export const profile = {
  name: 'Jose Marie De Castro',
  title: 'Senior Full Stack Developer',
  location: 'Philippines',
  email: 'connect@jdecastro.dev',
  site: 'jdecastro.dev',
  linkedin: 'in/jose-marie-d-903873268',
  linkedinUrl: 'https://www.linkedin.com/in/jose-marie-d-903873268',
};

export const roles: Role[] = [
  {
    id: 'asap',
    role: 'Full Stack Developer (Contract)',
    company: 'ASAP Cash Offer / Cash For Houses (US real estate investor)',
    period: 'March 2021 - Present',
    location: 'United States (Remote)',
    description: 'Lead generation websites, marketing automation, and AI tooling.',
    highlights: [
      'Developed AI-powered blog writing tool using Vue.js and Node.js integrated with OpenAI REST API, reducing content creation time by 80%',
      'Expanded the AI tool into a white-label API service accessible via webhooks, now serving multiple third-party clients',
      'Created multiple funnel-type WordPress websites driving conversions and lead generation for real estate investment business',
      'Collaborated directly with client to enhance SEO strategies across 25+ websites, improving search rankings and organic traffic',
    ],
    techStack: ['Vue.js', 'Node.js', 'PHP', 'WordPress', 'OpenAI API', 'Grok AI', 'Zapier', 'MySQL'],
  },
  {
    id: 'omni',
    role: 'Senior Full Stack Developer',
    company: 'Omni Tech Business IT Solutions',
    period: 'July 2025 - Present',
    location: 'Philippines (Remote)',
    description:
      'A multi-tenant commerce platform running six live client businesses from one codebase.',
    highlights: [
      'Designed an append-only financial ledger with per-slot wallet materialization, so every balance is reproducible from history rather than edited in place',
      'Built a pluggable compensation framework — nineteen payout plans behind one interface, with framework-owned locking, idempotency and earning caps',
      'Shipped five independently deployable modules: storefront and marketplace, cashier POS, multi-branch inventory, commissions, and a learning platform',
      'Delivered white-label multi-tenancy through 162 configuration flags, so a new client is a deployment and a preset rather than a fork',
      'Operate six single-tenant production deployments with per-client object storage and automated nightly database backups',
    ],
    techStack: [
      'TypeScript',
      'Fastify',
      'PostgreSQL',
      'Drizzle',
      'Redis',
      'BullMQ',
      'React',
      'Docker',
    ],
  },
  {
    id: 'easyimpound',
    role: 'Full Stack Developer (Contract)',
    company: 'EasyImpound',
    period: 'September 2025 - November 2025',
    location: 'Los Angeles, CA (Remote)',
    highlights: [
      'Refactored an AI-generated monolithic codebase created in Replit into well-structured, maintainable frontend and backend repositories',
      'Collaborated closely with the Lead Developer to build the MVP, ensuring clean architecture and proper separation of concerns',
      'Delivered production-ready code on a tight timeline while maintaining code quality and documentation standards',
    ],
    techStack: ['JavaScript', 'Node.js', 'Git'],
  },
  {
    id: 'geer',
    role: 'Mid-Full Stack Web Developer',
    company: 'GEER IT Solutions',
    period: 'December 2019 - June 2025',
    location: 'Taguig, Philippines',
    description: 'Enterprise software development for direct-sales commerce, POS, and e-commerce platforms.',
    highlights: [
      'Developed and maintained a white-label direct-sales commerce platform serving 10,000+ active users across multiple client deployments',
      'Led a small development team in migrating the platform codebase to a new architecture with zero downtime',
      'Built POS and Inventory Management Systems for multiple retail clients with real-time transaction processing',
      'Optimized compensation plan algorithms and refactored POS system, improving performance by 40%',
      'Built features across a multi-portal school management platform spanning K-12 and college academics',
      'Received Leadership Award (December 2020) for mentoring junior developers and leading successful project deliveries',
    ],
    techStack: ['PHP', 'Laravel', 'CakePHP', 'Angular', 'Vue.js', 'MySQL', 'MariaDB', 'Git'],
  },
  {
    id: 'digima',
    role: 'Junior Web Developer',
    company: 'Digima Web Solutions',
    period: 'March 2018 - December 2019',
    location: 'Taguig City, Philippines',
    description: 'Direct-sales commerce platform development with Angular and Laravel.',
    highlights: [
      'Developed Admin Panel and Member Areas for a direct-sales platform using Angular (frontend) and Laravel (backend)',
      'Implemented role-based access control and user management systems',
      'Provided technical support and bug resolution, including after-hours emergency fixes for critical production issues',
      'Collaborated with senior developers to implement features and maintain code quality standards',
    ],
    techStack: ['Angular', 'Laravel', 'PHP', 'MySQL', 'JavaScript', 'HTML/CSS'],
  },
];

export const education = {
  degree: 'Bachelor of Science in Information Technology',
  school: 'STI College Malolos',
  location: 'Malolos City, Bulacan',
};

export const recognition = {
  title: 'Leadership Award',
  org: 'GEER IT Solutions',
  date: 'December 2020',
  note: 'For mentoring junior developers and leading successful project deliveries.',
};

/** Résumé-only: grouped skills. The site renders its own Tech Stack section. */
export const skills: { label: string; items: string[] }[] = [
  {
    label: 'Backend',
    items: ['Node.js', 'TypeScript', 'Fastify', 'Express.js', 'PHP', 'Laravel', 'CakePHP', 'RESTful APIs'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'Redis', 'MongoDB', 'Firebase', 'Drizzle', 'Prisma'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Vue.js', 'Angular', 'Quasar', 'Tailwind CSS', 'JavaScript (ES6+)'],
  },
  {
    label: 'AI & Automation',
    items: ['OpenAI API', 'Grok AI', 'AI-assisted development', 'Zapier', 'Workflow automation'],
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'Caddy', 'BullMQ', 'S3-compatible storage', 'Git', 'Linux', 'CI/CD'],
  },
  {
    label: 'Other',
    items: ['Payment gateway integration', 'POS systems', 'SEO optimization', 'WordPress'],
  },
];
