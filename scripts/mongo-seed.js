import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const uid = (prefix) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const postedAgoLabel = (days) => {
  if (days === 0) return "Just now";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
};
const catSlug = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ─── UNIFIED MASTER TAXONOMY ────────────────────────────────────────────────────
//
// All 54 canonical subcategory names from the Master Taxonomy.
// Every feature (post-job, post-announcement, browse categories) uses the exact same list.
//
const ALL_CATS = [
  // Technology & IT
  "Web Development",
  "Mobile Development",
  "Full-Stack Development",
  "UI/UX Design",
  "Graphic Design",
  "Game Development",
  "IT Support",
  "Data Science & Analytics",
  // Creative & Design
  "Illustration",
  "Animation",
  "Video Production",
  "Logo & Brand Identity",
  "Content Writing",
  // Business & Management
  "HR & Recruitment",
  "Business Consulting",
  "Marketing & SEO",
  "Social Media Management",
  "Account Management",
  "Sales",
  "Project Management",
  // Finance & Accounting
  "Financial Analyst",
  "Accountant",
  "Bookkeeping",
  "Tax Consultant",
  // Legal Services
  "Lawyer / Legal Advisor",
  "Legal Consulting",
  // Engineering & Construction
  "Engineering Design",
  "Construction Worker",
  "Electrician",
  "Plumber",
  "HVAC Technician",
  "Mechanic",
  // Hospitality & Food Service
  "Hotel Staff",
  "Receptionist",
  "Chef / Cook",
  "Restaurant Worker",
  "Hospitality Staffing",
  // Healthcare
  "Doctor",
  "Nurse",
  "Medical Staff",
  // Education & Training
  "Professor",
  "Teacher",
  "Tutor",
  "Training & Education",
  // Transportation & Logistics
  "Delivery Driver",
  "Driver",
  "Warehouse Worker",
  "Logistics & Delivery",
  // Retail & Customer Service
  "Store Manager",
  "Cashier",
  "Customer Support",
  // Administrative
  "Administrative Assistant",
  "HR Specialist",
  // Security & Safety
  "Security Guard",
];

// ─── WILAYAS ────────────────────────────────────────────────────────────────────
const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh",
  "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued",
  "Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
  "Ghardaïa","Relizane",
];

// ─── EMPLOYERS ──────────────────────────────────────────────────────────────────
const EMPLOYER_DATA = [
  { fullName: "Karim Bensalem", email: "karim@techdz.dz", company: "TechDz SARL", location: "Alger" },
  { fullName: "Amira Khelifi", email: "amira@startdz.dz", company: "StartDZ", location: "Oran" },
  { fullName: "Mohamed Hadjadj", email: "mohamed@infraalgerie.dz", company: "InfraAlgérie", location: "Constantine" },
  { fullName: "Lynda Cherif", email: "lynda@datainsight.dz", company: "DataInsight DZ", location: "Alger" },
  { fullName: "Sofiane Boudiaf", email: "sofiane@cosider.dz", company: "COSIDER Groupe", location: "Alger" },
  { fullName: "Nadia Rahmani", email: "nadia@batisseursdz.dz", company: "Bâtisseurs DZ", location: "Blida" },
  { fullName: "Riad Meziane", email: "riad@elecpro.dz", company: "ElecPro Algérie", location: "Annaba" },
  { fullName: "Fatima Benali", email: "fatima@cevital.dz", company: "Cevital", location: "Béjaïa" },
  { fullName: "Yacine Slimani", email: "yacine@fashionalg.dz", company: "Fashion Algeria", location: "Oran" },
  { fullName: "Hamza Ferhat", email: "hamza@cfpdz.dz", company: "Centre Formation Pro DZ", location: "Constantine" },
  { fullName: "Sara Mekki", email: "sara@clinique-saha.dz", company: "Clinique Saha", location: "Alger" },
  { fullName: "Meriem Boukhari", email: "meriem@yassir.dz", company: "Yassir Express", location: "Alger" },
  { fullName: "Houda Djalab", email: "houda@cabinet-benali.dz", company: "Cabinet Benali", location: "Tlemcen" },
  { fullName: "Tarek Mansouri", email: "tarek@sonatrach.dz", company: "Sonatrach", location: "Alger" },
  { fullName: "Imane Berrahou", email: "imane@lephenix.dz", company: "Le Phénix", location: "Alger" },
  { fullName: "Chaima Bensalem", email: "chaima@digitdz.dz", company: "Agence Digit DZ", location: "Oran" },
];

