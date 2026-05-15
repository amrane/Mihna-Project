export interface Wilaya {
  name: string;
  code: string;
  nameAr?: string;
  isRemote?: boolean;
  order?: number;
}

export interface Daira {
  name: string;
  wilayaCode: string;
  wilayaName: string;
}

const DEFAULT_WILAYAS: Wilaya[] = [
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
  { name: "El Meniaa", code: "58" },
];

const DEFAULT_DAIRAS: Daira[] = [];

let wilayasCache: Wilaya[] | null = null;
let dairasCache: Daira[] | null = null;

export async function getWilayas(): Promise<Wilaya[]> {
  if (wilayasCache === null) {
    wilayasCache = DEFAULT_WILAYAS.map((wilaya, index) => ({
      ...wilaya,
      order: wilaya.order ?? index + 1,
    }));
  }

  return wilayasCache;
}

export async function getDairas(): Promise<Daira[]> {
  if (dairasCache === null) {
    dairasCache = [...DEFAULT_DAIRAS];
  }

  return dairasCache;
}

export async function getWilayaNames(): Promise<string[]> {
  const wilayas = await getWilayas();
  return wilayas.map((wilaya) => wilaya.name).sort();
}

export async function getDairaNames(): Promise<string[]> {
  const dairas = await getDairas();
  return dairas.map((daira) => daira.name).sort();
}

export async function getDairasForWilaya(wilayaCode: string): Promise<Daira[]> {
  const dairas = await getDairas();
  return dairas.filter((daira) => daira.wilayaCode === wilayaCode);
}

export async function getDairasByWilaya(wilayaCode: string): Promise<Daira[]> {
  return getDairasForWilaya(wilayaCode);
}
