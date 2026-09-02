import Section from "@/components/layout/Section";
import Reveal from "@/components/layout/Reveal";
import { education } from "@/data/profile";
import aneeshPhoto from "@/assets/aneesh-photo.jpeg";

const About = () => (
  <Section id="about" index="01" eyebrow="About">
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <Reveal className="lg:col-span-8">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            I am a Computer Engineering student at <span className="font-medium text-foreground">Georgia Tech</span> on the
            Cybersecurity and Systems/Architecture threads, working at the intersection of AI training infrastructure
            and control systems.
          </p>
          <p>
            At <span className="font-medium text-foreground">Transpira Labs</span> I built the task-authoring platform
            behind a team of 40+ subject-matter experts, packaged supply-chain benchmarks into validation suites with
            deterministic rewards, and ran Benchception, an experiment asking whether frontier models can author RL
            environments at all. Before that, at <span className="font-medium text-foreground">Nuntius (YC S25)</span>, I
            directed eight engineers delivering RL environments and adversarial evaluations for LLM agents.
          </p>
          <p>
            On <span className="font-medium text-foreground">GT Propulsive Landers</span> I help lead the guidance, navigation,
            and control subteam and write the estimation software for a self-landing rocket. The thread through all of
            it is the same: benchmarks with deterministic rewards, estimators checked against ground truth, and models
            judged on held-out tasks. It started with the{" "}
            <a href="https://doi.org/10.1137/25s1777554" target="_blank" rel="noopener noreferrer" className="link">
              MathWorks M3 Challenge
            </a>{" "}
            win and a publication in SIAM Undergraduate Research Online, and it runs through everything I build now.
          </p>
        </div>

      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-4">
        <figure className="figure-frame max-w-[20rem] lg:max-w-none">
          <div className="aspect-[3/2] overflow-hidden">
            <img src={aneeshPhoto} alt="Aneesh Iyer" className="h-full w-full object-cover object-[center_12%]" loading="lazy" />
          </div>
          <figcaption className="border-t border-border px-4 py-3">
            <p className="eyebrow">Education</p>
            <p className="mt-2 text-sm font-medium text-foreground">{education.school}</p>
            <p className="text-xs text-muted-foreground">{education.degree}</p>
            <p className="text-xs text-muted-foreground">{education.threads}</p>
            <p className="mt-2 font-mono text-[0.68rem] text-muted-foreground">
              GPA <span className="readout text-foreground">{education.gpa}</span> · Expected{" "}
              <span className="text-foreground">{education.graduation}</span>
            </p>
          </figcaption>
        </figure>
      </Reveal>
    </div>
  </Section>
);

export default About;
