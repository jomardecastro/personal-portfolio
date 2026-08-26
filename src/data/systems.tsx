import { CreditCard, GraduationCap, Network, Package, Store } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ProjectImage, LiveLink } from './projects';

/**
 * The five capability modules of the Omni platform, presented as independently
 * sellable systems. Every claim here is traceable to the codebase — see the
 * module inventory in the plan file. Deliberately excludes the accounting work.
 */
export interface System {
  slug: string;
  name: string;
  /** Secondary label, e.g. surfacing "MLM" under the broader engine name. */
  subtitle?: string;
  tagline: string;
  description: string;
  icon: ReactNode;
  /** Production = live on client boxes. Staging = built, not yet on a client box. */
  status: 'production' | 'staging';
  statusNote: string;
  /** Public deployments a visitor can actually open. */
  runsAt?: LiveLink[];
  /** How the module is switched on or off — stated precisely, no invented flags. */
  gating: string;
  features: string[];
  highlights: string[];
  techStack: string[];
  heroImage: ProjectImage;
  gallery?: ProjectImage[];
}

const STOREFRONTS: ProjectImage[] = [
  {
    src: '/work/omni/02-agp.webp',
    alt: 'Alpha Global Prestige storefront',
    caption: 'Alpha Global Prestige — a bespoke branded landing on the shared platform.',
    width: 1600,
    height: 1000,
  },
  {
    src: '/work/omni/04-ultraproactive.webp',
    alt: 'Ultra Proactive storefront',
    caption: 'Ultra Proactive — one deployment serving two branded domains with independent sessions.',
    width: 1600,
    height: 1000,
  },
  {
    src: '/work/omni/05-socialpreneur.webp',
    alt: 'SocialPreneur Inc. storefront',
    caption: 'SocialPreneur Inc. — a dark, brand-led product landing on the same components.',
    width: 1600,
    height: 1000,
  },
  {
    src: '/work/omni/01-successmall.webp',
    alt: 'Success Mall marketplace storefront',
    caption: 'Success Mall — the learning-storefront configuration, selling courses as products.',
    width: 1600,
    height: 1000,
  },
  {
    src: '/work/omni/03-teslab.webp',
    alt: 'TESLABARC marketplace storefront',
    caption: 'TESLABARC — same components, different tenant theme and catalog.',
    width: 1600,
    height: 1000,
  },
];

