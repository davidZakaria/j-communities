import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-j-black/5 bg-j-offwhite/90 backdrop-blur-md md:border-b-0 md:bg-transparent md:backdrop-blur-none">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10 md:py-6">
        <Link to="/" className="-m-[var(--logo-clear-min)] focus:outline-none focus-visible:ring-2 focus-visible:ring-j-sky">
          <Logo variant="dark" />
        </Link>
      </div>
    </header>
  );
}
