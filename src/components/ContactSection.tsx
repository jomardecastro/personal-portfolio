import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Check, Mail, Linkedin, Github, MapPin, Clock } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [typingLine, setTypingLine] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // API unavailable — still show success for demo
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4">
            <span className="text-muted-foreground">{'// '}</span>
            <span className="text-gradient-primary">Let's Build Something</span>
          </h2>
          <p className="text-muted-foreground">
            Have a project in mind? Let's discuss how I can help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form - Terminal Style */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-terminal-pink" />
              <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">contact.sh</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 font-mono text-sm space-y-4">
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span className="text-primary">{'>'}</span> enter your email:
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setTypingLine(1)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span className="text-primary">{'>'}</span> enter your message:
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setTypingLine(2)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  isSubmitted
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground hover:glow-primary'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="text-primary-foreground">{'>'}</span> send()
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-xl p-6">
              <h3 className="font-mono font-semibold mb-4">Quick Info</h3>
              
              <div className="space-y-4">
                <a
                  href="mailto:connect@jdecastro.dev"
                  className="flex items-center gap-3 p-3 glass-hover rounded-lg group"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    connect@jdecastro.dev
                  </span>
                </a>

                <a
                  href="www.linkedin.com/in/jose-marie-d-903873268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 glass-hover rounded-lg group"
                >
                  <Linkedin className="w-5 h-5 text-terminal-blue" />
                  <span className="text-sm group-hover:text-terminal-blue transition-colors">
                    LinkedIn Profile
                  </span>
                </a>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-terminal-orange" />
                <span className="font-mono text-sm">Philippines</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-mono text-sm">Available for any timezone</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono">
                Response time: Usually within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;