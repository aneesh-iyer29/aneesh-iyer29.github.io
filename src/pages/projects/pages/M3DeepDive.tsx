import { motion } from "framer-motion";
import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import { Highlights, ImgFigure, P } from "@/components/casestudy";
import p1 from "./images/p1.png";
import p21 from "./images/p21.png";
import p22 from "./images/p22.png";
import p3 from "./images/p3.png";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

/* One part of the challenge: a numbered serif heading, the question it
   answers, then its figures and explanations. */
function Part({ n, title, impact, children }: { n: string; title: string; impact: string; children?: React.ReactNode }) {
  return (
    <motion.section {...reveal} className="grid gap-6 border-t border-border pt-10 md:grid-cols-[4rem_1fr] md:gap-8">
      <span className="readout text-sm font-medium text-accent">{n}</span>
      <div>
        <h2 className="display text-2xl leading-[1.15] text-foreground md:text-3xl">{title}</h2>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">{impact}</p>
        <div className="mt-8">{children}</div>
      </div>
    </motion.section>
  );
}

function FigureExplanation({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="eyebrow mb-2">Explanation</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function M3DeepDive({ project }: ProjectDetailBodyProps) {
  return (
    <div className="max-w-[52rem]">
      <section>
        <p className="eyebrow mb-4">Deep dive</p>
        <P>
          The 2025 challenge focused on the growing impact of heatwaves on energy demand in Memphis during the summer
          months. Heatwaves cause increased demand for air conditioning and other energy-intensive appliances,
          leading to widescale power outages and residents left stranded inside their homes without assistance. The
          challenge was split into three parts, with the first part working on characterizing the problem on a
          home-by-home basis, the second part working on predicting energy demand for Memphis as a whole, and the
          third part working on identifying the most vulnerable populations in the city.
        </P>
      </section>

      <div className="mt-16 flex flex-col gap-16">
        <Part
          n="01"
          title="Modeling the indoor temperature of sample homes without Air Conditioning"
          impact="Shows the impact of heatwaves on residents in Memphis and the need for solutions to reduce heat-related risks."
        >
          <ImgFigure
            src={p1}
            label="Fig. 2"
            alt="Heatwave temperatures during the day"
            caption="Heatwave temperatures modeled for four different homes across a 24 hour day, as well as a summarized derivation of the equation defining the model."
          />
          <FigureExplanation>
            We developed a mathematical model grounded in Newton’s Law of Cooling to describe how internal temperature
            evolves over time as a function of heat capacity, radiative energy transfer, and energy flow. For each of
            these components, we identified and incorporated key influencing factors based on literature and empirical
            data gathered through online research. Using these relationships, we formulated and simulated a 24-hour
            cycle as an initial value problem, allowing us to analyze temperature dynamics under realistic,
            time-dependent conditions.
          </FigureExplanation>
        </Part>

        <Part
          n="02"
          title="Peak Energy Demand in Memphis during the Summer"
          impact="Quantifies the necessary infastructure to prevent power outages. We chose to define this in two ways: the generation requirement (the amount of energy needed for the peak summer month) and the transmission requirement (the amount of generated energy that should be deliverable during the peak hour of demand)."
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <ImgFigure
                src={p21}
                label="Fig. 3"
                alt="mtemp vs demand"
                caption="Historical maximum temperatures vs. peak hourly energy demand"
              />
              <FigureExplanation>
                We found that the biggest factor impacting the necessary hourly energy demand (representing the
                transmission requirement of the grid) was the maximum temperature of the year. To model this, we used a
                multiple linear regressions model (with other minor factors) and evaluated it using emissions estimates
                for future maximum temperature predictions.
              </FigureExplanation>
            </div>
            <div>
              <ImgFigure
                src={p22}
                label="Fig. 4"
                alt="population vs. total consumption"
                caption="Historical population vs. total energy consumption"
              />
              <FigureExplanation>
                For predicting the total energy consumption demands for Memphis, we found that this correlated with the
                population level of Memphis. Similarly, we used another multiple linear regressions model to predict the
                total energy consumption as a function of population, and then evaluated it using population prediction
                data found online.
              </FigureExplanation>
            </div>
          </div>
        </Part>

        <Part
          n="03"
          title="Neighborhood Vulnerability scores"
          impact="Guides resource allocation to provide assistance to vulerable populations to defend against heat-related illnesses."
        >
          <ImgFigure
            src={p3}
            label="Fig. 5"
            alt="Vulnerability scores plot"
            caption="Vulnerability scores visualized for various neighborhoods in Memphis, as well as the ten highest scoring zip codes."
          />
          <FigureExplanation>
            For quantifying the vulnerability of different zip codes in Memphis to heatwaves, we chose to model the
            expected annual loss of each neighborhood based on various factors. By using this consistant baseline for
            measuring impact, we were able to incorporate multiple potential factors into selection and normalize their
            impacts. We then modeled this using a multiple linear regressions model with backwards variable selection,
            ultimately finding four important factors: the proportion of elderly in the region, the proportion of
            children in the region, population, and the number of residents who walk or take public transit to work.
            Our final vulerability scores were created using a weighted sum of these factors based on their
            coefficients from our linear regression, and finally scaled using min-max normalization from 0-100.
          </FigureExplanation>
        </Part>
      </div>

      <motion.section {...reveal} className="mt-20">
        <Highlights items={project.highlights} eyebrow="What I did" />
      </motion.section>
    </div>
  );
}
