import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Github } from "lucide-react";

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12 items-start" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">Contact</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
            Let's connect
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
            To prepare for working in technology as AI advances after I graduate, I plan to gain experience by continuing my work with AI alignment while simultaneously working on tangible projects at Georgia Tech with the assistance of AI generation and coding tools. Prior to graduation, I plan to have done multiple projects on AI and have published research in the field.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-6">Reach out directly</h3>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            If you're hiring for internships or want to discuss work across AI alignment, control systems, or aerospace engineering, I'm happy to connect.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:aiyer@gatech.edu"
              className="flex items-center gap-3 group"
            >
              <Mail size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Email</p>
                <p className="text-sm text-foreground">aiyer@gatech.edu</p>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/aneesh-iyer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <Linkedin size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">LinkedIn</p>
                <p className="text-sm text-foreground">linkedin.com/in/aneesh-iyer</p>
              </div>
            </a>
            <a
              href="https://github.com/aneesh-iyer29"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <Github size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">GitHub</p>
                <p className="text-sm text-foreground">github.com/aneesh-iyer29</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto mt-24 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aneesh Iyer. Built with care.
        </p>
      </div>
    </section>
  );
};

export default Contact;
