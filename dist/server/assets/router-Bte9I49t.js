import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Outlet, Link, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter, useRouter } from "@tanstack/react-router";
import { Toaster as Toaster$1 } from "sonner";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const defaultAvatar = "data:image/png;base64,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";
const API_BASE_URL = "/api".replace(/\/$/, "");
const AUTH_TOKEN_KEY = "mihna_token";
class ApiError extends Error {
  status;
  code;
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
function setStoredAuthToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = options.auth ? getStoredAuthToken() : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && options.body !== void 0) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === void 0 ? void 0 : isFormData ? options.body : JSON.stringify(options.body)
  });
  const raw = await response.text();
  const payload = raw ? JSON.parse(raw) : null;
  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || "Something went wrong while contacting the server.";
    const code = payload?.error?.code || payload?.code;
    throw new ApiError(message, response.status, code);
  }
  return payload;
}
const Ctx = createContext(null);
const USER_KEY = "mihna_user";
const DEFAULT_PROFILE_PHOTO = defaultAvatar;
function normalizeUser(user) {
  if (!user || !user.email) return null;
  const fullName = user.fullName || user.displayName || user.username || user.email.split("@")[0];
  const avatar = user.avatar || user.photoURL || DEFAULT_PROFILE_PHOTO;
  const accountType = user.accountType || (user.role === "employer" ? "employer" : "candidate");
  return {
    ...user,
    id: user.id || user.uid,
    uid: user.uid || user.id,
    fullName,
    displayName: user.displayName || fullName,
    username: user.username || user.email.split("@")[0],
    avatar,
    photoURL: user.photoURL || avatar,
    savedJobIds: Array.isArray(user.savedJobIds) ? user.savedJobIds : [],
    appliedJobIds: Array.isArray(user.appliedJobIds) ? user.appliedJobIds : [],
    accountType,
    role: user.role || (accountType === "employer" ? "employer" : "jobseeker"),
    email: user.email
  };
}
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const persist = (nextUser, token) => {
    const normalized = normalizeUser(nextUser);
    setUser(normalized);
    if (typeof window !== "undefined") {
      if (normalized) {
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    }
    if (token !== void 0) {
      setStoredAuthToken(token);
    }
  };
  const refreshUser = async () => {
    const response = await apiRequest("/auth/me", { auth: true });
    persist(response.user);
  };
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawUser = localStorage.getItem(USER_KEY);
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        setUser(normalizeUser(parsed));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    const token = getStoredAuthToken();
    if (!token) return;
    let active = true;
    const hydrate = async () => {
      try {
        const response = await apiRequest("/auth/me", { auth: true });
        if (!active) return;
        persist(response.user);
      } catch {
        if (!active) return;
        persist(null, null);
      }
    };
    hydrate();
    return () => {
      active = false;
    };
  }, []);
  return /* @__PURE__ */ jsx(
    Ctx.Provider,
    {
      value: {
        user,
        login: async (email, password) => {
          const response = await apiRequest("/auth/login", {
            method: "POST",
            body: { email, password }
          });
          persist(response.user, response.token);
        },
        register: async (newUser, password) => {
          const response = await apiRequest("/auth/register", {
            method: "POST",
            body: {
              ...newUser,
              password,
              avatar: newUser.avatar || DEFAULT_PROFILE_PHOTO
            }
          });
          persist(response.user, response.token);
        },
        updateUser: async (updates) => {
          if (!user) return;
          const optimisticUser = normalizeUser({
            ...user,
            ...updates
          });
          if (optimisticUser) {
            persist(optimisticUser);
          }
          try {
            const response = await apiRequest("/users/me", {
              method: "PATCH",
              auth: true,
              body: updates
            });
            persist(response.user);
          } catch (error) {
            persist(user);
            throw error;
          }
        },
        refreshUser,
        toggleSavedJob: async (jobId) => {
          const response = await apiRequest(
            `/jobs/${jobId}/save`,
            {
              method: "POST",
              auth: true
            }
          );
          persist(response.user);
          return { saved: response.saved };
        },
        applyToJob: async (jobId, details) => {
          const response = await apiRequest(`/jobs/${jobId}/apply`, {
            method: "POST",
            auth: true,
            body: details
          });
          persist(response.user);
          return {
            applied: response.applied,
            alreadyApplied: response.alreadyApplied
          };
        },
        logout: () => persist(null, null)
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(Ctx);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
const STORAGE_KEY = "mihna-locale";
const en = {
  "app.title": "Mihna - Find Your Dream Job Today",
  "app.description": "Mihna connects talent with opportunity. Browse freelance, full-time, and project-based jobs across industries.",
  "common.loading": "Loading...",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.search": "Search",
  "common.email": "Email",
  "common.phone": "Phone",
  "common.whatsapp": "WhatsApp",
  "common.telegram": "Telegram",
  "common.website": "Website",
  "common.facebook": "Facebook",
  "common.portfolio": "Portfolio",
  "common.category": "Category",
  "common.experience": "Experience",
  "common.location": "Location",
  "common.salary": "Salary",
  "common.budget": "Budget",
  "common.stipend": "Stipend",
  "common.month": "month",
  "common.project": "project",
  "common.week": "week",
  "common.notSpecified": "Not specified",
  "common.notProvided": "Not provided",
  "common.available": "Available",
  "common.notAttached": "Not attached",
  "common.general": "General",
  "common.recently": "Recently",
  "common.anywhere": "Anywhere",
  "common.remote": "Remote",
  "common.allCategories": "All categories",
  "common.candidate": "Candidate",
  "common.employer": "Employer",
  "common.male": "Male",
  "common.female": "Female",
  "type.all": "All types",
  "type.allWorkModes": "All work modes",
  "type.freelance": "Freelancer",
  "type.full-time": "Full-time",
  "type.part-time": "Part-time",
  "type.internship": "Internship",
  "type.both": "Both",
  "period.monthly": "monthly",
  "period.project": "project",
  "period.weekly": "weekly",
  "header.cat.freelance.label": "Freelancer",
  "header.cat.freelance.desc": "Create a project post for independent specialists, short missions, hourly work, or contract deliverables. (Login required to post)",
  "header.cat.fulltime.label": "Full-time",
  "header.cat.fulltime.desc": "Publish a permanent role with salary, location, contract expectations, and long-term team requirements. (Login will be requested)",
  "header.cat.business.label": "Business Owner",
  "header.cat.business.desc": "Describe a company need, team expansion, service request, or business project and connect with qualified talent. (Login required to continue)",
  "header.theme.toggle": "Toggle theme",
  "header.lang.toggle": "Switch language",
  "header.notifications.title": "Notifications",
  "header.notifications.cv.title": "Upload your CV",
  "header.notifications.cv.desc": "Add your CV in profile so employers can contact you faster.",
  "header.notifications.profile.title": "Finish your profile",
  "header.notifications.profile.desc": "Complete your bio or contact details to improve matching.",
  "header.notifications.jobs.title": "New jobs available",
  "header.notifications.jobs.desc": "3 new Alger jobs were posted that match your interests.",
  "header.menu.profile": "Profile",
  "header.menu.postJob": "Post a job",
  "header.menu.createOffer": "Create talent offer",
  "header.menu.browseJobs": "Browse jobs",
  "header.menu.signOut": "Sign out",
  "header.auth.login": "Login",
  "header.auth.register": "Register",
  "footer.tagline": "Connecting talent with opportunity, one role at a time.",
  "footer.candidates": "For candidates",
  "footer.employers": "For employers",
  "footer.browseJobs": "Browse jobs",
  "footer.createOffer": "Create talent offer",
  "footer.postJob": "Post a job",
  "footer.browseOffers": "Browse talent offers",
  "footer.contact": "Contact",
  "footer.about": "About",
  "footer.about.desc": "Mihna is an Algerian job platform connecting talent with opportunity across freelance, full-time, and contract roles.",
  "footer.privacy": "Privacy",
  "footer.rights": "All rights reserved.",
  "notfound.title": "Page not found",
  "notfound.desc": "The page you're looking for doesn't exist.",
  "notfound.home": "Go home",
  "searchbar.placeholder": "Job title or company",
  "searchbar.attendance": "Attendance",
  "searchbar.typePlaceholder": "Type",
  "searchbar.submit": "Search Job",
  "jobCard.loginToSave": "Log in to save jobs to your account.",
  "jobCard.saved": "Job saved",
  "jobCard.unsaved": "Job removed from saved list",
  "jobCard.saveFailed": "Could not update your saved jobs. Please try again.",
  "jobCard.save": "Save {title}",
  "jobCard.unsave": "Unsave {title}",
  "talent.open": "Open to opportunities",
  "talent.yearCount": "{count} year(s)",
  "home.hero.title.pre": "Find Your Dream",
  "home.hero.title.job": "Job",
  "home.hero.title.post": "Today",
  "home.hero.subtitle": "Your gateway to career success across freelance, full-time, and contract roles.",
  "home.stats.jobs": "Jobs",
  "home.stats.candidates": "Candidates",
  "home.stats.companies": "Companies",
  "home.news.title": "Latest announcements",
  "home.news.empty": "No announcements yet.",
  "home.trusted": "We Are Trusted By",
  "home.popular.title": "Most Popular Jobs",
  "home.popular.subtitle": "Discover the most in-demand positions across freelance and full-time categories",
  "home.fulltime": "Full-time Positions",
  "home.freelance": "Freelance Opportunities",
  "home.openPositions": "{count} open position{plural}",
  "home.noOpenPositions": "No open positions",
  "home.lookFor": "Look for the {count} opportunit{plural} ->",
  "home.showAll": "Show all",
  "home.featured": "Featured listings",
  "home.loadingFeatured": "Loading featured jobs...",
  "home.featured.empty": "No jobs available yet. Check back soon!",
  "home.talent.badge": "Talent board",
  "home.talent.title": "Employers can now browse detailed jobseeking offers",
  "home.talent.desc": "Candidates can publish richer talent cards with availability, salary expectations, skills, and direct contact links so companies can identify the right fit faster.",
  "home.talent.employerCta": "Open employer dashboard",
  "home.talent.candidateCta": "Create talent offer",
  "home.talent.empty": "No talent offers have been published yet.",
  "home.how.title": "How مِهنة Works",
  "home.how.workers": "For JobSeeker",
  "home.how.business": "For Business Owners",
  "home.worker.1.title": "Create Your Profile",
  "home.worker.1.text": "Sign up and build your professional profile with skills and experience.",
  "home.worker.2.title": "Browse Jobs",
  "home.worker.2.text": "Search and filter through thousands of job listings. Find freelance gigs, full-time roles, and projects matching your expertise.",
  "home.worker.3.title": "Apply with Ease",
  "home.worker.3.text": "Submit applications directly through the platform. Track your application status in real-time.",
  "home.worker.4.title": "Get Hired",
  "home.worker.4.text": "Connect with employers and start working. Build your reputation with reviews and ratings.",
  "home.business.1.title": "Post a Job",
  "home.business.1.text": "After Creating and Account, create detailed job listings in minutes. Specify requirements, budget, and timeline.",
  "home.business.2.title": "Review Candidates",
  "home.business.2.text": "Browse qualified applicants with verified profiles. Filter by skills, experience, and ratings.",
  "home.business.3.title": "Connect & Hire",
  "home.business.3.text": "Interview and select the best talent. Communicate directly through the platform.",
  "home.business.4.title": "Manage Projects",
  "home.business.4.text": "Track progress and make payments securely. Leave feedback and build your team.",
  "search.placeholder": "Search by job title, position, keyword...",
  "search.filters": "Filters",
  "search.savedOnly": "Saved jobs",
  "search.reset": "Reset filters",
  "search.results": "{count} jobs found",
  "search.empty.title": "No jobs found",
  "search.empty.desc": "Try adjusting your filters or search terms.",
  "search.saved.title": "Saved jobs",
  "search.saved.desc": "Quick access to roles you bookmarked.",
  "search.loading": "Loading jobs...",
  "auth.privacy.title": "Privacy terms",
  "auth.privacy.intro": "Before you finish your profile, please review and accept our privacy terms and website policies. This ensures your account is created with the right consent.",
  "auth.privacy.p1": "We collect basic account information to connect you with employers. Your phone number and contact links remain private until you choose to share them in your profile. We do not sell your personal data, and we keep your information secure.",
  "auth.privacy.p2": "By accepting, you consent to our terms of use, privacy policy, and the responsible use of this platform. You agree that all profile information is accurate.",
  "auth.privacy.p3": "You can skip optional details later, but accepting these terms is required to continue to the profile setup step.",
  "auth.privacy.accept": "I have read and accept the website privacy terms, data usage policy, and terms of service.",
  "auth.privacy.continue": "Continue to profile setup",
  "auth.finish.title": "Finish your profile",
  "auth.finish.desc": "Add your CV and optional contact details so employers can reach you faster. You can skip any of these fields.",
  "auth.finish.uploadCv": "Upload CV",
  "auth.finish.cvHint": "PDF, DOC, or DOCX. You can skip this for now.",
  "auth.finish.skip": "Skip optional details and enter",
  "auth.finish.save": "Save and enter",
  "auth.login.title": "Log in to your Account.",
  "auth.register.title": "Create account.",
  "auth.noAccount": "Don't have an account? ",
  "auth.hasAccount": "Already have an account? ",
  "auth.signUp": "Sign up",
  "auth.logIn": "Log in",
  "auth.firstName": "First name",
  "auth.lastName": "Last name",
  "auth.companyName": "Company name",
  "auth.email": "Email address",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm password",
  "auth.workPreference": "Work preference",
  "auth.passwordStrength": "Password strength",
  "auth.passwordHint": "Minimum 8 characters. Mix uppercase, lowercase, numbers, and symbols.",
  "auth.wilaya": "Wilaya",
  "auth.age": "Age",
  "auth.gender": "Gender",
  "auth.side.title": "Over {count} candidates\nwaiting for great employers.",
  "auth.side.liveJobs": "Live jobs",
  "auth.side.companies": "Companies",
  "auth.side.newJobs": "New jobs",
  "profile.loginRequired.title": "Log in to view your profile",
  "profile.loginRequired.desc": "Your dashboard, job activity, and settings are available once you sign in.",
  "profile.dashboard.employer": "Employer Dashboard",
  "profile.dashboard.candidate": "Candidate Dashboard",
  "profile.account.employer": "Employer account",
  "profile.account.candidate": "Freelancer / Job seeker",
  "profile.strength": "{count}% profile strength",
  "profile.activeJobs": "{count} active jobs",
  "profile.talentOffersCount": "{count} talent offers",
  "profile.edit": "Edit profile",
  "profile.logout": "Log out",
  "profile.tabs.overview": "Overview",
  "profile.tabs.offers": "Talent Offers",
  "profile.tabs.applied": "Applied Jobs",
  "profile.tabs.saved": "Saved Jobs",
  "profile.tabs.settings": "Settings",
  "profile.tabs.jobs": "My Jobs",
  "profile.tabs.applicants": "Applicants",
  "profile.tabs.talent": "Talent Board",
  "profile.stats.jobsPosted": "Jobs posted",
  "profile.stats.talentOffers": "Talent offers",
  "profile.stats.applicantsReceived": "Applicants received",
  "profile.stats.applicationsSent": "Applications sent",
  "profile.stats.talentOffersLive": "Talent offers live",
  "profile.stats.savedJobs": "Saved jobs",
  "profile.stats.profileStrength": "Profile strength",
  "profile.recentApplicants": "Recent applicants",
  "profile.recentApplicants.desc": "See who applied recently and jump into direct contact.",
  "profile.hiring": "Hiring",
  "profile.loadingApplicants": "Loading applicants...",
  "profile.noApplicants": "No applicants yet. Share your jobs and candidates will appear here.",
  "profile.yourTalentOffers": "Your talent offers",
  "profile.freshTalent": "Fresh talent",
  "profile.yourJobseekingOffers": "Your jobseeking offers",
  "profile.appliedJobs": "Applied jobs",
  "profile.savedJobs": "Saved jobs",
  "profile.yourJobPostings": "Your job postings",
  "profile.applicants": "Applicants",
  "profile.talentBoard": "Talent board",
  "profile.settings": "Settings",
  "profile.appearance": "Appearance",
  "profile.profilePhoto": "Profile photo",
  "profile.uploadImage": "Upload image",
  "profile.saveChanges": "Save changes",
  "profile.informationSaved": "Profile information saved",
  "profile.saveFailed": "Could not save your profile. Please try again.",
  "profile.candidateOfferDesc": "This is what employers see when they browse candidate offers.",
  "profile.detailedTalentCards": "Detailed talent cards that employers can browse from the platform.",
  "profile.reviewAppliedRoles": "Review the roles you already applied to.",
  "profile.jobsMarkedLater": "Jobs you marked to review later.",
  "profile.settingsDesc": "Manage your appearance and profile preferences.",
  "profile.appearanceDesc": "Choose light or dark mode for the site.",
  "profile.createNew": "Create new",
  "profile.noTalentOffers": "No talent offers yet. Publish one so employers can discover your profile.",
  "profile.createOffer": "Create offer",
  "profile.noOffersPublished": "You have not published any talent offers yet.",
  "job.notFound.title": "Job not found",
  "job.notFound.desc": "This listing may have been removed or is no longer available.",
  "job.backToJobs": "Back to jobs",
  "job.yourListing": "Your listing",
  "job.description": "Job description",
  "job.responsibilities": "Key responsibilities",
  "job.skills": "Professional skills",
  "job.tags": "Tags:",
  "job.share": "Share:",
  "job.related": "Related jobs",
  "job.overview": "Job overview",
  "job.apply": "Apply for this job",
  "job.openDashboard": "Open dashboard",
  "job.applicationRecorded": "Application recorded",
  "job.viewProfile": "View profile",
  "job.contactMethod": "Contact method",
  "job.savedContactShortcuts": "Your saved contact shortcuts",
  "job.applyLogin": "Log in to apply",
  "job.applyNow": "Apply now",
  "job.applied": "Applied",
  "job.posted": "Posted",
  "job.type": "Job type",
  "job.justNow": "Just now",
  "job.minutesAgo": "{mins} min ago",
  "job.hoursAgo": "{hrs}h ago",
  "job.daysAgo": "{days} days ago",
  "postAnnouncement.login.title": "Log in to create your talent offer",
  "postAnnouncement.login.desc": "Showcase your skills and availability to employers in Alger by creating a professional jobseeking post.",
  "postAnnouncement.login.cta": "Get Started",
  "postAnnouncement.employer.title": "Talent offers are for candidates",
  "postAnnouncement.employer.desc": "Employer accounts should publish job openings so candidates can apply directly.",
  "postAnnouncement.employer.cta": "Go to job posting",
  "postAnnouncement.badge": "Talent offer",
  "postAnnouncement.title": "Create a jobseeking offer that employers actually want to read",
  "postAnnouncement.desc": "Turn your profile into a detailed talent pitch with your role, experience, availability, expected pay, and direct contact methods.",
  "postAnnouncement.headline": "Headline",
  "postAnnouncement.headlinePlaceholder": "Example: React developer available for freelance and full-time work",
  "postAnnouncement.professionalTitle": "Professional title",
  "postAnnouncement.professionalTitlePlaceholder": "Frontend developer, Translator, UI designer...",
  "postAnnouncement.categoryPlaceholder": "Development, Design, Marketing...",
  "postAnnouncement.workPreference": "Work preference",
  "postAnnouncement.preferredLocation": "Preferred location",
  "postAnnouncement.experienceLevel": "Experience level",
  "postAnnouncement.yearsExperience": "Years of experience",
  "postAnnouncement.expectedSalary": "Expected salary / budget",
  "postAnnouncement.salaryPeriod": "Salary period",
  "postAnnouncement.availability": "Availability",
  "postAnnouncement.offerDetails": "Offer details",
  "postAnnouncement.detailsPlaceholder": "Describe your experience, services, industries you know well, tools you use, and the kind of companies or projects you want to work with.",
  "postAnnouncement.skillsPlaceholder": "React, TypeScript, UI Design, SEO",
  "postAnnouncement.portfolioWebsite": "Portfolio / website",
  "postAnnouncement.contactEmail": "Contact email",
  "postAnnouncement.publishing": "Publishing...",
  "postAnnouncement.publish": "Publish talent offer",
  "postAnnouncement.mustLogin": "You must be logged in to create a talent offer.",
  "postAnnouncement.employerToast": "Employer accounts should use the job posting flow instead.",
  "postAnnouncement.requiredToast": "Fill in the headline, role, category, and details.",
  "postAnnouncement.successToast": "Talent offer published",
  "postAnnouncement.failedToast": "Failed to publish your talent offer.",
  "postAnnouncement.tip.role.title": "Be specific about your role",
  "postAnnouncement.tip.role.text": "Employers skim quickly. A clear title and category make your profile show up in the right context.",
  "postAnnouncement.tip.pay.title": "Add your expected pay",
  "postAnnouncement.tip.pay.text": "Sharing an expected monthly salary or project budget helps employers qualify you faster.",
  "postAnnouncement.tip.availability.title": "Show availability clearly",
  "postAnnouncement.tip.availability.text": "Immediate availability, part-time capacity, or project windows are often the deciding factor.",
  "postAnnouncement.tip.location.title": "Mention location and flexibility",
  "postAnnouncement.tip.location.text": "Let employers know if you prefer local work, remote projects, or hybrid opportunities.",
  "postAnnouncement.tip.proof.title": "Link proof of work",
  "postAnnouncement.tip.proof.text": "A portfolio, GitHub, Behance, or LinkedIn link makes your offer much stronger.",
  "postJob.employerRequired": "Employer account required",
  "postJob.review": "Review your post",
  "postJob.timeframe": "Timeframe",
  "postJob.skillsRequirements": "Skills or requirements",
  "postJob.suggested.desc": "Matching examples for the posting type you selected above.",
  "text.Development": "Development",
  "text.Education": "Education",
  "text.Hospitality": "Hospitality",
  "text.Design": "Design",
  "text.Translator": "Translator",
  "text.Copywriting": "Copywriting",
  "text.Junior": "Junior",
  "text.Mid-level": "Mid-level",
  "text.Senior": "Senior",
  "text.Lead": "Lead",
  "text.Open": "Open",
  "text.Available immediately": "Available immediately",
  "text.Available this week": "Available this week",
  "text.Available this month": "Available this month",
  "text.Open to discussion": "Open to discussion",
  "job.employerPostJob": "Post a job",
  "job.employerPostDesc": "Looking to hire? Publish a job opening to attract candidates directly.",
  "job.yourListingDesc": "This is your job posting. Manage it from your dashboard.",
  "postAnnouncement.step.mainInfo": "Main Info",
  "postAnnouncement.step.describe": "Describe",
  "postAnnouncement.step.details": "Details",
  "postAnnouncement.back": "Back",
  "postAnnouncement.nextStep": "Next Step",
  "postAnnouncement.continueDetails": "Continue to Details",
  "postAnnouncement.reviewHeadline": "Headline",
  "postAnnouncement.reviewTitle": "Professional title",
  "postAnnouncement.reviewCategory": "Category",
  "postAnnouncement.reviewDetails": "Details",
  "postAnnouncement.tagsLabel": "Tags",
  "postAnnouncement.tagsPlaceholder": "Type or select tags",
  "postAnnouncement.detailsHint": "Explain your experience, services, and what kind of opportunities you are looking for.",
  "postAnnouncement.freelance.title": "Create a freelance offer that attracts clients",
  "postAnnouncement.freelance.desc": "Pitch your freelance services with your skills, rates, and project availability.",
  "postAnnouncement.fulltime.title": "Create a full-time jobseeking offer employers want to read",
  "postAnnouncement.fulltime.desc": "Position yourself as a serious candidate with your experience, expectations, and career goals.",
  "postAnnouncement.headlineBoth": "Showcase your professional profile",
  "postAnnouncement.subtitleBoth": "Let employers know about your skills and what opportunities you're seeking.",
  "postAnnouncement.browseAll": "Browse all categories",
  "postAnnouncement.hideAll": "Hide all categories",
  "postAnnouncement.loadingWilayas": "Loading wilayas..."
};
const fr = {
  ...en,
  "app.title": "Mihna - Trouvez le job de vos rêves aujourd'hui",
  "app.description": "Mihna relie les talents aux opportunités. Parcourez des offres freelance, temps plein et projets dans plusieurs secteurs.",
  "common.loading": "Chargement...",
  "common.cancel": "Annuler",
  "common.save": "Enregistrer",
  "common.search": "Rechercher",
  "common.phone": "Téléphone",
  "common.website": "Site web",
  "common.portfolio": "Portfolio",
  "common.category": "Catégorie",
  "common.experience": "Expérience",
  "common.location": "Localisation",
  "common.salary": "Salaire",
  "common.stipend": "Indemnité",
  "common.month": "mois",
  "common.week": "semaine",
  "common.notSpecified": "Non précisé",
  "common.notProvided": "Non fourni",
  "common.available": "Disponible",
  "common.notAttached": "Non joint",
  "common.general": "Général",
  "common.recently": "Récemment",
  "common.anywhere": "Partout",
  "common.remote": "À distance",
  "common.allCategories": "Toutes les catégories",
  "common.candidate": "Candidat",
  "common.employer": "Employeur",
  "common.male": "Homme",
  "common.female": "Femme",
  "type.all": "Tous les types",
  "type.allWorkModes": "Tous les modes de travail",
  "type.freelance": "Freelance",
  "type.full-time": "Temps plein",
  "type.part-time": "Temps partiel",
  "type.internship": "Stage",
  "type.both": "Les deux",
  "period.monthly": "mensuel",
  "period.weekly": "hebdomadaire",
  "header.cat.freelance.label": "Freelance",
  "header.cat.freelance.desc": "Créez une annonce de projet pour des spécialistes indépendants, des missions courtes, du travail horaire ou des livrables contractuels. (Connexion requise pour publier)",
  "header.cat.fulltime.label": "Temps plein",
  "header.cat.fulltime.desc": "Publiez un poste permanent avec salaire, lieu, attentes contractuelles et besoins d'équipe à long terme. (Connexion requise)",
  "header.cat.business.label": "Employeur",
  "header.cat.business.desc": "Décrivez un besoin d'entreprise, une expansion d'équipe, une demande de service ou un projet et connectez-vous avec des talents qualifiés. (Connexion requise pour continuer)",
  "header.theme.toggle": "Changer le thème",
  "header.lang.toggle": "Changer la langue",
  "header.notifications.cv.title": "Ajoutez votre CV",
  "header.notifications.cv.desc": "Ajoutez votre CV au profil pour que les employeurs vous contactent plus vite.",
  "header.notifications.profile.title": "Complétez votre profil",
  "header.notifications.profile.desc": "Complétez votre bio ou vos coordonnées pour améliorer la correspondance.",
  "header.notifications.jobs.title": "Nouvelles offres disponibles",
  "header.notifications.jobs.desc": "3 nouvelles offres à Alger correspondent à vos intérêts.",
  "header.menu.profile": "Profil",
  "header.menu.postJob": "Publier une offre",
  "header.menu.createOffer": "Créer une annonce talent",
  "header.menu.browseJobs": "Parcourir les offres",
  "header.menu.signOut": "Se déconnecter",
  "header.auth.login": "Connexion",
  "header.auth.register": "Inscription",
  "footer.tagline": "Relier les talents aux opportunités, une mission à la fois.",
  "footer.candidates": "Pour les candidats",
  "footer.employers": "Pour les employeurs",
  "footer.browseJobs": "Parcourir les offres",
  "footer.createOffer": "Créer une annonce talent",
  "footer.postJob": "Publier une offre",
  "footer.browseOffers": "Parcourir les profils",
  "footer.about": "À propos",
  "footer.about.desc": "Mihna est une plateforme d'emploi algérienne qui relie les talents aux opportunités, en freelance, temps plein et missions.",
  "footer.contact": "Contact",
  "footer.privacy": "Confidentialité",
  "footer.rights": "Tous droits réservés.",
  "notfound.title": "Page introuvable",
  "notfound.desc": "La page que vous recherchez n'existe pas.",
  "notfound.home": "Retour à l'accueil",
  "searchbar.placeholder": "Titre du poste ou entreprise",
  "searchbar.attendance": "Présence",
  "searchbar.submit": "Rechercher",
  "jobCard.loginToSave": "Connectez-vous pour enregistrer des offres.",
  "jobCard.saved": "Offre enregistrée",
  "jobCard.unsaved": "Offre retirée des favoris",
  "jobCard.saveFailed": "Impossible de mettre à jour vos favoris. Réessayez.",
  "jobCard.save": "Enregistrer {title}",
  "jobCard.unsave": "Retirer {title}",
  "talent.open": "Ouvert aux opportunités",
  "talent.yearCount": "{count} an(s)",
  "home.hero.title.pre": "Trouvez le job",
  "home.hero.title.job": "idéal",
  "home.hero.title.post": "aujourd'hui",
  "home.hero.subtitle": "Votre passerelle vers la réussite professionnelle en freelance, temps plein et missions contractuelles.",
  "home.stats.jobs": "Offres",
  "home.stats.candidates": "Candidats",
  "home.stats.companies": "Entreprises",
  "home.news.title": "Dernières annonces",
  "home.news.empty": "Aucune annonce pour le moment.",
  "home.trusted": "Ils nous font confiance",
  "home.popular.title": "Métiers les plus populaires",
  "home.popular.subtitle": "Découvrez les postes les plus demandés en freelance et à temps plein",
  "home.fulltime": "Postes à temps plein",
  "home.freelance": "Opportunités freelance",
  "home.openPositions": "{count} poste{plural} ouvert{plural}",
  "home.noOpenPositions": "Aucun poste ouvert",
  "home.lookFor": "Voir les {count} opportunité{plural} ->",
  "home.showAll": "Tout voir",
  "home.featured": "Offres en vedette",
  "home.loadingFeatured": "Chargement des offres en vedette...",
  "home.featured.empty": "Aucune offre disponible pour le moment. Revenez bientôt!",
  "home.talent.badge": "Espace talents",
  "home.talent.title": "Les employeurs peuvent maintenant parcourir des profils candidats détaillés",
  "home.talent.desc": "Les candidats peuvent publier des cartes talent enrichies avec disponibilité, attentes salariales, compétences et liens de contact pour aider les entreprises à trouver plus vite le bon profil.",
  "home.talent.employerCta": "Ouvrir le tableau employeur",
  "home.talent.candidateCta": "Créer une annonce talent",
  "home.talent.empty": "Aucune annonce talent n'a encore été publiée.",
  "home.how.title": "Comment fonctionne مِهنة",
  "home.how.workers": "Pour les travailleurs",
  "home.how.business": "Pour les employeurs",
  "home.worker.1.title": "Créez votre profil",
  "home.worker.1.text": "Inscrivez-vous et construisez votre profil professionnel avec vos compétences et votre expérience.",
  "home.worker.2.title": "Parcourez les offres",
  "home.worker.2.text": "Recherchez et filtrez des milliers d'annonces. Trouvez des missions freelance, postes à temps plein et projets adaptés à votre expertise.",
  "home.worker.3.title": "Postulez facilement",
  "home.worker.3.text": "Envoyez vos candidatures directement depuis la plateforme et suivez leur statut en temps réel.",
  "home.worker.4.title": "Faites-vous recruter",
  "home.worker.4.text": "Connectez-vous avec des employeurs et commencez à travailler. Construisez votre réputation avec avis et notes.",
  "home.business.1.title": "Publiez une offre",
  "home.business.1.text": "Après la création et le compte, créez des offres d'emploi détaillées en quelques minutes. Spécifiez les exigences, le budget et le calendrier.",
  "home.business.2.title": "Évaluez les candidats",
  "home.business.2.text": "Parcourez des profils qualifiés et vérifiés. Filtrez par compétences, expérience et évaluations.",
  "home.business.3.title": "Contactez et recrutez",
  "home.business.3.text": "Interviewez et sélectionnez les meilleurs talents. Échangez directement via la plateforme.",
  "home.business.4.title": "Gérez les projets",
  "home.business.4.text": "Suivez l'avancement et payez en sécurité. Laissez des avis et développez votre équipe.",
  "search.placeholder": "Rechercher par titre, poste, mot-clé...",
  "search.filters": "Filtres",
  "search.savedOnly": "Offres enregistrées",
  "search.reset": "Réinitialiser les filtres",
  "search.results": "{count} offre(s) trouvée(s)",
  "search.empty.title": "Aucune offre trouvée",
  "search.empty.desc": "Essayez d'ajuster vos filtres ou mots-clés.",
  "search.saved.title": "Offres enregistrées",
  "search.saved.desc": "Accès rapide aux postes que vous avez sauvegardés.",
  "search.loading": "Chargement des offres...",
  "auth.privacy.title": "Conditions de confidentialité",
  "auth.privacy.intro": "Avant de terminer votre profil, veuillez consulter et accepter nos conditions de confidentialité et les règles du site. Cela garantit la création de votre compte avec le bon consentement.",
  "auth.privacy.p1": "Nous collectons les informations de base du compte pour vous connecter aux employeurs. Votre téléphone et vos liens restent privés jusqu'à ce que vous choisissiez de les partager dans votre profil. Nous ne vendons pas vos données personnelles et nous les protégeons.",
  "auth.privacy.p2": "En acceptant, vous consentez à nos conditions d'utilisation, à notre politique de confidentialité et à l'usage responsable de la plateforme. Vous confirmez que les informations du profil sont exactes.",
  "auth.privacy.p3": "Vous pourrez ignorer certains détails optionnels plus tard, mais l'acceptation de ces conditions est obligatoire pour continuer.",
  "auth.privacy.accept": "J'ai lu et j'accepte les conditions de confidentialité, la politique d'utilisation des données et les conditions de service.",
  "auth.privacy.continue": "Continuer vers le profil",
  "auth.finish.title": "Terminez votre profil",
  "auth.finish.uploadCv": "Téléverser le CV",
  "auth.finish.cvHint": "PDF, DOC ou DOCX. Vous pouvez ignorer cette étape.",
  "auth.finish.skip": "Ignorer les détails optionnels et entrer",
  "auth.finish.save": "Enregistrer et entrer",
  "auth.login.title": "Connectez-vous à votre compte.",
  "auth.register.title": "Créer un compte.",
  "auth.noAccount": "Vous n'avez pas de compte ? ",
  "auth.hasAccount": "Vous avez déjà un compte ? ",
  "auth.signUp": "S'inscrire",
  "auth.logIn": "Se connecter",
  "auth.companyName": "Nom de l'entreprise",
  "auth.email": "Adresse e-mail",
  "auth.password": "Mot de passe",
  "auth.confirmPassword": "Confirmer le mot de passe",
  "auth.workPreference": "Préférence de travail",
  "auth.passwordStrength": "Force du mot de passe",
  "auth.wilaya": "Wilaya",
  "auth.age": "Âge",
  "auth.gender": "Genre",
  "auth.side.title": "Plus de {count} candidats\nattendent de bons employeurs.",
  "auth.side.liveJobs": "Offres actives",
  "auth.side.newJobs": "Nouvelles offres",
  "profile.loginRequired.title": "Connectez-vous pour voir votre profil",
  "profile.loginRequired.desc": "Votre tableau de bord, vos activités et vos paramètres sont disponibles après connexion.",
  "profile.dashboard.employer": "Tableau employeur",
  "profile.dashboard.candidate": "Tableau candidat",
  "profile.account.employer": "Compte employeur",
  "profile.account.candidate": "Freelance / chercheur d'emploi",
  "profile.strength": "Profil complété à {count}%",
  "profile.activeJobs": "{count} offres actives",
  "profile.talentOffersCount": "{count} annonces talent",
  "profile.edit": "Modifier le profil",
  "profile.logout": "Se déconnecter",
  "profile.tabs.offers": "Annonces talent",
  "profile.tabs.applied": "Candidatures",
  "profile.tabs.saved": "Offres enregistrées",
  "profile.tabs.jobs": "Mes offres",
  "profile.tabs.talent": "Espace talents",
  "profile.stats.jobsPosted": "Offres publiées",
  "profile.stats.applicantsReceived": "Candidats reçus",
  "profile.stats.applicationsSent": "Candidatures envoyées",
  "profile.stats.talentOffersLive": "Annonces talent actives",
  "profile.stats.profileStrength": "Complétion du profil",
  "profile.recentApplicants": "Candidats récents",
  "profile.recentApplicants.desc": "Voyez les dernières candidatures et contactez rapidement les profils.",
  "profile.hiring": "Recrutement",
  "profile.loadingApplicants": "Chargement des candidats...",
  "profile.noApplicants": "Aucun candidat pour le moment. Partagez vos offres et ils apparaîtront ici.",
  "profile.yourTalentOffers": "Vos annonces talent",
  "profile.freshTalent": "Nouveaux talents",
  "profile.yourJobseekingOffers": "Vos annonces de recherche",
  "profile.appliedJobs": "Candidatures",
  "profile.yourJobPostings": "Vos offres d'emploi",
  "profile.applicants": "Candidats",
  "profile.talentBoard": "Espace talents",
  "profile.appearance": "Apparence",
  "profile.profilePhoto": "Photo de profil",
  "profile.uploadImage": "Téléverser une image",
  "profile.saveChanges": "Enregistrer les changements",
  "profile.informationSaved": "Profil enregistré",
  "profile.saveFailed": "Impossible d'enregistrer votre profil. Réessayez.",
  "job.notFound.title": "Offre introuvable",
  "job.notFound.desc": "Cette annonce a peut-être été supprimée ou n'est plus disponible.",
  "job.backToJobs": "Retour aux offres",
  "job.yourListing": "Votre annonce",
  "job.description": "Description du poste",
  "job.responsibilities": "Responsabilités clés",
  "job.skills": "Compétences professionnelles",
  "job.tags": "Tags :",
  "job.share": "Partager :",
  "job.related": "Offres similaires",
  "job.overview": "Aperçu de l'offre",
  "job.apply": "Postuler à cette offre",
  "job.openDashboard": "Ouvrir le tableau",
  "job.applicationRecorded": "Candidature enregistrée",
  "job.viewProfile": "Voir le profil",
  "job.contactMethod": "Méthode de contact",
  "job.savedContactShortcuts": "Vos raccourcis de contact enregistrés",
  "job.applyLogin": "Connectez-vous pour postuler",
  "job.applyNow": "Postuler",
  "job.applied": "Déjà postulé",
  "job.posted": "Publié",
  "job.type": "Type d'emploi",
  "job.justNow": "À l'instant",
  "job.minutesAgo": "Il y a {mins} min",
  "job.hoursAgo": "Il y a {hrs}h",
  "job.daysAgo": "Il y a {days} jours",
  "postAnnouncement.login.title": "Connectez-vous pour créer votre annonce talent",
  "postAnnouncement.login.desc": "Présentez vos compétences et disponibilités aux employeurs à Alger avec une annonce professionnelle.",
  "postAnnouncement.login.cta": "Commencer",
  "postAnnouncement.employer.title": "Les annonces talent sont pour les candidats",
  "postAnnouncement.employer.desc": "Les comptes employeur doivent publier des offres pour que les candidats postulent directement.",
  "postAnnouncement.employer.cta": "Aller à la publication",
  "postAnnouncement.badge": "Annonce talent",
  "postAnnouncement.title": "Créez une annonce de recherche que les employeurs auront envie de lire",
  "postAnnouncement.desc": "Transformez votre profil en pitch détaillé avec rôle, expérience, disponibilité, rémunération attendue et contacts directs.",
  "postAnnouncement.headline": "Accroche",
  "postAnnouncement.headlinePlaceholder": "Exemple : développeur React disponible en freelance et temps plein",
  "postAnnouncement.professionalTitle": "Titre professionnel",
  "postAnnouncement.professionalTitlePlaceholder": "Développeur frontend, traducteur, designer UI...",
  "postAnnouncement.categoryPlaceholder": "Développement, design, marketing...",
  "postAnnouncement.preferredLocation": "Lieu préféré",
  "postAnnouncement.experienceLevel": "Niveau d'expérience",
  "postAnnouncement.yearsExperience": "Années d'expérience",
  "postAnnouncement.expectedSalary": "Salaire / budget attendu",
  "postAnnouncement.salaryPeriod": "Période salariale",
  "postAnnouncement.offerDetails": "Détails de l'annonce",
  "postAnnouncement.detailsPlaceholder": "Décrivez votre expérience, vos services, secteurs, outils et les projets ou entreprises que vous recherchez.",
  "postAnnouncement.portfolioWebsite": "Portfolio / site web",
  "postAnnouncement.contactEmail": "E-mail de contact",
  "postAnnouncement.publishing": "Publication...",
  "postAnnouncement.publish": "Publier l'annonce talent",
  "postAnnouncement.mustLogin": "Vous devez être connecté pour créer une annonce talent.",
  "postAnnouncement.requiredToast": "Renseignez l'accroche, le rôle, la catégorie et les détails.",
  "postAnnouncement.successToast": "Annonce talent publiée",
  "postAnnouncement.failedToast": "Échec de publication de l'annonce talent.",
  "postAnnouncement.employerToast": "Les comptes employeur doivent utiliser le flux de publication d'offre.",
  "postAnnouncement.tip.role.title": "Soyez précis sur votre rôle",
  "postAnnouncement.tip.role.text": "Les employeurs parcourent vite. Un titre et une catégorie clairs placent votre profil au bon endroit.",
  "postAnnouncement.tip.pay.title": "Ajoutez votre rémunération attendue",
  "postAnnouncement.tip.pay.text": "Un salaire mensuel ou budget projet aide les employeurs à vous qualifier plus vite.",
  "postAnnouncement.tip.availability.title": "Montrez clairement votre disponibilité",
  "postAnnouncement.tip.availability.text": "Disponibilité immédiate, temps partiel ou fenêtre projet peuvent faire la différence.",
  "postAnnouncement.tip.location.title": "Mentionnez lieu et flexibilité",
  "postAnnouncement.tip.location.text": "Indiquez si vous préférez le local, le remote ou l'hybride.",
  "postAnnouncement.tip.proof.title": "Ajoutez des preuves de travail",
  "postAnnouncement.tip.proof.text": "Un portfolio, GitHub, Behance ou LinkedIn rend votre annonce beaucoup plus forte.",
  "postAnnouncement.headlineBoth": "Votre profil professionnel",
  "postAnnouncement.subtitleBoth": "Montrez vos compétences et les opportunités que vous recherchez.",
  "postAnnouncement.browseAll": "Voir toutes les catégories",
  "postAnnouncement.hideAll": "Masquer les catégories",
  "postAnnouncement.loadingWilayas": "Chargement des wilayas...",
  "postJob.employerRequired": "Compte employeur requis",
  "postJob.review": "Vérifier votre annonce",
  "postJob.timeframe": "Délai",
  "postJob.skillsRequirements": "Compétences ou exigences",
  "postJob.suggested.desc": "Exemples correspondant au type de publication sélectionné.",
  "text.Development": "Développement",
  "text.Education": "Éducation",
  "text.Hospitality": "Hôtellerie",
  "text.Translator": "Traducteur",
  "text.Copywriting": "Rédaction",
  "text.Mid-level": "Intermédiaire",
  "text.Open": "Ouvert",
  "text.Available immediately": "Disponible immédiatement",
  "text.Available this week": "Disponible cette semaine",
  "text.Available this month": "Disponible ce mois-ci",
  "text.Open to discussion": "Ouvert à la discussion",
  "text.Web Development": "Développement Web",
  "text.Graphic Design": "Design Graphique",
  "text.Mobile Development": "Développement Mobile",
  "text.UI/UX Design": "Design UI/UX",
  "text.Logo and Brand Identity": "Logo et Identité de Marque",
  "text.Content Writing": "Rédaction de Contenu",
  "text.Translation": "Traduction",
  "text.Video Editing": "Montage Vidéo",
  "text.Photography": "Photographie",
  "text.Digital Marketing": "Marketing Digital",
  "text.Social Media Management": "Gestion des Réseaux Sociaux",
  "text.SEO": "SEO",
  "text.Paid Ads": "Publicité Payante",
  "text.E-commerce Development": "Développement E-commerce",
  "text.Shopify Development": "Développement Shopify",
  "text.Data Entry": "Saisie de Données",
  "text.Virtual Assistant": "Assistant Virtuel",
  "text.Customer Support": "Support Client",
  "text.Technical Support": "Support Technique",
  "text.Accounting Help": "Aide Comptable",
  "text.Administrative Support": "Support Administratif",
  "text.Legal Consulting": "Conseil Juridique",
  "text.Engineering Design": "Conception Technique",
  "text.Architecture Design": "Conception Architecturale",
  "text.Game Development": "Développement de Jeux",
  "text.Software Developer": "Développeur Logiciel",
  "text.Web Developer": "Développeur Web",
  "text.Mobile Developer": "Développeur Mobile",
  "text.IT Support": "Support Informatique",
  "text.Network Administrator": "Administrateur Réseau",
  "text.Data Analyst": "Analyste de Données",
  "text.Cybersecurity Specialist": "Spécialiste en Cybersécurité",
  "text.Doctor / Nurse": "Médecin / Infirmier",
  "text.Pharmacist": "Pharmacien",
  "text.Medical Technician": "Technicien Médical",
  "text.Dentist": "Dentiste",
  "text.Sales Representative": "Représentant Commercial",
  "text.Account Manager": "Responsable de Comptes",
  "text.Marketing Specialist": "Spécialiste Marketing",
  "text.Social Media Manager": "Community Manager",
  "text.Teacher / Trainer": "Enseignant / Formateur",
  "text.Professor": "Professeur",
  "text.Accountant": "Comptable",
  "text.Financial Analyst": "Analyste Financier",
  "text.Store Manager": "Gérant de Magasin",
  "text.Cashier": "Caissier",
  "text.Warehouse Worker": "Magasinier",
  "text.Delivery Driver": "Livreur",
  "text.Driver": "Chauffeur",
  "text.Receptionist": "Réceptionniste",
  "text.Administrative Assistant": "Assistant Administratif",
  "text.Customer Service": "Service Client",
  "text.Call Center Agent": "Agent de Centre d'Appels",
  "text.Security Guard": "Agent de Sécurité",
  "text.Restaurant Worker": "Employé de Restaurant",
  "text.Chef / Cook": "Chef / Cuisinier",
  "text.Hotel Staff": "Personnel d'Hôtel",
  "text.Construction Worker": "Ouvrier du Bâtiment",
  "text.Electrician": "Électricien",
  "text.Plumber": "Plombier",
  "text.Mechanic": "Mécanicien",
  "text.Technician": "Technicien",
  "text.Designer": "Designer",
  "text.Graphic Designer": "Designer Graphique",
  "text.Content Creator": "Créateur de Contenu",
  "text.HR Specialist": "Spécialiste RH",
  "text.Lawyer / Legal Advisor": "Avocat / Conseiller Juridique",
  "text.Developers": "Développeurs",
  "text.Web Developers": "Développeurs Web",
  "text.Mobile Developers": "Développeurs Mobile",
  "text.Designers": "Designers",
  "text.Graphic Designers": "Designers Graphiques",
  "text.UI/UX Designers": "Designers UI/UX",
  "text.Marketing Team": "Équipe Marketing",
  "text.SEO Specialists": "Spécialistes SEO",
  "text.Social Media Team": "Équipe Réseaux Sociaux",
  "text.Medical Staff": "Personnel Médical",
  "text.Doctors": "Médecins",
  "text.Nurses": "Infirmiers",
  "text.Sales Team": "Équipe Commerciale",
  "text.Account Managers": "Responsables de Comptes",
  "text.Business Consulting": "Conseil aux Entreprises",
  "text.HR & Recruitment": "RH et Recrutement",
  "text.Legal Services": "Services Juridiques",
  "text.Accounting Services": "Services Comptables",
  "text.Logistics & Delivery": "Logistique et Livraison",
  "text.Construction Services": "Services de Construction",
  "text.Maintenance Services": "Services d'Entretien",
  "text.Hospitality Staffing": "Personnel Hôtelier",
  "text.Training & Education": "Formation et Éducation",
  "text.Administrative Help": "Aide Administrative",
  "text.IT Services": "Services Informatiques",
  "text.Design Services": "Services de Design",
  "text.Content Creation": "Création de Contenu",
  "job.employerPostJob": "Publier une offre",
  "job.employerPostDesc": "Vous cherchez à recruter ? Publiez une offre pour attirer des candidats.",
  "job.yourListingDesc": "Ceci est votre annonce. Gérez-la depuis votre tableau de bord.",
  "postAnnouncement.step.mainInfo": "Infos principales",
  "postAnnouncement.step.describe": "Description",
  "postAnnouncement.step.details": "Détails",
  "postAnnouncement.back": "Retour",
  "postAnnouncement.nextStep": "Étape suivante",
  "postAnnouncement.continueDetails": "Continuer vers les détails",
  "postAnnouncement.reviewHeadline": "Accroche",
  "postAnnouncement.reviewTitle": "Titre professionnel",
  "postAnnouncement.reviewCategory": "Catégorie",
  "postAnnouncement.reviewDetails": "Détails",
  "postAnnouncement.tagsLabel": "Tags",
  "postAnnouncement.tagsPlaceholder": "Tapez ou sélectionnez des tags",
  "postAnnouncement.detailsHint": "Expliquez votre expérience, vos services et le type d'opportunités recherchées.",
  "postAnnouncement.freelance.title": "Créez une offre freelance qui attire des clients",
  "postAnnouncement.freelance.desc": "Présentez vos services freelance avec vos compétences, tarifs et disponibilités projets.",
  "postAnnouncement.fulltime.title": "Créez une offre de recherche d'emploi que les employeurs veulent lire",
  "postAnnouncement.fulltime.desc": "Positionnez-vous comme candidat sérieux avec votre expérience, attentes et objectifs de carrière.",
  "profile.candidateOfferDesc": "Voici ce que les employeurs voient lorsqu'ils parcourent les offres des candidats.",
  "profile.detailedTalentCards": "Fiches de talents détaillées que les employeurs peuvent parcourir depuis la plateforme.",
  "profile.reviewAppliedRoles": "Consultez les postes auxquels vous avez déjà postulé.",
  "profile.jobsMarkedLater": "Emplois que vous avez marqués pour examen ultérieur.",
  "profile.settingsDesc": "Gérez votre apparence et vos préférences de profil.",
  "profile.appearanceDesc": "Choisissez le mode clair ou sombre pour le site.",
  "profile.createNew": "Créer nouveau",
  "profile.noTalentOffers": "Pas encore d'offres de talent. Publiez-en une pour que les employeurs découvrent votre profil.",
  "profile.createOffer": "Créer une offre",
  "profile.noOffersPublished": "Vous n'avez pas encore publié d'offres de talent."
};
const ar = {
  ...en,
  "app.title": "مهنة - اعثر على وظيفة أحلامك اليوم",
  "app.description": "مهنة تربط المواهب بالفرص. تصفح وظائف العمل الحر والدوام الكامل والمشاريع في مختلف المجالات.",
  "common.loading": "جار التحميل...",
  "common.cancel": "إلغاء",
  "common.save": "حفظ",
  "common.search": "بحث",
  "common.email": "البريد الإلكتروني",
  "common.phone": "الهاتف",
  "common.website": "الموقع الإلكتروني",
  "common.facebook": "فيسبوك",
  "common.portfolio": "معرض الأعمال",
  "common.category": "الفئة",
  "common.experience": "الخبرة",
  "common.location": "الموقع",
  "common.salary": "الراتب",
  "common.budget": "الميزانية",
  "common.stipend": "منحة",
  "common.month": "شهر",
  "common.project": "مشروع",
  "common.week": "أسبوع",
  "common.notSpecified": "غير محدد",
  "common.notProvided": "غير متوفر",
  "common.available": "متاح",
  "common.notAttached": "غير مرفق",
  "common.general": "عام",
  "common.recently": "مؤخرا",
  "common.anywhere": "أي مكان",
  "common.remote": "عن بعد",
  "common.allCategories": "كل الفئات",
  "common.candidate": "مترشح",
  "common.employer": "صاحب عمل",
  "common.male": "ذكر",
  "common.female": "أنثى",
  "type.all": "كل الأنواع",
  "type.allWorkModes": "كل أنماط العمل",
  "type.freelance": "عمل حر",
  "type.full-time": "دوام كامل",
  "type.part-time": "دوام جزئي",
  "type.internship": "تربص",
  "type.both": "كلاهما",
  "period.monthly": "شهريا",
  "period.project": "مشروع",
  "period.weekly": "أسبوعيا",
  "header.cat.freelance.label": "عمل حر",
  "header.cat.freelance.desc": "أنشئ إعلان مشروع للمستقلين أو المهام القصيرة أو العمل بالساعة أو التسليمات التعاقدية. (تسجيل الدخول مطلوب للنشر)",
  "header.cat.fulltime.label": "دوام كامل",
  "header.cat.fulltime.desc": "انشر وظيفة دائمة مع الراتب والموقع وتوقعات العقد ومتطلبات الفريق طويلة المدى. (سيطلب تسجيل الدخول)",
  "header.cat.business.label": "صاحب عمل",
  "header.cat.business.desc": "صف حاجة شركتك أو توسع فريقك أو طلب خدمة أو مشروع عمل وتواصل مع مواهب مؤهلة. (تسجيل الدخول مطلوب للمتابعة)",
  "header.theme.toggle": "تبديل المظهر",
  "header.lang.toggle": "تغيير اللغة",
  "header.notifications.title": "الإشعارات",
  "header.notifications.cv.title": "ارفع سيرتك الذاتية",
  "header.notifications.cv.desc": "أضف سيرتك الذاتية في الملف الشخصي حتى يتمكن أصحاب العمل من التواصل معك بسرعة أكبر.",
  "header.notifications.profile.title": "أكمل ملفك الشخصي",
  "header.notifications.profile.desc": "أكمل النبذة أو بيانات التواصل لتحسين المطابقة.",
  "header.notifications.jobs.title": "وظائف جديدة متاحة",
  "header.notifications.jobs.desc": "تم نشر 3 وظائف جزائرية جديدة تناسب اهتماماتك.",
  "header.menu.profile": "الملف الشخصي",
  "header.menu.postJob": "نشر وظيفة",
  "header.menu.createOffer": "إنشاء عرض موهبة",
  "header.menu.browseJobs": "تصفح الوظائف",
  "header.menu.signOut": "تسجيل الخروج",
  "header.auth.login": "تسجيل الدخول",
  "header.auth.register": "إنشاء حساب",
  "footer.tagline": "نربط المواهب بالفرص، وظيفة بعد أخرى.",
  "footer.candidates": "للمترشحين",
  "footer.employers": "لأصحاب العمل",
  "footer.browseJobs": "تصفح الوظائف",
  "footer.createOffer": "إنشاء عرض موهبة",
  "footer.postJob": "نشر وظيفة",
  "footer.browseOffers": "تصفح عروض المواهب",
  "footer.contact": "اتصل بنا",
  "footer.about": "حول",
  "footer.about.desc": "مهنة منصة جزائرية للتوظيف تربط المواهب بالفرص في العمل الحر والدوام الكامل والمشاريع.",
  "footer.privacy": "الخصوصية",
  "footer.rights": "جميع الحقوق محفوظة.",
  "notfound.title": "الصفحة غير موجودة",
  "notfound.desc": "الصفحة التي تبحث عنها غير موجودة.",
  "notfound.home": "العودة للرئيسية",
  "searchbar.placeholder": "عنوان الوظيفة أو الشركة",
  "searchbar.attendance": "الحضور",
  "searchbar.typePlaceholder": "النوع",
  "searchbar.submit": "ابحث عن وظيفة",
  "jobCard.loginToSave": "سجل الدخول لحفظ الوظائف في حسابك.",
  "jobCard.saved": "تم حفظ الوظيفة",
  "jobCard.unsaved": "تمت إزالة الوظيفة من القائمة المحفوظة",
  "jobCard.saveFailed": "تعذر تحديث الوظائف المحفوظة. حاول مرة أخرى.",
  "jobCard.save": "حفظ {title}",
  "jobCard.unsave": "إلغاء حفظ {title}",
  "talent.open": "منفتح على الفرص",
  "talent.yearCount": "{count} سنة/سنوات",
  "home.hero.title.pre": "اعثر على وظيفة",
  "home.hero.title.job": "أحلامك",
  "home.hero.title.post": "اليوم",
  "home.hero.subtitle": "بوابتك للنجاح المهني في العمل الحر والدوام الكامل والعقود.",
  "home.stats.jobs": "وظائف",
  "home.stats.candidates": "مترشحون",
  "home.stats.companies": "شركات",
  "home.news.title": "آخر الإعلانات",
  "home.news.empty": "لا توجد إعلانات بعد.",
  "home.trusted": "يثقون بنا",
  "home.popular.title": "أكثر الوظائف طلبا",
  "home.popular.subtitle": "اكتشف أكثر المناصب طلبا في العمل الحر والدوام الكامل",
  "home.fulltime": "مناصب بدوام كامل",
  "home.freelance": "فرص عمل حر",
  "home.openPositions": "{count} منصب متاح",
  "home.noOpenPositions": "لا توجد مناصب مفتوحة",
  "home.lookFor": "استعرض {count} فرصة ->",
  "home.showAll": "عرض الكل",
  "home.featured": "إعلانات مميزة",
  "home.loadingFeatured": "جار تحميل الوظائف المميزة...",
  "home.featured.empty": "لا توجد وظائف متاحة حاليا. تابع معنا قريبا!",
  "home.talent.badge": "لوحة المواهب",
  "home.talent.title": "يمكن لأصحاب العمل الآن تصفح عروض الباحثين عن عمل بتفاصيل أكثر",
  "home.talent.desc": "يمكن للمترشحين نشر بطاقات موهبة غنية تتضمن التوفر وتوقعات الراتب والمهارات وروابط التواصل لمساعدة الشركات على إيجاد الشخص المناسب أسرع.",
  "home.talent.employerCta": "فتح لوحة صاحب العمل",
  "home.talent.candidateCta": "إنشاء عرض موهبة",
  "home.talent.empty": "لم يتم نشر أي عروض مواهب بعد.",
  "home.how.title": "كيف تعمل مِهنة",
  "home.how.workers": "للعمال",
  "home.how.business": "لأصحاب الأعمال",
  "home.worker.1.title": "أنشئ ملفك الشخصي",
  "home.worker.1.text": "سجل وابن ملفك المهني بمهاراتك وخبرتك.",
  "home.worker.2.title": "تصفح الوظائف",
  "home.worker.2.text": "ابحث وفلتر آلاف الإعلانات. اعثر على مهام حرة ووظائف دائمة ومشاريع تناسب خبرتك.",
  "home.worker.3.title": "قدّم بسهولة",
  "home.worker.3.text": "أرسل طلباتك مباشرة عبر المنصة وتابع حالتها في الوقت الحقيقي.",
  "home.worker.4.title": "احصل على عمل",
  "home.worker.4.text": "تواصل مع أصحاب العمل وابدأ العمل. ابن سمعتك عبر التقييمات والمراجعات.",
  "home.business.1.title": "انشر وظيفة",
  "home.business.1.text": "بعد إنشاء حساب، قم بنشر قوائم الوظائف التفصيلية في دقائق. حدد المتطلبات والميزانية والجدول الزمني.",
  "home.business.2.title": "راجع المترشحين",
  "home.business.2.text": "تصفح مترشحين مؤهلين بملفات موثقة. فلتر حسب المهارات والخبرة والتقييمات.",
  "home.business.3.title": "تواصل ووظف",
  "home.business.3.text": "قابل واختر أفضل المواهب. تواصل مباشرة عبر المنصة.",
  "home.business.4.title": "أدر المشاريع",
  "home.business.4.text": "تابع التقدم وادفع بأمان. اترك ملاحظات وابن فريقك.",
  "search.placeholder": "ابحث بعنوان الوظيفة أو المنصب أو الكلمة المفتاحية...",
  "search.filters": "الفلاتر",
  "search.savedOnly": "الوظائف المحفوظة",
  "search.reset": "إعادة ضبط الفلاتر",
  "search.results": "تم العثور على {count} وظيفة",
  "search.empty.title": "لا توجد وظائف",
  "search.empty.desc": "جرب تعديل الفلاتر أو كلمات البحث.",
  "search.saved.title": "الوظائف المحفوظة",
  "search.saved.desc": "وصول سريع للوظائف التي حفظتها.",
  "search.loading": "جار تحميل الوظائف...",
  "auth.privacy.title": "شروط الخصوصية",
  "auth.privacy.intro": "قبل إنهاء ملفك الشخصي، يرجى مراجعة وقبول شروط الخصوصية وسياسات الموقع. هذا يضمن إنشاء حسابك بالموافقة الصحيحة.",
  "auth.privacy.p1": "نجمع معلومات الحساب الأساسية لربطك بأصحاب العمل. يبقى رقم هاتفك وروابط التواصل خاصة حتى تختار مشاركتها في ملفك. لا نبيع بياناتك الشخصية ونحافظ على أمانها.",
  "auth.privacy.p2": "بقبولك، توافق على شروط الاستخدام وسياسة الخصوصية والاستخدام المسؤول للمنصة، وتؤكد أن معلومات ملفك دقيقة.",
  "auth.privacy.p3": "يمكنك تخطي التفاصيل الاختيارية لاحقا، لكن قبول هذه الشروط مطلوب للمتابعة.",
  "auth.privacy.accept": "قرأت وأوافق على شروط الخصوصية وسياسة استخدام البيانات وشروط الخدمة.",
  "auth.privacy.continue": "المتابعة لإعداد الملف",
  "auth.finish.title": "أكمل ملفك الشخصي",
  "auth.finish.uploadCv": "رفع السيرة الذاتية",
  "auth.finish.cvHint": "PDF أو DOC أو DOCX. يمكنك تخطي هذا الآن.",
  "auth.finish.skip": "تخطي التفاصيل الاختيارية والدخول",
  "auth.finish.save": "حفظ والدخول",
  "auth.login.title": "سجل الدخول إلى حسابك.",
  "auth.register.title": "إنشاء حساب.",
  "auth.noAccount": "ليس لديك حساب؟ ",
  "auth.hasAccount": "لديك حساب بالفعل؟ ",
  "auth.signUp": "إنشاء حساب",
  "auth.logIn": "تسجيل الدخول",
  "auth.firstName": "الاسم",
  "auth.lastName": "اللقب",
  "auth.companyName": "اسم الشركة",
  "auth.email": "عنوان البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.confirmPassword": "تأكيد كلمة المرور",
  "auth.workPreference": "تفضيل العمل",
  "auth.passwordStrength": "قوة كلمة المرور",
  "auth.wilaya": "الولاية",
  "auth.age": "العمر",
  "auth.gender": "الجنس",
  "auth.side.title": "أكثر من {count} مترشح\nينتظرون أصحاب عمل رائعين.",
  "auth.side.liveJobs": "وظائف نشطة",
  "auth.side.companies": "شركات",
  "auth.side.newJobs": "وظائف جديدة",
  "profile.loginRequired.title": "سجل الدخول لعرض ملفك",
  "profile.loginRequired.desc": "لوحة التحكم ونشاط الوظائف والإعدادات متاحة بعد تسجيل الدخول.",
  "profile.dashboard.employer": "لوحة صاحب العمل",
  "profile.dashboard.candidate": "لوحة المترشح",
  "profile.account.employer": "حساب صاحب عمل",
  "profile.account.candidate": "مستقل / باحث عن عمل",
  "profile.strength": "قوة الملف {count}%",
  "profile.activeJobs": "{count} وظائف نشطة",
  "profile.talentOffersCount": "{count} عروض موهبة",
  "profile.edit": "تعديل الملف",
  "profile.logout": "تسجيل الخروج",
  "profile.tabs.overview": "نظرة عامة",
  "profile.tabs.offers": "عروض المواهب",
  "profile.tabs.applied": "الوظائف المتقدم لها",
  "profile.tabs.saved": "الوظائف المحفوظة",
  "profile.tabs.settings": "الإعدادات",
  "profile.tabs.jobs": "وظائفي",
  "profile.tabs.applicants": "المترشحون",
  "profile.tabs.talent": "لوحة المواهب",
  "profile.stats.jobsPosted": "وظائف منشورة",
  "profile.stats.talentOffers": "عروض مواهب",
  "profile.stats.applicantsReceived": "مترشحون مستلمون",
  "profile.stats.applicationsSent": "طلبات مرسلة",
  "profile.stats.talentOffersLive": "عروض مواهب نشطة",
  "profile.stats.savedJobs": "وظائف محفوظة",
  "profile.stats.profileStrength": "قوة الملف",
  "profile.recentApplicants": "آخر المترشحين",
  "profile.recentApplicants.desc": "اطلع على آخر الطلبات وتواصل مباشرة.",
  "profile.hiring": "توظيف",
  "profile.loadingApplicants": "جار تحميل المترشحين...",
  "profile.noApplicants": "لا يوجد مترشحون بعد. شارك وظائفك وسيظهرون هنا.",
  "profile.yourTalentOffers": "عروض مواهبك",
  "profile.freshTalent": "مواهب جديدة",
  "profile.yourJobseekingOffers": "عروض بحثك عن عمل",
  "profile.appliedJobs": "الوظائف المتقدم لها",
  "profile.savedJobs": "الوظائف المحفوظة",
  "profile.yourJobPostings": "وظائفك المنشورة",
  "profile.applicants": "المترشحون",
  "profile.talentBoard": "لوحة المواهب",
  "profile.settings": "الإعدادات",
  "profile.appearance": "المظهر",
  "profile.profilePhoto": "صورة الملف",
  "profile.uploadImage": "رفع صورة",
  "profile.saveChanges": "حفظ التغييرات",
  "profile.informationSaved": "تم حفظ معلومات الملف",
  "profile.saveFailed": "تعذر حفظ الملف. حاول مرة أخرى.",
  "profile.candidateOfferDesc": "هذا ما يراه أصحاب العمل عند تصفح عروض المترشحين.",
  "profile.detailedTalentCards": "بطاقات مواهب مفصلة يمكن لأصحاب العمل تصفحها من المنصة.",
  "profile.reviewAppliedRoles": "راجع الوظائف التي تقدمت إليها بالفعل.",
  "profile.jobsMarkedLater": "الوظائف التي وضعت إشارة عليها لمراجعتها لاحقا.",
  "profile.settingsDesc": "إدارة المظهر وتفضيلات الملف الشخصي.",
  "profile.appearanceDesc": "اختر الوضع الفاتح أو الداكن للموقع.",
  "profile.createNew": "إنشاء جديد",
  "profile.noTalentOffers": "لا توجد عروض موهبة بعد. انشر واحدا حتى يتمكن أصحاب العمل من اكتشاف ملفك.",
  "profile.createOffer": "إنشاء عرض",
  "profile.noOffersPublished": "لم تنشر أي عروض موهبة بعد.",
  "job.notFound.title": "الوظيفة غير موجودة",
  "job.notFound.desc": "ربما تمت إزالة هذا الإعلان أو لم يعد متاحا.",
  "job.backToJobs": "العودة للوظائف",
  "job.yourListing": "إعلانك",
  "job.type": "نوع الوظيفة",
  "job.justNow": "الآن",
  "job.minutesAgo": "منذ {mins} دقيقة",
  "job.hoursAgo": "منذ {hrs} ساعة",
  "job.daysAgo": "منذ {days} يوم",
  "job.description": "وصف الوظيفة",
  "job.responsibilities": "المسؤوليات الرئيسية",
  "job.skills": "المهارات المهنية",
  "job.tags": "الوسوم:",
  "job.share": "مشاركة:",
  "job.related": "وظائف مشابهة",
  "job.overview": "نظرة عامة على الوظيفة",
  "job.apply": "التقديم لهذه الوظيفة",
  "job.openDashboard": "فتح لوحة التحكم",
  "job.applicationRecorded": "تم تسجيل الطلب",
  "job.viewProfile": "عرض الملف",
  "job.contactMethod": "طريقة التواصل",
  "job.savedContactShortcuts": "اختصارات التواصل المحفوظة لديك",
  "job.applyLogin": "سجل الدخول للتقديم",
  "job.applyNow": "قدّم الآن",
  "job.applied": "تم التقديم",
  "job.posted": "نشر",
  "postAnnouncement.login.title": "سجل الدخول لإنشاء عرض موهبة",
  "postAnnouncement.login.desc": "اعرض مهاراتك وتوفرك لأصحاب العمل في الجزائر عبر منشور احترافي للبحث عن عمل.",
  "postAnnouncement.login.cta": "ابدأ الآن",
  "postAnnouncement.employer.title": "عروض المواهب مخصصة للمترشحين",
  "postAnnouncement.employer.desc": "يجب على حسابات أصحاب العمل نشر وظائف حتى يتمكن المترشحون من التقديم مباشرة.",
  "postAnnouncement.employer.cta": "الذهاب لنشر وظيفة",
  "postAnnouncement.badge": "عرض موهبة",
  "postAnnouncement.title": "أنشئ عرض بحث عن عمل يرغب أصحاب العمل في قراءته",
  "postAnnouncement.desc": "حوّل ملفك إلى عرض مفصل يتضمن دورك وخبرتك وتوفرك والأجر المتوقع وطرق التواصل المباشر.",
  "postAnnouncement.headline": "العنوان",
  "postAnnouncement.headlinePlaceholder": "مثال: مطور React متاح للعمل الحر والدوام الكامل",
  "postAnnouncement.professionalTitle": "المسمى المهني",
  "postAnnouncement.professionalTitlePlaceholder": "مطور واجهات، مترجم، مصمم واجهات...",
  "postAnnouncement.categoryPlaceholder": "تطوير، تصميم، تسويق...",
  "postAnnouncement.preferredLocation": "الموقع المفضل",
  "postAnnouncement.experienceLevel": "مستوى الخبرة",
  "postAnnouncement.yearsExperience": "سنوات الخبرة",
  "postAnnouncement.expectedSalary": "الراتب / الميزانية المتوقعة",
  "postAnnouncement.salaryPeriod": "فترة الراتب",
  "postAnnouncement.offerDetails": "تفاصيل العرض",
  "postAnnouncement.detailsPlaceholder": "صف خبرتك وخدماتك والمجالات التي تعرفها والأدوات التي تستخدمها ونوع الشركات أو المشاريع التي تريد العمل معها.",
  "postAnnouncement.portfolioWebsite": "معرض الأعمال / الموقع",
  "postAnnouncement.contactEmail": "بريد التواصل",
  "postAnnouncement.publishing": "جار النشر...",
  "postAnnouncement.publish": "نشر عرض الموهبة",
  "postAnnouncement.mustLogin": "يجب تسجيل الدخول لإنشاء عرض موهبة.",
  "postAnnouncement.requiredToast": "املأ العنوان والدور والفئة والتفاصيل.",
  "postAnnouncement.successToast": "تم نشر عرض الموهبة",
  "postAnnouncement.failedToast": "فشل نشر عرض الموهبة.",
  "postAnnouncement.employerToast": "حسابات أصحاب العمل يجب أن تستخدم مسار نشر الوظائف.",
  "postAnnouncement.tip.role.title": "كن دقيقا بشأن دورك",
  "postAnnouncement.tip.role.text": "أصحاب العمل يقرؤون بسرعة. عنوان وفئة واضحان يجعلان ملفك يظهر في السياق الصحيح.",
  "postAnnouncement.tip.pay.title": "أضف أجرك المتوقع",
  "postAnnouncement.tip.pay.text": "مشاركة راتب شهري أو ميزانية مشروع تساعد أصحاب العمل على تقييمك أسرع.",
  "postAnnouncement.tip.availability.title": "أظهر توفرك بوضوح",
  "postAnnouncement.tip.availability.text": "التوفر الفوري أو الجزئي أو فترات المشاريع قد تكون عامل الحسم.",
  "postAnnouncement.tip.location.title": "اذكر الموقع والمرونة",
  "postAnnouncement.tip.location.text": "أخبر أصحاب العمل إن كنت تفضل العمل المحلي أو عن بعد أو الهجين.",
  "postAnnouncement.tip.proof.title": "أضف دليلا على عملك",
  "postAnnouncement.tip.proof.text": "رابط Portfolio أو GitHub أو Behance أو LinkedIn يجعل عرضك أقوى.",
  "postAnnouncement.headlineBoth": "اعرض ملفك المهني",
  "postAnnouncement.subtitleBoth": "دع أصحاب العمل يعرفون مهاراتك والفرص التي تبحث عنها.",
  "postAnnouncement.browseAll": "تصفح كل التصنيفات",
  "postAnnouncement.hideAll": "إخفاء التصنيفات",
  "postAnnouncement.loadingWilayas": "جار تحميل الولايات...",
  "postJob.employerRequired": "حساب صاحب عمل مطلوب",
  "postJob.review": "راجع إعلانك",
  "postJob.timeframe": "الإطار الزمني",
  "postJob.skillsRequirements": "المهارات أو المتطلبات",
  "postJob.suggested.desc": "أمثلة مطابقة لنوع النشر الذي اخترته أعلاه.",
  "text.Development": "التطوير",
  "text.Education": "التعليم",
  "text.Hospitality": "الضيافة",
  "text.Design": "التصميم",
  "text.Translator": "الترجمة",
  "text.Copywriting": "كتابة المحتوى",
  "text.Junior": "مبتدئ",
  "text.Mid-level": "متوسط",
  "text.Senior": "خبير",
  "text.Lead": "قائد",
  "text.Open": "مفتوح",
  "text.Available immediately": "متاح فورا",
  "text.Available this week": "متاح هذا الأسبوع",
  "text.Available this month": "متاح هذا الشهر",
  "text.Open to discussion": "مفتوح للنقاش",
  "text.Web Development": "تطوير الويب",
  "text.Graphic Design": "تصميم جرافيك",
  "text.Mobile Development": "تطوير تطبيقات الجوال",
  "text.UI/UX Design": "تصميم واجهات وتجربة المستخدم",
  "text.Logo and Brand Identity": "شعار وهوية العلامة التجارية",
  "text.Content Writing": "كتابة المحتوى",
  "text.Translation": "الترجمة",
  "text.Video Editing": "مونتاج فيديو",
  "text.Photography": "التصوير الفوتوغرافي",
  "text.Digital Marketing": "التسويق الرقمي",
  "text.Social Media Management": "إدارة وسائل التواصل الاجتماعي",
  "text.SEO": "تحسين محركات البحث",
  "text.Paid Ads": "الإعلانات المدفوعة",
  "text.E-commerce Development": "تطوير التجارة الإلكترونية",
  "text.Shopify Development": "تطوير شوبيفاي",
  "text.Data Entry": "إدخال البيانات",
  "text.Virtual Assistant": "مساعد افتراضي",
  "text.Customer Support": "دعم العملاء",
  "text.Technical Support": "دعم فني",
  "text.Accounting Help": "مساعدة محاسبية",
  "text.Administrative Support": "دعم إداري",
  "text.Legal Consulting": "استشارات قانونية",
  "text.Engineering Design": "تصميم هندسي",
  "text.Architecture Design": "تصميم معماري",
  "text.Game Development": "تطوير الألعاب",
  "text.Software Developer": "مطور برمجيات",
  "text.Web Developer": "مطور ويب",
  "text.Mobile Developer": "مطور تطبيقات جوال",
  "text.IT Support": "دعم تقنية المعلومات",
  "text.Network Administrator": "مدير شبكات",
  "text.Data Analyst": "محلل بيانات",
  "text.Cybersecurity Specialist": "أخصائي أمن سيبراني",
  "text.Doctor / Nurse": "طبيب / ممرض",
  "text.Pharmacist": "صيدلي",
  "text.Medical Technician": "فني طبي",
  "text.Dentist": "طبيب أسنان",
  "text.Sales Representative": "ممثل مبيعات",
  "text.Account Manager": "مدير حسابات",
  "text.Marketing Specialist": "أخصائي تسويق",
  "text.Social Media Manager": "مدير وسائل التواصل",
  "text.Teacher / Trainer": "معلم / مدرب",
  "text.Professor": "أستاذ",
  "text.Accountant": "محاسب",
  "text.Financial Analyst": "محلل مالي",
  "text.Store Manager": "مدير متجر",
  "text.Cashier": "أمين صندوق",
  "text.Warehouse Worker": "عامل مستودع",
  "text.Delivery Driver": "سائق توصيل",
  "text.Driver": "سائق",
  "text.Receptionist": "موظف استقبال",
  "text.Administrative Assistant": "مساعد إداري",
  "text.Customer Service": "خدمة عملاء",
  "text.Call Center Agent": "وكيل مركز اتصال",
  "text.Security Guard": "حارس أمن",
  "text.Restaurant Worker": "عامل مطعم",
  "text.Chef / Cook": "شيف / طباخ",
  "text.Hotel Staff": "طاقم فندق",
  "text.Construction Worker": "عامل بناء",
  "text.Electrician": "كهربائي",
  "text.Plumber": "سباك",
  "text.Mechanic": "ميكانيكي",
  "text.Technician": "فني",
  "text.Designer": "مصمم",
  "text.Graphic Designer": "مصمم جرافيك",
  "text.Content Creator": "صانع محتوى",
  "text.HR Specialist": "أخصائي موارد بشرية",
  "text.Lawyer / Legal Advisor": "محام / مستشار قانوني",
  "text.Developers": "مطورون",
  "text.Web Developers": "مطورو ويب",
  "text.Mobile Developers": "مطورو تطبيقات جوال",
  "text.Designers": "مصممون",
  "text.Graphic Designers": "مصممو جرافيك",
  "text.UI/UX Designers": "مصممو واجهات وتجربة المستخدم",
  "text.Marketing Team": "فريق التسويق",
  "job.employerPostJob": "نشر وظيفة",
  "job.employerPostDesc": "تبحث عن توظيف؟ انشر وظيفة لجذب المترشحين.",
  "job.yourListingDesc": "هذا إعلانك. يمكنك إدارته من لوحة التحكم.",
  "postAnnouncement.step.mainInfo": "المعلومات الرئيسية",
  "postAnnouncement.step.describe": "الوصف",
  "postAnnouncement.step.details": "التفاصيل",
  "postAnnouncement.back": "رجوع",
  "postAnnouncement.nextStep": "الخطوة التالية",
  "postAnnouncement.continueDetails": "متابعة إلى التفاصيل",
  "postAnnouncement.reviewHeadline": "العنوان",
  "postAnnouncement.reviewTitle": "المسمى المهني",
  "postAnnouncement.reviewCategory": "الفئة",
  "postAnnouncement.reviewDetails": "التفاصيل",
  "postAnnouncement.tagsLabel": "الوسوم",
  "postAnnouncement.tagsPlaceholder": "اكتب أو اختر الوسوم",
  "postAnnouncement.detailsHint": "اشرح خبرتك وخدماتك ونوع الفرص التي تبحث عنها.",
  "postAnnouncement.freelance.title": "أنشئ عرض عمل حر يجذب العملاء",
  "postAnnouncement.freelance.desc": "قدّم خدماتك كمستقل مع مهاراتك وأسعارك وتوفرك للمشاريع.",
  "postAnnouncement.fulltime.title": "أنشئ عرض بحث عن دوام كامل يرغب أصحاب العمل في قراءته",
  "postAnnouncement.fulltime.desc": "ضع نفسك كمترشح جاد مع خبرتك وتوقعاتك وأهدافك المهنية."
};
const dictionaries = { en, ar, fr };
function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
function readLocale() {
  if (typeof window === "undefined") return "en";
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "ar" || raw === "fr" || raw === "en" ? raw : "en";
}
const I18nContext = createContext(null);
function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState("en");
  const dir = locale === "ar" ? "rtl" : "ltr";
  useEffect(() => {
    setLocaleState(readLocale());
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [dir, locale]);
  const value = useMemo(
    () => ({
      locale,
      dir,
      setLocale: (next) => setLocaleState(next),
      t: (key, fallback, vars) => {
        const template = dictionaries[locale][key] || dictionaries.en[key] || fallback || key;
        return interpolate(template, vars);
      },
      tt: (text, vars) => {
        const template = dictionaries[locale][`text.${text}`] || dictionaries.en[`text.${text}`] || text;
        return interpolate(template, vars);
      }
    }),
    [dir, locale]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}
const appCss = "/assets/styles-mZ8inCbS.css";
function NotFoundComponent() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-brand", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold", children: t("notfound.title", "Page not found") }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t("notfound.desc", "The page you're looking for doesn't exist.") }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90",
        children: t("notfound.home", "Go home")
      }
    ) })
  ] }) });
}
const Route$b = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mihna - Find Your Dream Job Today" },
      {
        name: "description",
        content: "Mihna connects talent with opportunity. Browse freelance, full-time, and project-based jobs across industries."
      }
    ],
    links: [
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Ubuntu:wght@400;500;700&family=Inter:wght@400;500;600;700&family=Cairo:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: () => /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, {})
  ] }) }),
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$a = () => import("./seed-VuiZIzQI.js");
const Route$a = createFileRoute("/seed")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./search-uxAkAcpJ.js");
const Route$9 = createFileRoute("/search")({
  validateSearch: (s) => ({
    q: s.q || "",
    loc: s.loc || "Anywhere",
    type: s.type || "all",
    cat: s.cat || "All categories"
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./profile-DdRxxyn0.js");
const Route$8 = createFileRoute("/profile")({
  validateSearch: (s) => ({
    tab: s.tab || void 0,
    userId: s.userId || void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./post-job-Bz6uHcji.js");
const Route$7 = createFileRoute("/post-job")({
  validateSearch: (s) => ({
    category: s.category || ""
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./post-announcement-DSx8I9nW.js");
const Route$6 = createFileRoute("/post-announcement")({
  validateSearch: (s) => ({
    category: s.category || "",
    type: s.type || "both"
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./categories-B2DIGrKL.js");
const Route$5 = createFileRoute("/categories")({
  validateSearch: (s) => ({
    type: s.type || "full-time"
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./auth-CWskVjzp.js");
const Route$4 = createFileRoute("/auth")({
  validateSearch: (s) => ({
    mode: s.mode || "register"
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./announcements-70VLQ5oc.js");
const Route$3 = createFileRoute("/announcements")({
  validateSearch: (s) => ({
    q: s.q || "",
    loc: s.loc || ""
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-CoQzPPBM.js");
const Route$2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: "Mihna - Find Your Dream Job Today"
    }, {
      name: "description",
      content: "Browse thousands of freelance and full-time jobs. Mihna connects candidates with companies."
    }]
  })
});
const $$splitComponentImporter$1 = () => import("./job._id-dbC104KB.js");
const Route$1 = createFileRoute("/job/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./announcement._id-Dq1siSfn.js");
const Route = createFileRoute("/announcement/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SeedRoute = Route$a.update({
  id: "/seed",
  path: "/seed",
  getParentRoute: () => Route$b
});
const SearchRoute = Route$9.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$b
});
const ProfileRoute = Route$8.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$b
});
const PostJobRoute = Route$7.update({
  id: "/post-job",
  path: "/post-job",
  getParentRoute: () => Route$b
});
const PostAnnouncementRoute = Route$6.update({
  id: "/post-announcement",
  path: "/post-announcement",
  getParentRoute: () => Route$b
});
const CategoriesRoute = Route$5.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => Route$b
});
const AuthRoute = Route$4.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$b
});
const AnnouncementsRoute = Route$3.update({
  id: "/announcements",
  path: "/announcements",
  getParentRoute: () => Route$b
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const JobIdRoute = Route$1.update({
  id: "/job/$id",
  path: "/job/$id",
  getParentRoute: () => Route$b
});
const AnnouncementIdRoute = Route.update({
  id: "/announcement/$id",
  path: "/announcement/$id",
  getParentRoute: () => Route$b
});
const rootRouteChildren = {
  IndexRoute,
  AnnouncementsRoute,
  AuthRoute,
  CategoriesRoute,
  PostAnnouncementRoute,
  PostJobRoute,
  ProfileRoute,
  SearchRoute,
  SeedRoute,
  AnnouncementIdRoute,
  JobIdRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
    // Disable default preload to prevent code splitting issues
    defaultPreload: false
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ApiError as A,
  DEFAULT_PROFILE_PHOTO as D,
  Route$9 as R,
  useI18n as a,
  Route$8 as b,
  apiRequest as c,
  Route$7 as d,
  Route$6 as e,
  Route$5 as f,
  Route$4 as g,
  Route$3 as h,
  Route$1 as i,
  Route as j,
  router as r,
  useAuth as u
};
