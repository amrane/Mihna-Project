import { MongoClient } from "mongodb";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

// ─── TAG SCHEMA ────────────────────────────────────────────────────────────────
//
//  Each tag has:
//    slug          → unique key used in jobs/announcements tagSlugs[]
//    name          → English
//    name_fr       → French
//    name_ar       → Arabic
//    type          → "skill" | "tool" | "level" | "work_style" | "industry" | "language"
//    categories[]  → which category slugs this tag belongs to (can span multiple)
//    popularityScore → 0-100, used to surface trending tags
//
// ─── TAGS ──────────────────────────────────────────────────────────────────────

const tags = [

  // ══════════════════════════════════════════════════════════
  //  TECH SKILLS
  // ══════════════════════════════════════════════════════════
  { slug: "javascript",     name: "JavaScript",          name_fr: "JavaScript",             name_ar: "جافاسكريبت",           type: "skill",      categories: ["technology"],                popularityScore: 99 },
  { slug: "typescript",     name: "TypeScript",          name_fr: "TypeScript",             name_ar: "تايبسكريبت",           type: "skill",      categories: ["technology"],                popularityScore: 92 },
  { slug: "python",         name: "Python",              name_fr: "Python",                 name_ar: "بايثون",               type: "skill",      categories: ["technology"],                popularityScore: 98 },
  { slug: "react",          name: "React",               name_fr: "React",                  name_ar: "رياكت",                type: "tool",       categories: ["technology"],                popularityScore: 95 },
  { slug: "nodejs",         name: "Node.js",             name_fr: "Node.js",                name_ar: "نود جي إس",            type: "tool",       categories: ["technology"],                popularityScore: 91 },
  { slug: "flutter",        name: "Flutter",             name_fr: "Flutter",                name_ar: "فلاتر",                type: "tool",       categories: ["technology"],                popularityScore: 87 },
  { slug: "reactnative",    name: "React Native",        name_fr: "React Native",           name_ar: "رياكت نيتيف",          type: "tool",       categories: ["technology"],                popularityScore: 85 },
  { slug: "mongodb",        name: "MongoDB",             name_fr: "MongoDB",                name_ar: "مونغو دي بي",          type: "tool",       categories: ["technology"],                popularityScore: 86 },
  { slug: "postgresql",     name: "PostgreSQL",          name_fr: "PostgreSQL",             name_ar: "بوستغريس",             type: "tool",       categories: ["technology"],                popularityScore: 84 },
  { slug: "mysql",          name: "MySQL",               name_fr: "MySQL",                  name_ar: "ماي إس كيو إل",        type: "tool",       categories: ["technology"],                popularityScore: 83 },
  { slug: "docker",         name: "Docker",              name_fr: "Docker",                 name_ar: "دوكر",                 type: "tool",       categories: ["technology"],                popularityScore: 88 },
  { slug: "kubernetes",     name: "Kubernetes",          name_fr: "Kubernetes",             name_ar: "كوبيرنيتيس",           type: "tool",       categories: ["technology"],                popularityScore: 82 },
  { slug: "git",            name: "Git",                 name_fr: "Git",                    name_ar: "جيت",                  type: "tool",       categories: ["technology"],                popularityScore: 97 },
  { slug: "linux",          name: "Linux",               name_fr: "Linux",                  name_ar: "لينكس",                type: "skill",      categories: ["technology"],                popularityScore: 90 },
  { slug: "aws",            name: "AWS",                 name_fr: "AWS",                    name_ar: "أمازون ويب سيرفيس",    type: "tool",       categories: ["technology"],                popularityScore: 89 },
  { slug: "firebase",       name: "Firebase",            name_fr: "Firebase",               name_ar: "فايربيس",              type: "tool",       categories: ["technology"],                popularityScore: 83 },
  { slug: "machine-learning", name: "Machine Learning", name_fr: "Apprentissage Automatique", name_ar: "تعلم الآلة",        type: "skill",      categories: ["technology"],                popularityScore: 90 },
  { slug: "nlp",            name: "NLP",                 name_fr: "Traitement du Langage Naturel", name_ar: "معالجة اللغة الطبيعية", type: "skill", categories: ["technology"],              popularityScore: 80 },
  { slug: "cybersecurity",  name: "Cybersecurity",       name_fr: "Cybersécurité",          name_ar: "الأمن السيبراني",      type: "skill",      categories: ["technology"],                popularityScore: 85 },
  { slug: "restapi",        name: "REST API",            name_fr: "API REST",               name_ar: "واجهة برمجة التطبيقات", type: "skill",      categories: ["technology"],               popularityScore: 88 },
  { slug: "graphql",        name: "GraphQL",             name_fr: "GraphQL",                name_ar: "غراف كيو إل",          type: "skill",      categories: ["technology"],                popularityScore: 78 },
  { slug: "nextjs",         name: "Next.js",             name_fr: "Next.js",                name_ar: "نيكست جي إس",          type: "tool",       categories: ["technology"],                popularityScore: 86 },

  // ══════════════════════════════════════════════════════════
  //  DESIGN TOOLS & SKILLS
  // ══════════════════════════════════════════════════════════
  { slug: "figma",          name: "Figma",               name_fr: "Figma",                  name_ar: "فيغما",                type: "tool",       categories: ["design", "technology"],      popularityScore: 92 },
  { slug: "photoshop",      name: "Photoshop",           name_fr: "Photoshop",              name_ar: "فوتوشوب",              type: "tool",       categories: ["design"],                    popularityScore: 91 },
  { slug: "illustrator",    name: "Illustrator",         name_fr: "Illustrator",            name_ar: "إليستراتور",           type: "tool",       categories: ["design"],                    popularityScore: 88 },
  { slug: "premiere-pro",   name: "Premiere Pro",        name_fr: "Premiere Pro",           name_ar: "بريمير برو",           type: "tool",       categories: ["design", "media"],           popularityScore: 86 },
  { slug: "after-effects",  name: "After Effects",       name_fr: "After Effects",          name_ar: "أفتر إيفكتس",          type: "tool",       categories: ["design", "media"],           popularityScore: 84 },
  { slug: "ui-ux",          name: "UI/UX Design",        name_fr: "Design UI/UX",           name_ar: "تصميم الواجهات وتجربة المستخدم", type: "skill", categories: ["design", "technology"],  popularityScore: 90 },
  { slug: "branding",       name: "Branding",            name_fr: "Image de Marque",        name_ar: "الهوية البصرية",       type: "skill",      categories: ["design", "marketing"],       popularityScore: 83 },
  { slug: "motion-graphics", name: "Motion Graphics",   name_fr: "Motion Graphics",        name_ar: "موشن غرافيك",          type: "skill",      categories: ["design", "media"],           popularityScore: 82 },
  { slug: "3d-modeling",    name: "3D Modeling",         name_fr: "Modélisation 3D",        name_ar: "النمذجة ثلاثية الأبعاد", type: "skill",    categories: ["design"],                    popularityScore: 75 },
  { slug: "photography",    name: "Photography",         name_fr: "Photographie",           name_ar: "التصوير الفوتوغرافي",  type: "skill",      categories: ["design", "media"],           popularityScore: 79 },

  // ══════════════════════════════════════════════════════════
  //  BUSINESS / MANAGEMENT / SOFT SKILLS
  // ══════════════════════════════════════════════════════════
  { slug: "project-management", name: "Project Management", name_fr: "Gestion de Projet", name_ar: "إدارة المشاريع",       type: "skill",      categories: ["business", "engineering"],   popularityScore: 88 },
  { slug: "agile",          name: "Agile / Scrum",       name_fr: "Agile / Scrum",          name_ar: "أجايل / سكرام",       type: "skill",      categories: ["business", "technology"],    popularityScore: 84 },
  { slug: "leadership",     name: "Leadership",          name_fr: "Leadership",             name_ar: "القيادة",              type: "skill",      categories: ["business"],                  popularityScore: 87 },
  { slug: "communication",  name: "Communication",       name_fr: "Communication",          name_ar: "التواصل",              type: "skill",      categories: ["business", "customer-service"], popularityScore: 93 },
  { slug: "negotiation",    name: "Negotiation",         name_fr: "Négociation",            name_ar: "التفاوض",              type: "skill",      categories: ["business", "marketing"],     popularityScore: 80 },
  { slug: "crm",            name: "CRM",                 name_fr: "CRM",                    name_ar: "إدارة علاقات العملاء", type: "tool",       categories: ["business", "marketing", "customer-service"], popularityScore: 78 },
  { slug: "excel",          name: "Microsoft Excel",     name_fr: "Microsoft Excel",        name_ar: "إكسيل",                type: "tool",       categories: ["business", "finance"],       popularityScore: 91 },
  { slug: "erp",            name: "ERP",                 name_fr: "ERP",                    name_ar: "تخطيط موارد المؤسسات", type: "tool",      categories: ["business", "finance"],       popularityScore: 73 },
  { slug: "sap",            name: "SAP",                 name_fr: "SAP",                    name_ar: "ساب",                  type: "tool",       categories: ["business", "finance"],       popularityScore: 72 },

  // ══════════════════════════════════════════════════════════
  //  FINANCE / ACCOUNTING
  // ══════════════════════════════════════════════════════════
  { slug: "accounting",     name: "Accounting",          name_fr: "Comptabilité",           name_ar: "المحاسبة",             type: "skill",      categories: ["finance", "business"],       popularityScore: 85 },
  { slug: "tax",            name: "Tax & Fiscal",        name_fr: "Fiscalité",              name_ar: "الضرائب والجباية",     type: "skill",      categories: ["finance", "legal"],          popularityScore: 78 },
  { slug: "audit",          name: "Audit",               name_fr: "Audit",                  name_ar: "المراجعة والتدقيق",    type: "skill",      categories: ["finance"],                   popularityScore: 75 },
  { slug: "pcn",            name: "PCN (Plan Comptable National)", name_fr: "PCN",          name_ar: "المخطط الوطني للمحاسبة", type: "skill",   categories: ["finance"],                   popularityScore: 70 },
  { slug: "payroll",        name: "Payroll",             name_fr: "Paie",                   name_ar: "الراتب والأجور",       type: "skill",      categories: ["finance", "business"],       popularityScore: 72 },

  // ══════════════════════════════════════════════════════════
  //  MARKETING
  // ══════════════════════════════════════════════════════════
  { slug: "social-media",   name: "Social Media",        name_fr: "Réseaux Sociaux",        name_ar: "وسائل التواصل الاجتماعي", type: "skill",  categories: ["marketing"],                 popularityScore: 94 },
  { slug: "seo",            name: "SEO",                 name_fr: "Référencement Naturel",  name_ar: "تحسين محركات البحث",   type: "skill",      categories: ["marketing", "technology"],   popularityScore: 86 },
  { slug: "content-creation", name: "Content Creation", name_fr: "Création de Contenu",    name_ar: "إنشاء المحتوى",        type: "skill",      categories: ["marketing", "writing"],      popularityScore: 88 },
  { slug: "copywriting",    name: "Copywriting",         name_fr: "Rédaction Publicitaire", name_ar: "كتابة الإعلانات",      type: "skill",      categories: ["marketing", "writing"],      popularityScore: 82 },
  { slug: "facebook-ads",   name: "Facebook Ads",        name_fr: "Publicité Facebook",     name_ar: "إعلانات فيسبوك",      type: "tool",       categories: ["marketing"],                 popularityScore: 85 },
  { slug: "google-ads",     name: "Google Ads",          name_fr: "Google Ads",             name_ar: "إعلانات جوجل",         type: "tool",       categories: ["marketing"],                 popularityScore: 84 },
  { slug: "email-marketing", name: "Email Marketing",   name_fr: "Email Marketing",        name_ar: "التسويق عبر البريد",   type: "skill",      categories: ["marketing"],                 popularityScore: 78 },

  // ══════════════════════════════════════════════════════════
  //  ENGINEERING & CONSTRUCTION
  // ══════════════════════════════════════════════════════════
  { slug: "autocad",        name: "AutoCAD",             name_fr: "AutoCAD",                name_ar: "أوتوكاد",              type: "tool",       categories: ["engineering", "design"],     popularityScore: 82 },
  { slug: "bim",            name: "BIM",                 name_fr: "BIM",                    name_ar: "نمذجة معلومات البناء", type: "tool",       categories: ["engineering"],               popularityScore: 76 },
  { slug: "civil-engineering", name: "Civil Engineering", name_fr: "Génie Civil",          name_ar: "الهندسة المدنية",      type: "skill",      categories: ["engineering"],               popularityScore: 80 },
  { slug: "electrical-engineering", name: "Electrical Engineering", name_fr: "Génie Électrique", name_ar: "الهندسة الكهربائية", type: "skill", categories: ["engineering", "trades"],     popularityScore: 78 },
  { slug: "mechanical-engineering", name: "Mechanical Engineering", name_fr: "Génie Mécanique", name_ar: "الهندسة الميكانيكية", type: "skill",  categories: ["engineering"],               popularityScore: 77 },
  { slug: "site-management", name: "Site Management",   name_fr: "Gestion de Chantier",    name_ar: "إدارة موقع البناء",    type: "skill",      categories: ["engineering"],               popularityScore: 75 },

  // ══════════════════════════════════════════════════════════
  //  HEALTHCARE
  // ══════════════════════════════════════════════════════════
  { slug: "general-medicine", name: "General Medicine", name_fr: "Médecine Générale",      name_ar: "الطب العام",           type: "skill",      categories: ["healthcare"],                popularityScore: 80 },
  { slug: "nursing",        name: "Nursing",             name_fr: "Infirmerie",             name_ar: "التمريض",              type: "skill",      categories: ["healthcare"],                popularityScore: 78 },
  { slug: "pharmacy-skill", name: "Pharmacy",           name_fr: "Pharmacie",              name_ar: "الصيدلة",              type: "skill",      categories: ["healthcare"],                popularityScore: 74 },
  { slug: "diagnosis",      name: "Diagnosis",           name_fr: "Diagnostic",             name_ar: "التشخيص الطبي",        type: "skill",      categories: ["healthcare"],                popularityScore: 79 },

  // ══════════════════════════════════════════════════════════
  //  TRANSPORT & LOGISTICS
  // ══════════════════════════════════════════════════════════
  { slug: "supply-chain",   name: "Supply Chain",        name_fr: "Chaîne Logistique",      name_ar: "سلسلة الإمداد",       type: "skill",      categories: ["business"],                  popularityScore: 74 },
  { slug: "driving-license", name: "Driving License B", name_fr: "Permis de Conduire B",   name_ar: "رخصة السياقة صنف ب",  type: "skill",      categories: ["hospitality"],               popularityScore: 70 },
  { slug: "delivery",       name: "Last-Mile Delivery",  name_fr: "Livraison",              name_ar: "توصيل البضائع",        type: "skill",      categories: ["hospitality"],               popularityScore: 72 },

  // ══════════════════════════════════════════════════════════
  //  WORK STYLE / LEVEL TAGS
  // ══════════════════════════════════════════════════════════
  { slug: "remote",         name: "Remote",              name_fr: "Télétravail",            name_ar: "عمل عن بُعد",          type: "work_style", categories: [],                            popularityScore: 95 },
  { slug: "hybrid",         name: "Hybrid",              name_fr: "Hybride",                name_ar: "هجين",                 type: "work_style", categories: [],                            popularityScore: 87 },
  { slug: "onsite",         name: "On-site",             name_fr: "Présentiel",             name_ar: "حضوري",                type: "work_style", categories: [],                            popularityScore: 82 },
  { slug: "freelance",      name: "Freelance",           name_fr: "Freelance",              name_ar: "عمل حر",               type: "work_style", categories: [],                            popularityScore: 90 },
  { slug: "junior",         name: "Junior",              name_fr: "Junior",                 name_ar: "مبتدئ",                type: "level",      categories: [],                            popularityScore: 85 },
  { slug: "senior",         name: "Senior",              name_fr: "Sénior",                 name_ar: "خبير",                 type: "level",      categories: [],                            popularityScore: 88 },
  { slug: "internship-tag", name: "Internship",          name_fr: "Stage",                  name_ar: "تربص",                 type: "level",      categories: [],                            popularityScore: 80 },
  { slug: "urgent",         name: "Urgent",              name_fr: "Urgent",                 name_ar: "عاجل",                 type: "work_style", categories: [],                            popularityScore: 76 },

  // ══════════════════════════════════════════════════════════
  //  LANGUAGE TAGS
  // ══════════════════════════════════════════════════════════
  { slug: "lang-arabic",    name: "Arabic",              name_fr: "Arabe",                  name_ar: "اللغة العربية",        type: "language",   categories: [],                            popularityScore: 88 },
  { slug: "lang-french",    name: "French",              name_fr: "Français",               name_ar: "اللغة الفرنسية",       type: "language",   categories: [],                            popularityScore: 85 },
  { slug: "lang-english",   name: "English",             name_fr: "Anglais",                name_ar: "اللغة الإنجليزية",     type: "language",   categories: [],                            popularityScore: 90 },
  { slug: "lang-tamazight", name: "Tamazight",           name_fr: "Tamazight",              name_ar: "الأمازيغية",           type: "language",   categories: [],                            popularityScore: 65 },

  // ══════════════════════════════════════════════════════════
  //  WRITING / TRANSLATION
  // ══════════════════════════════════════════════════════════
  { slug: "translation",    name: "Translation",         name_fr: "Traduction",             name_ar: "الترجمة",              type: "skill",      categories: ["writing"],                   popularityScore: 80 },
  { slug: "proofreading",   name: "Proofreading",        name_fr: "Relecture",              name_ar: "التدقيق اللغوي",       type: "skill",      categories: ["writing"],                   popularityScore: 73 },
  { slug: "technical-writing", name: "Technical Writing", name_fr: "Rédaction Technique",  name_ar: "الكتابة التقنية",      type: "skill",      categories: ["writing", "technology"],     popularityScore: 74 },
  { slug: "journalism",     name: "Journalism",          name_fr: "Journalisme",            name_ar: "الصحافة",              type: "skill",      categories: ["writing", "media"],          popularityScore: 70 },

  // ══════════════════════════════════════════════════════════
  //  EDUCATION
  // ══════════════════════════════════════════════════════════
  { slug: "teaching",       name: "Teaching",            name_fr: "Enseignement",           name_ar: "التدريس",              type: "skill",      categories: ["education"],                 popularityScore: 82 },
  { slug: "tutoring",       name: "Private Tutoring",    name_fr: "Cours Particuliers",     name_ar: "الدروس الخصوصية",      type: "skill",      categories: ["education"],                 popularityScore: 79 },
  { slug: "e-learning",     name: "E-Learning",          name_fr: "E-Learning",             name_ar: "التعليم الإلكتروني",   type: "skill",      categories: ["education", "technology"],   popularityScore: 76 },

  // ══════════════════════════════════════════════════════════
  //  HUMAN RESOURCES
  // ══════════════════════════════════════════════════════════
  { slug: "recruitment",    name: "Recruitment",         name_fr: "Recrutement",            name_ar: "التوظيف",              type: "skill",      categories: ["business"],                  popularityScore: 80 },
  { slug: "labor-law",      name: "Labour Law",          name_fr: "Droit du Travail",       name_ar: "قانون العمل",          type: "skill",      categories: ["business", "legal"],         popularityScore: 74 },
  { slug: "hris",           name: "HRIS / SIRH",         name_fr: "SIRH",                   name_ar: "نظام معلومات الموارد البشرية", type: "tool", categories: ["business"],              popularityScore: 68 },

];

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n🔗 Connected to MongoDB at ${MONGO_URI}\n`);

    const col = client.db("mihna").collection("tags");

    await col.deleteMany({});
    console.log("🧹 Cleared existing documents in mihna.tags");

    // Indexes
    await col.createIndex({ slug: 1 },            { unique: true });
    await col.createIndex({ type: 1 });
    await col.createIndex({ categories: 1 });
    await col.createIndex({ popularityScore: -1 });
    // Text search across all three languages
    await col.createIndex({ name: "text", name_fr: "text", name_ar: "text" });
    console.log("✔  Indexes created on mihna.tags");

    const result = await col.insertMany(tags, { ordered: false });
    console.log(`✅ Inserted ${result.insertedCount} tags into mihna.tags\n`);

    // Summary
    const byType = tags.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {});
    console.log("📊 Tags by type:");
    Object.entries(byType).forEach(([type, count]) =>
      console.log(`   ${type.padEnd(15)}: ${count}`)
    );
    console.log(`\n🌐 Languages: English (name), French (name_fr), Arabic (name_ar)\n`);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();