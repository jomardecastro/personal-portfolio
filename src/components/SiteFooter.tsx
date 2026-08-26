import { Linkedin, Mail } from 'lucide-react';

const SiteFooter = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Jose Marie De Castro
      </p>
      <div className="flex items-center gap-4">
        <a
          href="mailto:jomar.decastro07@gmail.com"
          aria-label="Email"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/jose-marie-d-903873268"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Résumé
        </a>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
