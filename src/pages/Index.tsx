import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import PageBackdrop from "@/components/PageBackdrop";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

const Index = () => {
  // Anchor targets don't exist until React mounts, so honor an incoming
  // #section hash (e.g. arriving from another page) after first render.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="min-h-screen">
      <PageBackdrop />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>
    </div>
  );
};

export default Index;