// ─── CANDIDATES ─────────────────────────────────────────────────────────────────
const CANDIDATE_DATA = [
  { fullName: "Yacine Ouali", email: "yacine.ouali@gmail.com", profession: "Full-Stack Development", location: "Alger", gender: "male", workPreference: "hybrid" },
  { fullName: "Amira Ferhat", email: "amira.ferhat@gmail.com", profession: "Accountant", location: "Constantine", gender: "female", workPreference: "onsite" },
  { fullName: "Sofiane Rahmani", email: "sofiane.rahmani@gmail.com", profession: "Data Science & Analytics", location: "Blida", gender: "male", workPreference: "onsite" },
  { fullName: "Lynda Meziane", email: "lynda.meziane@gmail.com", profession: "Teacher", location: "Sétif", gender: "female", workPreference: "onsite" },
  { fullName: "Karim Djalab", email: "karim.djalab@gmail.com", profession: "Graphic Design", location: "Oran", gender: "male", workPreference: "freelance" },
  { fullName: "Nadia Slimani", email: "nadia.slimani@gmail.com", profession: "Delivery Driver", location: "Oran", gender: "female", workPreference: "onsite" },
  { fullName: "Bilal Hadjadj", email: "bilal.hadjadj@gmail.com", profession: "Doctor", location: "Annaba", gender: "male", workPreference: "onsite" },
  { fullName: "Meriem Boudiaf", email: "meriem.boudiaf@gmail.com", profession: "Content Writing", location: "Alger", gender: "female", workPreference: "freelance" },
  { fullName: "Riad Khelifi", email: "riad.khelifi@gmail.com", profession: "IT Support", location: "Blida", gender: "male", workPreference: "onsite" },
  { fullName: "Fatima Cherif", email: "fatima.cherif@gmail.com", profession: "Chef / Cook", location: "Alger", gender: "female", workPreference: "onsite" },
  { fullName: "Hamza Benali", email: "hamza.benali@gmail.com", profession: "Web Development", location: "Tizi Ouzou", gender: "male", workPreference: "freelance" },
  { fullName: "Asma Lounes", email: "asma.lounes@gmail.com", profession: "Content Writing", location: "Tlemcen", gender: "female", workPreference: "freelance" },
  { fullName: "Mohamed Mekki", email: "med.mekki@gmail.com", profession: "Electrician", location: "Tlemcen", gender: "male", workPreference: "freelance" },
  { fullName: "Sara Mansouri", email: "sara.mansouri@gmail.com", profession: "HR Specialist", location: "Alger", gender: "female", workPreference: "onsite" },
  { fullName: "Ilyas Amrani", email: "ilyas.amrani@gmail.com", profession: "Mobile Development", location: "Alger", gender: "male", workPreference: "hybrid" },
];

