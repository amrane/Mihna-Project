import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/lib/api-types";
import {
  Briefcase,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

function formatCurrency(value: number | undefined, period: string | undefined, notSpecified: string) {
  if (!value) return notSpecified;
  const suffix = period ? ` / ${period}` : "";
  return `${value.toLocaleString("fr-DZ")} DZD${suffix}`;
}

function contactHref(kind: string, value?: string) {
  if (!value) return undefined;
  if (kind === "email") return `mailto:${value}`;
  if (kind === "phone") return `tel:${value}`;
  if (kind === "whatsapp") return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
  if (kind === "telegram") return `https://t.me/${value.replace(/^@/, "")}`;
  return value;
}

export function TalentOfferCard({
  offer,
  compact = false,
}: {
  offer: Announcement;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const name = offer.authorName || t("common.candidate", "Candidate");
  const title = offer.professionalTitle || offer.title;
  const contacts = [
    { kind: "email", label: t("common.email", "Email"), value: offer.contactEmail, icon: Mail },
    { kind: "phone", label: t("common.phone", "Phone"), value: offer.contactPhone, icon: Phone },
    {
      kind: "whatsapp",
      label: t("common.whatsapp", "WhatsApp"),
      value: offer.contactWhatsapp,
      icon: MessageCircle,
    },
    {
      kind: "telegram",
      label: t("common.telegram", "Telegram"),
      value: offer.contactTelegram,
      icon: MessageCircle,
    },
  ].filter((contact) => contact.value);
  const skills = Array.isArray(offer.skills) ? offer.skills.slice(0, compact ? 4 : 8) : [];

  return (
    <article className="group rounded-2xl border bg-card p-5 transition hover:shadow-sm">
      <Link to="/announcement/$id" params={{ id: offer.id || "" }} className="block">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={offer.authorAvatar} />
            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-foreground">{title}</h3>
              {offer.workPreference && (
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                  {offer.workPreference}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{name}</p>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {offer.preferredLocation && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {offer.preferredLocation}
                </span>
              )}
              {offer.experienceLevel && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {offer.experienceLevel}
                </span>
              )}
              {offer.availability && (
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {offer.availability}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-xs font-medium text-muted-foreground">
          {formatCurrency(offer.expectedSalary, offer.salaryPeriod, t("common.notSpecified", "Not specified"))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {compact ? `${offer.content.slice(0, 140)}${offer.content.length > 140 ? "..." : ""}` : offer.content}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {offer.category || t("common.general", "General")}
        </span>
        {offer.yearsExperience ? (
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {t("talent.yearCount", "{count} year(s)", { count: offer.yearsExperience })}
          </span>
        ) : null}
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contactHref(contact.kind, contact.value)}
            target={contact.kind === "email" || contact.kind === "phone" ? undefined : "_blank"}
            rel={contact.kind === "email" || contact.kind === "phone" ? undefined : "noreferrer"}
            className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:border-brand/30 hover:text-brand"
          >
            <contact.icon className="h-3 w-3" />
            {contact.label}
          </a>
        ))}
        {offer.portfolioUrl && (
          <a
            href={offer.portfolioUrl.startsWith("http") ? offer.portfolioUrl : `https://${offer.portfolioUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:border-brand/30 hover:text-brand"
          >
            <Globe2 className="h-3 w-3" />
            {t("common.portfolio", "Portfolio")}
          </a>
        )}
      </div>
      </Link>
    </article>
  );
}
