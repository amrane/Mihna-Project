import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, Check, MapPin, Tag, X, ArrowRight, ArrowLeft, AlertTriangle, CircleHelp } from "lucide-react";
import { i as cn, j as buttonVariants, H as Header, B as Button, F as Footer, T as TooltipProvider, e as Tooltip, f as TooltipTrigger, h as TooltipContent, k as announcementService } from "./Footer-CIdxXT3C.js";
import { I as Input } from "./input-BAq2Xo4A.js";
import { L as Label } from "./label-Dv_tdSeV.js";
import { T as Textarea } from "./textarea-CoGHL6vu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_bkB_S9.js";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { u as useAuth, a as useI18n, e as Route } from "./router-Bte9I49t.js";
import { toast } from "sonner";
import { b as useWilayas } from "./use-firestore-uoDfirYi.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Lead", "Open"];
const AVAILABILITY_OPTIONS = ["Available immediately", "Available this week", "Available this month", "Open to discussion"];
const getSliderStep = (value) => {
  if (value < 5e3) return 50;
  if (value < 2e4) return 200;
  if (value < 5e4) return 500;
  if (value < 1e5) return 2e3;
  return 5e3;
};
function FieldLabel({
  label,
  tooltip,
  required
}) {
  if (!tooltip) {
    return /* @__PURE__ */ jsxs(Label, { className: "mb-2 block text-base font-semibold text-slate-800", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
    ] });
  }
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
    /* @__PURE__ */ jsxs(Label, { className: "block text-base font-semibold text-slate-800", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
    ] }),
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { type: "button", className: "inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand/30", "aria-label": label, children: /* @__PURE__ */ jsx(CircleHelp, { className: "h-3.5 w-3.5" }) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { className: "max-w-72 rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-white shadow-xl", children: tooltip })
    ] })
  ] }) });
}
function PostAnnouncement() {
  const {
    user
  } = useAuth();
  const {
    t,
    tt,
    locale
  } = useI18n();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [location, setLocation] = useState(user?.location || "");
  const [serverTags, setServerTags] = useState([]);
  const [serverCategories, setServerCategories] = useState([]);
  const {
    data: wilayas,
    loading: wilayasLoading
  } = useWilayas();
  const budgetSliderMax = 5e5;
  const [form, setForm] = useState({
    headline: "",
    category: search.category || "",
    workPreference: search.type || user?.workPreference || "both",
    experienceLevel: "Open",
    yearsExperience: "1",
    budgetMin: "",
    budgetMax: "",
    budgetPeriod: "monthly",
    availability: "Available immediately",
    skills: "",
    tags: [],
    content: ""
  });
  useEffect(() => {
    if (search.type && search.type !== form.workPreference) {
      setForm((prev) => ({
        ...prev,
        workPreference: search.type
      }));
    }
  }, [search.type]);
  useEffect(() => {
    fetch("/api/tags").then((r) => r.ok && r.json()).then((d) => Array.isArray(d) && setServerTags(d)).catch(() => {
    });
    fetch("/api/data/categories").then((r) => r.ok && r.json()).then((d) => {
      if (Array.isArray(d)) setServerCategories(d.map((c) => c.name || c.label || c).filter(Boolean));
    }).catch(() => {
    });
  }, []);
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const isFreelance = form.workPreference === "freelance";
  const suggestedTags = serverTags.length > 0 ? serverTags : ["React", "Node.js", "TypeScript", "Python", "JavaScript", "PHP", "Laravel", "UI/UX", "Figma", "SEO", "Google Ads", "Content Writing", "Translation", "English", "French", "Arabic", "Video Editing", "Social Media", "Data Entry", "Excel", "Customer Service", "Sales", "Accounting", "Project Management", "Graphic Design", "Web Development", "Mobile Development"];
  const steps = [{
    n: 1,
    label: t("postAnnouncement.step.mainInfo", "Main Info"),
    active: currentStep >= 1
  }, {
    n: 2,
    label: t("postAnnouncement.step.describe", "Describe"),
    active: currentStep >= 2
  }, {
    n: 3,
    label: t("postAnnouncement.step.details", "Details"),
    active: currentStep >= 3
  }];
  const categoryOptions = useMemo(() => {
    if (serverCategories.length > 0) return serverCategories.sort((a, b) => a.localeCompare(b));
    return ["Web Development", "Graphic Design", "Mobile Development", "Content Writing", "UI/UX Design", "Marketing & SEO", "Sales", "Accounting", "Administrative", "Customer Service", "Healthcare", "Teaching"].sort((a, b) => a.localeCompare(b));
  }, [serverCategories]);
  const filteredTagSuggestions = useMemo(() => tagInput.trim() ? suggestedTags.filter((t2) => t2.toLowerCase().includes(tagInput.toLowerCase()) && !form.tags.includes(t2)).slice(0, 8) : [], [tagInput, form.tags, suggestedTags]);
  const nextStep = () => {
    if (currentStep === 1 && !form.headline) {
      toast.error("Add a headline before continuing");
      return;
    }
    if (currentStep === 1 && !form.category) {
      toast.error("Select a category before continuing");
      return;
    }
    if (currentStep === 2 && !form.content) {
      toast.error("Write the offer details before continuing");
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, 3));
  };
  const publish = async () => {
    if (!user?.uid) {
      toast.error(t("postAnnouncement.mustLogin", "You must be logged in to create a talent offer."));
      return;
    }
    if (user.accountType !== "candidate") {
      toast.error(t("postAnnouncement.employerToast", "Employer accounts should use the job posting flow instead."));
      navigate({
        to: "/post-job",
        search: {
          category: "business"
        }
      });
      return;
    }
    if (!form.headline || !form.content || !form.category) {
      toast.error(t("postAnnouncement.requiredToast", "Fill in the headline, category, and details."));
      return;
    }
    if (form.budgetMin && form.budgetMax && Number(form.budgetMin) > Number(form.budgetMax)) {
      toast.error("Min budget cannot exceed max budget");
      return;
    }
    try {
      setSubmitting(true);
      const skills = form.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
      const allTags = [.../* @__PURE__ */ new Set([...form.tags, form.category, ...skills])];
      const salaryMin = form.budgetMin ? parseInt(form.budgetMin, 10) || 0 : 0;
      const salaryMax = form.budgetMax ? parseInt(form.budgetMax, 10) || 0 : 0;
      await announcementService.create({
        title: form.headline,
        content: form.content,
        authorId: user.uid,
        authorName: user.displayName || user.fullName || "Candidate",
        announcementType: "jobseeking",
        category: form.category,
        location,
        workPreference: form.workPreference,
        experienceLevel: form.experienceLevel,
        yearsExperience: Number(form.yearsExperience || 0),
        expectedSalary: salaryMax || salaryMin,
        salaryMin,
        salaryMax,
        salaryPeriod: form.budgetPeriod,
        availability: form.availability,
        skills,
        tags: allTags,
        attachments: []
      });
      toast.success(t("postAnnouncement.successToast", "Talent offer published"));
      navigate({
        to: "/profile"
      });
    } catch (error) {
      console.error("Error posting talent offer:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`${t("postAnnouncement.failedToast", "Failed to publish your talent offer.")} ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      nextStep();
    }
  };
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8faf9]", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-8 shadow-sm sm:p-12", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsx("h1", { className: "mt-6 text-3xl font-bold text-slate-950", children: t("postAnnouncement.login.title", "Log in to create your talent offer") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-slate-500", children: t("postAnnouncement.login.desc", "Showcase your skills and availability to employers in Alger by creating a professional jobseeking post.") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/auth",
            search: {
              mode: "login"
            }
          }), variant: "outline", className: "h-12 rounded-xl px-8", children: t("auth.logIn", "Log in") }),
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/auth",
            search: {
              mode: "register"
            }
          }), className: "h-12 rounded-xl bg-brand px-8 text-brand-foreground hover:bg-brand/90", children: t("postAnnouncement.login.cta", "Get Started") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (user.accountType !== "candidate") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8faf9]", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto flex max-w-3xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border bg-white p-10 text-center shadow-sm", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold", children: t("postAnnouncement.employer.title", "Talent offers are for candidates") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: t("postAnnouncement.employer.desc", "Employer accounts should publish job openings so candidates can apply directly.") }),
        /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
          to: "/post-job",
          search: {
            category: "business"
          }
        }), className: "mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90", children: t("postAnnouncement.employer.cta", "Go to job posting") })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8faf9]", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-6 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
          t("postAnnouncement.badge", "Talent offer")
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-bold text-slate-900", children: form.workPreference === "freelance" ? t("postAnnouncement.headlineFreelance", "Offer your freelance services") : form.workPreference === "full-time" ? t("postAnnouncement.headlineFulltime", "Showcase your full-time availability") : t("postAnnouncement.headlineBoth", "Showcase your professional profile") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg text-slate-600", children: form.workPreference === "freelance" ? t("postAnnouncement.subtitleFreelance", "Let employers know what you can deliver for their projects.") : form.workPreference === "full-time" ? t("postAnnouncement.subtitleFulltime", "Tell employers about your experience, skills, and expectations.") : t("postAnnouncement.subtitleBoth", "Let employers know about your skills and what opportunities you're seeking.") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 flex flex-wrap items-center gap-5", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: `flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${step.active ? "bg-brand text-white" : "bg-slate-200 text-slate-600"}`, children: step.active && step.n !== 1 ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }) : step.n }),
        /* @__PURE__ */ jsx("span", { className: `text-lg font-semibold ${step.active ? "text-brand" : "text-slate-400"}`, children: step.label }),
        index < steps.length - 1 && /* @__PURE__ */ jsx("span", { className: "hidden h-px w-16 bg-slate-300 sm:block" })
      ] }, step.n)) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-visible rounded-2xl border bg-white p-6 shadow-sm sm:p-12", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
        currentStep === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.headline", "Headline"), tooltip: isFreelance ? "Create a catchy headline that describes your key skills and what you offer (e.g., 'React Developer with 5 Years Experience')" : "Write a compelling headline about your professional focus (e.g., 'Full-Stack Developer Seeking Senior Position')" }),
            /* @__PURE__ */ jsx(Input, { value: form.headline, onChange: (e) => updateField("headline", e.target.value), placeholder: isFreelance ? t("postAnnouncement.headlinePlaceholder.freelance", "e.g., React Developer with 5 Years Experience") : t("postAnnouncement.headlinePlaceholder.fulltime", "e.g., Full-Stack Developer Seeking Senior Position"), className: "mt-3 h-14 rounded-xl text-lg" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.category", "Category"), tooltip: "Select the field that best matches your expertise" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
                  categoryOptions.slice(0, 6).map((category) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                    setShowCustomCategory(false);
                    updateField("category", category);
                  }, className: `min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${form.category === category ? "border-brand bg-brand text-brand-foreground shadow-sm" : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"}`, children: tt(category) }, category)),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                    setShowCustomCategory(true);
                    setCustomCategoryInput("");
                    updateField("category", "");
                  }, className: `min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${showCustomCategory ? "border-brand bg-brand text-brand-foreground shadow-sm" : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"}`, children: "Other" })
                ] }),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setShowAllCategories((value) => !value), className: "h-11 rounded-xl", children: showAllCategories ? t("postAnnouncement.hideAll", "Hide all categories") : t("postAnnouncement.browseAll", "Browse all categories") }),
                showCustomCategory && /* @__PURE__ */ jsx(Input, { value: customCategoryInput, onChange: (e) => {
                  setCustomCategoryInput(e.target.value);
                  updateField("category", e.target.value);
                }, placeholder: "Type your custom category...", className: "mt-3 h-12 rounded-xl text-base" }),
                showAllCategories && /* @__PURE__ */ jsxs(Select, { value: form.category, onValueChange: (v) => {
                  if (v === "__other__") {
                    setShowCustomCategory(true);
                    setCustomCategoryInput("");
                    updateField("category", "");
                  } else {
                    setShowCustomCategory(false);
                    updateField("category", v);
                  }
                }, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-14 rounded-xl text-base", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("postAnnouncement.selectCategory", "Select a category") }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    categoryOptions.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat, children: tt(cat) }, cat)),
                    /* @__PURE__ */ jsx(SelectItem, { value: "__other__", children: "Other" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.location", "Location"), tooltip: isFreelance ? "Where are you based? (Optional for remote work)" : "Your location or preferred work location" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-xl border px-4", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-slate-400" }),
                /* @__PURE__ */ jsxs(Select, { value: location, onValueChange: (v) => setLocation(v), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-14 border-0 text-lg shadow-none focus:ring-0", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("postAnnouncement.locationPlaceholder", "Select a wilaya") }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: wilayasLoading ? /* @__PURE__ */ jsx(SelectItem, { value: "loading", disabled: true, children: t("postAnnouncement.loadingWilayas", "Loading wilayas...") }) : wilayas?.map((wilaya) => /* @__PURE__ */ jsx(SelectItem, { value: wilaya.name, children: wilaya.name }, wilaya.code)) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.workType", "Work Type"), tooltip: "Choose the type of work arrangement you're seeking" }),
              /* @__PURE__ */ jsx("div", { className: "mt-3 flex gap-3", children: ["freelance", "full-time"].map((type) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateField("workPreference", type), className: `flex-1 rounded-xl px-4 py-3 text-center font-medium transition ${form.workPreference === type ? "bg-brand text-brand-foreground" : "border border-slate-200 text-slate-700 hover:border-slate-300"}`, children: tt(type) }, type)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.experienceLevel", "Experience Level"), tooltip: "What's your professional level?" }),
              /* @__PURE__ */ jsx("select", { value: form.experienceLevel, onChange: (e) => updateField("experienceLevel", e.target.value), className: "mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20", children: EXPERIENCE_LEVELS.map((value) => /* @__PURE__ */ jsx("option", { value, children: tt(value) }, value)) })
            ] })
          ] })
        ] }),
        currentStep === 2 && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.description", "Description"), tooltip: isFreelance ? "Describe what you can do, your experience, completed projects, and what makes you unique" : "Share your professional background, achievements, and what you're looking for in a role" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.content, onChange: (e) => updateField("content", e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
          }, placeholder: isFreelance ? t("postAnnouncement.descriptionPlaceholder.freelance", "Describe your freelance services, past projects, and how you can help clients...") : t("postAnnouncement.descriptionPlaceholder.fulltime", "Describe your professional background, key achievements, and what you're looking for..."), rows: 8, className: "mt-3 rounded-xl text-base" })
        ] }) }),
        currentStep === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-secondary/60 p-5", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-950", children: t("postJob.review", "Review your post") }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 text-sm md:grid-cols-2", children: [[t("postAnnouncement.reviewHeadline", "Headline"), form.headline], [t("postAnnouncement.reviewCategory", "Category"), form.category], [t("postAnnouncement.reviewLocation", "Location"), location || "Not specified"]].map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-background p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: label }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 font-semibold text-slate-900", children: value })
            ] }, label)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl bg-background p-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: t("postAnnouncement.reviewDetails", "Details") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600", children: form.content })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.yearsExperience", "Years of experience"), tooltip: "How many years of professional experience do you have?" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: "0", value: form.yearsExperience, onChange: (e) => updateField("yearsExperience", e.target.value), onKeyDown: (e) => e.key === "Enter" && e.preventDefault(), className: "mt-3 h-14 rounded-xl text-lg" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.budgetLabel", "Budget / Salary"), tooltip: "Your expected salary range" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Input, { type: "number", value: form.budgetMin, onChange: (e) => updateField("budgetMin", e.target.value), placeholder: "Min", onKeyDown: (e) => e.key === "Enter" && e.preventDefault(), className: "h-14 rounded-xl text-lg" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg text-slate-400", children: "—" }),
                /* @__PURE__ */ jsx(Input, { type: "number", value: form.budgetMax, onChange: (e) => updateField("budgetMax", e.target.value), placeholder: "Max", onKeyDown: (e) => e.key === "Enter" && e.preventDefault(), className: "h-14 rounded-xl text-lg" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative mt-4 h-2 rounded-full bg-slate-200", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute h-2 rounded-full bg-brand", style: {
                  left: `${Math.min(Number(form.budgetMin) / budgetSliderMax * 100, 100)}%`,
                  right: `${100 - Math.min(Number(form.budgetMax) / budgetSliderMax * 100, 100)}%`
                } }),
                /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: budgetSliderMax, step: 1, value: Math.min(Number(form.budgetMin), Number(form.budgetMax) || budgetSliderMax), onChange: (e) => {
                  const raw = Number(e.target.value);
                  const step = getSliderStep(raw);
                  const snapped = Math.round(raw / step) * step;
                  const v = Math.min(snapped, Number(form.budgetMax) || budgetSliderMax);
                  updateField("budgetMin", String(v));
                }, className: "absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" }),
                /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: budgetSliderMax, step: 1, value: Math.max(Number(form.budgetMax), Number(form.budgetMin)), onChange: (e) => {
                  const raw = Number(e.target.value);
                  const step = getSliderStep(raw);
                  const snapped = Math.round(raw / step) * step;
                  const v = Math.max(snapped, Number(form.budgetMin));
                  updateField("budgetMax", String(v));
                }, className: "absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.salaryPeriod", "Salary period"), tooltip: "How often you expect to be paid" }),
              /* @__PURE__ */ jsxs("select", { value: form.budgetPeriod, onChange: (e) => updateField("budgetPeriod", e.target.value), className: "mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20", children: [
                /* @__PURE__ */ jsx("option", { value: "monthly", children: t("period.monthly", "monthly") }),
                /* @__PURE__ */ jsx("option", { value: "project", children: t("period.project", "project") }),
                /* @__PURE__ */ jsx("option", { value: "weekly", children: t("period.weekly", "weekly") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.availability", "Availability"), tooltip: "When can you start working?" }),
              /* @__PURE__ */ jsx("select", { value: form.availability, onChange: (e) => updateField("availability", e.target.value), className: "mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20", children: AVAILABILITY_OPTIONS.map((value) => /* @__PURE__ */ jsx("option", { value, children: tt(value) }, value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { label: t("job.skills", "Professional skills"), tooltip: "List your key skills separated by commas" }),
            /* @__PURE__ */ jsx(Input, { value: form.skills, onChange: (e) => updateField("skills", e.target.value), onKeyDown: (e) => e.key === "Enter" && e.preventDefault(), placeholder: t("postAnnouncement.skillsPlaceholder", "React, TypeScript, UI Design, SEO"), className: "mt-3 h-14 rounded-xl text-lg" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { label: t("postAnnouncement.tagsLabel", "Tags"), tooltip: "Add relevant tags to help employers find your offer" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-4", children: [
                /* @__PURE__ */ jsx(Tag, { className: "h-5 w-5 shrink-0 text-slate-400" }),
                /* @__PURE__ */ jsx(Input, { value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: (e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    if (!form.tags.includes(tagInput.trim())) {
                      setForm({
                        ...form,
                        tags: [...form.tags, tagInput.trim()]
                      });
                    }
                    setTagInput("");
                  }
                }, placeholder: t("postAnnouncement.tagsPlaceholder", "Type or select tags"), className: "h-14 border-0 text-lg shadow-none focus:ring-0 px-0" })
              ] }),
              filteredTagSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg", children: filteredTagSuggestions.map((suggestion) => /* @__PURE__ */ jsx("button", { type: "button", onMouseDown: (e) => e.preventDefault(), onClick: () => {
                if (!form.tags.includes(suggestion)) {
                  setForm({
                    ...form,
                    tags: [...form.tags, suggestion]
                  });
                }
                setTagInput("");
              }, className: "w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-brand-soft hover:text-brand", children: suggestion }, suggestion)) })
            ] }),
            form.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: form.tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand", children: [
              tag,
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setForm({
                ...form,
                tags: form.tags.filter((t2) => t2 !== tag)
              }), className: "ml-0.5 rounded-full p-0.5 transition hover:bg-brand/20", children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }) })
            ] }, tag)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between", children: [
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", disabled: currentStep === 1, onClick: () => setCurrentStep((step) => Math.max(step - 1, 1)), className: "h-14 rounded-xl px-8 text-base", children: [
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }),
            " ",
            t("postAnnouncement.back", "Back")
          ] }),
          currentStep < 3 ? /* @__PURE__ */ jsxs(Button, { type: "button", onClick: nextStep, className: "h-14 rounded-xl bg-brand px-8 text-base text-brand-foreground hover:bg-brand/90", children: [
            currentStep === 2 ? t("postAnnouncement.continueDetails", "Continue to Details") : t("postAnnouncement.nextStep", "Next Step"),
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) : /* @__PURE__ */ jsxs(Button, { type: "button", disabled: submitting, onClick: () => setShowConfirm(true), className: "h-14 rounded-xl bg-brand px-10 text-base text-brand-foreground hover:bg-brand/90", children: [
            submitting ? t("postAnnouncement.publishing", "Publishing...") : t("postAnnouncement.publish", "Publish talent offer"),
            " ",
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-3 h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "ml-3 h-5 w-5" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(AlertDialog, { open: showConfirm, onOpenChange: setShowConfirm, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-amber-500" }),
            t("postAnnouncement.confirm.title", "Publish your talent offer?")
          ] }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: t("postAnnouncement.confirm.desc", "Once published, your talent offer will be visible to all employers. Make sure all information is accurate.") })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { children: t("common.cancel", "Cancel") }),
          /* @__PURE__ */ jsx(AlertDialogAction, { onClick: async () => {
            setShowConfirm(false);
            await publish();
          }, className: "bg-brand text-brand-foreground hover:bg-brand/90", children: t("postAnnouncement.publish", "Publish") })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  PostAnnouncement as component
};
