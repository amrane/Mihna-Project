import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8 items-start">
        <div className="md:col-span-1">
          <BrandLogo className="text-3xl text-brand-foreground" />
          <p className="mt-1 text-sm opacity-80">
            {t("footer.tagline", "Connecting talent with opportunity, one role at a time.")}
          </p>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold mt-0">{t("footer.candidates", "For candidates")}</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <Link to="/search">{t("footer.browseJobs", "Browse jobs")}</Link>
            </li>
            <li>
              <Link to="/post-announcement">{t("footer.createOffer", "Create talent offer")}</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold mt-0">{t("footer.employers", "For employers")}</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <Link to="/post-job">{t("footer.postJob", "Post a job")}</Link>
            </li>
            <li>
              <Link to="/">{t("footer.browseOffers", "Browse talent offers")}</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold mt-0">{t("footer.about", "About")}</div>
          <p className="mb-3 text-sm leading-relaxed opacity-80">
            {t("footer.about.desc", "Mihna is an Algerian job platform connecting talent with opportunity across freelance, full-time, and contract roles.")}
          </p>
          <ul className="space-y-2 text-sm opacity-80">
            <li>{t("footer.privacy", "Privacy")}</li>
          </ul>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <div className="mb-3 text-sm font-semibold mt-0 w-full text-start">{t("footer.contact", "Contact")}</div>
          <ul className="space-y-3 text-sm opacity-80">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span>lounesamrane88@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span>+213 (6) 97 28 30 39</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-70">
        &copy; {new Date().getFullYear()} Mihna. {t("footer.rights", "All rights reserved.")}
      </div>
    </footer>
  );
}
