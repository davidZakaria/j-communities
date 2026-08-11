import { useEffect, useRef, useState, type FormEvent } from "react";
import { readLeadHoneypots, submitProjectLead } from "../../config/submitProjectLead";
import { LeadFormHoneypots } from "./LeadFormHoneypots";
import type { ProjectThemeId } from "../../data/projects";
import type { ProjectContactSection } from "../../content/projects/types";

type SubmitState = "idle" | "submitting" | "success" | "error";

const MIN_SUBMIT_MS = 2500;

interface ProjectContactFormProps {
  section: ProjectContactSection;
  projectName: string;
  projectSlug: string;
  themeId: ProjectThemeId;
}

export function ProjectContactForm({ section, projectName, projectSlug, themeId }: ProjectContactFormProps) {
  const formReadyAtRef = useRef(Date.now());
  const [canSubmit, setCanSubmit] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    formReadyAtRef.current = Date.now();
    setCanSubmit(false);
    const timer = window.setTimeout(() => setCanSubmit(true), MIN_SUBMIT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const message = String(fd.get("message") ?? "");

    setState("submitting");
    setErrorMessage(null);

    try {
      await submitProjectLead({
        name,
        phone,
        message,
        projectName,
        projectSlug,
        themeId,
        source: "contact",
        formReadyAt: formReadyAtRef.current,
        honeypots: readLeadHoneypots(form),
      });
      form.reset();
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again or email us.");
    }
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

        {state === "success" ? (
          <p className="project-body-font mt-10 text-center text-sm text-[var(--project-text)]" role="status">
            Thank you — your inquiry was sent. We will be in touch shortly.
          </p>
        ) : (
          <form className="relative mt-10 space-y-5" onSubmit={handleSubmit} noValidate>
            <LeadFormHoneypots />

            <div>
              <label htmlFor="contact-name" className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]">
                Your name
              </label>
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                disabled={state === "submitting"}
                className="project-body-font w-full border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60"
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
                autoComplete="tel"
                disabled={state === "submitting"}
                className="project-body-font w-full border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60"
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
                disabled={state === "submitting"}
                className="project-body-font w-full resize-y border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={state === "submitting" || !canSubmit}
              className="project-btn-primary project-body-font w-full min-h-[48px] border text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors disabled:opacity-60"
            >
              {state === "submitting" ? "Sending…" : "Send inquiry"}
            </button>
          </form>
        )}

        {state === "error" && errorMessage ? (
          <p className="project-body-font mt-4 text-center text-xs text-red-700" role="alert">
            {errorMessage}
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
