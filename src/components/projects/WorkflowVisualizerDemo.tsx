import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, Database, Bell, ArrowRight, Play, Pause } from 'lucide-react';

const nodes = [
  { id: 'discord', label: 'Discord', icon: MessageSquare, x: 50, y: 80, color: 'primary' },
  { id: 'ai', label: 'AI Analysis', icon: Brain, x: 220, y: 80, color: 'accent' },
  { id: 'db', label: 'Database', icon: Database, x: 390, y: 80, color: 'terminal-purple' },
  { id: 'notify', label: 'Notification', icon: Bell, x: 560, y: 80, color: 'terminal-orange' },
];

const connections = [
  { from: 'discord', to: 'ai' },
  { from: 'ai', to: 'db' },
  { from: 'db', to: 'notify' },
];

const WorkflowVisualizerDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeConnection, setActiveConnection] = useState(-1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const nodeInfo: { [key: string]: string } = {
    discord: 'Listens for new messages in #support channel. Filters by keywords and mentions.',
    ai: 'Processes message using GPT-4. Analyzes sentiment and extracts key topics.',
    db: 'Stores analysis results in PostgreSQL. Links to user profiles and history.',
    notify: 'Sends Slack notification to team. Includes priority score and suggested response.',
  };

  useEffect(() => {
    if (!isRunning) return;

    const animate = async () => {
      setLogs([]);
      for (let i = 0; i < connections.length; i++) {
        setActiveConnection(i);
        setLogs(prev => [...prev, `▸ ${nodes[i].label} → ${nodes[i + 1].label}`]);
        await new Promise(r => setTimeout(r, 1000));
      }
      setLogs(prev => [...prev, '✓ Workflow complete!']);
      setActiveConnection(-1);
      setIsRunning(false);
    };

    animate();
  }, [isRunning]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-terminal-yellow/20">
            <Brain className="w-5 h-5 text-terminal-yellow" />
          </div>
          <div>
            <h3 className="font-mono font-semibold">Automation Workflow</h3>
            <p className="text-xs text-muted-foreground">n8n-style workflow automation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">n8n</span>
          <span className="tech-pill text-accent">Discord</span>
          <span className="tech-pill text-terminal-yellow">AI</span>
        </div>
      </div>

      <div className="p-6">
        {/* Workflow Diagram */}
        <div className="relative h-40 mb-4 overflow-x-auto">
          <svg className="absolute inset-0 w-full h-full" style={{ minWidth: '650px' }}>
            {/* Connection lines */}
            {connections.map((conn, i) => {
              const from = nodes.find(n => n.id === conn.from)!;
              const to = nodes.find(n => n.id === conn.to)!;
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={from.x + 40}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={activeConnection === i ? 'hsl(var(--accent))' : 'hsl(var(--border))'}
                    strokeWidth={activeConnection === i ? 3 : 2}
                    strokeDasharray={activeConnection === i ? '8,4' : 'none'}
                    className="transition-all duration-300"
                  />
                  {activeConnection === i && (
                    <motion.circle
                      cx={from.x + 40}
                      cy={from.y}
                      r={6}
                      fill="hsl(var(--accent))"
                      animate={{ cx: to.x, cy: to.y }}
                      transition={{ duration: 0.8 }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          <div className="relative" style={{ minWidth: '650px' }}>
            {nodes.map((node) => {
              const Icon = node.icon;
              const isActive = connections[activeConnection]?.from === node.id || 
                               connections[activeConnection]?.to === node.id;
              return (
                <motion.div
                  key={node.id}
                  className={`absolute flex flex-col items-center cursor-pointer transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{ left: node.x, top: node.y - 30 }}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`p-3 rounded-xl glass ${
                    selectedNode === node.id ? 'ring-2 ring-primary' : ''
                  } ${isActive ? 'glow-accent' : ''}`}>
                    <Icon className={`w-5 h-5 text-${node.color}`} />
                  </div>
                  <span className="text-xs font-mono mt-2 text-muted-foreground">
                    {node.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Node Info */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/50 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm font-semibold">
                {nodes.find(n => n.id === selectedNode)?.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{nodeInfo[selectedNode]}</p>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={isRunning}
            className="flex-1 py-3 bg-terminal-yellow text-black font-mono font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Workflow
              </>
            )}
          </button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-4 bg-background/50 rounded-lg p-3 font-mono text-xs">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={log.startsWith('✓') ? 'text-accent' : 'text-muted-foreground'}
              >
                {log}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center text-xs font-mono text-muted-foreground">
          Click nodes to see details • Automates 1000+ daily tasks
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowVisualizerDemo;