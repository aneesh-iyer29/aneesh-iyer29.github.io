import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ProjectMetric, ProjectSection } from "@/data/projects";

interface MetricsGridProps {
  metrics: ProjectMetric[];
}

interface SectionsProps {
  sections: ProjectSection[];
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} as const;

export const ProjectMetricsGrid = ({ metrics }: MetricsGridProps) => {
  if (!metrics.length) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <article key={metric.label} className="card-surface p-5">
          <p className="section-label mb-3">{metric.label}</p>
          <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
          {metric.detail ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{metric.detail}</p> : null}
        </article>
      ))}
    </div>
  );
};

export const ProjectCaseStudySections = ({ sections }: SectionsProps) => (
  <div className="space-y-6">
    {sections.map((section) => {
      if (section.type === "text") {
        return (
          <section key={section.title} className="card-surface p-7">
            <p className="section-label mb-3">{section.eyebrow ?? "Context"}</p>
            <h2 className="mb-4 text-2xl heading-serif text-foreground">{section.title}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        );
      }

      if (section.type === "bullets") {
        return (
          <section key={section.title} className="card-surface p-7">
            <p className="section-label mb-3">{section.eyebrow ?? "Execution"}</p>
            <h2 className="mb-4 text-2xl heading-serif text-foreground">{section.title}</h2>
            {section.intro ? <p className="mb-5 text-sm leading-relaxed text-muted-foreground md:text-base">{section.intro}</p> : null}
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item} className="relative pl-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        );
      }

      if (section.type === "timeline") {
        return (
          <section key={section.title} className="card-surface p-7">
            <p className="section-label mb-3">{section.eyebrow ?? "Process"}</p>
            <h2 className="mb-5 text-2xl heading-serif text-foreground">{section.title}</h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <article key={`${item.phase}-${item.title}`} className="grid gap-3 rounded-xl border border-border bg-secondary/35 p-4 md:grid-cols-[120px_1fr]">
                  <div>
                    <p className="section-label">{item.phase}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      }

      return (
        <section key={section.title} className="card-surface p-7">
          <div className="mb-5 flex flex-col gap-2">
            <p className="section-label">{section.eyebrow ?? "Visualization"}</p>
            <h2 className="text-2xl heading-serif text-foreground">{section.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{section.description}</p>
          </div>

          <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
            {section.chartType === "bar" ? (
              <BarChart accessibilityLayer data={section.data} margin={{ left: 4, right: 4, top: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} width={36} />
                <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[10, 10, 4, 4]} />
              </BarChart>
            ) : section.chartType === "line" ? (
              <LineChart accessibilityLayer data={section.data} margin={{ left: 4, right: 4, top: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} width={36} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
                <Line dataKey="value" stroke="var(--color-value)" strokeLinecap="round" strokeWidth={3} type="monotone" dot={false} />
              </LineChart>
            ) : (
              <AreaChart accessibilityLayer data={section.data} margin={{ left: 4, right: 4, top: 12 }}>
                <defs>
                  <linearGradient id={`area-${section.title.replace(/\s+/g, "-").toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} width={36} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
                <Area
                  dataKey="value"
                  fill={`url(#area-${section.title.replace(/\s+/g, "-").toLowerCase()})`}
                  stroke="var(--color-value)"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            )}
          </ChartContainer>

          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">{section.footnote}</p>
        </section>
      );
    })}
  </div>
);