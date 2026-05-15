import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Megaphone, Search, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFirestoreCollection } from "@/hooks/use-firestore";
import { useI18n } from "@/lib/i18n";

interface SearchParams {
  q?: string;
  loc?: string;
}

export const Route = createFileRoute("/announcements")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: (s.q as string) || "",
    loc: (s.loc as string) || "",
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { t, tt, locale } = useI18n();
  const { q: searchQ, loc: searchLoc } = Route.useSearch();
  const { data: allAnnouncements } = useFirestoreCollection<any>("announcements", "createdAt");
  const newsItems = (allAnnouncements || []).filter((a: any) => a.announcementType === "jobseeking");
  const [searchText, setSearchText] = useState(searchQ || "");
  const [locFilter, setLocFilter] = useState(searchLoc || "");

  const filteredItems = newsItems.filter((item: any) => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-bold text-foreground">
            {t("home.news.title", "All announcements")}
          </h1>
          <span className="ml-2 text-sm text-muted-foreground">
            ({filteredItems.length})
          </span>
        </div>

        {(searchQ || (searchLoc && searchLoc !== "Anywhere")) && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("search.placeholder", "Search by title, name, skills...")}
                className="pl-9"
              />
            </div>
            <div className="relative">
              <Input
                value={locFilter}
                onChange={(e) => setLocFilter(e.target.value)}
                placeholder={t("common.location", "Location")}
                className="sm:w-44"
              />
            </div>
            {(searchText || locFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchText(""); setLocFilter(""); }}
              >
                <X className="mr-1 h-4 w-4" />
                {t("search.reset", "Reset")}
              </Button>
            )}
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            {searchText || locFilter ? t("search.empty.desc", "No announcements match your search. Try different keywords.") : t("home.news.empty", "No announcements yet.")}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
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
        )}
      </main>
      <Footer />
    </div>
  );
}