// ─── JOB TEMPLATES ──────────────────────────────────────────────────────────────
//
// All categories are canonical names from the Master Taxonomy.
//
const JOB_TEMPLATES = [
  // Full-time jobs
  { employerIdx: 0, title: "Senior Full-Stack Developer", category: "Full-Stack Development", type: "full-time", salaryMin: 80000, salaryMax: 150000 },
  { employerIdx: 0, title: "DevOps Engineer", category: "IT Support", type: "full-time", salaryMin: 90000, salaryMax: 160000 },
  { employerIdx: 1, title: "Mobile Developer (Flutter)", category: "Mobile Development", type: "full-time", salaryMin: 70000, salaryMax: 120000 },
  { employerIdx: 2, title: "Network Administrator", category: "IT Support", type: "full-time", salaryMin: 60000, salaryMax: 100000 },
  { employerIdx: 3, title: "Data Analyst", category: "Data Science & Analytics", type: "full-time", salaryMin: 75000, salaryMax: 130000 },
  { employerIdx: 4, title: "IT Support Specialist", category: "IT Support", type: "full-time", salaryMin: 50000, salaryMax: 85000 },
  { employerIdx: 5, title: "Sales Representative", category: "Sales", type: "full-time", salaryMin: 40000, salaryMax: 70000 },
  { employerIdx: 6, title: "Account Manager", category: "Account Management", type: "full-time", salaryMin: 55000, salaryMax: 90000 },
  { employerIdx: 7, title: "Marketing Specialist", category: "Marketing & SEO", type: "full-time", salaryMin: 45000, salaryMax: 75000 },
  { employerIdx: 8, title: "Store Manager", category: "Store Manager", type: "full-time", salaryMin: 45000, salaryMax: 65000 },
  { employerIdx: 9, title: "Teacher", category: "Teacher", type: "full-time", salaryMin: 45000, salaryMax: 70000 },
  { employerIdx: 10, title: "Doctor", category: "Doctor", type: "full-time", salaryMin: 150000, salaryMax: 250000 },
  { employerIdx: 11, title: "Pharmacist", category: "Medical Staff", type: "full-time", salaryMin: 80000, salaryMax: 140000 },
  { employerIdx: 12, title: "Accountant", category: "Accountant", type: "full-time", salaryMin: 55000, salaryMax: 90000 },
  { employerIdx: 12, title: "Financial Analyst", category: "Financial Analyst", type: "full-time", salaryMin: 70000, salaryMax: 120000 },
  { employerIdx: 13, title: "Delivery Driver", category: "Delivery Driver", type: "full-time", salaryMin: 35000, salaryMax: 55000 },
  { employerIdx: 14, title: "Receptionist", category: "Receptionist", type: "full-time", salaryMin: 40000, salaryMax: 60000 },
  { employerIdx: 15, title: "Content Writer", category: "Content Writing", type: "full-time", salaryMin: 45000, salaryMax: 80000 },
  { employerIdx: 15, title: "Graphic Designer", category: "Graphic Design", type: "full-time", salaryMin: 45000, salaryMax: 80000 },
  { employerIdx: 4, title: "Construction Worker", category: "Construction Worker", type: "full-time", salaryMin: 40000, salaryMax: 70000 },
  // Freelance jobs
  { employerIdx: 0, title: "Build a Portfolio Website", category: "Web Development", type: "freelance", salaryMin: 50000, salaryMax: 120000 },
  { employerIdx: 1, title: "Design Brand Identity Package", category: "Logo & Brand Identity", type: "freelance", salaryMin: 40000, salaryMax: 90000 },
  { employerIdx: 2, title: "Create Mobile App Prototype", category: "Mobile Development", type: "freelance", salaryMin: 60000, salaryMax: 130000 },
  { employerIdx: 3, title: "UI/UX Redesign for E-commerce", category: "UI/UX Design", type: "freelance", salaryMin: 50000, salaryMax: 100000 },
  { employerIdx: 4, title: "Content Writing for Blog", category: "Content Writing", type: "freelance", salaryMin: 20000, salaryMax: 50000 },
  { employerIdx: 5, title: "Social Media Campaign", category: "Social Media Management", type: "freelance", salaryMin: 30000, salaryMax: 70000 },
  { employerIdx: 6, title: "Product Photography Shoot", category: "Video Production", type: "freelance", salaryMin: 25000, salaryMax: 60000 },
  { employerIdx: 7, title: "SEO Audit & Optimization", category: "Marketing & SEO", type: "freelance", salaryMin: 35000, salaryMax: 80000 },
  { employerIdx: 8, title: "Video Editing for Promo", category: "Video Production", type: "freelance", salaryMin: 30000, salaryMax: 70000 },
  { employerIdx: 9, title: "Logo Design for Startup", category: "Logo & Brand Identity", type: "freelance", salaryMin: 20000, salaryMax: 50000 },
  { employerIdx: 10, title: "Document Translation EN→FR", category: "Content Writing", type: "freelance", salaryMin: 15000, salaryMax: 40000 },
  { employerIdx: 11, title: "Data Entry Project", category: "Data Science & Analytics", type: "freelance", salaryMin: 20000, salaryMax: 45000 },
  { employerIdx: 12, title: "Paid Ads Campaign Setup", category: "Marketing & SEO", type: "freelance", salaryMin: 30000, salaryMax: 75000 },
  { employerIdx: 13, title: "Shopify Store Setup", category: "Web Development", type: "freelance", salaryMin: 40000, salaryMax: 100000 },
  { employerIdx: 14, title: "Virtual Assistant Tasks", category: "Administrative Assistant", type: "freelance", salaryMin: 20000, salaryMax: 50000 },
  { employerIdx: 15, title: "Accounting Help for SME", category: "Accountant", type: "freelance", salaryMin: 25000, salaryMax: 60000 },
  { employerIdx: 1, title: "Game Development (Unity)", category: "Game Development", type: "freelance", salaryMin: 60000, salaryMax: 150000 },
  { employerIdx: 2, title: "E-commerce Dev (WooCommerce)", category: "Web Development", type: "freelance", salaryMin: 50000, salaryMax: 120000 },
  { employerIdx: 4, title: "Copywriting for Landing Page", category: "Content Writing", type: "freelance", salaryMin: 15000, salaryMax: 40000 },
  { employerIdx: 5, title: "Marketing Strategy", category: "Marketing & SEO", type: "freelance", salaryMin: 40000, salaryMax: 90000 },
];

