import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projects } from "@/data/projects";

const links = [
  { label: "About", section: "about" },
  { label: "Skills", section: "skills" },
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
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollToSection("hero")} className="text-lg font-serif text-foreground">
          <span className="font-bold">Aneesh</span> Iyer
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            (l as any).isRoute ? (
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
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 outline-none">
              Projects <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {projects.map((project) => (
                <DropdownMenuItem key={project.slug} asChild>
                  <Link to={`/projects/${project.slug}`} state={{ background: location }}>
                    {project.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            href="/Aneesh_Iyer_Resume.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <FileText size={14} /> Resume
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
