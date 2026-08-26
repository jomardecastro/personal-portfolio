import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import TechStackSection from '../components/TechStackSection';
import ContactSection from '../components/ContactSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import FeaturedWorkSection from '../components/sections/FeaturedWorkSection';
import SystemsSection from '../components/sections/SystemsSection';

const Index = () => {
  const { hash } = useLocation();

  // Support /#work style deep links arriving from a case-study page.
  //
  // A single scroll on mount silently fails: at that point the images have not
  // loaded, so the document is far shorter than its final height and there is
  // nowhere to scroll to. Re-run as layout settles, and stop early once the
  // target is actually in place.
  useEffect(() => {
    if (!hash) return;
    let done = false;
    const timers: number[] = [];

    const jump = () => {
      const el = document.querySelector(hash);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      // Within a few px of the scroll-margin offset means we already landed.
      if (done && Math.abs(top - 80) < 8) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      done = true;
    };

    for (const delay of [0, 120, 400, 900]) {
      timers.push(window.setTimeout(jump, delay));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [hash]);

  const handleContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <HeroSection onContact={handleContact} />
        <SystemsSection />
        <FeaturedWorkSection />
        <StatsSection />
        <ExperienceSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