// ─── ANNOUNCEMENT TEMPLATES ─────────────────────────────────────────────────────
const ANNOUNCEMENT_TEMPLATES = [
  { candidateIdx: 0, category: "Full-Stack Development", workPreference: "hybrid", experienceLevel: "3-5 years", yearsExperience: 4, expectedSalary: 120000 },
  { candidateIdx: 1, category: "Accountant", workPreference: "onsite", experienceLevel: "5-10 years", yearsExperience: 6, expectedSalary: 80000 },
  { candidateIdx: 2, category: "Data Science & Analytics", workPreference: "onsite", experienceLevel: "3-5 years", yearsExperience: 4, expectedSalary: 110000 },
  { candidateIdx: 3, category: "Teacher", workPreference: "freelance", experienceLevel: "3-5 years", yearsExperience: 5, expectedSalary: 50000 },
  { candidateIdx: 4, category: "Graphic Design", workPreference: "freelance", experienceLevel: "1-3 years", yearsExperience: 3, expectedSalary: 40000 },
  { candidateIdx: 5, category: "Delivery Driver", workPreference: "onsite", experienceLevel: "1-3 years", yearsExperience: 2, expectedSalary: 45000 },
  { candidateIdx: 6, category: "Doctor", workPreference: "onsite", experienceLevel: "1-3 years", yearsExperience: 3, expectedSalary: 65000 },
  { candidateIdx: 7, category: "Content Writing", workPreference: "freelance", experienceLevel: "1-3 years", yearsExperience: 3, expectedSalary: 35000 },
  { candidateIdx: 8, category: "IT Support", workPreference: "onsite", experienceLevel: "5-10 years", yearsExperience: 7, expectedSalary: 70000 },
  { candidateIdx: 9, category: "Chef / Cook", workPreference: "onsite", experienceLevel: "5-10 years", yearsExperience: 8, expectedSalary: 90000 },
  { candidateIdx: 10, category: "Web Development", workPreference: "freelance", experienceLevel: "3-5 years", yearsExperience: 3, expectedSalary: 80000 },
  { candidateIdx: 11, category: "Content Writing", workPreference: "freelance", experienceLevel: "3-5 years", yearsExperience: 4, expectedSalary: 30000 },
  { candidateIdx: 12, category: "Electrician", workPreference: "freelance", experienceLevel: "5-10 years", yearsExperience: 8, expectedSalary: 55000 },
  { candidateIdx: 13, category: "HR Specialist", workPreference: "onsite", experienceLevel: "5-10 years", yearsExperience: 6, expectedSalary: 130000 },
  { candidateIdx: 14, category: "Mobile Development", workPreference: "hybrid", experienceLevel: "Entry", yearsExperience: 1, expectedSalary: 70000 },
];

