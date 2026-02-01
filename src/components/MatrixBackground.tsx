import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  'const ai = await openai.chat()',
  'function automate() {}',
  'export default App',
  'npm run build',
  'git commit -m "feat"',
  '<Component />',
  'async/await',
  'useState()',
  'useEffect(() => {})',
  'fetch("/api")',
  'const data = {}',
  'return response',
  '.then(res => res)',
  'import { x }',
  'module.exports',
  'router.get("/")',
  'db.query(sql)',
  'jwt.verify()',
  'bcrypt.hash()',
  'socket.emit()',
];

interface FloatingCode {
  id: number;
  text: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

const MatrixBackground = () => {
  const [floatingCode, setFloatingCode] = useState<FloatingCode[]>([]);

  useEffect(() => {
    const generateCode = () => {
      const newCode: FloatingCode[] = [];
      for (let i = 0; i < 15; i++) {
        newCode.push({
          id: i,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * 10,
          opacity: 0.03 + Math.random() * 0.05,
        });
      }
      setFloatingCode(newCode);
    };

    generateCode();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating code snippets */}
      {floatingCode.map((code) => (
        <motion.div
          key={code.id}
          className="absolute font-mono text-xs whitespace-nowrap text-primary"
          style={{
            left: `${code.x}%`,
            top: `${code.y}%`,
            opacity: code.opacity,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            opacity: [code.opacity, code.opacity * 1.5, code.opacity],
          }}
          transition={{
            duration: code.duration,
            delay: code.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {code.text}
        </motion.div>
      ))}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-50" />
      
      {/* Glow orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 70%)',
          right: '10%',
          bottom: '20%',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default MatrixBackground;