import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import HeroShowcase from './HeroShowcase';

interface HeroSectionProps {
  onContact: () => void;
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

// Four live client storefronts — the visitor picks; nothing auto-advances.
const SHOTS = [
  { src: '/work/omni/02-agp.webp', url: 'alphaglobal-prestige.com', alt: 'Alpha Global Prestige storefront' },
  { src: '/work/omni/05-socialpreneur.webp', url: 'socialpreneurinc.com', alt: 'SocialPreneur Inc. storefront' },
  { src: '/work/omni/04-ultraproactive.webp', url: 'ultraproactive.ph', alt: 'Ultra Proactive storefront' },
  { src: '/work/omni/01-successmall.webp', url: 'successmall.shopping', alt: 'Success Mall storefront' },
];

const HeroSection = ({ onContact }: HeroSectionProps) => (
  <section className="px-4 pt-20 md:pt-28">
    <div className="mx-auto max-w-5xl">
      <motion.div {...fade(0)} className="hairline mb-8 w-12" />

      <motion.p {...fade(0.05)} className="text-sm font-semibold text-primary">
        Backend / Fullstack Developer · 8 years
      </motion.p>

      <motion.h1 {...fade(0.1)} className="display mt-4 max-w-[19ch]">
        I build systems where the numbers have to be right.
      </motion.h1>

      <motion.p {...fade(0.18)} className="lede mt-6 max-w-[58ch]">
        Commerce, point of sale, inventory, commissions and learning — modular systems running in
        production for six businesses.
      </motion.p>

      <motion.div {...fade(0.26)} className="mt-9 flex flex-wrap items-center gap-3">
        <a
          href="#systems"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-105"
        >
          View my work
          <ArrowRight className="h-4 w-4" />
        </a>
        <button
          onClick={onContact}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Get in touch
        </button>
        <a
          href="/resume.pdf"
          download="Jose Marie De Castro - Resume.pdf"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          Résumé
        </a>
      </motion.div>

      {/*
        One large screenshot with thumbnails to swap it. An earlier carousel here
        moved while the headline was still being read and was never visually
        settled because it bled off the edge — so nothing auto-advances now.
      */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.34 }}
        className="mt-14"
      >
        <HeroShowcase shots={SHOTS} />
      </motion.div>

    </div>
  </section>
);

export default HeroSection;
