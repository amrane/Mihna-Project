import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { H as Header, B as Button, F as Footer } from "./Footer-CIdxXT3C.js";
import { J as JobCard } from "./JobCard-D8mX-zTy.js";
import { I as Input } from "./input-BAq2Xo4A.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_bkB_S9.js";
import { Search, MapPin, SlidersHorizontal, Briefcase, Bookmark, X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { u as useFirestoreCollection, g as getWilayas } from "./use-firestore-uoDfirYi.js";
import { C as CATEGORY_CONFIG } from "./categories-CUhIo4Yi.js";
import { R as Route, u as useAuth, a as useI18n } from "./router-Bte9I49t.js";
import "@tanstack/react-router";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "./badge-BiVmFZBi.js";
import "sonner";
import "@radix-ui/react-select";
const SUGGESTED_TAGS = ["React", "Node.js", "TypeScript", "Python", "JavaScript", "Java", "PHP", "Laravel", "UI/UX", "Figma", "Photoshop", "Illustrator", "Canva", "SEO", "Google Ads", "Content Writing", "Blog Writing", "Translation", "English", "French", "Arabic", "Video Editing", "Premiere Pro", "After Effects", "CapCut", "Social Media", "Instagram", "Facebook", "TikTok", "LinkedIn", "Email Marketing", "Data Entry", "Excel", "Word", "PowerPoint", "Customer Service", "Sales", "Accounting", "QuickBooks", "Sage", "Project Management", "Trello", "Asana", "Technical Support", "IT Support", "Networking", "Graphic Design", "Web Development", "Mobile Development", "Flutter", "React Native", "Copywriting", "Photography", "Administrative", "Hospitality", "Construction", "Teaching", "Healthcare", "Nursing", "Driving", "Shopify", "WooCommerce", "WordPress", "HTML/CSS", "Git"];
function SearchPage() {
  const initial = Route.useSearch();
  const {
    user
  } = useAuth();
  const {
    t,
    tt,
    locale
  } = useI18n();
  const [q, setQ] = useState(initial.q || "");
  const [loc, setLoc] = useState(initial.loc || "Anywhere");
  const [type, setType] = useState(initial.type || "all");
  const [cat, setCat] = useState(initial.cat || "All categories");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(20);
  const {
    data: jobs
  } = useFirestoreCollection("jobs");
  const {
    data: categories
  } = useFirestoreCollection("categories");
  const {
    data: locations
  } = useFirestoreCollection("locations", "order");
  const [wilayaLocations, setWilayaLocations] = useState([]);
  useEffect(() => {
    const loadWilayas = async () => {
      try {
        const wilayas = await getWilayas();
        const wilayaItems = wilayas.map((w, idx) => ({
          id: w.code,
          name: w.name,
          isRemote: w.isRemote,
          order: idx
        }));
        if (!wilayaItems.some((w) => w.name === "Anywhere")) {
          wilayaItems.unshift({
            id: "anywhere",
            name: "Anywhere",
            order: -1
          });
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
    const filtered = baseLocations.filter((loc2) => loc2.name !== "Anywhere");
    const anywhereItem = {
      id: "anywhere",
      name: "Anywhere",
      order: -1
    };
    return [anywhereItem, ...filtered];
  }, [locations, wilayaLocations]);
  const savedIds = user?.savedJobIds ?? [];
  const mergedCategories = useMemo(() => {
    const allNames = /* @__PURE__ */ new Set();
    for (const kind of ["freelance", "full-time", "business"]) {
      for (const name of CATEGORY_CONFIG[kind].all) {
        allNames.add(name);
      }
    }
    const configItems = [...allNames].map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name
    }));
    const merged = /* @__PURE__ */ new Map();
    for (const c of categories) merged.set(c.id, c);
    for (const c of configItems) if (!merged.has(c.id)) merged.set(c.id, c);
    return [...merged.values()];
  }, [categories]);
  const results = useMemo(() => jobs.filter((j) => {
    const title = j.title || j.jobTitle || "";
    const company = j.company || j.companyName || "";
    const skillsText = Array.isArray(j.skills) ? j.skills.join(" ") : Array.isArray(j.skillIds) ? j.skillIds.join(" ") : "";
    const tagsText = Array.isArray(j.tags) ? j.tags.join(" ") : Array.isArray(j.tagIds) ? j.tagIds.join(" ") : "";
    const description = j.description || "";
    const categoryText = j.category || j.categoryLabel || "";
    const typeText = j.type || j.typeLabel || j.typeId || "";
    const searchText = `${title} ${company} ${skillsText} ${tagsText} ${description} ${categoryText} ${typeText}`.toLowerCase();
    if (q && !searchText.includes((q || "").toLowerCase())) return false;
    if (loc !== "Anywhere") {
      const jobLoc = (j.location || j.wilayaName || "").toLowerCase();
      if (!jobLoc.includes(loc.toLowerCase())) return false;
    }
    if (type !== "all") {
      const typeLower = type.toLowerCase();
      const rawType = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
      const typeMatches = rawType === typeLower || rawType.includes(typeLower.replace("-", "")) || rawType.replace("jt_", "").replace("fulltime", "full-time") === typeLower;
      if (!typeMatches) return false;
    }
    if (cat !== "All categories") {
      const catLower = cat.toLowerCase();
      const jobSlug = (j.categoryId || "").toString().toLowerCase();
      const jobCategory = (j.category || "").toString().toLowerCase();
      const jobCatLabel = (j.categoryLabel || "").toString().toLowerCase();
      const matchesSlug = jobSlug === catLower;
      const matchesName = jobCategory === catLower || jobCategory.includes(catLower);
      const matchesLabel = jobCatLabel === catLower || jobCatLabel.includes(catLower);
      if (!matchesSlug && !matchesName && !matchesLabel) return false;
    }
    if (tagFilter) {
      const jobTags = Array.isArray(j.tags) ? j.tags : Array.isArray(j.tagIds) ? j.tagIds : [];
      if (!jobTags.some((t2) => t2.toLowerCase() === tagFilter.toLowerCase())) return false;
    }
    if (savedOnly && !savedIds.includes(j.id || "")) return false;
    return true;
  }), [jobs, q, loc, type, cat, tagFilter, savedOnly, savedIds]);
  const resetFilters = () => {
    setType("all");
    setCat("All categories");
    setLoc("Anywhere");
    setSavedOnly(false);
    setTagFilter("");
  };
  const allTags = useMemo(() => {
    const tagSet = /* @__PURE__ */ new Set();
    for (const j of jobs) {
      const tags = j.tags ? j.tags : j.tagIds ? j.tagIds : [];
      if (Array.isArray(tags)) {
        for (const t2 of tags) tagSet.add(t2);
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
    return SUGGESTED_TAGS.filter((t2) => t2.toLowerCase().includes(lower) && t2.toLowerCase() !== tagFilter.toLowerCase()).slice(0, 8);
  }, [customTag, tagFilter]);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-secondary/30", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-3 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 rounded-xl border px-3", children: [
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: t("search.placeholder", "Search by job title, position, keyword..."), className: "border-0 shadow-none focus-visible:ring-0" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 rounded-xl border px-3", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxs(Select, { value: loc, onValueChange: setLoc, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "border-0 shadow-none focus:ring-0", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "Anywhere", children: t("common.anywhere", "Anywhere") }),
                displayLocations.filter((location) => location.name !== "Anywhere").map((location) => /* @__PURE__ */ jsx(SelectItem, { value: location.name, children: location.name }, location.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: filtersOpen ? "default" : "outline", onClick: () => setFiltersOpen(!filtersOpen), className: "rounded-xl", children: [
            /* @__PURE__ */ jsx(SlidersHorizontal, { className: `${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4` }),
            " ",
            t("search.filters", "Filters")
          ] }),
          /* @__PURE__ */ jsx(Button, { className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: locale === "ar" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            t("searchbar.submit", "Search Job"),
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" })
          ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
            t("searchbar.submit", "Search Job")
          ] }) })
        ] }),
        filtersOpen && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 border-t pt-4 md:grid-cols-4", dir: locale === "ar" ? "rtl" : "ltr", children: [
          /* @__PURE__ */ jsxs(Select, { value: type, onValueChange: setType, children: [
            /* @__PURE__ */ jsxs(SelectTrigger, { children: [
              /* @__PURE__ */ jsx(Briefcase, { className: `${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4 text-muted-foreground` }),
              /* @__PURE__ */ jsx(SelectValue, { placeholder: t("type.allWorkModes", "All work modes") })
            ] }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: t("type.allWorkModes", "All work modes") }),
              /* @__PURE__ */ jsx(SelectItem, { value: "freelance", children: t("type.freelance", "Freelancer") }),
              /* @__PURE__ */ jsx(SelectItem, { value: "full-time", children: t("type.full-time", "Full-time") }),
              /* @__PURE__ */ jsx(SelectItem, { value: "part-time", children: t("type.part-time", "Part-time") }),
              /* @__PURE__ */ jsx(SelectItem, { value: "internship", children: t("type.internship", "Internship") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: cat, onValueChange: setCat, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("common.category", "Category") }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "All categories", children: t("common.allCategories", "All categories") }),
              [...mergedCategories].sort((a, b) => a.name.localeCompare(b.name)).map((category) => /* @__PURE__ */ jsx(SelectItem, { value: category.name, children: tt(category.name) }, category.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: savedOnly ? "default" : "outline", onClick: () => setSavedOnly(!savedOnly), className: "justify-start rounded-xl", children: [
            /* @__PURE__ */ jsx(Bookmark, { className: `${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4` }),
            " ",
            t("search.savedOnly", "Saved jobs"),
            " (",
            savedIds.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: "ghost", onClick: resetFilters, className: "justify-start rounded-xl", children: [
            /* @__PURE__ */ jsx(X, { className: `${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4` }),
            " ",
            t("search.reset", "Reset filters")
          ] })
        ] })
      ] }),
      allTags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
        allTags.map((tag) => {
          const isActive = tagFilter.toLowerCase() === tag.toLowerCase();
          return /* @__PURE__ */ jsx("button", { onClick: () => setTagFilter(isActive ? "" : tag), className: `rounded-full border px-3 py-1 text-xs font-medium transition ${isActive ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card text-muted-foreground hover:border-brand/50 hover:text-brand"}`, children: tag }, tag);
        }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/30 px-3 py-1", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: customTag, onChange: (e) => setCustomTag(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter" && customTag.trim()) {
              setTagFilter(customTag.trim());
              setCustomTag("");
            }
          }, placeholder: "Add tag...", className: "w-20 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50" }),
          tagSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-full z-10 mt-1 w-full min-w-40 rounded-xl border border-border bg-card p-2 shadow-lg", children: tagSuggestions.map((s) => /* @__PURE__ */ jsx("button", { type: "button", onMouseDown: (e) => e.preventDefault(), onClick: () => {
            setTagFilter(s);
            setCustomTag("");
          }, className: "w-full rounded-lg px-3 py-2 text-left text-xs text-foreground transition hover:bg-accent", children: s }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-3 mt-8 text-sm text-muted-foreground", children: t("search.results", "{count} jobs found", {
        count: results.length
      }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: results.slice(0, visibleLimit).map((j) => /* @__PURE__ */ jsx(JobCard, { job: j }, j.id)) }),
      savedIds.length > 0 && !savedOnly && /* @__PURE__ */ jsxs("section", { className: "mt-8 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: t("search.saved.title", "Saved jobs") }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setSavedOnly(true), className: "text-brand", children: t("search.savedOnly", "Saved jobs") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: jobs.filter((j) => savedIds.includes(j.id || "")).slice(0, 3).map((j) => /* @__PURE__ */ jsx(JobCard, { job: j }, j.id)) })
      ] }),
      results.length > visibleLimit && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setVisibleLimit((prev) => prev + 20), className: "rounded-full px-8", children: [
        /* @__PURE__ */ jsx(ChevronDown, { className: `${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4` }),
        t("search.showMore", "Show more")
      ] }) }),
      visibleLimit > 20 && results.length <= visibleLimit && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", onClick: () => setVisibleLimit(20), className: "rounded-full px-8", children: [
        /* @__PURE__ */ jsx(ChevronUp, { className: `${locale === "ar" ? "ml-2" : "mr-2"} h-4 w-4` }),
        t("search.showLess", "Show less")
      ] }) }),
      results.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border bg-card p-10 text-center text-muted-foreground", children: t("search.empty.desc", "Try adjusting your filters or search terms.") })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  SearchPage as component
};
