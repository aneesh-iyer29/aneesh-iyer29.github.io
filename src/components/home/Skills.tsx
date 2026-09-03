import Reveal from "@/components/layout/Reveal";
import { skillGroups } from "@/data/skills";

/* A quiet appendix-style table, not a wall of badges. */
const Skills = () => (
  <section id="skills" className="border-t border-border">
    <div className="mx-auto max-w-page px-6 py-16 md:py-20">
      <Reveal>
        <div className="grid gap-6 md:grid-cols-[10rem_1fr] md:gap-10">
          <p className="eyebrow flex items-baseline gap-3">
            <span className="text-accent">A</span>
            Appendix
          </p>
          <div>
            <h2 className="display mb-8 text-3xl md:text-4xl">Technical Skills</h2>
            <div className="divide-y divide-border">
            {skillGroups.map((g) => (
              <div key={g.title} className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground sm:pt-1">{g.title}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-foreground">
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Skills;
