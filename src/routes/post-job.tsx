

















































































































































































































































































































































































































































































































































































































































































































































































import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleHelp,
  Clock3,
  Laptop,
  MapPin,
  Tag,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirestoreCollection, useAddJob, useWilayas, Job } from "@/hooks/use-firestore";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { CATEGORY_CONFIG, type PostKind } from "@/lib/categories";

interface S {
  category?: string;
}

export const Route = createFileRoute("/post-job")({
  validateSearch: (s: Record<string, unknown>): S => ({ category: (s.category as string) || "" }),
  component: PostJob,
});

const POST_CONFIG: Record<
  PostKind,
  {
    icon: typeof Laptop;
    eyebrow: string;
    title: string;
    subtitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    typeLabel: string;
    typeOptions: string[];
    budgetLabel: string;
    budgetPlaceholder: string;
    descriptionPlaceholder: string;
  }
> = {
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
    descriptionPlaceholder:
      "Describe deliverables, deadline, required skills, and how the freelancer will work with you.",
  },
  "full-time": {
    icon: Clock3,
    eyebrow: "Full-time role",
    title: "Post a Full-time Job",
    subtitle: "Create a full-time role with clear requirements, salary, and location.",
    titleLabel: "Job Title",
    titlePlaceholder: "e.g., Senior Frontend Developer",
    typeLabel: "Work arrangement",
    typeOptions: [
      "Full-time office job",
      "Full-time remote job",
      "Full-time hybrid job",
      "Temporary full-time job",
      "Long-term full-time job",
    ],
    budgetLabel: "Monthly Salary",
    budgetPlaceholder: "e.g., 120,000 DZD / month",
    descriptionPlaceholder:
      "Describe responsibilities, team structure, working hours, benefits, and candidate profile.",
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
    descriptionPlaceholder:
      "Explain the company goal, required roles, project scope, timeline, and preferred collaboration model.",
  },
};

const normalizeKind = (value?: string): PostKind =>
  value === "freelance" || value === "business" || value === "full-time" ? value : "full-time";

function FieldLabel({
  children,
  required,
  details,
}: {
  children: React.ReactNode;
  required?: boolean;
  details?: string;
}) {
  return (
    <Label className="flex items-center gap-2 text-base text-slate-800">
      <span>{children}</span>
      {required && details && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand/30"
              aria-label={`${children} details`}
            >
              <CircleHelp className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-72 rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-white shadow-xl">
            {details}
          </TooltipContent>
        </Tooltip>
      )}
    </Label>
  );
}

const getSliderStep = (value: number) => {
  if (value < 5000) return 50;
  if (value < 20000) return 200;
  if (value < 50000) return 500;
  if (value < 100000) return 2000;
  return 5000;
};

