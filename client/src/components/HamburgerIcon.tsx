interface HamburgerIconProps {
  open: boolean;
  className?: string;
}

export function HamburgerIcon({ open, className = "" }: HamburgerIconProps) {
  return (
    <span
      className={`j-hamburger ${open ? "j-hamburger--open" : ""} ${className}`.trim()}
      aria-hidden
    >
      <span />
      <span />
      <span />
    </span>
  );
}
