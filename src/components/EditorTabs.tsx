import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileCode, Terminal, Cpu, Globe, Mail, ShoppingCart } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const allTabs: Tab[] = [
  { id: 'home', label: 'Home.tsx', icon: <FileCode className="w-4 h-4" /> },
  { id: 'ai-tools', label: 'AITools.tsx', icon: <Cpu className="w-4 h-4" /> },
  { id: 'automation', label: 'Automation.tsx', icon: <Terminal className="w-4 h-4" /> },
  { id: 'mlm-systems', label: 'MLMSystems.tsx', icon: <Globe className="w-4 h-4" /> },
  { id: 'pos-system', label: 'POSSystem.tsx', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact.tsx', icon: <Mail className="w-4 h-4" /> },
];

interface EditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EditorTabs = ({ activeTab, onTabChange }: EditorTabsProps) => {
  const [openTabs, setOpenTabs] = useState<string[]>(['home', 'ai-tools', 'automation', 'mlm-systems', 'pos-system', 'contact']);

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (openTabs.length > 1) {
      const newTabs = openTabs.filter(t => t !== tabId);
      setOpenTabs(newTabs);
      if (activeTab === tabId) {
        onTabChange(newTabs[0]);
      }
    }
  };

  const handleReopenTab = (tabId: string) => {
    if (!openTabs.includes(tabId)) {
      setOpenTabs([...openTabs, tabId]);
    }
    onTabChange(tabId);
  };

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto">
        {/* Editor header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-terminal-pink" />
              <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
            </div>
            <span className="ml-3 text-sm text-muted-foreground font-mono">jomar-portfolio</span>
          </div>
          
          {/* Closed tabs dropdown */}
          {openTabs.length < allTabs.length && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Closed tabs:</span>
              {allTabs.filter(t => !openTabs.includes(t.id)).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleReopenTab(tab.id)}
                  className="text-xs text-primary hover:underline font-mono"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {allTabs.filter(t => openTabs.includes(t.id)).map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-editor relative group ${activeTab === tab.id ? 'active bg-secondary/50' : ''}`}
              whileHover={{ backgroundColor: 'hsl(var(--secondary) / 0.3)' }}
            >
              <span className={activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {openTabs.length > 1 && (
                <X
                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                />
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorTabs;