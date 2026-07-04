import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import contactCave from "@/assets/contact-cave.jpg";

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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative border-t border-border overflow-hidden">
      {/* Cave backdrop, tinted so the text stays readable. */}
      <img
        src={contactCave}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.82) 35%, hsl(var(--background) / 0.72) 100%)",
        }}
      />

      <div className="relative z-10 py-28 px-6">
        <div className="max-w-5xl mx-auto" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-[1fr_1fr] gap-12 items-start"
          >
            <div>
              <p className="eyebrow mb-3">Contact</p>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground leading-tight tracking-tight">
                Let's build something measurable.
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
                  className="group border-t border-foreground/25 pt-3"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-foreground/60 flex items-center gap-2">
                    <channel.icon size={12} /> {channel.label}
                  </p>
                  <p className="text-sm text-foreground mt-1.5 group-hover:text-accent transition-colors">
                    {channel.value}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>

          <div className="mt-28 pt-6 border-t border-foreground/20 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs text-foreground/60">© {new Date().getFullYear()} Aneesh Iyer</p>
            <Link
              to="/scioly-tests"
              className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
            >
              SciOly Tests →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
