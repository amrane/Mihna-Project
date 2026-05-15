import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Phone, MessageCircle, BadgeCheck, ArrowLeft, MapPin, Tag, GraduationCap, Briefcase, Clock, DollarSign, Globe2 } from "lucide-react";
import { H as Header, F as Footer, A as Avatar, a as AvatarImage, b as AvatarFallback, B as Button, k as announcementService } from "./Footer-CIdxXT3C.js";
import { B as Badge } from "./badge-BiVmFZBi.js";
import { j as Route, u as useAuth, a as useI18n } from "./router-Bte9I49t.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "sonner";
function AnnouncementDetail() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    t,
    tt
  } = useI18n();
  const [announcement, setAnnouncement] = useState(null);
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
    return () => {
      active = false;
    };
  }, [id]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground sm:px-6 lg:px-8", children: t("common.loading", "Loading...") }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (missing || !announcement) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: t("announcement.notFound.title", "Announcement not found") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: t("announcement.notFound.desc", "This talent offer may have been removed or is no longer available.") }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-6 text-brand", children: t("announcement.backToHome", "Back to home") })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  const name = announcement.authorName || t("common.candidate", "Candidate");
  const title = announcement.professionalTitle || announcement.title;
  const contacts = [{
    kind: "email",
    label: t("common.email", "Email"),
    value: announcement.contactEmail,
    icon: Mail
  }, {
    kind: "phone",
    label: t("common.phone", "Phone"),
    value: announcement.contactPhone,
    icon: Phone
  }, {
    kind: "whatsapp",
    label: t("common.whatsapp", "WhatsApp"),
    value: announcement.contactWhatsapp,
    icon: MessageCircle
  }, {
    kind: "telegram",
    label: t("common.telegram", "Telegram"),
    value: announcement.contactTelegram,
    icon: MessageCircle
  }].filter((c) => c.value);
  const skills = announcement.skills || [];
  const contactHref = (kind, value) => {
    if (!value) return void 0;
    if (kind === "email") return `mailto:${value}`;
    if (kind === "phone") return `tel:${value}`;
    if (kind === "whatsapp") return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
    if (kind === "telegram") return `https://t.me/${value.replace(/^@/, "")}`;
    return value;
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx(Link, { to: "/profile", search: {
            userId: announcement.authorId
          }, className: "shrink-0", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-16 w-16 transition hover:opacity-80", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: announcement.authorAvatar }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "text-lg", children: name.slice(0, 2) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold truncate", children: title }),
              announcement.workPreference && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "rounded-full bg-brand/10 text-brand hover:bg-brand/20", children: tt(announcement.workPreference) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4 text-brand" }),
              /* @__PURE__ */ jsx(Link, { to: "/profile", search: {
                userId: announcement.authorId
              }, className: "font-medium text-foreground hover:text-brand transition-colors", children: name }),
              announcement.authorRole && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "text-border", children: "|" }),
                /* @__PURE__ */ jsx("span", { children: announcement.authorRole })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigate({
            to: "/"
          }), className: "rounded-xl shrink-0", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1.5 h-4 w-4" }),
            t("announcement.back", "Back")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
          announcement.location && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
            announcement.location
          ] }),
          announcement.category && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3.5 w-3.5" }),
            tt(announcement.category)
          ] }),
          announcement.experienceLevel && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "h-3.5 w-3.5" }),
            tt(announcement.experienceLevel)
          ] }),
          announcement.yearsExperience ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "h-3.5 w-3.5" }),
            t("talent.yearCount", "{count} year(s)", {
              count: announcement.yearsExperience
            })
          ] }) : null,
          announcement.availability && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
            tt(announcement.availability)
          ] }),
          (announcement.salaryMin || announcement.expectedSalary) && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "h-3.5 w-3.5" }),
            announcement.salaryMin ? `${announcement.salaryMin.toLocaleString("fr-DZ")}${announcement.salaryMax ? ` - ${announcement.salaryMax.toLocaleString("fr-DZ")}` : ""} DZD` : `${announcement.expectedSalary?.toLocaleString("fr-DZ")} DZD`,
            announcement.salaryPeriod ? ` / ${announcement.salaryPeriod}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mt-8 text-lg font-bold", children: t("announcement.description", "About") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground", children: announcement.content }),
        skills.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h2", { className: "mt-8 text-lg font-bold", children: t("job.skills", "Professional skills") }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: skills.map((skill) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "rounded-md border-brand-soft bg-brand-soft text-brand", children: skill }, skill)) })
        ] }),
        announcement.tags && announcement.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-2 border-t pt-5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: t("job.tags", "Tags:") }),
          announcement.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "rounded-md border-slate-200 bg-slate-50 text-slate-700", children: tag }, tag))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("announcement.overview", "Overview") }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-4 text-sm", children: [{
            icon: Briefcase,
            label: t("postAnnouncement.workType", "Work Type"),
            value: tt(announcement.workPreference || "")
          }, {
            icon: Tag,
            label: t("common.category", "Category"),
            value: tt(announcement.category || "")
          }, {
            icon: GraduationCap,
            label: t("postAnnouncement.experienceLevel", "Experience"),
            value: tt(announcement.experienceLevel || "")
          }, {
            icon: MapPin,
            label: t("common.location", "Location"),
            value: announcement.location || t("common.notSpecified", "Not specified")
          }, {
            icon: DollarSign,
            label: t("common.salary", "Salary"),
            value: announcement.salaryMin ? `${announcement.salaryMin.toLocaleString("fr-DZ")}${announcement.salaryMax ? ` - ${announcement.salaryMax.toLocaleString("fr-DZ")}` : ""} DZD${announcement.salaryPeriod ? ` / ${announcement.salaryPeriod}` : ""}` : t("common.notSpecified", "Not specified")
          }, {
            icon: Clock,
            label: t("postAnnouncement.availability", "Availability"),
            value: tt(announcement.availability || "")
          }].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand", children: /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: item.label }),
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: item.value })
            ] })
          ] }, item.label)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("announcement.contact", "Contact") }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("announcement.contactDesc", "Reach out to the candidate directly.") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
            contacts.length > 0 ? contacts.map((contact) => /* @__PURE__ */ jsxs("a", { href: contactHref(contact.kind, contact.value), target: contact.kind === "email" || contact.kind === "phone" ? void 0 : "_blank", rel: contact.kind === "email" || contact.kind === "phone" ? void 0 : "noreferrer", className: "flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-brand-soft hover:text-brand", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand", children: /* @__PURE__ */ jsx(contact.icon, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: contact.label }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: contact.value })
              ] })
            ] }, contact.kind)) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("announcement.noContact", "No contact information provided.") }),
            announcement.portfolioUrl && /* @__PURE__ */ jsxs("a", { href: announcement.portfolioUrl.startsWith("http") ? announcement.portfolioUrl : `https://${announcement.portfolioUrl}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-brand-soft hover:text-brand", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand", children: /* @__PURE__ */ jsx(Globe2, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-medium", children: t("common.portfolio", "Portfolio") }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: announcement.portfolioUrl })
              ] })
            ] })
          ] })
        ] }),
        user?.uid === announcement.authorId && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("announcement.yourOffer", "Your offer") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("announcement.yourOfferDesc", "This is your talent offer. Manage it from your profile.") }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/profile", children: t("job.openDashboard", "Open dashboard") }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AnnouncementDetail as component
};
