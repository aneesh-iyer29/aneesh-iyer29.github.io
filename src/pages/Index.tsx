import { useEffect } from "react";
import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/home/Hero";
import Work from "@/components/home/Work";
import Experience from "@/components/home/Experience";
import About from "@/components/home/About";
import Community from "@/components/home/Community";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";

const Index = () => {
  // Anchor targets don't exist until React mounts, so honor an incoming
  // #section hash (e.g. arriving from another page) after first render.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <PageShell>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Community />
      <Skills />
      <Contact />
    </PageShell>
  );
};

export default Index;
