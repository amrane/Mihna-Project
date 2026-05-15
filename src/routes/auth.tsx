import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Building2, UserCircle2, UploadCloud } from "lucide-react";
import { useAuth, type MihnaUser } from "@/lib/auth";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const ALGERIAN_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar",
  "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
  "Djelfa", "Jijel", "Setif", "Saida", "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma",
  "Constantine", "Medea", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent",
  "Ghardaia", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Beni Abbes",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];
import { useI18n } from "@/lib/i18n";

interface S {
  mode?: "login" | "register";
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): S => ({
    mode: (s.mode as "login" | "register") || "register",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t, locale } = useI18n();

  const [accountType, setAccountType] = useState<"candidate" | "employer">("candidate");
  const [showPw, setShowPw] = useState(false);
  const [pendingUser, setPendingUser] = useState<MihnaUser | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    workPreference: "",
    companyName: "",
    email: "",
    password: "",
    confirm: "",
    location: "",
    age: "",
    gender: "",
  });
  const [liveStats, setLiveStats] = useState({ jobs: 0, candidates: 0, companies: 0 });
  const [onboardingStep, setOnboardingStep] = useState<"terms" | "profile">("terms");
  const [onboarding, setOnboarding] = useState({
    cvFileName: "",
    cvDataUrl: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    website: "",
    facebook: "",
    acceptedRules: false,
  });

  const isLogin = mode === "login";

  useEffect(() => {
    fetch("/api/stats/counts").then((r) => r.ok && r.json()).then((d) => d && setLiveStats(d)).catch(() => {});
  }, []);

  const passwordStrength = useMemo(() => {
    const pw = form.password;
    if (!pw) return 0;

    let score = 0;

    if (pw.length >= 8) score += 25;
    if (pw.length >= 12) score += 10;
    if (pw.length >= 16) score += 5;

    if (/[a-z]/.test(pw)) score += 15;
    if (/[A-Z]/.test(pw)) score += 15; 
    if (/[0-9]/.test(pw)) score += 15; 
    if (/[^a-zA-Z0-9]/.test(pw)) score += 15; 

    return Math.min(score, 100);
  }, [form.password]);

  const strengthInfo = useMemo(() => {
    const value = passwordStrength;
    if (value === 0) return { label: "", color: "bg-transparent" };
    if (value < 30) return { label: "Weak", color: "bg-red-500" };
    if (value < 60) return { label: "Fair", color: "bg-yellow-500" };
    if (value < 80) return { label: "Good", color: "bg-lime-500" };
    return { label: "Strong", color: "bg-green-500" };
  }, [passwordStrength]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!form.email || !form.password) return toast.error("Enter email and password");
      try {
        await login(form.email, form.password);
        toast.success("Welcome back!");
        navigate({ to: "/" });
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        const code = error.code;
        if (code === "INVALID_CREDENTIALS") {
          toast.error("Incorrect email or password.");
        } else if (code === "VALIDATION_ERROR") {
          toast.error(error.message ?? "Enter a valid email and password.");
        } else {
          toast.error("Login failed. Please check your credentials and try again.");
        }
      }
      return;
    }
    if (!form.firstName || !form.lastName || !form.email || !form.password)
      return toast.error("Please fill required fields");

    try {
      const emailRes = await fetch(
        `/api/auth/exists?email=${encodeURIComponent(form.email)}`,
      );
      if (!emailRes.ok) throw new Error("Failed to validate email");
      const data = (await emailRes.json()) as { exists: boolean };
      if (data.exists) {
        toast.error("This email is already registered. Try logging in.");
        return;
      }
    } catch {
    }

    if (accountType === "candidate" && !form.workPreference)
      return toast.error("Choose what kind of work you want");
    if (accountType === "employer" && !form.companyName)
      return toast.error("Enter your company name");
    if (form.age && (Number(form.age) < 18 || Number(form.age) > 99))
      return toast.error("Age must be between 18 and 99");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (passwordStrength < 50) return toast.error("Password is too weak. Make it stronger!");
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    setPendingUser({
      fullName,
      username:
        `${form.firstName}.${form.lastName}`.toLowerCase().replace(/\s+/g, "") ||
        form.email.split("@")[0],
      email: form.email,
      location: form.location,
      age: form.age ? Number(form.age) : undefined,
      gender: form.gender,
      workPreference:
        accountType === "candidate"
          ? (form.workPreference as "freelance" | "full-time" | "both")
          : undefined,
      companyName: accountType === "employer" ? form.companyName : undefined,
      accountType,
    });
    setOnboardingStep("terms");
    setOnboarding((prev) => ({ ...prev, acceptedRules: false }));
    toast.success("Account details saved. Accept privacy terms to continue.");
  };

  const handlePhoneChange = (value: string) => {
    setOnboarding((prev) => ({
      ...prev,
      phone: value,
      whatsapp: prev.whatsapp === "" || prev.whatsapp === prev.phone ? value : prev.whatsapp,
    }));
  };

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setOnboarding((prev) => ({
          ...prev,
          cvFileName: file.name,
          cvDataUrl: result,
        }));
        toast.success("CV selected");
      }
    };
    reader.readAsDataURL(file);
  };

  const PREFIXES: Record<string, string> = { phone: "+213 ", telegram: "@", facebook: "@", website: "https://" };

  const handleFocus = (field: string) => {
    const val = onboarding[field as keyof typeof onboarding] as string;
    const prefix = PREFIXES[field];
    if (!val && prefix) {
      setOnboarding((prev) => ({ ...prev, [field]: prefix }));
    }
  };

  const cleanValue = (field: string, val: string) => {
    const prefix = PREFIXES[field];
    if (!prefix) return val;
    if (val === prefix || val.trim() === prefix.trim()) return "";
    return val;
  };

  const completeRegistration = async () => {
    if (!pendingUser) return;
    if (!onboarding.acceptedRules) {
      toast.error("You must accept the privacy terms before entering");
      return;
    }

    try {
      await register(
        {
          ...pendingUser,
          phone: cleanValue("phone", onboarding.phone),
          whatsapp: cleanValue("whatsapp", onboarding.whatsapp),
          telegram: cleanValue("telegram", onboarding.telegram),
          website: cleanValue("website", onboarding.website),
          facebook: cleanValue("facebook", onboarding.facebook),
          cvFileName: onboarding.cvFileName,
          cvDataUrl: onboarding.cvDataUrl,
          acceptedRules: true,
          acceptedRulesAt: new Date().toISOString(),
        },
        form.password,
      );
      toast.success("Account created!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const error = err as { code?: string; message?: string };
      const code = error.code;

      if (code === "EMAIL_IN_USE") {
        toast.error("This email is already registered. Try logging in.");
      } else if (code === "WEAK_PASSWORD") {
        toast.error("Password is too weak.");
      } else if (code === "VALIDATION_ERROR") {
        toast.error(error.message ?? "Please check the highlighted information.");
      } else {
        toast.error(`Registration failed: ${error.message ?? "Please try again."}`);
      }
    }
  };

  if (pendingUser) {
    if (onboardingStep === "terms") {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl items-center px-4 py-10 sm:px-6">
            <div className="w-full rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
              <div>
                <h1 className="text-3xl font-bold">{t("auth.privacy.title", "Privacy terms")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(
                    "auth.privacy.intro",
                    "Before you finish your profile, please review and accept our privacy terms and website policies. This ensures your account is created with the right consent.",
                  )}
                </p>
              </div>

              <div className="mt-7 space-y-4 rounded-3xl border bg-slate-50 p-5 text-sm text-slate-700">
                <p>
                  {t(
                    "auth.privacy.p1",
                    "We collect basic account information to connect you with employers. Your phone number and contact links remain private until you choose to share them in your profile. We do not sell your personal data, and we keep your information secure.",
                  )}
                </p>
                <p>
                  {t(
                    "auth.privacy.p2",
                    "By accepting, you consent to our terms of use, privacy policy, and the responsible use of this platform. You agree that all profile information is accurate.",
                  )}
                </p>
                <p>
                  {t(
                    "auth.privacy.p3",
                    "You can skip optional details later, but accepting these terms is required to continue to the profile setup step.",
                  )}
                </p>
              </div>

              <div className="mt-7 space-y-4">
                <label className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                  <Checkbox
                    checked={onboarding.acceptedRules}
                    onCheckedChange={(checked) =>
                      setOnboarding({ ...onboarding, acceptedRules: checked === true })
                    }
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {t(
                      "auth.privacy.accept",
                      "I have read and accept the website privacy terms, data usage policy, and terms of service.",
                    )}
                  </span>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end [dir=rtl]:sm:justify-start">
                  <Button
                    type="button"
                    onClick={() => setOnboardingStep("profile")}
                    disabled={!onboarding.acceptedRules}
                    className="mt-2 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    {t("auth.privacy.continue", "Continue to profile setup")}
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl items-center px-4 py-10 sm:px-6">
          <div className="w-full rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
            <div>
              <h1 className="text-3xl font-bold">{t("auth.finish.title", "Finish your profile")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {accountType === "employer"
                  ? t("auth.finish.desc.employer", "Add a company introduction and contact details so candidates can learn about your business. You can skip any of these fields.")
                  : t("auth.finish.desc", "Add your CV and optional contact details so employers can reach you faster. You can skip any of these fields.")}
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/60 px-5 py-8 text-center transition hover:border-brand">
                <UploadCloud className="h-8 w-8 text-brand" />
                <span className="mt-3 text-sm font-semibold">
                  {onboarding.cvFileName || (accountType === "employer" ? t("auth.finish.uploadCompanyIntro", "Upload company introduction") : t("auth.finish.uploadCv", "Upload CV"))}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {accountType === "employer"
                    ? t("auth.finish.cvHint.employer", "PDF, DOC, or DOCX. Tell candidates about your company.")
                    : t("auth.finish.cvHint", "PDF, DOC, or DOCX. You can skip this for now.")}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleCvChange}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  placeholder="+213 5xx xxx xxx"
                  value={onboarding.phone}
                  onFocus={() => handleFocus("phone")}
                  onChange={(e) => {
                    const val = e.target.value;
                    const digits = val.replace(/\D/g, "").replace(/^213/, "");
                    if (digits.length > 9) return;
                    handlePhoneChange(val);
                  }}
                />
                <Input
                  placeholder="WhatsApp (same as phone by default)"
                  value={onboarding.whatsapp}
                  onChange={(e) => setOnboarding({ ...onboarding, whatsapp: e.target.value })}
                />
                <Input
                  placeholder="@username for Telegram"
                  value={onboarding.telegram}
                  onFocus={() => handleFocus("telegram")}
                  onChange={(e) => setOnboarding({ ...onboarding, telegram: e.target.value })}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="https://example.com"
                  value={onboarding.website}
                  onFocus={() => handleFocus("website")}
                  onChange={(e) => setOnboarding({ ...onboarding, website: e.target.value })}
                />
                <Input
                  placeholder="@username"
                  value={onboarding.facebook}
                  onFocus={() => handleFocus("facebook")}
                  onChange={(e) => setOnboarding({ ...onboarding, facebook: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={completeRegistration}
                className="rounded-xl"
              >
                {t("auth.finish.skip", "Skip optional details and enter")}
              </Button>
              <Button
                type="button"
                onClick={completeRegistration}
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {t("auth.finish.save", "Save and enter")} {locale === "ar" ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl gap-0 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="flex items-center">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold">
              {isLogin
                ? t("auth.login.title", "Log in to your Account.")
                : accountType === "employer"
                  ? t("auth.register.title.employer", "Create a business account.")
                  : t("auth.register.title", "Create account.")}
            </h1>
            {!isLogin && accountType === "employer" && (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("auth.register.subtitle.employer", "Post jobs and connect with talented professionals looking for their next opportunity.")}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin ? t("auth.noAccount", "Don't have an account? ") : t("auth.hasAccount", "Already have an account? ")}
              <Link
                to="/auth"
                search={{ mode: isLogin ? "register" : "login" } as never}
                className="font-semibold text-brand"
              >
                {isLogin ? t("auth.signUp", "Sign up") : t("auth.logIn", "Log in")}
              </Link>
            </p>

            {!isLogin && (
              <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
                {(["candidate", "employer"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${accountType === type ? "bg-brand text-brand-foreground shadow" : "text-muted-foreground"}`}
                  >
                    {type === "candidate" ? (
                      <UserCircle2 className="h-4 w-4" />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )}
                    {type === "candidate"
                      ? t("common.candidate", "Candidate")
                      : t("common.employer", "Employer")}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="sr-only">{t("auth.firstName", "First name")}</Label>
                      <Input
                        placeholder={t("auth.firstName", "First name")}
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="sr-only">{t("auth.lastName", "Last name")}</Label>
                      <Input
                        placeholder={t("auth.lastName", "Last name")}
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  {accountType === "candidate" ? (
                    <Select
                      value={form.workPreference}
                      onValueChange={(v) => setForm({ ...form, workPreference: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("auth.workPreference", "Work preference")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freelance">{t("type.freelance", "Freelancer")}</SelectItem>
                        <SelectItem value="full-time">{t("type.full-time", "Full-time")}</SelectItem>
                        <SelectItem value="both">{t("type.both", "Both")}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      <Label className="sr-only">{t("auth.companyName", "Company name")}</Label>
                      <Input
                        placeholder={t("auth.companyName", "Company name")}
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
              <Input
                type="email"
                placeholder={t("auth.email", "Email address")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder={t("auth.password", "Password")}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={`absolute ${locale === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground`}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && form.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("auth.passwordStrength", "Password strength")}</span>
                    <span
                      className={`font-medium ${
                        passwordStrength < 30
                          ? "text-red-500"
                          : passwordStrength < 60
                            ? "text-yellow-500"
                            : passwordStrength < 80
                              ? "text-lime-500"
                              : "text-green-500"
                      }`}
                    >
                      {strengthInfo.label}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    className="h-2"
                    indicatorClassName={strengthInfo.color}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "auth.passwordHint",
                      "Minimum 8 characters. Mix uppercase, lowercase, numbers, and symbols.",
                    )}
                  </p>
                </div>
              )}
              {!isLogin && (
                <>
                  <Input
                    type="password"
                    placeholder={t("auth.confirmPassword", "Confirm password")}
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Select
                      value={form.location}
                      onValueChange={(v) => setForm({ ...form, location: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("auth.wilaya", "Wilaya")} />
                      </SelectTrigger>
                      <SelectContent>
                        {ALGERIAN_WILAYAS.map((wilaya, index) => (
                          <SelectItem key={wilaya} value={wilaya}>
                            <span className="tabular-nums text-muted-foreground">
                              {String(index + 1).padStart(2, "0")}
                            </span>{" "}
                            {wilaya}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t("auth.age", "Age")}
                      type="number"
                      min={18}
                      max={99}
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                    <Select
                      value={form.gender}
                      onValueChange={(v) => setForm({ ...form, gender: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("auth.gender", "Gender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("common.male", "Male")}</SelectItem>
                        <SelectItem value="female">{t("common.female", "Female")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="mt-2 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {isLogin ? t("auth.logIn", "Log in") : t("auth.register.title", "Create account.").replace(".", "")}{" "}
                {locale === "ar" ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-3xl bg-brand text-brand-foreground lg:block">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={i % 3 === 0 ? "bg-white/20" : "bg-white/5"} />
            ))}
          </div>
          <div className="relative flex h-full flex-col justify-between p-10">
            <BrandLogo link={false} className="text-3xl text-brand-foreground" />
            <div>
              <div className="text-3xl font-bold leading-tight">
                {t("auth.side.title", "Over {count} candidates\nwaiting for great employers.", {
                  count: liveStats.candidates.toLocaleString(),
                })
                  .split("\n")
                  .map((line, index) => (
                    <span key={line}>
                      {index > 0 && <br />}
                      {line}
                    </span>
                  ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-bold">{liveStats.jobs.toLocaleString()}</div>
                  <div className="text-xs opacity-80">{t("auth.side.liveJobs", "Live jobs")}</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-bold">{liveStats.companies.toLocaleString()}</div>
                  <div className="text-xs opacity-80">{t("auth.side.companies", "Companies")}</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-bold">{liveStats.candidates.toLocaleString()}</div>
                  <div className="text-xs opacity-80">{t("auth.side.newJobs", "Candidates")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
