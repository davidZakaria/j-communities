import { Link } from "react-router-dom";
import { COPY } from "../content/siteCopy";
import { LF, LF_TYPE } from "../config/lookFeel";
import { GrowSection } from "./GrowSection";

export function Footer() {
  const { wordmarkPadT } = LF.footer;
  const { footer: f } = COPY;

  return (
    <footer
      id="footer-contact"
      className="w-full border-t border-j-charcoal/10 bg-j-footer px-6 py-12 text-j-charcoal sm:px-8 md:px-12 lg:px-16 xl:pb-12 xl:pl-20 xl:pr-20 xl:pt-[4.5rem]"
    >
      <div className="mb-14 grid w-full grid-cols-12 gap-10 lg:gap-12">
        <div className="col-span-12 lg:col-span-4">
          <GrowSection>
            <p className={`${LF_TYPE.footerJourney}`}>{f.journey}</p>
          </GrowSection>
        </div>
        <div className="col-span-12 grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8">
          <GrowSection>
            <div>
              <h3 className={`mb-5 text-j-slate ${LF_TYPE.footerColTitle}`}>{f.quickLinks}</h3>
              <ul className={`space-y-3 ${LF_TYPE.footerLink}`}>
                {f.quickItems.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="border-b border-transparent hover:border-j-charcoal">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </GrowSection>
          <GrowSection>
            <div>
              <h3 className={`mb-5 text-j-slate ${LF_TYPE.footerColTitle}`}>{f.social}</h3>
              <ul className={`space-y-3 ${LF_TYPE.footerLink}`}>
                {f.socialItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="border-b border-transparent hover:border-j-charcoal"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </GrowSection>
          <GrowSection>
            <div>
              <h3 className={`mb-5 text-j-slate ${LF_TYPE.footerColTitle}`}>{f.contact}</h3>
              <div className={LF_TYPE.footerLink}>
                <a
                  href={`mailto:${f.email}`}
                  className="inline-block border-b border-transparent hover:border-j-charcoal"
                >
                  {f.email.toUpperCase()}
                </a>
              </div>
            </div>
          </GrowSection>
        </div>
      </div>

      <div className="flex w-full justify-center" style={{ paddingTop: wordmarkPadT }}>
        <GrowSection className="j-footer-wordmark-grow w-full">
          <p
            className={`mx-auto block w-full select-none text-center text-balance text-j-muted ${LF_TYPE.footerWordmark}`}
            aria-label="J Communities wordmark"
          >
            J COMMUNITIES
          </p>
        </GrowSection>
      </div>

      <div
        className={`mt-10 flex w-full flex-col items-center justify-between gap-4 border-t border-j-charcoal/15 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-6 sm:flex-row ${LF_TYPE.footerLegal}`}
      >
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a href="#" className="border-b border-transparent hover:border-j-slate">
            {f.terms}
          </a>
          <span aria-hidden className="text-j-slate/60">
            |
          </span>
          <a href="#" className="border-b border-transparent hover:border-j-slate">
            {f.privacy}
          </a>
        </p>
        <p className="text-center sm:text-right">{f.copyright}</p>
      </div>
    </footer>
  );
}
