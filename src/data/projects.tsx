import {
  CalendarCheck,
  Gift,
  GraduationCap,
  LayoutDashboard,
  Monitor,
  Package,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Store,
  UserCircle,
  Users,
  Network,
  Fingerprint,
  Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';

export type Role = 'Owner / Developer' | 'Contributor' | 'Lead Developer';

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** Diagrams must not be cropped; screenshots may be. Defaults to 'cover'. */
  fit?: 'cover' | 'contain';
}

export interface ProjectMetric {
  value: string;
  label: string;
  hint?: string;
}

export interface CaseStudyBlock {
  title: string;
  body: string | string[];
}

export interface LiveLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  date: string;
  icon: ReactNode;
  role: Role;
  /** Flagship projects get a large card on the landing page and their own /work/:slug route. */
  featured?: boolean;
  liveUrl?: string;
  liveLabel?: string;
  /** Multiple public deployments (used by Omni to evidence the multi-tenant story). */
  liveLinks?: LiveLink[];
  isPrivate?: boolean;
  heroImage?: ProjectImage;
  gallery?: ProjectImage[];
  metrics?: ProjectMetric[];
  myRole?: string[];
  features: { icon: ReactNode; label: string }[];
  caseStudy?: CaseStudyBlock[];
}

export const projects: Project[] = [
  {
    id: 'omni',
    slug: 'omni',
    title: 'Omni',
    tagline:
      'A multi-tenant direct-sales commerce platform, running six live client businesses from one codebase.',
    description:
      'Omni is a self-hosted platform where distributors buy, sell, build a downline, and get paid — with an append-only ledger underneath so every peso is traceable. Four role-based apps (member, admin, cashier POS, merchant) sit over one correct ledger, and each client gets their own deployment, branding, and compensation rules without forking the code.',
    techStack: [
      'TypeScript',
      'Fastify',
      'PostgreSQL',
      'Drizzle',
      'Redis',
      'BullMQ',
      'React',
      'Tailwind',
      'Docker',
      'Caddy',
    ],
    date: '2025 – Present',
    icon: <Store className="h-5 w-5" />,
    role: 'Owner / Developer',
    featured: true,
    isPrivate: true,
    liveLinks: [
      { label: 'Success Mall', url: 'https://successmall.shopping' },
      { label: 'Alpha Global Prestige', url: 'https://alphaglobal-prestige.com' },
      { label: 'TESLABARC', url: 'https://teslabtech.com' },
      { label: 'Ultra Proactive', url: 'https://ultraproactive.ph' },
    ],
    metrics: [
      { value: '6', label: 'Live client deployments', hint: 'one codebase, no forks' },
      { value: '4', label: 'Role-based apps', hint: 'member · admin · cashier · merchant' },
      { value: '19', label: 'Compensation plans', hint: 'pluggable, configurable per tenant' },
    ],
    heroImage: {
      src: '/work/omni/02-agp.webp',
      alt: 'Alpha Global Prestige storefront — a bespoke branded landing page built on Omni',
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: '/work/omni/02-agp.webp',
        alt: 'Alpha Global Prestige storefront',
        caption: 'Alpha Global Prestige — a fully bespoke branded landing, same platform.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/work/omni/04-ultraproactive.webp',
        alt: 'Ultra Proactive / Promag300 Premier storefront',
        caption:
          'Ultra Proactive — one deployment serving two branded domains with independent sessions.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/work/omni/01-successmall.webp',
        alt: 'Success Mall marketplace storefront',
        caption: 'Success Mall — marketplace layout with member pricing and cashback.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/work/omni/03-teslab.webp',
        alt: 'TESLABARC marketplace storefront',
        caption: 'TESLABARC — same components, a different tenant theme and catalog.',
        width: 1600,
        height: 1000,
      },
    ],
    features: [
      { icon: <Receipt className="h-3.5 w-3.5" />, label: 'Append-only ledger' },
      { icon: <Network className="h-3.5 w-3.5" />, label: 'Genealogy tree' },
      { icon: <ShoppingCart className="h-3.5 w-3.5" />, label: 'Storefront & checkout' },
      { icon: <LayoutDashboard className="h-3.5 w-3.5" />, label: 'Cashier POS' },
    ],
    myRole: [
      'Designed the append-only ledger and the per-slot wallet materializer — money is never updated or deleted, only appended, so every balance can be recomputed from history.',
      'Built the pluggable compensation-plan framework: each plan is a pure function that proposes entries, while the framework owns locking, idempotency, and daily caps.',
      'Implemented multi-tenant theming and feature flags so a new client is a config and a deployment, not a fork.',
      'Built the buyer storefront, checkout, manual-payment approval, and the cashier POS.',
      'Ran the production deployments: six single-tenant boxes, per-client object storage, automated nightly database backups.',
    ],
    caseStudy: [
      {
        title: 'The problem',
        body: 'The business was running on a legacy Vue 2 + Firebase system where money movements were hard to trace. In a category with a serious trust problem, "where did this number come from?" is the question that matters most — and it could not be answered reliably. Every client also wanted their own branding and their own compensation rules, which meant the old answer was a new fork per client.',
      },
      {
        title: 'The approach',
        body: [
          'Make the money legible. Every cash and gift-certificate movement is a row in an append-only ledger, keyed so that retries can never double-pay. Balances are materialized from that history rather than mutated in place.',
          'Make correctness structural, not careful. Per-slot advisory locks are taken in a fixed order before any money math, and idempotency is enforced by a unique index rather than by application discipline — no code path updates or deletes a ledger row.',
          'Make new clients cheap. Theming, feature flags, and compensation configuration are data. Adding a client is a deployment and a preset, not a branch.',
        ],
      },
      {
        title: 'Architecture',
        body: [
          'Fastify + TypeScript API, a BullMQ worker for compensation events and wallet materialization, and four React SPAs sharing one component library.',
          'PostgreSQL with ltree for genealogy traversal and full-text + trigram search for the catalog; Redis for queues, pub/sub, and cache.',
          'Compensation plans implement a pure compute() that returns proposed ledger entries — the framework applies them transactionally, so plan logic stays testable against reference fixtures.',
          'Deployed as single-tenant Docker stacks behind Caddy, with per-client object storage and nightly database backups.',
        ],
      },
      {
        title: 'What it proves',
        body: 'Six businesses run on this today, each with their own domain, branding, catalog, and payout rules — from a single codebase. The screenshots below are all the same platform.',
      },
    ],
  },
  {
    id: 'school-management',
    slug: 'school-management',
    title: 'School System',
    tagline:
      'K-12 and university in one product: a single backend behind eight role-based portals and two entirely different academic engines.',
    description:
      'A school management platform covering both K-12 (DepEd) and college institutions. A single Express + Prisma backend serves eight independent React frontends — admin, teacher, guardian (PWA), RFID gate scanner, canteen POS, registrar, guidance, and clinic — each with its own permission scope. Grading, attendance, billing, a cashless student wallet, and student welfare all live in one system.',
    techStack: ['React', 'MUI', 'Express', 'Prisma', 'PostgreSQL', 'Redis', 'PWA', 'RFID'],
    date: '2023 – Present',
    icon: <GraduationCap className="h-5 w-5" />,
    role: 'Lead Developer',
    featured: true,
    isPrivate: true,
    metrics: [
      { value: '8', label: 'Role-based portals' },
      { value: '2', label: 'Academic systems', hint: 'K-12 (DepEd) + college' },
      { value: '7', label: 'Distinct user roles' },
    ],
    heroImage: {
      src: '/work/school/00-portals.webp',
      alt: 'Architecture diagram: eight role-based portals over one Express + Prisma API, with separate K-12 and college grading engines',
      width: 1600,
      height: 780,
      fit: 'contain',
    },
    gallery: [
      {
        src: '/work/school/00-portals.webp',
        alt: 'Architecture diagram: eight portals over one API',
        caption: 'Eight portals, one API, and two academic engines selected by institution type.',
        width: 1600,
        height: 780,
      },
      {
        src: '/work/school/01-architecture.webp',
        alt: 'Full system flowchart covering every role and workflow',
        caption:
          'The full workflow map the team worked from — every role and flow in the system.',
        width: 1800,
        height: 1845,
      },
    ],
    features: [
      { icon: <Users className="h-3.5 w-3.5" />, label: '8 role-based portals' },
      { icon: <LayoutDashboard className="h-3.5 w-3.5" />, label: 'K-12 + college grading' },
      { icon: <Fingerprint className="h-3.5 w-3.5" />, label: 'RFID attendance' },
      { icon: <Wallet className="h-3.5 w-3.5" />, label: 'Cashless canteen wallet' },
    ],
    myRole: [
      'Now lead on the platform, owning its direction and the rewrite currently underway.',
      'Extended backend endpoints for grading and attendance workflows.',
      'Maintained the Prisma schema as requirements diverged between K-12 and college institutions.',
      'Shipped features across several role-based frontends on the shared API.',
      'Debugged and hardened a large codebase I did not originally design — learning its patterns before changing them.',
    ],
    caseStudy: [
      {
        title: 'Why it is harder than it looks',
        body: 'School systems are the classic "simple in theory, messy in practice" problem. Grading rules change per institution: K-12 uses component-weighted marks (written work, performance tasks, quarterly assessment) with transmutation, while college uses percentage and 5-point scales. Both live in the same codebase, switched by institution type.',
      },
      {
        title: 'Technical complexity',
        body: [
          'Two academic engines in one product, selected by institution type rather than forked.',
          'Eight independent frontends against one API, each with a different permission scope.',
          'RFID gate attendance that buffers offline and syncs when connectivity returns — school gates cannot depend on good wifi.',
          'A cashless canteen wallet: students tap an RFID card, staff confirm, and guardians top up and watch the balance from a PWA.',
          'Student welfare records — guidance referrals and clinic health data — with role-gated visibility, because not every staff member should see them.',
        ],
      },
      {
        title: 'How my role changed',
        body: 'I joined an existing, opinionated architecture rather than starting it — most of the early value was in reading unfamiliar code quickly, respecting the patterns already there, and shipping features that fit. I now lead the platform and own where it goes next.',
      },
      {
        title: 'Status',
        body: 'The platform ran in production for a private school group and is now being rewritten under my lead. The hosted demo environment is offline during that work, so the architecture diagram above is the clearest public artifact of what the system covers.',
      },
    ],
  },
  {
    id: 'pop-empire',
    slug: 'pop-empire',
    title: 'Pop Empire',
    tagline: 'A collectibles store built for bank-transfer markets, not card payments.',
    description:
      'Full-featured online store for collectibles. Shopping cart, checkout, user accounts, inventory management, and an admin CMS — on a custom Express + Prisma + PostgreSQL backend, with manual payment verification built in.',
    techStack: ['React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
    date: 'April 2026',
    icon: <ShoppingBag className="h-5 w-5" />,
    role: 'Owner / Developer',
    liveUrl: 'https://popempire.jdecastro.dev',
    features: [
      { icon: <ShoppingCart className="h-3.5 w-3.5" />, label: 'Cart & checkout' },
      { icon: <UserCircle className="h-3.5 w-3.5" />, label: 'User accounts' },
      { icon: <Package className="h-3.5 w-3.5" />, label: 'Inventory' },
      { icon: <LayoutDashboard className="h-3.5 w-3.5" />, label: 'Admin CMS' },
    ],
    caseStudy: [
      {
        title: 'Problem',
        body: 'Collectible sellers were juggling orders across messaging apps, spreadsheets, and ad-hoc payment confirmations. No centralized inventory, no order history, and "did you get my payment?" as a routine chat message.',
      },
      {
        title: 'Solution',
        body: 'An e-commerce backend that owns the full order lifecycle — cart to checkout to fulfillment — with manual payment verification built in, so local bank-transfer workflows map cleanly onto a digital system. Designed for markets where bank transfers are standard, not cards.',
      },
      {
        title: 'Key features',
        body: [
          'Stock validated at checkout, so overselling is structurally prevented',
          'Customer uploads proof of payment; admin verifies from the dashboard',
          'Order status transitions: pending → paid → shipped → completed',
          'Inventory decrements on verified payment, not at cart-add',
          'Role-based auth separating customer and admin',
        ],
      },
    ],
  },
  {
    id: 'dental-clinic',
    slug: 'dental-clinic',
    title: 'Dental Clinic Booking',
    tagline: 'Self-service appointment booking that replaced phone scheduling.',
    description:
      'Dental clinic booking portal. Customers reserve time slots and manage appointments; admins see the schedule and confirm bookings.',
    techStack: ['React', 'Express', 'Prisma', 'PostgreSQL'],
    date: 'March 2026',
    icon: <CalendarCheck className="h-5 w-5" />,
    role: 'Owner / Developer',
    liveUrl: 'https://msangalang.jdecastro.dev',
    features: [
      { icon: <CalendarCheck className="h-3.5 w-3.5" />, label: 'Time slot booking' },
      { icon: <Users className="h-3.5 w-3.5" />, label: 'Appointment management' },
    ],
  },
  {
    id: 'loyalty-rewards',
    slug: 'loyalty-rewards',
    title: 'Loyalty Rewards System',
    tagline: 'Desktop points-and-rewards system for an internet cafe.',
    description:
      'Custom loyalty reward system for an internet cafe using Electron + Node.js, with point tracking, rewards redemption, and customer management.',
    techStack: ['Electron', 'Node.js', 'JavaScript'],
    date: 'January 2024',
    icon: <Monitor className="h-5 w-5" />,
    role: 'Owner / Developer',
    features: [
      { icon: <Gift className="h-3.5 w-3.5" />, label: 'Points & rewards' },
      { icon: <Users className="h-3.5 w-3.5" />, label: 'Customer management' },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export const getProjectBySlug = (slug?: string) =>
  projects.find((p) => p.slug === slug);

export const roleStyles: Record<Role, string> = {
  'Owner / Developer': 'border-success/40 text-success bg-success/5',
  'Lead Developer': 'border-success/40 text-success bg-success/5',
  Contributor: 'border-border text-muted-foreground bg-muted',
};
