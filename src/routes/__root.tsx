import { Link, Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider, useI18n } from "@/lib/i18n";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold">{t("notfound.title", "Page not found")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("notfound.desc", "The page you're looking for doesn't exist.")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90"
          >
            {t("notfound.home", "Go home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mihna - Find Your Dream Job Today" },
      {
        name: "description",
        content:
          "Mihna connects talent with opportunity. Browse freelance, full-time, and project-based jobs across industries.",
      },
    ],
    links: [
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Ubuntu:wght@400;500;700&family=Inter:wght@400;500;600;700&family=Cairo:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <I18nProvider>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </I18nProvider>
  ),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
