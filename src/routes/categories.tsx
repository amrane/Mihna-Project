import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Briefcase, Code2, ChevronDown, ChevronUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Job } from "@/hooks/use-firestore";
import { useFirestoreCollection } from "@/hooks/use-firestore";
import { CATEGORY_CONFIG, getCategoryEmoji } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

interface SearchParams {
  type?: string;
}

export const Route = createFileRoute("/categories")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    type: (s.type as string) || "full-time",
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const { t, tt, locale } = useI18n();
  const { data: jobs } = useFirestoreCollection<Job>("jobs");
  const [visibleLimit, setVisibleLimit] = useState(20);

  const categories = useMemo(
    () => CATEGORY_CONFIG[type === "freelance" ? "freelance" : "full-time"]?.all || [],
    [type],
  );

  const isFreelance = type === "freelance";
  const typeLabel = isFreelance
    ? t("home.freelance", "Freelance Opportunities")
    : t("home.fulltime", "Full-time Positions");

  const getJobCount = (cat: string) => {
    const catLower = cat.toLowerCase();
    return (jobs || []).filter((j: any) => {
      const t = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
      const typeMatch = isFreelance
        ? t.includes("freelance") || t === "jt_freelance"
        : t.includes("full") || t === "jt_fulltime";
      const fields = [j.categoryLabel, j.category, j.categoryId]
        .filter(Boolean)
        .map((f: any) => f.toString().toLowerCase());
      const catMatch = fields.some((f) => f === catLower || f.includes(catLower));
      return typeMatch && catMatch;
    }).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
              {isFreelance ? <Code2 className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
              {typeLabel}
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-foreground">
              {t("home.popular.title", "Most Popular Jobs")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {categories.length} {t("home.popular.subtitle", "categories available")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate({ to: "/categories", search: { type: "full-time" } as never })
              }
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                !isFreelance
                  ? "bg-brand text-brand-foreground"
                  : "border border-border bg-card text-muted-foreground hover:border-brand/40"
              }`}
            >
              <Briefcase className="mr-1.5 inline h-4 w-4" />
              {t("home.fulltime", "Full-time")}
            </button>
            <button
              onClick={() =>
                navigate({ to: "/categories", search: { type: "freelance" } as never })
              }
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                isFreelance
                  ? "bg-brand text-brand-foreground"
                  : "border border-border bg-card text-muted-foreground hover:border-brand/40"
              }`}
            >
              <Code2 className="mr-1.5 inline h-4 w-4" />
              {t("home.freelance", "Freelance")}
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.slice(0, visibleLimit).map((cat) => {
            const count = getJobCount(cat);
            return (
              <button
                key={cat}
                onClick={() =>
                  navigate({
                    to: "/search",
                    search: {
                      q: "",
                      loc: "Anywhere",
                      type: isFreelance ? "freelance" : "full-time",
                      cat,
                    } as never,
                  })
                }
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all duration-300 hover:border-brand/40 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-xl">
                    {getCategoryEmoji(cat)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold text-foreground">{tt(cat)}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {count} {count === 1 ? "position" : "positions"}
                    </div>
                  </div>
                  {locale === "ar" ? <ArrowLeft className="mt-2 h-4 w-4 shrink-0 text-brand opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-0.5" /> : <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-brand opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {categories.length > visibleLimit && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleLimit((prev) => prev + 20)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brand/50 hover:text-brand"
            >
              {t("home.showMore", "Show more")}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}

        {visibleLimit > 20 && categories.length <= visibleLimit && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleLimit(20)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brand/50 hover:text-brand"
            >
              {t("home.showLess", "Show less")}
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() =>
              navigate({
                to: "/search",
                search: {
                  type: isFreelance ? "freelance" : "full-time",
                  loc: "Anywhere",
                } as never,
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-base font-semibold text-brand-foreground hover:bg-brand/90 transition-all"
          >
            {t("home.showAll", "Show all")} {typeLabel.toLowerCase()}
            {locale === "ar" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
