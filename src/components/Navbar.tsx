import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { label: "About", section: "about" },
  { label: "Experience", section: "experience" },
  { label: "Work", section: "work" },
  { label: "Contact", section: "contact" },
  { label: "SciOly Tests", href: "/scioly-tests", isRoute: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const rafIdRef = useRef<number | null>(null);
  const lastScrolledRef = useRef<boolean>(false);

  useEffect(() => {
    const update = () => {
      rafIdRef.current = null;
      const next = window.scrollY > 50;
      if (next !== lastScrolledRef.current) {
        lastScrolledRef.current = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(update);
    };

    // Initialize once on mount (e.g. if page reloads mid-scroll).
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => scrollToSection("hero")}
          className="font-serif font-semibold text-lg text-foreground tracking-tight"
        >
          Aneesh Iyer
          <span className="ml-2 font-mono text-[0.6rem] font-normal uppercase tracking-[0.18em] text-accent align-middle hidden sm:inline">
            GT '28
          </span>
        </button>

        {/* Mobile: only show Resume */}
        <a
          href="https://raw.githubusercontent.com/aneesh-iyer29/resume/main/Aneesh_Iyer_Resume.pdf"
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </Link>
            ) : (
              <button
                key={l.section}
                onClick={() => scrollToSection(l.section!)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </button>
            )
          )}
          <a
            href="https://raw.githubusercontent.com/aneesh-iyer29/resume/main/Aneesh_Iyer_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <FileText size={14} /> Resume
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
