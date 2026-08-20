import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { IntroSection } from "../components/IntroSection";
import { LifestyleBanner } from "../components/LifestyleBanner";
import { LookFeelCanvas } from "../components/LookFeelCanvas";
import { NewsTeaser } from "../components/NewsTeaser";
import { Pillars } from "../components/Pillars";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { ValueProp } from "../components/ValueProp";

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
        <NewsTeaser />
        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