// ─── BUILD FUNCTIONS ────────────────────────────────────────────────────────────
const buildUser = (data, accountType, passwordHash) => {
  const id = uid("user");
  const created = daysAgo(randInt(10, 60));
  const username = data.fullName.toLowerCase().replace(/\s+/g, ".") + randInt(1, 99);
  return {
    _id: id,
    email: data.email,
    passwordHash,
    fullName: data.fullName,
    username,
    location: data.location || "Alger",
    age: randInt(24, 52),
    gender: data.gender || (Math.random() > 0.5 ? "male" : "female"),
    profession: data.profession || "",
    bio: data.bio || `${data.profession || "Professional"} looking for opportunities.`,
    phone: `05${randInt(50, 79)}${randInt(1000000, 9999999)}`,
    acceptedRules: true,
    acceptedRulesAt: created.toISOString(),
    workPreference: data.workPreference || pick(["onsite", "remote", "hybrid", "freelance"]),
    companyName: accountType === "employer" ? data.company || "" : "",
    savedJobIds: [],
    appliedJobIds: [],
    accountType,
    createdAt: created,
    updatedAt: created,
  };
};

const buildJob = (tpl, employer) => {
  const daysBack = randInt(0, 45);
  const slug = catSlug(tpl.category);
  const desc = `We are looking for a skilled ${tpl.category} to join ${employer.companyName} in ${employer.location}. This role offers competitive compensation and growth opportunities.`;
  return {
    _id: uid("job"),
    title: tpl.title,
    company: employer.companyName,
    companyName: employer.companyName,
    type: tpl.type,
    typeLabel: tpl.type === "freelance" ? "Freelance" : "Full-time",
    category: tpl.category,
    categoryId: slug,
    categoryLabel: tpl.category,
    location: employer.location,
    locationLabel: employer.location,
    wilayaName: employer.location,
    salaryMin: tpl.salaryMin + randInt(-5000, 5000),
    salaryMax: tpl.salaryMax + randInt(-5000, 10000),
    salaryCurrency: "DZD",
    salaryPeriod: "monthly",
    postedAgo: postedAgoLabel(daysBack),
    description: desc,
    responsibilities: [
      "Collaborate with team members on daily tasks",
      "Deliver high-quality work on schedule",
      "Participate in planning and strategy meetings",
      "Contribute to continuous improvement",
    ],
    requirements: [
      `Experience in ${tpl.category}`,
      "Strong communication skills",
      "Team player mentality",
      "Problem-solving abilities",
    ],
    skills: [tpl.category, "Communication", "Teamwork", "Problem Solving"],
    tags: [tpl.category, tpl.type === "freelance" ? "Freelance" : "Full-time"],
    status: "published",
    employerId: employer._id,
    employerEmail: employer.email,
    employerName: employer.fullName,
    isActive: true,
    isFeatured: Math.random() < 0.15,
    isUrgent: Math.random() < 0.2,
    viewCount: randInt(5, 400),
    applicationCount: randInt(0, 40),
    savedCount: randInt(0, 30),
    createdAt: daysAgo(daysBack),
    updatedAt: daysAgo(Math.max(0, daysBack - randInt(0, 3))),
  };
};