function PostJob() {
  const { category: preset } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const { addJob, loading: submitting } = useAddJob();
  const [kind, setKind] = useState<PostKind>(normalizeKind(preset));
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [serverTags, setServerTags] = useState<string[]>([]);
  const { data: jobs } = useFirestoreCollection<Job>("jobs");
  const { data: wilayas, loading: wilayasLoading } = useWilayas();
  const config = POST_CONFIG[kind];
  const categoryConfig = CATEGORY_CONFIG[kind];
  const budgetSliderMax = 500_000;
  const suggestedJobs = useMemo(
    () => jobs.filter((job) => (kind === "business" ? true : job.type === kind)).slice(0, 3),
    [jobs, kind],
  );
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
    tags: [] as string[],
    type: config.typeOptions[0],
  });
  const suggestedJobTags = serverTags.length > 0
    ? serverTags
    : [
        "React", "Node.js", "TypeScript", "Python", "JavaScript", "PHP", "Laravel",
        "UI/UX", "Figma", "SEO", "Google Ads", "Content Writing", "Translation",
        "English", "French", "Arabic", "Video Editing", "Social Media",
        "Data Entry", "Excel", "Customer Service", "Sales", "Accounting",
        "Project Management", "Graphic Design", "Web Development", "Mobile Development",
      ];

  const filteredTagSuggestions = useMemo(
    () =>
      tagInput.trim()
        ? suggestedJobTags.filter(
            (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !form.tags.includes(t),
          ).slice(0, 8)
        : [],
    [tagInput, form.tags, suggestedJobTags],
  );

  const steps = useMemo(
    () => [
      { n: 1, label: "Basic Info", active: currentStep >= 1 },
      { n: 2, label: "Description", active: currentStep >= 2 },
      { n: 3, label: "Details", active: currentStep >= 3 },
    ],
    [currentStep],
  );

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
      tags: [],
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

  const submit = async (e: React.FormEvent) => {
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

      
      const jobType =
        kind === "business"
          ? form.type === "Freelancer"
            ? "freelance"
            : "full-time"
          : kind === "freelance"
            ? "freelance"
            : "full-time";

      
      const skills = form.skills
        ? form.skills
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      
      
      const rawResponsibilities = form.description
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const responsibilities =
        rawResponsibilities.length > 0 ? rawResponsibilities : [form.description.trim()];

      
      const tags = [...new Set([...form.tags, form.location, form.category, form.type].filter(Boolean))];

      const postedAgo = "Just now";

      await addJob({
        title: form.title,
        company: user.companyName || user.fullName || "Anonymous",
        companyLogo:
          user.avatar ||
          `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(form.title)}&backgroundColor=004225,960018,1f2937`,
        type: jobType,
        
        typeLabel: form.type,
        category: form.category,
        location: form.location,
        salaryMin,
        salaryMax,
        timeframe: form.timeframeUnit === "not-specified" ? "Not specified" : `${form.timeframeValue.trim()} ${form.timeframeUnit}`,
        description: form.description,
        responsibilities,
        requirements: [
          form.timeframeUnit === "not-specified"
            ? "Timeframe: Not specified"
            : form.timeframeValue.trim()
              ? `Timeframe: ${form.timeframeValue.trim()} ${form.timeframeUnit}`
              : "",
          form.contactInstructions.trim()
            ? `Application instructions: ${form.contactInstructions.trim()}`
            : "",
        ].filter(Boolean),
        skills,
        tags,
        contactInstructions: form.contactInstructions.trim(),
        postedAgo,
        employerId: user.uid || user.email || "anonymous",
        employerEmail: user.email || "",
      });

      toast.success(`${config.eyebrow} posted successfully!`);
      navigate({ to: "/profile" });
    } catch (error: unknown) {
      
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error posting job:", firestoreError);

      if (firestoreError?.code === "permission-denied") {
        toast.error("Permission denied. Make sure you are logged in and your account is verified.");
      } else if (firestoreError?.code === "unavailable") {
        toast.error("Network error. Check your connection and try again.");
      } else {
        toast.error(
          `Failed to post job: ${firestoreError?.message ?? "Unknown error. Check browser console."}`,
        );
      }
    }
  };

