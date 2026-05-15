import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  Camera,
  Check,
  ClipboardList,
  Edit3,
  Globe2,
  Link2,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Settings,
  Sparkles,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { TalentOfferCard } from "@/components/TalentOfferCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Application, Announcement, AppNotification, CategoryItem, User } from "@/lib/api-types";
import { DEFAULT_PROFILE_PHOTO, useAuth } from "@/lib/auth";
import { applicationService, notificationService } from "@/lib/firestore-service";
import { apiRequest } from "@/lib/api-client";
import { applyTheme, getTheme, type ThemeMode } from "@/lib/utils";
import { useFirestoreCollection, type Job, type LocationItem } from "@/hooks/use-firestore";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type CandidateTab = "overview" | "offers" | "applied" | "saved" | "settings";
type EmployerTab = "overview" | "jobs" | "applicants" | "talent" | "settings";
type Tab = CandidateTab | EmployerTab;

interface ProfileSearch {
  tab?: CandidateTab | EmployerTab;
  userId?: string;
}

export const Route = createFileRoute("/profile")({
  validateSearch: (s: Record<string, unknown>): ProfileSearch => ({
    tab: (s.tab as CandidateTab | EmployerTab) || undefined,
    userId: (s.userId as string) || undefined,
  }),
  component: ProfilePage,
});

