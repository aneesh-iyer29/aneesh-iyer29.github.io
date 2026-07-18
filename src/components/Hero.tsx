import { MapPin, Briefcase, GraduationCap, Github, Linkedin, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section id="hero" className="relative">
      <div className="relative max-w-5xl mx-auto w-full px-6 pt-44 pb-28">
        <div className="fade-up flex flex-col items-center text-center">
          <p className="eyebrow mb-6 !text-foreground/70">
            Computer Engineering · Georgia Tech · Class of 2028
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-semibold text-foreground mb-6 leading-[1.04] display-tracking">
            Aneesh Iyer
          </h1>
          <p className="text-lg md:text-xl text-foreground/85 max-w-2xl mb-5 leading-relaxed">
            Software engineer working on RL environments, evals, and benchmarks for frontier LLMs. Currently at
            Transpira Labs building infrastructure for frontier AI training data.
          </p>
          <p className="font-mono text-sm text-accent mb-7">
            Seeking Summer 2027 SWE / ML infrastructure internships
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-foreground/70 mb-9 font-mono">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> Atlanta, GA
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={13} /> Transpira Labs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={13} /> Georgia Tech
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="/#projects" className="btn-primary">
              View projects
            </a>
            <a href="/#contact" className="btn-glass">
              Contact
            </a>
            <div className="flex items-center gap-4 ml-2 text-foreground/70">
              <a href="https://github.com/aneesh-iyer29" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-foreground transition-colors">
                <Github size={17} />
              </a>
              <a href="https://linkedin.com/in/aneesh-iyer" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
                <Linkedin size={17} />
              </a>
              <a href="mailto:aiyer@gatech.edu" aria-label="Email" className="hover:text-foreground transition-colors">
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
