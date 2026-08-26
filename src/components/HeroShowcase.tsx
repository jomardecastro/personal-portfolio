import { useState } from 'react';
import BrowserFrame from './BrowserFrame';

export interface Shot {
  src: string;
  url: string;
  alt: string;
}

/**
 * Static, contained proof strip: one large screenshot plus thumbnails to swap it.
 * Deliberately NOT a carousel — nothing moves unless the visitor asks it to, and
 * the frame stays inside the content column so the composition always looks settled.
 */
const HeroShowcase = ({ shots }: { shots: Shot[] }) => {
  const [active, setActive] = useState(0);
  const shot = shots[active];

  return (
    <div>
      <BrowserFrame
        src={shot.src}
        url={shot.url}
        alt={shot.alt}
        width={1600}
        height={1000}
        loading="eager"
      />

      <div className="mt-4 grid grid-cols-4 gap-3">
        {shots.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${s.url}`}
            aria-current={active === i}
            className={`group overflow-hidden rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              active === i
                ? 'border-primary/60 shadow-card'
                : 'border-border opacity-60 hover:opacity-100'
            }`}
          >
            <span className="block aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={s.src}
                alt=""
                aria-hidden
                width={1600}
                height={1000}
                loading="eager"
                className="h-full w-full object-cover object-top"
              />
            </span>
            <span className="block truncate border-t border-border bg-card px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
              {s.url}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroShowcase;
