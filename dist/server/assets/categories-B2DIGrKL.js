import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Code2, Briefcase, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { H as Header, F as Footer } from "./Footer-CIdxXT3C.js";
import { u as useFirestoreCollection } from "./use-firestore-uoDfirYi.js";
import { C as CATEGORY_CONFIG, g as getCategoryEmoji } from "./categories-CUhIo4Yi.js";
import { f as Route, a as useI18n } from "./router-Bte9I49t.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "sonner";
function CategoriesPage() {
  const {
    type
  } = Route.useSearch();
  const navigate = useNavigate();
  const {
    t,
    tt,
    locale
  } = useI18n();
  const {
    data: jobs
  } = useFirestoreCollection("jobs");
  const [visibleLimit, setVisibleLimit] = useState(20);
  const categories = useMemo(() => CATEGORY_CONFIG[type === "freelance" ? "freelance" : "full-time"]?.all || [], [type]);
  const isFreelance = type === "freelance";
  const typeLabel = isFreelance ? t("home.freelance", "Freelance Opportunities") : t("home.fulltime", "Full-time Positions");
  const getJobCount = (cat) => {
    const catLower = cat.toLowerCase();
    return (jobs || []).filter((j) => {
      const t2 = (j.typeLabel || j.type || j.typeId || "").toString().toLowerCase();
      const typeMatch = isFreelance ? t2.includes("freelance") || t2 === "jt_freelance" : t2.includes("full") || t2 === "jt_fulltime";
      const fields = [j.categoryLabel, j.category, j.categoryId].filter(Boolean).map((f) => f.toString().toLowerCase());
      const catMatch = fields.some((f) => f === catLower || f.includes(catLower));
      return typeMatch && catMatch;
    }).length;
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand", children: [
            isFreelance ? /* @__PURE__ */ jsx(Code2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4" }),
            typeLabel
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-4 text-4xl font-bold tracking-normal text-foreground", children: t("home.popular.title", "Most Popular Jobs") }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-muted-foreground", children: [
            categories.length,
            " ",
            t("home.popular.subtitle", "categories available")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
            to: "/categories",
            search: {
              type: "full-time"
            }
          }), className: `rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${!isFreelance ? "bg-brand text-brand-foreground" : "border border-border bg-card text-muted-foreground hover:border-brand/40"}`, children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "mr-1.5 inline h-4 w-4" }),
            t("home.fulltime", "Full-time")
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
            to: "/categories",
            search: {
              type: "freelance"
            }
          }), className: `rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${isFreelance ? "bg-brand text-brand-foreground" : "border border-border bg-card text-muted-foreground hover:border-brand/40"}`, children: [
            /* @__PURE__ */ jsx(Code2, { className: "mr-1.5 inline h-4 w-4" }),
            t("home.freelance", "Freelance")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: categories.slice(0, visibleLimit).map((cat) => {
        const count = getJobCount(cat);
        return /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
          to: "/search",
          search: {
            q: "",
            loc: "Anywhere",
            type: isFreelance ? "freelance" : "full-time",
            cat
          }
        }), className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all duration-300 hover:border-brand/40 hover:shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-xl", children: getCategoryEmoji(cat) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-foreground", children: tt(cat) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
                count,
                " ",
                count === 1 ? "position" : "positions"
              ] })
            ] }),
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mt-2 h-4 w-4 shrink-0 text-brand opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-0.5" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "mt-2 h-4 w-4 shrink-0 text-brand opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" })
          ] })
        ] }, cat);
      }) }),
      categories.length > visibleLimit && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("button", { onClick: () => setVisibleLimit((prev) => prev + 20), className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brand/50 hover:text-brand", children: [
        t("home.showMore", "Show more"),
        /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
      ] }) }),
      visibleLimit > 20 && categories.length <= visibleLimit && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("button", { onClick: () => setVisibleLimit(20), className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brand/50 hover:text-brand", children: [
        t("home.showLess", "Show less"),
        /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/search",
        search: {
          type: isFreelance ? "freelance" : "full-time",
          loc: "Anywhere"
        }
      }), className: "inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-base font-semibold text-brand-foreground hover:bg-brand/90 transition-all", children: [
        t("home.showAll", "Show all"),
        " ",
        typeLabel.toLowerCase(),
        locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  CategoriesPage as component
};
