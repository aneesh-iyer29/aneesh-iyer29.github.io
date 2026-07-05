import { Mail, Linkedin, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const channels = [
  {
    label: "Email",
    value: "aiyer@gatech.edu",
    href: "mailto:aiyer@gatech.edu",
    icon: Mail,
  },
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
    value: "PDF",
    href: "https://raw.githubusercontent.com/aneesh-iyer29/resume/main/Aneesh_Iyer_Resume.pdf",
    icon: FileText,
  },
];

const Contact = () => {
  return (
    <section id="contact" className="relative border-t border-border">
      <div className="relative px-6 pt-28 pb-8">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <p className="eyebrow mb-3">Contact</p>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground leading-tight tracking-tight">
                Get in touch
              </h2>
              <p className="text-foreground/75 mt-5 max-w-md leading-relaxed">
                I'm open to internships and research across AI training infrastructure, evaluation, and autonomous
                systems. If you're working on any of those, I'd like to hear about it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 md:pt-12">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group border-t border-foreground/25 pt-3 transition-colors duration-200 hover:border-accent/70"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-foreground/60 flex items-center gap-2 transition-colors duration-200 group-hover:text-accent">
                    <channel.icon size={12} /> {channel.label}
                  </p>
                  <p className="text-sm text-foreground mt-1.5">{channel.value}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full mt-24 pt-6 border-t border-foreground/20 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs text-foreground/60">© {new Date().getFullYear()} Aneesh Iyer</p>
          <Link
            to="/scioly-tests"
            className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
          >
            SciOly Tests →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;