const buildAnnouncement = (tpl, candidate) => {
  const daysBack = randInt(0, 30);
  const expLevels = ["Junior", "Mid-level", "Senior", "Lead", "Open"];
  const availabilities = ["Immediate", "2 weeks notice", "1 month notice", "Open to offers"];
  const cat = tpl.category;
  return {
    _id: uid("announcement"),
    title: `${candidate.profession} — Looking for ${tpl.workPreference} opportunities in ${cat}`,
    content: `I am a passionate ${candidate.profession} with experience looking for a ${tpl.workPreference} position in ${cat}. I am ready to contribute to a dynamic team and grow professionally.`,
    authorId: candidate._id,
    authorName: candidate.fullName,
    authorAvatar: candidate.avatar || "",
    authorEmail: candidate.email,
    authorRole: "candidate",
    announcementType: "jobseeking",
    professionalTitle: candidate.profession,
    category: cat,
    workPreference: tpl.workPreference,
    preferredLocation: candidate.location,
    experienceLevel: tpl.experienceLevel || pick(expLevels),
    yearsExperience: tpl.yearsExperience || randInt(1, 10),
    expectedSalary: tpl.expectedSalary || randInt(30000, 150000),
    salaryPeriod: "monthly",
    availability: pick(availabilities),
    portfolioUrl: Math.random() > 0.5 ? "https://portfolio.example.com" : "",
    contactEmail: candidate.email,
    contactPhone: `05${randInt(50, 79)}${randInt(1000000, 9999999)}`,
    contactWhatsapp: Math.random() > 0.4 ? `05${randInt(50, 79)}${randInt(1000000, 9999999)}` : "",
    contactTelegram: "",
    skills: [cat, "Communication", "Teamwork", "Problem Solving"],
    attachments: [],
    isActive: true,
    createdAt: daysAgo(daysBack),
    updatedAt: daysAgo(daysBack),
  };
};