export const systems: System[] = [
  {
    slug: 'e-commerce',
    name: 'E-Commerce',
    tagline: 'A white-label storefront with tiered pricing, zone-based shipping rates, and a third-party marketplace.',
    description:
      'Public catalog, cart and checkout, several settlement paths, per-courier shipping rates from an admin-published zone table, and a merchant marketplace where approved third-party sellers run their own shop with their own wallet and payout rail. It runs across six client deployments, five of them with public storefronts you can open below.',
    icon: <Store className="h-5 w-5" />,
    status: 'production',
    statusNote: 'Live across four client brands',
    runsAt: [
      { label: 'Success Mall', url: 'https://successmall.shopping' },
      { label: 'Alpha Global Prestige', url: 'https://alphaglobal-prestige.com' },
      { label: 'TESLABARC', url: 'https://teslabtech.com' },
      { label: 'Ultra Proactive', url: 'https://ultraproactive.ph' },
      { label: 'SocialPreneur Inc.', url: 'https://socialpreneurinc.com' },
    ],
    gating:
      'Runs standalone. A tenant can serve an information-only public site with the whole shop unmounted, or a full marketplace, from the same build.',
    features: [
      'Five-dimension pricing on the house catalog — the effective price is the lowest of base, membership tier, rank, stockist and non-activated prices, and points are never discounted',
      'Shipping rates computed from an admin-published zone table, picking the cheapest package the cart’s bounding parcel actually fits',
      'A declarative order state machine — every transition names who may take it and on which channel, and the ones needing evidence name it: a payment proof, a tracking number',
      'Four settlement paths behind one admin-defined payment-method registry: wallet debit, reviewed proof-of-payment upload, hosted gateway, and cash on delivery',
      'Merchant marketplace with self-serve registration, admin approval, per-product review and merchant-owned stock',
      'Typo-tolerant catalog search combining full-text ranking with trigram similarity',
      'Multi-currency checkout — an order can be denominated in cash or either wallet currency',
      'Replicated referral pages and campaign links with server-rendered previews for social crawlers',
    ],
    highlights: [
      'Marketplace fees are snapshotted onto the order line at checkout, so changing a rate can never rewrite a past sale.',
      'Shipping configuration is versioned and immutable — publishing new rates adds a version rather than editing history.',
      'Gateway webhooks are deduplicated by a partial unique index scoped to verified callbacks, so a spoofed unverified webhook cannot occupy the slot and block the real payment.',
    ],
    techStack: ['TypeScript', 'Fastify', 'PostgreSQL', 'Drizzle', 'Redis', 'React', 'Tailwind'],
    heroImage: STOREFRONTS[0],
    gallery: STOREFRONTS,
  },
  {
    slug: 'point-of-sale',
    name: 'Point of Sale',
    tagline: 'A branch-scoped till that rings up against live stock and reconciles at end of shift.',
    description:
      'Cashiers sell in person against the same catalog and inventory as the online store. One tender per sale from an admin-defined set, manager-approved discounts, a releasing area for branches that hand over stock separately, refunds that post compensating ledger entries rather than deleting history, and a shift close that computes expected cash server-side.',
    icon: <CreditCard className="h-5 w-5" />,
    status: 'production',
    statusNote: 'Live on client deployments',
    gating:
      'Needs no separate installation — it is gated by role permissions and per-user branch assignment. A sale needs only a customer record, not a commission slot, so a plain retail purchase rings up without touching the commission side at all.',
    features: [
      'Idempotency-key checkout — when the caller supplies a key, a retried request returns the original order instead of charging twice',
      'Human-readable order numbers issued per branch, so two stores can both hold SO-00001 without collision',
      'Manager-PIN override for discounts beyond a branch’s configured cap',
      'Branch scoping — a cashier pinned to a branch can only ring up there, and the branch id in the request is never trusted to widen it',
      'Two completion modes per branch: complete at checkout, or park in a releasing area for later handover',
      'Void and refund that restock, reverse every ledger entry, and refuse when an issued code has already been used',
      'End-of-shift close with server-computed expected cash and a signed variance',
      'Admin-managed tender registry and custom fees, filtered by role',
    ],
    highlights: [
      'The manual completion path reuses the same event identifier as checkout, so deferring a sale can never cause a second payout.',
      'Order numbers are allocated with an atomic update-and-return on the branch row, so concurrent lanes serialize without a global sequence.',
      'Retry safety rests on a unique index over the supplied idempotency key, not on careful client code.',
    ],
    techStack: ['TypeScript', 'Fastify', 'PostgreSQL', 'React', 'Advisory locks'],
    heroImage: {
      src: '/systems/pos-real.webp',
      alt: 'The cashier till: product grid with live stock, member lookup, cart and payment methods',
      width: 1600,
      height: 1070,
    },
    gallery: [
      {
        src: '/systems/pos-real.webp',
        alt: 'Cashier till with product grid, member lookup, cart and payment panel',
        caption: 'The till — live stock per product, member lookup, and the tender registry.',
        width: 1600,
        height: 1070,
      },
      {
        src: '/systems/pos.webp',
        alt: 'Point of sale architecture: sale path, completion modes, refunds and shift close',
        caption: 'How a sale flows, and where the two completion modes diverge.',
        width: 1600,
        height: 670,
        fit: 'contain',
      },
    ],
  },
  {
    slug: 'inventory',
    name: 'Inventory',
    tagline: 'Multi-branch stock where the counter and the audit trail can never disagree.',
    description:
      'Stock lives per branch, and every change — a sale, a refund, a delivery, a write-off — flows through one function that updates the count and appends a movement record in the same transaction. Purchase orders, suppliers, per-branch catalogs and per-branch pricing sit on top.',
    icon: <Package className="h-5 w-5" />,
    status: 'production',
    statusNote: 'Live on client deployments',
    gating:
      'Reads no compensation-plan or membership-tier configuration. Access is controlled by role permissions and per-user branch assignment — the same two dimensions as the till. Its one tie to the commission side is the optional stockist branch, which is tagged to a member’s slot.',
    features: [
      'One canonical mutation path — the count and the movement log are written together or not at all',
      'Guarded decrements make negative stock impossible at the database statement, not merely validated in application code',
      'A full stock card: every movement records the balance before and after and a reason, and sale, refund, batch and purchase-order movements link back to the source document',
      'Document-shaped receive and write-off batches that roll back entirely if any line is short',
      'Variant-level stock alongside product-level stock',
      'Per-branch sellable subsets, so a branch can carry part of the catalog',
      'Per-branch pricing for stockists and outlets',
      'Purchase orders and suppliers with partial fulfillment',
    ],
    highlights: [
      'Stock decrements are a single guarded UPDATE — the sufficiency check lives in the statement’s WHERE clause, so there is no read-modify-write round trip for the application to get wrong; Postgres serializes concurrent writers on the row and re-checks the guard.',
      'There is exactly one writer function, which makes the audit trail an invariant rather than a convention.',
      'Mutating admin actions are recorded in an append-only audit log with before and after state.',
    ],
    techStack: ['TypeScript', 'Fastify', 'PostgreSQL', 'Drizzle', 'React'],
    heroImage: {
      src: '/systems/inventory-real.webp',
      alt: 'Branch inventory: SKUs and variants with on-hand quantities and per-item movement logs',
      width: 1600,
      height: 1070,
    },
    gallery: [
      {
        src: '/systems/inventory-real.webp',
        alt: 'Branch inventory table with SKUs, variants, prices and on-hand counts',
        caption: 'Branch inventory — per-variant stock, with a movement log behind every row.',
        width: 1600,
        height: 1070,
      },
      {
        src: '/systems/inventory.webp',
        alt: 'Inventory architecture: single mutation path, movement records, batches and purchase orders',
        caption: 'Every change routes through one function that writes the count and the log together.',
        width: 1600,
        height: 650,
        fit: 'contain',
      },
    ],
  },
  {
    slug: 'commission-engine',
    name: 'Commission & Referral Engine',
    subtitle: 'Including MLM compensation plans',
    tagline: 'Nineteen pluggable payout plans over a ledger nothing ever updates or deletes.',
    description:
      'A general engine for paying people out of transactions: referral trees, tiered and multi-level commissions, milestone bonuses, caps and payouts. Plans compute and return proposed entries; the framework owns locking, idempotency, caps and the ledger write. That framework half is plan-agnostic with no per-plan branching, so the same machinery drives plain referral commissions as readily as a full multi-level plan.',
    icon: <Network className="h-5 w-5" />,
    status: 'production',
    statusNote: 'Live on client deployments',
    gating:
      'Each plan can be switched off independently, and switching all of them off is a supported configuration — the platform then runs as plain commerce with no commissions at all.',
    features: [
      'Nineteen compensation plans behind one interface, three interchangeable variants of the binary plan, configurable per tenant and — for most plans — per membership tier',
      'Plans compute and return proposed entries; the framework takes the locks and writes the ledger. The few plans carrying running state do so through one narrow, documented hook inside the same transaction',
      'An append-only money ledger — no code path updates or deletes a ledger row; corrections are posted as new compensating entries',
      'Per-slot wallets in four currencies, derived from ledger history rather than edited in place',
      'Referral and placement trees stored as tree paths, so an entire downline is one query',
      'Framework-owned daily and lifetime earning caps, including caps shared across a group of plans',
      'Code-and-PIN activation, with transferable and expiring codes',
      'Payout batches with write-once bank references and a bank-ready export',
      'Ad-hoc distribution runs over a chosen date window, with preview before commit',
    ],
    highlights: [
      'Idempotency is enforced by a unique index rather than by application discipline, so a replayed job inserts nothing.',
      'Every recipient is locked in ascending identifier order, which makes deadlocks impossible by construction.',
      'Plan output is continuously diffed against an independent reference implementation on fixture trees.',
      'Payout deductions are snapshotted onto the request, so changing policy never rewrites an issued payout.',
    ],
    techStack: ['TypeScript', 'Fastify', 'PostgreSQL', 'BullMQ', 'Redis', 'decimal.js'],
    heroImage: {
      src: '/systems/commission-real.webp',
      alt: 'Genealogy view: the binary network with per-leg volumes, sponsor lineage and an open seat',
      width: 1600,
      height: 727,
    },
    gallery: [
      {
        src: '/systems/commission-real.webp',
        alt: 'Binary genealogy tree with per-leg volumes and sponsor lineage',
        caption:
          'The genealogy view — binary and sponsor trees, per-leg volumes, and where the next placement lands.',
        width: 1600,
        height: 727,
      },
      {
        src: '/systems/commission.webp',
        alt: 'Commission engine architecture: event pipeline through plans, framework, ledger and wallets',
        caption: 'What happens behind it: one event, many plans, one append-only ledger.',
        width: 1600,
        height: 668,
        fit: 'contain',
      },
    ],
  },
  {
    slug: 'learning',
    name: 'Learning Management',
    subtitle: 'Courses, creators and certificates',
    tagline: 'Courses that sell like products, then unlock a player, graded tests and a verifiable certificate.',
    description:
      'A learning platform built on the same commerce rails: a course is a product, so it sells through the existing cart, payment methods and order pipeline rather than a parallel payment stack. Creators get their own studio to build curriculum, upload video, set tests and get paid; learners get a chaptered player with quizzes, Q&A and a certificate that can be verified publicly.',
    icon: <GraduationCap className="h-5 w-5" />,
    status: 'staging',
    statusNote: 'Built and running on staging — not yet deployed to a client',
    gating:
      'A single master switch. With learning off, the course, creator and admin-creator routes return not-found and every learning surface unmounts — the module goes invisible rather than merely forbidden, including to the tenant’s own administrators.',
    features: [
      'Courses are products, so they sell through the existing cart and checkout with no parallel payment path',
      'Chaptered curriculum with preview lessons and per-lesson progress',
      'Graded tests — auto-marked multiple choice plus creator-graded written answers, with attempt limits',
      'Certificates gated on both full lesson completion and passing every active test',
      'Public certificate verification by code',
      'Per-lesson questions and answers with creator moderation',
      'A dedicated Creator Studio with its own wallet, payouts and course analytics',
      'A learning-mode member dashboard that replaces the commerce dashboard and hides unrelated navigation',
    ],
    highlights: [
      'Video never passes through the API — uploads go straight to object storage with a signed URL, then a 64-byte ranged read verifies the file really is video before the lesson goes live.',
      'The certificate record is the credential; verification never trusts the rendered image.',
      'The creator platform fee is snapshotted at checkout, so historical payouts stay reproducible after a rate change.',
    ],
    techStack: ['TypeScript', 'Fastify', 'PostgreSQL', 'React', 'S3-compatible storage'],
    heroImage: {
      src: '/systems/learning-real.webp',
      alt: 'The learning storefront: featured courses with free, paid and subscriber access tiers',
      width: 1600,
      height: 1013,
    },
    gallery: [
      {
        src: '/systems/learning-real.webp',
        alt: 'Learning storefront with featured courses and access-tier filters',
        caption:
          'The learning storefront — courses filtered by level and by access tier: free, paid, or subscriber.',
        width: 1600,
        height: 1013,
      },
      {
        src: '/systems/lms.webp',
        alt: 'Learning platform architecture: creator studio through checkout, player, tests and certificates',
        caption: 'Creator studio through checkout, player and certificate — all on the commerce rails.',
        width: 1600,
        height: 686,
        fit: 'contain',
      },
    ],
  },
];

export const getSystemBySlug = (slug?: string) => systems.find((s) => s.slug === slug);
