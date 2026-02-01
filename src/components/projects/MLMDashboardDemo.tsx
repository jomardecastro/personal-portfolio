import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  level: number;
  commission: number;
  children?: TreeNode[];
  expanded?: boolean;
}

const sampleTree: TreeNode = {
  id: '1',
  name: 'You (Admin)',
  level: 0,
  commission: 15000,
  expanded: true,
  children: [
    {
      id: '2',
      name: 'Alice Chen',
      level: 1,
      commission: 5200,
      expanded: true,
      children: [
        { id: '4', name: 'David Kim', level: 2, commission: 1800 },
        { id: '5', name: 'Emma Wilson', level: 2, commission: 2100 },
      ],
    },
    {
      id: '3',
      name: 'Bob Martinez',
      level: 2,
      commission: 4300,
      children: [
        { id: '6', name: 'Frank Lee', level: 2, commission: 950 },
      ],
    },
  ],
};

const TreeNodeComponent = ({ node, onToggle }: { node: TreeNode; onToggle: (id: string) => void }) => {
  const hasChildren = node.children && node.children.length > 0;
  const levelColors = ['text-primary', 'text-accent', 'text-terminal-purple', 'text-terminal-orange'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <div
        className={`flex items-center gap-3 p-3 rounded-lg glass-hover cursor-pointer mb-2 ${
          node.level === 0 ? 'border border-primary/30' : ''
        }`}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        {hasChildren && (
          <span className="text-muted-foreground">
            {node.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {!hasChildren && <span className="w-4" />}
        
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Users className={`w-4 h-4 ${levelColors[node.level % levelColors.length]}`} />
        </div>
        
        <div className="flex-1">
          <div className="font-mono text-sm">{node.name}</div>
          <div className="text-xs text-muted-foreground">Level {node.level + 1}</div>
        </div>
        
        <div className={`font-mono font-bold ${levelColors[node.level % levelColors.length]}`}>
          ${node.commission.toLocaleString()}
        </div>
      </div>
      
      {hasChildren && node.expanded && (
        <div className="ml-8 pl-4 border-l border-border/50">
          {node.children?.map(child => (
            <TreeNodeComponent key={child.id} node={child} onToggle={onToggle} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const MLMDashboardDemo = () => {
  const [tree, setTree] = useState(sampleTree);
  const [stats, setStats] = useState({ users: 0, revenue: 0, growth: 0 });

  useEffect(() => {
    // Animate counters
    const timer = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + 127, 10847),
        revenue: Math.min(prev.revenue + 1523, 156420),
        growth: Math.min(prev.growth + 1, 23),
      }));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const toggleNode = (id: string) => {
    const toggle = (node: TreeNode): TreeNode => ({
      ...node,
      expanded: node.id === id ? !node.expanded : node.expanded,
      children: node.children?.map(toggle),
    });
    setTree(toggle(tree));
  };

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
          <div className="p-2 rounded-lg bg-terminal-orange/20">
            <Users className="w-5 h-5 text-terminal-orange" />
          </div>
          <div>
            <h3 className="font-mono font-semibold">MLM System Dashboard</h3>
            <p className="text-xs text-muted-foreground">Multi-level commission tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">PHP</span>
          <span className="tech-pill text-accent">MySQL</span>
          <span className="tech-pill text-terminal-orange">Algorithms</span>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-lg p-4 text-center">
            <Users className="w-5 h-5 mx-auto text-primary mb-2" />
            <div className="text-2xl font-mono font-bold text-primary">
              {stats.users.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <DollarSign className="w-5 h-5 mx-auto text-accent mb-2" />
            <div className="text-2xl font-mono font-bold text-accent">
              ${stats.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-terminal-orange mb-2" />
            <div className="text-2xl font-mono font-bold text-terminal-orange">
              +{stats.growth}%
            </div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
        </div>

        {/* Tree */}
        <div className="bg-background/30 rounded-lg p-4 max-h-64 overflow-auto">
          <div className="text-xs font-mono text-muted-foreground mb-3">Network Hierarchy</div>
          <TreeNodeComponent node={tree} onToggle={toggleNode} />
        </div>

        <div className="mt-4 text-center text-xs font-mono text-muted-foreground">
          ✓ Real-time commission calculations • Binary & Matrix plans supported
        </div>
      </div>
    </motion.div>
  );
};

export default MLMDashboardDemo;