// ─── BUILD CATEGORIES COLLECTION ────────────────────────────────────────────────
//
// Reads src/lib/categories.ts at runtime and builds the Firestore categories
// documents from the Master Taxonomy.
//
function buildCategoriesCollection() {
  return [
    // Technology & IT
    { _id: "tech_it", name: "Technology & IT", icon: "💻", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "web_dev", name: "Web Development", icon: "🌐" },
      { id: "mobile_dev", name: "Mobile Development", icon: "📱" },
      { id: "fullstack_dev", name: "Full-Stack Development", icon: "⚙️" },
      { id: "ui_ux", name: "UI/UX Design", icon: "✨" },
      { id: "graphic_design", name: "Graphic Design", icon: "🎨" },
      { id: "game_dev", name: "Game Development", icon: "🎮" },
      { id: "it_support", name: "IT Support", icon: "🖥️" },
      { id: "data_science", name: "Data Science & Analytics", icon: "📈" },
    ]},
    // Creative & Design
    { _id: "creative_design", name: "Creative & Design", icon: "🎨", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "illustration", name: "Illustration", icon: "✏️" },
      { id: "animation", name: "Animation", icon: "🎬" },
      { id: "video_production", name: "Video Production", icon: "🎥" },
      { id: "logo_branding", name: "Logo & Brand Identity", icon: "🏷️" },
      { id: "content_writing", name: "Content Writing", icon: "✍️" },
    ]},
    // Business & Management
    { _id: "business_mgmt", name: "Business & Management", icon: "📊", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "hr_recruitment", name: "HR & Recruitment", icon: "👥" },
      { id: "business_consulting", name: "Business Consulting", icon: "📈" },
      { id: "marketing_seo", name: "Marketing & SEO", icon: "📣" },
      { id: "social_media", name: "Social Media Management", icon: "📱" },
      { id: "account_mgmt", name: "Account Management", icon: "🤝" },
      { id: "sales", name: "Sales", icon: "📞" },
      { id: "project_mgmt", name: "Project Management", icon: "📋" },
    ]},
    // Finance & Accounting
    { _id: "finance_accounting", name: "Finance & Accounting", icon: "💰", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "financial_analyst", name: "Financial Analyst", icon: "📊" },
      { id: "accountant", name: "Accountant", icon: "💰" },
      { id: "bookkeeping", name: "Bookkeeping", icon: "📒" },
      { id: "tax_consultant", name: "Tax Consultant", icon: "🧾" },
    ]},
    // Legal Services
    { _id: "legal_services", name: "Legal Services", icon: "⚖️", workTypes: ["full-time"], subcategories: [
      { id: "lawyer", name: "Lawyer / Legal Advisor", icon: "⚖️" },
      { id: "legal_consulting", name: "Legal Consulting", icon: "⚖️" },
    ]},
    // Engineering & Construction
    { _id: "engineering_construction", name: "Engineering & Construction", icon: "🏗️", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "engineering_design", name: "Engineering Design", icon: "⚙️" },
      { id: "construction_worker", name: "Construction Worker", icon: "🏗️" },
      { id: "electrician", name: "Electrician", icon: "⚡" },
      { id: "plumber", name: "Plumber", icon: "🔧" },
      { id: "hvac_technician", name: "HVAC Technician", icon: "❄️" },
      { id: "mechanic", name: "Mechanic", icon: "🔩" },
    ]},
    // Hospitality & Food Service
    { _id: "hospitality_food", name: "Hospitality & Food Service", icon: "🍽️", workTypes: ["full-time"], subcategories: [
      { id: "hotel_staff", name: "Hotel Staff", icon: "🏨" },
      { id: "receptionist", name: "Receptionist", icon: "📞" },
      { id: "chef_cook", name: "Chef / Cook", icon: "👨‍🍳" },
      { id: "restaurant_worker", name: "Restaurant Worker", icon: "🍽️" },
      { id: "hospitality_staffing", name: "Hospitality Staffing", icon: "🏨" },
    ]},
    // Healthcare
    { _id: "healthcare", name: "Healthcare", icon: "🏥", workTypes: ["full-time"], subcategories: [
      { id: "doctor", name: "Doctor", icon: "🏥" },
      { id: "nurse", name: "Nurse", icon: "💉" },
      { id: "medical_staff", name: "Medical Staff", icon: "🔬" },
    ]},
    // Education & Training
    { _id: "education_training", name: "Education & Training", icon: "🎓", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "professor", name: "Professor", icon: "🎓" },
      { id: "teacher", name: "Teacher", icon: "📚" },
      { id: "tutor", name: "Tutor", icon: "📖" },
      { id: "training_education", name: "Training & Education", icon: "📚" },
    ]},
    // Transportation & Logistics
    { _id: "transportation_logistics", name: "Transportation & Logistics", icon: "🚚", workTypes: ["full-time"], subcategories: [
      { id: "delivery_driver", name: "Delivery Driver", icon: "🚚" },
      { id: "driver", name: "Driver", icon: "🚗" },
      { id: "warehouse_worker", name: "Warehouse Worker", icon: "📦" },
      { id: "logistics_delivery", name: "Logistics & Delivery", icon: "🚚" },
    ]},
    // Retail & Customer Service
    { _id: "retail_customer_service", name: "Retail & Customer Service", icon: "🛍️", workTypes: ["full-time"], subcategories: [
      { id: "store_manager", name: "Store Manager", icon: "🏪" },
      { id: "cashier", name: "Cashier", icon: "💳" },
      { id: "customer_support", name: "Customer Support", icon: "🎧" },
    ]},
    // Administrative
    { _id: "administrative", name: "Administrative", icon: "📋", workTypes: ["freelance", "full-time"], subcategories: [
      { id: "admin_assistant", name: "Administrative Assistant", icon: "📋" },
      { id: "hr_specialist", name: "HR Specialist", icon: "👥" },
    ]},
    // Security & Safety
    { _id: "security_safety", name: "Security & Safety", icon: "🔒", workTypes: ["full-time"], subcategories: [
      { id: "security_guard", name: "Security Guard", icon: "🛡️" },
    ]},
  ];
}

