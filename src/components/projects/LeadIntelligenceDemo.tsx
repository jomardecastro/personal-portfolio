import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MapPin, Phone, Loader2, TrendingUp, Home, DollarSign } from 'lucide-react';

const sampleAnalysis = {
  propertyValue: '$485,000',
  confidence: 92,
  marketTrend: 'Increasing',
  avgDaysOnMarket: 23,
  insights: [
    'Property is in a high-demand neighborhood',
    'Recent comparable sales average $475K-$510K',
    'School district rating: 8/10',
    'Low crime rate area',
  ],
  recommendedActions: [
    'Schedule property visit within 48 hours',
    'Prepare competitive offer strategy',
    'Research recent renovations',
  ],
};

const LeadIntelligenceDemo = () => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof sampleAnalysis | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!address.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);

    // Simulate analysis steps
    const steps = [20, 40, 60, 80, 100];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 400));
      setProgress(step);
    }

    await new Promise(r => setTimeout(r, 300));
    setResult(sampleAnalysis);
    setIsAnalyzing(false);
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
          <div className="p-2 rounded-lg bg-accent/20">
            <Brain className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-mono font-semibold">Lead Intelligence System</h3>
            <p className="text-xs text-muted-foreground">AI-powered property analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">WordPress</span>
          <span className="tech-pill text-accent">Grok AI</span>
          <span className="tech-pill text-terminal-orange">Zapier</span>
        </div>
      </div>

      <div className="p-6">
        {/* Input Form */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Property Address
            </span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Lead Phone (Optional)
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </label>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !address.trim()}
          className="w-full py-3 bg-accent text-accent-foreground font-mono font-medium rounded-lg flex items-center justify-center gap-2 hover:glow-accent transition-all disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Analyze Lead
            </>
          )}
        </button>

        {/* Progress */}
        {isAnalyzing && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
              <span>Processing lead data...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <DollarSign className="w-5 h-5 mx-auto text-accent mb-2" />
                <div className="text-xl font-mono font-bold text-accent">{result.propertyValue}</div>
                <div className="text-xs text-muted-foreground">Est. Value</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto text-primary mb-2" />
                <div className="text-xl font-mono font-bold text-primary">{result.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <Home className="w-5 h-5 mx-auto text-terminal-purple mb-2" />
                <div className="text-xl font-mono font-bold text-terminal-purple">{result.avgDaysOnMarket}</div>
                <div className="text-xs text-muted-foreground">Avg Days</div>
              </div>
            </div>

            {/* Insights */}
            <div className="glass rounded-lg p-4">
              <h4 className="font-mono text-sm font-semibold mb-3 text-accent">AI Insights</h4>
              <ul className="space-y-2">
                {result.insights.map((insight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-accent mt-1">▸</span>
                    {insight}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LeadIntelligenceDemo;