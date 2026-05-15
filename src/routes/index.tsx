import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Building2,
  ChartNoAxesColumn,
  ClipboardCheck,
  Code2,
  FileText,
  HardHat,
  Megaphone,
  PenTool,
  Users,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { JobCard } from "@/components/JobCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Job, CategoryItem, LocationItem, StatsItem } from "@/hooks/use-firestore";
import { useFirestoreCollection, useFirestoreDocument } from "@/hooks/use-firestore";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { statsService } from "@/lib/firestore-service";
import heroImg1 from "@/assets/hero-workers.jpg";
import heroImg2 from "@/assets/hero-workers-2.png";
import heroImg3 from "@/assets/hero-workers-3.png";
import heroImg4 from "@/assets/hero-workers-4.png";
import heroImg5 from "@/assets/hero-workers-5.png";
import heroImg6 from "@/assets/hero-workers-6.png";
import yassirLogo from "@/assets/logos/air-algerie.svg";
import ooredooLogo from "@/assets/logos/algerie-poste.svg";
import icosnetLogo from "@/assets/logos/badr.svg";
import airAlgerieLogo from "@/assets/logos/bea.svg";
import condorLogo from "@/assets/logos/bga.svg";
import cevitalLogo from "@/assets/logos/cevital.svg";
import mobilisLogo from "@/assets/logos/djezzy.svg";
import stocklyLogo from "@/assets/logos/Stockly.svg";

import { CATEGORY_CONFIG, getCategoryEmoji } from "@/lib/categories";

const STATS = { jobs: 25830, candidates: 10342, companies: 1840 };

const TRUSTED_BY = [
  { name: "Yassir", logo: "" },
  { name: "Ooredoo", logo: "" },
  { name: "Icosnet", logo: "" },
  { name: "Air Algerie", logo: "" },
  { name: "Condor", logo: "" },
  { name: "Cevital", logo: "" },
  { name: "Mobilis", logo: "" },
  { name: "Sonatrach", logo: "" },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mihna - Find Your Dream Job Today" },
      {
        name: "description",
        content:
          "Browse thousands of freelance and full-time jobs. Mihna connects candidates with companies.",
      },
    ],
  }),
});
function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Briefcase;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md shadow-md shadow-black/20">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="text-left text-white">
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs opacity-80">{label}</div>
      </div>
    </div>
  );
}

function TimelineItem({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="relative flex items-start gap-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#033d26] text-sm font-bold text-white">
        {n}
      </span>
      <span className="absolute left-6 top-14 h-12 border-l border-dashed border-[#033d26]/30" />
      <div>
        <div className="text-lg font-bold text-foreground">{title}</div>
        <div className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">{text}</div>
      </div>
    </li>
  );
}

