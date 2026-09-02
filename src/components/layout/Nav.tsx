import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { profile } from "@/data/profile";

const links = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

/* One fixed header. Transparent over the top of the page, then a frosted
   hairline bar once the page scrolls. On the home page the active section
   is tracked so the current link carries the underline. */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      raf = null;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (raf === null) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Track the section whose top has passed 40% of the viewport. Hero
  // (no section) leaves every link unmarked.
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const ids = links.map((l) => l.href.split("#")[1]);
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (raf === null) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, [onHome, location.key]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300 ${scrolled || menuOpen ? "nav-material" : ""}`}>
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-6">
        <Link to="/" className="press flex items-baseline gap-2 font-serif text-lg font-medium tracking-tight text-foreground">
          {profile.name}
          <span className="hidden font-mono text-[0.6rem] font-normal uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            GT '28
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" aria-current={active === l.href.split("#")[1] ? "true" : undefined}>
              {l.label}
            </a>
          ))}
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-compact">
            <FileText size={13} /> Resume
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-compact">
            <FileText size={13} /> Resume
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="press inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="border-t border-border bg-background md:hidden"
          >
            <div className="mx-auto flex max-w-page flex-col px-6 py-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="press border-b border-border py-3.5 text-[0.95rem] text-foreground last:border-b-0"
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

export default Nav;
