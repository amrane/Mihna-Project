import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { i as cn, H as Header, B as Button, F as Footer, l as BrandLogo } from "./Footer-CIdxXT3C.js";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, UploadCloud, ArrowLeft, ArrowRight, UserCircle2, Building2, EyeOff, Eye } from "lucide-react";
import { I as Input } from "./input-BAq2Xo4A.js";
import { L as Label } from "./label-Dv_tdSeV.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_bkB_S9.js";
import { g as Route, u as useAuth, a as useI18n } from "./router-Bte9I49t.js";
import { toast } from "sonner";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName),
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const ALGERIAN_WILAYAS = ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", "Ghardaia", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Beni Abbes", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"];
function AuthPage() {
  const {
    mode
  } = Route.useSearch();
  const navigate = useNavigate();
  const {
    login,
    register
  } = useAuth();
  const {
    t,
    locale
  } = useI18n();
  const [accountType, setAccountType] = useState("candidate");
  const [showPw, setShowPw] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
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
    gender: ""
  });
  const [liveStats, setLiveStats] = useState({
    jobs: 0,
    candidates: 0,
    companies: 0
  });
  const [onboardingStep, setOnboardingStep] = useState("terms");
  const [onboarding, setOnboarding] = useState({
    cvFileName: "",
    cvDataUrl: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    website: "",
    facebook: "",
    acceptedRules: false
  });
  const isLogin = mode === "login";
  useEffect(() => {
    fetch("/api/stats/counts").then((r) => r.ok && r.json()).then((d) => d && setLiveStats(d)).catch(() => {
    });
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
    if (value === 0) return {
      label: "",
      color: "bg-transparent"
    };
    if (value < 30) return {
      label: "Weak",
      color: "bg-red-500"
    };
    if (value < 60) return {
      label: "Fair",
      color: "bg-yellow-500"
    };
    if (value < 80) return {
      label: "Good",
      color: "bg-lime-500"
    };
    return {
      label: "Strong",
      color: "bg-green-500"
    };
  }, [passwordStrength]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!form.email || !form.password) return toast.error("Enter email and password");
      try {
        await login(form.email, form.password);
        toast.success("Welcome back!");
        navigate({
          to: "/"
        });
      } catch (err) {
        const error = err;
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
    if (!form.firstName || !form.lastName || !form.email || !form.password) return toast.error("Please fill required fields");
    try {
      const emailRes = await fetch(`/api/auth/exists?email=${encodeURIComponent(form.email)}`);
      if (!emailRes.ok) throw new Error("Failed to validate email");
      const data = await emailRes.json();
      if (data.exists) {
        toast.error("This email is already registered. Try logging in.");
        return;
      }
    } catch {
    }
    if (accountType === "candidate" && !form.workPreference) return toast.error("Choose what kind of work you want");
    if (accountType === "employer" && !form.companyName) return toast.error("Enter your company name");
    if (form.age && (Number(form.age) < 18 || Number(form.age) > 99)) return toast.error("Age must be between 18 and 99");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (passwordStrength < 50) return toast.error("Password is too weak. Make it stronger!");
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    setPendingUser({
      fullName,
      username: `${form.firstName}.${form.lastName}`.toLowerCase().replace(/\s+/g, "") || form.email.split("@")[0],
      email: form.email,
      location: form.location,
      age: form.age ? Number(form.age) : void 0,
      gender: form.gender,
      workPreference: accountType === "candidate" ? form.workPreference : void 0,
      companyName: accountType === "employer" ? form.companyName : void 0,
      accountType
    });
    setOnboardingStep("terms");
    setOnboarding((prev) => ({
      ...prev,
      acceptedRules: false
    }));
    toast.success("Account details saved. Accept privacy terms to continue.");
  };
  const handlePhoneChange = (value) => {
    setOnboarding((prev) => ({
      ...prev,
      phone: value,
      whatsapp: prev.whatsapp === "" || prev.whatsapp === prev.phone ? value : prev.whatsapp
    }));
  };
  const handleCvChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setOnboarding((prev) => ({
          ...prev,
          cvFileName: file.name,
          cvDataUrl: result
        }));
        toast.success("CV selected");
      }
    };
    reader.readAsDataURL(file);
  };
  const PREFIXES = {
    phone: "+213 ",
    telegram: "@",
    facebook: "@",
    website: "https://"
  };
  const handleFocus = (field) => {
    const val = onboarding[field];
    const prefix = PREFIXES[field];
    if (!val && prefix) {
      setOnboarding((prev) => ({
        ...prev,
        [field]: prefix
      }));
    }
  };
  const cleanValue = (field, val) => {
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
      await register({
        ...pendingUser,
        phone: cleanValue("phone", onboarding.phone),
        whatsapp: cleanValue("whatsapp", onboarding.whatsapp),
        telegram: cleanValue("telegram", onboarding.telegram),
        website: cleanValue("website", onboarding.website),
        facebook: cleanValue("facebook", onboarding.facebook),
        cvFileName: onboarding.cvFileName,
        cvDataUrl: onboarding.cvDataUrl,
        acceptedRules: true,
        acceptedRulesAt: (/* @__PURE__ */ new Date()).toISOString()
      }, form.password);
      toast.success("Account created!");
      navigate({
        to: "/"
      });
    } catch (err) {
      console.error("Registration error:", err);
      const error = err;
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
      return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
        /* @__PURE__ */ jsx(Header, {}),
        /* @__PURE__ */ jsx("main", { className: "mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl items-center px-4 py-10 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: t("auth.privacy.title", "Privacy terms") }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("auth.privacy.intro", "Before you finish your profile, please review and accept our privacy terms and website policies. This ensures your account is created with the right consent.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-7 space-y-4 rounded-3xl border bg-slate-50 p-5 text-sm text-slate-700", children: [
            /* @__PURE__ */ jsx("p", { children: t("auth.privacy.p1", "We collect basic account information to connect you with employers. Your phone number and contact links remain private until you choose to share them in your profile. We do not sell your personal data, and we keep your information secure.") }),
            /* @__PURE__ */ jsx("p", { children: t("auth.privacy.p2", "By accepting, you consent to our terms of use, privacy policy, and the responsible use of this platform. You agree that all profile information is accurate.") }),
            /* @__PURE__ */ jsx("p", { children: t("auth.privacy.p3", "You can skip optional details later, but accepting these terms is required to continue to the profile setup step.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-7 space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-3 rounded-2xl border bg-background p-4", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked: onboarding.acceptedRules, onCheckedChange: (checked) => setOnboarding({
                ...onboarding,
                acceptedRules: checked === true
              }), className: "mt-0.5" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm leading-relaxed text-muted-foreground", children: t("auth.privacy.accept", "I have read and accept the website privacy terms, data usage policy, and terms of service.") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3 sm:flex-row sm:justify-end [dir=rtl]:sm:justify-start", children: /* @__PURE__ */ jsx(Button, { type: "button", onClick: () => setOnboardingStep("profile"), disabled: !onboarding.acceptedRules, className: "mt-2 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: t("auth.privacy.continue", "Continue to profile setup") }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Footer, {})
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl items-center px-4 py-10 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: t("auth.finish.title", "Finish your profile") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: accountType === "employer" ? t("auth.finish.desc.employer", "Add a company introduction and contact details so candidates can learn about your business. You can skip any of these fields.") : t("auth.finish.desc", "Add your CV and optional contact details so employers can reach you faster. You can skip any of these fields.") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-7 space-y-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/60 px-5 py-8 text-center transition hover:border-brand", children: [
            /* @__PURE__ */ jsx(UploadCloud, { className: "h-8 w-8 text-brand" }),
            /* @__PURE__ */ jsx("span", { className: "mt-3 text-sm font-semibold", children: onboarding.cvFileName || (accountType === "employer" ? t("auth.finish.uploadCompanyIntro", "Upload company introduction") : t("auth.finish.uploadCv", "Upload CV")) }),
            /* @__PURE__ */ jsx("span", { className: "mt-1 text-xs text-muted-foreground", children: accountType === "employer" ? t("auth.finish.cvHint.employer", "PDF, DOC, or DOCX. Tell candidates about your company.") : t("auth.finish.cvHint", "PDF, DOC, or DOCX. You can skip this for now.") }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", className: "hidden", onChange: handleCvChange })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsx(Input, { placeholder: "+213 5xx xxx xxx", value: onboarding.phone, onFocus: () => handleFocus("phone"), onChange: (e) => {
              const val = e.target.value;
              const digits = val.replace(/\D/g, "").replace(/^213/, "");
              if (digits.length > 9) return;
              handlePhoneChange(val);
            } }),
            /* @__PURE__ */ jsx(Input, { placeholder: "WhatsApp (same as phone by default)", value: onboarding.whatsapp, onChange: (e) => setOnboarding({
              ...onboarding,
              whatsapp: e.target.value
            }) }),
            /* @__PURE__ */ jsx(Input, { placeholder: "@username for Telegram", value: onboarding.telegram, onFocus: () => handleFocus("telegram"), onChange: (e) => setOnboarding({
              ...onboarding,
              telegram: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(Input, { placeholder: "https://example.com", value: onboarding.website, onFocus: () => handleFocus("website"), onChange: (e) => setOnboarding({
              ...onboarding,
              website: e.target.value
            }) }),
            /* @__PURE__ */ jsx(Input, { placeholder: "@username", value: onboarding.facebook, onFocus: () => handleFocus("facebook"), onChange: (e) => setOnboarding({
              ...onboarding,
              facebook: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: completeRegistration, className: "rounded-xl", children: t("auth.finish.skip", "Skip optional details and enter") }),
          /* @__PURE__ */ jsxs(Button, { type: "button", onClick: completeRegistration, className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: [
            t("auth.finish.save", "Save and enter"),
            " ",
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl gap-0 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-md", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: isLogin ? t("auth.login.title", "Log in to your Account.") : accountType === "employer" ? t("auth.register.title.employer", "Create a business account.") : t("auth.register.title", "Create account.") }),
        !isLogin && accountType === "employer" && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("auth.register.subtitle.employer", "Post jobs and connect with talented professionals looking for their next opportunity.") }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
          isLogin ? t("auth.noAccount", "Don't have an account? ") : t("auth.hasAccount", "Already have an account? "),
          /* @__PURE__ */ jsx(Link, { to: "/auth", search: {
            mode: isLogin ? "register" : "login"
          }, className: "font-semibold text-brand", children: isLogin ? t("auth.signUp", "Sign up") : t("auth.logIn", "Log in") })
        ] }),
        !isLogin && /* @__PURE__ */ jsx("div", { className: "mt-6 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1", children: ["candidate", "employer"].map((type) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setAccountType(type), className: `flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${accountType === type ? "bg-brand text-brand-foreground shadow" : "text-muted-foreground"}`, children: [
          type === "candidate" ? /* @__PURE__ */ jsx(UserCircle2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }),
          type === "candidate" ? t("common.candidate", "Candidate") : t("common.employer", "Employer")
        ] }, type)) }),
        /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-6 space-y-3", children: [
          !isLogin && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "sr-only", children: t("auth.firstName", "First name") }),
                /* @__PURE__ */ jsx(Input, { placeholder: t("auth.firstName", "First name"), value: form.firstName, onChange: (e) => setForm({
                  ...form,
                  firstName: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "sr-only", children: t("auth.lastName", "Last name") }),
                /* @__PURE__ */ jsx(Input, { placeholder: t("auth.lastName", "Last name"), value: form.lastName, onChange: (e) => setForm({
                  ...form,
                  lastName: e.target.value
                }) })
              ] })
            ] }),
            accountType === "candidate" ? /* @__PURE__ */ jsxs(Select, { value: form.workPreference, onValueChange: (v) => setForm({
              ...form,
              workPreference: v
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("auth.workPreference", "Work preference") }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "freelance", children: t("type.freelance", "Freelancer") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "full-time", children: t("type.full-time", "Full-time") }),
                /* @__PURE__ */ jsx(SelectItem, { value: "both", children: t("type.both", "Both") })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "sr-only", children: t("auth.companyName", "Company name") }),
              /* @__PURE__ */ jsx(Input, { placeholder: t("auth.companyName", "Company name"), value: form.companyName, onChange: (e) => setForm({
                ...form,
                companyName: e.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Input, { type: "email", placeholder: t("auth.email", "Email address"), value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Input, { type: showPw ? "text" : "password", placeholder: t("auth.password", "Password"), value: form.password, onChange: (e) => setForm({
              ...form,
              password: e.target.value
            }) }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowPw(!showPw), className: `absolute ${locale === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground`, children: showPw ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
          ] }),
          !isLogin && form.password && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: t("auth.passwordStrength", "Password strength") }),
              /* @__PURE__ */ jsx("span", { className: `font-medium ${passwordStrength < 30 ? "text-red-500" : passwordStrength < 60 ? "text-yellow-500" : passwordStrength < 80 ? "text-lime-500" : "text-green-500"}`, children: strengthInfo.label })
            ] }),
            /* @__PURE__ */ jsx(Progress, { value: passwordStrength, className: "h-2", indicatorClassName: strengthInfo.color }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("auth.passwordHint", "Minimum 8 characters. Mix uppercase, lowercase, numbers, and symbols.") })
          ] }),
          !isLogin && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Input, { type: "password", placeholder: t("auth.confirmPassword", "Confirm password"), value: form.confirm, onChange: (e) => setForm({
              ...form,
              confirm: e.target.value
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxs(Select, { value: form.location, onValueChange: (v) => setForm({
                ...form,
                location: v
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("auth.wilaya", "Wilaya") }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: ALGERIAN_WILAYAS.map((wilaya, index) => /* @__PURE__ */ jsxs(SelectItem, { value: wilaya, children: [
                  /* @__PURE__ */ jsx("span", { className: "tabular-nums text-muted-foreground", children: String(index + 1).padStart(2, "0") }),
                  " ",
                  wilaya
                ] }, wilaya)) })
              ] }),
              /* @__PURE__ */ jsx(Input, { placeholder: t("auth.age", "Age"), type: "number", min: 18, max: 99, value: form.age, onChange: (e) => setForm({
                ...form,
                age: e.target.value
              }) }),
              /* @__PURE__ */ jsxs(Select, { value: form.gender, onValueChange: (v) => setForm({
                ...form,
                gender: v
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("auth.gender", "Gender") }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "male", children: t("common.male", "Male") }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "female", children: t("common.female", "Female") })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", className: "mt-2 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90", children: [
            isLogin ? t("auth.logIn", "Log in") : t("auth.register.title", "Create account.").replace(".", ""),
            " ",
            locale === "ar" ? /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative hidden overflow-hidden rounded-3xl bg-brand text-brand-foreground lg:block", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-30", children: Array.from({
          length: 16
        }).map((_, i) => /* @__PURE__ */ jsx("div", { className: i % 3 === 0 ? "bg-white/20" : "bg-white/5" }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col justify-between p-10", children: [
          /* @__PURE__ */ jsx(BrandLogo, { link: false, className: "text-3xl text-brand-foreground" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold leading-tight", children: t("auth.side.title", "Over {count} candidates\nwaiting for great employers.", {
              count: liveStats.candidates.toLocaleString()
            }).split("\n").map((line, index) => /* @__PURE__ */ jsxs("span", { children: [
              index > 0 && /* @__PURE__ */ jsx("br", {}),
              line
            ] }, line)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/10 p-4 backdrop-blur", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: liveStats.jobs.toLocaleString() }),
                /* @__PURE__ */ jsx("div", { className: "text-xs opacity-80", children: t("auth.side.liveJobs", "Live jobs") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/10 p-4 backdrop-blur", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: liveStats.companies.toLocaleString() }),
                /* @__PURE__ */ jsx("div", { className: "text-xs opacity-80", children: t("auth.side.companies", "Companies") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/10 p-4 backdrop-blur", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: liveStats.candidates.toLocaleString() }),
                /* @__PURE__ */ jsx("div", { className: "text-xs opacity-80", children: t("auth.side.newJobs", "Candidates") })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AuthPage as component
};
