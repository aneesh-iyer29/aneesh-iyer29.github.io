import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

interface TestItem {
  year: string;
  event: string;
  title: string;
  testLink?: string;
  keyLink?: string;
  privateRelease?: boolean;
}

const tests: TestItem[] = [
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

const years = ["All Years", "2025", "2024", "2023"];
const events = ["All Events", "Codebusters", "Optics", "Experimental Design"];

const SciOlyTests = () => {
  const [yearFilter, setYearFilter] = useState("All Years");
  const [eventFilter, setEventFilter] = useState("All Events");

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const yearMatch = yearFilter === "All Years" || t.year === yearFilter;
      const eventMatch = eventFilter === "All Events" || t.event === eventFilter;
      return yearMatch && eventMatch;
    });
  }, [yearFilter, eventFilter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={15} /> Back to portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label mb-3">Science Olympiad</p>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Test Bank</h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            I competed in Science Olympiad for six years, starting with the Mason Middle School team and continuing on the High School team for four years. In my senior year, I was elected team captain and helped lead us to a 3rd place finish at the National Tournament.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            I specialized in events such as Codebusters (cryptography), Optics, Experimental Design, and Bungee Drop. Below is a comprehensive bank of tests I've written for invitational tournaments.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {events.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground self-center font-mono">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Test list */}
        <div className="space-y-3">
          {filtered.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="card-surface-hover p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{test.title}</h3>
                <span className="tag-accent text-[10px] mt-1.5 inline-block">{test.event}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {test.privateRelease ? (
                  <span className="text-xs text-muted-foreground italic">Private Release</span>
                ) : (
                  <>
                    {test.testLink && (
                      <a
                        href={test.testLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <FileText size={13} /> Test
                      </a>
                    )}
                    {test.keyLink && (
                      <a
                        href={test.keyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={13} /> Key
                      </a>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aneesh Iyer
          </p>
        </div>
      </div>
    </div>
  );
};

export default SciOlyTests;
