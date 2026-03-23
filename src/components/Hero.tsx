import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import aneeshPhoto from "@/assets/aneesh-photo.jpeg";

const Hero = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center px-6 pt-24 pb-12">
      <div className="max-w-6xl mx-auto w-full">
        {/* Top row: intro + photo */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-6">Computer Engineering · Georgia Tech · 4.0 GPA</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-foreground mb-6 leading-[1.08]">
              Aneesh Iyer
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed">
              I build intelligent systems across AI alignment, autonomous flight control, and mathematical modeling — grounded in first-principles thinking and real-world impact.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-8">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> Atlanta, GA
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} /> Architect Labs (prev. Nuntius YC S25)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={14} /> Georgia Tech
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                onClick={() => scrollToSection("projects")}
              >
                View Work <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </button>
            </div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl overflow-hidden aspect-[3/4] border border-border shadow-sm">
              <img
                src={aneeshPhoto}
                alt="Aneesh Iyer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom row: links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-5 text-sm text-muted-foreground"
        >
          <a href="https://github.com/aneesh-iyer29" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Github size={15} /> GitHub
          </a>
          <a href="https://linkedin.com/in/aneesh-iyer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Linkedin size={15} /> LinkedIn
          </a>
          <a href="mailto:aiyer397@gatech.edu" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail size={15} /> Email
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
