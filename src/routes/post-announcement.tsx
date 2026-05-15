import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  MapPin,
  Sparkles,
  Tag,
  X,
  AlertTriangle,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";
import { announcementService } from "@/lib/firestore-service";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useWilayas } from "@/hooks/use-firestore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchState {
  category?: string;
  type?: string;
}

const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Lead", "Open"] as const;
const AVAILABILITY_OPTIONS = [
  "Available immediately",
  "Available this week",
  "Available this month",
  "Open to discussion",
] as const;

const getSliderStep = (value: number) => {
  if (value < 5000) return 50;
  if (value < 20000) return 200;
  if (value < 50000) return 500;
  if (value < 100000) return 2000;
  return 5000;
};

interface FieldLabelProps {
  label: string;
  tooltip?: string;
  required?: boolean;
}

function FieldLabel({ label, tooltip, required }: FieldLabelProps) {
  if (!tooltip) {
    return (
      <Label className="mb-2 block text-base font-semibold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
    );
  }

  return (
    <TooltipProvider>
      <div className="mb-2 flex items-center gap-2">
        <Label className="block text-base font-semibold text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand/30"
              aria-label={label}
            >
              <CircleHelp className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-72 rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-white shadow-xl">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const Route = createFileRoute("/post-announcement")({
  validateSearch: (s: Record<string, unknown>): SearchState => ({
    category: (s.category as string) || "",
    type: (s.type as string) || "both",
  }),
  component: PostAnnouncement,
});

