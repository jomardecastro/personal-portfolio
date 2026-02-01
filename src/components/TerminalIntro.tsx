import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const terminalLines = [
  { text: '> initializing portfolio...', delay: 0 },
  { text: '> loading projects...', delay: 800 },
  { text: '> Jose Marie De Castro - Full-Stack Developer', delay: 1600 },
  { text: '> Specializing in AI integrations and automation', delay: 2400 },
  { text: '> ready_', delay: 3200 },
];

interface TerminalIntroProps {
  onComplete: () => void;
}

const TerminalIntro = ({ onComplete }: TerminalIntroProps) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentTyping, setCurrentTyping] = useState<number | null>(0);
  const [typedText, setTypedText] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
        setCurrentTyping(index);
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex <= line.text.length) {
            setTypedText(prev => ({ ...prev, [index]: line.text.slice(0, charIndex) }));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            if (index === terminalLines.length - 1) {
              setTimeout(onComplete, 500);
            }
          }
        }, 30);
      }, line.delay);
    });
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="glass rounded-xl p-8 w-full max-w-2xl mx-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-terminal-pink" />
          <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
          <span className="ml-4 text-sm text-muted-foreground font-mono">terminal</span>
        </div>
        
        <div className="font-mono text-sm md:text-base space-y-2">
          {terminalLines.map((line, index) => (
            <div
              key={index}
              className={`transition-opacity duration-300 ${
                visibleLines.includes(index) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className={
                index === 2 ? 'text-primary' :
                index === 3 ? 'text-accent' :
                index === 4 ? 'text-terminal-purple' :
                'text-muted-foreground'
              }>
                {typedText[index] || ''}
              </span>
              {currentTyping === index && visibleLines.includes(index) && (
                <span className="terminal-cursor" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TerminalIntro;