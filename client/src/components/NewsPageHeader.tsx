import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function NewsPageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-j-charcoal/10 bg-j-offwhite/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-5 py-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <Link to="/" className="shrink-0" aria-label="J Communities home">
          <Logo variant="dark" heightClass="h-8 sm:h-9" />
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6" aria-label="News navigation">
          <Link
            to="/news"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-j-charcoal hover:text-j-slate"
          >
            News
          </Link>
          <Link
            to="/"
            className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-j-slate hover:text-j-charcoal"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
