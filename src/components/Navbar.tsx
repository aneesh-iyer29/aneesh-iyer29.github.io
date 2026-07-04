import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { label: "About", section: "about" },
  { label: "Experience", section: "experience" },
  { label: "Projects", section: "projects" },
  { label: "Contact", section: "contact" },
  { label: "SciOly Tests", href: "/scioly-tests", isRoute: true },
];

const RESUME_URL = "https://raw.githubusercontent.com/aneesh-iyer29/resume/main/Aneesh_Iyer_Resume.pdf";

/* The inner bar, shared by the transparent hero nav and the solid sticky nav. */
function NavBarInner({ overHero }: { overHero: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const go = () => {
      // Contact is the final full-height section; scroll to the true page
      // bottom so the whole footer (and the rocket touchdown) is in view.
      if (sectionId === "contact") {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(go, 100);
    } else {
      go();
    }
  };

  const linkColor = overHero ? "text-foreground/75 hover:text-foreground" : "text-muted-foreground hover:text-foreground";

  return (
    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="font-serif font-semibold text-lg text-foreground tracking-tight"
      >
        Aneesh Iyer
        <span className="ml-2 font-mono text-[0.6rem] font-normal uppercase tracking-[0.18em] text-accent align-middle hidden sm:inline">
          GT '28
        </span>
      </button>

      {/* Mobile: only show Resume */}
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded border border-border text-sm text-foreground hover:bg-secondary transition-colors"
      >
        <FileText size={14} /> Resume
      </a>

      <div className="hidden md:flex items-center gap-7">
        {links.map((l) =>
          l.isRoute ? (
            <Link
              key={l.href}
              to={l.href!}
              className={`nav-link text-sm transition-colors duration-200 ${linkColor}`}
            >
              {l.label}
            </Link>
          ) : (
            <button
              key={l.section}
              onClick={() => scrollToSection(l.section!)}
              className={`nav-link text-sm transition-colors duration-200 ${linkColor}`}
            >
              {l.label}
            </button>
          )
        )}
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <FileText size={14} /> Resume
        </a>
      </div>
    </div>
  );
}

/* Transpira-style nav: a transparent bar sits over the hero and scrolls away
   with the page; once the hero is passed, a solid blurred bar slides down.
   The sticky bar stays mounted so it can transition out smoothly too. */
const Navbar = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const hero = document.getElementById("hero");
      const threshold = hero ? hero.offsetHeight - 90 : window.innerHeight - 110;
      setShowSticky(window.scrollY > threshold);
      // Once the footer reaches the bar, the solid chrome melts away again.
      const contact = document.getElementById("contact");
      setOverFooter(contact ? contact.getBoundingClientRect().top <= 72 : false);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <header className="absolute top-0 inset-x-0 z-40 bg-transparent">
        <NavBarInner overHero />
      </header>
      <header
        className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ease-out will-change-transform ${
          showSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        } ${
          overFooter
            ? "bg-transparent border-transparent"
            : "bg-background/85 backdrop-blur-xl border-border"
        }`}
        aria-hidden={showSticky ? undefined : true}
      >
        <NavBarInner overHero={overFooter} />
      </header>
    </>
  );
};

export default Navbar;
