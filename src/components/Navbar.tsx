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

/* One fixed header: transparent over the hero, gaining a translucent
   material once the page scrolls, so content passes underneath it. */
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

  const withMaterial = scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        withMaterial ? "nav-material" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
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
                scrolled ? "text-muted-foreground hover:text-foreground" : "text-foreground/75 hover:text-foreground"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:bg-secondary transition-colors"
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
            className="press inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-border text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <FileText size={14} /> Resume
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="press inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary transition-colors"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu: a translucent sheet that materializes from the bar. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="md:hidden nav-material border-t-0"
          >
            <div className="px-6 pb-5 pt-1 flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="press py-3 text-[0.95rem] text-foreground/85 hover:text-foreground border-b border-border/60 last:border-b-0 transition-colors"
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
