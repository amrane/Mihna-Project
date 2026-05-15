import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import defaultAvatar from "@/assets/default-avatar.png";
import { apiRequest, setStoredAuthToken, getStoredAuthToken } from "@/lib/api-client";

export interface MihnaUser {
  id?: string;
  uid?: string;
  fullName: string;
  displayName?: string;
  username: string;
  email: string;
  location?: string;
  age?: number;
  gender?: string;
  avatar?: string;
  photoURL?: string;
  profession?: string;
  bio?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  telegram?: string;
  facebook?: string;
  cvFileName?: string;
  cvDataUrl?: string;
  acceptedRules?: boolean;
  acceptedRulesAt?: string;
  workPreference?: "freelance" | "full-time" | "both";
  companyName?: string;
  savedJobIds?: string[];
  appliedJobIds?: string[];
  role?: "jobseeker" | "employer" | "admin";
  accountType: "candidate" | "employer";
}

interface AuthCtx {
  user: MihnaUser | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (u: MihnaUser, password?: string) => Promise<void>;
  updateUser: (u: Partial<MihnaUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
  toggleSavedJob: (jobId: string) => Promise<{ saved: boolean }>;
  applyToJob: (
    jobId: string,
    details?: {
      primaryContact?: string;
      secondaryContact?: string;
      note?: string;
    },
  ) => Promise<{ applied: boolean; alreadyApplied?: boolean }>;
  logout: () => void;
}

interface AuthResponse {
  token: string;
  user: MihnaUser;
}

const Ctx = createContext<AuthCtx | null>(null);
const USER_KEY = "mihna_user";
export const DEFAULT_PROFILE_PHOTO = defaultAvatar;

function normalizeUser(user: Partial<MihnaUser> | null): MihnaUser | null {
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
    email: user.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MihnaUser | null>(null);

  const persist = (nextUser: MihnaUser | null, token?: string | null) => {
    const normalized = normalizeUser(nextUser);
    setUser(normalized);

    if (typeof window !== "undefined") {
      if (normalized) {
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    }

    if (token !== undefined) {
      setStoredAuthToken(token);
    }
  };

  const refreshUser = async () => {
    const response = await apiRequest<{ user: MihnaUser }>("/auth/me", { auth: true });
    persist(response.user);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawUser = localStorage.getItem(USER_KEY);
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as MihnaUser;
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
        const response = await apiRequest<{ user: MihnaUser }>("/auth/me", { auth: true });
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

  return (
    <Ctx.Provider
      value={{
        user,

        login: async (email, password) => {
          const response = await apiRequest<AuthResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
          });

          persist(response.user, response.token);
        },

        register: async (newUser, password) => {
          const response = await apiRequest<AuthResponse>("/auth/register", {
            method: "POST",
            body: {
              ...newUser,
              password,
              avatar: newUser.avatar || DEFAULT_PROFILE_PHOTO,
            },
          });

          persist(response.user, response.token);
        },

        updateUser: async (updates) => {
          if (!user) return;

          const optimisticUser = normalizeUser({
            ...user,
            ...updates,
          });
          if (optimisticUser) {
            persist(optimisticUser);
          }

          try {
            const response = await apiRequest<{ user: MihnaUser }>("/users/me", {
              method: "PATCH",
              auth: true,
              body: updates,
            });
            persist(response.user);
          } catch (error) {
            persist(user);
            throw error;
          }
        },

        refreshUser,

        toggleSavedJob: async (jobId) => {
          const response = await apiRequest<{ saved: boolean; user: MihnaUser }>(
            `/jobs/${jobId}/save`,
            {
              method: "POST",
              auth: true,
            },
          );
          persist(response.user);
          return { saved: response.saved };
        },

        applyToJob: async (jobId, details) => {
          const response = await apiRequest<{
            applied: boolean;
            alreadyApplied?: boolean;
            user: MihnaUser;
          }>(`/jobs/${jobId}/apply`, {
            method: "POST",
            auth: true,
            body: details,
          });
          persist(response.user);
          return {
            applied: response.applied,
            alreadyApplied: response.alreadyApplied,
          };
        },

        logout: () => persist(null, null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const context = useContext(Ctx);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
