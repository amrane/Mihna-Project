import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Clock3, Laptop, Check, MapPin, Tag, X, ArrowRight, ArrowLeft, CircleHelp } from "lucide-react";
import { H as Header, B as Button, F as Footer, T as TooltipProvider, e as Tooltip, f as TooltipTrigger, h as TooltipContent } from "./Footer-CIdxXT3C.js";
import { J as JobCard } from "./JobCard-D8mX-zTy.js";
import { I as Input } from "./input-BAq2Xo4A.js";
import { L as Label } from "./label-Dv_tdSeV.js";
import { T as Textarea } from "./textarea-CoGHL6vu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_bkB_S9.js";
import { a as useAddJob, u as useFirestoreCollection, b as useWilayas } from "./use-firestore-uoDfirYi.js";
import { d as Route, u as useAuth, a as useI18n } from "./router-Bte9I49t.js";
import { toast } from "sonner";
import { C as CATEGORY_CONFIG } from "./categories-CUhIo4Yi.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "./badge-BiVmFZBi.js";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const POST_CONFIG = {
  freelance: {
    icon: Laptop,
    eyebrow: "Freelance project",
    title: "Post a Freelance Project",
    subtitle: "Fill in the details below to reach qualified independent talent.",
    titleLabel: "Project Title",
    titlePlaceholder: "e.g., Build a responsive portfolio website",
    typeLabel: "Payment type",
    typeOptions: ["Fixed budget", "Paid by hour", "Short mission", "Remote task"],
    budgetLabel: "Budget",
    budgetPlaceholder: "e.g., 80,000 DZD",
    descriptionPlaceholder: "Describe deliverables, deadline, required skills, and how the freelancer will work with you."
  },
  "full-time": {
    icon: Clock3,
    eyebrow: "Full-time role",
    title: "Post a Full-time Job",
    subtitle: "Create a full-time role with clear requirements, salary, and location.",
    titleLabel: "Job Title",
    titlePlaceholder: "e.g., Senior Frontend Developer",
    typeLabel: "Work arrangement",
    typeOptions: ["Full-time office job", "Full-time remote job", "Full-time hybrid job", "Temporary full-time job", "Long-term full-time job"],
    budgetLabel: "Monthly Salary",
    budgetPlaceholder: "e.g., 120,000 DZD / month",
    descriptionPlaceholder: "Describe responsibilities, team structure, working hours, benefits, and candidate profile."
  },
  business: {
    icon: Building2,
    eyebrow: "Business owner request",
    title: "Post a Business Need",
    subtitle: "Describe what your company needs and connect with the right workers.",
    titleLabel: "Business Need",
    titlePlaceholder: "e.g., Hire a team for a new e-commerce launch",
    typeLabel: "Who do you need?",
    typeOptions: ["Freelancer", "Full-time employee"],
    budgetLabel: "Estimated Budget",
    budgetPlaceholder: "e.g., 500,000 DZD",
    descriptionPlaceholder: "Explain the company goal, required roles, project scope, timeline, and preferred collaboration model."
  }
};
const normalizeKind = (value) => value === "freelance" || value === "business" || value === "full-time" ? value : "full-time";
function FieldLabel({
  children,
  required,
  details
}) {
  return /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2 text-base text-slate-800", children: [
    /* @__PURE__ */ jsx("span", { children }),
    required && details && /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { type: "button", className: "inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand/30", "aria-label": `${children} details`, children: /* @__PURE__ */ jsx(CircleHelp, { className: "h-3.5 w-3.5" }) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { className: "max-w-72 rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-white shadow-xl", children: details })
    ] })
  ] });
}
const getSliderStep = (value) => {
  if (value < 5e3) return 50;
  if (value < 2e4) return 200;
  if (value < 5e4) return 500;
  if (value < 1e5) return 2e3;
  return 5e3;
};
function PostJob() {
  const {
    category: preset
  } = Route.useSearch();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    t,
    locale
  } = useI18n();
  const {
    addJob,
    loading: submitting
  } = useAddJob();
  const [kind, setKind] = useState(normalizeKind(preset));
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [serverTags, setServerTags] = useState([]);
  const {
    data: jobs
  } = useFirestoreCollection("jobs");
  const {
    data: wilayas,
    loading: wilayasLoading
  } = useWilayas();
  const config = POST_CONFIG[kind];
  const categoryConfig = CATEGORY_CONFIG[kind];
  const budgetSliderMax = 5e5;
  const suggestedJobs = useMemo(() => jobs.filter((job) => kind === "business" ? true : job.type === kind).slice(0, 3), [jobs, kind]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "500",
    budgetMax: "",
    category: CATEGORY_CONFIG[normalizeKind(preset)].popular[0],
    location: user?.location || "",
    timeframeValue: "",
    timeframeUnit: "months",
    skills: "",
    contactInstructions: "",
    tags: [],
    type: config.typeOptions[0]
  });
  const suggestedJobTags = serverTags.length > 0 ? serverTags : ["React", "Node.js", "TypeScript", "Python", "JavaScript", "PHP", "Laravel", "UI/UX", "Figma", "SEO", "Google Ads", "Content Writing", "Translation", "English", "French", "Arabic", "Video Editing", "Social Media", "Data Entry", "Excel", "Customer Service", "Sales", "Accounting", "Project Management", "Graphic Design", "Web Development", "Mobile Development"];
  const filteredTagSuggestions = useMemo(() => tagInput.trim() ? suggestedJobTags.filter((t2) => t2.toLowerCase().includes(tagInput.toLowerCase()) && !form.tags.includes(t2)).slice(0, 8) : [], [tagInput, form.tags, suggestedJobTags]);
  const steps = useMemo(() => [{
    n: 1,
    label: "Basic Info",
    active: currentStep >= 1
  }, {
    n: 2,
    label: "Description",
    active: currentStep >= 2
  }, {
    n: 3,
    label: "Details",
    active: currentStep >= 3
  }], [currentStep]);
  useEffect(() => {
    const next = normalizeKind(preset);
    const nextConfig = POST_CONFIG[next];
    setKind(next);
    setCurrentStep(1);
    setShowAllCategories(false);
    setTagInput("");
    setForm((f) => ({
      ...f,
      type: nextConfig.typeOptions[0],
      category: CATEGORY_CONFIG[next].popular[0],
      timeframeValue: "",
      timeframeUnit: "months",
      tags: []
    }));
  }, [preset]);
  const nextStep = () => {
    if (currentStep === 1 && !form.title) {
      toast.error(`Fill ${config.titleLabel.toLowerCase()} first`);
      return;
    }
    if (currentStep === 1 && (!form.location || form.location === "Anywhere")) {
      toast.error("Choose a location before continuing");
      return;
    }
    if (currentStep === 2 && !form.description) {
      toast.error("Write the description first");
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, 3));
  };
  const validateDetailsStep = () => {
    if (!form.location || form.location === "Anywhere") {
      toast.error("Choose a location before publishing");
      return false;
    }
    if (!form.budgetMin.trim() || !form.budgetMax.trim()) {
      toast.error(`Fill ${config.budgetLabel.toLowerCase()} (min & max) before publishing`);
      return false;
    }
    if (Number(form.budgetMin) > Number(form.budgetMax)) {
      toast.error("Min budget cannot exceed max budget");
      return false;
    }
    if (Number(form.budgetMin) < 500) {
      toast.error("Minimum budget is 500 DZD");
      return false;
    }
    if (form.timeframeUnit !== "not-specified" && !form.timeframeValue.trim()) {
      toast.error("Add a timeframe before publishing");
      return false;
    }
    if (!form.skills.trim()) {
      toast.error("Add skills or requirements before publishing");
      return false;
    }
    if (!form.contactInstructions.trim()) {
      toast.error("Add contact or application instructions before publishing");
      return false;
    }
    return true;
  };
  const submit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      nextStep();
      return;
    }
    if (!form.title || !form.description) return toast.error("Fill title and description");
    if (!form.category) return toast.error("Pick a category before publishing");
    if (!user) return toast.error("You must be logged in to post a job");
    if (!validateDetailsStep()) return;
    try {
      const salaryMin = parseInt(form.budgetMin.replace(/[^0-9]/g, ""), 10) || 0;
      const salaryMax = parseInt(form.budgetMax.replace(/[^0-9]/g, ""), 10) || 0;
      const jobType = kind === "business" ? form.type === "Freelancer" ? "freelance" : "full-time" : kind === "freelance" ? "freelance" : "full-time";
      const skills = form.skills ? form.skills.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : [];
      const rawResponsibilities = form.description.split("\n").map((s) => s.trim()).filter(Boolean);
      const responsibilities = rawResponsibilities.length > 0 ? rawResponsibilities : [form.description.trim()];
      const tags = [...new Set([...form.tags, form.location, form.category, form.type].filter(Boolean))];
      const postedAgo = "Just now";
      await addJob({
        title: form.title,
        company: user.companyName || user.fullName || "Anonymous",
        companyLogo: user.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(form.title)}&backgroundColor=004225,960018,1f2937`,
        type: jobType,
        typeLabel: form.type,
        category: form.category,
        location: form.location,
        salaryMin,
        salaryMax,
        timeframe: form.timeframeUnit === "not-specified" ? "Not specified" : `${form.timeframeValue.trim()} ${form.timeframeUnit}`,
        description: form.description,
        responsibilities,
        requirements: [form.timeframeUnit === "not-specified" ? "Timeframe: Not specified" : form.timeframeValue.trim() ? `Timeframe: ${form.timeframeValue.trim()} ${form.timeframeUnit}` : "", form.contactInstructions.trim() ? `Application instructions: ${form.contactInstructions.trim()}` : ""].filter(Boolean),
        skills,
        tags,
        contactInstructions: form.contactInstructions.trim(),
        postedAgo,
        employerId: user.uid || user.email || "anonymous",
        employerEmail: user.email || ""
      });
      toast.success(`${config.eyebrow} posted successfully!`);
      navigate({
        to: "/profile"
      });
    } catch (error) {
      const firestoreError = error;
      console.error("Error posting job:", firestoreError);
      if (firestoreError?.code === "permission-denied") {
        toast.error("Permission denied. Make sure you are logged in and your account is verified.");
      } else if (firestoreError?.code === "unavailable") {
        toast.error("Network error. Check your connection and try again.");
      } else {
        toast.error(`Failed to post job: ${firestoreError?.message ?? "Unknown error. Check browser console."}`);
      }
    }
  };
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8faf9]", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-8 shadow-sm sm:p-12", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand", children: /* @__PURE__ */ jsx(config.icon, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-3xl font-bold text-slate-950", children: [
          "Log in to post a ",
          config.eyebrow.toLowerCase()
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-slate-500", children: [
          "You need an account to publish ",
          kind === "business" ? "business requests" : `${kind} positions`,
          " and connect with talent."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/auth",
            search: {
              mode: "login"
            }
          }), variant: "outline", className: "h-12 rounded-xl px-8", children: "Log in" }),
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/auth",
            search: {
              mode: "register"
            }
          }), className: "h-12 rounded-xl bg-brand px-8 text-brand-foreground hover:bg-brand/90", children: "Join Mihna" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (user.accountType !== "employer") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8faf9]", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-white p-8 shadow-sm sm:p-12", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand", children: /* @__PURE__ */ jsx(Building2, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsx("h1", { className: "mt-6 text-3xl font-bold text-slate-950", children: t("postJob.employerRequired", "Employer account required") }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-slate-500", children: "Job publishing is available for employer accounts. You can switch your account type from your profile settings or post an announcement instead." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/profile"
          }), variant: "outline", className: "h-12 rounded-xl px-8", children: "Open profile" }),
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
            to: "/post-announcement"
          }), className: "h-12 rounded-xl bg-brand px-8 text-brand-foreground hover:bg-brand/90", children: "Post announcement" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f8faf9]", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-8 py-10 sm:px-10 lg:px-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand", children: [
          /* @__PURE__ */ jsx(config.icon, { className: "h-4 w-4" }),
          config.eyebrow
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-4 text-4xl font-bold tracking-normal text-slate-950", children: config.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-xl text-slate-500", children: config.subtitle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 flex flex-wrap items-center gap-5", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: `flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${step.active ? "bg-brand text-white" : "bg-slate-200 text-slate-600"}`, children: step.active && step.n !== 1 ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }) : step.n }),
        /* @__PURE__ */ jsx("span", { className: `text-lg font-semibold ${step.active ? "text-brand" : "text-slate-400"}`, children: step.label }),
        index < steps.length - 1 && /* @__PURE__ */ jsx("span", { className: "hidden h-px w-16 bg-slate-300 sm:block" })
      ] }, step.n)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 120, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "overflow-visible rounded-2xl border bg-white p-6 shadow-sm sm:p-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-7", children: [
          currentStep === 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { required: true, details: `Required. Add a clear ${config.titleLabel.toLowerCase()} so the right people understand the opportunity quickly.`, children: config.titleLabel }),
              /* @__PURE__ */ jsx(Input, { value: form.title, onChange: (e) => setForm({
                ...form,
                title: e.target.value
              }), placeholder: config.titlePlaceholder, className: "mt-3 h-16 rounded-xl text-lg" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(FieldLabel, { required: true, details: "Required. Choose the simplest option that explains how this opportunity works for the person applying.", children: config.typeLabel }),
                /* @__PURE__ */ jsxs(Select, { value: form.type, onValueChange: (v) => setForm({
                  ...form,
                  type: v
                }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "mt-3 h-14 rounded-xl text-lg", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: config.typeOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option, children: option }, option)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(FieldLabel, { required: true, details: "Required. Pick one of the popular categories, or browse all jobs if you do not find the exact one.", children: "Category" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
                    categoryConfig.popular.map((category) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                      setShowCustomCategory(false);
                      setForm({
                        ...form,
                        category
                      });
                    }, className: `min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${form.category === category ? "border-brand bg-brand text-brand-foreground shadow-sm" : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"}`, children: category }, category)),
                    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                      setShowCustomCategory(true);
                      setCustomCategoryInput("");
                      setForm({
                        ...form,
                        category: ""
                      });
                    }, className: `min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${showCustomCategory ? "border-brand bg-brand text-brand-foreground shadow-sm" : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"}`, children: "Other" })
                  ] }),
                  showCustomCategory && /* @__PURE__ */ jsx(Input, { value: customCategoryInput, onChange: (e) => {
                    setCustomCategoryInput(e.target.value);
                    setForm({
                      ...form,
                      category: e.target.value
                    });
                  }, placeholder: "Type your custom category...", className: "mt-3 h-12 rounded-xl text-base" }),
                  /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setShowAllCategories((value) => !value), className: "h-11 rounded-xl", children: showAllCategories ? "Hide all jobs" : "Browse all jobs" }),
                  showAllCategories && /* @__PURE__ */ jsxs(Select, { value: form.category, onValueChange: (v) => {
                    if (v === "__other__") {
                      setShowCustomCategory(true);
                      setCustomCategoryInput("");
                      setForm({
                        ...form,
                        category: ""
                      });
                    } else {
                      setShowCustomCategory(false);
                      setForm({
                        ...form,
                        category: v
                      });
                    }
                  }, children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-14 rounded-xl text-base", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose a job category" }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      categoryConfig.all.map((category) => /* @__PURE__ */ jsx(SelectItem, { value: category, children: category }, category)),
                      /* @__PURE__ */ jsx(SelectItem, { value: "__other__", children: "Other" })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(FieldLabel, { required: true, details: "Required. Pick the wilaya or location where the work is based, even if remote work is possible.", children: "Location" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-xl border px-4", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-slate-400" }),
                /* @__PURE__ */ jsxs(Select, { value: form.location, onValueChange: (v) => setForm({
                  ...form,
                  location: v
                }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-14 border-0 text-lg shadow-none focus:ring-0", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a wilaya" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: wilayasLoading ? /* @__PURE__ */ jsx(SelectItem, { value: "loading", disabled: true, children: "Loading wilayas..." }) : wilayas.map((wilaya) => /* @__PURE__ */ jsx(SelectItem, { value: wilaya.name, children: wilaya.name }, wilaya.code)) })
                ] })
              ] })
            ] })
          ] }),
          currentStep === 2 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, details: "Required. Include responsibilities, requirements, deliverables, timeline, and who should apply.", children: "Description" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.description, onChange: (e) => setForm({
              ...form,
              description: e.target.value
            }), onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
            }, placeholder: config.descriptionPlaceholder, rows: 10, className: "mt-3 rounded-xl text-base" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-slate-500", children: "Explain the work clearly. You can add tasks, requirements, deliverables, and who should apply." })
          ] }),
          currentStep === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-7", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-secondary/60 p-5", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-950", children: t("postJob.review", "Review your post") }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 text-sm md:grid-cols-2", children: [["Title", form.title], [config.typeLabel, form.type], ["Category", form.category], ["Location", form.location]].map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-background p-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: label }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 font-semibold text-slate-900", children: value })
              ] }, label)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl bg-background p-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-slate-400", children: "Description" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600", children: form.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-base text-slate-800", children: config.budgetLabel }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(Input, { type: "number", value: form.budgetMin, onChange: (e) => setForm({
                    ...form,
                    budgetMin: e.target.value
                  }), placeholder: "Min", className: "h-14 rounded-xl text-lg" }),
                  /* @__PURE__ */ jsx("span", { className: "text-lg text-slate-400", children: "—" }),
                  /* @__PURE__ */ jsx(Input, { type: "number", value: form.budgetMax, onChange: (e) => setForm({
                    ...form,
                    budgetMax: e.target.value
                  }), placeholder: "Max", className: "h-14 rounded-xl text-lg" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative mt-4 h-2 rounded-full bg-slate-200", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute h-2 rounded-full bg-brand", style: {
                    left: `${Math.min(Number(form.budgetMin) / budgetSliderMax * 100, 100)}%`,
                    right: `${100 - Math.min(Number(form.budgetMax) / budgetSliderMax * 100, 100)}%`
                  } }),
                  /* @__PURE__ */ jsx("input", { type: "range", min: 500, max: budgetSliderMax, step: 1, value: Math.min(Number(form.budgetMin), Number(form.budgetMax)), onChange: (e) => {
                    const raw = Number(e.target.value);
                    const step = getSliderStep(raw);
                    const snapped = Math.round(raw / step) * step;
                    const v = Math.min(snapped, Number(form.budgetMax) || budgetSliderMax);
                    setForm({
                      ...form,
                      budgetMin: String(v)
                    });
                  }, className: "absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" }),
                  /* @__PURE__ */ jsx("input", { type: "range", min: 500, max: budgetSliderMax, step: 1, value: Math.max(Number(form.budgetMax), Number(form.budgetMin)), onChange: (e) => {
                    const raw = Number(e.target.value);
                    const step = getSliderStep(raw);
                    const snapped = Math.round(raw / step) * step;
                    const v = Math.max(snapped, Number(form.budgetMin));
                    setForm({
                      ...form,
                      budgetMax: String(v)
                    });
                  }, className: "absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-base text-slate-800", children: t("postJob.timeframe", "Timeframe") }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(Input, { type: "number", value: form.timeframeValue, onChange: (e) => setForm({
                    ...form,
                    timeframeValue: e.target.value
                  }), placeholder: "time", disabled: form.timeframeUnit === "not-specified", className: "h-14 flex-1 rounded-xl text-lg" }),
                  /* @__PURE__ */ jsx("span", { className: `text-lg text-slate-400 ${form.timeframeUnit === "not-specified" ? "opacity-30" : ""}`, children: "—" }),
                  /* @__PURE__ */ jsxs("select", { value: form.timeframeUnit, onChange: (e) => setForm({
                    ...form,
                    timeframeUnit: e.target.value
                  }), className: "h-14 min-w-44 rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20", children: [
                    /* @__PURE__ */ jsx("option", { value: "hours", children: "Hours" }),
                    /* @__PURE__ */ jsx("option", { value: "days", children: "Days" }),
                    /* @__PURE__ */ jsx("option", { value: "weeks", children: "Weeks" }),
                    /* @__PURE__ */ jsx("option", { value: "months", children: "Months" }),
                    /* @__PURE__ */ jsx("option", { value: "years", children: "Years" }),
                    /* @__PURE__ */ jsx("option", { value: "not-specified", className: "text-muted-foreground italic", children: t("postJob.notSpecified", "Not specified") })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-base text-slate-800", children: t("postJob.skillsRequirements", "Skills or requirements") }),
              /* @__PURE__ */ jsx(Textarea, { value: form.skills, onChange: (e) => setForm({
                ...form,
                skills: e.target.value
              }), placeholder: "e.g., English, sales experience, Figma, React, shop management, hospital experience", rows: 4, className: "mt-3 rounded-xl text-base" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-base text-slate-800", children: "Contact or application instructions" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.contactInstructions, onChange: (e) => setForm({
                ...form,
                contactInstructions: e.target.value
              }), placeholder: "Tell applicants how you want to be contacted, what files to send, or what details to include.", rows: 4, className: "mt-3 rounded-xl text-base" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-base text-slate-800", children: "Tags" }),
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
                  }, placeholder: "Type or select tags", className: "h-14 border-0 text-lg shadow-none focus:ring-0 px-0" })
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
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between", children: [
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", disabled: currentStep === 1, onClick: () => setCurrentStep((step) => Math.max(step - 1, 1)), className: "h-14 rounded-xl px-8 text-base", children: [
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }),
            " Back"
          ] }),
          currentStep < 3 ? /* @__PURE__ */ jsxs(Button, { type: "button", onClick: nextStep, className: "h-14 rounded-xl bg-brand px-8 text-base text-brand-foreground hover:bg-brand/90", children: [
            currentStep === 2 ? "Continue to Details" : "Next Step",
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) : /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: submitting, className: "h-14 rounded-xl bg-brand px-10 text-base text-brand-foreground hover:bg-brand/90", children: [
            submitting ? "Publishing..." : "Publish",
            " ",
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-3 h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "ml-3 h-5 w-5" })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("section", { className: "mt-14", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-slate-950", children: [
            "Suggested ",
            kind === "business" ? "jobs to hire for" : config.eyebrow.toLowerCase()
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("postJob.suggested.desc", "Matching examples for the posting type you selected above.") })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: suggestedJobs.map((job) => /* @__PURE__ */ jsx(JobCard, { job }, job.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  PostJob as component
};
