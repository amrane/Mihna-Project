import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Megaphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";

interface Announcement {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  category?: string;
  experienceLevel?: string;
  announcementType?: string;
}

interface AnnouncementsSectionProps {
  newsItems: Announcement[];
}

export function AnnouncementsSection({ newsItems }: AnnouncementsSectionProps) {
  const { t, tt, locale } = useI18n();
  const [newsIdx, setNewsIdx] = useState(0);

  if (newsItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
        {t("home.news.empty", "No announcements yet.")}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newsItems.slice(newsIdx * 3, newsIdx * 3 + 3).map((item: Announcement) => (
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
      {newsItems.length > 3 && (
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
            {Array.from({ length: Math.ceil(newsItems.length / 3) }, (_, i) => (
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
              setNewsIdx((i) => Math.min(Math.ceil(newsItems.length / 3) - 1, i + 1));
            }}
            disabled={newsIdx >= Math.ceil(newsItems.length / 3) - 1}
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
    </>
  );
}
