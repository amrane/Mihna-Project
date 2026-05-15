import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Menu,
  LogOut,
  Laptop,
  Clock3,
  Building2,
  Languages,
  Sun,
  Moon,
  CheckCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DEFAULT_PROFILE_PHOTO, useAuth } from "@/lib/auth";
import { getTheme, applyTheme, type ThemeMode } from "@/lib/utils";
import { useI18n, type Locale } from "@/lib/i18n";
import { notificationService } from "@/lib/firestore-service";
import type { AppNotification } from "@/lib/api-types";
import { toast } from "sonner";

const CATS = [
  {
    key: "freelance",
    label: "Freelancer",
    desc: "Create a project post for independent specialists, short missions, hourly work, or contract deliverables. (Login required to post)",
    icon: Laptop,
  },
  {
    key: "full-time",
    label: "Full-time",
    desc: "Publish a permanent role with salary, location, contract expectations, and long-term team requirements. (Login will be requested)",
    icon: Clock3,
  },
  {
    key: "business",
    label: "Business Owner",
    desc: "Describe a company need, team expansion, service request, or business project and connect with qualified talent. (Login required to continue)",
    icon: Building2,
  },
];

interface Props {
  transparent?: boolean;
  heroGreenLogo?: boolean;
}

export function Header({ transparent, heroGreenLogo }: Props) {
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const { user, logout } = useAuth();
  const { t, locale, setLocale, dir } = useI18n();
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("mihna-dismissed-notifs") || "[]");
    } catch {
      return [];
    }
  });

  const dismissNotif = (key: string) => {
    const next = [...dismissedNotifs, key];
    setDismissedNotifs(next);
    localStorage.setItem("mihna-dismissed-notifs", JSON.stringify(next));
  };

  const [serverNotifs, setServerNotifs] = useState<AppNotification[]>([]);
  const hasCv = Boolean(user?.cvFileName || user?.cvDataUrl);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = getTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (!user) {
      setServerNotifs([]);
      return;
    }
    let active = true;
    notificationService
      .getAll()
      .then((notifs) => {
        if (active) setServerNotifs(notifs);
      })
      .catch(() => {});
    const interval = setInterval(() => {
      notificationService
        .getAll()
        .then((notifs) => {
          if (active) setServerNotifs(notifs);
        })
        .catch(() => {});
    }, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  const goPost = (cat: string) => {
    const c = (cat || "").toString().toLowerCase();
    const normalized = c.includes("free")
      ? "freelance"
      : c.includes("full")
        ? "full-time"
        : "business";

    if (!user) {
      navigate({ to: "/post-job", search: { category: normalized } as never });
      return;
    }

    if (user.accountType === "employer") {
      navigate({ to: "/post-job", search: { category: normalized } as never });
      return;
    }

    navigate({ to: "/post-announcement", search: { type: normalized } as never });
  };

  const activeCat =
    location.pathname === "/post-announcement"
      ? ((location.search as { type?: string }).type ?? "full-time")
      : location.pathname === "/post-job"
        ? ((location.search as { category?: string }).category ?? "full-time")
        : "";
  const visibleCats = !user
    ? CATS
    : user.accountType === "employer"
      ? CATS.filter((cat) => cat.key === "business")
      : CATS.filter((cat) => cat.key === "freelance" || cat.key === "full-time");
  const defaultPostCategory = user?.accountType === "employer" ? "business" : "full-time";
  const avatarSrc = user?.avatar || DEFAULT_PROFILE_PHOTO;
  const catLabel = (cat: (typeof CATS)[number]) =>
    cat.key === "freelance"
      ? t("header.cat.freelance.label", cat.label)
      : cat.key === "full-time"
        ? t("header.cat.fulltime.label", cat.label)
        : t("header.cat.business.label", cat.label);
  const catDesc = (cat: (typeof CATS)[number]) =>
    cat.key === "freelance"
      ? t("header.cat.freelance.desc", cat.desc)
      : cat.key === "full-time"
        ? t("header.cat.fulltime.desc", cat.desc)
        : t("header.cat.business.desc", cat.desc);

  const notifications = [
    {
      key: "cv",
      title: t(
        "header.notifications.cv.title",
        user?.accountType === "employer" ? "Upload company introduction" : "Upload your CV",
      ),
      description: t(
        "header.notifications.cv.desc",
        user?.accountType === "employer"
          ? "Add a company introduction in profile so candidates can learn about your business."
          : "Add your CV in profile so employers can contact you faster.",
      ),
      action: () => {
        navigate({ to: "/profile" });
        dismissNotif("cv");
      },
      visible: !hasCv && !dismissedNotifs.includes("cv"),
    },
    {
      key: "profile",
      title: t("header.notifications.profile.title", "Finish your profile"),
      description: t(
        "header.notifications.profile.desc",
        "Complete your bio or contact details to improve matching.",
      ),
      action: () => {
        navigate({ to: "/profile" });
        dismissNotif("profile");
      },
      visible: !dismissedNotifs.includes("profile"),
    },
    {
      key: "jobs",
      title: t("header.notifications.jobs.title", "New jobs available"),
      description: t(
        "header.notifications.jobs.desc",
        "3 new Alger jobs were posted that match your interests.",
      ),
      action: () => {
        navigate({ to: "/search", search: {} as never });
        dismissNotif("jobs");
      },
      visible: !dismissedNotifs.includes("jobs"),
    },
  ].filter((n) => n.visible);

  return (
    <header
      dir={dir}
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-50 text-white"
          : "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
      }
    >
      <div
        dir="ltr"
        className="relative flex h-18 w-full items-center justify-between gap-4 px-2 py-4 sm:px-3 lg:px-4"
      >
        <BrandLogo
          className={`text-3xl ${transparent ? (heroGreenLogo ? "text-brand" : "text-white") : "text-brand"}`}
          greenOnTransparent={heroGreenLogo}
        />

        <TooltipProvider delayDuration={150}>
          <nav className="hidden absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex">
            {visibleCats.map((c) => {
              const isActive = activeCat === c.key;

              return (
                <Tooltip key={c.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => goPost(c.key)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all hover:scale-[1.02] ${
                        isActive
                          ? "border-brand bg-brand text-brand-foreground shadow-md shadow-emerald-950/15 ring-2 ring-brand/20"
                          : transparent
                            ? "border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                            : "border-border bg-secondary text-secondary-foreground shadow-sm hover:bg-accent"
                      }`}
                    >
                      <c.icon className="h-4 w-4" />
                      {catLabel(c)}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-72 rounded-xl bg-zinc-950 p-4 text-white shadow-xl">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <c.icon className="h-4 w-4 text-emerald-300" />
                      {catLabel(c)}
                    </div>
                    <p className="text-xs leading-relaxed text-white/80">{catDesc(c)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>

        <div className="flex items-center gap-2 justify-self-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const nextTheme = theme === "dark" ? "light" : "dark";
              setTheme(nextTheme);
              applyTheme(nextTheme);
            }}
            className={
              transparent
                ? "text-white hover:bg-white/15 hover:text-white"
                : "text-foreground hover:bg-accent"
            }
            aria-label={t("header.theme.toggle", "Toggle theme")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={
                  transparent
                    ? "text-white hover:bg-white/15 hover:text-white"
                    : "text-foreground hover:bg-accent"
                }
                aria-label={t("header.lang.toggle", "Switch language")}
              >
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {[
                ["en", "English"],
                ["ar", "العربية"],
                ["fr", "Français"],
              ].map(([code, label]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLocale(code as Locale)}
                  className={locale === code ? "font-semibold text-brand" : ""}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative inline-flex h-11 w-11 items-center justify-center bg-transparent text-current transition hover:text-brand focus:outline-none ${transparent ? "text-white hover:text-white/80" : "text-foreground"}`}
                  >
                    <Bell className="h-5 w-5" />
                    {(notifications.length > 0 || serverNotifs.some((n) => !n.isRead)) && (
                      <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={locale === "ar" ? "start" : "end"}
                  className="w-80 max-h-[70vh] overflow-y-auto"
                >
                  <DropdownMenuLabel className="font-semibold">
                    {t("header.notifications.title", "Notifications")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 &&
                    serverNotifs.filter((n) => !n.isRead).length === 0 && (
                      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    )}
                  {serverNotifs.filter((n) => !n.isRead).length > 0 && (
                    <DropdownMenuItem
                      className="justify-center gap-2 py-2 text-xs font-medium text-brand"
                      onClick={() => {
                        notificationService
                          .markAllAsRead()
                          .then(() => {
                            setServerNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
                          })
                          .catch(() => {});
                      }}
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all as read
                    </DropdownMenuItem>
                  )}
                  {serverNotifs.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className={`flex flex-col gap-1 py-3 ${!item.isRead ? "bg-brand/5" : ""}`}
                      onClick={() => {
                        if (!item.isRead) {
                          notificationService
                            .markAsRead(item.id)
                            .then(() => {
                              setServerNotifs((prev) =>
                                prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
                              );
                            })
                            .catch(() => {});
                        }
                        if (item.link) window.location.href = item.link;
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {!item.isRead && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                        <span
                          className={`text-sm font-semibold ${!item.isRead ? "" : "text-muted-foreground"}`}
                        >
                          {item.title}
                        </span>
                      </div>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                  {serverNotifs.length > 0 && notifications.length > 0 && <DropdownMenuSeparator />}
                  {notifications.map((item) => (
                    <DropdownMenuItem
                      key={item.key}
                      className="flex flex-col gap-1 py-3"
                      onClick={item.action}
                    >
                      <span className="text-sm font-semibold">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`flex items-center gap-2 rounded-full px-2 py-1 outline-none transition ${transparent ? "border border-white/20 hover:bg-white/10" : "hover:bg-accent"}`}
                >
                  <Avatar className="h-9 w-9 border border-white/30">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>{user.fullName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`hidden text-sm font-semibold sm:block ${transparent ? "text-white" : ""}`}
                  >
                    {user.fullName}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                    {t("header.menu.profile", "Profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: user.accountType === "employer" ? "/post-job" : "/post-announcement",
                        search: { category: defaultPostCategory } as never,
                      })
                    }
                  >
                    {user.accountType === "employer"
                      ? t("header.menu.postJob", "Post a job")
                      : t("header.menu.createOffer", "Create talent offer")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/search",
                        search: {
                          q: "",
                          loc: "Remote",
                          type: "all",
                          cat: "All categories",
                        } as never,
                      })
                    }
                  >
                    {t("header.menu.browseJobs", "Browse jobs")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> {t("header.menu.signOut", "Sign out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: "/auth", search: { mode: "login" } as never })}
                className={transparent ? "text-white hover:bg-white/15 hover:text-white" : ""}
              >
                {t("header.auth.login", "Login")}
              </Button>
              <Button
                onClick={() => navigate({ to: "/auth", search: { mode: "register" } as never })}
                className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {t("header.auth.register", "Register")}
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${transparent ? "text-white hover:bg-white/15 hover:text-white" : ""}`}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-3">
                {visibleCats.map((c) => {
                  const isActive = activeCat === c.key;

                  return (
                    <Button
                      key={c.key}
                      variant={isActive ? "default" : "outline"}
                      className={`justify-start gap-2 rounded-full ${isActive ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""}`}
                      onClick={() => goPost(c.key)}
                    >
                      <c.icon className="h-4 w-4" />
                      {catLabel(c)}
                    </Button>
                  );
                })}
                {!user && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate({ to: "/auth", search: { mode: "login" } as never })}
                    >
                      {t("header.auth.login", "Login")}
                    </Button>
                    <Button
                      onClick={() =>
                        navigate({ to: "/auth", search: { mode: "register" } as never })
                      }
                      className="rounded-full bg-brand text-brand-foreground"
                    >
                      {t("header.auth.register", "Register")}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
