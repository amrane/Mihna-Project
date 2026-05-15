import { useState, useCallback, useEffect } from "react";
import { c as apiRequest } from "./router-Bte9I49t.js";
const DEFAULT_WILAYAS = [
  { name: "Adrar", code: "01" },
  { name: "Chlef", code: "02" },
  { name: "Laghouat", code: "03" },
  { name: "Oum El Bouaghi", code: "04" },
  { name: "Batna", code: "05" },
  { name: "Bejaia", code: "06" },
  { name: "Biskra", code: "07" },
  { name: "Bechar", code: "08" },
  { name: "Blida", code: "09" },
  { name: "Bouira", code: "10" },
  { name: "Tamanrasset", code: "11" },
  { name: "Tebessa", code: "12" },
  { name: "Tlemcen", code: "13" },
  { name: "Tiaret", code: "14" },
  { name: "Tizi Ouzou", code: "15" },
  { name: "Alger", code: "16" },
  { name: "Djelfa", code: "17" },
  { name: "Jijel", code: "18" },
  { name: "Setif", code: "19" },
  { name: "Saida", code: "20" },
  { name: "Skikda", code: "21" },
  { name: "Sidi Bel Abbes", code: "22" },
  { name: "Annaba", code: "23" },
  { name: "Guelma", code: "24" },
  { name: "Constantine", code: "25" },
  { name: "Medea", code: "26" },
  { name: "Mostaganem", code: "27" },
  { name: "M'Sila", code: "28" },
  { name: "Mascara", code: "29" },
  { name: "Ouargla", code: "30" },
  { name: "Oran", code: "31" },
  { name: "El Bayadh", code: "32" },
  { name: "Illizi", code: "33" },
  { name: "Bordj Bou Arreridj", code: "34" },
  { name: "Boumerdes", code: "35" },
  { name: "El Tarf", code: "36" },
  { name: "Tindouf", code: "37" },
  { name: "Tissemsilt", code: "38" },
  { name: "El Oued", code: "39" },
  { name: "Khenchela", code: "40" },
  { name: "Souk Ahras", code: "41" },
  { name: "Tipaza", code: "42" },
  { name: "Mila", code: "43" },
  { name: "Ain Defla", code: "44" },
  { name: "Naama", code: "45" },
  { name: "Ain Temouchent", code: "46" },
  { name: "Ghardaia", code: "47" },
  { name: "Relizane", code: "48" },
  { name: "Timimoun", code: "49" },
  { name: "Bordj Badji Mokhtar", code: "50" },
  { name: "Ouled Djellal", code: "51" },
  { name: "Beni Abbes", code: "52" },
  { name: "In Salah", code: "53" },
  { name: "In Guezzam", code: "54" },
  { name: "Touggourt", code: "55" },
  { name: "Djanet", code: "56" },
  { name: "El M'Ghair", code: "57" },
  { name: "El Meniaa", code: "58" }
];
const DEFAULT_DAIRAS = [];
let wilayasCache = null;
let dairasCache = null;
async function getWilayas() {
  if (wilayasCache === null) {
    wilayasCache = DEFAULT_WILAYAS.map((wilaya, index) => ({
      ...wilaya,
      order: wilaya.order ?? index + 1
    }));
  }
  return wilayasCache;
}
async function getDairas() {
  if (dairasCache === null) {
    dairasCache = [...DEFAULT_DAIRAS];
  }
  return dairasCache;
}
function useAsyncCollection(load, deps) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
function useFirestoreCollection(collectionName, orderField, filterField, filterValue) {
  return useAsyncCollection(async () => {
    const params = new URLSearchParams();
    if (orderField) params.set("orderField", orderField);
    if (filterField && filterValue !== void 0) {
      params.set("filterField", filterField);
      params.set("filterValue", String(filterValue));
    }
    const query = params.toString();
    return apiRequest(`/data/${collectionName}${query ? `?${query}` : ""}`);
  }, [collectionName, orderField, filterField, filterValue]);
}
function useFirestoreDocument(collectionName, documentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest(`/data/${collectionName}/${documentId}`);
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
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const addJob = useCallback(
    async (jobData) => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const response = await apiRequest("/jobs", {
          method: "POST",
          auth: true,
          body: jobData
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
    []
  );
  return { addJob, loading, error, result };
}
function useWilayas() {
  return useAsyncCollection(async () => getWilayas(), []);
}
export {
  useAddJob as a,
  useWilayas as b,
  useFirestoreDocument as c,
  getDairas as d,
  getWilayas as g,
  useFirestoreCollection as u
};