// ─── MAIN ───────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n🔗 Connected to MongoDB at ${MONGO_URI}\n`);

    const db = client.db("mihna");
    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. CLEAR EXISTING DATA
    for (const col of ["users", "jobs", "announcements", "categories"]) {
      const count = await db.collection(col).countDocuments();
      if (count > 0) {
        await db.collection(col).deleteMany({});
        console.log(`🧹 Cleared ${count} docs from mihna.${col}`);
      }
    }

    // 2. INSERT CATEGORIES (Master Taxonomy)
    const categoryDocs = buildCategoriesCollection().map((c) => ({
      ...c,
      label: c.label || c.name,
      isActive: c.isActive !== undefined ? c.isActive : true,
      icon: c.icon || "",
      order: c.order || 0,
    }));
    const catsCol = db.collection("categories");
    try {
      await catsCol.dropIndexes();
    } catch {}
    await catsCol.insertMany(categoryDocs, { ordered: false });
    const totalSubs = categoryDocs.reduce((acc, c) => acc + c.subcategories.length, 0);
    console.log(`📁 Inserted ${categoryDocs.length} parent categories with ${totalSubs} subcategories`);

    // 3. INSERT USERS
    const employers = EMPLOYER_DATA.map((d) => buildUser({ ...d, company: d.company }, "employer", passwordHash));
    const candidates = CANDIDATE_DATA.map((d) => buildUser(d, "candidate", passwordHash));
    const allUsers = [...employers, ...candidates];

    const usersCol = db.collection("users");
    try {
      await usersCol.createIndex({ email: 1 }, { unique: true });
      await usersCol.createIndex({ username: 1 }, { unique: true });
    } catch {}
    await usersCol.insertMany(allUsers, { ordered: false });
    console.log(`👤 Inserted ${employers.length} employers + ${candidates.length} candidates = ${allUsers.length} users`);

    // 4. INSERT JOBS
    const jobs = JOB_TEMPLATES.map((tpl) => buildJob(tpl, employers[tpl.employerIdx]));
    const jobsCol = db.collection("jobs");
    try {
      await jobsCol.createIndex({ employerId: 1 });
      await jobsCol.createIndex({ categoryId: 1 });
      await jobsCol.createIndex({ wilayaName: 1 });
      await jobsCol.createIndex({ createdAt: -1 });
    } catch {}
    await jobsCol.insertMany(jobs, { ordered: false });
    console.log(`💼 Inserted ${jobs.length} jobs (${jobs.filter((j) => j.type === "full-time").length} full-time, ${jobs.filter((j) => j.type === "freelance").length} freelance)`);

    // 5. INSERT ANNOUNCEMENTS
    const announcements = ANNOUNCEMENT_TEMPLATES.map((tpl) => buildAnnouncement(tpl, candidates[tpl.candidateIdx]));
    const annCol = db.collection("announcements");
    try {
      await annCol.createIndex({ authorId: 1 });
      await annCol.createIndex({ category: 1 });
      await annCol.createIndex({ createdAt: -1 });
    } catch {}
    await annCol.insertMany(announcements, { ordered: false });
    console.log(`📢 Inserted ${announcements.length} announcements`);

    // 6. UPDATE STATS
    await db.collection("stats").deleteMany({});
    await db.collection("stats").insertOne({
      _id: "main",
      totalJobs: jobs.length,
      totalCandidates: candidates.length,
      totalCompanies: employers.length,
    });
    console.log(`📊 Stats updated`);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Seeded successfully!

   Categories    : ${categoryDocs.length} parents / ${totalSubs} subcategories
   Users         : ${allUsers.length}  (${employers.length} employers, ${candidates.length} candidates)
   Jobs          : ${jobs.length}  (all using Master Taxonomy categories)
   Announcements : ${announcements.length}  (all using Master Taxonomy categories)

   Password for all accounts: password123

   📌 All categories are now UNIFIED across:
      • Post Job form
      • Post Announcement form
      • Browse Categories page
      • Search filters
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
