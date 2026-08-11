import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { leadsApi } from "../../config/leads";
import { submitProjectLead } from "../../config/submitProjectLead";
import type { ProjectThemeId } from "../../data/projects";

type SubmitState = "idle" | "submitting" | "success" | "error";

const OPEN_DELAY_MS = 1400;

function storageKey(slug: string) {
  return `jc-lead-popup:${slug}`;
}

function wasDismissed(slug: string): boolean {
  try {
    return Boolean(sessionStorage.getItem(storageKey(slug)));
  } catch {
    return false;
  }
}

function markDismissed(slug: string) {
  try {
    sessionStorage.setItem(storageKey(slug), "1");
  } catch {
    /* ignore quota / private mode */
  }
}

interface ProjectLeadPopupProps {
  projectName: string;
  projectSlug: string;
  themeId: ProjectThemeId;
}

export function ProjectLeadPopup({ projectName, projectSlug, themeId }: ProjectLeadPopupProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (wasDismissed(projectSlug)) return;

    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [projectSlug]);

  function close() {
    markDismissed(projectSlug);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 50);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        markDismissed(projectSlug);
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, projectSlug]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const honeypot = String(fd.get(leadsApi.honeypotField) ?? "");

    setState("submitting");
    setErrorMessage(null);

    try {
      await submitProjectLead({
        name,
        phone,
        projectName,
        projectSlug,
        themeId,
        source: "popup",
        honeypot,
      });
      form.reset();
      setState("success");
      markDismissed(projectSlug);
      window.setTimeout(() => setOpen(false), 1600);
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={close}
      />

      <div className="project-surface relative z-[1] w-full max-w-md border border-[var(--project-border)] px-6 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={close}
          className="project-body-font absolute right-3 top-3 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--project-muted)] transition-colors hover:text-[var(--project-text)]"
          aria-label="Close"
        >
          ✕
        </button>

        {state === "success" ? (
          <p className="project-body-font py-6 text-center text-sm text-[var(--project-text)]" role="status">
            Thank you — we will call you shortly.
          </p>
        ) : (
          <>
            <p className="project-body-font text-[10px] uppercase tracking-[0.18em] text-[var(--project-muted)]">
              {projectName}
            </p>
            <h2
              id={titleId}
              className="project-heading mt-2 text-[clamp(1.25rem,3vw,1.65rem)] font-medium uppercase tracking-[0.06em] text-[var(--project-text)]"
            >
              Request a callback
            </h2>
            <p className="project-body-font project-text-muted mt-2 text-sm leading-relaxed">
              Leave your name and phone number and our team will get in touch.
            </p>

            <form className="relative mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="lead-popup-gotcha">Company</label>
                <input
                  id="lead-popup-gotcha"
                  type="text"
                  name={leadsApi.honeypotField}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="lead-popup-name"
                  className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]"
                >
                  Your name
                </label>
                <input
                  ref={nameRef}
                  id="lead-popup-name"
                  name="name"
                  required
                  autoComplete="name"
                  disabled={state === "submitting"}
                  className="project-body-font w-full border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60"
                />
              </div>
              <div>
                <label
                  htmlFor="lead-popup-phone"
                  className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]"
                >
                  Phone number
                </label>
                <input
                  id="lead-popup-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  disabled={state === "submitting"}
                  className="project-body-font w-full border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={state === "submitting"}
                className="project-btn-primary project-body-font w-full min-h-[48px] border text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors disabled:opacity-60"
              >
                {state === "submitting" ? "Sending…" : "Call me back"}
              </button>

              <button
                type="button"
                onClick={close}
                className="project-body-font mx-auto block text-[10px] uppercase tracking-[0.14em] text-[var(--project-muted)] transition-colors hover:text-[var(--project-text)]"
              >
                Maybe later
              </button>
            </form>

            {state === "error" && errorMessage ? (
              <p className="project-body-font mt-3 text-center text-xs text-red-700" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
