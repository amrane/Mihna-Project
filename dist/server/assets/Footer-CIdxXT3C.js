import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Check, Circle, X, Laptop, Clock3, Building2, Sun, Moon, Languages, Bell, CheckCheck, LogOut, Menu, Mail, Phone } from "lucide-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { c as apiRequest, u as useAuth, a as useI18n, D as DEFAULT_PROFILE_PHOTO } from "./router-Bte9I49t.js";
function BrandLogo({
  className = "",
  link = true,
  greenOnTransparent = false
}) {
  const wordmark = /* @__PURE__ */ jsx(
    "span",
    {
      dir: "rtl",
      className: `font-logo text-2xl font-bold leading-none tracking-normal ${greenOnTransparent ? "text-brand drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : ""} ${className}`,
      children: "مِهنة"
    }
  );
  return link ? /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "مِهنة home", className: "inline-flex items-center", children: wordmark }) : wordmark;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getTheme() {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("mihna-theme") || "light";
}
function applyTheme(theme) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("mihna-theme", theme);
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(SheetPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
async function getAll(collectionName, orderField, filterField, filterValue) {
  const params = new URLSearchParams();
  params.set("orderField", orderField);
  if (filterField && filterValue !== void 0) {
    params.set("filterField", filterField);
    params.set("filterValue", String(filterValue));
  }
  return apiRequest(`/data/${collectionName}${params.size ? `?${params.toString()}` : ""}`);
}
async function getById(collectionName, id) {
  return apiRequest(`/data/${collectionName}/${id}`);
}
const jobService = {
  async getAll() {
    return getAll("jobs", "createdAt");
  },
  async getById(id) {
    try {
      return await getById("jobs", id);
    } catch {
      return null;
    }
  },
  async create(data) {
    const response = await apiRequest("/jobs", {
      method: "POST",
      auth: true,
      body: data
    });
    return response.id;
  },
  async update(id, data) {
    await apiRequest(`/jobs/${id}`, {
      method: "PATCH",
      auth: true,
      body: data
    });
    return true;
  },
  async remove(id) {
    await apiRequest(`/jobs/${id}`, {
      method: "DELETE",
      auth: true
    });
    return true;
  }
};
const announcementService = {
  async getAll() {
    return getAll("announcements", "createdAt");
  },
  async getById(id) {
    try {
      return await getById("announcements", id);
    } catch {
      return null;
    }
  },
  async getTalentOffers() {
    return getAll("announcements", "createdAt", "announcementType", "jobseeking");
  },
  async create(data) {
    const response = await apiRequest("/announcements", {
      method: "POST",
      auth: true,
      body: data
    });
    return response.id;
  }
};
const applicationService = {
  async getEmployerApplications() {
    const response = await apiRequest("/employer/applications", {
      auth: true
    });
    return response.applications;
  },
  async getCandidateApplications() {
    const response = await apiRequest("/candidate/applications", {
      auth: true
    });
    return response.applications;
  },
  async updateStatus(id, status) {
    const response = await apiRequest(`/applications/${id}/status`, {
      method: "PATCH",
      auth: true,
      body: { status }
    });
    return response.application;
  }
};
const notificationService = {
  async getAll() {
    const response = await apiRequest("/notifications", {
      auth: true
    });
    return response.notifications;
  },
  async markAsRead(id) {
    await apiRequest(`/notifications/${id}/read`, {
      method: "POST",
      auth: true
    });
  },
  async markAllAsRead() {
    await apiRequest("/notifications/read-all", {
      method: "POST",
      auth: true
    });
  }
};
const statsService = {
  async getLiveStats() {
    const response = await apiRequest("/stats/counts", { auth: false });
    return response;
  }
};
const CATS = [
  {
    key: "freelance",
    label: "Freelancer",
    desc: "Create a project post for independent specialists, short missions, hourly work, or contract deliverables. (Login required to post)",
    icon: Laptop
  },
  {
    key: "full-time",
    label: "Full-time",
    desc: "Publish a permanent role with salary, location, contract expectations, and long-term team requirements. (Login will be requested)",
    icon: Clock3
  },
  {
    key: "business",
    label: "Business Owner",
    desc: "Describe a company need, team expansion, service request, or business project and connect with qualified talent. (Login required to continue)",
    icon: Building2
  }
];
function Header({ transparent, heroGreenLogo }) {
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const { user, logout } = useAuth();
  const { t, locale, setLocale, dir } = useI18n();
  const [theme, setTheme] = useState("light");
  const [dismissedNotifs, setDismissedNotifs] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("mihna-dismissed-notifs") || "[]");
    } catch {
      return [];
    }
  });
  const dismissNotif = (key) => {
    const next = [...dismissedNotifs, key];
    setDismissedNotifs(next);
    localStorage.setItem("mihna-dismissed-notifs", JSON.stringify(next));
  };
  const [serverNotifs, setServerNotifs] = useState([]);
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
    notificationService.getAll().then((notifs) => {
      if (active) setServerNotifs(notifs);
    }).catch(() => {
    });
    const interval = setInterval(() => {
      notificationService.getAll().then((notifs) => {
        if (active) setServerNotifs(notifs);
      }).catch(() => {
      });
    }, 3e4);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);
  const goPost = (cat) => {
    const c = (cat || "").toString().toLowerCase();
    const normalized = c.includes("free") ? "freelance" : c.includes("full") ? "full-time" : "business";
    if (!user) {
      navigate({ to: "/post-job", search: { category: normalized } });
      return;
    }
    if (user.accountType === "employer") {
      navigate({ to: "/post-job", search: { category: normalized } });
      return;
    }
    navigate({ to: "/post-announcement", search: { type: normalized } });
  };
  const activeCat = location.pathname === "/post-announcement" ? location.search.type ?? "full-time" : location.pathname === "/post-job" ? location.search.category ?? "full-time" : "";
  const visibleCats = !user ? CATS : user.accountType === "employer" ? CATS.filter((cat) => cat.key === "business") : CATS.filter((cat) => cat.key === "freelance" || cat.key === "full-time");
  const defaultPostCategory = user?.accountType === "employer" ? "business" : "full-time";
  const avatarSrc = user?.avatar || DEFAULT_PROFILE_PHOTO;
  const catLabel = (cat) => cat.key === "freelance" ? t("header.cat.freelance.label", cat.label) : cat.key === "full-time" ? t("header.cat.fulltime.label", cat.label) : t("header.cat.business.label", cat.label);
  const catDesc = (cat) => cat.key === "freelance" ? t("header.cat.freelance.desc", cat.desc) : cat.key === "full-time" ? t("header.cat.fulltime.desc", cat.desc) : t("header.cat.business.desc", cat.desc);
  const notifications = [
    {
      key: "cv",
      title: t(
        "header.notifications.cv.title",
        user?.accountType === "employer" ? "Upload company introduction" : "Upload your CV"
      ),
      description: t(
        "header.notifications.cv.desc",
        user?.accountType === "employer" ? "Add a company introduction in profile so candidates can learn about your business." : "Add your CV in profile so employers can contact you faster."
      ),
      action: () => {
        navigate({ to: "/profile" });
        dismissNotif("cv");
      },
      visible: !hasCv && !dismissedNotifs.includes("cv")
    },
    {
      key: "profile",
      title: t("header.notifications.profile.title", "Finish your profile"),
      description: t(
        "header.notifications.profile.desc",
        "Complete your bio or contact details to improve matching."
      ),
      action: () => {
        navigate({ to: "/profile" });
        dismissNotif("profile");
      },
      visible: !dismissedNotifs.includes("profile")
    },
    {
      key: "jobs",
      title: t("header.notifications.jobs.title", "New jobs available"),
      description: t(
        "header.notifications.jobs.desc",
        "3 new Alger jobs were posted that match your interests."
      ),
      action: () => {
        navigate({ to: "/search", search: {} });
        dismissNotif("jobs");
      },
      visible: !dismissedNotifs.includes("jobs")
    }
  ].filter((n) => n.visible);
  return /* @__PURE__ */ jsx(
    "header",
    {
      dir,
      className: transparent ? "absolute inset-x-0 top-0 z-50 text-white" : "sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl",
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          dir: "ltr",
          className: "relative flex h-18 w-full items-center justify-between gap-4 px-2 py-4 sm:px-3 lg:px-4",
          children: [
            /* @__PURE__ */ jsx(
              BrandLogo,
              {
                className: `text-3xl ${transparent ? heroGreenLogo ? "text-brand" : "text-white" : "text-brand"}`,
                greenOnTransparent: heroGreenLogo
              }
            ),
            /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 150, children: /* @__PURE__ */ jsx("nav", { className: "hidden absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex", children: visibleCats.map((c) => {
              const isActive = activeCat === c.key;
              return /* @__PURE__ */ jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => goPost(c.key),
                    "aria-current": isActive ? "page" : void 0,
                    className: `flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all hover:scale-[1.02] ${isActive ? "border-brand bg-brand text-brand-foreground shadow-md shadow-emerald-950/15 ring-2 ring-brand/20" : transparent ? "border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20" : "border-border bg-secondary text-secondary-foreground shadow-sm hover:bg-accent"}`,
                    children: [
                      /* @__PURE__ */ jsx(c.icon, { className: "h-4 w-4" }),
                      catLabel(c)
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs(TooltipContent, { className: "max-w-72 rounded-xl bg-zinc-950 p-4 text-white shadow-xl", children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 font-semibold", children: [
                    /* @__PURE__ */ jsx(c.icon, { className: "h-4 w-4 text-emerald-300" }),
                    catLabel(c)
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed text-white/80", children: catDesc(c) })
                ] })
              ] }, c.key);
            }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-self-end", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => {
                    const nextTheme = theme === "dark" ? "light" : "dark";
                    setTheme(nextTheme);
                    applyTheme(nextTheme);
                  },
                  className: transparent ? "text-white hover:bg-white/15 hover:text-white" : "text-foreground hover:bg-accent",
                  "aria-label": t("header.theme.toggle", "Toggle theme"),
                  children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: transparent ? "text-white hover:bg-white/15 hover:text-white" : "text-foreground hover:bg-accent",
                    "aria-label": t("header.lang.toggle", "Switch language"),
                    children: /* @__PURE__ */ jsx(Languages, { className: "h-4 w-4" })
                  }
                ) }),
                /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", className: "w-44", children: [
                  ["en", "English"],
                  ["ar", "العربية"],
                  ["fr", "Français"]
                ].map(([code, label]) => /* @__PURE__ */ jsx(
                  DropdownMenuItem,
                  {
                    onClick: () => setLocale(code),
                    className: locale === code ? "font-semibold text-brand" : "",
                    children: label
                  },
                  code
                )) })
              ] }),
              user ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      className: `relative inline-flex h-11 w-11 items-center justify-center bg-transparent text-current transition hover:text-brand focus:outline-none ${transparent ? "text-white hover:text-white/80" : "text-foreground"}`,
                      children: [
                        /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
                        (notifications.length > 0 || serverNotifs.some((n) => !n.isRead)) && /* @__PURE__ */ jsx("span", { className: "absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(
                    DropdownMenuContent,
                    {
                      align: locale === "ar" ? "start" : "end",
                      className: "w-80 max-h-[70vh] overflow-y-auto",
                      children: [
                        /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-semibold", children: t("header.notifications.title", "Notifications") }),
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        notifications.length === 0 && serverNotifs.filter((n) => !n.isRead).length === 0 && /* @__PURE__ */ jsx("div", { className: "px-3 py-6 text-center text-sm text-muted-foreground", children: "No new notifications" }),
                        serverNotifs.filter((n) => !n.isRead).length > 0 && /* @__PURE__ */ jsxs(
                          DropdownMenuItem,
                          {
                            className: "justify-center gap-2 py-2 text-xs font-medium text-brand",
                            onClick: () => {
                              notificationService.markAllAsRead().then(() => {
                                setServerNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
                              }).catch(() => {
                              });
                            },
                            children: [
                              /* @__PURE__ */ jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
                              "Mark all as read"
                            ]
                          }
                        ),
                        serverNotifs.map((item) => /* @__PURE__ */ jsxs(
                          DropdownMenuItem,
                          {
                            className: `flex flex-col gap-1 py-3 ${!item.isRead ? "bg-brand/5" : ""}`,
                            onClick: () => {
                              if (!item.isRead) {
                                notificationService.markAsRead(item.id).then(() => {
                                  setServerNotifs(
                                    (prev) => prev.map((n) => n.id === item.id ? { ...n, isRead: true } : n)
                                  );
                                }).catch(() => {
                                });
                              }
                              if (item.link) window.location.href = item.link;
                            },
                            children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                                !item.isRead && /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-sm font-semibold ${!item.isRead ? "" : "text-muted-foreground"}`,
                                    children: item.title
                                  }
                                )
                              ] }),
                              item.description && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: item.description })
                            ]
                          },
                          item.id
                        )),
                        serverNotifs.length > 0 && notifications.length > 0 && /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        notifications.map((item) => /* @__PURE__ */ jsxs(
                          DropdownMenuItem,
                          {
                            className: "flex flex-col gap-1 py-3",
                            onClick: item.action,
                            children: [
                              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: item.title }),
                              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: item.description })
                            ]
                          },
                          item.key
                        ))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsxs(
                    DropdownMenuTrigger,
                    {
                      className: `flex items-center gap-2 rounded-full px-2 py-1 outline-none transition ${transparent ? "border border-white/20 hover:bg-white/10" : "hover:bg-accent"}`,
                      children: [
                        /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9 border border-white/30", children: [
                          /* @__PURE__ */ jsx(AvatarImage, { src: avatarSrc }),
                          /* @__PURE__ */ jsx(AvatarFallback, { children: user.fullName.slice(0, 1) })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `hidden text-sm font-semibold sm:block ${transparent ? "text-white" : ""}`,
                            children: user.fullName
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
                    /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: user.fullName }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: user.email })
                    ] }) }),
                    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                    /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => navigate({ to: "/profile" }), children: t("header.menu.profile", "Profile") }),
                    /* @__PURE__ */ jsx(
                      DropdownMenuItem,
                      {
                        onClick: () => navigate({
                          to: user.accountType === "employer" ? "/post-job" : "/post-announcement",
                          search: { category: defaultPostCategory }
                        }),
                        children: user.accountType === "employer" ? t("header.menu.postJob", "Post a job") : t("header.menu.createOffer", "Create talent offer")
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      DropdownMenuItem,
                      {
                        onClick: () => navigate({
                          to: "/search",
                          search: {
                            q: "",
                            loc: "Remote",
                            type: "all",
                            cat: "All categories"
                          }
                        }),
                        children: t("header.menu.browseJobs", "Browse jobs")
                      }
                    ),
                    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: logout, children: [
                      /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                      " ",
                      t("header.menu.signOut", "Sign out")
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 sm:flex", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    onClick: () => navigate({ to: "/auth", search: { mode: "login" } }),
                    className: transparent ? "text-white hover:bg-white/15 hover:text-white" : "",
                    children: t("header.auth.login", "Login")
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => navigate({ to: "/auth", search: { mode: "register" } }),
                    className: "rounded-full bg-brand text-brand-foreground hover:bg-brand/90",
                    children: t("header.auth.register", "Register")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Sheet, { children: [
                /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: `md:hidden ${transparent ? "text-white hover:bg-white/15 hover:text-white" : ""}`,
                    children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
                  }
                ) }),
                /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "w-72", children: /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-3", children: [
                  visibleCats.map((c) => {
                    const isActive = activeCat === c.key;
                    return /* @__PURE__ */ jsxs(
                      Button,
                      {
                        variant: isActive ? "default" : "outline",
                        className: `justify-start gap-2 rounded-full ${isActive ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""}`,
                        onClick: () => goPost(c.key),
                        children: [
                          /* @__PURE__ */ jsx(c.icon, { className: "h-4 w-4" }),
                          catLabel(c)
                        ]
                      },
                      c.key
                    );
                  }),
                  !user && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        onClick: () => navigate({ to: "/auth", search: { mode: "login" } }),
                        children: t("header.auth.login", "Login")
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        onClick: () => navigate({ to: "/auth", search: { mode: "register" } }),
                        className: "rounded-full bg-brand text-brand-foreground",
                        children: t("header.auth.register", "Register")
                      }
                    )
                  ] })
                ] }) })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function Footer() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsxs("footer", { className: "border-t bg-brand text-brand-foreground", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8 items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsx(BrandLogo, { className: "text-3xl text-brand-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm opacity-80", children: t("footer.tagline", "Connecting talent with opportunity, one role at a time.") })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 text-sm font-semibold mt-0", children: t("footer.candidates", "For candidates") }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm opacity-80", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/search", children: t("footer.browseJobs", "Browse jobs") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/post-announcement", children: t("footer.createOffer", "Create talent offer") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 text-sm font-semibold mt-0", children: t("footer.employers", "For employers") }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm opacity-80", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/post-job", children: t("footer.postJob", "Post a job") }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: t("footer.browseOffers", "Browse talent offers") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 text-sm font-semibold mt-0", children: t("footer.about", "About") }),
        /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm leading-relaxed opacity-80", children: t("footer.about.desc", "Mihna is an Algerian job platform connecting talent with opportunity across freelance, full-time, and contract roles.") }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm opacity-80", children: /* @__PURE__ */ jsx("li", { children: t("footer.privacy", "Privacy") }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start lg:items-end", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 text-sm font-semibold mt-0 w-full text-start", children: t("footer.contact", "Contact") }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm opacity-80", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: "lounesamrane88@gmail.com" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: "+213 (6) 97 28 30 39" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-white/10 py-5 text-center text-xs opacity-70", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Mihna. ",
      t("footer.rights", "All rights reserved.")
    ] })
  ] });
}
export {
  Avatar as A,
  Button as B,
  Footer as F,
  Header as H,
  TooltipProvider as T,
  AvatarImage as a,
  AvatarFallback as b,
  applyTheme as c,
  applicationService as d,
  Tooltip as e,
  TooltipTrigger as f,
  getTheme as g,
  TooltipContent as h,
  cn as i,
  buttonVariants as j,
  announcementService as k,
  BrandLogo as l,
  jobService as m,
  statsService as s
};
