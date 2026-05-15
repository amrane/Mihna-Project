import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Megaphone, Search, X } from "lucide-react";
import { H as Header, B as Button, A as Avatar, a as AvatarImage, b as AvatarFallback, F as Footer } from "./Footer-CIdxXT3C.js";
import { I as Input } from "./input-BAq2Xo4A.js";
import { u as useFirestoreCollection } from "./use-firestore-uoDfirYi.js";
import { a as useI18n, h as Route } from "./router-Bte9I49t.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "sonner";
function AnnouncementsPage() {
  const {
    t,
    tt,
    locale
  } = useI18n();
  const {
    q: searchQ,
    loc: searchLoc
  } = Route.useSearch();
  const {
    data: allAnnouncements
  } = useFirestoreCollection("announcements", "createdAt");
  const newsItems = (allAnnouncements || []).filter((a) => a.announcementType === "jobseeking");
  const [searchText, setSearchText] = useState(searchQ || "");
  const [locFilter, setLocFilter] = useState(searchLoc || "");
  const filteredItems = newsItems.filter((item) => {
    if (searchText) {
      const qLower = searchText.toLowerCase();
      const title = (item.title || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      const author = (item.authorName || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      const skills = Array.isArray(item.skills) ? item.skills.join(" ").toLowerCase() : "";
      const tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
      const searchable = `${title} ${content} ${author} ${category} ${skills} ${tags}`;
      if (!searchable.includes(qLower)) return false;
    }
    if (locFilter && locFilter !== "Anywhere") {
      const itemLoc = (item.location || "").toLowerCase();
      if (!itemLoc.includes(locFilter.toLowerCase())) return false;
    }
    return true;
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Megaphone, { className: "h-6 w-6 text-brand" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: t("home.news.title", "All announcements") }),
        /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-muted-foreground", children: [
          "(",
          filteredItems.length,
          ")"
        ] })
      ] }),
      (searchQ || searchLoc && searchLoc !== "Anywhere") && /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx(Input, { value: searchText, onChange: (e) => setSearchText(e.target.value), placeholder: t("search.placeholder", "Search by title, name, skills..."), className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(Input, { value: locFilter, onChange: (e) => setLocFilter(e.target.value), placeholder: t("common.location", "Location"), className: "sm:w-44" }) }),
        (searchText || locFilter) && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
          setSearchText("");
          setLocFilter("");
        }, children: [
          /* @__PURE__ */ jsx(X, { className: "mr-1 h-4 w-4" }),
          t("search.reset", "Reset")
        ] })
      ] }),
      filteredItems.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground", children: searchText || locFilter ? t("search.empty.desc", "No announcements match your search. Try different keywords.") : t("home.news.empty", "No announcements yet.") }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filteredItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md", children: [
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
      ] }, item.id)) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AnnouncementsPage as component
};
