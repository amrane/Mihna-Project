import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  Check,
  DollarSign,
  Facebook,
  Globe2,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
  Tag,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestoreCollection, type Job } from "@/hooks/use-firestore";
import { ApiError, apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { jobService } from "@/lib/firestore-service";
import { useI18n } from "@/lib/i18n";
import type { User } from "@/lib/api-types";

export const Route = createFileRoute("/job/$id")({
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: jobs } = useFirestoreCollection<Job>("jobs");
  const { user, applyToJob } = useAuth();
  const { t, tt } = useI18n();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryContact, setPrimaryContact] = useState("");
  const [secondaryContact, setSecondaryContact] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [note, setNote] = useState("");
  const [showEmployer, setShowEmployer] = useState(false);
  const [employerData, setEmployerData] = useState<User | null>(null);
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

    return jobs
      .filter(
        (candidate) =>
          candidate.id !== job.id &&
          (candidate.category === job.category || candidate.categoryId === job.categoryId),
      )
      .slice(0, 3);
  }, [jobs, job]);

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

  if (missing || !job) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{t("job.notFound.title", "Job not found")}</h1>
          <p className="mt-3 text-muted-foreground">
            {t(
              "job.notFound.desc",
              "This listing may have been removed or is no longer available.",
            )}
          </p>
          <Link to="/search" className="mt-6 text-brand">
            {t("job.backToJobs", "Back to jobs")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const companyName = job.company || job.companyName || "Unknown company";
  const locationName = job.location || job.locationLabel || job.wilayaName || "Anywhere";
  const displayLocationName =
    locationName === "Anywhere" ? t("common.anywhere", "Anywhere") : tt(locationName);
  const categoryName = job.categoryId || job.category || "Other";
  const isOwnJob = Boolean(user?.uid && job.employerId && user.uid === job.employerId);
  const hasApplied = Boolean(job.id && user?.appliedJobIds?.includes(job.id));
  const userContacts = [
    {
      label: t("common.email", "Email"),
      value: user?.email,
      href: user?.email ? `mailto:${user.email}` : undefined,
      icon: Mail,
    },
    {
      label: t("common.phone", "Phone"),
      value: user?.phone,
      href: user?.phone ? `tel:${user.phone}` : undefined,
      icon: PhoneCall,
    },
    {
      label: t("common.website", "Website"),
      value: user?.website,
      href: user?.website?.startsWith("http")
        ? user.website
        : user?.website
          ? `https://${user.website}`
          : undefined,
      icon: Globe2,
    },
    {
      label: t("common.whatsapp", "WhatsApp"),
      value: user?.whatsapp,
      href: user?.whatsapp ? `https://wa.me/${user.whatsapp.replace(/[^0-9]/g, "")}` : undefined,
      icon: MessageCircle,
    },
    {
      label: t("common.telegram", "Telegram"),
      value: user?.telegram,
      href: user?.telegram ? `https://t.me/${user.telegram.replace(/^@/, "")}` : undefined,
      icon: MessageCircle,
    },
  ].filter((item) => item.value);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job.id) return;

    if (!user) {
      toast.error(t("job.applyLogin", "Log in to apply"));
      navigate({ to: "/auth", search: { mode: "login" } as never });
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
        note,
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
      const res = await apiRequest<{ user: User }>(`/users/by-uid/${job.employerId}`);
      setEmployerData(res.user);
    } catch {
      setEmployerData(null);
    } finally {
      setLoadingEmployer(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="text-xs text-muted-foreground">{(() => {
              const now = Date.now();
              const updated = job.updatedAt?.toMillis ? job.updatedAt.toMillis() : (job.updatedAt as any)?.seconds ? (job.updatedAt as any).seconds * 1000 : typeof job.updatedAt === "number" ? job.updatedAt : now;
              const diffMs = now - updated;
              const mins = Math.floor(diffMs / 60000);
              const hrs = Math.floor(diffMs / 3600000);
              const days = Math.floor(diffMs / 86400000);
              if (mins < 1) return t("job.justNow", "Just now");
              if (mins < 60) return t("job.minutesAgo", "{mins} min ago", { mins });
              if (hrs < 24) return t("job.hoursAgo", "{hrs}h ago", { hrs });
              return t("job.daysAgo", "{days} days ago", { days });
            })()}</div>
            <div className="mt-2 flex flex-wrap items-start gap-4">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={companyName} className="h-12 w-12 rounded-xl" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-lg font-bold text-brand">
                  {(companyName || "C").slice(0, 2)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-2xl font-bold">{job.title}</h1>
                <div className="mt-1 text-sm text-muted-foreground">{companyName}</div>
              </div>
              <div className="flex flex-wrap gap-3">
                {!user ? (
                  <Button
                    asChild
                    className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <Link to="/auth" search={{ mode: "login" }}>
                      {t("job.applyLogin", "Log in to apply")}
                    </Link>
                  </Button>
                ) : user.accountType === "employer" ? (
                  <Button asChild className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90">
                    <Link to="/post-job">{t("job.employerPostJob", "Post a job")}</Link>
                  </Button>
                ) : isOwnJob ? (
                  <Button asChild className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90">
                    <Link to="/profile">{t("job.yourListing", "Your listing")}</Link>
                  </Button>
                ) : hasApplied ? (
                  <Button disabled className="rounded-xl">
                    {t("job.applied", "Applied")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => document.getElementById("job-application-form")?.scrollIntoView({ behavior: "smooth" })}
                    className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    {t("job.applyNow", "Apply now")}
                  </Button>
                )}
                <Button asChild variant="secondary" className="rounded-xl">
                  <Link to="/search">{t("job.backToJobs", "Back to jobs")}</Link>
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> {tt(job.typeLabel || job.type)}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {displayLocationName}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                {job.salaryMin.toLocaleString()} -{" "}
                {job.salaryMax.toLocaleString()} DZD
              </span>
            </div>

            <h2 className="mt-8 text-lg font-bold">{t("job.description", "Job description")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{job.description}</p>

            <h2 className="mt-8 text-lg font-bold">
              {t("job.responsibilities", "Key responsibilities")}
            </h2>
            <ul className="mt-3 space-y-2">
              {job.responsibilities.map((responsibility) => (
                <li key={responsibility} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {responsibility}
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-bold">{t("job.skills", "Professional skills")}</h2>
            <ul className="mt-3 space-y-2">
              {job.skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {skill}
                </li>
              ))}
            </ul>

            {job.contactInstructions && (
              <>
                <h2 className="mt-8 text-lg font-bold">
                  {t("job.contactInstructions", "Contact or application instructions")}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {job.contactInstructions}
                </p>
              </>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-5">
              <span className="text-sm font-semibold">{t("job.tags", "Tags:")}</span>
              {job.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-md border-brand-soft bg-brand-soft text-brand"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 text-sm">
              <span className="font-semibold">{t("job.share", "Share:")}</span>
              <Facebook className="h-4 w-4 text-muted-foreground hover:text-brand" />
              <Twitter className="h-4 w-4 text-muted-foreground hover:text-brand" />
              <Linkedin className="h-4 w-4 text-muted-foreground hover:text-brand" />
            </div>
          </div>

          <h3 className="mt-10 text-2xl font-bold">{t("job.related", "Related jobs")}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((relatedJob) => (
              <JobCard key={relatedJob.id} job={relatedJob} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-brand-soft/60 p-6">
            <h3 className="font-bold">{t("job.overview", "Job overview")}</h3>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                { icon: Briefcase, label: t("job.title", "Job title"), value: job.title },
                { icon: Layers, label: t("job.type", "Job type"), value: tt(job.typeLabel || job.type) },
                { icon: Tag, label: t("common.category", "Category"), value: tt(categoryName) },
                {
                  icon: DollarSign,
                  label: t("common.salary", "Salary"),
                  value: `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} DZD`,
                },
                { icon: MapPin, label: t("common.location", "Location"), value: displayLocationName },
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

          {!user ? (
            <div className="rounded-2xl bg-brand-soft/60 p-6">
              <h3 className="font-bold">{t("job.apply", "Apply for this job")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Log in to save your application to your account and track it from your profile.
              </p>
              <Button asChild className="mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/auth" search={{ mode: "login" }}>
                  {t("auth.logIn", "Log in")}
                </Link>
              </Button>
            </div>
          ) : user.accountType === "employer" ? (
            <div className="rounded-2xl bg-brand-soft/60 p-6">
              <h3 className="font-bold">{t("job.employerPostJob", "Post a job")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("job.employerPostDesc", "Looking to hire? Publish a job opening to attract candidates directly.")}
              </p>
              <Button asChild className="mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/post-job">{t("job.employerPostJob", "Post a job")}</Link>
              </Button>
            </div>
          ) : isOwnJob ? (
            <div className="rounded-2xl bg-brand-soft/60 p-6">
              <h3 className="font-bold">{t("job.yourListing", "Your listing")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("job.yourListingDesc", "This is your job posting. Manage it from your dashboard.")}
              </p>
              <Button asChild className="mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/profile">{t("job.openDashboard", "Open dashboard")}</Link>
              </Button>
            </div>
          ) : hasApplied ? (
            <div className="rounded-2xl bg-brand-soft/60 p-6">
              <h3 className="font-bold">{t("job.applicationRecorded", "Application recorded")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This job is already in your applied list. You can review it from your profile.
              </p>
              <Button onClick={fetchEmployerProfile} className="mt-4 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90">
                {t("job.viewProfile", "View profile")}
              </Button>
            </div>
          ) : (
            <form
              id="job-application-form"
              onSubmit={handleApply}
              className="rounded-2xl bg-brand-soft/60 p-6"
            >
              <h3 className="font-bold">{t("job.contactMethod", "Contact method")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Share the easiest way for the employer to reach you.
              </p>
              {userContacts.length > 0 && (
                <div className="mt-4 rounded-2xl bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("job.savedContactShortcuts", "Your saved contact shortcuts")}
                  </p>
                  <div className="mt-3 space-y-2">
                    {userContacts.map((contact) => (
                      <a
                        key={contact.label}
                        href={contact.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                      >
                        <contact.icon className="h-4 w-4 text-slate-500" />
                        <span>
                          {contact.label}: {contact.value}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-lg bg-white px-3">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    value={primaryContact}
                    onChange={(e) => setPrimaryContact(e.target.value)}
                    placeholder="WhatsApp number, Telegram username, or email"
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white px-3">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={secondaryContact}
                    onChange={(e) => setSecondaryContact(e.target.value)}
                    placeholder="Alternative phone or profile link"
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white px-3">
                  <Globe2 className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={contactLink}
                    onChange={(e) => setContactLink(e.target.value)}
                    placeholder="Link (portfolio, LinkedIn, etc.)"
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Short note for the employer"
                  rows={4}
                  className="bg-white"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? t("postAnnouncement.publishing", "Publishing...") : t("job.apply", "Apply for this job")}
                </Button>
              </div>
            </form>
          )}
        </aside>
      </div>
      <Footer />

      <Dialog open={showEmployer} onOpenChange={setShowEmployer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("job.employerProfile", "Employer Profile")}</DialogTitle>
          </DialogHeader>
          {loadingEmployer ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : employerData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={employerData.avatar || employerData.photoURL} />
                  <AvatarFallback>{employerData.fullName?.slice(0, 2) || "EM"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{employerData.fullName}</p>
                  {employerData.companyName && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {employerData.companyName}
                    </div>
                  )}
                  {employerData.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {employerData.location}
                    </div>
                  )}
                </div>
              </div>
              {employerData.bio && (
                <p className="text-sm text-muted-foreground">{employerData.bio}</p>
              )}
              <div className="space-y-2">
                {employerData.email && (
                  <a href={`mailto:${employerData.email}`} className="flex items-center gap-2 text-sm text-brand hover:underline">
                    <Mail className="h-4 w-4" />
                    {employerData.email}
                  </a>
                )}
                {employerData.phone && (
                  <a href={`tel:${employerData.phone}`} className="flex items-center gap-2 text-sm text-brand hover:underline">
                    <PhoneCall className="h-4 w-4" />
                    {employerData.phone}
                  </a>
                )}
                {employerData.website && (
                  <a href={employerData.website.startsWith("http") ? employerData.website : `https://${employerData.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                    <Globe2 className="h-4 w-4" />
                    {employerData.website}
                  </a>
                )}
                {employerData.whatsapp && (
                  <a href={`https://wa.me/${employerData.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                {employerData.telegram && (
                  <a href={`https://t.me/${employerData.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                    <Send className="h-4 w-4" />
                    @{employerData.telegram.replace(/^@/, "")}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Could not load employer profile.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
