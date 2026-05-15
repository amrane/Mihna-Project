import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Mail, Phone, MessageCircle, MapPin, Briefcase, Sparkles, Globe2, ClipboardList, Bookmark, Settings, Users, Link2, LogOut, Edit3, UploadCloud, Camera, ArrowLeft, Building2, Send, Check, X } from "lucide-react";
import { A as Avatar, a as AvatarImage, b as AvatarFallback, g as getTheme, c as applyTheme, d as applicationService, H as Header, B as Button, F as Footer } from "./Footer-CIdxXT3C.js";
import { J as JobCard } from "./JobCard-D8mX-zTy.js";
import { a as useI18n, u as useAuth, b as Route, D as DEFAULT_PROFILE_PHOTO, c as apiRequest } from "./router-Bte9I49t.js";
import { B as Badge } from "./badge-BiVmFZBi.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-TknwEWZJ.js";
import { u as useFirestoreCollection } from "./use-firestore-uoDfirYi.js";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
function formatCurrency(value, period, notSpecified) {
  if (!value) return notSpecified;
  const suffix = period ? ` / ${period}` : "";
  return `${value.toLocaleString("fr-DZ")} DZD${suffix}`;
}
function contactHref(kind, value) {
  if (!value) return void 0;
  if (kind === "email") return `mailto:${value}`;
  if (kind === "phone") return `tel:${value}`;
  if (kind === "whatsapp") return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
  if (kind === "telegram") return `https://t.me/${value.replace(/^@/, "")}`;
  return value;
}
function TalentOfferCard({
  offer,
  compact = false
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
      icon: MessageCircle
    },
    {
      kind: "telegram",
      label: t("common.telegram", "Telegram"),
      value: offer.contactTelegram,
      icon: MessageCircle
    }
  ].filter((contact) => contact.value);
  const skills = Array.isArray(offer.skills) ? offer.skills.slice(0, compact ? 4 : 8) : [];
  return /* @__PURE__ */ jsx("article", { className: "group rounded-2xl border bg-card p-5 transition hover:shadow-sm", children: /* @__PURE__ */ jsxs(Link, { to: "/announcement/$id", params: { id: offer.id || "" }, className: "block", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: offer.authorAvatar }),
          /* @__PURE__ */ jsx(AvatarFallback, { children: name.slice(0, 1) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "truncate text-base font-semibold text-foreground", children: title }),
            offer.workPreference && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand", children: offer.workPreference })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: name }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground", children: [
            offer.preferredLocation && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
              offer.preferredLocation
            ] }),
            offer.experienceLevel && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Briefcase, { className: "h-3 w-3" }),
              offer.experienceLevel
            ] }),
            offer.availability && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
              offer.availability
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "shrink-0 text-xs font-medium text-muted-foreground", children: formatCurrency(offer.expectedSalary, offer.salaryPeriod, t("common.notSpecified", "Not specified")) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-6 text-muted-foreground", children: compact ? `${offer.content.slice(0, 140)}${offer.content.length > 140 ? "..." : ""}` : offer.content }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: offer.category || t("common.general", "General") }),
      offer.yearsExperience ? /* @__PURE__ */ jsx("span", { className: "rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: t("talent.yearCount", "{count} year(s)", { count: offer.yearsExperience }) }) : null,
      skills.map((skill) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
          children: skill
        },
        skill
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
      contacts.map((contact) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: contactHref(contact.kind, contact.value),
          target: contact.kind === "email" || contact.kind === "phone" ? void 0 : "_blank",
          rel: contact.kind === "email" || contact.kind === "phone" ? void 0 : "noreferrer",
          className: "inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:border-brand/30 hover:text-brand",
          children: [
            /* @__PURE__ */ jsx(contact.icon, { className: "h-3 w-3" }),
            contact.label
          ]
        },
        contact.label
      )),
      offer.portfolioUrl && /* @__PURE__ */ jsxs(
        "a",
        {
          href: offer.portfolioUrl.startsWith("http") ? offer.portfolioUrl : `https://${offer.portfolioUrl}`,
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:border-brand/30 hover:text-brand",
          children: [
            /* @__PURE__ */ jsx(Globe2, { className: "h-3 w-3" }),
            t("common.portfolio", "Portfolio")
          ]
        }
      )
    ] })
  ] }) });
}
function StatBox({
  icon: Icon,
  value,
  label
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: value }),
      /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-sm text-muted-foreground", children: label })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) })
  ] });
}
function formatDateLabel(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function PublicProfileView({
  userId: targetUserId
}) {
  const {
    t
  } = useI18n();
  useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(`/users/by-uid/${targetUserId}`).then((res) => {
      if (active) setProfile(res.user);
    }).catch(() => {
      if (active) setProfile(null);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [targetUserId]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-2xl px-4 py-10 sm:px-6", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => window.history.back(), className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        t("common.back", "Back")
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("common.loading", "Loading...") }) }) : !profile ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("profile.notFound", "User not found.") }) }) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-20 w-20 border", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: profile.avatar || profile.photoURL }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xl", children: profile.fullName?.slice(0, 2) || "U" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: profile.fullName }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [
              profile.profession && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Briefcase, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: profile.profession })
              ] }),
              profile.accountType === "employer" && profile.companyName && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "text-border", children: "|" }),
                /* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: profile.companyName })
              ] })
            ] }),
            profile.location && /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
              profile.location
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand", children: profile.accountType === "employer" ? t("common.employer", "Employer") : t("common.candidate", "Candidate") }) })
          ] })
        ] }),
        profile.bio && /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm leading-relaxed text-muted-foreground", children: profile.bio }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-2", children: [
          profile.email && /* @__PURE__ */ jsxs("a", { href: `mailto:${profile.email}`, className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
            profile.email
          ] }),
          profile.phone && /* @__PURE__ */ jsxs("a", { href: `tel:${profile.phone}`, className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }),
            profile.phone
          ] }),
          profile.website && /* @__PURE__ */ jsxs("a", { href: profile.website.startsWith("http") ? profile.website : `https://${profile.website}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Globe2, { className: "h-4 w-4" }),
            profile.website
          ] }),
          profile.whatsapp && /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
            t("common.whatsapp", "WhatsApp")
          ] }),
          profile.telegram && /* @__PURE__ */ jsxs("a", { href: `https://t.me/${profile.telegram.replace(/^@/, "")}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
            "@",
            profile.telegram.replace(/^@/, "")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function ProfilePage() {
  const {
    user,
    updateUser,
    logout
  } = useAuth();
  const {
    t
  } = useI18n();
  const navigate = useNavigate();
  const {
    tab,
    userId: viewUserId
  } = Route.useSearch();
  const isEmployer = user?.accountType === "employer";
  const [activeTab, setActiveTab] = useState(tab || "overview");
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState("light");
  const [employerApplications, setEmployerApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [candidateApplications, setCandidateApplications] = useState([]);
  const [loadingCandidateApps, setLoadingCandidateApps] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    location: "Algiers",
    phone: "",
    website: "",
    whatsapp: "",
    telegram: "",
    facebook: "",
    avatar: "",
    profession: "",
    companyName: "",
    bio: ""
  });
  const cvRef = useRef(null);
  const [cvFileName, setCvFileName] = useState(user?.cvFileName || "");
  const [cvDataUrl, setCvDataUrl] = useState(user?.cvDataUrl || "");
  const handleCVChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCvFileName(file.name);
        setCvDataUrl(result);
        updateUser({
          cvFileName: file.name,
          cvDataUrl: result
        });
        toast.success(t("profile.cvUploaded", "CV uploaded successfully"));
      }
    };
    reader.readAsDataURL(file);
  };
  const handleDeleteCV = () => {
    setCvFileName("");
    setCvDataUrl("");
    updateUser({
      cvFileName: "",
      cvDataUrl: ""
    });
    toast.success(t("profile.cvDeleted", "CV deleted"));
  };
  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      location: user.location ?? "Algiers",
      phone: user.phone ?? "",
      website: user.website ?? "",
      whatsapp: user.whatsapp ?? "",
      telegram: user.telegram ?? "",
      facebook: user.facebook ?? "",
      avatar: user.avatar ?? "",
      profession: user.profession ?? "",
      companyName: user.companyName ?? "",
      bio: user.bio ?? ""
    });
  }, [user]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = getTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);
  useEffect(() => {
    const candidateTabs2 = ["overview", "offers", "applied", "saved", "settings"];
    const employerTabs2 = ["overview", "jobs", "applicants", "talent", "settings"];
    const validTabs = isEmployer ? employerTabs2 : candidateTabs2;
    if (!validTabs.includes(activeTab)) {
      setActiveTab("overview");
    }
  }, [isEmployer]);
  useEffect(() => {
    if (!user || user.accountType !== "employer") {
      setEmployerApplications([]);
      return;
    }
    let active = true;
    setLoadingApplications(true);
    applicationService.getEmployerApplications().then((applications) => {
      if (!active) return;
      setEmployerApplications(applications);
    }).catch((error) => {
      console.error("Failed to load employer applications:", error);
      if (!active) return;
      toast.error("Could not load job applicants right now.");
    }).finally(() => {
      if (active) setLoadingApplications(false);
    });
    return () => {
      active = false;
    };
  }, [user]);
  useEffect(() => {
    if (!user || user.accountType !== "candidate") {
      setCandidateApplications([]);
      return;
    }
    let active = true;
    setLoadingCandidateApps(true);
    applicationService.getCandidateApplications().then((applications) => {
      if (!active) return;
      setCandidateApplications(applications);
    }).catch((error) => {
      console.error("Failed to load candidate applications:", error);
      if (!active) return;
    }).finally(() => {
      if (active) setLoadingCandidateApps(false);
    });
    return () => {
      active = false;
    };
  }, [user]);
  const {
    data: jobs
  } = useFirestoreCollection("jobs");
  const {
    data: employerJobs
  } = useFirestoreCollection("jobs", "createdAt", isEmployer ? "employerId" : void 0, isEmployer ? user?.uid : void 0);
  const {
    data: locations
  } = useFirestoreCollection("locations", "order");
  const {
    data: categories
  } = useFirestoreCollection("categories", "order");
  const {
    data: talentOffers
  } = useFirestoreCollection("announcements", "createdAt", "announcementType", "jobseeking");
  const savedJobIds = user?.savedJobIds ?? [];
  const appliedJobIds = user?.appliedJobIds ?? [];
  const userId = user?.uid ?? "";
  const savedJobs = useMemo(() => jobs.filter((job) => job.id && savedJobIds.includes(job.id)), [jobs, savedJobIds]);
  const appliedJobs = useMemo(() => appliedJobIds.map((appliedJobId) => jobs.find((job) => job.id === appliedJobId)).filter((job) => Boolean(job)), [appliedJobIds, jobs]);
  const ownTalentOffers = useMemo(() => talentOffers.filter((offer) => offer.authorId === userId), [talentOffers, userId]);
  const marketTalentOffers = useMemo(() => talentOffers.filter((offer) => offer.authorId !== userId), [talentOffers, userId]);
  const applicationsByJobId = useMemo(() => {
    const entries = /* @__PURE__ */ new Map();
    for (const application of employerApplications) {
      const list = entries.get(application.jobId) ?? [];
      list.push(application);
      entries.set(application.jobId, list);
    }
    return entries;
  }, [employerApplications]);
  const algerianLocations = locations.filter((location) => location.name !== "Anywhere").map((location) => location.name);
  const profile = {
    fullName: form.fullName || "Demo User",
    email: form.email || "demo@mihna.dz",
    username: form.username || "demo.user",
    location: form.location || "Algiers",
    avatar: form.avatar || DEFAULT_PROFILE_PHOTO,
    phone: form.phone,
    website: form.website,
    whatsapp: form.whatsapp,
    telegram: form.telegram,
    facebook: form.facebook,
    profession: form.profession,
    companyName: form.companyName,
    bio: form.bio
  };
  const recentApplicants = employerApplications.slice(0, 3);
  marketTalentOffers.slice(0, 3);
  const candidateTabs = [{
    icon: ClipboardList,
    label: t("profile.tabs.overview", "Overview"),
    tab: "overview",
    count: 0
  }, {
    icon: Sparkles,
    label: t("profile.tabs.offers", "Talent Offers"),
    tab: "offers",
    count: ownTalentOffers.length
  }, {
    icon: Briefcase,
    label: t("profile.tabs.applied", "Applied Jobs"),
    tab: "applied",
    count: appliedJobs.length
  }, {
    icon: Bookmark,
    label: t("profile.tabs.saved", "Saved Jobs"),
    tab: "saved",
    count: savedJobs.length
  }, {
    icon: Settings,
    label: t("profile.tabs.settings", "Settings"),
    tab: "settings",
    count: 0
  }];
  const employerTabs = [{
    icon: ClipboardList,
    label: t("profile.tabs.overview", "Overview"),
    tab: "overview",
    count: 0
  }, {
    icon: Briefcase,
    label: t("profile.tabs.jobs", "My Jobs"),
    tab: "jobs",
    count: employerJobs.length
  }, {
    icon: Users,
    label: t("profile.tabs.applicants", "Applicants"),
    tab: "applicants",
    count: employerApplications.length
  }, {
    icon: Sparkles,
    label: t("profile.tabs.talent", "Talent Board"),
    tab: "talent",
    count: marketTalentOffers.length
  }, {
    icon: Settings,
    label: t("profile.tabs.settings", "Settings"),
    tab: "settings",
    count: 0
  }];
  const tabs = isEmployer ? employerTabs : candidateTabs;
  if (viewUserId && viewUserId !== user?.uid) {
    return /* @__PURE__ */ jsx(PublicProfileView, { userId: viewUserId });
  }
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-12", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: t("profile.loginRequired.title", "Log in to view your profile") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: t("profile.loginRequired.desc", "Your dashboard, job activity, and settings are available once you sign in.") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/auth",
            search: {
              mode: "login"
            }
          }), variant: "outline", className: "rounded-xl", children: t("auth.logIn", "Log in") }),
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/auth",
            search: {
              mode: "register"
            }
          }), className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: t("auth.register.title", "Create account.").replace(".", "") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  const contactItems = [{
    label: "Email",
    value: profile.email,
    icon: Mail,
    href: `mailto:${profile.email}`
  }, {
    label: "Phone",
    value: profile.phone,
    icon: Phone,
    href: profile.phone ? `tel:${profile.phone}` : void 0
  }, {
    label: "Website",
    value: profile.website,
    icon: Globe2,
    href: profile.website?.startsWith("http") ? profile.website : profile.website ? `https://${profile.website}` : void 0
  }, {
    label: "WhatsApp",
    value: profile.whatsapp,
    icon: MessageCircle,
    href: profile.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}` : void 0
  }, {
    label: "Telegram",
    value: profile.telegram,
    icon: MessageCircle,
    href: profile.telegram ? `https://t.me/${profile.telegram.replace(/^@/, "")}` : void 0
  }, {
    label: "Facebook",
    value: profile.facebook,
    icon: Link2,
    href: profile.facebook?.startsWith("http") ? profile.facebook : profile.facebook ? `https://${profile.facebook}` : void 0
  }];
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({
          ...prev,
          avatar: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSaveProfile = async () => {
    try {
      await updateUser({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        location: form.location,
        phone: form.phone,
        website: form.website,
        whatsapp: form.whatsapp,
        telegram: form.telegram,
        facebook: form.facebook,
        avatar: form.avatar,
        profession: form.profession,
        companyName: form.companyName,
        bio: form.bio
      });
      setIsEditing(false);
      toast.success(t("profile.informationSaved", "Profile information saved"));
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error(t("profile.saveFailed", "Could not save your profile. Please try again."));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8", children: [
      /* @__PURE__ */ jsxs("aside", { className: "rounded-2xl border border-border bg-card p-4 shadow-sm lg:min-h-[600px]", children: [
        /* @__PURE__ */ jsx("div", { className: "px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: isEmployer ? t("profile.dashboard.employer", "Employer Dashboard") : t("profile.dashboard.candidate", "Candidate Dashboard") }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-2xl bg-muted p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-14 w-14 border border-border", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: user?.avatar || DEFAULT_PROFILE_PHOTO }),
            /* @__PURE__ */ jsx(AvatarFallback, { children: profile.fullName.slice(0, 1) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-foreground", children: profile.fullName }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: isEmployer ? profile.companyName || t("common.employer", "Employer") : profile.profession || t("common.candidate", "Candidate") })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-2", children: tabs.map((item) => /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab(item.tab), className: `flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm transition ${activeTab === item.tab ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-accent"}`, children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }),
            item.label
          ] }),
          item.count > 0 && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground", children: item.count.toString().padStart(2, "0") })
        ] }, item.tab)) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => {
          logout();
          navigate({
            to: "/"
          });
        }, className: "mt-6 flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground transition hover:bg-accent", children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
          " ",
          t("profile.logout", "Log out")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-20 w-20 border border-border", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: user?.avatar || DEFAULT_PROFILE_PHOTO }),
              /* @__PURE__ */ jsx(AvatarFallback, { children: profile.fullName.slice(0, 1) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: profile.fullName }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: isEmployer ? profile.companyName || t("profile.account.employer", "Employer account") : profile.profession || t("profile.account.candidate", "Freelancer / Job seeker") }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-3 text-xs uppercase tracking-wider text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: profile.location }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/40", children: "|" }),
                /* @__PURE__ */ jsx("span", { children: isEmployer ? t("profile.activeJobs", "{count} active jobs", {
                  count: employerJobs.length
                }) : t("profile.talentOffersCount", "{count} talent offers", {
                  count: ownTalentOffers.length
                }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setIsEditing(true), className: "inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90", children: [
              /* @__PURE__ */ jsx(Edit3, { className: "h-4 w-4" }),
              " ",
              t("profile.edit", "Edit profile")
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: isEmployer ? "/post-job" : "/post-announcement", className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent", children: [
              /* @__PURE__ */ jsx(UploadCloud, { className: "h-4 w-4" }),
              isEmployer ? t("header.menu.postJob", "Post a job") : t("header.menu.createOffer", "Create talent offer")
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-6", children: [
          activeTab === "overview" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[1fr_0.7fr]", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(StatBox, { icon: isEmployer ? Briefcase : Sparkles, value: `${isEmployer ? employerJobs.length : ownTalentOffers.length}`, label: isEmployer ? t("profile.stats.jobsPosted", "Jobs posted") : t("profile.stats.talentOffers", "Talent offers") }),
                /* @__PURE__ */ jsx(StatBox, { icon: Users, value: `${isEmployer ? employerApplications.length : appliedJobs.length}`, label: isEmployer ? t("profile.stats.applicantsReceived", "Applicants received") : t("profile.stats.applicationsSent", "Applications sent") }),
                /* @__PURE__ */ jsx(StatBox, { icon: Bookmark, value: `${isEmployer ? marketTalentOffers.length : savedJobs.length}`, label: isEmployer ? t("profile.stats.talentOffersLive", "Talent offers live") : t("profile.stats.savedJobs", "Saved jobs") }),
                /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: isEmployer ? t("profile.companyIntro", "Company introduction") : t("profile.cv", "CV / Resume") }),
                    /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: isEmployer ? cvFileName ? t("profile.companyIntroUploaded", "Your company introduction is attached.") : t("profile.companyIntroNotUploaded", "No company introduction uploaded yet.") : cvFileName ? t("profile.cvUploadedDesc", "Your CV is attached to your profile.") : t("profile.cvNotUploaded", "No CV uploaded yet.") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    cvDataUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("a", { href: cvDataUrl, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white", children: isEmployer ? t("profile.viewCompanyIntro", "View introduction") : t("profile.viewCV", "View CV") }),
                      /* @__PURE__ */ jsx("button", { onClick: () => cvRef.current?.click(), className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent", children: t("profile.replaceCV", "Replace") }),
                      /* @__PURE__ */ jsx("button", { onClick: handleDeleteCV, className: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xs font-bold text-red-600 transition hover:bg-red-100", children: "X" })
                    ] }),
                    !cvDataUrl && /* @__PURE__ */ jsx("button", { onClick: () => cvRef.current?.click(), className: "inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground transition hover:bg-brand/90", children: isEmployer ? t("profile.uploadCompanyIntro", "Upload introduction") : t("profile.uploadCV", "Upload CV") }),
                    /* @__PURE__ */ jsx("input", { ref: cvRef, type: "file", accept: ".pdf,.doc,.docx", className: "hidden", onChange: handleCVChange })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: isEmployer ? t("profile.employerContact", "Contact info") : t("profile.contactInfo", "Contact info") }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: isEmployer ? t("profile.employerContactDesc", "Ways candidates can reach out to your business.") : t("profile.candidateContactDesc", "Employers will use these channels to reach you faster.") })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: contactItems.map((contact) => /* @__PURE__ */ jsxs("div", { onClick: () => setIsEditing(true), className: "flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 p-3 transition hover:bg-brand/5", children: [
                  /* @__PURE__ */ jsx(contact.icon, { className: "h-4 w-4 text-slate-500" }),
                  contact.value ? contact.href ? /* @__PURE__ */ jsx("a", { href: contact.href, target: "_blank", rel: "noreferrer", onClick: (e) => e.stopPropagation(), className: "text-sm text-slate-700 transition hover:text-brand", children: contact.value }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: contact.value }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-500", children: t("common.notProvided", "Not provided") })
                ] }, contact.label)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[1fr_0.7fr]", children: [
              isEmployer ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: t("profile.recentApplicants", "Recent applicants") }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("profile.recentApplicants.desc", "See who applied recently and jump into direct contact.") })
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { className: "rounded-full bg-brand/10 px-3 py-1 text-sm text-brand", children: t("profile.hiring", "Hiring") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: loadingApplications ? /* @__PURE__ */ jsx(EmptyState, { text: t("profile.loadingApplicants", "Loading applicants...") }) : recentApplicants.length > 0 ? recentApplicants.map((application) => /* @__PURE__ */ jsx(ApplicantCard, { application, onStatusUpdate: (id, status) => {
                  setEmployerApplications((prev) => prev.map((a) => a.id === id ? {
                    ...a,
                    status
                  } : a));
                } }, application.id)) : /* @__PURE__ */ jsx(EmptyState, { text: t("profile.noApplicants", "No applicants yet. Share your jobs and candidates will appear here.") }) })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: t("profile.yourTalentOffers", "Your talent offers") }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("profile.candidateOfferDesc", "This is what employers see when they browse candidate offers.") })
                  ] }),
                  /* @__PURE__ */ jsx(Link, { to: "/post-announcement", className: "text-sm font-semibold text-brand", children: t("profile.createNew", "Create new") })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-4", children: ownTalentOffers.length > 0 ? ownTalentOffers.slice(0, 2).map((offer) => /* @__PURE__ */ jsx(TalentOfferCard, { offer, compact: true }, offer.id)) : /* @__PURE__ */ jsx(EmptyState, { text: t("profile.noTalentOffers", "No talent offers yet. Publish one so employers can discover your profile.") }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: isEmployer ? t("profile.talentBoardSnapshot", "Talent board snapshot") : t("profile.accountDetails", "Account details") }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3 text-sm text-muted-foreground", children: isEmployer ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-muted p-3", children: t("profile.availableTalentOffers", "Available talent offers: {count}", {
                    count: marketTalentOffers.length
                  }) }),
                  /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-muted p-3", children: t("profile.totalApplicants", "Total applicants: {count}", {
                    count: employerApplications.length
                  }) }),
                  /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-muted p-3", children: t("profile.bestNextStep", "Best next step: review recent applicants and shortlist matching offers.") })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-muted p-3", children: [
                    t("profile.username", "Username"),
                    ": ",
                    profile.username
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-muted p-3", children: [
                    t("common.location", "Location"),
                    ": ",
                    profile.location
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-muted p-3", children: [
                    t("profile.savedJobs", "Saved jobs"),
                    ": ",
                    savedJobs.length
                  ] })
                ] }) })
              ] })
            ] })
          ] }),
          !isEmployer && activeTab === "offers" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.yourJobseekingOffers", "Your jobseeking offers") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("profile.detailedTalentCards", "Detailed talent cards that employers can browse from the platform.") })
              ] }),
              /* @__PURE__ */ jsx(Link, { to: "/post-announcement", className: "text-sm font-semibold text-brand", children: t("profile.createOffer", "Create offer") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-4 xl:grid-cols-2", children: ownTalentOffers.length > 0 ? ownTalentOffers.map((offer) => /* @__PURE__ */ jsx(TalentOfferCard, { offer }, offer.id)) : /* @__PURE__ */ jsx(EmptyState, { text: t("profile.noOffersPublished", "You have not published any talent offers yet.") }) })
          ] }),
          !isEmployer && activeTab === "applied" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.appliedJobs", "Applied jobs") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("profile.reviewAppliedRoles", "Review the roles you already applied to.") })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: loadingCandidateApps ? /* @__PURE__ */ jsx(EmptyState, { text: "Loading..." }) : appliedJobs.length > 0 ? appliedJobs.map((job) => {
              const app = candidateApplications.find((a) => a.jobId === job.id);
              const status = app?.status || "applied";
              const statusColors = {
                new: "bg-blue-100 text-blue-700",
                applied: "bg-slate-100 text-slate-700",
                accepted: "bg-emerald-100 text-emerald-700",
                rejected: "bg-red-100 text-red-700"
              };
              return /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-slate-200 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "truncate font-semibold text-slate-900", children: job.title }),
                    /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "bg-slate-100 text-slate-700"}`, children: status.charAt(0).toUpperCase() + status.slice(1) })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
                    job.company,
                    " - ",
                    job.location
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: app ? formatDateLabel(app.updatedAt || app.createdAt) : job.postedAgo })
              ] }) }, job.id);
            }) : /* @__PURE__ */ jsx(EmptyState, { text: "You have not applied to any jobs yet." }) })
          ] }),
          !isEmployer && activeTab === "saved" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.savedJobs", "Saved jobs") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("profile.jobsMarkedLater", "Jobs you marked to review later.") })
              ] }),
              /* @__PURE__ */ jsx(Link, { to: "/search", className: "text-sm font-semibold text-brand", children: t("footer.browseJobs", "Browse jobs") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: savedJobs.length > 0 ? savedJobs.map((job) => /* @__PURE__ */ jsx(JobCard, { job }, job.id)) : /* @__PURE__ */ jsx(EmptyState, { text: "No saved jobs yet. Use the save icon on listings to keep opportunities." }) })
          ] }),
          isEmployer && activeTab === "jobs" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.yourJobPostings", "Your job postings") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Track every listing with views, saves, and applicant counts." })
              ] }),
              /* @__PURE__ */ jsx(Link, { to: "/post-job", className: "text-sm font-semibold text-brand", children: "Post a new job" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: employerJobs.length > 0 ? employerJobs.map((job) => /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-slate-200 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsx("h3", { className: "truncate text-lg font-semibold text-slate-950", children: job.title }),
                  /* @__PURE__ */ jsx(Badge, { className: "rounded-full bg-brand/10 px-3 py-1 text-xs text-brand", children: job.typeLabel || job.type })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-slate-500", children: [
                  job.location,
                  " Â· Posted ",
                  job.postedAgo
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsx(MetricPill, { label: "Applicants", value: `${applicationsByJobId.get(job.id || "")?.length ?? job.applicationCount ?? 0}` }),
                /* @__PURE__ */ jsx(MetricPill, { label: "Saved", value: `${job.savedCount ?? 0}` }),
                /* @__PURE__ */ jsx(MetricPill, { label: "Views", value: `${job.viewCount ?? 0}` })
              ] })
            ] }) }, job.id)) : /* @__PURE__ */ jsx(EmptyState, { text: "No jobs posted yet. Create your first opening to start receiving applicants." }) })
          ] }),
          isEmployer && activeTab === "applicants" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.applicants", "Applicants") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Review candidate details, job targets, notes, and contact channels." })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: loadingApplications ? /* @__PURE__ */ jsx(EmptyState, { text: "Loading applicants..." }) : employerApplications.length > 0 ? employerApplications.map((application) => /* @__PURE__ */ jsx(ApplicantCard, { application, detailed: true, onStatusUpdate: (id, status) => {
              setEmployerApplications((prev) => prev.map((a) => a.id === id ? {
                ...a,
                status
              } : a));
            } }, application.id)) : /* @__PURE__ */ jsx(EmptyState, { text: "You have not received applications yet." }) })
          ] }),
          isEmployer && activeTab === "talent" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.talentBoard", "Talent board") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Browse detailed jobseeking offers published by candidates." })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 grid gap-4 xl:grid-cols-2", children: marketTalentOffers.length > 0 ? marketTalentOffers.map((offer) => /* @__PURE__ */ jsx(TalentOfferCard, { offer }, offer.id)) : /* @__PURE__ */ jsx(EmptyState, { text: "No talent offers are live yet. Candidate offers will appear here automatically." }) })
          ] }),
          activeTab === "settings" && /* @__PURE__ */ jsxs("div", { className: "rounded-[32px] border border-slate-200 bg-white p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-950", children: t("profile.settings", "Settings") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("profile.settingsDesc", "Manage your appearance and profile preferences.") })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-900", children: t("profile.appearance", "Appearance") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("profile.appearanceDesc", "Choose light or dark mode for the site.") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1", children: ["light", "dark"].map((nextTheme) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                setTheme(nextTheme);
                applyTheme(nextTheme);
              }, className: `rounded-full px-4 py-2 text-sm font-semibold transition ${theme === nextTheme ? "bg-brand text-brand-foreground" : "text-slate-600 hover:text-slate-900"}`, children: nextTheme === "light" ? "Light" : "Dark" }, nextTheme)) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Dialog, { open: isEditing, onOpenChange: (open) => {
          setIsEditing(open);
          if (open && user) {
            setForm({
              fullName: user.fullName,
              username: user.username,
              email: user.email,
              location: user.location ?? "Algiers",
              phone: user.phone ?? "",
              website: user.website ?? "",
              whatsapp: user.whatsapp ?? "",
              telegram: user.telegram ?? "",
              facebook: user.facebook ?? "",
              avatar: user.avatar ?? "",
              profession: user.profession ?? "",
              companyName: user.companyName ?? "",
              bio: user.bio ?? ""
            });
          }
        }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] max-w-5xl overflow-y-auto rounded-3xl p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-semibold", children: t("profile.edit", "Edit profile") }),
            /* @__PURE__ */ jsx(DialogDescription, { children: "Update your profile details and contact information." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-3", children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 text-center", children: [
              /* @__PURE__ */ jsxs(Avatar, { className: "h-24 w-24 border border-slate-200", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: profile.avatar }),
                /* @__PURE__ */ jsx(AvatarFallback, { children: profile.fullName.slice(0, 1) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900", children: t("profile.profilePhoto", "Profile photo") }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Upload a photo or keep the default avatar." })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90", children: [
                /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: t("profile.uploadImage", "Upload image") }),
                /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleAvatarChange })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6 lg:col-span-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(InputField, { label: "Full name", value: form.fullName, onChange: (value) => setForm({
                  ...form,
                  fullName: value
                }) }),
                /* @__PURE__ */ jsx(InputField, { label: "Username", value: form.username, onChange: (value) => setForm({
                  ...form,
                  username: value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(InputField, { label: "Email", type: "email", value: form.email, onChange: (value) => setForm({
                  ...form,
                  email: value
                }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-slate-700", children: [
                  /* @__PURE__ */ jsx("span", { children: t("common.location", "Location") }),
                  /* @__PURE__ */ jsx("select", { value: form.location, onChange: (e) => setForm({
                    ...form,
                    location: e.target.value
                  }), className: "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20", children: (algerianLocations.length > 0 ? algerianLocations : ["Algiers"]).map((location) => /* @__PURE__ */ jsx("option", { value: location, children: location }, location)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                isEmployer ? /* @__PURE__ */ jsx(InputField, { label: "Company name", value: form.companyName, onChange: (value) => setForm({
                  ...form,
                  companyName: value
                }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-slate-700", children: [
                  /* @__PURE__ */ jsx("span", { children: "Profession" }),
                  /* @__PURE__ */ jsxs("select", { value: form.profession, onChange: (e) => setForm({
                    ...form,
                    profession: e.target.value
                  }), className: "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20", children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select your profession..." }),
                    (categories ?? []).map((c) => /* @__PURE__ */ jsx("option", { value: c.name, children: c.name }, c.id))
                  ] })
                ] }),
                /* @__PURE__ */ jsx(InputField, { label: "Website", value: form.website, onChange: (value) => setForm({
                  ...form,
                  website: value
                }), placeholder: "www.example.dz" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "space-y-2 text-sm text-slate-700", children: [
                "Bio",
                /* @__PURE__ */ jsx("textarea", { value: form.bio, onChange: (e) => setForm({
                  ...form,
                  bio: e.target.value
                }), rows: 4, className: "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
                /* @__PURE__ */ jsx(InputField, { label: "Phone", value: form.phone, onChange: (value) => setForm({
                  ...form,
                  phone: value
                }), placeholder: "+213 5xx xxx xxx" }),
                /* @__PURE__ */ jsx(InputField, { label: "WhatsApp", value: form.whatsapp, onChange: (value) => setForm({
                  ...form,
                  whatsapp: value
                }), placeholder: "5xxxxxxxx" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
                /* @__PURE__ */ jsx(InputField, { label: "Telegram", value: form.telegram, onChange: (value) => setForm({
                  ...form,
                  telegram: value
                }), placeholder: "@username" }),
                /* @__PURE__ */ jsx(InputField, { label: "Facebook", value: form.facebook, onChange: (value) => setForm({
                  ...form,
                  facebook: value
                }), placeholder: "facebook.com/in/username" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", onClick: handleSaveProfile, className: "rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand/90", children: t("profile.saveChanges", "Save changes") }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsEditing(false), className: "rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50", children: "Cancel" })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function ApplicantCard({
  application,
  detailed = false,
  onStatusUpdate
}) {
  const [updating, setUpdating] = useState(null);
  const quickContacts = [{
    label: application.primaryContact ? "Primary" : "Email",
    value: application.primaryContact || application.applicantEmail,
    href: application.primaryContact?.includes("@") ? `mailto:${application.primaryContact}` : application.primaryContact ? void 0 : application.applicantEmail ? `mailto:${application.applicantEmail}` : void 0
  }, {
    label: "Phone",
    value: application.applicantPhone || application.secondaryContact,
    href: application.applicantPhone || application.secondaryContact ? `tel:${application.applicantPhone || application.secondaryContact}` : void 0
  }, {
    label: "WhatsApp",
    value: application.applicantWhatsapp,
    href: application.applicantWhatsapp ? `https://wa.me/${application.applicantWhatsapp.replace(/[^0-9]/g, "")}` : void 0
  }].filter((item) => item.value);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "h-12 w-12 border border-slate-200", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: application.applicantAvatar }),
          /* @__PURE__ */ jsx(AvatarFallback, { children: (application.applicantName || "A").slice(0, 1) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "truncate text-lg font-semibold text-slate-950", children: application.applicantName }),
            /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${application.status === "accepted" ? "bg-emerald-100 text-emerald-700" : application.status === "rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`, children: (application.status || "new").charAt(0).toUpperCase() + (application.status || "new").slice(1) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
            application.applicantProfession || "Candidate",
            " · ",
            application.applicantLocation || "Alger"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm font-medium text-brand", children: [
            "Applied to: ",
            application.jobTitle
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-500", children: [
        "Received ",
        formatDateLabel(application.createdAt)
      ] })
    ] }),
    (application.note || detailed) && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600", children: application.note || "No note was attached to this application." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
      quickContacts.map((contact) => /* @__PURE__ */ jsxs("a", { href: contact.href, target: contact.href?.startsWith("http") ? "_blank" : void 0, rel: contact.href?.startsWith("http") ? "noreferrer" : void 0, className: "rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand/30 hover:text-brand", children: [
        contact.label,
        ": ",
        contact.value
      ] }, contact.label)),
      application.applicantFacebook && /* @__PURE__ */ jsx("a", { href: application.applicantFacebook.startsWith("http") ? application.applicantFacebook : `https://${application.applicantFacebook}`, target: "_blank", rel: "noreferrer", className: "rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand/30 hover:text-brand", children: "Facebook" }),
      /* @__PURE__ */ jsx(Link, { to: "/profile", search: {
        userId: application.applicantId
      }, className: "rounded-full border border-brand/30 px-3 py-2 text-sm text-brand transition hover:bg-brand/5", children: "View Profile" })
    ] }),
    detailed && application.status === "new" && onStatusUpdate && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-3 border-t border-slate-100 pt-4", children: [
      /* @__PURE__ */ jsxs("button", { disabled: updating === "accepted", onClick: async () => {
        setUpdating("accepted");
        try {
          await applicationService.updateStatus(application.id, "accepted");
          onStatusUpdate(application.id, "accepted");
          toast.success("Application accepted!");
        } catch {
          toast.error("Failed to accept application.");
        } finally {
          setUpdating(null);
        }
      }, className: "inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }),
        updating === "accepted" ? "Accepting..." : "Accept"
      ] }),
      /* @__PURE__ */ jsxs("button", { disabled: updating === "rejected", onClick: async () => {
        setUpdating("rejected");
        try {
          await applicationService.updateStatus(application.id, "rejected");
          onStatusUpdate(application.id, "rejected");
          toast.success("Application declined.");
        } catch {
          toast.error("Failed to decline application.");
        } finally {
          setUpdating(null);
        }
      }, className: "inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        updating === "rejected" ? "Declining..." : "Decline"
      ] })
    ] })
  ] });
}
function MetricPill({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-slate-50 px-4 py-3 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.16em] text-slate-400", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 font-semibold text-slate-900", children: value })
  ] });
}
function EmptyState({
  text
}) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500", children: text });
}
function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxs("label", { className: "space-y-2 text-sm text-slate-700", children: [
    label,
    /* @__PURE__ */ jsx("input", { type, value, placeholder, onChange: (e) => onChange(e.target.value), className: "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" })
  ] });
}
export {
  ProfilePage as component
};