function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnnouncementsCarousel({ items, newsInView }: { items: any[]; newsInView: boolean }) {
  const { t, tt, locale } = useI18n();
  const navigate = useNavigate();
  const [newsIdx, setNewsIdx] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h3 className="flex items-center justify-between text-xl font-bold text-foreground">
          <span className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-brand" />
            {t("home.news.title", "Latest announcements")}
          </span>
          <button
            onClick={() => navigate({ to: "/announcements" })}
            className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
          >
            {t("home.showAll", "Show all")}
            {locale === "ar" ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </h3>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          {t("home.news.empty", "No announcements yet.")}
        </div>
      ) : (
        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(newsIdx * 3, newsIdx * 3 + 3).map((item: any, i: number) => (
              <div
                key={item.id}
                style={{ animationDelay: `${i * 120}ms` }}
                className={`${newsInView ? "animate-fade-in-left" : "opacity-100"} rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <Link to="/profile" search={{ userId: item.authorId }} className="shrink-0">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={item.authorAvatar} />
                      <AvatarFallback className="bg-brand/10 text-sm text-brand">
                        {(item.authorName || t("common.candidate", "Candidate")).slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/announcement/$id"
                      params={{ id: item.id || "" }}
                      className="block truncate font-semibold text-foreground hover:text-brand transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      <Link to="/profile" search={{ userId: item.authorId }} className="hover:text-brand transition-colors">
                        {item.authorName || t("common.candidate", "Candidate")}
                      </Link>
                    </div>
                  </div>
                </div>
                <Link
                  to="/announcement/$id"
                  params={{ id: item.id || "" }}
                >
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.category && (
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                        {item.category}
                      </span>
                    )}
                    {item.experienceLevel && (
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                        {tt(item.experienceLevel)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {items.length > 3 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setNewsIdx((i) => Math.max(0, i - 1));
                }}
                disabled={newsIdx === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-brand hover:text-white disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground"
              >
                {locale === "ar" ? (
                  <ArrowRight className="h-4 w-4" />
                ) : (
                  <ArrowLeft className="h-4 w-4" />
                )}
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(items.length / 3) }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNewsIdx(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === newsIdx ? "w-6 bg-brand" : "w-2 bg-border hover:bg-brand/50"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setNewsIdx((i) => Math.min(Math.ceil(items.length / 3) - 1, i + 1));
                }}
                disabled={newsIdx >= Math.ceil(items.length / 3) - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-brand hover:text-white disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground"
              >
                {locale === "ar" ? (
                  <ArrowLeft className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, tt, locale } = useI18n();
  const fmt = (n: number) => n.toLocaleString();
  const {
    data: jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useFirestoreCollection<Job>("jobs");
  const { data: stats, loading: statsLoading, error: statsError } = useFirestoreDocument<StatsItem>("stats", "main");
  const [liveCandidates, setLiveCandidates] = useState(0);
  const [heroImg, setHeroImg] = useState(heroImg1);
  const [popularRef, popularInView] = useInView();
  const [featuredRef, featuredInView] = useInView();
  const [newsRef, newsInView] = useInView();
  const needsStrongContrast =
    heroImg === heroImg2 || heroImg === heroImg4 || heroImg === heroImg5 || heroImg === heroImg6;
  const heroGreenLogo = needsStrongContrast;

  useEffect(() => {
    const imgs = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];
    setHeroImg(imgs[Math.floor(Math.random() * 6)]);
  }, []);
  const { data: allAnnouncements, loading: announcementsLoading } = useFirestoreCollection<any>("announcements", "createdAt");
  const newsItems = (allAnnouncements || []).filter(
    (a: any) => a.announcementType === "jobseeking",
  );

  const jobsCount = stats && stats.totalJobs ? stats.totalJobs : STATS.jobs;
  const candidatesCount =
    liveCandidates || (stats && stats.totalCandidates ? stats.totalCandidates : STATS.candidates);
  const companiesCount = stats && stats.totalCompanies ? stats.totalCompanies : STATS.companies;
  const pageReady = !jobsLoading && !statsLoading && !announcementsLoading;

  useEffect(() => {
    statsService
      .getLiveStats()
      .then((s) => setLiveCandidates(s.candidates))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (jobsError) console.error("Jobs error:", jobsError);
    if (statsError) console.error("Stats error:", statsError);
  }, [jobsError, statsError]);

  if (!pageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
          <p className="text-sm text-muted-foreground">{t("common.loading", "Loading...")}</p>
        </div>
      </div>
    );
  }

  const logoMap: Record<string, string> = {
    Yassir: yassirLogo,
    Ooredoo: ooredooLogo,
    Icosnet: icosnetLogo,
    "Air Algerie": airAlgerieLogo,
    Condor: condorLogo,
    Cevital: cevitalLogo,
    Mobilis: mobilisLogo,
    Stockly: stocklyLogo,
  };
  const trustedLoop = [...TRUSTED_BY, ...TRUSTED_BY];

  return (
    <div className="min-h-screen animate-page-in bg-background text-foreground">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Workers in various professions"
            className="absolute inset-0 h-full w-full animate-hero-bg object-cover"
          />
          <div className="hero-monitor hero-monitor-left hidden sm:block">
            <div className="h-2 w-16 rounded-full bg-white/35" />
            <div className="mt-4 h-3 w-28 rounded-full bg-white/70" />
            <div className="mt-3 h-2 w-20 rounded-full bg-white/35" />
          </div>
          <div className="hero-monitor hero-monitor-right hidden md:block">
            <div className="grid grid-cols-3 gap-2">
              <span className="h-8 rounded bg-white/50" />
              <span className="h-8 rounded bg-brand/60" />
              <span className="h-8 rounded bg-white/30" />
            </div>
            <div className="mt-4 h-2 w-32 rounded-full bg-white/50" />
          </div>
          <div className="hero-monitor hero-monitor-bottom hidden lg:block">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg bg-white/60" />
              <span>
                <span className="block h-3 w-32 rounded-full bg-white/70" />
                <span className="mt-2 block h-2 w-20 rounded-full bg-white/35" />
              </span>
            </div>
          </div>
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        </div>

        <Header transparent />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8 lg:pt-36">
          <h1 className="animate-rise-in font-display text-5xl font-extrabold leading-[1.05] tracking-normal text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:text-6xl lg:text-7xl">
            {t("home.hero.title.pre", "Find Your Dream")}{" "}
            <span className="text-white">{t("home.hero.title.job", "Job")}</span>{" "}
            {t("home.hero.title.post", "Today")}
          </h1>
          <p className="mt-5 max-w-2xl animate-rise-in text-base text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] [animation-delay:80ms] sm:text-lg">
            {t(
              "home.hero.subtitle",
              "Your gateway to career success across freelance, full-time, and contract roles.",
            )}
          </p>

          <div
            className={`mt-10 w-full animate-rise-in rounded-full [animation-delay:120ms] ${needsStrongContrast ? "drop-shadow-[0_8px_40px_rgba(0,0,0,0.45)]" : "drop-shadow-[0_4px_20px_rgba(0,0,0,0.2)]"}`}
          >
            <SearchBar strongShadow={needsStrongContrast} />
          </div>

          <div className="mt-12 flex animate-rise-in flex-wrap items-center justify-center gap-4 [animation-delay:220ms]">
            <Stat icon={Briefcase} value={fmt(jobsCount)} label={t("home.stats.jobs", "Jobs")} />
            <Stat
              icon={Users}
              value={fmt(candidatesCount)}
              label={t("home.stats.candidates", "Candidates")}
            />
            <Stat
              icon={Building2}
              value={fmt(companiesCount)}
              label={t("home.stats.companies", "Companies")}
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y bg-secondary py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-normal text-foreground sm:text-5xl">
            {t("home.trusted", "We Are Trusted By")}
          </h2>
          <div className="relative mt-14">
            <div className="trusted-marquee flex w-max items-center gap-16">
              {trustedLoop.map((t, index) => {
                const logoSrc = logoMap[t.name] || t.logo;
                const isStockly = t.name === "Stockly";
                return (
                  <div
                    key={`${t.name}-${index}`}
                    className="group flex min-w-36 items-center justify-center transition"
                  >
                    <img
                      src={logoSrc}
                      alt={t.name}
                      className={`${isStockly ? "h-14" : "h-10"} w-auto opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div ref={popularRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-normal text-foreground sm:text-5xl">
              {t("home.popular.title", "Most Popular Jobs")}
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              {t(
                "home.popular.subtitle",
                "Discover the most in-demand positions across freelance and full-time categories",
              )}
            </p>
          </div>

          <div className="mb-10">
            <h3 className="mb-6 flex items-center justify-between text-xl font-bold text-foreground">
              <span className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-brand" />{" "}
                {t("home.fulltime", "Full-time Positions")}
              </span>
              <button
                onClick={() =>
                  navigate({ to: "/categories", search: { type: "full-time" } as never })
                }
                className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
              >
                {t("home.showAll", "Show all")}
                {locale === "ar" ? (
                  <ArrowLeft className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </h3>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const allCats = CATEGORY_CONFIG["full-time"].all;
                const withCounts = allCats.map((cat) => {
                  const catLower = cat.toLowerCase();
                  const count = (jobs || []).filter((j: any) => {
                    const t = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
                    const typeOk = t.includes("full") || t === "jt_fulltime";
                    const fields = [j.categoryLabel, j.category, j.categoryId]
                      .filter(Boolean)
                      .map((f: any) => f.toString().toLowerCase());
                    return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
                  }).length;
                  return { cat, count };
                });
                const top = [...withCounts]
                  .filter((x) => x.count > 0)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                return top.map(({ cat, count: totalCount }, index) => {
                  const catLower = cat.toLowerCase();
                  const list = (jobs || [])
                    .filter((j: any) => {
                      const t = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
                      const typeOk = t.includes("full") || t === "jt_fulltime";
                      const fields = [j.categoryLabel, j.category, j.categoryId]
                        .filter(Boolean)
                        .map((f: any) => f.toString().toLowerCase());
                      return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
                    })
                    .slice(0, 3);

                  return (
                    <button
                      key={cat}
                      style={{ animationDelay: `${index * 120}ms` }}
                      onClick={() =>
                        navigate({
                          to: "/search",
                          search: { q: "", loc: "Anywhere", type: "full-time", cat } as never,
                        })
                      }
                      className={`${popularInView ? "animate-pop-in " : "opacity-100"} group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-brand/[0.03] via-card to-card/50 p-6 transition-all duration-300 hover:border-brand/50 hover:shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative z-10">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/15 text-2xl drop-shadow-sm">
                              {getCategoryEmoji(cat)}
                            </span>
                            <div className="text-left">
                              <div className="text-lg font-semibold text-foreground">{tt(cat)}</div>
                              <div className="text-xs text-muted-foreground">
                                {t("home.openPositions", "{count} open position{plural}", {
                                  count: totalCount,
                                  plural: totalCount !== 1 ? "s" : "",
                                })}
                              </div>
                            </div>
                          </div>
                          {locale === "ar" ? (
                            <ArrowLeft className="h-5 w-5 text-brand transition-transform duration-200 group-hover:-translate-x-1" />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-brand transition-transform duration-200 group-hover:translate-x-1" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg border px-4 py-3 text-sm font-medium text-center transition-colors ${list.length === 0 ? "border-dashed border-border text-muted-foreground" : "border-brand/30 bg-brand/5 text-brand"}`}
                        >
                          {list.length === 0
                            ? t("home.noOpenPositions", "No open positions")
                            : t("home.lookFor", "Look for the {count} opportunit{plural} ->", {
                                count: totalCount,
                                plural: totalCount !== 1 ? "ies" : "y",
                              })}
                        </div>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          <div>
            <h3 className="mb-6 flex items-center justify-between text-xl font-bold text-foreground">
              <span className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-brand" />{" "}
                {t("home.freelance", "Freelance Opportunities")}
              </span>
              <button
                onClick={() =>
                  navigate({ to: "/categories", search: { type: "freelance" } as never })
                }
                className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
              >
                {t("home.showAll", "Show all")}
                {locale === "ar" ? (
                  <ArrowLeft className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </h3>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const allCats = CATEGORY_CONFIG["freelance"].all;
                const withCounts = allCats.map((cat) => {
                  const catLower = cat.toLowerCase();
                  const count = (jobs || []).filter((j: any) => {
                    const t = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
                    const typeOk = t.includes("freelance") || t === "jt_freelance";
                    const fields = [j.categoryLabel, j.category, j.categoryId]
                      .filter(Boolean)
                      .map((f: any) => f.toString().toLowerCase());
                    return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
                  }).length;
                  return { cat, count };
                });
                const top = [...withCounts]
                  .filter((x) => x.count > 0)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                return top.map(({ cat, count: totalCount }, index) => {
                  const catLower = cat.toLowerCase();
                  const list = (jobs || [])
                    .filter((j: any) => {
                      const t = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
                      const typeOk = t.includes("freelance") || t === "jt_freelance";
                      const fields = [j.categoryLabel, j.category, j.categoryId]
                        .filter(Boolean)
                        .map((f: any) => f.toString().toLowerCase());
                      return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
                    })
                    .slice(0, 3);

                  return (
                    <button
                      key={cat}
                      style={{ animationDelay: `${index * 120}ms` }}
                      onClick={() =>
                        navigate({
                          to: "/search",
                          search: { q: "", loc: "Anywhere", type: "freelance", cat } as never,
                        })
                      }
                      className={`${popularInView ? "animate-pop-in " : "opacity-100"} group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-brand/[0.03] via-card to-card/50 p-6 transition-all duration-300 hover:border-brand/50 hover:shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative z-10">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/15 text-2xl drop-shadow-sm">
                              {getCategoryEmoji(cat)}
                            </span>
                            <div className="text-left">
                              <div className="text-lg font-semibold text-foreground">{tt(cat)}</div>
                              <div className="text-xs text-muted-foreground">
                                {t("home.openPositions", "{count} open position{plural}", {
                                  count: totalCount,
                                  plural: totalCount !== 1 ? "s" : "",
                                })}
                              </div>
                            </div>
                          </div>
                          {locale === "ar" ? (
                            <ArrowLeft className="h-5 w-5 text-brand transition-transform duration-200 group-hover:-translate-x-1" />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-brand transition-transform duration-200 group-hover:translate-x-1" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg border px-4 py-3 text-sm font-medium text-center transition-colors ${list.length === 0 ? "border-dashed border-border text-muted-foreground" : "border-brand/30 bg-brand/5 text-brand"}`}
                        >
                          {list.length === 0
                            ? t("home.noOpenPositions", "No open positions")
                            : t("home.lookFor", "Look for the {count} opportunit{plural} ->", {
                                count: totalCount,
                                plural: totalCount !== 1 ? "ies" : "y",
                              })}
                        </div>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          <div className="mt-16 mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">{t("home.featured", "Featured listings")}</h3>
            <button
              onClick={() =>
                navigate({
                  to: "/search",
                  search: { q: "", loc: "Anywhere", type: "all", cat: "All categories" } as never,
                })
              }
              className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
            >
              {t("home.showAll", "Show all")}
              {locale === "ar" ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
          <div ref={featuredRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobsLoading ? (
              <div className="col-span-full rounded-2xl border bg-card p-10 text-center text-muted-foreground">
                {t("home.loadingFeatured", "Loading featured jobs...")}
              </div>
            ) : jobs && jobs.length > 0 ? (
              [...jobs]
                .sort(() => Math.random() - 0.5)
                .slice(0, 6)
                .map((j, i) => (
                  <div key={j.id} className={`${featuredInView ? "animate-slide-up-reveal" : "opacity-100"}`} style={{ animationDelay: `${i * 100}ms` }}>
                    <JobCard job={j} featured />
                  </div>
                ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed bg-card/50 p-10 text-center text-muted-foreground">
                {t("home.featured.empty", "No jobs available yet. Check back soon!")}
              </div>
            )}
          </div>
        </div>
      </section>

      <section ref={newsRef} className="bg-background py-16">
        <AnnouncementsCarousel items={newsItems} newsInView={newsInView} />
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-normal text-foreground sm:text-5xl">
              {(() => {
                const parts = t("home.how.title", "How مِهنة Works").split("مِهنة");
                return parts.length > 1 ? (
                  <>
                    {parts[0]}
                    <span className="font-cairo">مِهنة</span>
                    {parts[1]}
                  </>
                ) : (
                  t("home.how.title", "How مِهنة Works")
                );
              })()}
            </h2>
          </div>

          <div className="group/how mx-auto max-w-5xl grid gap-16 lg:grid-cols-2">
            <div className="rounded-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:opacity-100 group-hover/how:opacity-45 group-hover/how:hover:opacity-100">
              <div className="mb-10 flex items-center justify-center gap-3 text-xl font-semibold text-brand">
                <HardHat className="h-6 w-6" /> {t("home.how.workers", "For Workers")}
              </div>
              <ol className="space-y-9">
                <TimelineItem
                  n="01"
                  title={t("home.worker.1.title", "Create Your Profile")}
                  text={t(
                    "home.worker.1.text",
                    "Sign up and build your professional profile with skills and experience.",
                  )}
                />
                <TimelineItem
                  n="02"
                  title={t("home.worker.2.title", "Browse Jobs")}
                  text={t(
                    "home.worker.2.text",
                    "Search and filter through thousands of job listings. Find freelance gigs, full-time roles, and projects matching your expertise.",
                  )}
                />
                <TimelineItem
                  n="03"
                  title={t("home.worker.3.title", "Apply with Ease")}
                  text={t(
                    "home.worker.3.text",
                    "Submit applications directly through the platform. Track your application status in real-time.",
                  )}
                />
                <TimelineItem
                  n="04"
                  title={t("home.worker.4.title", "Get Hired")}
                  text={t(
                    "home.worker.4.text",
                    "Connect with employers and start working. Build your reputation with reviews and ratings.",
                  )}
                />
              </ol>
            </div>

            <div className="rounded-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:opacity-100 group-hover/how:opacity-45 group-hover/how:hover:opacity-100">
              <div className="mb-10 flex items-center justify-center gap-3 text-xl font-semibold text-brand">
                <Building2 className="h-6 w-6" /> {t("home.how.business", "For Business Owners")}
              </div>
              <ol className="space-y-9">
                <TimelineItem
                  n="01"
                  title={t("home.business.1.title", "Post a Job")}
                  text={t(
                    "home.business.1.text",
                    "Create detailed job listings in minutes. Specify requirements, budget, and timeline.",
                  )}
                />
                <TimelineItem
                  n="02"
                  title={t("home.business.2.title", "Review Candidates")}
                  text={t(
                    "home.business.2.text",
                    "Browse qualified applicants with verified profiles. Filter by skills, experience, and ratings.",
                  )}
                />
                <TimelineItem
                  n="03"
                  title={t("home.business.3.title", "Connect & Hire")}
                  text={t(
                    "home.business.3.text",
                    "Interview and select the best talent. Communicate directly through the platform.",
                  )}
                />
                <TimelineItem
                  n="04"
                  title={t("home.business.4.title", "Manage Projects")}
                  text={t(
                    "home.business.4.text",
                    "Track progress and make payments securely. Leave feedback and build your team.",
                  )}
                />
              </ol>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
