import { featuredProjects } from '@/data/projects';
import { systems } from '@/data/systems';

/** The one host search engines should index. www.jdecastro.dev 301s here (Caddy on the box). */
export const SITE_URL = 'https://jdecastro.dev';

/** Every route that renders a real page. public/sitemap.xml must list these (a test checks it). */
export const indexablePaths = [
  '/',
  ...featuredProjects.map((p) => `/work/${p.slug}`),
  ...systems.map((s) => `/systems/${s.slug}`),
];
