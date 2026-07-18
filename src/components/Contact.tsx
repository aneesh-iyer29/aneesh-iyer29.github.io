import { useEffect, useRef, useState } from "react";
import { Mail, Linkedin, Github, FileText, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";

const EMAIL = "aiyer@gatech.edu";

const channels = [
  {
    label: "LinkedIn",
    value: "in/aneesh-iyer",
    href: "https://linkedin.com/in/aneesh-iyer",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "aneesh-iyer29",
    href: "https://github.com/aneesh-iyer29",
    icon: Github,
  },
  {
    label: "Resume",
    value: "resume.pdf",
    href: "/resume.pdf",
    icon: FileText,
  },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="relative">
      <div className="relative px-6 pt-28 pb-8">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <p className="eyebrow mb-3">Contact</p>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground leading-tight tracking-tight">
                Get in touch
              </h2>
              <p className="text-muted-foreground mt-5 max-w-md leading-relaxed">
                I'm looking for Summer 2027 software engineering and ML infrastructure internships, and I'm open to
                research across AI training infrastructure, evaluation, and autonomous systems. If you're working on
                any of those, I'd like to hear about it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 md:pt-12">
              {/* Email gets a copy affordance alongside the mailto link. */}
              <div className="group border-t border-foreground/15 pt-3 transition-colors duration-200 hover:border-accent/70">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-2 transition-colors duration-200 group-hover:text-accent">
                  <Mail size={12} /> Email
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <a href={`mailto:${EMAIL}`} className="text-sm text-foreground hover:text-accent transition-colors">
                    {EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={copied ? "Email copied" : "Copy email address"}
                    className="press inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
                  </button>
                  <span aria-live="polite" className="font-mono text-[0.65rem] text-accent">
                    {copied ? "Copied" : ""}
                  </span>
                </div>
              </div>

              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-t border-foreground/15 pt-3 transition-colors duration-200 hover:border-accent/70"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-2 transition-colors duration-200 group-hover:text-accent">
                    <channel.icon size={12} /> {channel.label}
                  </p>
                  <p className="text-sm text-foreground mt-1.5">{channel.value}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full mt-24 pt-6 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} Aneesh Iyer</p>
          <Link
            to="/scioly-tests"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            SciOly Tests →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;
