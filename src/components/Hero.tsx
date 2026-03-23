import { motion } from "framer-motion";
import { ArrowDown, FileText, Github, Linkedin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-primary font-mono text-sm mb-4 tracking-widest uppercase">
            Computer Engineering · Georgia Tech
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
            Aneesh Iyer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 leading-relaxed">
            Building intelligent systems at the intersection of{" "}
            <span className="text-primary">AI</span>,{" "}
            <span className="text-primary">control theory</span>, and{" "}
            <span className="text-primary">aerospace engineering</span>.
          </p>
          <p className="text-sm text-muted-foreground font-mono mb-8">
            4.0 GPA · M3 Math Modeling Champion · Science Olympiad National Medalist
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-110 transition-all"
          >
            View Projects
          </a>
          <a
            href="/Aneesh_Iyer_Resume.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-glow bg-secondary text-secondary-foreground font-medium text-sm hover:bg-muted transition-all"
          >
            <FileText size={16} /> Resume
          </a>
          <div className="flex gap-3">
            <a
              href="https://linkedin.com/in/aneesh-iyer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border-glow bg-secondary text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://github.com/aneesh-iyer29"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border-glow bg-secondary text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="text-muted-foreground animate-float block">
            <ArrowDown size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
