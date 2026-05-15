import { apiRequest } from "@/lib/api-client";
import type {
  Application, 
  Announcement,
  AppNotification,
  CategoryItem as Category,
  Job,
  LocationItem as Location,
  StatsItem as Stats,
  User,
} from "@/lib/api-types";

async function getAll<T>(
  collectionName: string,
  orderField?: string,
  filterField?: string,
  filterValue?: unknown,
) {
  const params = new URLSearchParams();
  if (orderField) params.set("orderField", orderField);
  if (filterField && filterValue !== undefined) {
    params.set("filterField", filterField);
    params.set("filterValue", String(filterValue));
  }

  return apiRequest<T[]>(`/data/${collectionName}${params.size ? `?${params.toString()}` : ""}`);
}

async function getById<T>(collectionName: string, id: string) {
  return apiRequest<T>(`/data/${collectionName}/${id}`);
}

export const userService = {
  async getByUid(uid: string): Promise<User | null> {
    try {
      const response = await apiRequest<{ user: User }>(`/users/by-uid/${uid}`);
      return response.user;
    } catch {
      return null;
    }
  },
};

export const jobService = {
  async getAll(): Promise<Job[]> {
    return getAll<Job>("jobs", "createdAt");
  },

  async getById(id: string): Promise<Job | null> {
    try {
      return await getById<Job>("jobs", id);
    } catch {
      return null;
    }
  },

  async create(data: Omit<Job, "id" | "createdAt" | "updatedAt" | "postedAgo">): Promise<string> {
    const response = await apiRequest<{ id: string }>("/jobs", {
      method: "POST",
      auth: true,
      body: data,
    });
    return response.id;
  },

  async update(id: string, data: Partial<Job>): Promise<boolean> {
    await apiRequest(`/jobs/${id}`, {
      method: "PATCH",
      auth: true,
      body: data,
    });
    return true;
  },

  async remove(id: string): Promise<boolean> {
    await apiRequest(`/jobs/${id}`, {
      method: "DELETE",
      auth: true,
    });
    return true;
  },
};

export const announcementService = {
  async getAll(): Promise<Announcement[]> {
    return getAll<Announcement>("announcements", "createdAt");
  },

  async getById(id: string): Promise<Announcement | null> {
    try {
      return await getById<Announcement>("announcements", id);
    } catch {
      return null;
    }
  },

  async getTalentOffers(): Promise<Announcement[]> {
    return getAll<Announcement>("announcements", "createdAt", "announcementType", "jobseeking");
  },

  async create(data: Omit<Announcement, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const response = await apiRequest<{ id: string }>("/announcements", {
      method: "POST",
      auth: true,
      body: data,
    });
    return response.id;
  },
};

export const applicationService = {
  async getEmployerApplications(): Promise<Application[]> {
    const response = await apiRequest<{ applications: Application[] }>("/employer/applications", {
      auth: true,
    });
    return response.applications;
  },

  async getCandidateApplications(): Promise<Application[]> {
    const response = await apiRequest<{ applications: Application[] }>("/candidate/applications", {
      auth: true,
    });
    return response.applications;
  },

  async updateStatus(id: string, status: "accepted" | "rejected"): Promise<Application> {
    const response = await apiRequest<{ application: Application }>(`/applications/${id}/status`, {
      method: "PATCH",
      auth: true,
      body: { status },
    });
    return response.application;
  },
};

export const notificationService = {
  async getAll(): Promise<AppNotification[]> {
    const response = await apiRequest<{ notifications: AppNotification[] }>("/notifications", {
      auth: true,
    });
    return response.notifications;
  },

  async markAsRead(id: string): Promise<void> {
    await apiRequest(`/notifications/${id}/read`, {
      method: "POST",
      auth: true,
    });
  },

  async markAllAsRead(): Promise<void> {
    await apiRequest("/notifications/read-all", {
      method: "POST",
      auth: true,
    });
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return getAll<Category>("categories", "order");
  },
};

export const locationService = {
  async getAll(): Promise<Location[]> {
    return getAll<Location>("locations", "order");
  },
};

export const statsService = {
  async getLiveStats(): Promise<{ jobs: number; candidates: number; companies: number }> {
    const response = await apiRequest<{
      jobs: number;
      candidates: number;
      companies: number;
    }>("/stats/counts", { auth: false });
    return response;
  },
};

export async function seedAllData(): Promise<void> {
  throw new Error("Seed data is now managed by the Node.js backend on startup.");
}
