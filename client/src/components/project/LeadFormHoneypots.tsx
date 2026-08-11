import { leadsApi } from "../../config/leads";

/** Hidden fields bots often fill; must stay empty for a valid submission. */
export function LeadFormHoneypots() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      {leadsApi.honeypotFields.map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          readOnly
          defaultValue=""
        />
      ))}
    </div>
  );
}
