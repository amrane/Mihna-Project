import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Bookmark,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useFirestoreCollection, Job, CategoryItem, LocationItem } from "@/hooks/use-firestore";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { getWilayas } from "@/lib/wilaya-data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const SUGGESTED_TAGS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "JavaScript",
  "Java",
  "PHP",
  "Laravel",
  "UI/UX",
  "Figma",
  "Photoshop",
  "Illustrator",
  "Canva",
  "SEO",
  "Google Ads",
  "Content Writing",
  "Blog Writing",
  "Translation",
  "English",
  "French",
  "Arabic",
  "Video Editing",
  "Premiere Pro",
  "After Effects",
  "CapCut",
  "Social Media",
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Email Marketing",
  "Data Entry",
  "Excel",
  "Word",
  "PowerPoint",
  "Customer Service",
  "Sales",
  "Accounting",
  "QuickBooks",
  "Sage",
  "Project Management",
  "Trello",
  "Asana",
  "Technical Support",
  "IT Support",
  "Networking",
  "Graphic Design",
  "Web Development",
  "Mobile Development",
  "Flutter",
  "React Native",
  "Copywriting",
  "Photography",
  "Administrative",
  "Hospitality",
  "Construction",
  "Teaching",
  "Healthcare",
  "Nursing",
  "Driving",
  "Shopify",
  "WooCommerce",
  "WordPress",
  "HTML/CSS",
  "Git",
];

interface SearchParams {
  q?: string;
  loc?: string;
  type?: string;
  cat?: string;
}

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: (s.q as string) || "",
    loc: (s.loc as string) || "Anywhere",
    type: (s.type as string) || "all",
    cat: (s.cat as string) || "All categories",
  }),
  component: SearchPage,
});

