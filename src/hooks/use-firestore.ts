import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import {
  getDairas,
  getDairasByWilaya,
  getWilayas,
  type Daira,
  type Wilaya,
} from "@/lib/wilaya-data";
import type {
  Announcement,
  CategoryItem,
  DairaItem,
  Job,
  LocationItem,
  PopularJob,
  StatsItem,
  TrustedByItem,
  User,
  WilayaItem,
} from "@/lib/api-types";

export type {
  Announcement,
  CategoryItem,
  DairaItem,
  Job,
  LocationItem,
  PopularJob,
  StatsItem,
  TrustedByItem,
  User,
  WilayaItem,
};

function useAsyncCollection<T>(load: () => Promise<T[]>, deps: unknown[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await load();
        if (!active) return;
        setData(result);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error };
}

function useFirestoreCollection<T>(
  collectionName: string,
  orderField?: string,
  filterField?: string,
  filterValue?: unknown,
) {
  return useAsyncCollection<T>(async () => {
    const params = new URLSearchParams();

    if (orderField) params.set("orderField", orderField);
    if (filterField && filterValue !== undefined) {
      params.set("filterField", filterField);
      params.set("filterValue", String(filterValue));
    }

    const query = params.toString();
    return apiRequest<T[]>(`/data/${collectionName}${query ? `?${query}` : ""}`);
  }, [collectionName, orderField, filterField, filterValue]);
}

function useFirestoreDocument<T>(collectionName: string, documentId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiRequest<T>(`/data/${collectionName}/${documentId}`);
        if (!active) return;
        setData(result);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load document.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [collectionName, documentId]);

  return { data, loading, error };
}

function useAddJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const addJob = useCallback(
    async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "postedAgo">) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await apiRequest<{ id: string }>("/jobs", {
          method: "POST",
          auth: true,
          body: jobData,
        });
        setResult(response.id);
        return response.id;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add job.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { addJob, loading, error, result };
}

function useUpdateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateJob = useCallback(async (jobId: string, jobData: Partial<Job>) => {
    setLoading(true);
    setError(null);

    try {
      await apiRequest(`/jobs/${jobId}`, {
        method: "PATCH",
        auth: true,
        body: jobData,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateJob, loading, error };
}

function useDeleteJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteJob = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiRequest(`/jobs/${jobId}`, {
        method: "DELETE",
        auth: true,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteJob, loading, error };
}

function useAddUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const addUser = useCallback(async (_userData: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      throw new Error("Direct user creation is not supported. Use the registration flow.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add user.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addUser, loading, error, result };
}

function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (_userId: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      await apiRequest("/users/me", {
        method: "PATCH",
        auth: true,
        body: userData,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
}

function useJobs(activeOnly = true) {
  return useAsyncCollection<Job>(async () => {
    const params = new URLSearchParams();
    if (activeOnly) {
      params.set("filterField", "isActive");
      params.set("filterValue", "true");
    }
    params.set("orderField", "createdAt");
    return apiRequest<Job[]>(`/data/jobs?${params.toString()}`);
  }, [activeOnly]);
}

function useUserByUid(uid: string) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setData(null);
      setLoading(false);
      return;
    }

    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiRequest<{ user: User }>(`/users/by-uid/${uid}`);
        if (!active) return;
        setData(response.user);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load user.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [uid]);

  return { data, loading, error };
}

function useWilayas() {
  return useAsyncCollection<Wilaya>(async () => getWilayas(), []);
}

function useDairas() {
  return useAsyncCollection<Daira>(async () => getDairas(), []);
}

function useDairasByWilayaCode(wilayaCode: string) {
  return useAsyncCollection<Daira>(async () => getDairasByWilaya(wilayaCode), [wilayaCode]);
}

export {
  useFirestoreCollection,
  useFirestoreDocument,
  useAddJob,
  useUpdateJob,
  useDeleteJob,
  useAddUser,
  useUpdateUser,
  useJobs,
  useUserByUid,
  useWilayas,
  useDairas,
  useDairasByWilayaCode as useDairasByWilaya,
};
