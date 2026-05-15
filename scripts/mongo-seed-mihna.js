import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function postedAgoLabel(days) {
  if (days === 0) return "Just now";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}
function slug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".");
}

// ─── REFERENCE DATA ────────────────────────────────────────────────────────────
const wilayas = [
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Blida",
  "Batna",
  "Sétif",
  "Tlemcen",
  "Béjaïa",
  "Biskra",
  "Tizi Ouzou",
  "Boumerdès",
  "Médéa",
  "Mostaganem",
  "Skikda",
  "Sidi Bel Abbès",
  "Jijel",
  "Guelma",
  "Chlef",
  "Tiaret",
  "Ouargla",
  "Ghardaïa",
  "El Oued",
  "Laghouat",
  "Mascara",
  "Saïda",
  "Relizane",
  "Aïn Defla",
  "Tipaza",
  "Mila",
];

const jobTypes = [
  { type: "Freelancer", typeLabel: "Freelancer" },
  { type: "Full-time", typeLabel: "Full-time" },
  { type: "Part-time", typeLabel: "Part-time" },
  { type: "Internship", typeLabel: "Internship" },
];

const workPreferences = ["onsite", "remote", "hybrid", "freelance"];
const genders = ["male", "female"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMPLOYER RAW DATA  (20 employers)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const employerData = [
  {
    fullName: "Karim Bensalem",
    email: "karim.bensalem@techdz.dz",
    companyName: "TechDz SARL",
    profession: "Directeur Technique",
    location: "Alger",
    gender: "male",
  },
  {
    fullName: "Amira Khelifi",
    email: "amira.khelifi@startdz.dz",
    companyName: "StartDZ",
    profession: "CEO & Fondatrice",
    location: "Oran",
    gender: "female",
  },
  {
    fullName: "Mohamed Hadjadj",
    email: "m.hadjadj@infraalgerie.dz",
    companyName: "InfraAlgérie",
    profession: "Responsable SI",
    location: "Constantine",
    gender: "male",
  },
  {
    fullName: "Lynda Cherif",
    email: "l.cherif@datainsight.dz",
    companyName: "DataInsight DZ",
    profession: "DRH",
    location: "Alger",
    gender: "female",
  },
  {
    fullName: "Sofiane Boudiaf",
    email: "s.boudiaf@cosider.dz",
    companyName: "COSIDER Groupe",
    profession: "Directeur RH",
    location: "Alger",
    gender: "male",
  },
  {
    fullName: "Nadia Rahmani",
    email: "n.rahmani@batisseursdz.dz",
    companyName: "Bâtisseurs DZ",
    profession: "Responsable Recrutement",
    location: "Blida",
    gender: "female",
  },
  {
    fullName: "Riad Meziane",
    email: "r.meziane@elecpro.dz",
    companyName: "ElecPro Algérie",
    profession: "Gérant",
    location: "Annaba",
    gender: "male",
  },
  {
    fullName: "Fatima Benali",
    email: "f.benali@cevital.dz",
    companyName: "Cevital",
    profession: "Chef de Recrutement",
    location: "Béjaïa",
    gender: "female",
  },
  {
    fullName: "Yacine Slimani",
    email: "y.slimani@fashionalgeria.dz",
    companyName: "Fashion Algeria",
    profession: "Directeur Commercial",
    location: "Oran",
    gender: "male",
  },
  {
    fullName: "Asma Lounes",
    email: "a.lounes@elnour-school.dz",
    companyName: "École Privée El Nour",
    profession: "Directrice Pédagogique",
    location: "Sétif",
    gender: "female",
  },
  {
    fullName: "Hamza Ferhat",
    email: "h.ferhat@cfpdz.dz",
    companyName: "Centre Formation Pro DZ",
    profession: "Responsable Formation",
    location: "Constantine",
    gender: "male",
  },
  {
    fullName: "Sara Mekki",
    email: "s.mekki@clinique-saha.dz",
    companyName: "Clinique Privée Saha",
    profession: "Directrice Administrative",
    location: "Alger",
    gender: "female",
  },
  {
    fullName: "Bilal Ouali",
    email: "b.ouali@elshifa.dz",
    companyName: "Polyclinique El Shifa",
    profession: "DRH",
    location: "Constantine",
    gender: "male",
  },
  {
    fullName: "Meriem Boukhari",
    email: "m.boukhari@yassirexpress.dz",
    companyName: "Yassir Express",
    profession: "Operations Manager",
    location: "Alger",
    gender: "female",
  },
  {
    fullName: "Amine Amrani",
    email: "a.amrani@groupemadar.dz",
    companyName: "Groupe Madar",
    profession: "Directeur Logistique",
    location: "Oran",
    gender: "male",
  },
  {
    fullName: "Houda Djalab",
    email: "h.djalab@cabinetbenali.dz",
    companyName: "Cabinet Comptable Benali",
    profession: "Associée",
    location: "Tlemcen",
    gender: "female",
  },
  {
    fullName: "Tarek Mansouri",
    email: "t.mansouri@sonatrach.dz",
    companyName: "Sonatrach",
    profession: "DRH Groupe",
    location: "Alger",
    gender: "male",
  },
  {
    fullName: "Imane Berrahou",
    email: "i.berrahou@lephenix-resto.dz",
    companyName: "Restaurant Le Phénix",
    profession: "Gérante",
    location: "Alger",
    gender: "female",
  },
  {
    fullName: "Walid Hadj",
    email: "w.hadj@sheraton-alger.dz",
    companyName: "Hôtel Sheraton Alger",
    profession: "HR Manager",
    location: "Alger",
    gender: "male",
  },
  {
    fullName: "Chaima Bensalem",
    email: "c.bensalem@agencedigitdz.dz",
    companyName: "Agence Digit DZ",
    profession: "Directrice",
    location: "Oran",
    gender: "female",
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CANDIDATE RAW DATA  (15 candidates)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const candidateData = [
  {
    fullName: "Yacine Ouali",
    email: "yacine.ouali@gmail.com",
    profession: "Développeur Full Stack",
    location: "Alger",
    gender: "male",
    workPreference: "hybrid",
    bio: "Développeur passionné avec 4 ans d'expérience en React et Node.js. Je cherche une opportunité dans une startup ou entreprise tech.",
  },
  {
    fullName: "Amira Ferhat",
    email: "amira.ferhat@gmail.com",
    profession: "Comptable Senior",
    location: "Constantine",
    gender: "female",
    workPreference: "onsite",
    bio: "Comptable avec 6 ans d'expérience en cabinet. Maîtrise de la fiscalité algérienne et du PCN.",
  },
  {
    fullName: "Sofiane Rahmani",
    email: "sofiane.rahmani@gmail.com",
    profession: "Ingénieur Génie Civil",
    location: "Blida",
    gender: "male",
    workPreference: "onsite",
    bio: "Ingénieur diplômé de l'USTHB, spécialisé en structures et projets d'infrastructure.",
  },
  {
    fullName: "Lynda Meziane",
    email: "lynda.meziane@gmail.com",
    profession: "Professeure Particulière",
    location: "Sétif",
    gender: "female",
    workPreference: "onsite",
    bio: "5 ans d'expérience en enseignement des mathématiques et physique niveau lycée.",
  },
  {
    fullName: "Karim Djalab",
    email: "karim.djalab@gmail.com",
    profession: "Community Manager",
    location: "Oran",
    gender: "male",
    workPreference: "freelance",
    bio: "Créatif et analytique. Je gère des pages Facebook et Instagram pour des PME algériennes depuis 3 ans.",
  },
  {
    fullName: "Nadia Slimani",
    email: "nadia.slimani@gmail.com",
    profession: "Chauffeuse Livreuse",
    location: "Oran",
    gender: "female",
    workPreference: "onsite",
    bio: "Permis B, véhicule personnel, disponible immédiatement pour livraisons et courses professionnelles.",
  },
  {
    fullName: "Bilal Hadjadj",
    email: "bilal.hadjadj@gmail.com",
    profession: "Infirmier Diplômé",
    location: "Annaba",
    gender: "male",
    workPreference: "onsite",
    bio: "Infirmier avec 3 ans d'expérience en clinique privée. Disponible pour gardes et vacations.",
  },
  {
    fullName: "Meriem Boudiaf",
    email: "meriem.boudiaf@gmail.com",
    profession: "Graphiste & Monteuse Vidéo",
    location: "Alger",
    gender: "female",
    workPreference: "freelance",
    bio: "Créative et polyvalente. Je produis des visuels et vidéos pour entreprises et influenceurs algériens.",
  },
  {
    fullName: "Riad Khelifi",
    email: "riad.khelifi@gmail.com",
    profession: "Mécanicien Diesel",
    location: "Blida",
    gender: "male",
    workPreference: "onsite",
    bio: "7 ans d'expérience sur moteurs diesel et engins de chantier. Maîtrise du diagnostic électronique.",
  },
  {
    fullName: "Fatima Cherif",
    email: "fatima.cherif@gmail.com",
    profession: "Chef Cuisinière",
    location: "Alger",
    gender: "female",
    workPreference: "onsite",
    bio: "10 ans de cuisine algérienne et orientale, en restauration à Alger et en France.",
  },
  {
    fullName: "Hamza Benali",
    email: "hamza.benali@gmail.com",
    profession: "Architecte",
    location: "Tizi Ouzou",
    gender: "male",
    workPreference: "freelance",
    bio: "Architecte diplômé proposant plans, permis de construire et suivi de chantier en région centre.",
  },
  {
    fullName: "Asma Lounes",
    email: "asma.lounes.trad@gmail.com",
    profession: "Traductrice Professionnelle",
    location: "Tlemcen",
    gender: "female",
    workPreference: "freelance",
    bio: "Traductrice trilingue arabe/français/anglais, spécialisée en documents juridiques et techniques.",
  },
  {
    fullName: "Mohamed Mekki",
    email: "med.mekki@gmail.com",
    profession: "Électricien Bâtiment",
    location: "Tlemcen",
    gender: "male",
    workPreference: "freelance",
    bio: "8 ans d'expérience en électricité bâtiment, travaux neufs et rénovation.",
  },
  {
    fullName: "Sara Mansouri",
    email: "sara.mansouri@gmail.com",
    profession: "Responsable RH",
    location: "Alger",
    gender: "female",
    workPreference: "onsite",
    bio: "8 ans en RH dans des groupes industriels algériens. Expertise en recrutement, paie et droit du travail.",
  },
  {
    fullName: "Ilyas Amrani",
    email: "ilyas.amrani@gmail.com",
    profession: "Data Scientist Junior",
    location: "Alger",
    gender: "male",
    workPreference: "hybrid",
    bio: "Fraîchement diplômé d'un Master IA à l'USTHB. Projets en ML, NLP et computer vision.",
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOB TEMPLATES - NOW WITH UPDATED CATEGORIES AND TAGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const jobTemplates = [
  // TechDz SARL  (employer index 0)
  {
    employerIdx: 0,
    title: "Développeur Web Full Stack",
    title_fr: "Développeur Web Full Stack",
    title_ar: "مطور ويب متكامل",
    categorySlug: "technology",
    subcategorySlug: "web-dev",
    salaryMin: 80000,
    salaryMax: 150000,
    description:
      "Nous recrutons un développeur Full Stack expérimenté pour rejoindre notre équipe à Alger. Vous travaillerez sur des projets web modernes pour des clients nationaux et internationaux.",
    description_fr:
      "Nous recrutons un développeur Full Stack expérimenté pour rejoindre notre équipe à Alger. Vous travaillerez sur des projets web modernes pour des clients nationaux et internationaux.",
    description_ar:
      "نوظف مطور متكامل ذو خبرة للانضمام إلى فريقنا في الجزائر العاصمة. ستعمل على مشاريع ويب حديثة لعملاء وطنيين ودوليين.",
    responsibilities: [
      "Développer et maintenir des applications web",
      "Collaborer avec l'équipe design",
      "Participer aux revues de code",
      "Optimiser les performances des applications",
    ],
    responsibilities_fr: [
      "Développer et maintenir des applications web",
      "Collaborer avec l'équipe design",
      "Participer aux revues de code",
      "Optimiser les performances des applications",
    ],
    responsibilities_ar: [
      "تطوير وصيانة تطبيقات الويب",
      "التعاون مع فريق التصميم",
      "المشاركة في مراجعات الكود",
      "تحسين أداء التطبيقات",
    ],
    requirements: [
      "Licence ou Master en informatique",
      "3 ans d'expérience minimum",
      "Maîtrise de React et Node.js",
      "Connaissance des bases de données SQL et NoSQL",
    ],
    requirements_fr: [
      "Licence ou Master en informatique",
      "3 ans d'expérience minimum",
      "Maîtrise de React et Node.js",
      "Connaissance des bases de données SQL et NoSQL",
    ],
    requirements_ar: [
      "شهادة ليسانس أو ماستر في الإعلام الآلي",
      "خبرة 3 سنوات كحد أدنى",
      "إتقان React و Node.js",
      "معرفة بقواعد البيانات SQL و NoSQL",
    ],
    tagSlugs: ["javascript", "react", "nodejs", "mongodb", "postgresql", "git", "restapi"],
  },

  // StartDZ  (employer index 1)
  {
    employerIdx: 1,
    title: "Développeur Mobile Android/iOS",
    title_fr: "Développeur Mobile Android/iOS",
    title_ar: "مطور تطبيقات المحمول أندرويد/آيفون",
    categorySlug: "technology",
    subcategorySlug: "mobile-dev",
    salaryMin: 70000,
    salaryMax: 120000,
    description:
      "StartDZ, startup innovante basée à Oran, cherche un développeur mobile pour créer des applications natives et cross-platform.",
    description_fr:
      "StartDZ, startup innovante basée à Oran, cherche un développeur mobile pour créer des applications natives et cross-platform.",
    description_ar:
      "ستارت دي زد، شركة ناشئة مبتكرة في وهران، تبحث عن مطور تطبيقات محمول لإنشاء تطبيقات أصلية ومتعددة المنصات.",
    responsibilities: [
      "Développer des applications mobiles natives",
      "Intégrer des APIs REST",
      "Travailler avec les équipes backend",
      "Assurer la qualité et les tests",
    ],
    responsibilities_fr: [
      "Développer des applications mobiles natives",
      "Intégrer des APIs REST",
      "Travailler avec les équipes backend",
      "Assurer la qualité et les tests",
    ],
    responsibilities_ar: [
      "تطوير تطبيقات محمول أصلية",
      "دمج واجهات REST API",
      "العمل مع فرق الباك إند",
      "ضمان الجودة والاختبارات",
    ],
    requirements: [
      "Expérience en développement mobile",
      "Connaissance de Flutter ou React Native",
      "Maîtrise de Git",
      "Sens du design UX/UI",
    ],
    requirements_fr: [
      "Expérience en développement mobile",
      "Connaissance de Flutter ou React Native",
      "Maîtrise de Git",
      "Sens du design UX/UI",
    ],
    requirements_ar: [
      "خبرة في تطوير التطبيقات المحمولة",
      "معرفة بـ Flutter أو React Native",
      "إتقان Git",
      "حس التصميم UX/UI",
    ],
    tagSlugs: ["flutter", "reactnative", "firebase", "restapi", "git", "ui-ux"],
  },

  // InfraAlgérie  (employer index 2)
  {
    employerIdx: 2,
    title: "Administrateur Systèmes & Réseaux",
    title_fr: "Administrateur Systèmes & Réseaux",
    title_ar: "مدير أنظمة وشبكات",
    categorySlug: "technology",
    subcategorySlug: "it-support",
    salaryMin: 90000,
    salaryMax: 140000,
    description:
      "InfraAlgérie recherche un admin systèmes pour gérer notre infrastructure IT à Constantine.",
    description_fr:
      "InfraAlgérie recherche un admin systèmes pour gérer notre infrastructure IT à Constantine.",
    description_ar:
      "إنفرا الجزائر تبحث عن مدير أنظمة لإدارة البنية التحتية لتكنولوجيا المعلومات في قسنطينة.",
    responsibilities: [
      "Administrer serveurs Linux/Windows",
      "Gérer les sauvegardes",
      "Maintenir la sécurité réseau",
      "Support utilisateurs niveau 2/3",
    ],
    responsibilities_fr: [
      "Administrer serveurs Linux/Windows",
      "Gérer les sauvegardes",
      "Maintenir la sécurité réseau",
      "Support utilisateurs niveau 2/3",
    ],
    responsibilities_ar: [
      "إدارة خوادم لينكس/ويندوز",
      "إدارة النسخ الاحتياطية",
      "الحفاظ على أمن الشبكة",
      "دعم المستخدمين المستوى 2/3",
    ],
    requirements: [
      "Formation en réseaux informatiques",
      "Certifications Linux (LPIC ou Red Hat)",
      "Expérience en virtualisation VMware",
      "Anglais technique",
    ],
    requirements_fr: [
      "Formation en réseaux informatiques",
      "Certifications Linux (LPIC ou Red Hat)",
      "Expérience en virtualisation VMware",
      "Anglais technique",
    ],
    requirements_ar: [
      "تدريب في الشبكات الحاسوبية",
      "شهادات لينكس (LPIC أو Red Hat)",
      "خبرة في المحاكاة الافتراضية VMware",
      "الإنجليزية التقنية",
    ],
    tagSlugs: ["linux", "cybersecurity", "aws", "docker", "networking"],
  },

  // DataInsight DZ  (employer index 3)
  {
    employerIdx: 3,
    title: "Data Scientist / Analyste IA",
    title_fr: "Data Scientist / Analyste IA",
    title_ar: "عالم بيانات / محلل ذكاء اصطناعي",
    categorySlug: "technology",
    subcategorySlug: "data-science",
    salaryMin: 100000,
    salaryMax: 180000,
    description:
      "DataInsight DZ recrute un Data Scientist pour analyser les données et développer des modèles d'IA.",
    description_fr:
      "DataInsight DZ recrute un Data Scientist pour analyser les données et développer des modèles d'IA.",
    description_ar:
      "داتا إنسايت دي زد توظف عالم بيانات لتحليل البيانات وتطوير نماذج الذكاء الاصطناعي.",
    responsibilities: [
      "Analyser de grandes volumes de données",
      "Développer des modèles ML",
      "Visualiser les résultats",
      "Présenter les insights aux décideurs",
    ],
    responsibilities_fr: [
      "Analyser de grandes volumes de données",
      "Développer des modèles ML",
      "Visualiser les résultats",
      "Présenter les insights aux décideurs",
    ],
    responsibilities_ar: [
      "تحليل كميات كبيرة من البيانات",
      "تطوير نماذج تعلم الآلة",
      "تصور النتائج",
      "تقديم الرؤى لصناع القرار",
    ],
    requirements: [
      "Master en Data Science ou IA",
      "Python (NumPy, Pandas, Scikit-learn)",
      "Connaissance du NLP",
      "Expérience en Deep Learning",
    ],
    requirements_fr: [
      "Master en Data Science ou IA",
      "Python (NumPy, Pandas, Scikit-learn)",
      "Connaissance du NLP",
      "Expérience en Deep Learning",
    ],
    requirements_ar: [
      "ماستر في علم البيانات أو الذكاء الاصطناعي",
      "بايثون (NumPy, Pandas, Scikit-learn)",
      "معرفة معالجة اللغة الطبيعية",
      "خبرة في التعلم العميق",
    ],
    tagSlugs: ["python", "machine-learning", "nlp", "data-analysis", "tensorflow"],
  },

  // COSIDER Groupe  (employer index 4)
  {
    employerIdx: 4,
    title: "Ingénieur Génie Civil",
    title_fr: "Ingénieur Génie Civil",
    title_ar: "مهندس مدني",
    categorySlug: "engineering",
    subcategorySlug: "civil",
    salaryMin: 85000,
    salaryMax: 150000,
    description:
      "COSIDER recrute des ingénieurs en génie civil pour ses projets d'infrastructure à travers le pays.",
    description_fr:
      "COSIDER recrute des ingénieurs en génie civil pour ses projets d'infrastructure à travers le pays.",
    description_ar: "كوسيدر توظف مهندسين مدنيين لمشاريع البنية التحتية في جميع أنحاء البلاد.",
    responsibilities: [
      "Superviser les chantiers",
      "Lire et vérifier les plans",
      "Coordonner les équipes",
      "Assurer la conformité aux normes",
    ],
    responsibilities_fr: [
      "Superviser les chantiers",
      "Lire et vérifier les plans",
      "Coordonner les équipes",
      "Assurer la conformité aux normes",
    ],
    responsibilities_ar: [
      "الإشراف على المواقع",
      "قراءة والتحقق من المخططات",
      "تنسيق الفرق",
      "ضمان الامتثال للمعايير",
    ],
    requirements: [
      "Diplôme d'ingénieur en génie civil",
      "3-5 ans d'expérience",
      "Maîtrise d'AutoCAD",
      "Connaissance des normes algériennes",
    ],
    requirements_fr: [
      "Diplôme d'ingénieur en génie civil",
      "3-5 ans d'expérience",
      "Maîtrise d'AutoCAD",
      "Connaissance des normes algériennes",
    ],
    requirements_ar: [
      "دبلوم مهندس في الهندسة المدنية",
      "3-5 سنوات خبرة",
      "إتقان AutoCAD",
      "معرفة المعايير الجزائرية",
    ],
    tagSlugs: ["autocad", "project-management", "civil-engineering", "construction"],
  },

  // Bâtisseurs DZ  (employer index 5)
  {
    employerIdx: 5,
    title: "Chef de Chantier BTP",
    title_fr: "Chef de Chantier BTP",
    title_ar: "رئيس ورشة البناء والأشغال العمومية",
    categorySlug: "engineering",
    subcategorySlug: "construction",
    salaryMin: 65000,
    salaryMax: 110000,
    description:
      "Bâtisseurs DZ cherche un chef de chantier expérimenté pour coordonner les travaux de construction.",
    description_fr:
      "Bâtisseurs DZ cherche un chef de chantier expérimenté pour coordonner les travaux de construction.",
    description_ar: "بناة دي زد تبحث عن رئيس ورشة ذو خبرة لتنسيق أعمال البناء.",
    responsibilities: [
      "Gérer les équipes sur chantier",
      "Planifier les travaux quotidiens",
      "Contrôler la qualité",
      "Respecter les délais et budgets",
    ],
    responsibilities_fr: [
      "Gérer les équipes sur chantier",
      "Planifier les travaux quotidiens",
      "Contrôler la qualité",
      "Respecter les délais et budgets",
    ],
    responsibilities_ar: [
      "إدارة الفرق في الموقع",
      "تخطيط الأعمال اليومية",
      "مراقبة الجودة",
      "احترام المواعيد والميزانيات",
    ],
    requirements: [
      "Formation BTP ou expérience équivalente",
      "5 ans minimum en tant que chef de chantier",
      "Leadership et gestion d'équipe",
      "Permis de conduire",
    ],
    requirements_fr: [
      "Formation BTP ou expérience équivalente",
      "5 ans minimum en tant que chef de chantier",
      "Leadership et gestion d'équipe",
      "Permis de conduire",
    ],
    requirements_ar: [
      "تدريب في البناء والأشغال العمومية أو خبرة مماثلة",
      "5 سنوات كحد أدنى كرئيس ورشة",
      "القيادة وإدارة الفريق",
      "رخصة قيادة",
    ],
    tagSlugs: ["leadership", "project-management", "construction", "quality-control"],
  },

  // ElecPro Algérie  (employer index 6)
  {
    employerIdx: 6,
    title: "Électricien Industriel",
    title_fr: "Électricien Industriel",
    title_ar: "كهربائي صناعي",
    categorySlug: "trades",
    subcategorySlug: "electrician",
    salaryMin: 50000,
    salaryMax: 80000,
    description:
      "ElecPro Algérie recrute des électriciens industriels pour des installations et maintenances.",
    description_fr:
      "ElecPro Algérie recrute des électriciens industriels pour des installations et maintenances.",
    description_ar: "إليك برو الجزائر توظف كهربائيين صناعيين للتركيبات والصيانة.",
    responsibilities: [
      "Installer des équipements électriques",
      "Diagnostiquer les pannes",
      "Effectuer la maintenance préventive",
      "Respecter les normes de sécurité",
    ],
    responsibilities_fr: [
      "Installer des équipements électriques",
      "Diagnostiquer les pannes",
      "Effectuer la maintenance préventive",
      "Respecter les normes de sécurité",
    ],
    responsibilities_ar: [
      "تركيب المعدات الكهربائية",
      "تشخيص الأعطال",
      "القيام بالصيانة الوقائية",
      "احترام معايير السلامة",
    ],
    requirements: [
      "Diplôme en électricité industrielle",
      "Habilitation électrique",
      "Lecture de schémas électriques",
      "Expérience en milieu industriel",
    ],
    requirements_fr: [
      "Diplôme en électricité industrielle",
      "Habilitation électrique",
      "Lecture de schémas électriques",
      "Expérience en milieu industriel",
    ],
    requirements_ar: [
      "شهادة في الكهرباء الصناعية",
      "ترخيص كهربائي",
      "قراءة المخططات الكهربائية",
      "خبرة في البيئة الصناعية",
    ],
    tagSlugs: ["electrical", "maintenance", "safety", "troubleshooting"],
  },

  // Cevital  (employer index 7)
  {
    employerIdx: 7,
    title: "Comptable Confirmé",
    title_fr: "Comptable Confirmé",
    title_ar: "محاسب مؤكد",
    categorySlug: "finance",
    subcategorySlug: "accounting",
    salaryMin: 70000,
    salaryMax: 120000,
    description: "Cevital recherche un comptable confirmé pour son département financier à Béjaïa.",
    description_fr:
      "Cevital recherche un comptable confirmé pour son département financier à Béjaïa.",
    description_ar: "سيفيتال تبحث عن محاسب مؤكد لقسم المالية في بجاية.",
    responsibilities: [
      "Tenir la comptabilité générale",
      "Établir les déclarations fiscales",
      "Gérer les rapprochements bancaires",
      "Préparer les bilans",
    ],
    responsibilities_fr: [
      "Tenir la comptabilité générale",
      "Établir les déclarations fiscales",
      "Gérer les rapprochements bancaires",
      "Préparer les bilans",
    ],
    responsibilities_ar: [
      "إمساك المحاسبة العامة",
      "إعداد الإقرارات الضريبية",
      "إدارة التسويات المصرفية",
      "إعداد الميزانيات",
    ],
    requirements: [
      "Licence en sciences comptables",
      "Maîtrise du PCN",
      "Connaissance de la fiscalité algérienne",
      "Expérience en grande entreprise",
    ],
    requirements_fr: [
      "Licence en sciences comptables",
      "Maîtrise du PCN",
      "Connaissance de la fiscalité algérienne",
      "Expérience en grande entreprise",
    ],
    requirements_ar: [
      "شهادة ليسانس في العلوم المحاسبية",
      "إتقان المخطط المحاسبي الوطني",
      "معرفة الضرائب الجزائرية",
      "خبرة في شركة كبيرة",
    ],
    tagSlugs: ["accounting", "tax", "excel", "erp", "financial-reporting"],
  },

  // Fashion Algeria  (employer index 8)
  {
    employerIdx: 8,
    title: "Designer Mode / Styliste",
    title_fr: "Designer Mode / Styliste",
    title_ar: "مصمم أزياء",
    categorySlug: "design",
    subcategorySlug: "fashion-design",
    salaryMin: 55000,
    salaryMax: 95000,
    description: "Fashion Algeria cherche un designer créatif pour sa nouvelle collection.",
    description_fr: "Fashion Algeria cherche un designer créatif pour sa nouvelle collection.",
    description_ar: "فاشن الجزائر تبحث عن مصمم مبدع لمجموعتها الجديدة.",
    responsibilities: [
      "Créer des designs de vêtements",
      "Choisir tissus et matériaux",
      "Suivre les tendances mode",
      "Collaborer avec l'équipe production",
    ],
    responsibilities_fr: [
      "Créer des designs de vêtements",
      "Choisir tissus et matériaux",
      "Suivre les tendances mode",
      "Collaborer avec l'équipe production",
    ],
    responsibilities_ar: [
      "إنشاء تصاميم الملابس",
      "اختيار الأقمشة والمواد",
      "متابعة اتجاهات الموضة",
      "التعاون مع فريق الإنتاج",
    ],
    requirements: [
      "Formation en design de mode",
      "Portfolio créatif",
      "Maîtrise d'Adobe Illustrator",
      "Sens artistique développé",
    ],
    requirements_fr: [
      "Formation en design de mode",
      "Portfolio créatif",
      "Maîtrise d'Adobe Illustrator",
      "Sens artistique développé",
    ],
    requirements_ar: [
      "تدريب في تصميم الأزياء",
      "معرض أعمال إبداعي",
      "إتقان Adobe Illustrator",
      "حس فني متطور",
    ],
    tagSlugs: ["illustrator", "branding", "creativity", "fashion"],
  },

  // École Privée El Nour  (employer index 9)
  {
    employerIdx: 9,
    title: "Professeur de Mathématiques",
    title_fr: "Professeur de Mathématiques",
    title_ar: "أستاذ رياضيات",
    categorySlug: "education",
    subcategorySlug: "school-teaching",
    salaryMin: 45000,
    salaryMax: 75000,
    description:
      "École Privée El Nour recrute un professeur de mathématiques pour niveaux collège et lycée.",
    description_fr:
      "École Privée El Nour recrute un professeur de mathématiques pour niveaux collège et lycée.",
    description_ar: "مدرسة النور الخاصة توظف أستاذ رياضيات لمستويات المتوسط والثانوي.",
    responsibilities: [
      "Enseigner les mathématiques",
      "Préparer les cours et exercices",
      "Évaluer les élèves",
      "Participer aux réunions pédagogiques",
    ],
    responsibilities_fr: [
      "Enseigner les mathématiques",
      "Préparer les cours et exercices",
      "Évaluer les élèves",
      "Participer aux réunions pédagogiques",
    ],
    responsibilities_ar: [
      "تدريس الرياضيات",
      "إعداد الدروس والتمارين",
      "تقييم الطلاب",
      "المشاركة في الاجتماعات التربوية",
    ],
    requirements: [
      "Licence en mathématiques",
      "Expérience en enseignement",
      "Pédagogie et patience",
      "Excellente communication",
    ],
    requirements_fr: [
      "Licence en mathématiques",
      "Expérience en enseignement",
      "Pédagogie et patience",
      "Excellente communication",
    ],
    requirements_ar: [
      "شهادة ليسانس في الرياضيات",
      "خبرة في التدريس",
      "منهجية تربوية وصبر",
      "تواصل ممتاز",
    ],
    tagSlugs: ["teaching", "tutoring", "communication", "lang-arabic", "lang-french"],
  },

  // Centre Formation Pro DZ  (employer index 10)
  {
    employerIdx: 10,
    title: "Formateur en Bureautique",
    title_fr: "Formateur en Bureautique",
    title_ar: "مدرب في المكتبية",
    categorySlug: "education",
    subcategorySlug: "corporate-training",
    salaryMin: 40000,
    salaryMax: 65000,
    description:
      "Centre Formation Pro DZ cherche un formateur pour enseigner Word, Excel, PowerPoint.",
    description_fr:
      "Centre Formation Pro DZ cherche un formateur pour enseigner Word, Excel, PowerPoint.",
    description_ar: "مركز التدريب المهني دي زد يبحث عن مدرب لتعليم Word و Excel و PowerPoint.",
    responsibilities: [
      "Animer des formations bureautique",
      "Créer du contenu pédagogique",
      "Évaluer les stagiaires",
      "Adapter le rythme au groupe",
    ],
    responsibilities_fr: [
      "Animer des formations bureautique",
      "Créer du contenu pédagogique",
      "Évaluer les stagiaires",
      "Adapter le rythme au groupe",
    ],
    responsibilities_ar: [
      "تنشيط دورات المكتبية",
      "إنشاء محتوى تربوي",
      "تقييم المتدربين",
      "تكييف الإيقاع مع المجموعة",
    ],
    requirements: [
      "Maîtrise de MS Office",
      "Expérience en formation d'adultes",
      "Pédagogie claire",
      "Certification bureautique (bonus)",
    ],
    requirements_fr: [
      "Maîtrise de MS Office",
      "Expérience en formation d'adultes",
      "Pédagogie claire",
      "Certification bureautique (bonus)",
    ],
    requirements_ar: [
      "إتقان MS Office",
      "خبرة في تدريب البالغين",
      "منهجية تربوية واضحة",
      "شهادة مكتبية (إضافة)",
    ],
    tagSlugs: ["excel", "teaching", "training", "communication"],
  },

  // Clinique Privée Saha  (employer index 11)
  {
    employerIdx: 11,
    title: "Infirmier/ère Diplômé(e)",
    title_fr: "Infirmier/ère Diplômé(e)",
    title_ar: "ممرض/ة دبلوم",
    categorySlug: "healthcare",
    subcategorySlug: "nursing",
    salaryMin: 50000,
    salaryMax: 75000,
    description: "Clinique Privée Saha recrute des infirmiers diplômés pour différents services.",
    description_fr:
      "Clinique Privée Saha recrute des infirmiers diplômés pour différents services.",
    description_ar: "عيادة صحة الخاصة توظف ممرضين دبلوم لخدمات مختلفة.",
    responsibilities: [
      "Soins aux patients",
      "Administration des traitements",
      "Surveillance des constantes",
      "Collaboration avec les médecins",
    ],
    responsibilities_fr: [
      "Soins aux patients",
      "Administration des traitements",
      "Surveillance des constantes",
      "Collaboration avec les médecins",
    ],
    responsibilities_ar: ["رعاية المرضى", "إدارة العلاجات", "مراقبة الثوابت", "التعاون مع الأطباء"],
    requirements: [
      "Diplôme d'État infirmier",
      "Inscription à l'ordre",
      "Disponibilité pour gardes",
      "Empathie et professionnalisme",
    ],
    requirements_fr: [
      "Diplôme d'État infirmier",
      "Inscription à l'ordre",
      "Disponibilité pour gardes",
      "Empathie et professionnalisme",
    ],
    requirements_ar: [
      "دبلوم دولة ممرض",
      "التسجيل في النقابة",
      "التوفر للمناوبات",
      "التعاطف والاحترافية",
    ],
    tagSlugs: ["healthcare", "nursing", "patient-care", "medical"],
  },

  // Polyclinique El Shifa  (employer index 12)
  {
    employerIdx: 12,
    title: "Médecin Généraliste",
    title_fr: "Médecin Généraliste",
    title_ar: "طبيب عام",
    categorySlug: "healthcare",
    subcategorySlug: "general-practice",
    salaryMin: 120000,
    salaryMax: 200000,
    description:
      "Polyclinique El Shifa cherche un médecin généraliste pour consultations et urgences.",
    description_fr:
      "Polyclinique El Shifa cherche un médecin généraliste pour consultations et urgences.",
    description_ar: "عيادة الشفاء متعددة الخدمات تبحث عن طبيب عام للاستشارات والطوارئ.",
    responsibilities: [
      "Consultations médicales",
      "Diagnostics et prescriptions",
      "Suivi des patients",
      "Gardes d'urgence",
    ],
    responsibilities_fr: [
      "Consultations médicales",
      "Diagnostics et prescriptions",
      "Suivi des patients",
      "Gardes d'urgence",
    ],
    responsibilities_ar: [
      "الاستشارات الطبية",
      "التشخيص والوصفات",
      "متابعة المرضى",
      "مناوبات الطوارئ",
    ],
    requirements: [
      "Doctorat en médecine",
      "Inscription à l'ordre des médecins",
      "Expérience en clinique ou hôpital",
      "Excellentes compétences cliniques",
    ],
    requirements_fr: [
      "Doctorat en médecine",
      "Inscription à l'ordre des médecins",
      "Expérience en clinique ou hôpital",
      "Excellentes compétences cliniques",
    ],
    requirements_ar: [
      "دكتوراه في الطب",
      "التسجيل في نقابة الأطباء",
      "خبرة في عيادة أو مستشفى",
      "مهارات سريرية ممتازة",
    ],
    tagSlugs: ["healthcare", "medical", "diagnosis", "patient-care"],
  },

  // Yassir Express  (employer index 13)
  {
    employerIdx: 13,
    title: "Chauffeur-Livreur VTC",
    title_fr: "Chauffeur-Livreur VTC",
    title_ar: "سائق توصيل",
    categorySlug: "logistics",
    subcategorySlug: "delivery",
    salaryMin: 35000,
    salaryMax: 55000,
    description: "Yassir Express recrute des chauffeurs-livreurs pour Alger et environs.",
    description_fr: "Yassir Express recrute des chauffeurs-livreurs pour Alger et environs.",
    description_ar: "ياسر إكسبرس توظف سائقي توصيل للجزائر العاصمة والضواحي.",
    responsibilities: [
      "Livrer des colis aux clients",
      "Respecter les délais",
      "Maintenir le véhicule propre",
      "Excellent service client",
    ],
    responsibilities_fr: [
      "Livrer des colis aux clients",
      "Respecter les délais",
      "Maintenir le véhicule propre",
      "Excellent service client",
    ],
    responsibilities_ar: [
      "توصيل الطرود للعملاء",
      "احترام المواعيد",
      "الحفاظ على نظافة المركبة",
      "خدمة عملاء ممتازة",
    ],
    requirements: [
      "Permis de conduire B valide",
      "Véhicule personnel (bonus)",
      "Connaissance de la ville",
      "Ponctualité et sérieux",
    ],
    requirements_fr: [
      "Permis de conduire B valide",
      "Véhicule personnel (bonus)",
      "Connaissance de la ville",
      "Ponctualité et sérieux",
    ],
    requirements_ar: [
      "رخصة قيادة صنف B سارية",
      "مركبة شخصية (إضافة)",
      "معرفة المدينة",
      "الالتزام بالمواعيد والجدية",
    ],
    tagSlugs: ["delivery", "driver", "logistics", "customer-service"],
  },

  // Groupe Madar  (employer index 14)
  {
    employerIdx: 14,
    title: "Responsable Logistique",
    title_fr: "Responsable Logistique",
    title_ar: "مسؤول لوجستيات",
    categorySlug: "logistics",
    subcategorySlug: "supply-chain",
    salaryMin: 80000,
    salaryMax: 135000,
    description:
      "Groupe Madar cherche un responsable logistique pour optimiser sa chaîne d'approvisionnement.",
    description_fr:
      "Groupe Madar cherche un responsable logistique pour optimiser sa chaîne d'approvisionnement.",
    description_ar: "مجموعة مدار تبحث عن مسؤول لوجستيات لتحسين سلسلة التوريد.",
    responsibilities: [
      "Gérer les stocks et entrepôts",
      "Planifier les livraisons",
      "Négocier avec les transporteurs",
      "Optimiser les coûts logistiques",
    ],
    responsibilities_fr: [
      "Gérer les stocks et entrepôts",
      "Planifier les livraisons",
      "Négocier avec les transporteurs",
      "Optimiser les coûts logistiques",
    ],
    responsibilities_ar: [
      "إدارة المخزون والمستودعات",
      "تخطيط عمليات التسليم",
      "التفاوض مع شركات النقل",
      "تحسين التكاليف اللوجستية",
    ],
    requirements: [
      "Formation en logistique ou SCM",
      "Expérience 5+ ans",
      "Maîtrise d'un ERP",
      "Leadership et organisation",
    ],
    requirements_fr: [
      "Formation en logistique ou SCM",
      "Expérience 5+ ans",
      "Maîtrise d'un ERP",
      "Leadership et organisation",
    ],
    requirements_ar: [
      "تدريب في اللوجستيات أو إدارة سلسلة التوريد",
      "خبرة 5+ سنوات",
      "إتقان نظام تخطيط موارد المؤسسات",
      "القيادة والتنظيم",
    ],
    tagSlugs: ["supply-chain", "erp", "leadership", "negotiation", "project-management"],
  },

  // Cabinet Comptable Benali  (employer index 15)
  {
    employerIdx: 15,
    title: "Assistant Comptable",
    title_fr: "Assistant Comptable",
    title_ar: "مساعد محاسب",
    categorySlug: "finance",
    subcategorySlug: "accounting",
    salaryMin: 35000,
    salaryMax: 55000,
    description: "Cabinet Comptable Benali recrute un assistant comptable pour tâches courantes.",
    description_fr:
      "Cabinet Comptable Benali recrute un assistant comptable pour tâches courantes.",
    description_ar: "مكتب المحاسبة بن علي يوظف مساعد محاسب للمهام الجارية.",
    responsibilities: [
      "Saisie comptable quotidienne",
      "Classement de documents",
      "Rapprochements bancaires",
      "Support aux comptables seniors",
    ],
    responsibilities_fr: [
      "Saisie comptable quotidienne",
      "Classement de documents",
      "Rapprochements bancaires",
      "Support aux comptables seniors",
    ],
    responsibilities_ar: [
      "الإدخال المحاسبي اليومي",
      "تصنيف الوثائق",
      "التسويات المصرفية",
      "دعم المحاسبين الأقدم",
    ],
    requirements: [
      "TS ou Licence en comptabilité",
      "Maîtrise d'Excel",
      "Rigueur et précision",
      "Volonté d'apprendre",
    ],
    requirements_fr: [
      "TS ou Licence en comptabilité",
      "Maîtrise d'Excel",
      "Rigueur et précision",
      "Volonté d'apprendre",
    ],
    requirements_ar: [
      "شهادة تقني سامي أو ليسانس في المحاسبة",
      "إتقان Excel",
      "الدقة والحرص",
      "الرغبة في التعلم",
    ],
    tagSlugs: ["accounting", "excel", "data-entry", "financial-reporting"],
  },

  // Sonatrach  (employer index 16)
  {
    employerIdx: 16,
    title: "Ingénieur Pétrole & Gaz",
    title_fr: "Ingénieur Pétrole & Gaz",
    title_ar: "مهندس نفط وغاز",
    categorySlug: "engineering",
    subcategorySlug: "petroleum",
    salaryMin: 150000,
    salaryMax: 280000,
    description: "Sonatrach recrute des ingénieurs en pétrole et gaz pour ses installations.",
    description_fr: "Sonatrach recrute des ingénieurs en pétrole et gaz pour ses installations.",
    description_ar: "سوناطراك توظف مهندسين في النفط والغاز لمنشآتها.",
    responsibilities: [
      "Superviser l'extraction",
      "Optimiser la production",
      "Assurer la sécurité",
      "Gestion des équipements",
    ],
    responsibilities_fr: [
      "Superviser l'extraction",
      "Optimiser la production",
      "Assurer la sécurité",
      "Gestion des équipements",
    ],
    responsibilities_ar: [
      "الإشراف على الاستخراج",
      "تحسين الإنتاج",
      "ضمان السلامة",
      "إدارة المعدات",
    ],
    requirements: [
      "Master en ingénierie pétrolière",
      "Expérience en industrie pétrolière",
      "Anglais technique courant",
      "Mobilité géographique",
    ],
    requirements_fr: [
      "Master en ingénierie pétrolière",
      "Expérience en industrie pétrolière",
      "Anglais technique courant",
      "Mobilité géographique",
    ],
    requirements_ar: [
      "ماستر في الهندسة البترولية",
      "خبرة في صناعة النفط",
      "إنجليزية تقنية جيدة",
      "تنقل جغرافي",
    ],
    tagSlugs: ["petroleum", "safety", "project-management", "lang-english"],
  },

  // Restaurant Le Phénix  (employer index 17)
  {
    employerIdx: 17,
    title: "Chef Cuisinier",
    title_fr: "Chef Cuisinier",
    title_ar: "رئيس الطهاة",
    categorySlug: "hospitality",
    subcategorySlug: "culinary",
    salaryMin: 60000,
    salaryMax: 100000,
    description:
      "Restaurant Le Phénix cherche un chef cuisinier créatif pour cuisine algérienne et internationale.",
    description_fr:
      "Restaurant Le Phénix cherche un chef cuisinier créatif pour cuisine algérienne et internationale.",
    description_ar: "مطعم الفينيق يبحث عن رئيس طهاة مبدع للمطبخ الجزائري والعالمي.",
    responsibilities: [
      "Créer les menus",
      "Superviser la brigade",
      "Assurer la qualité des plats",
      "Gérer les stocks",
    ],
    responsibilities_fr: [
      "Créer les menus",
      "Superviser la brigade",
      "Assurer la qualité des plats",
      "Gérer les stocks",
    ],
    responsibilities_ar: [
      "إنشاء القوائم",
      "الإشراف على فريق المطبخ",
      "ضمان جودة الأطباق",
      "إدارة المخزون",
    ],
    requirements: [
      "CAP/BT Hôtellerie-Restauration",
      "10+ ans d'expérience",
      "Créativité culinaire",
      "Leadership en cuisine",
    ],
    requirements_fr: [
      "CAP/BT Hôtellerie-Restauration",
      "10+ ans d'expérience",
      "Créativité culinaire",
      "Leadership en cuisine",
    ],
    requirements_ar: [
      "شهادة الفندقة والمطاعم",
      "خبرة 10+ سنوات",
      "إبداع في الطبخ",
      "قيادة في المطبخ",
    ],
    tagSlugs: ["culinary", "leadership", "creativity", "hospitality"],
  },

  // Hôtel Sheraton Alger  (employer index 18)
  {
    employerIdx: 18,
    title: "Réceptionniste Hôtel",
    title_fr: "Réceptionniste Hôtel",
    title_ar: "موظف استقبال فندق",
    categorySlug: "hospitality",
    subcategorySlug: "front-desk",
    salaryMin: 40000,
    salaryMax: 65000,
    description:
      "Hôtel Sheraton Alger recrute des réceptionnistes trilingues pour accueil clients.",
    description_fr:
      "Hôtel Sheraton Alger recrute des réceptionnistes trilingues pour accueil clients.",
    description_ar: "فندق شيراتون الجزائر يوظف موظفي استقبال متعددي اللغات لاستقبال العملاء.",
    responsibilities: [
      "Accueillir les clients",
      "Gérer les réservations",
      "Répondre aux demandes",
      "Check-in / Check-out",
    ],
    responsibilities_fr: [
      "Accueillir les clients",
      "Gérer les réservations",
      "Répondre aux demandes",
      "Check-in / Check-out",
    ],
    responsibilities_ar: [
      "استقبال العملاء",
      "إدارة الحجوزات",
      "الرد على الطلبات",
      "تسجيل الدخول والخروج",
    ],
    requirements: [
      "Formation hôtelière",
      "Trilingue (AR/FR/EN)",
      "Excellente présentation",
      "Sens du service",
    ],
    requirements_fr: [
      "Formation hôtelière",
      "Trilingue (AR/FR/EN)",
      "Excellente présentation",
      "Sens du service",
    ],
    requirements_ar: [
      "تدريب فندقي",
      "متعدد اللغات (عربي/فرنسي/إنجليزي)",
      "مظهر ممتاز",
      "حس الخدمة",
    ],
    tagSlugs: [
      "hospitality",
      "customer-service",
      "lang-arabic",
      "lang-french",
      "lang-english",
      "communication",
    ],
  },

  // Agence Digit DZ  (employer index 19)
  {
    employerIdx: 19,
    title: "Community Manager / Social Media",
    title_fr: "Community Manager / Social Media",
    title_ar: "مدير مجتمع / وسائل التواصل الاجتماعي",
    categorySlug: "marketing",
    subcategorySlug: "social-media",
    salaryMin: 50000,
    salaryMax: 85000,
    description:
      "Agence Digit DZ recrute un community manager créatif pour gérer les réseaux sociaux des clients.",
    description_fr:
      "Agence Digit DZ recrute un community manager créatif pour gérer les réseaux sociaux des clients.",
    description_ar:
      "وكالة ديجيت دي زد توظف مدير مجتمع مبدع لإدارة وسائل التواصل الاجتماعي للعملاء.",
    responsibilities: [
      "Créer du contenu engageant",
      "Gérer pages Facebook/Instagram",
      "Analyser les performances",
      "Interagir avec la communauté",
    ],
    responsibilities_fr: [
      "Créer du contenu engageant",
      "Gérer pages Facebook/Instagram",
      "Analyser les performances",
      "Interagir avec la communauté",
    ],
    responsibilities_ar: [
      "إنشاء محتوى جذاب",
      "إدارة صفحات فيسبوك/إنستغرام",
      "تحليل الأداء",
      "التفاعل مع المجتمع",
    ],
    requirements: [
      "Formation marketing digital",
      "Créativité et sens du storytelling",
      "Maîtrise de Canva/Photoshop",
      "Excellente rédaction FR/AR",
    ],
    requirements_fr: [
      "Formation marketing digital",
      "Créativité et sens du storytelling",
      "Maîtrise de Canva/Photoshop",
      "Excellente rédaction FR/AR",
    ],
    requirements_ar: [
      "تدريب في التسويق الرقمي",
      "الإبداع وحس سرد القصص",
      "إتقان Canva/Photoshop",
      "كتابة ممتازة بالفرنسية/العربية",
    ],
    tagSlugs: [
      "digital-marketing",
      "social-media",
      "photoshop",
      "content-creation",
      "lang-arabic",
      "lang-french",
    ],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANNOUNCEMENT TEMPLATES - NOW WITH UPDATED CATEGORIES AND TAGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const announcementTemplates = [
  {
    candidateIdx: 0,
    categorySlug: "technology",
    subcategorySlug: "web-dev",
    workPreference: "hybrid",
    experienceLevel: "Mid-level",
    yearsExperience: 4,
    expectedSalary: 100000,
    skills: ["React", "Node.js", "MongoDB", "Git", "REST API"],
    tagSlugs: ["javascript", "react", "nodejs", "mongodb", "git", "restapi"],
  },
  {
    candidateIdx: 1,
    categorySlug: "finance",
    subcategorySlug: "accounting",
    workPreference: "onsite",
    experienceLevel: "Senior",
    yearsExperience: 6,
    expectedSalary: 85000,
    skills: ["PCN", "Fiscalité", "Excel", "Sage Compta"],
    tagSlugs: ["accounting", "tax", "excel", "erp"],
  },
  {
    candidateIdx: 2,
    categorySlug: "engineering",
    subcategorySlug: "civil",
    workPreference: "onsite",
    experienceLevel: "Mid-level",
    yearsExperience: 5,
    expectedSalary: 95000,
    skills: ["AutoCAD", "Structures", "BTP", "Gestion de projet"],
    tagSlugs: ["autocad", "project-management", "civil-engineering", "construction"],
  },
  {
    candidateIdx: 3,
    categorySlug: "education",
    subcategorySlug: "private-tutoring",
    workPreference: "freelance",
    experienceLevel: "Mid-level",
    yearsExperience: 5,
    expectedSalary: 50000,
    skills: ["Mathématiques", "Physique", "Pédagogie"],
    tagSlugs: ["teaching", "tutoring", "communication"],
  },
  {
    candidateIdx: 4,
    categorySlug: "marketing",
    subcategorySlug: "social-media",
    workPreference: "freelance",
    experienceLevel: "Mid-level",
    yearsExperience: 3,
    expectedSalary: 60000,
    skills: ["Facebook Ads", "Instagram", "Canva", "Copywriting"],
    tagSlugs: [
      "digital-marketing",
      "social-media",
      "content-creation",
      "lang-arabic",
      "lang-french",
    ],
  },
  {
    candidateIdx: 5,
    categorySlug: "logistics",
    subcategorySlug: "delivery",
    workPreference: "onsite",
    experienceLevel: "Entry",
    yearsExperience: 2,
    expectedSalary: 40000,
    skills: ["Permis B", "Livraison", "Service client"],
    tagSlugs: ["delivery", "driver", "customer-service"],
  },
  {
    candidateIdx: 6,
    categorySlug: "healthcare",
    subcategorySlug: "nursing",
    workPreference: "onsite",
    experienceLevel: "Mid-level",
    yearsExperience: 3,
    expectedSalary: 60000,
    skills: ["Soins infirmiers", "Urgences", "Pédiatrie"],
    tagSlugs: ["healthcare", "nursing", "patient-care", "medical"],
  },
  {
    candidateIdx: 7,
    categorySlug: "design",
    subcategorySlug: "video-editing",
    workPreference: "freelance",
    experienceLevel: "Mid-level",
    yearsExperience: 4,
    expectedSalary: 70000,
    skills: ["Adobe Premiere", "After Effects", "Photoshop", "Montage vidéo"],
    tagSlugs: ["premiere-pro", "after-effects", "photoshop", "motion-graphics"],
  },
  {
    candidateIdx: 8,
    categorySlug: "trades",
    subcategorySlug: "mechanic",
    workPreference: "onsite",
    experienceLevel: "Senior",
    yearsExperience: 7,
    expectedSalary: 65000,
    skills: ["Mécanique diesel", "Diagnostic électronique", "Réparation moteurs"],
    tagSlugs: ["mechanical", "maintenance", "troubleshooting"],
  },
  {
    candidateIdx: 9,
    categorySlug: "hospitality",
    subcategorySlug: "culinary",
    workPreference: "onsite",
    experienceLevel: "Senior",
    yearsExperience: 10,
    expectedSalary: 75000,
    skills: ["Cuisine algérienne", "Pâtisserie", "Management cuisine"],
    tagSlugs: ["culinary", "leadership", "hospitality"],
  },
  {
    candidateIdx: 10,
    categorySlug: "design",
    subcategorySlug: "architecture",
    workPreference: "freelance",
    experienceLevel: "Mid-level",
    yearsExperience: 5,
    expectedSalary: 80000,
    skills: ["AutoCAD", "SketchUp", "Plans architecturaux", "Permis de construire"],
    tagSlugs: ["autocad", "architecture", "project-management"],
  },
  {
    candidateIdx: 11,
    categorySlug: "writing",
    subcategorySlug: "translation",
    workPreference: "freelance",
    experienceLevel: "Senior",
    yearsExperience: 8,
    expectedSalary: 60000,
    skills: ["Traduction AR/FR/EN", "Documents juridiques", "Localisation"],
    tagSlugs: ["translation", "lang-arabic", "lang-french", "lang-english", "proofreading"],
  },
  {
    candidateIdx: 12,
    categorySlug: "trades",
    subcategorySlug: "electrician",
    workPreference: "freelance",
    experienceLevel: "Senior",
    yearsExperience: 8,
    expectedSalary: 55000,
    skills: ["Électricité bâtiment", "Installation", "Dépannage"],
    tagSlugs: ["electrical", "maintenance", "troubleshooting"],
  },
  {
    candidateIdx: 13,
    categorySlug: "business",
    subcategorySlug: "hr",
    workPreference: "onsite",
    experienceLevel: "Senior",
    yearsExperience: 8,
    expectedSalary: 110000,
    skills: ["Recrutement", "Paie", "Droit du travail", "Gestion RH"],
    tagSlugs: ["recruitment", "labor-law", "hris", "leadership"],
  },
  {
    candidateIdx: 14,
    categorySlug: "technology",
    subcategorySlug: "data-science",
    workPreference: "hybrid",
    experienceLevel: "Entry",
    yearsExperience: 1,
    expectedSalary: 65000,
    skills: ["Python", "Machine Learning", "NLP", "Data Analysis"],
    tagSlugs: ["python", "machine-learning", "nlp", "data-analysis"],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUILD FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildUser(data, accountType) {
  const username = slug(data.fullName);
  const hashedPassword = bcrypt.hashSync("password123", 10);
  const now = new Date();

  const base = {
    _id: uid("user"),
    username,
    email: data.email,
    password: hashedPassword,
    accountType,
    isVerified: true,
    verificationToken: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    fullName: data.fullName,
    gender: data.gender,
    phone: `+213 ${randInt(500, 799)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`,
    whatsapp: `+213 ${randInt(500, 799)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`,
    profileImage: "",
    location: data.location,
    bio: data.bio || "",
    createdAt: daysAgo(randInt(60, 180)),
    updatedAt: now,
  };

  if (accountType === "employer") {
    return {
      ...base,
      companyName: data.companyName,
      profession: data.profession,
      companySize: pick(["1-10", "11-50", "51-200", "201-500", "500+"]),
      industry: pick(["Tech", "Construction", "Santé", "Finance", "Éducation", "Autre"]),
      companyWebsite: "",
      companyLogo: "",
      verifiedEmployer: pick([true, false]),
    };
  } else {
    return {
      ...base,
      professionalTitle: data.profession,
      experienceLevel: pick(["Entry", "Mid-level", "Senior", "Expert"]),
      workPreference: data.workPreference,
      resume: "",
      portfolioUrl: "",
      linkedinUrl: "",
    };
  }
}

function buildJob(tpl, employer) {
  const daysBack = randInt(0, 60);
  const wilaya = employer.location;
  const jobType = pick(jobTypes);

  return {
    _id: uid("job"),
    employerId: employer._id,
    title: tpl.title,
    title_fr: tpl.title_fr,
    title_ar: tpl.title_ar,
    categorySlug: tpl.categorySlug,
    subcategorySlug: tpl.subcategorySlug,
    companyName: employer.companyName,
    wilayaName: wilaya,
    workLocation: pick(["onsite", "remote", "hybrid"]),
    type: jobType.type,
    typeLabel: jobType.typeLabel,
    salaryMin: tpl.salaryMin,
    salaryMax: tpl.salaryMax,
    salaryPeriod: "monthly",
    salaryCurrency: "DZD",
    salaryNegotiable: pick([true, false]),
    description: tpl.description,
    description_fr: tpl.description_fr,
    description_ar: tpl.description_ar,
    responsibilities: tpl.responsibilities,
    responsibilities_fr: tpl.responsibilities_fr,
    responsibilities_ar: tpl.responsibilities_ar,
    requirements: tpl.requirements,
    requirements_fr: tpl.requirements_fr,
    requirements_ar: tpl.requirements_ar,
    skills: tpl.skills || [],
    tagSlugs: tpl.tagSlugs || [],
    benefits: ["Assurance", "Prime annuelle", "Formation continue"],
    contactEmail: employer.email,
    contactPhone: employer.phone,
    contactWhatsapp: employer.whatsapp,
    applyUrl: "",
    status: pick(["open", "filled", "closed"]),
    isActive: true,
    viewsCount: randInt(10, 500),
    applicationsCount: randInt(0, 50),
    createdAt: daysAgo(daysBack),
    updatedAt: daysAgo(daysBack),
    postedAgo: postedAgoLabel(daysBack),
  };
}

function buildAnnouncement(tpl, candidate) {
  const daysBack = randInt(0, 45);

  return {
    _id: uid("ann"),
    authorId: candidate._id,
    profileId: candidate._id,
    fullName: candidate.fullName,
    professionalTitle: candidate.professionalTitle,
    categorySlug: tpl.categorySlug,
    subcategorySlug: tpl.subcategorySlug,
    workPreference: tpl.workPreference,
    preferredLocation: candidate.location,
    experienceLevel: tpl.experienceLevel,
    yearsExperience: tpl.yearsExperience,
    expectedSalary: tpl.expectedSalary,
    salaryPeriod: "monthly",
    availability: pick([
      "Disponible immédiatement",
      "Disponible sous 1 mois",
      "Disponible sous 2 mois",
      "En poste, à l'écoute",
    ]),
    portfolioUrl: "",
    contactEmail: candidate.email,
    contactPhone: candidate.phone,
    contactWhatsapp: candidate.whatsapp,
    contactTelegram: "",
    skills: tpl.skills,
    tagSlugs: tpl.tagSlugs || [],
    attachments: [],
    isActive: true,
    createdAt: daysAgo(daysBack),
    updatedAt: daysAgo(daysBack),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n🔗 Connected to MongoDB at ${MONGO_URI}\n`);

    const db = client.db("mihna");

    // ── 1. CLEAR EXISTING DATA ─────────────────────────────────────────────────
    for (const col of ["users", "jobs", "announcements"]) {
      await db.collection(col).deleteMany({});
      await db.collection(col).dropIndexes();
      console.log(`🧹 Cleared mihna.${col}`);
    }
    console.log();

    // ── 2. BUILD & INSERT USERS ────────────────────────────────────────────────
    const employers = employerData.map((d) => buildUser(d, "employer"));
    const candidates = candidateData.map((d) => buildUser(d, "candidate"));
    const allUsers = [...employers, ...candidates];

    const usersCol = db.collection("users");
    await usersCol.createIndex({ email: 1 }, { unique: true });
    await usersCol.createIndex({ username: 1 }, { unique: true });
    await usersCol.createIndex({ accountType: 1 });
    await usersCol.createIndex({ location: 1 });

    await usersCol.insertMany(allUsers, { ordered: false });
    console.log(
      `👤 Inserted ${employers.length} employers  +  ${candidates.length} candidates  →  ${allUsers.length} users total`,
    );

    // ── 3. BUILD & INSERT JOBS (each linked to its employer) ───────────────────
    const jobs = jobTemplates.map((tpl) => buildJob(tpl, employers[tpl.employerIdx]));

    const jobsCol = db.collection("jobs");
    await jobsCol.createIndex({ employerId: 1 });
    await jobsCol.createIndex({ categorySlug: 1 });
    await jobsCol.createIndex({ subcategorySlug: 1 });
    await jobsCol.createIndex({ wilayaName: 1 });
    await jobsCol.createIndex({ status: 1 });
    await jobsCol.createIndex({ isActive: 1 });
    await jobsCol.createIndex({ createdAt: -1 });
    await jobsCol.createIndex({ tagSlugs: 1 });
    // Text search across all three languages
    await jobsCol.createIndex({
      title: "text",
      title_fr: "text",
      title_ar: "text",
      description: "text",
      description_fr: "text",
      description_ar: "text",
    });

    await jobsCol.insertMany(jobs, { ordered: false });
    console.log(`💼 Inserted ${jobs.length} jobs`);

    // ── 4. BUILD & INSERT ANNOUNCEMENTS (each linked to its candidate) ─────────
    const announcements = announcementTemplates.map((tpl) =>
      buildAnnouncement(tpl, candidates[tpl.candidateIdx]),
    );

    const annCol = db.collection("announcements");
    await annCol.createIndex({ authorId: 1 });
    await annCol.createIndex({ profileId: 1 });
    await annCol.createIndex({ categorySlug: 1 });
    await annCol.createIndex({ subcategorySlug: 1 });
    await annCol.createIndex({ preferredLocation: 1 });
    await annCol.createIndex({ isActive: 1 });
    await annCol.createIndex({ createdAt: -1 });
    await annCol.createIndex({ tagSlugs: 1 });

    await annCol.insertMany(announcements, { ordered: false });
    console.log(`📢 Inserted ${announcements.length} announcements`);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ecosystem seeded successfully!

   Users         : ${allUsers.length}  (${employers.length} employers, ${candidates.length} candidates)
   Jobs          : ${jobs.length}  (each owned by an employer)
   Announcements : ${announcements.length}  (each owned by a candidate)

   🌐 Languages    : All jobs and announcements have Arabic, French, and English fields
   🏷️  Tags        : Jobs and announcements are linked to tags from mongo-tags.js
   📁 Categories   : Using category structure from mongo-categories.js (categorySlug + subcategorySlug)

   Default password for all accounts: password123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
