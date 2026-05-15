export interface TrustedByItem {
  name: string;
  logo: string;
  order: number;
}

export const DEFAULT_TRUSTED_BY: TrustedByItem[] = [
  { name: "Yassir", logo: "/src/assets/logos/yassir.svg", order: 0 },
  { name: "Ooredoo", logo: "/src/assets/logos/ooredoo.svg", order: 1 },
  { name: "Icosnet", logo: "/src/assets/logos/icosnet.svg", order: 2 },
  { name: "Air Algérie", logo: "/src/assets/logos/air-algerie.svg", order: 3 },
  { name: "Condor", logo: "/src/assets/logos/condor.svg", order: 4 },
  { name: "Cevital", logo: "/src/assets/logos/cevital.svg", order: 5 },
  { name: "Mobilis", logo: "/src/assets/logos/mobilis.svg", order: 6 },
  { name: "Sonatrach", logo: "/src/assets/logos/sonatrach.svg", order: 7 },
  // { name: "Stockly", logo: "/src/assets/logos/Stockly.svg",order:8 },

];