function StatBox({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Briefcase;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="mt-0.5 text-sm text-muted-foreground">{label}</div>
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

function formatDateLabel(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PublicProfileView({ userId: targetUserId }: { userId: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest<{ user: User }>(`/users/by-uid/${targetUserId}`)
      .then((res) => { if (active) setProfile(res.user); })
      .catch(() => { if (active) setProfile(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [targetUserId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back", "Back")}
        </button>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-muted-foreground">{t("common.loading", "Loading...")}</p>
          </div>
        ) : !profile ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">{t("profile.notFound", "User not found.")}</p>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={profile.avatar || profile.photoURL} />
                <AvatarFallback className="text-xl">{profile.fullName?.slice(0, 2) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {profile.profession && (
                    <>
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{profile.profession}</span>
                    </>
                  )}
                  {profile.accountType === "employer" && profile.companyName && (
                    <>
                      <span className="text-border">|</span>
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{profile.companyName}</span>
                    </>
                  )}
                </div>
                {profile.location && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </div>
                )}
                <div className="mt-2">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                    {profile.accountType === "employer" ? t("common.employer", "Employer") : t("common.candidate", "Candidate")}
                  </span>
                </div>
              </div>
            </div>
            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
            )}
            <div className="mt-6 space-y-2">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm text-brand hover:underline">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </a>
              )}
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-sm text-brand hover:underline">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </a>
              )}
              {profile.website && (
                <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                  <Globe2 className="h-4 w-4" />
                  {profile.website}
                </a>
              )}
              {profile.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                  <MessageCircle className="h-4 w-4" />
                  {t("common.whatsapp", "WhatsApp")}
                </a>
              )}
              {profile.telegram && (
                <a href={`https://t.me/${profile.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                  <Send className="h-4 w-4" />
                  @{profile.telegram.replace(/^@/, "")}
                </a>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { tab, userId: viewUserId } = Route.useSearch();
  const isEmployer = user?.accountType === "employer";
  const [activeTab, setActiveTab] = useState<Tab>(tab || "overview");
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [employerApplications, setEmployerApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [candidateApplications, setCandidateApplications] = useState<Application[]>([]);
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
    bio: "",
  });

  const cvRef = useRef<HTMLInputElement>(null);
  const [cvFileName, setCvFileName] = useState(user?.cvFileName || "");
  const [cvDataUrl, setCvDataUrl] = useState(user?.cvDataUrl || "");

  const handleCVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCvFileName(file.name);
        setCvDataUrl(result);
        updateUser({ cvFileName: file.name, cvDataUrl: result });
        toast.success(t("profile.cvUploaded", "CV uploaded successfully"));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCV = () => {
    setCvFileName("");
    setCvDataUrl("");
    updateUser({ cvFileName: "", cvDataUrl: "" });
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
      bio: user.bio ?? "",
    });
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = getTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    const candidateTabs: CandidateTab[] = ["overview", "offers", "applied", "saved", "settings"];
    const employerTabs: EmployerTab[] = ["overview", "jobs", "applicants", "talent", "settings"];
    const validTabs = isEmployer ? employerTabs : candidateTabs;
    if (!validTabs.includes(activeTab as any)) {
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

    applicationService
      .getEmployerApplications()
      .then((applications) => {
        if (!active) return;
        setEmployerApplications(applications);
      })
      .catch((error) => {
        console.error("Failed to load employer applications:", error);
        if (!active) return;
        toast.error("Could not load job applicants right now.");
      })
      .finally(() => {
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

    applicationService
      .getCandidateApplications()
      .then((applications) => {
        if (!active) return;
        setCandidateApplications(applications);
      })
      .catch((error) => {
        console.error("Failed to load candidate applications:", error);
        if (!active) return;
      })
      .finally(() => {
        if (active) setLoadingCandidateApps(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const { data: jobs } = useFirestoreCollection<Job>("jobs");
  const { data: employerJobs } = useFirestoreCollection<Job>(
    "jobs",
    "createdAt",
    isEmployer ? "employerId" : undefined,
    isEmployer ? user?.uid : undefined,
  );
  const { data: locations } = useFirestoreCollection<LocationItem>("locations", "order");
  const { data: categories } = useFirestoreCollection<CategoryItem>("categories", "order");
  const { data: talentOffers } = useFirestoreCollection<Announcement>(
    "announcements",
    "createdAt",
    "announcementType",
    "jobseeking",
  );

  const savedJobIds = user?.savedJobIds ?? [];
  const appliedJobIds = user?.appliedJobIds ?? [];
  const userId = user?.uid ?? "";
  const savedJobs = useMemo(
    () => jobs.filter((job) => job.id && savedJobIds.includes(job.id)),
    [jobs, savedJobIds],
  );
  const appliedJobs = useMemo(
    () =>
      appliedJobIds
        .map((appliedJobId) => jobs.find((job) => job.id === appliedJobId))
        .filter((job): job is Job => Boolean(job)),
    [appliedJobIds, jobs],
  );
  const ownTalentOffers = useMemo(
    () => talentOffers.filter((offer) => offer.authorId === userId),
    [talentOffers, userId],
  );
  const marketTalentOffers = useMemo(
    () => talentOffers.filter((offer) => offer.authorId !== userId),
    [talentOffers, userId],
  );
  const applicationsByJobId = useMemo(() => {
    const entries = new Map<string, Application[]>();
    for (const application of employerApplications) {
      const list = entries.get(application.jobId) ?? [];
      list.push(application);
      entries.set(application.jobId, list);
    }
    return entries;
  }, [employerApplications]);
  const algerianLocations = locations
    .filter((location) => location.name !== "Anywhere")
    .map((location) => location.name);

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
    bio: form.bio,
  };

  const filledFields = [
    profile.fullName,
    profile.email,
    profile.location,
    profile.phone,
    profile.website,
    profile.whatsapp,
    profile.telegram,
    profile.facebook,
    profile.bio,
    isEmployer ? profile.companyName : profile.profession,
  ].filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / 10) * 100);
  const recentApplicants = employerApplications.slice(0, 3);
  const recentTalentOffers = marketTalentOffers.slice(0, 3);

  const candidateTabs: Array<{ icon: typeof Briefcase; label: string; tab: CandidateTab; count: number }> = [
    { icon: ClipboardList, label: t("profile.tabs.overview", "Overview"), tab: "overview", count: 0 },
    { icon: Sparkles, label: t("profile.tabs.offers", "Talent Offers"), tab: "offers", count: ownTalentOffers.length },
    { icon: Briefcase, label: t("profile.tabs.applied", "Applied Jobs"), tab: "applied", count: appliedJobs.length },
    { icon: Bookmark, label: t("profile.tabs.saved", "Saved Jobs"), tab: "saved", count: savedJobs.length },
    { icon: Settings, label: t("profile.tabs.settings", "Settings"), tab: "settings", count: 0 },
  ];
  const employerTabs: Array<{ icon: typeof Briefcase; label: string; tab: EmployerTab; count: number }> = [
    { icon: ClipboardList, label: t("profile.tabs.overview", "Overview"), tab: "overview", count: 0 },
    { icon: Briefcase, label: t("profile.tabs.jobs", "My Jobs"), tab: "jobs", count: employerJobs.length },
    { icon: Users, label: t("profile.tabs.applicants", "Applicants"), tab: "applicants", count: employerApplications.length },
    { icon: Sparkles, label: t("profile.tabs.talent", "Talent Board"), tab: "talent", count: marketTalentOffers.length },
    { icon: Settings, label: t("profile.tabs.settings", "Settings"), tab: "settings", count: 0 },
  ];
  const tabs = isEmployer ? employerTabs : candidateTabs;

  if (viewUserId && viewUserId !== user?.uid) {
    return <PublicProfileView userId={viewUserId} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-12">
            <h1 className="text-3xl font-bold text-foreground">
              {t("profile.loginRequired.title", "Log in to view your profile")}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {t(
                "profile.loginRequired.desc",
                "Your dashboard, job activity, and settings are available once you sign in.",
              )}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => navigate({ to: "/auth", search: { mode: "login" } as never })}
                variant="outline"
                className="rounded-xl"
              >
                {t("auth.logIn", "Log in")}
              </Button>
              <Button
                onClick={() => navigate({ to: "/auth", search: { mode: "register" } as never })}
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {t("auth.register.title", "Create account.").replace(".", "")}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const contactItems = [
    { label: "Email", value: profile.email, icon: Mail, href: `mailto:${profile.email}` },
    {
      label: "Phone",
      value: profile.phone,
      icon: Phone,
      href: profile.phone ? `tel:${profile.phone}` : undefined,
    },
    {
      label: "Website",
      value: profile.website,
      icon: Globe2,
      href: profile.website?.startsWith("http")
        ? profile.website
        : profile.website
          ? `https://${profile.website}`
          : undefined,
    },
    {
      label: "WhatsApp",
      value: profile.whatsapp,
      icon: MessageCircle,
      href: profile.whatsapp
        ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`
        : undefined,
    },
    {
      label: "Telegram",
      value: profile.telegram,
      icon: MessageCircle,
      href: profile.telegram ? `https://t.me/${profile.telegram.replace(/^@/, "")}` : undefined,
    },
    {
      label: "Facebook",
      value: profile.facebook,
      icon: Link2,
      href: profile.facebook?.startsWith("http")
        ? profile.facebook
        : profile.facebook
          ? `https://${profile.facebook}`
          : undefined,
    },
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, avatar: result }));
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
        bio: form.bio,
      });
      setIsEditing(false);
      toast.success(t("profile.informationSaved", "Profile information saved"));
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error(t("profile.saveFailed", "Could not save your profile. Please try again."));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:min-h-[600px]">
          <div className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {isEmployer
              ? t("profile.dashboard.employer", "Employer Dashboard")
              : t("profile.dashboard.candidate", "Candidate Dashboard")}
          </div>

          <div className="mt-5 rounded-2xl bg-muted p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-border">
                <AvatarImage src={user?.avatar || DEFAULT_PROFILE_PHOTO} />
                <AvatarFallback>{profile.fullName.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground">{profile.fullName}</div>
                <div className="text-xs text-muted-foreground">
                  {isEmployer
                    ? profile.companyName || t("common.employer", "Employer")
                    : profile.profession || t("common.candidate", "Candidate")}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {tabs.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm transition ${
                  activeTab === item.tab
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.count > 0 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {item.count.toString().padStart(2, "0")}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="mt-6 flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground transition hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> {t("profile.logout", "Log out")}
          </button>
        </aside>

        <section>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border border-border">
                  <AvatarImage src={user?.avatar || DEFAULT_PROFILE_PHOTO} />
                  <AvatarFallback>{profile.fullName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-2xl font-bold text-foreground">{profile.fullName}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {isEmployer
                      ? profile.companyName || t("profile.account.employer", "Employer account")
                      : profile.profession ||
                        t("profile.account.candidate", "Freelancer / Job seeker")}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs uppercase tracking-wider text-muted-foreground">
                    <span>{profile.location}</span>
                    <span className="text-muted-foreground/40">|</span>
                    <span>
                      {isEmployer
                        ? t("profile.activeJobs", "{count} active jobs", {
                            count: employerJobs.length,
                          })
                        : t("profile.talentOffersCount", "{count} talent offers", {
                            count: ownTalentOffers.length,
                          })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90"
                >
                  <Edit3 className="h-4 w-4" /> {t("profile.edit", "Edit profile")}
                </button>
                <Link
                  to={isEmployer ? "/post-job" : "/post-announcement"}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
                >
                  <UploadCloud className="h-4 w-4" />
                  {isEmployer
                    ? t("header.menu.postJob", "Post a job")
                    : t("header.menu.createOffer", "Create talent offer")}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
                  <div className="space-y-3">
                    <StatBox
                      icon={isEmployer ? Briefcase : Sparkles}
                      value={`${isEmployer ? employerJobs.length : ownTalentOffers.length}`}
                      label={
                        isEmployer
                          ? t("profile.stats.jobsPosted", "Jobs posted")
                          : t("profile.stats.talentOffers", "Talent offers")
                      }
                    />
                    <StatBox
                      icon={Users}
                      value={`${isEmployer ? employerApplications.length : appliedJobs.length}`}
                      label={
                        isEmployer
                          ? t("profile.stats.applicantsReceived", "Applicants received")
                          : t("profile.stats.applicationsSent", "Applications sent")
                      }
                    />
                    <StatBox
                      icon={Bookmark}
                      value={`${isEmployer ? marketTalentOffers.length : savedJobs.length}`}
                      label={
                        isEmployer
                          ? t("profile.stats.talentOffersLive", "Talent offers live")
                          : t("profile.stats.savedJobs", "Saved jobs")
                      }
                    />
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {isEmployer
                              ? t("profile.companyIntro", "Company introduction")
                              : t("profile.cv", "CV / Resume")}
                          </h2>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {isEmployer
                              ? (cvFileName
                                  ? t("profile.companyIntroUploaded", "Your company introduction is attached.")
                                  : t("profile.companyIntroNotUploaded", "No company introduction uploaded yet."))
                              : (cvFileName
                                  ? t("profile.cvUploadedDesc", "Your CV is attached to your profile.")
                                  : t("profile.cvNotUploaded", "No CV uploaded yet."))}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cvDataUrl && (
                            <>
                              <a
                                href={cvDataUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
                              >
                                {isEmployer
                                  ? t("profile.viewCompanyIntro", "View introduction")
                                  : t("profile.viewCV", "View CV")}
                              </a>
                              <button
                                onClick={() => cvRef.current?.click()}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                              >
                                {t("profile.replaceCV", "Replace")}
                              </button>
                              <button
                                onClick={handleDeleteCV}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xs font-bold text-red-600 transition hover:bg-red-100"
                              >
                                X
                              </button>
                            </>
                          )}
                          {!cvDataUrl && (
                            <button
                              onClick={() => cvRef.current?.click()}
                              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground transition hover:bg-brand/90"
                            >
                              {isEmployer
                                ? t("profile.uploadCompanyIntro", "Upload introduction")
                                : t("profile.uploadCV", "Upload CV")}
                            </button>
                          )}
                          <input
                            ref={cvRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleCVChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          {isEmployer
                            ? t("profile.employerContact", "Contact info")
                            : t("profile.contactInfo", "Contact info")}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {isEmployer
                            ? t("profile.employerContactDesc", "Ways candidates can reach out to your business.")
                            : t("profile.candidateContactDesc", "Employers will use these channels to reach you faster.")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {contactItems.map((contact) => (
                        <div
                          key={contact.label}
                          onClick={() => setIsEditing(true)}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 p-3 transition hover:bg-brand/5"
                        >
                          <contact.icon className="h-4 w-4 text-slate-500" />
                          {contact.value ? (
                            contact.href ? (
                              <a
                                href={contact.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-slate-700 transition hover:text-brand"
                              >
                                {contact.value}
                              </a>
                            ) : (
                              <span className="text-sm text-slate-700">{contact.value}</span>
                            )
                          ) : (
                            <span className="text-sm text-slate-500">{t("common.notProvided", "Not provided")}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
                  {isEmployer ? (
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {t("profile.recentApplicants", "Recent applicants")}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {t(
                              "profile.recentApplicants.desc",
                              "See who applied recently and jump into direct contact.",
                            )}
                          </p>
                        </div>
                        <Badge className="rounded-full bg-brand/10 px-3 py-1 text-sm text-brand">
                          {t("profile.hiring", "Hiring")}
                        </Badge>
                      </div>
                      <div className="mt-6 space-y-4">
                        {loadingApplications ? (
                          <EmptyState text={t("profile.loadingApplicants", "Loading applicants...")} />
                        ) : recentApplicants.length > 0 ? (
                          recentApplicants.map((application) => (
                            <ApplicantCard
                              key={application.id}
                              application={application}
                              onStatusUpdate={(id, status) => {
                                setEmployerApplications((prev) =>
                                  prev.map((a) =>
                                    a.id === id ? { ...a, status } : a,
                                  ),
                                );
                              }}
                            />
                          ))
                        ) : (
                          <EmptyState
                            text={t(
                              "profile.noApplicants",
                              "No applicants yet. Share your jobs and candidates will appear here.",
                            )}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">{t("profile.yourTalentOffers", "Your talent offers")}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {t("profile.candidateOfferDesc", "This is what employers see when they browse candidate offers.")}
                          </p>
                        </div>
                        <Link to="/post-announcement" className="text-sm font-semibold text-brand">
                          {t("profile.createNew", "Create new")}
                        </Link>
                      </div>
                      <div className="mt-6 grid gap-4">
                        {ownTalentOffers.length > 0 ? (
                          ownTalentOffers.slice(0, 2).map((offer) => (
                            <TalentOfferCard key={offer.id} offer={offer} compact />
                          ))
                        ) : (
                          <EmptyState text={t("profile.noTalentOffers", "No talent offers yet. Publish one so employers can discover your profile.")} />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h2 className="text-lg font-semibold text-foreground">
                      {isEmployer
                        ? t("profile.talentBoardSnapshot", "Talent board snapshot")
                        : t("profile.accountDetails", "Account details")}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      {isEmployer ? (
                        <>
                          <div className="rounded-2xl bg-muted p-3">
                            {t("profile.availableTalentOffers", "Available talent offers: {count}", { count: marketTalentOffers.length })}
                          </div>
                          <div className="rounded-2xl bg-muted p-3">
                            {t("profile.totalApplicants", "Total applicants: {count}", { count: employerApplications.length })}
                          </div>
                          <div className="rounded-2xl bg-muted p-3">
                            {t("profile.bestNextStep", "Best next step: review recent applicants and shortlist matching offers.")}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-2xl bg-muted p-3">{t("profile.username", "Username")}: {profile.username}</div>
                          <div className="rounded-2xl bg-muted p-3">{t("common.location", "Location")}: {profile.location}</div>
                          <div className="rounded-2xl bg-muted p-3">{t("profile.savedJobs", "Saved jobs")}: {savedJobs.length}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isEmployer && activeTab === "offers" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.yourJobseekingOffers", "Your jobseeking offers")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("profile.detailedTalentCards", "Detailed talent cards that employers can browse from the platform.")}
                    </p>
                  </div>
                  <Link to="/post-announcement" className="text-sm font-semibold text-brand">
                    {t("profile.createOffer", "Create offer")}
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  {ownTalentOffers.length > 0 ? (
                    ownTalentOffers.map((offer) => <TalentOfferCard key={offer.id} offer={offer} />)
                  ) : (
                    <EmptyState text={t("profile.noOffersPublished", "You have not published any talent offers yet.")} />
                  )}
                </div>
              </div>
            )}

            {!isEmployer && activeTab === "applied" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.appliedJobs", "Applied jobs")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("profile.reviewAppliedRoles", "Review the roles you already applied to.")}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {loadingCandidateApps ? (
                    <EmptyState text="Loading..." />
                  ) : appliedJobs.length > 0 ? (
                    appliedJobs.map((job) => {
                      const app = candidateApplications.find((a) => a.jobId === job.id);
                      const status = app?.status || "applied";
                      const statusColors: Record<string, string> = {
                        new: "bg-blue-100 text-blue-700",
                        applied: "bg-slate-100 text-slate-700",
                        accepted: "bg-emerald-100 text-emerald-700",
                        rejected: "bg-red-100 text-red-700",
                      };
                      return (
                        <div key={job.id} className="rounded-3xl border border-slate-200 p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2 min-w-0">
                                <p className="truncate font-semibold text-slate-900">{job.title}</p>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "bg-slate-100 text-slate-700"}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {job.company} - {job.location}
                              </p>
                            </div>
                            <p className="text-sm text-slate-500">{app ? formatDateLabel(app.updatedAt || app.createdAt) : job.postedAgo}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyState text="You have not applied to any jobs yet." />
                  )}
                </div>
              </div>
            )}

            {!isEmployer && activeTab === "saved" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.savedJobs", "Saved jobs")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("profile.jobsMarkedLater", "Jobs you marked to review later.")}
                    </p>
                  </div>
                  <Link to="/search" className="text-sm font-semibold text-brand">
                    {t("footer.browseJobs", "Browse jobs")}
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {savedJobs.length > 0 ? (
                    savedJobs.map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <EmptyState text="No saved jobs yet. Use the save icon on listings to keep opportunities." />
                  )}
                </div>
              </div>
            )}

            {isEmployer && activeTab === "jobs" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.yourJobPostings", "Your job postings")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Track every listing with views, saves, and applicant counts.
                    </p>
                  </div>
                  <Link to="/post-job" className="text-sm font-semibold text-brand">
                    Post a new job
                  </Link>
                </div>
                <div className="mt-6 space-y-4">
                  {employerJobs.length > 0 ? (
                    employerJobs.map((job) => (
                      <div key={job.id} className="rounded-3xl border border-slate-200 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                              <h3 className="truncate text-lg font-semibold text-slate-950">{job.title}</h3>
                              <Badge className="rounded-full bg-brand/10 px-3 py-1 text-xs text-brand">
                                {job.typeLabel || job.type}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">
                              {job.location} Â· Posted {job.postedAgo}
                            </p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <MetricPill label="Applicants" value={`${applicationsByJobId.get(job.id || "")?.length ?? job.applicationCount ?? 0}`} />
                            <MetricPill label="Saved" value={`${job.savedCount ?? 0}`} />
                            <MetricPill label="Views" value={`${job.viewCount ?? 0}`} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState text="No jobs posted yet. Create your first opening to start receiving applicants." />
                  )}
                </div>
              </div>
            )}

            {isEmployer && activeTab === "applicants" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.applicants", "Applicants")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review candidate details, job targets, notes, and contact channels.
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {loadingApplications ? (
                    <EmptyState text="Loading applicants..." />
                  ) : employerApplications.length > 0 ? (
                    employerApplications.map((application) => (
                      <ApplicantCard
                        key={application.id}
                        application={application}
                        detailed
                        onStatusUpdate={(id, status) => {
                          setEmployerApplications((prev) =>
                            prev.map((a) =>
                              a.id === id ? { ...a, status } : a,
                            ),
                          );
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState text="You have not received applications yet." />
                  )}
                </div>
              </div>
            )}

            {isEmployer && activeTab === "talent" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.talentBoard", "Talent board")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Browse detailed jobseeking offers published by candidates.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  {marketTalentOffers.length > 0 ? (
                    marketTalentOffers.map((offer) => <TalentOfferCard key={offer.id} offer={offer} />)
                  ) : (
                    <EmptyState text="No talent offers are live yet. Candidate offers will appear here automatically." />
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{t("profile.settings", "Settings")}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("profile.settingsDesc", "Manage your appearance and profile preferences.")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{t("profile.appearance", "Appearance")}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {t("profile.appearanceDesc", "Choose light or dark mode for the site.")}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
                      {(["light", "dark"] as const).map((nextTheme) => (
                        <button
                          key={nextTheme}
                          type="button"
                          onClick={() => {
                            setTheme(nextTheme);
                            applyTheme(nextTheme);
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            theme === nextTheme
                              ? "bg-brand text-brand-foreground"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {nextTheme === "light" ? "Light" : "Dark"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Dialog open={isEditing} onOpenChange={(open) => {
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
                bio: user.bio ?? "",
              });
            }
          }}>
            <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-3xl p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">{t("profile.edit", "Edit profile")}</DialogTitle>
                <DialogDescription>
                  Update your profile details and contact information.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="h-24 w-24 border border-slate-200">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback>{profile.fullName.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-900">{t("profile.profilePhoto", "Profile photo")}</p>
                      <p className="text-sm text-slate-500">
                        Upload a photo or keep the default avatar.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90">
                      <Camera className="h-4 w-4" />
                      <span>{t("profile.uploadImage", "Upload image")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="Full name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
                    <InputField label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
                    <div className="space-y-2 text-sm text-slate-700">
                      <span>{t("common.location", "Location")}</span>
                      <select
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      >
                        {(algerianLocations.length > 0 ? algerianLocations : ["Algiers"]).map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {isEmployer ? (
                      <InputField
                        label="Company name"
                        value={form.companyName}
                        onChange={(value) => setForm({ ...form, companyName: value })}
                      />
                    ) : (
                      <div className="space-y-2 text-sm text-slate-700">
                        <span>Profession</span>
                        <select
                          value={form.profession}
                          onChange={(e) => setForm({ ...form, profession: e.target.value })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        >
                          <option value="">Select your profession...</option>
                          {(categories ?? []).map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    <InputField
                      label="Website"
                      value={form.website}
                      onChange={(value) => setForm({ ...form, website: value })}
                      placeholder="www.example.dz"
                    />
                  </div>

                  <label className="space-y-2 text-sm text-slate-700">
                    Bio
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <InputField
                      label="Phone"
                      value={form.phone}
                      onChange={(value) => setForm({ ...form, phone: value })}
                      placeholder="+213 5xx xxx xxx"
                    />
                    <InputField
                      label="WhatsApp"
                      value={form.whatsapp}
                      onChange={(value) => setForm({ ...form, whatsapp: value })}
                      placeholder="5xxxxxxxx"
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <InputField
                      label="Telegram"
                      value={form.telegram}
                      onChange={(value) => setForm({ ...form, telegram: value })}
                      placeholder="@username"
                    />
                    <InputField
                      label="Facebook"
                      value={form.facebook}
                      onChange={(value) => setForm({ ...form, facebook: value })}
                      placeholder="facebook.com/in/username"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand/90"
                >
                  {t("profile.saveChanges", "Save changes")}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ApplicantCard({
  application,
  detailed = false,
  onStatusUpdate,
}: {
  application: Application;
  detailed?: boolean;
  onStatusUpdate?: (id: string, status: "accepted" | "rejected") => void;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const quickContacts = [
    {
      label: application.primaryContact ? "Primary" : "Email",
      value: application.primaryContact || application.applicantEmail,
      href: application.primaryContact?.includes("@")
        ? `mailto:${application.primaryContact}`
        : application.primaryContact
          ? undefined
          : application.applicantEmail
            ? `mailto:${application.applicantEmail}`
            : undefined,
    },
    {
      label: "Phone",
      value: application.applicantPhone || application.secondaryContact,
      href:
        application.applicantPhone || application.secondaryContact
          ? `tel:${application.applicantPhone || application.secondaryContact}`
          : undefined,
    },
    {
      label: "WhatsApp",
      value: application.applicantWhatsapp,
      href: application.applicantWhatsapp
        ? `https://wa.me/${application.applicantWhatsapp.replace(/[^0-9]/g, "")}`
        : undefined,
    },
  ].filter((item) => item.value);

  return (
    <div className="rounded-3xl border border-slate-200 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border border-slate-200">
            <AvatarImage src={application.applicantAvatar} />
            <AvatarFallback>{(application.applicantName || "A").slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h3 className="truncate text-lg font-semibold text-slate-950">{application.applicantName}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                application.status === "accepted"
                  ? "bg-emerald-100 text-emerald-700"
                  : application.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
              }`}>
                {(application.status || "new").charAt(0).toUpperCase() + (application.status || "new").slice(1)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {application.applicantProfession || "Candidate"} · {application.applicantLocation || "Alger"}
            </p>
            <p className="mt-2 text-sm font-medium text-brand">Applied to: {application.jobTitle}</p>
          </div>
        </div>
        <div className="text-sm text-slate-500">Received {formatDateLabel(application.createdAt)}</div>
      </div>

      {(application.note || detailed) && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          {application.note || "No note was attached to this application."}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {quickContacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href?.startsWith("http") ? "_blank" : undefined}
            rel={contact.href?.startsWith("http") ? "noreferrer" : undefined}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand/30 hover:text-brand"
          >
            {contact.label}: {contact.value}
          </a>
        ))}
        {application.applicantFacebook && (
          <a
            href={
              application.applicantFacebook.startsWith("http")
                ? application.applicantFacebook
                : `https://${application.applicantFacebook}`
            }
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand/30 hover:text-brand"
          >
            Facebook
          </a>
        )}
        <Link
          to="/profile"
          search={{ userId: application.applicantId }}
          className="rounded-full border border-brand/30 px-3 py-2 text-sm text-brand transition hover:bg-brand/5"
        >
          View Profile
        </Link>
      </div>

      {detailed && application.status === "new" && onStatusUpdate && (
        <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
          <button
            disabled={updating === "accepted"}
            onClick={async () => {
              setUpdating("accepted");
              try {
                await applicationService.updateStatus(application.id!, "accepted");
                onStatusUpdate(application.id!, "accepted");
                toast.success("Application accepted!");
              } catch {
                toast.error("Failed to accept application.");
              } finally {
                setUpdating(null);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {updating === "accepted" ? "Accepting..." : "Accept"}
          </button>
          <button
            disabled={updating === "rejected"}
            onClick={async () => {
              setUpdating("rejected");
              try {
                await applicationService.updateStatus(application.id!, "rejected");
                onStatusUpdate(application.id!, "rejected");
                toast.success("Application declined.");
              } catch {
                toast.error("Failed to decline application.");
              } finally {
                setUpdating(null);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            {updating === "rejected" ? "Declining..." : "Decline"}
          </button>
        </div>
      )}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
      {text}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2 text-sm text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

