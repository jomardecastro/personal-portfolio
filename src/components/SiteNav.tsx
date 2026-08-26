import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import BrandMark from './BrandMark';

const LINKS = [
  { href: '/#systems', label: 'Systems' },
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#contact', label: 'Contact' },
];

const SiteNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onLanding = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md transition-colors ${
        scrolled ? 'border-border' : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-foreground">
          <BrandMark className="h-6 w-6 flex-shrink-0" />
          <span>Jose Marie De Castro</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <div className="hidden items-center gap-4 sm:flex">
            {LINKS.map((link) =>
              onLanding ? (
                <a
                  key={link.href}
                  href={link.href.replace('/', '')}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default SiteNav;
