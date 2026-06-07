import { useState, type FormEvent } from "react";
import type { ProjectContactSection } from "../../content/projects/types";

export function ProjectContactForm({ section }: { section: ProjectContactSection }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const message = String(fd.get("message") ?? "");
    const subject = encodeURIComponent(section.title);
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\n${message}`);
    window.location.href = `mailto:${section.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id={section.id} className="project-surface border-t border-[var(--project-border)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-xl">
        <h2 className="project-heading text-center text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase tracking-[0.06em]">
          {section.title}
        </h2>
        {section.subtitle ? (
          <p className="project-body-font project-text-muted mt-3 text-center text-sm">{section.subtitle}</p>
        ) : null}

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]">
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              className="project-body-font w-full border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)]"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]">
              Phone number
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              className="project-body-font w-full border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)]"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]">
              Your message (optional)
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              className="project-body-font w-full resize-y border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)]"
            />
          </div>
          <button
            type="submit"
            className="project-btn-primary project-body-font w-full min-h-[48px] border text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
          >
            Send inquiry
          </button>
        </form>

        {sent ? (
          <p className="project-body-font project-text-muted mt-4 text-center text-xs">
            Your email app should open with your message ready to send.
          </p>
        ) : null}

        <p className="mt-6 text-center">
          <a href={`mailto:${section.email}`} className="project-body-font text-[11px] uppercase tracking-[0.14em] text-[var(--project-accent)] hover:underline">
            {section.email}
          </a>
        </p>
      </div>
    </section>
  );
}
