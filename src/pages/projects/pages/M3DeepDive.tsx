import type { ProjectDetailBodyProps } from "@/pages/projects/types";
import p1 from "./images/p1.png";
import p21 from "./images/p21.png";
import p22 from "./images/p22.png";
import p3 from "./images/p3.png";

function VizCard({
  title,
  impact,
  children,
}: {
  title: string;
  impact: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="card-surface p-7">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{impact}</p>
      </div>
      {children}
    </section>
  );
}

function ImgFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="rounded-2xl border border-border overflow-hidden bg-secondary/30">
      <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      {caption ? (
        <figcaption className="px-4 py-3 text-xs text-muted-foreground border-t border-border">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function FigureExplanation({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="section-label mb-2">Explanation</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export function M3DeepDive({ project }: ProjectDetailBodyProps) {
  return (
    <div className="space-y-6">
      <section className="card-surface p-7">
        <p className="section-label mb-3">Deep dive</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
        The 2025 challenge focused on the growing impact of heatwaves on energy demand in Memphis during the summer months. Heatwaves cause increased demand for air conditioning and other energy-intensive appliances, leading to widescale power outages and residents left stranded inside their homes without assistance. The challenge was split into three parts, with the first part working on characterizing the problem on a home-by-home basis, the second part working on predicting energy demand for Memphis as a whole, and the third part working on identifying the most vulnerable populations in the city.
        </p>
      </section>

      <div className="grid gap-6">
        <VizCard
          title="1) Modeling the indoor temperature of sample homes without Air Conditioning"
          impact="Shows the impact of heatwaves on residents in Memphis and the need for solutions to reduce heat-related risks."
        >
          <div className="grid gap-4">
            <ImgFigure
              src={p1}
              alt="Heatwave temperatures during the day"
              caption="Heatwave temperatures modeled for four different homes across a 24 hour day, as well as a summarized derivation of the equation defining the model."
            />
            <FigureExplanation>
            We developed a mathematical model grounded in Newton’s Law of Cooling to describe how internal temperature evolves over time as a function of heat capacity, radiative energy transfer, and energy flow. For each of these components, we identified and incorporated key influencing factors based on literature and empirical data gathered through online research. Using these relationships, we formulated and simulated a 24-hour cycle as an initial value problem, allowing us to analyze temperature dynamics under realistic, time-dependent conditions.            </FigureExplanation>
          </div>
        </VizCard>

        <VizCard
          title="2) Peak Energy Demand in Memphis during the Summer"
          impact="Quantifies the necessary infastructure to prevent power outages. We chose to define this in two ways: the generation requirement (the amount of energy needed for the peak summer month) and the transmission requirement (the amount of generated energy that should be deliverable during the peak hour of demand)."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <ImgFigure
                src={p21}
                alt="mtemp vs demand"
                caption="Historical maximum temperatures vs. peak hourly energy demand"
              />
              <FigureExplanation>
                We found that the biggest factor impacting the necessary hourly energy demand (representing the transmission requirement of the grid) 
                was the maximum temperature of the year. To model this, we used a multiple linear regressions model (with other minor factors) and evaluated it using 
                emissions estimates for future maximum temperature predictions.
              </FigureExplanation>
            </div>
            <div>
              <ImgFigure
                src={p22}
                alt="population vs. total consumption"
                caption="Historical population vs. total energy consumption"
              />
              <FigureExplanation>
                For predicting the total energy consumption demands for Memphis, we found that this correlated with the population level of Memphis. 
                Similarly, we used another multiple linear regressions model to predict the total energy consumption as a function of population, and then 
                evaluated it using population prediction data found online.
              </FigureExplanation>
            </div>
          </div>
        </VizCard>

        <VizCard
          title="3) Neighborhood Vulnerability scores"
          impact="Guides resource allocation to provide assistance to vulerable populations to defend against heat-related illnesses."
        >
          <div className="grid gap-4">
            <ImgFigure
              src={p3}
              alt="Vulnerability scores plot"
              caption="Vulnerability scores visualized for various neighborhoods in Memphis, as well as the ten highest scoring zip codes."
            />
            <FigureExplanation>
              For quantifying the vulnerability of different zip codes in Memphis to heatwaves, we chose to model the expected annual loss of each neighborhood based on various factors. 
              By using this consistant baseline for measuring impact, we were able to incorporate multiple potential factors into selection and normalize their impacts. We then modeled this using a multiple linear 
              regressions model with backwards variable selection, ultimately finding four important factors: the proportion of elderly in the region, the proportion of children in the region, population, and the number 
              of residents who walk or take public transit to work. Our final vulerability scores were created using a weighted sum of these factors based on their coefficients from our linear regression, and finally scaled using 
              min-max normalization from 0-100.
            </FigureExplanation>
          </div>
        </VizCard>
      </div>

      <section className="card-surface p-7">
        <p className="section-label mb-3">What I did</p>
        <ul className="space-y-3">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="text-sm text-muted-foreground leading-relaxed pl-4 relative">
              <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

