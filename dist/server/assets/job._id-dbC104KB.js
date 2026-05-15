import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Mail, PhoneCall, Globe2, MessageCircle, Briefcase, MapPin, Check, Facebook, Twitter, Linkedin, Layers, Tag, DollarSign, Send, Building2 } from "lucide-react";
import { toast } from "sonner";
import { H as Header, F as Footer, B as Button, A as Avatar, a as AvatarImage, b as AvatarFallback, m as jobService } from "./Footer-CIdxXT3C.js";
import { J as JobCard } from "./JobCard-D8mX-zTy.js";
import { B as Badge } from "./badge-BiVmFZBi.js";
import { I as Input } from "./input-BAq2Xo4A.js";
import { T as Textarea } from "./textarea-CoGHL6vu.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-TknwEWZJ.js";
import { u as useFirestoreCollection } from "./use-firestore-uoDfirYi.js";
import { i as Route, u as useAuth, a as useI18n, c as apiRequest, A as ApiError } from "./router-Bte9I49t.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
function JobDetail() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const {
    data: jobs
  } = useFirestoreCollection("jobs");
  const {
    user,
    applyToJob
  } = useAuth();
  const {
    t,
    tt
  } = useI18n();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryContact, setPrimaryContact] = useState("");
  const [secondaryContact, setSecondaryContact] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [note, setNote] = useState("");
  const [showEmployer, setShowEmployer] = useState(false);
  const [employerData, setEmployerData] = useState(null);
  const [loadingEmployer, setLoadingEmployer] = useState(false);
  useEffect(() => {
    let active = true;
    const loadJob = async () => {
      setLoading(true);
      setMissing(false);
      try {
        const loadedJob = await jobService.getById(id);
        if (!active) return;
        if (!loadedJob) {
          setMissing(true);
          setJob(null);
          return;
        }
        setJob(loadedJob);
      } catch (error) {
        console.error("Failed to load job details:", error);
        if (!active) return;
        setMissing(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadJob();
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(() => {
    setPrimaryContact(user?.whatsapp || user?.telegram || user?.email || "");
    setSecondaryContact(user?.phone || "");
  }, [user]);
  const related = useMemo(() => {
    if (!job) return [];
    return jobs.filter((candidate) => candidate.id !== job.id && (candidate.category === job.category || candidate.categoryId === job.categoryId)).slice(0, 3);
  }, [jobs, job]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground sm:px-6 lg:px-8", children: t("common.loading", "Loading...") }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (missing || !job) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: t("job.notFound.title", "Job not found") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: t("job.notFound.desc", "This listing may have been removed or is no longer available.") }),
        /* @__PURE__ */ jsx(Link, { to: "/search", className: "mt-6 text-brand", children: t("job.backToJobs", "Back to jobs") })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  const companyName = job.company || job.companyName || "Unknown company";
  const locationName = job.location || job.locationLabel || job.wilayaName || "Anywhere";
  const displayLocationName = locationName === "Anywhere" ? t("common.anywhere", "Anywhere") : tt(locationName);
  const categoryName = job.categoryId || job.category || "Other";
  const isOwnJob = Boolean(user?.uid && job.employerId && user.uid === job.employerId);
  const hasApplied = Boolean(job.id && user?.appliedJobIds?.includes(job.id));
  const userContacts = [{
    label: t("common.email", "Email"),
    value: user?.email,
    href: user?.email ? `mailto:${user.email}` : void 0,
    icon: Mail
  }, {
    label: t("common.phone", "Phone"),
    value: user?.phone,
    href: user?.phone ? `tel:${user.phone}` : void 0,
    icon: PhoneCall
  }, {
    label: t("common.website", "Website"),
    value: user?.website,
    href: user?.website?.startsWith("http") ? user.website : user?.website ? `https://${user.website}` : void 0,
    icon: Globe2
  }, {
    label: t("common.whatsapp", "WhatsApp"),
    value: user?.whatsapp,
    href: user?.whatsapp ? `https://wa.me/${user.whatsapp.replace(/[^0-9]/g, "")}` : void 0,
    icon: MessageCircle
  }, {
    label: t("common.telegram", "Telegram"),
    value: user?.telegram,
    href: user?.telegram ? `https://t.me/${user.telegram.replace(/^@/, "")}` : void 0,
    icon: MessageCircle
  }].filter((item) => item.value);
  const handleApply = async (e) => {
    e.preventDefault();
    if (!job.id) return;
    if (!user) {
      toast.error(t("job.applyLogin", "Log in to apply"));
      navigate({
        to: "/auth",
        search: {
          mode: "login"
        }
      });
      return;
    }
    if (isOwnJob) {
      toast.error("You cannot apply to your own job listing.");
      return;
    }
    if (!primaryContact.trim() && userContacts.length === 0) {
      toast.error("Add at least one contact method before applying.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await applyToJob(job.id, {
        primaryContact,
        secondaryContact,
        note
      });
      if (response.alreadyApplied) {
        toast.message("You already applied to this job.");
      } else {
        toast.success("Application submitted successfully.");
      }
    } catch (error) {
      console.error("Failed to apply to job:", error);
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Could not submit your application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchEmployerProfile = async () => {
    if (!job?.employerId) return;
    setLoadingEmployer(true);
    setShowEmployer(true);
    try {
      const res = await apiRequest(`/users/by-uid/${job.employerId}`);
      setEmployerData(res.user);
    } catch {
      setEmployerData(null);
    } finally {
      setLoadingEmployer(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: (() => {
            const now = Date.now();
            const updated = job.updatedAt?.toMillis ? job.updatedAt.toMillis() : job.updatedAt?.seconds ? job.updatedAt.seconds * 1e3 : typeof job.updatedAt === "number" ? job.updatedAt : now;
            const diffMs = now - updated;
            const mins = Math.floor(diffMs / 6e4);
            const hrs = Math.floor(diffMs / 36e5);
            const days = Math.floor(diffMs / 864e5);
            if (mins < 1) return t("job.justNow", "Just now");
            if (mins < 60) return t("job.minutesAgo", "{mins} min ago", {
              mins
            });
            if (hrs < 24) return t("job.hoursAgo", "{hrs}h ago", {
              hrs
            });
            return t("job.daysAgo", "{days} days ago", {
              days
            });
          })() }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-start gap-4", children: [
            job.companyLogo ? /* @__PURE__ */ jsx("img", { src: job.companyLogo, alt: companyName, className: "h-12 w-12 rounded-xl" }) : /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-lg font-bold text-brand", children: companyName.slice(0, 2) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h1", { className: "truncate text-2xl font-bold", children: job.title }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: companyName })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
              !user ? /* @__PURE__ */ jsx(Button, { asChild: true, className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/auth", search: {
                mode: "login"
              }, children: t("job.applyLogin", "Log in to apply") }) }) : user.accountType === "employer" ? /* @__PURE__ */ jsx(Button, { asChild: true, className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/post-job", children: t("job.employerPostJob", "Post a job") }) }) : isOwnJob ? /* @__PURE__ */ jsx(Button, { asChild: true, className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/profile", children: t("job.yourListing", "Your listing") }) }) : hasApplied ? /* @__PURE__ */ jsx(Button, { disabled: true, className: "rounded-xl", children: t("job.applied", "Applied") }) : /* @__PURE__ */ jsx(Button, { type: "button", onClick: () => document.getElementById("job-application-form")?.scrollIntoView({
                behavior: "smooth"
              }), className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: t("job.applyNow", "Apply now") }),
              /* @__PURE__ */ jsx(Button, { asChild: true, variant: "secondary", className: "rounded-xl", children: /* @__PURE__ */ jsx(Link, { to: "/search", children: t("job.backToJobs", "Back to jobs") }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Briefcase, { className: "h-3 w-3" }),
              " ",
              tt(job.typeLabel || job.type)
            ] }),
            /* @__PURE__ */ jsx("span", { children: "|" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
              " ",
              displayLocationName
            ] }),
            /* @__PURE__ */ jsx("span", { children: "|" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              job.salaryMin.toLocaleString(),
              " -",
              " ",
              job.salaryMax.toLocaleString(),
              " DZD"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-8 text-lg font-bold", children: t("job.description", "Job description") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: job.description }),
          /* @__PURE__ */ jsx("h2", { className: "mt-8 text-lg font-bold", children: t("job.responsibilities", "Key responsibilities") }),
          /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2", children: job.responsibilities.map((responsibility) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-brand" }),
            responsibility
          ] }, responsibility)) }),
          /* @__PURE__ */ jsx("h2", { className: "mt-8 text-lg font-bold", children: t("job.skills", "Professional skills") }),
          /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2", children: job.skills.map((skill) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-brand" }),
            skill
          ] }, skill)) }),
          job.contactInstructions && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h2", { className: "mt-8 text-lg font-bold", children: t("job.contactInstructions", "Contact or application instructions") }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground", children: job.contactInstructions })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-2 border-t pt-5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: t("job.tags", "Tags:") }),
            job.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "rounded-md border-brand-soft bg-brand-soft text-brand", children: tag }, tag))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t("job.share", "Share:") }),
            /* @__PURE__ */ jsx(Facebook, { className: "h-4 w-4 text-muted-foreground hover:text-brand" }),
            /* @__PURE__ */ jsx(Twitter, { className: "h-4 w-4 text-muted-foreground hover:text-brand" }),
            /* @__PURE__ */ jsx(Linkedin, { className: "h-4 w-4 text-muted-foreground hover:text-brand" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-10 text-2xl font-bold", children: t("job.related", "Related jobs") }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: related.map((relatedJob) => /* @__PURE__ */ jsx(JobCard, { job: relatedJob }, relatedJob.id)) })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("job.overview", "Job overview") }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-4 text-sm", children: [{
            icon: Briefcase,
            label: t("job.title", "Job title"),
            value: job.title
          }, {
            icon: Layers,
            label: t("job.type", "Job type"),
            value: tt(job.typeLabel || job.type)
          }, {
            icon: Tag,
            label: t("common.category", "Category"),
            value: tt(categoryName)
          }, {
            icon: DollarSign,
            label: t("common.salary", "Salary"),
            value: `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} DZD`
          }, {
            icon: MapPin,
            label: t("common.location", "Location"),
            value: displayLocationName
          }].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand", children: /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: item.label }),
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: item.value })
            ] })
          ] }, item.label)) })
        ] }),
        !user ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("job.apply", "Apply for this job") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Log in to save your application to your account and track it from your profile." }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/auth", search: {
            mode: "login"
          }, children: t("auth.logIn", "Log in") }) })
        ] }) : user.accountType === "employer" ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("job.employerPostJob", "Post a job") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("job.employerPostDesc", "Looking to hire? Publish a job opening to attract candidates directly.") }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/post-job", children: t("job.employerPostJob", "Post a job") }) })
        ] }) : isOwnJob ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("job.yourListing", "Your listing") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("job.yourListingDesc", "This is your job posting. Manage it from your dashboard.") }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90", children: /* @__PURE__ */ jsx(Link, { to: "/profile", children: t("job.openDashboard", "Open dashboard") }) })
        ] }) : hasApplied ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("job.applicationRecorded", "Application recorded") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "This job is already in your applied list. You can review it from your profile." }),
          /* @__PURE__ */ jsx(Button, { onClick: fetchEmployerProfile, className: "mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90", children: t("job.viewProfile", "View profile") })
        ] }) : /* @__PURE__ */ jsxs("form", { id: "job-application-form", onSubmit: handleApply, className: "rounded-2xl bg-brand-soft/60 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold", children: t("job.contactMethod", "Contact method") }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Share the easiest way for the employer to reach you." }),
          userContacts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl bg-white p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900", children: t("job.savedContactShortcuts", "Your saved contact shortcuts") }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: userContacts.map((contact) => /* @__PURE__ */ jsxs("a", { href: contact.href, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100", children: [
              /* @__PURE__ */ jsx(contact.icon, { className: "h-4 w-4 text-slate-500" }),
              /* @__PURE__ */ jsxs("span", { children: [
                contact.label,
                ": ",
                contact.value
              ] })
            ] }, contact.label)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-white px-3", children: [
              /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { required: true, value: primaryContact, onChange: (e) => setPrimaryContact(e.target.value), placeholder: "WhatsApp number, Telegram username, or email", className: "border-0 shadow-none focus-visible:ring-0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-white px-3", children: [
              /* @__PURE__ */ jsx(PhoneCall, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { value: secondaryContact, onChange: (e) => setSecondaryContact(e.target.value), placeholder: "Alternative phone or profile link", className: "border-0 shadow-none focus-visible:ring-0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-white px-3", children: [
              /* @__PURE__ */ jsx(Globe2, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { value: contactLink, onChange: (e) => setContactLink(e.target.value), placeholder: "Link (portfolio, LinkedIn, etc.)", className: "border-0 shadow-none focus-visible:ring-0" })
            ] }),
            /* @__PURE__ */ jsx(Textarea, { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Short note for the employer", rows: 4, className: "bg-white" }),
            /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isSubmitting, className: "w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90", children: [
              /* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }),
              isSubmitting ? t("postAnnouncement.publishing", "Publishing...") : t("job.apply", "Apply for this job")
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(Dialog, { open: showEmployer, onOpenChange: setShowEmployer, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: t("job.employerProfile", "Employer Profile") }) }),
      loadingEmployer ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }) }) : employerData ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-16 w-16 border", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: employerData.avatar || employerData.photoURL }),
            /* @__PURE__ */ jsx(AvatarFallback, { children: employerData.fullName?.slice(0, 2) || "EM" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold", children: employerData.fullName }),
            employerData.companyName && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5" }),
              employerData.companyName
            ] }),
            employerData.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
              employerData.location
            ] })
          ] })
        ] }),
        employerData.bio && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: employerData.bio }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          employerData.email && /* @__PURE__ */ jsxs("a", { href: `mailto:${employerData.email}`, className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
            employerData.email
          ] }),
          employerData.phone && /* @__PURE__ */ jsxs("a", { href: `tel:${employerData.phone}`, className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(PhoneCall, { className: "h-4 w-4" }),
            employerData.phone
          ] }),
          employerData.website && /* @__PURE__ */ jsxs("a", { href: employerData.website.startsWith("http") ? employerData.website : `https://${employerData.website}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Globe2, { className: "h-4 w-4" }),
            employerData.website
          ] }),
          employerData.whatsapp && /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${employerData.whatsapp.replace(/[^0-9]/g, "")}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
            "WhatsApp"
          ] }),
          employerData.telegram && /* @__PURE__ */ jsxs("a", { href: `https://t.me/${employerData.telegram.replace(/^@/, "")}`, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-brand hover:underline", children: [
            /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
            "@",
            employerData.telegram.replace(/^@/, "")
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: "Could not load employer profile." })
    ] }) })
  ] });
}
export {
  JobDetail as component
};
