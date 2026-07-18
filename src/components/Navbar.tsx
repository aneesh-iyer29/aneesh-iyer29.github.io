import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const links = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

const RESUME_URL = "/resume.pdf";

/* One fixed header: transparent over the hero, condensing into a floating
   glass capsule once the page scrolls, so content passes underneath it. */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      setScrolled(window.scrollY > 16);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const capsule = scrolled || menuOpen;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto max-w-5xl transition-all duration-300 ease-out ${
          capsule ? "mt-3 rounded-full nav-capsule px-5" : "mt-0 rounded-none border border-transparent px-1"
        }`}
      >
        <div className="h-14 flex items-center justify-between">
          <a href="/#" className="press font-serif font-semibold text-lg text-foreground tracking-tight">
            Aneesh Iyer
            <span className="ml-2 font-mono text-[0.6rem] font-normal uppercase tracking-[0.18em] text-accent align-middle hidden sm:inline">
              GT '28
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link text-sm transition-colors duration-200 ${
                  capsule ? "text-muted-foreground hover:text-foreground" : "text-foreground/75 hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass btn-compact text-sm"
            >
              <FileText size={14} /> Resume
            </a>
          </nav>

          {/* Mobile: resume + menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass btn-compact text-sm"
            >
              <FileText size={14} /> Resume
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="press inline-flex h-9 w-9 items-center justify-center rounded-full glass text-foreground"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: a glass sheet that materializes below the capsule. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            style={{ transformOrigin: "top right" }}
            className="md:hidden mx-auto max-w-5xl mt-2 rounded-3xl nav-sheet overflow-hidden"
          >
            <div className="px-6 py-2 flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="press py-3.5 text-[0.95rem] text-foreground/85 hover:text-foreground border-b border-foreground/10 last:border-b-0 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
