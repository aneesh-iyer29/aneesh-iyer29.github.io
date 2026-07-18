const categories = [
  {
    title: "Languages",
    items: ["Python", "Java", "Rust", "C", "TypeScript", "SQL", "R", "MATLAB", "HTML/CSS", "Bash", "LaTeX"],
  },
  {
    title: "AI / ML",
    items: ["PyTorch", "RL Environment Creation", "LLM Evaluation & Benchmarking", "RLVR / GRPO", "NVIDIA NeMo Gym"],
  },
  {
    title: "Web & Infrastructure",
    items: ["React", "Node.js", "FastAPI", "Tailwind CSS", "Vite", "Linux", "GitHub Actions"],
  },
  {
    title: "Tools & Systems",
    items: ["Docker", "Git", "Pydantic", "Arduino", "RISC-V", "Control Systems", "Sensor Fusion", "Embedded Systems"],
  },
  {
    title: "Interests",
    items: ["Machine Learning", "Cryptography", "Cybersecurity", "Aerospace Systems", "Optics", "Spanish"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="relative py-28 px-6">
      <div className="relative max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">
            Technical toolkit
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {categories.map((cat) => (
            <div key={cat.title} className="border-t border-border pt-4">
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground mb-4">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
