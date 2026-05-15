import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { UserSearch, Binoculars, Search, Briefcase, Users, Building2, ArrowLeft, ArrowRight, Code2, HardHat, Megaphone } from "lucide-react";
import { B as Button, s as statsService, H as Header, F as Footer, A as Avatar, a as AvatarImage, b as AvatarFallback } from "./Footer-CIdxXT3C.js";
import { useState, useRef, useEffect } from "react";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_bkB_S9.js";
import { u as useFirestoreCollection, c as useFirestoreDocument } from "./use-firestore-uoDfirYi.js";
import { a as useI18n, u as useAuth } from "./router-Bte9I49t.js";
import { J as JobCard } from "./JobCard-D8mX-zTy.js";
import { C as CATEGORY_CONFIG, g as getCategoryEmoji } from "./categories-CUhIo4Yi.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "sonner";
import "./badge-BiVmFZBi.js";
function SearchBar({ strongShadow = false }) {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const isEmployer = user?.accountType === "employer";
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("Anywhere");
  const [type, setType] = useState("all");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const { data: locations } = useFirestoreCollection("locations", "order");
  const locationOptions = locations.filter(
    (location) => location.name !== "Anywhere" && location.name !== "Remote"
  );
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const submit = () => {
    if (isEmployer) {
      navigate({ to: "/announcements", search: { q, loc } });
    } else {
      navigate({ to: "/search", search: { q, loc, type } });
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `mx-auto flex w-full max-w-4xl flex-col gap-2 rounded-3xl border p-2 text-white backdrop-blur-xl md:flex-row md:items-center md:gap-0 md:rounded-full md:p-2 ${strongShadow ? "border-white/40 bg-white/25 shadow-2xl" : "border-white/20 bg-white/10 shadow-[var(--shadow-elegant)]"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 px-4", children: [
          isEmployer ? /* @__PURE__ */ jsx(UserSearch, { className: "h-5 w-5 text-white" }) : /* @__PURE__ */ jsx(Binoculars, { className: "h-5 w-5 text-white" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: q,
              onChange: (e) => setQ(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && submit(),
              onFocus: () => setIsFocused(true),
              placeholder: isEmployer ? t("searchbar.employerPlaceholder", "Search for candidates...") : t("searchbar.placeholder", "Job title or company"),
              className: "h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white dark:bg-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `hidden h-8 w-px bg-border transition-all duration-300 md:block ${isFocused ? "opacity-0" : "opacity-100"}`
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `overflow-hidden transition-all duration-300 ease-in-out ${isFocused ? "max-h-0 opacity-0 md:max-h-0" : "max-h-20 opacity-100 md:max-h-12"}`,
            children: /* @__PURE__ */ jsxs(Select, { value: loc, onValueChange: setLoc, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-12 border-0 bg-transparent text-sm text-white shadow-none focus:ring-0 md:w-44", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("searchbar.attendance", "Attendance") }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "Anywhere", children: t("searchbar.attendance", "Attendance") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Remote", className: "my-1 bg-brand-soft font-semibold text-brand", children: t("common.remote", "Remote") }),
                locationOptions.map((location, index) => /* @__PURE__ */ jsxs(SelectItem, { value: location.name, children: [
                  /* @__PURE__ */ jsx("span", { className: "tabular-nums text-muted-foreground", children: String(index + 1).padStart(2, "0") }),
                  " ",
                  location.name
                ] }, location.id))
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `hidden h-8 w-px bg-border transition-all duration-300 md:block ${isFocused ? "opacity-0" : "opacity-100"}`
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `overflow-hidden transition-all duration-300 ease-in-out ${isFocused ? "max-h-0 opacity-0 md:max-h-0" : "max-h-20 opacity-100 md:max-h-12"}`,
            children: /* @__PURE__ */ jsxs(Select, { value: type, onValueChange: setType, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-12 border-0 bg-transparent text-sm text-white shadow-none focus:ring-0 md:w-44", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("searchbar.typePlaceholder", "Type") }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: t("type.all", "All types") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "freelance", children: t("type.freelance", "Freelancer") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "full-time", children: t("type.full-time", "Full-time") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "part-time", children: t("type.part-time", "Part-time") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "internship", children: t("type.internship", "Internship") })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: submit,
            className: `shrink-0 h-12 rounded-full bg-brand text-brand-foreground hover:bg-brand/90 overflow-hidden transition-all duration-500 ease-in-out ${isFocused ? "w-12 px-0 justify-center" : "w-40 px-6"}`,
            "aria-label": isEmployer ? t("searchbar.submitEmployer", "Search Candidates") : t("searchbar.submit", "Search Job"),
            children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 shrink-0" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `overflow-hidden whitespace-nowrap ${isFocused ? "max-w-0" : "max-w-32"}`,
                  children: isEmployer ? t("searchbar.submitEmployer", "Search Candidates") : t("searchbar.submit", "Search Job")
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
const heroImg1 = "/assets/hero-workers-z6oFvIIi.jpg";
const heroImg2 = "/assets/hero-workers-2-7vuKBx0d.png";
const heroImg3 = "/assets/hero-workers-3-BsoEIkIV.png";
const heroImg4 = "/assets/hero-workers-4-aurGurH5.png";
const heroImg5 = "/assets/hero-workers-5-C3G0qXuc.png";
const heroImg6 = "/assets/hero-workers-6-i4yY7jSY.png";
const yassirLogo = "/assets/air-algerie-A33HNEFm.svg";
const ooredooLogo = "/assets/algerie-poste-DOGG53pY.svg";
const icosnetLogo = "/assets/badr-BkCT269K.svg";
const airAlgerieLogo = "/assets/bea-KLJc5SHl.svg";
const condorLogo = "/assets/bga-Dbe2sFwB.svg";
const cevitalLogo = "/assets/cevital-BhHMA57X.svg";
const mobilisLogo = "/assets/djezzy-DHdm4Kvw.svg";
const stocklyLogo = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTYwIDMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJsYWNrIGJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjU2MCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiMwMDAwMDAiLz4KICAKICA8IS0tIEJsdWUgYmFycyAtLT4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjMDA0MEZGIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiMwMDQwRkYiLz4KICA8cmVjdCB4PSIxODAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiMwMDQwRkYiLz4KICA8cmVjdCB4PSIyNzAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiMwMDQwRkYiLz4KICA8cmVjdCB4PSIzNjAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiMwMDQwRkYiLz4KICA8cmVjdCB4PSI0NTAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiMwMDQwRkYiLz4KICAKICA8IS0tIENvcHlyaWdodCBzeW1ib2wgKHRvcCByaWdodCkgLS0+CiAgPGNpcmNsZSBjeD0iNTM1IiBjeT0iMjUiIHI9IjEyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDQwRkYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjUzNSIgeT0iMzEiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzAwNDBGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QzwvdGV4dD4KPC9zdmc+Cg==";
const STATS = {
  jobs: 25830,
  candidates: 10342,
  companies: 1840
};
const TRUSTED_BY = [{
  name: "Yassir",
  logo: ""
}, {
  name: "Ooredoo",
  logo: ""
}, {
  name: "Icosnet",
  logo: ""
}, {
  name: "Air Algerie",
  logo: ""
}, {
  name: "Condor",
  logo: ""
}, {
  name: "Cevital",
  logo: ""
}, {
  name: "Mobilis",
  logo: ""
}, {
  name: "Sonatrach",
  logo: ""
}];
function Stat({
  icon: Icon,
  value,
  label
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md shadow-md shadow-black/20", children: [
    /* @__PURE__ */ jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxs("div", { className: "text-left text-white", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: value }),
      /* @__PURE__ */ jsx("div", { className: "text-xs opacity-80", children: label })
    ] })
  ] });
}
function TimelineItem({
  n,
  title,
  text
}) {
  return /* @__PURE__ */ jsxs("li", { className: "relative flex items-start gap-6", children: [
    /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#033d26] text-sm font-bold text-white", children: n }),
    /* @__PURE__ */ jsx("span", { className: "absolute left-6 top-14 h-12 border-l border-dashed border-[#033d26]/30" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-foreground", children: title }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 max-w-lg text-base leading-relaxed text-muted-foreground", children: text })
    ] })
  ] });
}
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, {
      threshold
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}
function AnnouncementsCarousel({
  items,
  newsInView
}) {
  const {
    t,
    tt,
    locale
  } = useI18n();
  const navigate = useNavigate();
  const [newsIdx, setNewsIdx] = useState(0);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("h3", { className: "flex items-center justify-between text-xl font-bold text-foreground", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Megaphone, { className: "h-5 w-5 text-brand" }),
        t("home.news.title", "Latest announcements")
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/announcements"
      }), className: "flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors", children: [
        t("home.showAll", "Show all"),
        locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) }),
    items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground", children: t("home.news.empty", "No announcements yet.") }) : /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: items.slice(newsIdx * 3, newsIdx * 3 + 3).map((item, i) => /* @__PURE__ */ jsxs("div", { style: {
        animationDelay: `${i * 120}ms`
      }, className: `${newsInView ? "animate-fade-in-left" : "opacity-0"} rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/profile", search: {
            userId: item.authorId
          }, className: "shrink-0", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10 shrink-0", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: item.authorAvatar }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-brand/10 text-sm text-brand", children: (item.authorName || t("common.candidate", "Candidate")).slice(0, 2) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx(Link, { to: "/announcement/$id", params: {
              id: item.id || ""
            }, className: "block truncate font-semibold text-foreground hover:text-brand transition-colors", children: item.title }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: /* @__PURE__ */ jsx(Link, { to: "/profile", search: {
              userId: item.authorId
            }, className: "hover:text-brand transition-colors", children: item.authorName || t("common.candidate", "Candidate") }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/announcement/$id", params: {
          id: item.id || ""
        }, children: [
          /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground", children: item.content }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
            item.category && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand", children: item.category }),
            item.experienceLevel && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand", children: tt(item.experienceLevel) })
          ] })
        ] })
      ] }, item.id)) }),
      items.length > 3 && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setNewsIdx((i) => Math.max(0, i - 1));
        }, disabled: newsIdx === 0, className: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-brand hover:text-white disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground", children: locale === "ar" ? /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: Array.from({
          length: Math.ceil(items.length / 3)
        }, (_, i) => /* @__PURE__ */ jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setNewsIdx(i);
        }, className: `h-2 rounded-full transition-all ${i === newsIdx ? "w-6 bg-brand" : "w-2 bg-border hover:bg-brand/50"}` }, i)) }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setNewsIdx((i) => Math.min(Math.ceil(items.length / 3) - 1, i + 1));
        }, disabled: newsIdx >= Math.ceil(items.length / 3) - 1, className: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-brand hover:text-white disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground", children: locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }) })
      ] })
    ] })
  ] });
}
function Index() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    t,
    tt,
    locale
  } = useI18n();
  const fmt = (n) => n.toLocaleString();
  const {
    data: jobs,
    loading: jobsLoading,
    error: jobsError
  } = useFirestoreCollection("jobs");
  const {
    data: stats,
    loading: statsLoading,
    error: statsError
  } = useFirestoreDocument("stats", "main");
  const [liveCandidates, setLiveCandidates] = useState(0);
  const [heroImg, setHeroImg] = useState(heroImg1);
  const [popularRef, popularInView] = useInView();
  const [featuredRef, featuredInView] = useInView();
  const [newsRef, newsInView] = useInView();
  const needsStrongContrast = heroImg === heroImg2 || heroImg === heroImg4 || heroImg === heroImg5 || heroImg === heroImg6;
  useEffect(() => {
    const imgs = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];
    setHeroImg(imgs[Math.floor(Math.random() * 6)]);
  }, []);
  const {
    data: allAnnouncements,
    loading: announcementsLoading
  } = useFirestoreCollection("announcements", "createdAt");
  const newsItems = (allAnnouncements || []).filter((a) => a.announcementType === "jobseeking");
  const jobsCount = stats && stats.totalJobs ? stats.totalJobs : STATS.jobs;
  const candidatesCount = liveCandidates || (stats && stats.totalCandidates ? stats.totalCandidates : STATS.candidates);
  const companiesCount = stats && stats.totalCompanies ? stats.totalCompanies : STATS.companies;
  const pageReady = !jobsLoading && !statsLoading && !announcementsLoading;
  useEffect(() => {
    statsService.getLiveStats().then((s) => setLiveCandidates(s.candidates)).catch(() => {
    });
  }, []);
  useEffect(() => {
    if (jobsError) console.error("Jobs error:", jobsError);
    if (statsError) console.error("Stats error:", statsError);
  }, [jobsError, statsError]);
  if (!pageReady) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-brand/30 border-t-brand" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("common.loading", "Loading...") })
    ] }) });
  }
  const logoMap = {
    Yassir: yassirLogo,
    Ooredoo: ooredooLogo,
    Icosnet: icosnetLogo,
    "Air Algerie": airAlgerieLogo,
    Condor: condorLogo,
    Cevital: cevitalLogo,
    Mobilis: mobilisLogo,
    Stockly: stocklyLogo
  };
  const trustedLoop = [...TRUSTED_BY, ...TRUSTED_BY];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen animate-page-in bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative isolate min-h-[100svh] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsx("img", { src: heroImg, alt: "Workers in various professions", className: "absolute inset-0 h-full w-full animate-hero-bg object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "hero-monitor hero-monitor-left hidden sm:block", children: [
          /* @__PURE__ */ jsx("div", { className: "h-2 w-16 rounded-full bg-white/35" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 h-3 w-28 rounded-full bg-white/70" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 h-2 w-20 rounded-full bg-white/35" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-monitor hero-monitor-right hidden md:block", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "h-8 rounded bg-white/50" }),
            /* @__PURE__ */ jsx("span", { className: "h-8 rounded bg-brand/60" }),
            /* @__PURE__ */ jsx("span", { className: "h-8 rounded bg-white/30" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 h-2 w-32 rounded-full bg-white/50" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hero-monitor hero-monitor-bottom hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "h-10 w-10 rounded-lg bg-white/60" }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("span", { className: "block h-3 w-32 rounded-full bg-white/70" }),
            /* @__PURE__ */ jsx("span", { className: "mt-2 block h-2 w-20 rounded-full bg-white/35" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[var(--gradient-hero)]" })
      ] }),
      /* @__PURE__ */ jsx(Header, { transparent: true }),
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8 lg:pt-36", children: [
        /* @__PURE__ */ jsxs("h1", { className: "animate-rise-in font-display text-5xl font-extrabold leading-[1.05] tracking-normal text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:text-6xl lg:text-7xl", children: [
          t("home.hero.title.pre", "Find Your Dream"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-white", children: t("home.hero.title.job", "Job") }),
          " ",
          t("home.hero.title.post", "Today")
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-2xl animate-rise-in text-base text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] [animation-delay:80ms] sm:text-lg", children: t("home.hero.subtitle", "Your gateway to career success across freelance, full-time, and contract roles.") }),
        /* @__PURE__ */ jsx("div", { className: `mt-10 w-full animate-rise-in rounded-full [animation-delay:120ms] ${needsStrongContrast ? "drop-shadow-[0_8px_40px_rgba(0,0,0,0.45)]" : "drop-shadow-[0_4px_20px_rgba(0,0,0,0.2)]"}`, children: /* @__PURE__ */ jsx(SearchBar, { strongShadow: needsStrongContrast }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 flex animate-rise-in flex-wrap items-center justify-center gap-4 [animation-delay:220ms]", children: [
          /* @__PURE__ */ jsx(Stat, { icon: Briefcase, value: fmt(jobsCount), label: t("home.stats.jobs", "Jobs") }),
          /* @__PURE__ */ jsx(Stat, { icon: Users, value: fmt(candidatesCount), label: t("home.stats.candidates", "Candidates") }),
          /* @__PURE__ */ jsx(Stat, { icon: Building2, value: fmt(companiesCount), label: t("home.stats.companies", "Companies") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "overflow-hidden border-y bg-secondary py-14", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold tracking-normal text-foreground sm:text-5xl", children: t("home.trusted", "We Are Trusted By") }),
      /* @__PURE__ */ jsx("div", { className: "relative mt-14", children: /* @__PURE__ */ jsx("div", { className: "trusted-marquee flex w-max items-center gap-16", children: trustedLoop.map((t2, index) => {
        const logoSrc = logoMap[t2.name] || t2.logo;
        const isStockly = t2.name === "Stockly";
        return /* @__PURE__ */ jsx("div", { className: "group flex min-w-36 items-center justify-center transition", children: /* @__PURE__ */ jsx("img", { src: logoSrc, alt: t2.name, className: `${isStockly ? "h-14" : "h-10"} w-auto opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0` }) }, `${t2.name}-${index}`);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-background py-20", children: /* @__PURE__ */ jsxs("div", { ref: popularRef, className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-16 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold tracking-normal text-foreground sm:text-5xl", children: t("home.popular.title", "Most Popular Jobs") }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-muted-foreground", children: t("home.popular.subtitle", "Discover the most in-demand positions across freelance and full-time categories") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsxs("h3", { className: "mb-6 flex items-center justify-between text-xl font-bold text-foreground", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5 text-brand" }),
            " ",
            t("home.fulltime", "Full-time Positions")
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
            to: "/categories",
            search: {
              type: "full-time"
            }
          }), className: "flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors", children: [
            t("home.showAll", "Show all"),
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-7 sm:grid-cols-2 lg:grid-cols-3", children: (() => {
          const allCats = CATEGORY_CONFIG["full-time"].all;
          const withCounts = allCats.map((cat) => {
            const catLower = cat.toLowerCase();
            const count = (jobs || []).filter((j) => {
              const t2 = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
              const typeOk = t2.includes("full") || t2 === "jt_fulltime";
              const fields = [j.categoryLabel, j.category, j.categoryId].filter(Boolean).map((f) => f.toString().toLowerCase());
              return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
            }).length;
            return {
              cat,
              count
            };
          });
          const top = [...withCounts].filter((x) => x.count > 0).sort(() => Math.random() - 0.5).slice(0, 3);
          return top.map(({
            cat,
            count: totalCount
          }, index) => {
            const catLower = cat.toLowerCase();
            const list = (jobs || []).filter((j) => {
              const t2 = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
              const typeOk = t2.includes("full") || t2 === "jt_fulltime";
              const fields = [j.categoryLabel, j.category, j.categoryId].filter(Boolean).map((f) => f.toString().toLowerCase());
              return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
            }).slice(0, 3);
            return /* @__PURE__ */ jsxs("button", { style: {
              animationDelay: `${index * 120}ms`
            }, onClick: () => navigate({
              to: "/search",
              search: {
                q: "",
                loc: "Anywhere",
                type: "full-time",
                cat
              }
            }), className: `${popularInView ? "animate-pop-in " : "opacity-0"} group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-brand/[0.03] via-card to-card/50 p-6 transition-all duration-300 hover:border-brand/50 hover:shadow-lg`, children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-brand/15 text-2xl drop-shadow-sm", children: getCategoryEmoji(cat) }),
                    /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-foreground", children: tt(cat) }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: t("home.openPositions", "{count} open position{plural}", {
                        count: totalCount,
                        plural: totalCount !== 1 ? "s" : ""
                      }) })
                    ] })
                  ] }),
                  locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5 text-brand transition-transform duration-200 group-hover:-translate-x-1" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 text-brand transition-transform duration-200 group-hover:translate-x-1" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `rounded-lg border px-4 py-3 text-sm font-medium text-center transition-colors ${list.length === 0 ? "border-dashed border-border text-muted-foreground" : "border-brand/30 bg-brand/5 text-brand"}`, children: list.length === 0 ? t("home.noOpenPositions", "No open positions") : t("home.lookFor", "Look for the {count} opportunit{plural} ->", {
                  count: totalCount,
                  plural: totalCount !== 1 ? "ies" : "y"
                }) })
              ] })
            ] }, cat);
          });
        })() })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "mb-6 flex items-center justify-between text-xl font-bold text-foreground", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Code2, { className: "h-5 w-5 text-brand" }),
            " ",
            t("home.freelance", "Freelance Opportunities")
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
            to: "/categories",
            search: {
              type: "freelance"
            }
          }), className: "flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors", children: [
            t("home.showAll", "Show all"),
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-7 sm:grid-cols-2 lg:grid-cols-3", children: (() => {
          const allCats = CATEGORY_CONFIG["freelance"].all;
          const withCounts = allCats.map((cat) => {
            const catLower = cat.toLowerCase();
            const count = (jobs || []).filter((j) => {
              const t2 = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
              const typeOk = t2.includes("freelance") || t2 === "jt_freelance";
              const fields = [j.categoryLabel, j.category, j.categoryId].filter(Boolean).map((f) => f.toString().toLowerCase());
              return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
            }).length;
            return {
              cat,
              count
            };
          });
          const top = [...withCounts].filter((x) => x.count > 0).sort(() => Math.random() - 0.5).slice(0, 3);
          return top.map(({
            cat,
            count: totalCount
          }, index) => {
            const catLower = cat.toLowerCase();
            const list = (jobs || []).filter((j) => {
              const t2 = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
              const typeOk = t2.includes("freelance") || t2 === "jt_freelance";
              const fields = [j.categoryLabel, j.category, j.categoryId].filter(Boolean).map((f) => f.toString().toLowerCase());
              return typeOk && fields.some((f) => f === catLower || f.includes(catLower));
            }).slice(0, 3);
            return /* @__PURE__ */ jsxs("button", { style: {
              animationDelay: `${index * 120}ms`
            }, onClick: () => navigate({
              to: "/search",
              search: {
                q: "",
                loc: "Anywhere",
                type: "freelance",
                cat
              }
            }), className: `${popularInView ? "animate-pop-in " : "opacity-0"} group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-brand/[0.03] via-card to-card/50 p-6 transition-all duration-300 hover:border-brand/50 hover:shadow-lg`, children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-brand/15 text-2xl drop-shadow-sm", children: getCategoryEmoji(cat) }),
                    /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-foreground", children: tt(cat) }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: t("home.openPositions", "{count} open position{plural}", {
                        count: totalCount,
                        plural: totalCount !== 1 ? "s" : ""
                      }) })
                    ] })
                  ] }),
                  locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5 text-brand transition-transform duration-200 group-hover:-translate-x-1" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 text-brand transition-transform duration-200 group-hover:translate-x-1" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `rounded-lg border px-4 py-3 text-sm font-medium text-center transition-colors ${list.length === 0 ? "border-dashed border-border text-muted-foreground" : "border-brand/30 bg-brand/5 text-brand"}`, children: list.length === 0 ? t("home.noOpenPositions", "No open positions") : t("home.lookFor", "Look for the {count} opportunit{plural} ->", {
                  count: totalCount,
                  plural: totalCount !== 1 ? "ies" : "y"
                }) })
              ] })
            ] }, cat);
          });
        })() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold", children: t("home.featured", "Featured listings") }),
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
          to: "/search",
          search: {
            q: "",
            loc: "Anywhere",
            type: "all",
            cat: "All categories"
          }
        }), className: "flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors", children: [
          t("home.showAll", "Show all"),
          locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: featuredRef, className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: jobsLoading ? /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-2xl border bg-card p-10 text-center text-muted-foreground", children: t("home.loadingFeatured", "Loading featured jobs...") }) : jobs && jobs.length > 0 ? [...jobs].sort(() => Math.random() - 0.5).slice(0, 6).map((j, i) => /* @__PURE__ */ jsx("div", { className: `${featuredInView ? "animate-slide-up-reveal" : "opacity-0"}`, style: {
        animationDelay: `${i * 100}ms`
      }, children: /* @__PURE__ */ jsx(JobCard, { job: j, featured: true }) }, j.id)) : /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-2xl border border-dashed bg-card/50 p-10 text-center text-muted-foreground", children: t("home.featured.empty", "No jobs available yet. Check back soon!") }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { ref: newsRef, className: "bg-background py-16", children: /* @__PURE__ */ jsx(AnnouncementsCarousel, { items: newsItems, newsInView }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-secondary py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-12 text-center", children: /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold tracking-normal text-foreground sm:text-5xl", children: (() => {
        const parts = t("home.how.title", "How مِهنة Works").split("مِهنة");
        return parts.length > 1 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          parts[0],
          /* @__PURE__ */ jsx("span", { className: "font-cairo", children: "مِهنة" }),
          parts[1]
        ] }) : t("home.how.title", "How مِهنة Works");
      })() }) }),
      /* @__PURE__ */ jsxs("div", { className: "group/how mx-auto max-w-5xl grid gap-16 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:opacity-100 group-hover/how:opacity-45 group-hover/how:hover:opacity-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-10 flex items-center justify-center gap-3 text-xl font-semibold text-brand", children: [
            /* @__PURE__ */ jsx(HardHat, { className: "h-6 w-6" }),
            " ",
            t("home.how.workers", "For Workers")
          ] }),
          /* @__PURE__ */ jsxs("ol", { className: "space-y-9", children: [
            /* @__PURE__ */ jsx(TimelineItem, { n: "01", title: t("home.worker.1.title", "Create Your Profile"), text: t("home.worker.1.text", "Sign up and build your professional profile with skills and experience.") }),
            /* @__PURE__ */ jsx(TimelineItem, { n: "02", title: t("home.worker.2.title", "Browse Jobs"), text: t("home.worker.2.text", "Search and filter through thousands of job listings. Find freelance gigs, full-time roles, and projects matching your expertise.") }),
            /* @__PURE__ */ jsx(TimelineItem, { n: "03", title: t("home.worker.3.title", "Apply with Ease"), text: t("home.worker.3.text", "Submit applications directly through the platform. Track your application status in real-time.") }),
            /* @__PURE__ */ jsx(TimelineItem, { n: "04", title: t("home.worker.4.title", "Get Hired"), text: t("home.worker.4.text", "Connect with employers and start working. Build your reputation with reviews and ratings.") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl transition-all duration-300 ease-out hover:scale-[1.01] hover:opacity-100 group-hover/how:opacity-45 group-hover/how:hover:opacity-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-10 flex items-center justify-center gap-3 text-xl font-semibold text-brand", children: [
            /* @__PURE__ */ jsx(Building2, { className: "h-6 w-6" }),
            " ",
            t("home.how.business", "For Business Owners")
          ] }),
          /* @__PURE__ */ jsxs("ol", { className: "space-y-9", children: [
            /* @__PURE__ */ jsx(TimelineItem, { n: "01", title: t("home.business.1.title", "Post a Job"), text: t("home.business.1.text", "Create detailed job listings in minutes. Specify requirements, budget, and timeline.") }),
            /* @__PURE__ */ jsx(TimelineItem, { n: "02", title: t("home.business.2.title", "Review Candidates"), text: t("home.business.2.text", "Browse qualified applicants with verified profiles. Filter by skills, experience, and ratings.") }),
            /* @__PURE__ */ jsx(TimelineItem, { n: "03", title: t("home.business.3.title", "Connect & Hire"), text: t("home.business.3.text", "Interview and select the best talent. Communicate directly through the platform.") }),
            /* @__PURE__ */ jsx(TimelineItem, { n: "04", title: t("home.business.4.title", "Manage Projects"), text: t("home.business.4.text", "Track progress and make payments securely. Leave feedback and build your team.") })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Index as component
};
