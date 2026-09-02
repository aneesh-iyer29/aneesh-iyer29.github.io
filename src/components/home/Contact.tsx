import { useEffect, useRef, useState } from "react";
import { Check, Copy, FileText, Github, Linkedin, Mail } from "lucide-react";
import Reveal from "@/components/layout/Reveal";
import { profile } from "@/data/profile";

const channels = [
  { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, icon: Linkedin },
  { label: "GitHub", value: profile.githubHandle, href: profile.github, icon: Github },
  { label: "Resume", value: "resume.pdf", href: profile.resumeUrl, icon: FileText },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="border-t border-border">
      <div className="mx-auto max-w-page px-6 py-24 md:py-32">
        <Reveal>
          <div className="grid gap-12 md:grid-cols-[10rem_1fr] md:gap-10">
            <p className="eyebrow flex items-baseline gap-3">
              <span className="text-accent">05</span>
              Contact
            </p>
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="display text-4xl md:text-5xl">Get in touch.</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                  I am looking for Summer 2027 software engineering and ML infrastructure internships, and I am open to
                  research across AI training infrastructure, evaluation, and autonomous systems. If you are working on
                  any of those, I would like to hear about it.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:pt-3">
                <div className="group border-t border-border pt-3 transition-colors hover:border-foreground/40">
                  <p className="eyebrow flex items-center gap-2 transition-colors group-hover:text-foreground">
                    <Mail size={12} /> Email
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <a href={`mailto:${profile.email}`} className="text-sm text-foreground transition-colors hover:text-accent">
                      {profile.email}
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label={copied ? "Email copied" : "Copy email address"}
                      className="press inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
                    </button>
                    <span aria-live="polite" className="font-mono text-[0.65rem] text-accent">
                      {copied ? "Copied" : ""}
                    </span>
                  </div>
                </div>

                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border-t border-border pt-3 transition-colors hover:border-foreground/40"
                  >
                    <p className="eyebrow flex items-center gap-2 transition-colors group-hover:text-foreground">
                      <c.icon size={12} /> {c.label}
                    </p>
                    <p className="mt-1.5 text-sm text-foreground">{c.value}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
