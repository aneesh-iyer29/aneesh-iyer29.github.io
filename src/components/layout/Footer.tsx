import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-6">
      <p className="font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} {profile.name}
      </p>
      <div className="flex items-center gap-5 font-mono text-xs text-muted-foreground">
        <Link to="/scioly-tests" className="transition-colors hover:text-foreground">
          SciOly test bank
        </Link>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-foreground">
          <Github size={14} />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
          <Linkedin size={14} />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email" className="transition-colors hover:text-foreground">
          <Mail size={14} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
