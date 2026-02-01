import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, Copy, Check, Globe } from 'lucide-react';

const sampleEndpoints = [
  { method: 'GET', path: '/api/v1/leads', description: 'Fetch all leads' },
  { method: 'POST', path: '/api/v1/leads', description: 'Create new lead' },
  { method: 'GET', path: '/api/v1/analytics', description: 'Get analytics' },
];

const sampleResponse = {
  success: true,
  data: {
    leads: [
      { id: 1, name: 'John Doe', score: 85, status: 'hot' },
      { id: 2, name: 'Jane Smith', score: 72, status: 'warm' },
      { id: 3, name: 'Bob Wilson', score: 45, status: 'cold' },
    ],
    total: 3,
    page: 1,
  },
  meta: {
    processingTime: '23ms',
    rateLimit: { remaining: 999, limit: 1000 },
  },
};

const APIPlayground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(sampleEndpoints[0]);
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setResponse('');
    
    await new Promise(r => setTimeout(r, 800));
    setResponse(JSON.stringify(sampleResponse, null, 2));
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="p-2 rounded-lg bg-terminal-purple/20">
            <Globe className="w-5 h-5 text-terminal-purple" />
          </div>
          <div>
            <h3 className="font-mono font-semibold">White-Label API</h3>
            <p className="text-xs text-muted-foreground">RESTful API serving multiple clients</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">Node.js</span>
          <span className="tech-pill text-accent">Express</span>
          <span className="tech-pill text-terminal-purple">REST</span>
        </div>
      </div>

      <div className="p-6">
        {/* Endpoint Selector */}
        <div className="space-y-3 mb-6">
          {sampleEndpoints.map((endpoint) => (
            <button
              key={endpoint.path}
              onClick={() => setSelectedEndpoint(endpoint)}
              className={`w-full p-3 rounded-lg font-mono text-sm text-left flex items-center gap-3 transition-all ${
                selectedEndpoint.path === endpoint.path
                  ? 'bg-terminal-purple/20 border border-terminal-purple/50'
                  : 'bg-secondary/30 border border-transparent hover:border-border'
              }`}
            >
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                endpoint.method === 'GET' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
              }`}>
                {endpoint.method}
              </span>
              <span className="text-foreground">{endpoint.path}</span>
              <span className="text-muted-foreground ml-auto text-xs">{endpoint.description}</span>
            </button>
          ))}
        </div>

        {/* Request Preview */}
        <div className="bg-background/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted-foreground">Request</span>
            <Code2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <pre className="font-mono text-sm">
            <span className="text-terminal-purple">curl</span>{' '}
            <span className="text-terminal-orange">-X {selectedEndpoint.method}</span>{' '}
            <span className="text-accent">"https://api.example.com{selectedEndpoint.path}"</span>
            <br />
            <span className="text-muted-foreground">  -H "Authorization: Bearer {'<API_KEY>'}"</span>
          </pre>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="w-full py-3 bg-terminal-purple text-white font-mono font-medium rounded-lg flex items-center justify-center gap-2 hover:glow-purple transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-pulse">Processing request...</span>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Try API
            </>
          )}
        </button>

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 relative"
          >
            <div className="bg-background/50 rounded-lg p-4 overflow-auto max-h-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-accent">Response · 200 OK</span>
                <button onClick={handleCopy} className="p-1 hover:bg-secondary rounded">
                  {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">{response}</pre>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
          <span>📊 1M+ requests/month</span>
          <span>⚡ 23ms avg response</span>
          <span>🔒 99.9% uptime</span>
        </div>
      </div>
    </motion.div>
  );
};

export default APIPlayground;