import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Github, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import contactRiver from "@/assets/contact-river.jpg";
import { DraftMark } from "@/components/decor";

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
      {/* River backdrop, tinted so the text stays readable. It breathes in
          slowly as the section scrolls into view instead of appearing statically. */}
      <motion.img
        src={contactRiver}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.08 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.92) 22%, hsl(var(--background) / 0.74) 55%, hsl(var(--background) / 0.68) 100%)",
        }}
      />

      <DraftMark className="left-8 top-28" />
      <DraftMark className="right-8 bottom-28" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 pt-28 pb-8">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center" ref={ref}>
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
                  className="group border-t border-foreground/25 pt-3 transition-colors duration-300 hover:border-accent/70"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-foreground/60 flex items-center gap-2 transition-colors duration-300 group-hover:text-accent">
                    <channel.icon size={12} /> {channel.label}
                  </p>
                  <p className="text-sm text-foreground mt-1.5 transition-transform duration-300 group-hover:translate-x-1">
                    {channel.value}
                  </p>
                </a>
              ))}
            </div>
          </motion.div>

        </div>

        <div className="max-w-5xl mx-auto w-full mt-16 pt-6 border-t border-foreground/20 flex flex-wrap items-center justify-between gap-3">
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
