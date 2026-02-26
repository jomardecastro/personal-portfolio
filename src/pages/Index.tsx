import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import TerminalIntro from '../components/TerminalIntro';
import MatrixBackground from '../components/MatrixBackground';
import EditorTabs from '../components/EditorTabs';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import TechStackSection from '../components/TechStackSection';
import ContactSection from '../components/ContactSection';
import AIToolsSection from '../components/sections/AIToolsSection';
import AutomationSection from '../components/sections/AutomationSection';
import MLMSystemsSection from '../components/sections/MLMSystemsSection';
import POSSystemSection from '../components/sections/POSSystemSection';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Check if intro was shown before (session only)
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  const handleContact = () => {
    setActiveTab('contact');
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection onContact={handleContact} />
            <StatsSection />
            <TechStackSection />
          </>
        );
      case 'ai-tools':
        return <AIToolsSection />;
      case 'automation':
        return <AutomationSection />;
      case 'mlm-systems':
        return <MLMSystemsSection />;
      case 'pos-system':
        return <POSSystemSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HeroSection onContact={handleContact} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatePresence>
        {showIntro && <TerminalIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <MatrixBackground />
          <div className="relative z-10">
            <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <main id={activeTab}>
              {renderContent()}
            </main>
            
            {/* Footer */}
            <footer className="py-8 px-4 border-t border-border">
              <div className="container mx-auto text-center">
                <p className="text-sm text-muted-foreground font-mono">
                  <span className="text-primary">{'</'}</span>
                  Jose Marie De Castro
                  <span className="text-primary">{'>'}</span>
                  {' '}· Built with passion & lots of ☕
                </p>
                <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
                  © {new Date().getFullYear()} · All rights reserved
                </p>
              </div>
            </footer>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;