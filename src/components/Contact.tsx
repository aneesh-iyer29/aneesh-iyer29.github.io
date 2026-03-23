import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Github } from "lucide-react";

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            Contact
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's connect.
          </h3>
          <p className="text-muted-foreground mb-8">
            Always open to discussing new opportunities, research collaborations, or interesting engineering challenges.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="mailto:aiyer397@gatech.edu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all"
            >
              <Mail size={16} /> Get in Touch
            </a>
            <a
              href="https://linkedin.com/in/aneesh-iyer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-glow bg-secondary text-secondary-foreground font-medium text-sm hover:bg-muted transition-all"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href="https://github.com/aneesh-iyer29"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-glow bg-secondary text-secondary-foreground font-medium text-sm hover:bg-muted transition-all"
            >
              <Github size={16} /> GitHub
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-24 pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Built by Aneesh Iyer · © {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
};

export default Contact;
