/**
 * The Omnilink mark — two interlocked arcs.
 *
 * Its two colours are the same #87D15F / #00B8EC that drive the site's
 * signature hairline (--brand-a / --brand-b), so it needs no recolouring
 * and stays correct in both themes.
 */
const BrandMark = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    role="img"
    aria-label="Omnilink"
    focusable="false"
  >
    <g fill="none" strokeWidth={6} strokeLinecap="round">
      <path d="M8.151 26.485A13 13 0 1 1 26.485 27.849" stroke="hsl(var(--brand-a))" />
      <path
        d="M8.151 26.485A13 13 0 1 1 26.485 27.849"
        stroke="hsl(var(--brand-b))"
        transform="rotate(180 24 24)"
      />
    </g>
  </svg>
);

export default BrandMark;
