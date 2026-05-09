import { useEffect } from "react";
import { Link } from "react-router-dom";
import { site } from "../config/site";
import { Footer } from "../components/Footer";
import { GrowSection } from "../components/GrowSection";
import { LookFeelCanvas } from "../components/LookFeelCanvas";

export function NotFoundPage() {
  useEffect(() => {
    document.title = `Page not found · ${site.defaultTitle}`;
    return () => {
      document.title = site.defaultTitle;
    };
  }, []);

  return (
    <main id="main-content" className="lf-canvas-clip bg-j-black">
      <LookFeelCanvas>
        <section className="flex min-h-[60vh] min-h-[60dvh] flex-col items-center justify-center border-b border-j-charcoal/15 bg-j-offwhite px-5 py-12 text-center text-j-charcoal sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <GrowSection>
            <h1 className="font-serif text-[clamp(2rem,10vw,2.25rem)] font-medium tracking-wide sm:text-4xl">
              404
            </h1>
            <p className="mt-4 max-w-md text-j-slate">This page does not exist or has moved.</p>
            <Link
              to="/"
              className="mt-10 inline-block border-b border-j-charcoal font-medium text-j-charcoal hover:border-j-slate hover:text-j-slate"
            >
              Return home
            </Link>
          </GrowSection>
        </section>
        <Footer />
      </LookFeelCanvas>
    </main>
  );
}
