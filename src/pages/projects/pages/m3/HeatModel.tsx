import Figure from "@/components/layout/Figure";

/* The indoor-temperature model, typeset the way the paper derives it in
   Section 2.4, with the inputs from Table 2.5.1. Rendered as text so it
   sets in the site's type instead of as a screenshot of the PDF. */

const Eq = ({ children }: { children: React.ReactNode }) => (
  <p className="font-serif text-[1.05rem] leading-[1.9] text-foreground [font-variant-numeric:lining-nums]">{children}</p>
);
const Frac = ({ top, bottom }: { top: React.ReactNode; bottom: React.ReactNode }) => (
  <span className="mx-0.5 inline-flex flex-col items-center align-middle text-[0.9em] leading-[1.15]">
    <span className="border-b border-foreground px-1">{top}</span>
    <span className="px-1">{bottom}</span>
  </span>
);
const V = ({ children }: { children: React.ReactNode }) => <i>{children}</i>;

const homes = [
  { name: "Home 1", area: 88, shade: 0.1, n: 1 },
  { name: "Home 2", area: 63, shade: 0.6, n: 1 },
  { name: "Home 3", area: 74, shade: 0.95, n: 1 },
  { name: "Home 4", area: 278, shade: 0.95, n: 2 },
];

const HeatModel = () => (
  <Figure
    label="Fig. 2"
    caption="The heat-transfer model behind Fig. 1: indoor temperature changes at the rate heat enters through solar radiation and conduction through the exterior walls, divided by the dwelling's heat capacity. Inputs for the four sample homes from Table 2.5.1."
  >
    <div className="grid gap-6 bg-card p-5 md:grid-cols-[1.2fr_1fr] md:p-6">
      <div className="space-y-3">
        <p className="eyebrow">Model</p>
        <Eq>
          <Frac top={<>d<V>T</V><sub>in</sub></>} bottom={<>d<V>t</V></>} /> = <Frac top="1" bottom={<V>C</V>} /> (<V>Q</V><sub>rad</sub> + <V>Q</V><sub>flow</sub>)
        </Eq>
        <Eq>
          <V>Q</V><sub>rad</sub> = <V>r</V><sub>s</sub> <V>r</V><sub>w</sub> <V>I</V>(<V>t</V>) <V>A</V><sub>w</sub>
        </Eq>
        <Eq>
          <V>Q</V><sub>flow</sub> = <Frac top={<>(<V>T</V><sub>ext</sub>(<V>t</V>) + 50 − <V>T</V><sub>int</sub>(<V>t</V>)) <V>A</V><sub>w</sub></>} bottom={<V>R</V>} />
        </Eq>
        <Eq>
          <V>A</V><sub>w</sub> = 4<V>h</V>√(<V>A</V><sub>b</sub> <V>n</V>), <V>C</V> = <V>A</V><sub>b</sub> <V>h</V> <V>c</V> <V>D</V>
        </Eq>
        <div className="border-t border-border pt-3 font-mono text-[0.68rem] leading-relaxed text-muted-foreground">
          <p>
            T<sub>out</sub>(t) = 4.979 sin(0.320 t − 2.775) + 32.236 °C, fitted to hourly heatwave temperatures
          </p>
          <p>
            I(t) = −24.1 t² + 623.69 t − 3166.688 W/m², zero before 7 AM and after 6 PM
          </p>
          <p>
            R = 13 °C·m²/W (Climate Zone 3 wood frame) · h = 3.048 m · c = 1.005 J/g·°C · D = 1293 g/m³
          </p>
        </div>
      </div>
      <div>
        <p className="eyebrow">Sample homes · Table 2.5.1</p>
        <table className="mt-3 w-full font-mono text-[0.7rem]">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-1.5 font-normal"> </th>
              <th className="pb-1.5 font-normal">
                A<sub>b</sub> (m²)
              </th>
              <th className="pb-1.5 font-normal">
                r<sub>s</sub>
              </th>
              <th className="pb-1.5 font-normal">n</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {homes.map((h) => (
              <tr key={h.name} className="border-t border-border">
                <td className="py-1.5">{h.name}</td>
                <td className="py-1.5 tabular-nums">{h.area}</td>
                <td className="py-1.5 tabular-nums">{h.shade}</td>
                <td className="py-1.5 tabular-nums">{h.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 font-mono text-[0.65rem] leading-relaxed text-muted-foreground">
          r<sub>s</sub> is the shade reduction factor: 1 for no shade, 0.7 not very shady, 0.4 somewhat shady, 0.1 very
          shady. Initial indoor temperature 29.444 °C.
        </p>
      </div>
    </div>
  </Figure>
);

export default HeatModel;
