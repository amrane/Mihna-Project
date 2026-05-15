import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/hooks/use-firestore";
import { toast } from "sonner";
import { getDairas, getWilayas } from "@/lib/wilaya-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const typeStyles: Record<string, string> = {
  "full-time": "bg-brand/10 text-brand border-brand/20",
  freelance: "bg-brand/10 text-brand border-brand/20",
  "part-time": "bg-brand/10 text-brand border-brand/20",
  internship: "bg-brand/10 text-brand border-brand/20",
};

export function JobCard({ job, featured }: { job: Job; featured?: boolean }) {
  const { user, toggleSavedJob } = useAuth();
  const { t } = useI18n();
  const legacyJob = job as Job & {
    wilayaName?: string;
    companyName?: string;
    typeId?: string;
  };
  const [isSaving, setIsSaving] = useState(false);

  const [displayLocation, setDisplayLocation] = useState<string>(
    legacyJob.wilayaName || job.location || "Anywhere",
  );

  useEffect(() => {
    let active = true;
    async function resolveLocation() {
      if (legacyJob.wilayaName) {
        if (active) setDisplayLocation(legacyJob.wilayaName);
        return;
      }

      const loc = job.location || "Anywhere";

      if (!loc || loc === "Anywhere") {
        if (active) setDisplayLocation("Anywhere");
        return;
      }

      const trimmed = loc.trim();
      try {
        const [dairas, wilayas] = await Promise.all([getDairas(), getWilayas()]);
        const lower = trimmed.toLowerCase();

        const foundDaira = dairas.find(
          (d) => d.name.toLowerCase() === lower || lower.includes(d.name.toLowerCase()),
        );
        if (foundDaira) {
          if (!active) return;
          const parentWilaya = wilayas.find((w) => w.code === foundDaira.wilayaCode);
          setDisplayLocation(
            parentWilaya ? `${foundDaira.name}, ${parentWilaya.name}` : foundDaira.name,
          );
          return;
        }

        const foundWilaya = wilayas.find(
          (w) => w.name.toLowerCase() === lower || lower.includes(w.name.toLowerCase()),
        );
        if (foundWilaya) {
          if (!active) return;
          setDisplayLocation(foundWilaya.name);
          return;
        }

        if (active) setDisplayLocation(trimmed || "Anywhere");
      } catch (err) {
        if (active) setDisplayLocation(trimmed || "Anywhere");
      }
    }

    resolveLocation();
    return () => {
      active = false;
    };
  }, [job.location, legacyJob.wilayaName]);

  const companyName = legacyJob.companyName || job.company || "";
  const companyLogo = job.companyLogo || "";

  const rawType = job.typeLabel || job.type || legacyJob.typeId || "";
  const normalizeTypeKey = (t: string) => {
    const lower = (t || "").toLowerCase();
    if (lower.includes("full")) return "full-time";
    if (lower.includes("freelance") || lower.includes("freelancer")) return "freelance";
    if (lower.includes("part")) return "part-time";
    if (lower.includes("intern")) return "internship";
    return "freelance";
  };
  const typeKey = normalizeTypeKey(rawType || "");
  const displayTypeLabel = rawType ? t(`type.${typeKey}`, rawType) : t(`type.${typeKey}`, typeKey);

  const jobId = job.id || "";
  const savedIds = user?.savedJobIds ?? [];
  const isSaved = savedIds.includes(jobId);
  const payLabel =
    typeKey === "freelance"
      ? t("common.budget", "Budget")
      : typeKey === "internship"
        ? t("common.stipend", "Stipend")
        : t("common.salary", "Salary");
  const payPeriod =
    typeKey === "freelance" ? t("common.project", "project") : t("common.month", "month");
  const displayLocationLabel =
    displayLocation === "Anywhere" ? t("common.anywhere", "Anywhere") : displayLocation;
  const formatDzd = (value: number) => `${value.toLocaleString("fr-DZ")} DZD`;

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t("jobCard.loginToSave", "Log in to save jobs to your account."));
      return;
    }

    if (!jobId || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      const { saved } = await toggleSavedJob(jobId);
      toast.success(
        saved
          ? t("jobCard.saved", "Job saved")
          : t("jobCard.unsaved", "Job removed from saved list"),
      );
    } catch (error) {
      console.error("Failed to save job:", error);
      toast.error(t("jobCard.saveFailed", "Could not update your saved jobs. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Link
      to="/job/$id"
      params={{ id: jobId }}
      className={`group relative flex flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-card) ${featured ? "overflow-hidden" : ""}`}
    >
      {featured && (
        <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight group-hover:text-brand">
            {job.title}
          </h3>
          <Badge
            variant="outline"
            className={`mt-2 rounded-md text-[10px] uppercase tracking-wide ${typeStyles[typeKey]}`}
          >
            {displayTypeLabel}
          </Badge>
          {(job.salaryMin ?? 0) > 0 || (job.salaryMax ?? 0) > 0 ? (
            <div className="mt-1 text-xs text-muted-foreground">
              {payLabel}: {formatDzd(job.salaryMin ?? 0)} - {formatDzd(job.salaryMax ?? 0)}
              <span className="text-muted-foreground/70"> / {payPeriod}</span>
            </div>
          ) : (
            <div className="mt-1 text-xs text-muted-foreground">
              {payLabel}: {t("common.negotiable", "Negotiable")}
            </div>
          )}
        </div>
        <button
          onClick={toggleSave}
          disabled={isSaving}
          className={`hover:text-brand ${isSaved ? "text-emerald-700" : "text-muted-foreground"}`}
          aria-label={
            isSaved
              ? t("jobCard.unsave", "Unsave {title}", { title: job.title })
              : t("jobCard.save", "Save {title}", { title: job.title })
          }
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3 border-t pt-3">
        {companyLogo ? (
          <img src={companyLogo} alt={companyName} className="h-7 w-7 rounded-md" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/10 text-[10px] font-bold text-brand">
            {(companyName || "C").slice(0, 1)}
          </span>
        )}
        <div className="flex-1 text-sm">
          <div className="font-medium">{companyName}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span
              className={
                displayLocation && displayLocation !== "Anywhere" ? "" : "text-muted-foreground/70"
              }
            >
              {displayLocationLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
