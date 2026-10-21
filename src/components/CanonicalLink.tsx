import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL, indexablePaths } from '@/lib/seo';

/**
 * Tells search engines the apex URL of the page being shown. Unknown paths get no
 * canonical at all, so the 404 page never claims to be the original of anything.
 */
const CanonicalLink = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!indexablePaths.includes(path)) {
      link?.remove();
      return;
    }
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `${SITE_URL}${path}`;
  }, [pathname]);

  return null;
};

export default CanonicalLink;
