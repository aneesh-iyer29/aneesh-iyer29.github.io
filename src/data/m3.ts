/* Data from "Hot Button Issue: Staying Cool as the World Heats Up"
   (Shao, Iyer, Rajan, Tang, Zhang; SIAM Undergraduate Research Online,
   doi 10.1137/25S1777554). Tables are transcribed from Appendix 7.4 and
   7.5; coefficients from Appendix 7.3; projections from Section 1. */

export interface DemandRow {
  year: number;
  /** Shelby County population. */
  pop: number;
  /** Annual maximum recorded temperature in Memphis, °F. */
  mtemp: number;
  /** Peak hourly demand, MW (not recorded for 2020). */
  pload: number | null;
  /** Total consumption of the peak summer month, billion kWh. */
  tc: number;
}

export const demand: DemandRow[] = [
  { year: 2012, pop: 939421, mtemp: 103, pload: 3256, tc: 1.07187532 },
  { year: 2013, pop: 938069, mtemp: 98, pload: 3195, tc: 1.067037226 },
  { year: 2014, pop: 937441, mtemp: 100, pload: 3062, tc: 1.050957091 },
  { year: 2015, pop: 937020, mtemp: 99, pload: 3226, tc: 1.048039781 },
  { year: 2016, pop: 936961, mtemp: 100, pload: 3155, tc: 1.040242715 },
  { year: 2017, pop: 936961, mtemp: 99, pload: 3086, tc: 1.012139307 },
  { year: 2018, pop: 936961, mtemp: 97, pload: 3097, tc: 1.05699823 },
  { year: 2019, pop: 937070, mtemp: 100, pload: 3182, tc: 1.01752221 },
  { year: 2020, pop: 929744, mtemp: 97, pload: null, tc: 0.964066949 },
  { year: 2021, pop: 923382, mtemp: 96, pload: 3177, tc: 0.976826102 },
  { year: 2022, pop: 916357, mtemp: 102, pload: 3316, tc: 0.973628714 },
];

/* Multiple linear regression on max temperature and population (model1
   in Appendix 7.2), evaluated on projected temperature and population. */
export const projections = {
  pload2025: 3433.7,
  tc2025: 887513753,
  pload2045: [3527.27, 3563.07] as const,
  tc2045: [758881008, 764797475] as const,
  scenarios: "five SSP emission scenarios",
};

export interface ZipRow {
  zip: string;
  /** Expected loss per capita, the regression target. */
  loss: number;
  elderly: number;
  children: number;
  /** Population in units of 10,000 people. */
  pop: number;
  /** Residents age 16+ who walk or take public transit to work. */
  transit: number;
}

export const zips: ZipRow[] = [
  { zip: "38103", loss: 45.195, elderly: 0.115, children: 0.079, pop: 1.182, transit: 307 },
  { zip: "38002", loss: 49.041, elderly: 0.302, children: 0.412, pop: 4.369, transit: 65 },
  { zip: "38017", loss: 36.149, elderly: 0.298, children: 0.391, pop: 5.623, transit: 65 },
  { zip: "38016", loss: 37.526, elderly: 0.249, children: 0.261, pop: 4.427, transit: 131 },
  { zip: "38018", loss: 36.638, elderly: 0.243, children: 0.313, pop: 3.8, transit: 99 },
  { zip: "38028", loss: 98.672, elderly: 0.394, children: 0.36, pop: 0.77, transit: 9 },
  { zip: "38060", loss: 30.205, elderly: 0.347, children: 0.308, pop: 1.236, transit: 42 },
  { zip: "38066", loss: 73.416, elderly: 0.475, children: 0.228, pop: 0.371, transit: 3 },
  { zip: "38104", loss: 42.971, elderly: 0.215, children: 0.139, pop: 2.212, transit: 755 },
  { zip: "38105", loss: 72.03, elderly: 0.223, children: 0.131, pop: 0.496, transit: 411 },
  { zip: "38106", loss: 43.619, elderly: 0.364, children: 0.195, pop: 2.17, transit: 347 },
  { zip: "38107", loss: 58.322, elderly: 0.245, children: 0.219, pop: 1.4, transit: 427 },
  { zip: "38108", loss: 39.46, elderly: 0.336, children: 0.33, pop: 1.843, transit: 186 },
  { zip: "38109", loss: 29.092, elderly: 0.407, children: 0.28, pop: 4.364, transit: 268 },
  { zip: "38111", loss: 35.098, elderly: 0.27, children: 0.217, pop: 4.206, transit: 1102 },
  { zip: "38112", loss: 65.318, elderly: 0.301, children: 0.249, pop: 1.511, transit: 585 },
  { zip: "38117", loss: 53.601, elderly: 0.326, children: 0.266, pop: 2.626, transit: 67 },
  { zip: "38125", loss: 32.916, elderly: 0.189, children: 0.329, pop: 4.273, transit: 89 },
  { zip: "38126", loss: 70.382, elderly: 0.256, children: 0.368, pop: 0.546, transit: 173 },
  { zip: "38127", loss: 31.029, elderly: 0.281, children: 0.379, pop: 3.94, transit: 350 },
  { zip: "38128", loss: 31.006, elderly: 0.233, children: 0.376, pop: 4.37, transit: 191 },
  { zip: "38133", loss: 40.547, elderly: 0.221, children: 0.36, pop: 2.09, transit: 16 },
  { zip: "38134", loss: 41.587, elderly: 0.242, children: 0.331, pop: 3.885, transit: 90 },
  { zip: "38135", loss: 10.132, elderly: 0.309, children: 0.31, pop: 3.028, transit: 90 },
  { zip: "38138", loss: 52.834, elderly: 0.462, children: 0.311, pop: 2.517, transit: 78 },
  { zip: "38139", loss: 26.961, elderly: 0.396, children: 0.396, pop: 1.63, transit: 0 },
  { zip: "38141", loss: 46.37, elderly: 0.186, children: 0.411, pop: 2.377, transit: 48 },
];

/* Regression coefficients from Appendix 7.3, in the order elderly,
   children, population, transit. */
export const vulnerabilityCoefficients = { elderly: 84.9225, children: 105.4934, pop: -7.3073, transit: 0.0336 };

export interface ScoredZip extends ZipRow {
  raw: number;
  score: number;
  parts: { elderly: number; children: number; pop: number; transit: number };
}

/* VS = min-max normalized weighted sum, scaled 0 to 100, exactly as in the appendix. */
export function vulnerabilityScores(): ScoredZip[] {
  const k = vulnerabilityCoefficients;
  const scored = zips.map((z) => {
    const parts = { elderly: z.elderly * k.elderly, children: z.children * k.children, pop: z.pop * k.pop, transit: z.transit * k.transit };
    return { ...z, parts, raw: parts.elderly + parts.children + parts.pop + parts.transit, score: 0 };
  });
  const lo = Math.min(...scored.map((s) => s.raw));
  const hi = Math.max(...scored.map((s) => s.raw));
  return scored
    .map((s) => ({ ...s, score: ((s.raw - lo) / (hi - lo)) * 100 }))
    .sort((a, b) => b.score - a.score);
}