function SearchPage() {
  const initial = Route.useSearch();
  const { user } = useAuth();
  const { t, tt, locale } = useI18n();
  const [q, setQ] = useState(initial.q || "");
  const [loc, setLoc] = useState(initial.loc || "Anywhere");
  const [type, setType] = useState(initial.type || "all");
  const [cat, setCat] = useState(initial.cat || "All categories");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(20);

  const { data: jobs, loading: jobsLoading } = useFirestoreCollection<Job>("jobs");
  const { data: categories } = useFirestoreCollection<CategoryItem>("categories");
  const { data: locations } = useFirestoreCollection<LocationItem>("locations", "order");

  const [wilayaLocations, setWilayaLocations] = useState<LocationItem[]>([]);

  useEffect(() => {
    const loadWilayas = async () => {
      try {
        const wilayas = await getWilayas();

        const wilayaItems: LocationItem[] = wilayas.map((w, idx) => ({
          id: w.code,
          name: w.name,
          isRemote: w.isRemote,
          order: idx,
        }));

        if (!wilayaItems.some((w) => w.name === "Anywhere")) {
          wilayaItems.unshift({ id: "anywhere", name: "Anywhere", order: -1 });
        }
        setWilayaLocations(wilayaItems);
      } catch (err) {
        console.error("Failed to load wilayas for locations:", err);
      }
    };

    loadWilayas();
  }, []);

  const displayLocations = useMemo(() => {
    const baseLocations = locations.length > 0 ? locations : wilayaLocations;
    const filtered = baseLocations.filter((loc) => loc.name !== "Anywhere");
    const anywhereItem = { id: "anywhere", name: "Anywhere", order: -1 };
    return [anywhereItem, ...filtered];
  }, [locations, wilayaLocations]);
  const savedIds = user?.savedJobIds ?? [];

  const mergedCategories = useMemo(() => {
    const allNames = new Set<string>();
    for (const kind of ["freelance", "full-time", "business"] as const) {
      for (const name of CATEGORY_CONFIG[kind].all) {
        allNames.add(name);
      }
    }
    const configItems: CategoryItem[] = [...allNames].map((name) => ({
      id: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      name,
    }));
    const merged = new Map<string, CategoryItem>();
    for (const c of categories) merged.set(c.id, c);
    for (const c of configItems) if (!merged.has(c.id)) merged.set(c.id, c);
    return [...merged.values()];
  }, [categories]);

  const results = useMemo(
    () =>
      jobs.filter((j) => {
        const title = (j.title as string) || ((j as any).jobTitle as string) || "";
        const company = (j.company as string) || ((j as any).companyName as string) || "";
        const skillsText = Array.isArray((j as any).skills)
          ? (j as any).skills.join(" ")
          : Array.isArray((j as any).skillIds)
            ? (j as any).skillIds.join(" ")
            : "";
        const tagsText = Array.isArray((j as any).tags)
          ? (j as any).tags.join(" ")
          : Array.isArray((j as any).tagIds)
            ? (j as any).tagIds.join(" ")
            : "";
        const description = (j.description as string) || "";
        const categoryText = (j.category as string) || ((j as any).categoryLabel as string) || "";
        const typeText =
          (j.type as string) ||
          ((j as any).typeLabel as string) ||
          ((j as any).typeId as string) ||
          "";

        const searchText =
          `${title} ${company} ${skillsText} ${tagsText} ${description} ${categoryText} ${typeText}`.toLowerCase();
        if (q && !searchText.includes((q || "").toLowerCase())) return false;

        if (loc !== "Anywhere") {
          const jobLoc = (
            (j.location as string) ||
            ((j as any).wilayaName as string) ||
            ""
          ).toLowerCase();
          if (!jobLoc.includes(loc.toLowerCase())) return false;
        }

        if (type !== "all") {
          const typeLower = type.toLowerCase();
          const rawType = ((j as any).typeLabel || (j as any).type || (j as any).typeId || "")
            .toString()
            .toLowerCase();

          const typeMatches =
            rawType === typeLower ||
            rawType.includes(typeLower.replace("-", "")) ||
            rawType.replace("jt_", "").replace("fulltime", "full-time") === typeLower;
          if (!typeMatches) return false;
        }

        if (cat !== "All categories") {
          const catLower = cat.toLowerCase();
          const jobSlug = ((j as any).categoryId || "").toString().toLowerCase();
          const jobCategory = ((j as any).category || "").toString().toLowerCase();
          const jobCatLabel = ((j as any).categoryLabel || "").toString().toLowerCase();
          const matchesSlug = jobSlug === catLower;
          const matchesName = jobCategory === catLower || jobCategory.includes(catLower);
          const matchesLabel = jobCatLabel === catLower || jobCatLabel.includes(catLower);
          if (!matchesSlug && !matchesName && !matchesLabel) return false;
        }

        if (tagFilter) {
          const jobTags = Array.isArray((j as any).tags)
            ? (j as any).tags
            : Array.isArray((j as any).tagIds)
              ? (j as any).tagIds
              : [];
          if (!jobTags.some((t: string) => t.toLowerCase() === tagFilter.toLowerCase()))
            return false;
        }

        if (savedOnly && !savedIds.includes(j.id || "")) return false;
        return true;
      }),
    [jobs, q, loc, type, cat, tagFilter, savedOnly, savedIds],
  );

  const resetFilters = () => {
    setType("all");
    setCat("All categories");
    setLoc("Anywhere");
    setSavedOnly(false);
    setTagFilter("");
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const j of jobs) {
      const tags = (j as any).tags ? (j as any).tags : (j as any).tagIds ? (j as any).tagIds : [];
      if (Array.isArray(tags)) {
        for (const t of tags) tagSet.add(t);
      }
    }
    const arr = [...tagSet];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 12);
  }, [jobs]);

  const tagSuggestions = useMemo(() => {
    if (!customTag.trim()) return [];
    const lower = customTag.toLowerCase();
    return SUGGESTED_TAGS.filter(
      (t) => t.toLowerCase().includes(lower) && t.toLowerCase() !== tagFilter.toLowerCase(),
    ).slice(0, 8);
  }, [customTag, tagFilter]);

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-3 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search.placeholder", "Search by job title, position, keyword...")}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl border px-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select value={loc} onValueChange={setLoc}>
                <SelectTrigger className="border-0 shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anywhere">{t("common.anywhere", "Anywhere")}</SelectItem>
                  {displayLocations
                    .filter((location) => location.name !== "Anywhere")
                    .map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant={filtersOpen ? "default" : "outline"}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="rounded-xl"
            >
              <SlidersHorizontal className={`${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />{" "}
              {t("search.filters", "Filters")}
            </Button>
            <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90">
              {locale === "ar" ? (
                <span className="flex items-center gap-2">
                  {t("searchbar.submit", "Search Job")}
                  <Search className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {t("searchbar.submit", "Search Job")}
                </span>
              )}
            </Button>
          </div>

          {filtersOpen && (
            <div
              className="mt-4 grid gap-3 border-t pt-4 md:grid-cols-4"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <Briefcase
                    className={`${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4 text-muted-foreground`}
                  />
                  <SelectValue placeholder={t("type.allWorkModes", "All work modes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("type.allWorkModes", "All work modes")}</SelectItem>
                  <SelectItem value="freelance">{t("type.freelance", "Freelancer")}</SelectItem>
                  <SelectItem value="full-time">{t("type.full-time", "Full-time")}</SelectItem>
                  <SelectItem value="part-time">{t("type.part-time", "Part-time")}</SelectItem>
                  <SelectItem value="internship">{t("type.internship", "Internship")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.category", "Category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All categories">
                    {t("common.allCategories", "All categories")}
                  </SelectItem>
                  {[...mergedCategories]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {tt(category.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant={savedOnly ? "default" : "outline"}
                onClick={() => setSavedOnly(!savedOnly)}
                className="justify-start rounded-xl"
              >
                <Bookmark className={`${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />{" "}
                {t("search.savedOnly", "Saved jobs")} ({savedIds.length})
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={resetFilters}
                className="justify-start rounded-xl"
              >
                <X className={`${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />{" "}
                {t("search.reset", "Reset filters")}
              </Button>
            </div>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {allTags.map((tag) => {
              const isActive = tagFilter.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setTagFilter(isActive ? "" : tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-brand/50 hover:text-brand"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            <div className="relative flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/30 px-3 py-1">
              <Plus className="h-3 w-3 text-muted-foreground" />
              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customTag.trim()) {
                    setTagFilter(customTag.trim());
                    setCustomTag("");
                  }
                }}
                placeholder="Add tag..."
                className="w-20 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
              />
              {tagSuggestions.length > 0 && (
                <div className="absolute left-0 top-full z-10 mt-1 w-full min-w-40 rounded-xl border border-border bg-card p-2 shadow-lg">
                  {tagSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setTagFilter(s);
                        setCustomTag("");
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground transition hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-3 mt-8 text-sm text-muted-foreground">
          {t("search.results", "{count} jobs found", { count: results.length })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, visibleLimit).map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>

        {savedIds.length > 0 && !savedOnly && (
          <section className="mt-8 mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("search.saved.title", "Saved jobs")}</h2>
              <Button variant="ghost" onClick={() => setSavedOnly(true)} className="text-brand">
                {t("search.savedOnly", "Saved jobs")}
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs
                .filter((j) => savedIds.includes(j.id || ""))
                .slice(0, 3)
                .map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
            </div>
          </section>
        )}

        {results.length > visibleLimit && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setVisibleLimit((prev) => prev + 20)}
              className="rounded-full px-8"
            >
              <ChevronDown className={`${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("search.showMore", "Show more")}
            </Button>
          </div>
        )}

        {visibleLimit > 20 && results.length <= visibleLimit && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setVisibleLimit(20)}
              className="rounded-full px-8"
            >
              <ChevronUp className={`${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("search.showLess", "Show less")}
            </Button>
          </div>
        )}

        {results.length === 0 && (
          <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
            {t("search.empty.desc", "Try adjusting your filters or search terms.")}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
