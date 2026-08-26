import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Check, Mail, Linkedin, MapPin, Clock } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    <section id="contact" className="scroll-mt-20 border-t border-border px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="hairline mb-5 w-12" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Let's talk
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Building something where the numbers matter? Tell me about it.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-5">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="surface space-y-4 p-6 md:col-span-3"
          >
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-foreground">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="What are you building?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                isSubmitted
                  ? 'bg-success text-success-foreground'
                  : 'bg-primary text-primary-foreground hover:brightness-105 disabled:opacity-70'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4" />
                  Message sent
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send message
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="space-y-3 md:col-span-2"
          >
            <a
              href="mailto:connect@jdecastro.dev"
              className="surface-hover flex items-center gap-3 p-4"
            >
              <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="truncate text-sm text-foreground">connect@jdecastro.dev</span>
            </a>

            <a
              href="https://www.linkedin.com/in/jose-marie-d-903873268"
              target="_blank"
              rel="noopener noreferrer"
              className="surface-hover flex items-center gap-3 p-4"
            >
              <Linkedin className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm text-foreground">LinkedIn profile</span>
            </a>

            <div className="surface space-y-3 p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Philippines</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Available across timezones · replies within 24h
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