if (!user) {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <div className="rounded-2xl border bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <config.icon className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Log in to post a {config.eyebrow.toLowerCase()}
          </h1>
          <p className="mt-3 text-slate-500">
            You need an account to publish {kind === "business" ? "business requests" : `${kind} positions`} and connect with talent.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => navigate({ to: "/auth", search: { mode: "login" } as never })}
              variant="outline"
              className="h-12 rounded-xl px-8"
            >
              Log in
            </Button>
            <Button
              onClick={() => navigate({ to: "/auth", search: { mode: "register" } as never })}
              className="h-12 rounded-xl bg-brand px-8 text-brand-foreground hover:bg-brand/90"
            >
              Join Mihna
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

  if (user.accountType !== "employer") {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <Header />
        <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <div className="rounded-2xl border bg-white p-8 shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Building2 className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-950">
              {t("postJob.employerRequired", "Employer account required")}
            </h1>
            <p className="mt-3 text-slate-500">
              Job publishing is available for employer accounts. You can switch your account type
              from your profile settings or post an announcement instead.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => navigate({ to: "/profile" })}
                variant="outline"
                className="h-12 rounded-xl px-8"
              >
                Open profile
              </Button>
              <Button
                onClick={() => navigate({ to: "/post-announcement" })}
                className="h-12 rounded-xl bg-brand px-8 text-brand-foreground hover:bg-brand/90"
              >
                Post announcement
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="mx-auto max-w-7xl px-8 py-10 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
            <config.icon className="h-4 w-4" />
            {config.eyebrow}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-normal text-slate-950">{config.title}</h1>
          <p className="mt-3 text-xl text-slate-500">{config.subtitle}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          {steps.map((step, index) => (
            <div key={step.n} className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${step.active ? "bg-brand text-white" : "bg-slate-200 text-slate-600"}`}
              >
                {step.active && step.n !== 1 ? <Check className="h-5 w-5" /> : step.n}
              </span>
              <span
                className={`text-lg font-semibold ${step.active ? "text-brand" : "text-slate-400"}`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span className="hidden h-px w-16 bg-slate-300 sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <TooltipProvider delayDuration={120}>
            <form onSubmit={submit} className="overflow-visible rounded-2xl border bg-white p-6 shadow-sm sm:p-12">
              <div className="space-y-7">
                {currentStep === 1 && (
                  <>
                    <div>
                      <FieldLabel
                        required
                        details={`Required. Add a clear ${config.titleLabel.toLowerCase()} so the right people understand the opportunity quickly.`}
                      >
                        {config.titleLabel}
                      </FieldLabel>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder={config.titlePlaceholder}
                        className="mt-3 h-16 rounded-xl text-lg"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <FieldLabel
                          required
                          details="Required. Choose the simplest option that explains how this opportunity works for the person applying."
                        >
                          {config.typeLabel}
                        </FieldLabel>
                        <Select
                          value={form.type}
                          onValueChange={(v) => setForm({ ...form, type: v })}
                        >
                          <SelectTrigger className="mt-3 h-14 rounded-xl text-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {config.typeOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <FieldLabel
                          required
                          details="Required. Pick one of the popular categories, or browse all jobs if you do not find the exact one."
                        >
                          Category
                        </FieldLabel>
                        <div className="mt-3 space-y-3">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {categoryConfig.popular.map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => { setShowCustomCategory(false); setForm({ ...form, category }); }}
                                className={`min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${
                                  form.category === category
                                    ? "border-brand bg-brand text-brand-foreground shadow-sm"
                                    : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => { setShowCustomCategory(true); setCustomCategoryInput(""); setForm({ ...form, category: "" }); }}
                              className={`min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${
                                showCustomCategory
                                  ? "border-brand bg-brand text-brand-foreground shadow-sm"
                                  : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"
                              }`}
                            >
                              Other
                            </button>
                          </div>
                          {showCustomCategory && (
                            <Input
                              value={customCategoryInput}
                              onChange={(e) => { setCustomCategoryInput(e.target.value); setForm({ ...form, category: e.target.value }); }}
                              placeholder="Type your custom category..."
                              className="mt-3 h-12 rounded-xl text-base"
                            />
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAllCategories((value) => !value)}
                            className="h-11 rounded-xl"
                          >
                            {showAllCategories ? "Hide all jobs" : "Browse all jobs"}
                          </Button>
                        {showAllCategories && (
                            <Select
                              value={form.category}
                              onValueChange={(v) => {
                                if (v === "__other__") {
                                  setShowCustomCategory(true);
                                  setCustomCategoryInput("");
                                  setForm({ ...form, category: "" });
                                } else {
                                  setShowCustomCategory(false);
                                  setForm({ ...form, category: v });
                                }
                              }}
                            >
                              <SelectTrigger className="h-14 rounded-xl text-base">
                                <SelectValue placeholder="Choose a job category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryConfig.all.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                                <SelectItem value="__other__">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <FieldLabel
                        required
                        details="Required. Pick the wilaya or location where the work is based, even if remote work is possible."
                      >
                        Location
                      </FieldLabel>
                      <div className="mt-3 flex items-center gap-2 rounded-xl border px-4">
                        <MapPin className="h-5 w-5 text-slate-400" />
                        <Select
                          value={form.location}
                          onValueChange={(v) => setForm({ ...form, location: v })}
                        >
                          <SelectTrigger className="h-14 border-0 text-lg shadow-none focus:ring-0">
                            <SelectValue placeholder="Select a wilaya" />
                          </SelectTrigger>
                          <SelectContent>
                            {wilayasLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading wilayas...
                              </SelectItem>
                            ) : (
                              wilayas.map((wilaya) => (
                                <SelectItem key={wilaya.code} value={wilaya.name}>
                                  {wilaya.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <div>
                    <FieldLabel
                      required
                      details="Required. Include responsibilities, requirements, deliverables, timeline, and who should apply."
                    >
                      Description
                    </FieldLabel>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                      }}
                      placeholder={config.descriptionPlaceholder}
                      rows={10}
                      className="mt-3 rounded-xl text-base"
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      Explain the work clearly. You can add tasks, requirements, deliverables, and
                      who should apply.
                    </p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-7">
                    <div className="rounded-2xl border bg-secondary/60 p-5">
                      <h2 className="text-lg font-bold text-slate-950">
                        {t("postJob.review", "Review your post")}
                      </h2>
                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        {[
                          ["Title", form.title],
                          [config.typeLabel, form.type],
                          ["Category", form.category],
                          ["Location", form.location],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl bg-background p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              {label}
                            </div>
                            <div className="mt-1 font-semibold text-slate-900">{value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-xl bg-background p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Description
                        </div>
                        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
                          {form.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-base text-slate-800">{config.budgetLabel}</Label>
                        <div className="mt-3 flex items-center gap-3">
                          <Input
                            type="number"
                            value={form.budgetMin}
                            onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                            placeholder="Min"
                            className="h-14 rounded-xl text-lg"
                          />
                          <span className="text-lg text-slate-400">—</span>
                          <Input
                            type="number"
                            value={form.budgetMax}
                            onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                            placeholder="Max"
                            className="h-14 rounded-xl text-lg"
                          />
                        </div>
                        <div className="relative mt-4 h-2 rounded-full bg-slate-200">
                          <div
                            className="absolute h-2 rounded-full bg-brand"
                            style={{
                              left: `${Math.min((Number(form.budgetMin) / budgetSliderMax) * 100, 100)}%`,
                              right: `${100 - Math.min((Number(form.budgetMax) / budgetSliderMax) * 100, 100)}%`,
                            }}
                          />
                          <input
                            type="range"
                            min={500}
                            max={budgetSliderMax}
                            step={1}
                            value={Math.min(Number(form.budgetMin), Number(form.budgetMax))}
                            onChange={(e) => {
                              const raw = Number(e.target.value);
                              const step = getSliderStep(raw);
                              const snapped = Math.round(raw / step) * step;
                              const v = Math.min(snapped, Number(form.budgetMax) || budgetSliderMax);
                              setForm({ ...form, budgetMin: String(v) });
                            }}
                            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                          />
                          <input
                            type="range"
                            min={500}
                            max={budgetSliderMax}
                            step={1}
                            value={Math.max(Number(form.budgetMax), Number(form.budgetMin))}
                            onChange={(e) => {
                              const raw = Number(e.target.value);
                              const step = getSliderStep(raw);
                              const snapped = Math.round(raw / step) * step;
                              const v = Math.max(snapped, Number(form.budgetMin));
                              setForm({ ...form, budgetMax: String(v) });
                            }}
                            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-base text-slate-800">
                          {t("postJob.timeframe", "Timeframe")}
                        </Label>
                        <div className="mt-3 flex items-center gap-3">
                          <Input
                            type="number"
                            value={form.timeframeValue}
                            onChange={(e) => setForm({ ...form, timeframeValue: e.target.value })}
                            placeholder="time"
                            disabled={form.timeframeUnit === "not-specified"}
                            className="h-14 flex-1 rounded-xl text-lg"
                          />
                          <span className={`text-lg text-slate-400 ${form.timeframeUnit === "not-specified" ? "opacity-30" : ""}`}>—</span>
                          <select
                            value={form.timeframeUnit}
                            onChange={(e) => setForm({ ...form, timeframeUnit: e.target.value })}
                            className="h-14 min-w-44 rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                          >
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                            <option value="not-specified" className="text-muted-foreground italic">{t("postJob.notSpecified", "Not specified")}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base text-slate-800">
                        {t("postJob.skillsRequirements", "Skills or requirements")}
                      </Label>
                      <Textarea
                        value={form.skills}
                        onChange={(e) => setForm({ ...form, skills: e.target.value })}
                        placeholder="e.g., English, sales experience, Figma, React, shop management, hospital experience"
                        rows={4}
                        className="mt-3 rounded-xl text-base"
                      />
                    </div>

                    <div>
                      <Label className="text-base text-slate-800">
                        Contact or application instructions
                      </Label>
                      <Textarea
                        value={form.contactInstructions}
                        onChange={(e) => setForm({ ...form, contactInstructions: e.target.value })}
                        placeholder="Tell applicants how you want to be contacted, what files to send, or what details to include."
                        rows={4}
                        className="mt-3 rounded-xl text-base"
                      />
                    </div>

                    <div>
                      <Label className="text-base text-slate-800">Tags</Label>
                      <div className="relative mt-3">
                        <div className="flex items-center gap-2 rounded-xl border px-4">
                          <Tag className="h-5 w-5 shrink-0 text-slate-400" />
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && tagInput.trim()) {
                                e.preventDefault();
                                if (!form.tags.includes(tagInput.trim())) {
                                  setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
                                }
                                setTagInput("");
                              }
                            }}
                            placeholder="Type or select tags"
                            className="h-14 border-0 text-lg shadow-none focus:ring-0 px-0"
                          />
                        </div>
                        {filteredTagSuggestions.length > 0 && (
                          <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            {filteredTagSuggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  if (!form.tags.includes(suggestion)) {
                                    setForm({ ...form, tags: [...form.tags, suggestion] });
                                  }
                                  setTagInput("");
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-brand-soft hover:text-brand"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {form.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {form.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() =>
                                  setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
                                }
                                className="ml-0.5 rounded-full p-0.5 transition hover:bg-brand/20"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((step) => Math.max(step - 1, 1))}
                  className="h-14 rounded-xl px-8 text-base"
                >
                  {locale === "ar" ? <ArrowRight className="ml-2 h-5 w-5" /> : <ArrowLeft className="mr-2 h-5 w-5" />} Back
                </Button>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-14 rounded-xl bg-brand px-8 text-base text-brand-foreground hover:bg-brand/90"
                  >
                    {currentStep === 2 ? "Continue to Details" : "Next Step"}
                    {locale === "ar" ? <ArrowLeft className="mr-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-14 rounded-xl bg-brand px-10 text-base text-brand-foreground hover:bg-brand/90"
                  >
                    {submitting ? "Publishing..." : "Publish"}{" "}
                    {locale === "ar" ? <ArrowLeft className="mr-3 h-5 w-5" /> : <ArrowRight className="ml-3 h-5 w-5" />}
                  </Button>
                )}
              </div>
            </form>
          </TooltipProvider>
        </div>

        <section className="mt-14">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Suggested {kind === "business" ? "jobs to hire for" : config.eyebrow.toLowerCase()}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {t(
                  "postJob.suggested.desc",
                  "Matching examples for the posting type you selected above.",
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
