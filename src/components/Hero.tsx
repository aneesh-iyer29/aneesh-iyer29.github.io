import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Github, Linkedin, Mail, ArrowRight } from "lucide-react";

const focusAreas = [
  {
    title: "AI & Alignment",
    description: "LLM evaluation systems, synthetic data generation, and model alignment research.",
  },
  {
    title: "Control Systems & GNC",
    description: "Extended Kalman Filters, sensor fusion, and autonomous flight control simulations.",
  },
  {
    title: "Mathematical Modeling",
    description: "Regression analysis, predictive modeling, and SIAM-published research.",
  },
];

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center px-6 pt-20">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label mb-4">Portfolio</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground mb-6 leading-[1.05]">
            Aneesh Iyer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-4 leading-relaxed max-w-lg">
            Computer Engineer focused on AI, control systems, and aerospace.
          </p>
          <p className="text-base text-muted-foreground max-w-lg mb-6 leading-relaxed">
            I build intelligent systems across AI alignment, autonomous flight control, and mathematical modeling. Based in Atlanta, GA and currently studying at Georgia Tech.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-8">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> Atlanta, Georgia
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={14} /> SWE @ Architect Labs (YC S'25)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={14} /> Georgia Tech
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              View Work <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://github.com/aneesh-iyer29" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Github size={15} /> GitHub
            </a>
            <a href="https://linkedin.com/in/aneesh-iyer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Linkedin size={15} /> LinkedIn
            </a>
            <a href="mailto:aiyer397@gatech.edu" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail size={15} /> Email
            </a>
          </div>
        </motion.div>

        {/* Right column - Current Focus card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="card-surface p-8 mt-8 lg:mt-16"
        >
          <p className="section-label mb-6">Current Focus</p>
          <div className="space-y-6">
            {focusAreas.map((area, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{area.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
