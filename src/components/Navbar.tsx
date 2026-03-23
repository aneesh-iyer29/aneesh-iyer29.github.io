import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
  { label: "SciOly Tests", href: "/scioly-tests", isRoute: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-lg font-serif text-foreground">
          <span className="font-bold">Aneesh</span> Iyer
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            (l as any).isRoute ? (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </a>
            )
          )}
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
