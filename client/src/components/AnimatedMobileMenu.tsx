import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { HamburgerIcon } from "./HamburgerIcon";

export interface MobileNavItem {
  label: string;
  to?: string;
  href?: string;
}

interface AnimatedMobileMenuProps {
  items: MobileNavItem[];
  variant: "hero" | "project";
  className?: string;
  ariaLabel?: string;
  /** Portal overlay to document.body (recommended on hero / overflow-hidden sections). */
  usePortal?: boolean;
}

function NavItemLink({
  item,
  className,
  style,
  onNavigate,
}: {
  item: MobileNavItem;
  className: string;
  style?: React.CSSProperties;
  onNavigate: () => void;
}) {
  if (item.to) {
    return (
      <Link to={item.to} className={className} style={style} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className} style={style} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

function MobileNavOverlay({
  id,
  open,
  variant,
  items,
  ariaLabel,
  onClose,
}: {
  id: string;
  open: boolean;
  variant: "hero" | "project";
  items: MobileNavItem[];
  ariaLabel: string;
  onClose: () => void;
}) {
  return (
    <div
      id={id}
      className={`j-mobile-nav-overlay j-mobile-nav-overlay--${variant}${open ? " j-mobile-nav-overlay--open" : ""}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="j-mobile-nav-backdrop"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <nav className="j-mobile-nav-panel" aria-label={ariaLabel}>
        <ul className="j-mobile-nav-list">
          {items.map((item, index) => (
            <li key={item.label} className="j-mobile-nav-item">
              <NavItemLink
                item={item}
                className="j-mobile-nav-link"
                style={{ ["--j-nav-stagger" as string]: `${0.07 + index * 0.055}s` }}
                onNavigate={onClose}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function AnimatedMobileMenu({
  items,
  variant,
  className = "",
  ariaLabel = "Mobile navigation",
  usePortal = false,
}: AnimatedMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const panelId = `${menuId}-panel`;

  const close = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const overlay = (
    <MobileNavOverlay
      id={panelId}
      open={open}
      variant={variant}
      items={items}
      ariaLabel={ariaLabel}
      onClose={close}
    />
  );

  const triggerClass =
    variant === "hero"
      ? "j-mobile-nav-trigger j-mobile-nav-trigger--hero text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]"
      : "j-mobile-nav-trigger j-mobile-nav-trigger--project text-[var(--project-text)]";

  return (
    <div className={`relative shrink-0 ${className}`.trim()}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <HamburgerIcon open={open} />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {usePortal ? createPortal(overlay, document.body) : overlay}
    </div>
  );
}
