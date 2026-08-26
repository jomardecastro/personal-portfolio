interface BrowserFrameProps {
  src: string;
  alt: string;
  /** Shown in the fake address bar — use the real domain so it reads as a live product. */
  url?: string;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
}

/** Wraps a screenshot in browser chrome so it reads as a running product, not a picture. */
const BrowserFrame = ({
  src,
  alt,
  url,
  width,
  height,
  className = '',
  imgClassName = '',
  loading = 'lazy',
}: BrowserFrameProps) => (
  <figure className={`browser ${className}`}>
    <div className="browser-bar">
      <span className="browser-dot" aria-hidden />
      <span className="browser-dot" aria-hidden />
      <span className="browser-dot" aria-hidden />
      {url && <span className="browser-url">{url}</span>}
    </div>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`block w-full ${imgClassName}`}
    />
  </figure>
);

export default BrowserFrame;