function PostAnnouncement() {
  const { user } = useAuth();
  const { t, tt, locale } = useI18n();
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
  const [serverTags, setServerTags] = useState<string[]>([]);
  const [serverCategories, setServerCategories] = useState<string[]>([]);
  const { data: wilayas, loading: wilayasLoading } = useWilayas();
  const budgetSliderMax = 500_000;

  const [form, setForm] = useState({
    headline: "",
    category: search.category || "",
    workPreference:
      (search.type as "freelance" | "full-time" | "both") || user?.workPreference || "both",
    experienceLevel: "Open",
    yearsExperience: "1",
    budgetMin: "",
    budgetMax: "",
    budgetPeriod: "monthly",
    availability: "Available immediately",
    skills: "",
    tags: [] as string[],
    content: "",
  });

  useEffect(() => {
    if (search.type && search.type !== form.workPreference) {
      setForm((prev) => ({
        ...prev,
        workPreference: search.type as "freelance" | "full-time" | "both",
      }));
    }
  }, [search.type]);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.ok && r.json())
      .then((d) => Array.isArray(d) && setServerTags(d))
      .catch(() => {});
    fetch("/api/data/categories")
      .then((r) => r.ok && r.json())
      .then((d) => {
        if (Array.isArray(d))
          setServerCategories(d.map((c: any) => c.name || c.label || c).filter(Boolean));
      })
      .catch(() => {});
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFreelance = form.workPreference === "freelance";

  const suggestedTags =
    serverTags.length > 0
      ? serverTags
      : [
          "React",
          "Node.js",
          "TypeScript",
          "Python",
          "JavaScript",
          "PHP",
          "Laravel",
          "UI/UX",
          "Figma",
          "SEO",
          "Google Ads",
          "Content Writing",
          "Translation",
          "English",
          "French",
          "Arabic",
          "Video Editing",
          "Social Media",
          "Data Entry",
          "Excel",
          "Customer Service",
          "Sales",
          "Accounting",
          "Project Management",
          "Graphic Design",
          "Web Development",
          "Mobile Development",
        ];

  const steps = [
    { n: 1, label: t("postAnnouncement.step.mainInfo", "Main Info"), active: currentStep >= 1 },
    { n: 2, label: t("postAnnouncement.step.describe", "Describe"), active: currentStep >= 2 },
    { n: 3, label: t("postAnnouncement.step.details", "Details"), active: currentStep >= 3 },
  ];

  const categoryOptions = useMemo(() => {
    if (serverCategories.length > 0) return serverCategories.sort((a, b) => a.localeCompare(b));
    return [
      "Web Development",
      "Graphic Design",
      "Mobile Development",
      "Content Writing",
      "UI/UX Design",
      "Marketing & SEO",
      "Sales",
      "Accounting",
      "Administrative",
      "Customer Service",
      "Healthcare",
      "Teaching",
    ].sort((a, b) => a.localeCompare(b));
  }, [serverCategories]);

  const filteredTagSuggestions = useMemo(
    () =>
      tagInput.trim()
        ? suggestedTags
            .filter(
              (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !form.tags.includes(t),
            )
            .slice(0, 8)
        : [],
    [tagInput, form.tags, suggestedTags],
  );

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
      toast.error(
        t("postAnnouncement.mustLogin", "You must be logged in to create a talent offer."),
      );
      return;
    }

    if (user.accountType !== "candidate") {
      toast.error(
        t(
          "postAnnouncement.employerToast",
          "Employer accounts should use the job posting flow instead.",
        ),
      );
      navigate({ to: "/post-job", search: { category: "business" } as never });
      return;
    }

    if (!form.headline || !form.content || !form.category) {
      toast.error(
        t("postAnnouncement.requiredToast", "Fill in the headline, category, and details."),
      );
      return;
    }

    if (form.budgetMin && form.budgetMax && Number(form.budgetMin) > Number(form.budgetMax)) {
      toast.error("Min budget cannot exceed max budget");
      return;
    }

    try {
      setSubmitting(true);

      const skills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const allTags = [...new Set([...form.tags, form.category, ...skills])];

      const salaryMin = form.budgetMin ? parseInt(form.budgetMin, 10) || 0 : 0;
      const salaryMax = form.budgetMax ? parseInt(form.budgetMax, 10) || 0 : 0;

      await announcementService.create({
        title: form.headline,
        content: form.content,
        authorId: user.uid,
        authorName: user.displayName || user.fullName || "Candidate",
        announcementType: "jobseeking",
        category: form.category,
        location: location,
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
        attachments: [],
      });

      toast.success(t("postAnnouncement.successToast", "Talent offer published"));
      navigate({ to: "/profile" });
    } catch (error) {
      console.error("Error posting talent offer:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error(
        `${t("postAnnouncement.failedToast", "Failed to publish your talent offer.")} ${msg}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      nextStep();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <Header />
        <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <div className="rounded-2xl border bg-white p-8 shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-950">
              {t("postAnnouncement.login.title", "Log in to create your talent offer")}
            </h1>
            <p className="mt-3 text-slate-500">
              {t(
                "postAnnouncement.login.desc",
                "Showcase your skills and availability to employers in Alger by creating a professional jobseeking post.",
              )}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => navigate({ to: "/auth", search: { mode: "login" } as never })}
                variant="outline"
                className="h-12 rounded-xl px-8"
              >
                {t("auth.logIn", "Log in")}
              </Button>
              <Button
                onClick={() => navigate({ to: "/auth", search: { mode: "register" } as never })}
                className="h-12 rounded-xl bg-brand px-8 text-brand-foreground hover:bg-brand/90"
              >
                {t("postAnnouncement.login.cta", "Get Started")}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (user.accountType !== "candidate") {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <Header />
        <main className="mx-auto flex max-w-3xl p-6">
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">
              {t("postAnnouncement.employer.title", "Talent offers are for candidates")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t(
                "postAnnouncement.employer.desc",
                "Employer accounts should publish job openings so candidates can apply directly.",
              )}
            </p>
            <Button
              onClick={() =>
                navigate({ to: "/post-job", search: { category: "business" } as never })
              }
              className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {t("postAnnouncement.employer.cta", "Go to job posting")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
            <Sparkles className="h-4 w-4" />
            {t("postAnnouncement.badge", "Talent offer")}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            {form.workPreference === "freelance"
              ? t("postAnnouncement.headlineFreelance", "Offer your freelance services")
              : form.workPreference === "full-time"
                ? t("postAnnouncement.headlineFulltime", "Showcase your full-time availability")
                : t("postAnnouncement.headlineBoth", "Showcase your professional profile")}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {form.workPreference === "freelance"
              ? t(
                  "postAnnouncement.subtitleFreelance",
                  "Let employers know what you can deliver for their projects.",
                )
              : form.workPreference === "full-time"
                ? t(
                    "postAnnouncement.subtitleFulltime",
                    "Tell employers about your experience, skills, and expectations.",
                  )
                : t(
                    "postAnnouncement.subtitleBoth",
                    "Let employers know about your skills and what opportunities you're seeking.",
                  )}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-5">
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

        <div className="overflow-visible rounded-2xl border bg-white p-6 shadow-sm sm:p-12">
          <form onSubmit={submit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <FieldLabel
                    label={t("postAnnouncement.headline", "Headline")}
                    tooltip={
                      isFreelance
                        ? "Create a catchy headline that describes your key skills and what you offer (e.g., 'React Developer with 5 Years Experience')"
                        : "Write a compelling headline about your professional focus (e.g., 'Full-Stack Developer Seeking Senior Position')"
                    }
                  />
                  <Input
                    value={form.headline}
                    onChange={(e) => updateField("headline", e.target.value)}
                    placeholder={
                      isFreelance
                        ? t(
                            "postAnnouncement.headlinePlaceholder.freelance",
                            "e.g., React Developer with 5 Years Experience",
                          )
                        : t(
                            "postAnnouncement.headlinePlaceholder.fulltime",
                            "e.g., Full-Stack Developer Seeking Senior Position",
                          )
                    }
                    className="mt-3 h-14 rounded-xl text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.category", "Category")}
                      tooltip="Select the field that best matches your expertise"
                    />
                    <div className="mt-3 space-y-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {categoryOptions.slice(0, 6).map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => { setShowCustomCategory(false); updateField("category", category); }}
                            className={`min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${
                              form.category === category
                                ? "border-brand bg-brand text-brand-foreground shadow-sm"
                                : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"
                            }`}
                          >
                            {tt(category)}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => { setShowCustomCategory(true); setCustomCategoryInput(""); updateField("category", ""); }}
                          className={`min-h-12 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${
                            showCustomCategory
                              ? "border-brand bg-brand text-brand-foreground shadow-sm"
                              : "border-border bg-secondary text-secondary-foreground hover:border-brand/40"
                          }`}
                        >
                          Other
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAllCategories((value) => !value)}
                        className="h-11 rounded-xl"
                      >
                        {showAllCategories
                          ? t("postAnnouncement.hideAll", "Hide all categories")
                          : t("postAnnouncement.browseAll", "Browse all categories")}
                      </Button>
                      {showCustomCategory && (
                        <Input
                          value={customCategoryInput}
                          onChange={(e) => { setCustomCategoryInput(e.target.value); updateField("category", e.target.value); }}
                          placeholder="Type your custom category..."
                          className="mt-3 h-12 rounded-xl text-base"
                        />
                      )}
                      {showAllCategories && (
                        <Select
                          value={form.category}
                          onValueChange={(v) => {
                            if (v === "__other__") {
                              setShowCustomCategory(true);
                              setCustomCategoryInput("");
                              updateField("category", "");
                            } else {
                              setShowCustomCategory(false);
                              updateField("category", v);
                            }
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-xl text-base">
                            <SelectValue
                              placeholder={t(
                                "postAnnouncement.selectCategory",
                                "Select a category",
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {tt(cat)}
                              </SelectItem>
                            ))}
                            <SelectItem value="__other__">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.location", "Location")}
                      tooltip={
                        isFreelance
                          ? "Where are you based? (Optional for remote work)"
                          : "Your location or preferred work location"
                      }
                    />
                    <div className="mt-3 flex items-center gap-2 rounded-xl border px-4">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      <Select value={location} onValueChange={(v) => setLocation(v)}>
                        <SelectTrigger className="h-14 border-0 text-lg shadow-none focus:ring-0">
                          <SelectValue
                            placeholder={t(
                              "postAnnouncement.locationPlaceholder",
                              "Select a wilaya",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {wilayasLoading ? (
                            <SelectItem value="loading" disabled>
                              {t("postAnnouncement.loadingWilayas", "Loading wilayas...")}
                            </SelectItem>
                          ) : (
                            wilayas?.map((wilaya) => (
                              <SelectItem key={wilaya.code} value={wilaya.name}>
                                {wilaya.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.workType", "Work Type")}
                      tooltip="Choose the type of work arrangement you're seeking"
                    />
                    <div className="mt-3 flex gap-3">
                      {["freelance", "full-time"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateField("workPreference", type as any)}
                          className={`flex-1 rounded-xl px-4 py-3 text-center font-medium transition ${
                            form.workPreference === type
                              ? "bg-brand text-brand-foreground"
                              : "border border-slate-200 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {tt(type)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.experienceLevel", "Experience Level")}
                      tooltip="What's your professional level?"
                    />
                    <select
                      value={form.experienceLevel}
                      onChange={(e) => updateField("experienceLevel", e.target.value)}
                      className="mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      {EXPERIENCE_LEVELS.map((value) => (
                        <option key={value} value={value}>
                          {tt(value)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <FieldLabel
                    label={t("postAnnouncement.description", "Description")}
                    tooltip={
                      isFreelance
                        ? "Describe what you can do, your experience, completed projects, and what makes you unique"
                        : "Share your professional background, achievements, and what you're looking for in a role"
                    }
                  />
                  <Textarea
                    value={form.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                    }}
                    placeholder={
                      isFreelance
                        ? t(
                            "postAnnouncement.descriptionPlaceholder.freelance",
                            "Describe your freelance services, past projects, and how you can help clients...",
                          )
                        : t(
                            "postAnnouncement.descriptionPlaceholder.fulltime",
                            "Describe your professional background, key achievements, and what you're looking for...",
                          )
                    }
                    rows={8}
                    className="mt-3 rounded-xl text-base"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-2xl border bg-secondary/60 p-5">
                  <h2 className="text-lg font-bold text-slate-950">
                    {t("postJob.review", "Review your post")}
                  </h2>
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    {[
                      [t("postAnnouncement.reviewHeadline", "Headline"), form.headline],
                      [t("postAnnouncement.reviewCategory", "Category"), form.category],
                      [
                        t("postAnnouncement.reviewLocation", "Location"),
                        location || "Not specified",
                      ],
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-xl bg-background p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </div>
                        <div className="mt-1 font-semibold text-slate-900">{value as string}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl bg-background p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("postAnnouncement.reviewDetails", "Details")}
                    </div>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {form.content}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.yearsExperience", "Years of experience")}
                      tooltip="How many years of professional experience do you have?"
                    />
                    <Input
                      type="number"
                      min="0"
                      value={form.yearsExperience}
                      onChange={(e) => updateField("yearsExperience", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                      className="mt-3 h-14 rounded-xl text-lg"
                    />
                  </div>

                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.budgetLabel", "Budget / Salary")}
                      tooltip="Your expected salary range"
                    />
                    <div className="mt-3 flex items-center gap-3">
                      <Input
                        type="number"
                        value={form.budgetMin}
                        onChange={(e) => updateField("budgetMin", e.target.value)}
                        placeholder="Min"
                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                        className="h-14 rounded-xl text-lg"
                      />
                      <span className="text-lg text-slate-400">—</span>
                      <Input
                        type="number"
                        value={form.budgetMax}
                        onChange={(e) => updateField("budgetMax", e.target.value)}
                        placeholder="Max"
                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
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
                        min={0}
                        max={budgetSliderMax}
                        step={1}
                        value={Math.min(
                          Number(form.budgetMin),
                          Number(form.budgetMax) || budgetSliderMax,
                        )}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const step = getSliderStep(raw);
                          const snapped = Math.round(raw / step) * step;
                          const v = Math.min(snapped, Number(form.budgetMax) || budgetSliderMax);
                          updateField("budgetMin", String(v));
                        }}
                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <input
                        type="range"
                        min={0}
                        max={budgetSliderMax}
                        step={1}
                        value={Math.max(Number(form.budgetMax), Number(form.budgetMin))}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const step = getSliderStep(raw);
                          const snapped = Math.round(raw / step) * step;
                          const v = Math.max(snapped, Number(form.budgetMin));
                          updateField("budgetMax", String(v));
                        }}
                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.salaryPeriod", "Salary period")}
                      tooltip="How often you expect to be paid"
                    />
                    <select
                      value={form.budgetPeriod}
                      onChange={(e) => updateField("budgetPeriod", e.target.value)}
                      className="mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="monthly">{t("period.monthly", "monthly")}</option>
                      <option value="project">{t("period.project", "project")}</option>
                      <option value="weekly">{t("period.weekly", "weekly")}</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel
                      label={t("postAnnouncement.availability", "Availability")}
                      tooltip="When can you start working?"
                    />
                    <select
                      value={form.availability}
                      onChange={(e) => updateField("availability", e.target.value)}
                      className="mt-3 h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      {AVAILABILITY_OPTIONS.map((value) => (
                        <option key={value} value={value}>
                          {tt(value)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <FieldLabel
                    label={t("job.skills", "Professional skills")}
                    tooltip="List your key skills separated by commas"
                  />
                  <Input
                    value={form.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    placeholder={t(
                      "postAnnouncement.skillsPlaceholder",
                      "React, TypeScript, UI Design, SEO",
                    )}
                    className="mt-3 h-14 rounded-xl text-lg"
                  />
                </div>

                <div>
                  <FieldLabel
                    label={t("postAnnouncement.tagsLabel", "Tags")}
                    tooltip="Add relevant tags to help employers find your offer"
                  />
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
                        placeholder={t("postAnnouncement.tagsPlaceholder", "Type or select tags")}
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

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((step) => Math.max(step - 1, 1))}
                className="h-14 rounded-xl px-8 text-base"
              >
                {locale === "ar" ? (
                  <ArrowRight className="ml-2 h-5 w-5" />
                ) : (
                  <ArrowLeft className="mr-2 h-5 w-5" />
                )}{" "}
                {t("postAnnouncement.back", "Back")}
              </Button>
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-14 rounded-xl bg-brand px-8 text-base text-brand-foreground hover:bg-brand/90"
                >
                  {currentStep === 2
                    ? t("postAnnouncement.continueDetails", "Continue to Details")
                    : t("postAnnouncement.nextStep", "Next Step")}
                  {locale === "ar" ? (
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5" />
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowConfirm(true)}
                  className="h-14 rounded-xl bg-brand px-10 text-base text-brand-foreground hover:bg-brand/90"
                >
                  {submitting
                    ? t("postAnnouncement.publishing", "Publishing...")
                    : t("postAnnouncement.publish", "Publish talent offer")}{" "}
                  {locale === "ar" ? (
                    <ArrowLeft className="mr-3 h-5 w-5" />
                  ) : (
                    <ArrowRight className="ml-3 h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {t("postAnnouncement.confirm.title", "Publish your talent offer?")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  "postAnnouncement.confirm.desc",
                  "Once published, your talent offer will be visible to all employers. Make sure all information is accurate.",
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setShowConfirm(false);
                  await publish();
                }}
                className="bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {t("postAnnouncement.publish", "Publish")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <Footer />
    </div>
  );
}
