import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award } from "lucide-react";

const achievements = [
  {
    title: "M3 Math Modeling Challenge — 1st Place",
    detail: "Placed 1st out of 794 teams internationally (US & UK). Awarded $20,000 grand prize. Published in SIAM Undergraduate Research Online.",
  },
  {
    title: "Science Olympiad — National Medals",
    detail: "1st at Nationals in Optics · 2nd at Nationals in Codebusters · Led team to 3rd Place Nationally.",
  },
  {
    title: "MIT Invitational — 1st Place",
    detail: "1st Place in Bungee Drop and Optics at the MIT Science Olympiad Invitational.",
  },
  {
    title: "Instructor of the Year — ScioVirtual",
    detail: "Highest-rated class on the platform. Taught 70+ students interactive cryptography.",
  },
];

const Achievements = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="achievements" className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-3">
            Achievements
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Recognition & impact.
          </h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {achievements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-xl bg-card border-glow card-hover"
            >
              <Award size={20} className="text-primary mb-3" />
              <h4 className="text-foreground font-semibold mb-2">{a.title}</h4>
              <p className="text-sm text-muted-foreground">{a.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
