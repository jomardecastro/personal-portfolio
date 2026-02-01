import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ExternalLink, Copy, Check } from 'lucide-react';

const sampleOutputs: { [key: string]: string } = {
  'artificial intelligence': `# The Future of AI in Business

Artificial intelligence is revolutionizing how businesses operate. From automated customer service to predictive analytics, AI tools are becoming essential for competitive advantage.

## Key Benefits
- 24/7 automated operations
- Data-driven decision making
- Personalized customer experiences

*This content was generated in 2.3 seconds using GPT-4*`,
  
  'web development': `# Modern Web Development Trends

The web development landscape continues to evolve rapidly. From React Server Components to Edge Computing, developers have more tools than ever.

## What's Hot in 2024
- AI-assisted coding
- Serverless architectures
- Real-time collaboration

*Generated with intelligent context awareness*`,
  
  'default': `# Your Custom Blog Post

Based on your topic, here's a draft article that covers the key points your audience cares about.

## Introduction
An engaging opening that hooks readers...

## Main Points
- Key insight #1
- Key insight #2
- Actionable takeaway

*AI-powered content, human-quality results*`
};

const AIBlogWriterDemo = () => {
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeLines, setCodeLines] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setOutput('');
    setCodeLines([]);

    // Simulate API call with code visualization
    const codeSequence = [
      'const prompt = buildPrompt(topic);',
      'const response = await openai.chat({',
      '  model: "gpt-4",',
      '  messages: [{ role: "user", content: prompt }]',
      '});',
      'return response.choices[0].message;'
    ];

    for (let i = 0; i < codeSequence.length; i++) {
      await new Promise(r => setTimeout(r, 300));
      setCodeLines(prev => [...prev, codeSequence[i]]);
    }

    await new Promise(r => setTimeout(r, 500));
    
    const key = topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('artificial') 
      ? 'artificial intelligence' 
      : topic.toLowerCase().includes('web') 
        ? 'web development' 
        : 'default';
    
    setOutput(sampleOutputs[key]);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
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
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-mono font-semibold">AI Blog Writer</h3>
            <p className="text-xs text-muted-foreground">Generate SEO-optimized content instantly</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">Vue.js</span>
          <span className="tech-pill text-accent">OpenAI</span>
          <span className="tech-pill text-terminal-purple">Node.js</span>
        </div>
      </div>

      {/* Demo Interface */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground mb-2 block">
              {'>'} Enter your topic:
            </span>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., artificial intelligence trends"
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </label>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full btn-terminal flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>

          {/* Code visualization */}
          {codeLines.length > 0 && (
            <div className="bg-background/50 rounded-lg p-4 font-mono text-xs space-y-1">
              {codeLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-muted-foreground"
                >
                  <span className="text-primary/50 mr-2">{i + 1}</span>
                  <span className={i === codeLines.length - 1 && isGenerating ? 'text-primary' : ''}>
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="relative">
          <div className="bg-background/50 rounded-lg p-4 h-64 overflow-auto font-mono text-sm">
            {output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert prose-sm max-w-none"
              >
                <pre className="whitespace-pre-wrap text-muted-foreground">{output}</pre>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <span>Output will appear here...</span>
              </div>
            )}
          </div>
          
          {output && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 glass rounded-lg hover:bg-secondary transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          ✓ Powers content for 10+ client websites
        </span>
        <a href="#" className="text-primary text-sm font-mono flex items-center gap-1 hover:underline">
          View Full Project <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};

export default AIBlogWriterDemo;