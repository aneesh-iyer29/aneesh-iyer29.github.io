import Navbar from "@/components/Navbar";
import { BlueprintGrid, FieldParticles, PageComets, AltitudeReadout } from "@/components/decor";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Ambient layers: blueprint grid, dust motes, and passing meteors. */}
      <BlueprintGrid />
      <FieldParticles />
      <PageComets />
      <AltitudeReadout />
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
  );
};

export default Index;
