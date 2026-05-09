import { Hero } from "../components/Hero";
import { IntroSection } from "../components/IntroSection";
import { LifestyleBanner } from "../components/LifestyleBanner";
import { Pillars } from "../components/Pillars";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { ValueProp } from "../components/ValueProp";
import { Footer } from "../components/Footer";
import { LookFeelCanvas } from "../components/LookFeelCanvas";

export function HomePage() {
  return (
    <main id="main-content" className="lf-canvas-clip bg-j-black">
      <LookFeelCanvas>
        <Hero />
        <IntroSection />
        <LifestyleBanner />
        <Pillars />
        <ValueProp />
        <ProjectsGrid />
        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
