import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Binoculars, Search, UserSearch } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFirestoreCollection, LocationItem } from "@/hooks/use-firestore";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function SearchBar({ strongShadow = false }: { strongShadow?: boolean }) {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const isEmployer = user?.accountType === "employer";
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("Anywhere");
  const [type, setType] = useState("all");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: locations } = useFirestoreCollection<LocationItem>("locations", "order");
  const locationOptions = locations.filter(
    (location) => location.name !== "Anywhere" && location.name !== "Remote",
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = () => {
    if (isEmployer) {
      navigate({ to: "/announcements", search: { q, loc } as never });
    } else {
      navigate({ to: "/search", search: { q, loc, type } as never });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`mx-auto flex w-full max-w-4xl flex-col gap-2 rounded-3xl border p-2 text-white backdrop-blur-xl md:flex-row md:items-center md:gap-0 md:rounded-full md:p-2 ${
        strongShadow
          ? "border-white/40 bg-white/25 shadow-2xl"
          : "border-white/20 bg-white/10 shadow-[var(--shadow-elegant)]"
      }`}
    >
      <div className="flex flex-1 items-center gap-2 px-4">
        {isEmployer ? <UserSearch className="h-5 w-5 text-white" /> : <Binoculars className="h-5 w-5 text-white" />}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          onFocus={() => setIsFocused(true)}
          placeholder={isEmployer ? t("searchbar.employerPlaceholder", "Search for candidates...") : t("searchbar.placeholder", "Job title or company")}
          className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white dark:bg-transparent"
        />
      </div>
      <div
        className={`hidden h-8 w-px bg-border transition-all duration-300 md:block ${isFocused ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isFocused ? "max-h-0 opacity-0 md:max-h-0" : "max-h-20 opacity-100 md:max-h-12"
        }`}
      >
        <Select value={loc} onValueChange={setLoc}>
          <SelectTrigger className="h-12 border-0 bg-transparent text-sm text-white shadow-none focus:ring-0 md:w-44">
            <SelectValue placeholder={t("searchbar.attendance", "Attendance")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Anywhere">{t("searchbar.attendance", "Attendance")}</SelectItem>
            <SelectItem value="Remote" className="my-1 bg-brand-soft font-semibold text-brand">
              {t("common.remote", "Remote")}
            </SelectItem>
            {locationOptions.map((location, index) => (
              <SelectItem key={location.id} value={location.name}>
                <span className="tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        className={`hidden h-8 w-px bg-border transition-all duration-300 md:block ${isFocused ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isFocused ? "max-h-0 opacity-0 md:max-h-0" : "max-h-20 opacity-100 md:max-h-12"
        }`}
      >
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-12 border-0 bg-transparent text-sm text-white shadow-none focus:ring-0 md:w-44">
            <SelectValue placeholder={t("searchbar.typePlaceholder", "Type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("type.all", "All types")}</SelectItem>
            <SelectItem value="freelance">{t("type.freelance", "Freelancer")}</SelectItem>
            <SelectItem value="full-time">{t("type.full-time", "Full-time")}</SelectItem>
            <SelectItem value="part-time">{t("type.part-time", "Part-time")}</SelectItem>
            <SelectItem value="internship">{t("type.internship", "Internship")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={submit}
        className={`shrink-0 h-12 rounded-full bg-brand text-brand-foreground hover:bg-brand/90 overflow-hidden transition-all duration-500 ease-in-out ${
          isFocused ? "w-12 px-0 justify-center" : "w-40 px-6"
        }`}
        aria-label={isEmployer ? t("searchbar.submitEmployer", "Search Candidates") : t("searchbar.submit", "Search Job")}
      >
        <span className="flex items-center gap-2">
          <Search className="h-5 w-5 shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap ${
              isFocused ? "max-w-0" : "max-w-32"
            }`}
          >
            {isEmployer ? t("searchbar.submitEmployer", "Search Candidates") : t("searchbar.submit", "Search Job")}
          </span>
        </span>
      </Button>
    </div>
  );
}
