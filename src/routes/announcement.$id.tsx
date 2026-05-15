import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  DollarSign,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Tag,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { announcementService } from "@/lib/firestore-service";
import type { Announcement } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/announcement/$id")({
  component: AnnouncementDetail,
});

function AnnouncementDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, tt } = useI18n();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setMissing(false);
      try {
        const data = await announcementService.getById(id);
        if (!active) return;
        if (!data) {
          setMissing(true);
          setAnnouncement(null);
          return;
        }
        setAnnouncement(data);
      } catch (error) {
        console.error("Failed to load announcement:", error);
        if (!active) return;
        setMissing(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground sm:px-6 lg:px-8">
          {t("common.loading", "Loading...")}
        </main>
        <Footer />
      </div>
    );
  }

  if (missing || !announcement) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{t("announcement.notFound.title", "Announcement not found")}</h1>
          <p className="mt-3 text-muted-foreground">
            {t("announcement.notFound.desc", "This talent offer may have been removed or is no longer available.")}
          </p>
          <Link to="/" className="mt-6 text-brand">
            {t("announcement.backToHome", "Back to home")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const name = announcement.authorName || t("common.candidate", "Candidate");
  const title = announcement.professionalTitle || announcement.title;
  const contacts = [
    { kind: "email", label: t("common.email", "Email"), value: announcement.contactEmail, icon: Mail },
    { kind: "phone", label: t("common.phone", "Phone"), value: announcement.contactPhone, icon: Phone },
    { kind: "whatsapp", label: t("common.whatsapp", "WhatsApp"), value: announcement.contactWhatsapp, icon: MessageCircle },
    { kind: "telegram", label: t("common.telegram", "Telegram"), value: announcement.contactTelegram, icon: MessageCircle },
  ].filter((c) => c.value);
  const skills = announcement.skills || [];

  const contactHref = (kind: string, value?: string) => {
    if (!value) return undefined;
    if (kind === "email") return `mailto:${value}`;
    if (kind === "phone") return `tel:${value}`;
    if (kind === "whatsapp") return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
    if (kind === "telegram") return `https://t.me/${value.replace(/^@/, "")}`;
    return value;
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Link to="/profile" search={{ userId: announcement.authorId }} className="shrink-0">
                <Avatar className="h-16 w-16 transition hover:opacity-80">
                  <AvatarImage src={announcement.authorAvatar} />
                  <AvatarFallback className="text-lg">{name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold truncate">{title}</h1>
                  {announcement.workPreference && (
                    <Badge variant="secondary" className="rounded-full bg-brand/10 text-brand hover:bg-brand/20">
                      {tt(announcement.workPreference)}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-brand" />
                  <Link to="/profile" search={{ userId: announcement.authorId }} className="font-medium text-foreground hover:text-brand transition-colors">
                    {name}
                  </Link>
                  {announcement.authorRole && (
                    <>
                      <span className="text-border">|</span>
                      <span>{announcement.authorRole}</span>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/" })}
                className="rounded-xl shrink-0"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                {t("announcement.back", "Back")}
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {announcement.location && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {announcement.location}
                </span>
              )}
              {announcement.category && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {tt(announcement.category)}
                </span>
              )}
              {announcement.experienceLevel && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {tt(announcement.experienceLevel)}
                </span>
              )}
              {announcement.yearsExperience ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {t("talent.yearCount", "{count} year(s)", { count: announcement.yearsExperience })}
                </span>
              ) : null}
              {announcement.availability && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {tt(announcement.availability)}
                </span>
              )}
              {(announcement.salaryMin || announcement.expectedSalary) && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  {announcement.salaryMin
                    ? `${announcement.salaryMin.toLocaleString("fr-DZ")}${announcement.salaryMax ? ` - ${announcement.salaryMax.toLocaleString("fr-DZ")}` : ""} DZD`
                    : `${announcement.expectedSalary?.toLocaleString("fr-DZ")} DZD`}
                  {announcement.salaryPeriod ? ` / ${announcement.salaryPeriod}` : ""}
                </span>
              )}
            </div>

            <h2 className="mt-8 text-lg font-bold">{t("announcement.description", "About")}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {announcement.content}
            </p>

            {skills.length > 0 && (
              <>
                <h2 className="mt-8 text-lg font-bold">{t("job.skills", "Professional skills")}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-md border-brand-soft bg-brand-soft text-brand">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            {announcement.tags && announcement.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-5">
                <span className="text-sm font-semibold">{t("job.tags", "Tags:")}</span>
                {announcement.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-md border-slate-200 bg-slate-50 text-slate-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-brand-soft/60 p-6">
            <h3 className="font-bold">{t("announcement.overview", "Overview")}</h3>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                { icon: Briefcase, label: t("postAnnouncement.workType", "Work Type"), value: tt(announcement.workPreference || "") },
                { icon: Tag, label: t("common.category", "Category"), value: tt(announcement.category || "") },
                { icon: GraduationCap, label: t("postAnnouncement.experienceLevel", "Experience"), value: tt(announcement.experienceLevel || "") },
                { icon: MapPin, label: t("common.location", "Location"), value: announcement.location || t("common.notSpecified", "Not specified") },
                { icon: DollarSign, label: t("common.salary", "Salary"), value: announcement.salaryMin
                  ? `${announcement.salaryMin.toLocaleString("fr-DZ")}${announcement.salaryMax ? ` - ${announcement.salaryMax.toLocaleString("fr-DZ")}` : ""} DZD${announcement.salaryPeriod ? ` / ${announcement.salaryPeriod}` : ""}`
                  : t("common.notSpecified", "Not specified")
                },
                { icon: Clock, label: t("postAnnouncement.availability", "Availability"), value: tt(announcement.availability || "") },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-brand-soft/60 p-6">
            <h3 className="font-bold">{t("announcement.contact", "Contact")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("announcement.contactDesc", "Reach out to the candidate directly.")}
            </p>
            <div className="mt-4 space-y-3">
              {contacts.length > 0 ? contacts.map((contact) => (
                <a
                  key={contact.kind}
                  href={contactHref(contact.kind, contact.value)}
                  target={contact.kind === "email" || contact.kind === "phone" ? undefined : "_blank"}
                  rel={contact.kind === "email" || contact.kind === "phone" ? undefined : "noreferrer"}
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-brand-soft hover:text-brand"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <contact.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-medium">{contact.label}</div>
                    <div className="text-xs text-muted-foreground">{contact.value}</div>
                  </div>
                </a>
              )) : (
                <p className="text-sm text-muted-foreground">
                  {t("announcement.noContact", "No contact information provided.")}
                </p>
              )}
              {announcement.portfolioUrl && (
                <a
                  href={announcement.portfolioUrl.startsWith("http") ? announcement.portfolioUrl : `https://${announcement.portfolioUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-brand-soft hover:text-brand"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-medium">{t("common.portfolio", "Portfolio")}</div>
                    <div className="text-xs text-muted-foreground truncate">{announcement.portfolioUrl}</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {user?.uid === announcement.authorId && (
            <div className="rounded-2xl bg-brand-soft/60 p-6">
              <h3 className="font-bold">{t("announcement.yourOffer", "Your offer")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("announcement.yourOfferDesc", "This is your talent offer. Manage it from your profile.")}
              </p>
              <Button
                asChild
                className="mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <Link to="/profile">{t("job.openDashboard", "Open dashboard")}</Link>
              </Button>
            </div>
          )}
        </aside>
      </div>
      <Footer />
    </div>
  );
}
