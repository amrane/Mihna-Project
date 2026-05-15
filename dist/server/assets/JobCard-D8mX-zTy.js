import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin } from "lucide-react";
import { B as Badge } from "./badge-BiVmFZBi.js";
import { toast } from "sonner";
import { d as getDairas, g as getWilayas } from "./use-firestore-uoDfirYi.js";
import { u as useAuth, a as useI18n } from "./router-Bte9I49t.js";
const typeStyles = {
  "full-time": "bg-brand/10 text-brand border-brand/20",
  freelance: "bg-brand/10 text-brand border-brand/20",
  "part-time": "bg-brand/10 text-brand border-brand/20",
  internship: "bg-brand/10 text-brand border-brand/20"
};
function JobCard({ job, featured }) {
  const { user, toggleSavedJob } = useAuth();
  const { t } = useI18n();
  const legacyJob = job;
  const [isSaving, setIsSaving] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(
    legacyJob.wilayaName || job.location || "Anywhere"
  );
  useEffect(() => {
    let active = true;
    async function resolveLocation() {
      if (legacyJob.wilayaName) {
        if (active) setDisplayLocation(legacyJob.wilayaName);
        return;
      }
      const loc = job.location || "Anywhere";
      if (loc === "Anywhere") {
        if (active) setDisplayLocation("Anywhere");
        return;
      }
      const trimmed = loc.trim();
      try {
        const [dairas, wilayas] = await Promise.all([getDairas(), getWilayas()]);
        const lower = trimmed.toLowerCase();
        const foundDaira = dairas.find(
          (d) => d.name.toLowerCase() === lower || lower.includes(d.name.toLowerCase())
        );
        if (foundDaira) {
          if (!active) return;
          const parentWilaya = wilayas.find((w) => w.code === foundDaira.wilayaCode);
          setDisplayLocation(
            parentWilaya ? `${foundDaira.name}, ${parentWilaya.name}` : foundDaira.name
          );
          return;
        }
        const foundWilaya = wilayas.find(
          (w) => w.name.toLowerCase() === lower || lower.includes(w.name.toLowerCase())
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
  const normalizeTypeKey = (t2) => {
    const lower = (t2 || "").toLowerCase();
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
  const payLabel = typeKey === "freelance" ? t("common.budget", "Budget") : typeKey === "internship" ? t("common.stipend", "Stipend") : t("common.salary", "Salary");
  const payPeriod = typeKey === "freelance" ? t("common.project", "project") : t("common.month", "month");
  const displayLocationLabel = displayLocation === "Anywhere" ? t("common.anywhere", "Anywhere") : displayLocation;
  const formatDzd = (value) => `${value.toLocaleString("fr-DZ")} DZD`;
  const toggleSave = async (e) => {
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
        saved ? t("jobCard.saved", "Job saved") : t("jobCard.unsaved", "Job removed from saved list")
      );
    } catch (error) {
      console.error("Failed to save job:", error);
      toast.error(t("jobCard.saveFailed", "Could not update your saved jobs. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/job/$id",
      params: { id: jobId },
      className: `group relative flex flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-card) ${featured ? "overflow-hidden" : ""}`,
      children: [
        featured && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "truncate text-base font-semibold leading-tight group-hover:text-brand", children: job.title }),
            /* @__PURE__ */ jsx(
              Badge,
              {
                variant: "outline",
                className: `mt-2 rounded-md text-[10px] uppercase tracking-wide ${typeStyles[typeKey]}`,
                children: displayTypeLabel
              }
            ),
            (job.salaryMin ?? 0) > 0 || (job.salaryMax ?? 0) > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
              payLabel,
              ": ",
              formatDzd(job.salaryMin ?? 0),
              " - ",
              formatDzd(job.salaryMax ?? 0),
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground/70", children: [
                " / ",
                payPeriod
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
              payLabel,
              ": ",
              t("common.negotiable", "Negotiable")
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleSave,
              disabled: isSaving,
              className: `hover:text-brand ${isSaved ? "text-emerald-700" : "text-muted-foreground"}`,
              "aria-label": isSaved ? t("jobCard.unsave", "Unsave {title}", { title: job.title }) : t("jobCard.save", "Save {title}", { title: job.title }),
              children: /* @__PURE__ */ jsx(Bookmark, { className: `h-4 w-4 ${isSaved ? "fill-current" : ""}` })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3 border-t pt-3", children: [
          companyLogo ? /* @__PURE__ */ jsx("img", { src: companyLogo, alt: companyName, className: "h-7 w-7 rounded-md" }) : /* @__PURE__ */ jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-md bg-brand/10 text-[10px] font-bold text-brand", children: (companyName || "C").slice(0, 1) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: companyName }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: displayLocation && displayLocation !== "Anywhere" ? "" : "text-muted-foreground/70",
                  children: displayLocationLabel
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  JobCard as J
};
