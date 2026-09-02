import { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { ImgFigure } from "@/components/casestudy";
import sciOlyPhoto from "@/assets/scioly-nationals.png";

interface TestItem {
  year: string;
  event: string;
  title: string;
  testLink?: string;
  keyLink?: string;
  privateRelease?: boolean;
}

const tests: TestItem[] = [
  { year: "2026", event: "Machines", title: "2026 Ohio State Tournament - Machines C (April 2026)", privateRelease: true},
  { year: "2026", event: "Machines", title: "2026 Florida State Tournament - Machines B/C (April 2026)", privateRelease: true},
  { year: "2026", event: "Codebusters", title: "2026 Northern California State Tournament - Codebusters C (April 2026)", privateRelease: true},
  { year: "2026", event: "Machines", title: "2026 Georgia State Tournament - Machines C (April 2026)", privateRelease: true},
  { year: "2026", event: "Codebusters", title: "2026 Georgia State Tournament - Codebusters C (April 2026)", privateRelease: true},
  { year: "2026", event: "Codebusters", title: "2026 Santa Clara Regionals - Codebusters B/C (March 2026)", privateRelease: true},
  { year: "2026", event: "Codebusters", title: "2026 Ohio CORE Regionals - Codebusters B (March 2026)", privateRelease: true},
  { year: "2026", event: "Machines", title: "2026 New Jersey State Tournament - Machines C (March 2026)", privateRelease: true},
  { year: "2026", event: "Codebusters", title: "2026 UMASO Invitational - Codebusters C (February 2026)", testLink: "https://drive.google.com/file/d/1q5NXTSyrVmEIKNwNo7qtVC3aGkcGJ3Kw/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1ytWNjow4BttacHjQ6To0S2WLT4pimj6M/view?usp=drive_link" },
  { year: "2026", event: "Codebusters", title: "2026 PUSO Invitational - Codebusters C (February 2026)", testLink: "https://drive.google.com/file/d/1YRk790vL3uF53YdZm0JevWOul2qaX74s/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1NRqie_tuFAlvkKwW_at8HrMnVRHmsWXd/view?usp=drive_link" },
  { year: "2026", event: "Codebusters", title: "2026 MIT Invitational - Codebusters C (January 2026)", testLink: "https://drive.google.com/file/d/1dGZF6mhtmH0Ogcq_AIlCyEvggxWvIJk4/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1Xv5L7dYsfmorEqztdk7eTZvEdHhkz2TQ/view?usp=drive_link" },
  { year: "2026", event: "Machines", title: "2026 MIT Invitational - Machines C FRQ #2 (January 2026)", testLink: "https://drive.google.com/file/d/1uZVFC7NRDrubej5mbUF7KvAFGtuqBf5f/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/19xOM2OQ-1nG8nfdHRj8NH7sQL05d39aN/view?usp=drive_link" },
  { year: "2026", event: "Codebusters", title: "2026 Yellow Jacket Invitational - Codebusters C (January 2026)", testLink: "https://drive.google.com/file/d/1L3sTILtLGh4AKzQg_oSXNLRDcTNlgXWH/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/15QIsSo4QxP4xTbnMbWlTcsFMj0Eq_cJ9/view?usp=drive_link" },
  { year: "2025", event: "Codebusters", title: "2026 GullSO Invitational - Codebusters C (December 2025)", testLink: "https://drive.google.com/file/d/18K80nhGLIiTpN1QfI2m0cCYlTJN03n-Z/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/11ER3x2mWYgo6tRWpiS1x7vAM6jtVYojN/view?usp=drive_link" },
  { year: "2025", event: "Codebusters", title: "2026 Mason Invitational - Codebusters C (November 2025)", testLink: "https://drive.google.com/file/d/1Rpkye59-Llh0I-vJYLz1aGwnXhx7TcVz/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1uryTxfqNOZ6OvMWEeDY2npgczWrUgXRA/view?usp=drive_link" },
  { year: "2025", event: "Codebusters", title: "2026 Mason Invitational - Codebusters B (November 2025)", testLink: "https://drive.google.com/file/d/1VNoQwTPlomvv8ofGl8rTJDTsF3ZGuf_z/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1hbYBonE8VxImPJv-zf_zfWABbm7fcCV5/view?usp=drive_link" },
  { year: "2025", event: "Codebusters", title: "2026 Rickards Invitational - Codebusters C (November 2025)", testLink: "https://drive.google.com/file/d/1VUxtjg0rzphKXLlznQ-DW_isGjiWmCzX/view?usp=sharing", keyLink: "https://drive.google.com/file/d/1haa9uLTllx-aSVTVJYieCm6nDc0E9ugm/view?usp=drive_link" },
  { year: "2025", event: "Codebusters", title: "2025 SOUP Invitational - Codebusters C (February 2025)", testLink: "https://drive.google.com/file/d/1_0Xghzgv4RTn_v18UZJlJy8oZuuZg3df/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1Tqx6CZSxqc-pZKJZllPdzXA8dK9Ut_pc/view?usp=drive_link" },
  { year: "2025", event: "Codebusters", title: "2025 UMASO Invitational - Codebusters C (February 2025)", testLink: "https://drive.google.com/file/d/1FmXgJVQJ-BFwk74YVh64PtyccjNTyX6U/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1Eerro3XGb3QSaVnzZM5xBPWSPMvJb2sk/view?usp=drive_link" },
  { year: "2025", event: "Optics", title: "2025 CurdSO Invitational - Optics C (March 2025)", testLink: "https://drive.google.com/file/d/1BdugpG4qVidzS9MVTeYBC0sR49rMTT6C/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1TPQSaudDyy7ETOVuL3ypf0Qeotnq9uSc/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2024 Hawk and Hornet Invitational - Codebusters C (November 2024)", testLink: "https://drive.google.com/file/d/1wkJ3gLz04CRwx1mHNhEjLZFxgZn7IqJD/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1Qev_v87gstgK2N68VbDxoRyGeah7oJz0/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2025 Mason Invitational - Codebusters C (November 2024)", testLink: "https://drive.google.com/file/d/1GwPf37UkI1DnUIXoSB3TeZS8sCEGK5fn/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/16a4bo8qtW6N0nx6u4yXLVSHRI5NeCrAp/view?usp=drive_link" },
  { year: "2024", event: "Optics", title: "2025 Mason Invitational - Optics C (November 2024)", testLink: "https://drive.google.com/file/d/1k7UbWmKpd9x3aUk4QVnhLxBZX2s0z4xS/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1DMfv1PGza5C8uO_AKEPl_I0UuU5j8u84/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2024 Mason Tryouts - Codebusters C (July 2024)", testLink: "https://drive.google.com/file/d/1TX_TA7mQkljYdbFVurZjRWvyLD72zKEc/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/12cAnySEw0lenzQH4yaqxaPjqPy3x-q8d/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2025 Rickards Invitational - Codebusters C (November 2024)", testLink: "https://drive.google.com/file/d/1u2WANJSnx2Fy3iTO7d4OHXw-Mbz_jgsZ/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1gTZhOnXeBlLWG3jWQn0cjONa_mjDi0b8/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2025 Rickards Invitational - Codebusters B (November 2024)", testLink: "https://drive.google.com/file/d/10WgPS-8Bx3ZdHXvc24nsvpOdfzcAQf-X/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1sCIudcXGMhUVLFqqMXpmLq3lArda2iJR/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2024 Mason CSE - Codebusters C (June 2024)", privateRelease: true },
  { year: "2024", event: "Experimental Design", title: "2024 West-Liberty Salem Invitational - Experimental Design B (February 2024)", testLink: "https://drive.google.com/file/d/1XJzbGp_YUOQted8kzWQ59U1A9cCdiCc_/view?usp=drive_link" },
  { year: "2023", event: "Optics", title: "2023 GullSO Invitational - Optics C (December 2023)", testLink: "https://drive.google.com/file/d/1Uo8q4jHSHyBqifHWLKZbMou8YRcvfaNd/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1Bc2D3A3uoc5aJbTEOK68wWriWnlsVJeg/view?usp=drive_link" },
  { year: "2023", event: "Codebusters", title: "2024 Mason Invitational - Codebusters C (November 2023)", testLink: "https://drive.google.com/file/d/1ezPEFdklQl2Qam5bypgvC7KV163K3c3w/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/13N7IvKq2NqscmLrdFYw8Kp-PH7dVx4-a/view?usp=drive_link" },
  { year: "2023", event: "Optics", title: "2024 Mason Invitational - Optics C (November 2023)", testLink: "https://drive.google.com/file/d/1rBlNQTZG2c9-LSEmEWhoJA7SBNEUEoiL/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1c3wt5ui5FlTuEstkeoL_kLwvldiMZDnq/view?usp=drive_link" },
  { year: "2024", event: "Codebusters", title: "2024 OCSA Invitational - Codebusters B (March 2024)", testLink: "https://drive.google.com/file/d/1rYRKRz03zD8jCNzWnzawizWNBgko9vKy/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1ZJIbPjYnbnQnpw-vtsSpkpaKERDPS7WW/view?usp=drive_link" },
  { year: "2023", event: "Codebusters", title: "2024 Rickards Invitational - Codebusters C (November 2023)", testLink: "https://drive.google.com/file/d/1KUokVWVOKlhQjRXigrT6tEq52nXGxS4C/view?usp=drive_link", keyLink: "https://drive.google.com/file/d/1CwB-Q3x7CeQ7NqFmiPTEeQldm5crdCTe/view?usp=drive_link" },
  { year: "2023", event: "Experimental Design", title: "2024 Rickards Invitational - Experimental Design C (November 2023)", testLink: "https://docs.google.com/document/d/1lgrWCwfDcuL-Wn0e8EVCpBTkLsYRAedspwQ5RK1Nb9Y/edit?usp=drive_link" },
];

const years = ["All Years", "2026", "2025", "2024", "2023"];
const events = ["All Events", "Codebusters", "Optics", "Experimental Design", "Machines"];

/* A row of segmented pill buttons that behaves like a single-select filter. */
function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {options.map((opt) => {
        const on = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt)}
            className={`press rounded-md border px-2.5 py-1 font-mono text-[0.7rem] transition-colors ${
              on
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

const SciOlyTests = () => {
  const [yearFilter, setYearFilter] = useState("All Years");
  const [eventFilter, setEventFilter] = useState("All Events");
  const reduce = useReducedMotion();

  // Open at the top of the page, not wherever the portfolio was scrolled to.
  // Temporarily disable the global smooth scroll so it jumps to the top on
  // mount rather than animating up through the whole page.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, []);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const yearMatch = yearFilter === "All Years" || t.year === yearFilter;
      const eventMatch = eventFilter === "All Events" || t.event === eventFilter;
      return yearMatch && eventMatch;
    });
  }, [yearFilter, eventFilter]);

  return (
    <PageShell>
      <div className="mx-auto max-w-[60rem] px-6 pb-24 pt-28 md:pt-32">
        <motion.header
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Science Olympiad</p>
          <h1 className="display mt-4 text-4xl leading-[1.05] text-foreground md:text-5xl">Test bank</h1>
          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            I competed in Science Olympiad for six years, starting with the Mason Middle School team and continuing on
            the High School team for four years. In my senior year of High School, I was elected team captain and
            helped lead us to a 3rd place finish at the National Tournament.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            In College, I help give back to the community by volunteering through my school's alumni chapter (Science
            Olympiad @ Georgia Tech), as well as authoring/proctoring tests for various high-profile invitationals
            nationwide. In 2028, Georgia Tech will be hosting the Science Olympiad National Tournament!
          </p>
        </motion.header>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <ImgFigure
            src={sciOlyPhoto}
            alt="Mason High School at the 2025 Science Olympiad National Tournament"
            label="Fig. 1"
            note="photo"
            caption="Mason High School at the 2025 Science Olympiad National Tournament"
            loading="eager"
            imgClassName="object-cover"
            className="mt-12"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-border pb-5"
        >
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <PillGroup label="Year" options={years} value={yearFilter} onChange={setYearFilter} />
            <PillGroup label="Event" options={events} value={eventFilter} onChange={setEventFilter} />
          </div>
          <p className="readout text-xs text-muted-foreground" aria-live="polite">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Test list */}
        <ul className="divide-y divide-border">
          {filtered.map((test, i) => (
            <motion.li
              key={`${test.title}-${i}`}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.02 }}
              className="grid gap-x-6 gap-y-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                <h2 className="text-sm font-medium text-foreground">{test.title}</h2>
                <span className="tag">{test.event}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {test.privateRelease ? (
                  <span className="italic text-muted-foreground">Private release</span>
                ) : (
                  <>
                    {test.testLink && (
                      <a href={test.testLink} target="_blank" rel="noopener noreferrer" className="link-accent inline-flex items-center gap-1.5">
                        <FileText size={12} aria-hidden="true" /> Test
                      </a>
                    )}
                    {test.keyLink && (
                      <a href={test.keyLink} target="_blank" rel="noopener noreferrer" className="link-accent inline-flex items-center gap-1.5">
                        <ExternalLink size={12} aria-hidden="true" /> Key
                      </a>
                    )}
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
        {filtered.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">No tests match those filters.</p>
        ) : null}
      </div>
    </PageShell>
  );
};

export default SciOlyTests;
