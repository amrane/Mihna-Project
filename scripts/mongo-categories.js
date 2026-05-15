import { MongoClient } from "mongodb";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

// ─── NOTES ─────────────────────────────────────────────────────────────────────
//
//  _id = slug   → jobs/announcements store categorySlug as a string,
//                 so _id: slug makes lookups ($lookup) trivial without ObjectId casting.
//
//  workTypes:
//    "freelance"  → project / gig based
//    "fulltime"   → permanent salaried position
//    "internship" → training-period role (usually student / fresh grad)
//
//  requiresLicense: true  → job requires a state-issued license
//  verifiedOnly: true     → poster must upload credentials before listing
//  allowsRemote: true     → jobs in this category can be done remotely
//  popularityScore        → used to sort categories on the homepage (0-100)
//  featured               → pinned in the "Browse Categories" hero section
//
//  All names are trilingual:
//    name       → English
//    name_fr    → French
//    name_ar    → Arabic
//
// ──────────────────────────────────────────────────────────────────────────────

const categories = [

  // ══════════════════════════════════════════════════════════
  //  1. TECHNOLOGY & DEVELOPMENT
  // ══════════════════════════════════════════════════════════
  {
    _id: "technology",
    slug: "technology",
    name: "Technology & Development",
    name_fr: "Technologie et Développement",
    name_ar: "التكنولوجيا والتطوير",
    icon: "laptop-code",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 99,
    featured: true,
    subcategories: [
      { slug: "web-dev",           name: "Web Development",              name_fr: "Développement Web",                    name_ar: "تطوير الويب",                          workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "mobile-dev",        name: "Mobile Development",           name_fr: "Développement Mobile",                 name_ar: "تطوير التطبيقات المحمولة",             workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "ui-ux",             name: "UI/UX Design",                 name_fr: "Design UI/UX",                         name_ar: "تصميم الواجهات وتجربة المستخدم",       workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "data-science",      name: "Data Science & AI",            name_fr: "Science des Données et IA",            name_ar: "علم البيانات والذكاء الاصطناعي",       workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "devops",            name: "DevOps & Cloud",               name_fr: "DevOps et Cloud",                      name_ar: "ديف أوبس والسحابة الحوسبية",           workTypes: ["freelance", "fulltime"] },
      { slug: "cybersecurity",     name: "Cybersecurity",                name_fr: "Cybersécurité",                        name_ar: "الأمن السيبراني",                      workTypes: ["freelance", "fulltime"] },
      { slug: "database",          name: "Database Administration",      name_fr: "Administration des Bases de Données",  name_ar: "إدارة قواعد البيانات",                 workTypes: ["freelance", "fulltime"] },
      { slug: "it-support",        name: "IT Support",                   name_fr: "Support Informatique",                 name_ar: "الدعم التقني",                         workTypes: ["fulltime", "internship"] },
      { slug: "erp",               name: "ERP / CRM Consulting",         name_fr: "Conseil ERP / CRM",                    name_ar: "استشارات الأنظمة المؤسسية",            workTypes: ["freelance", "fulltime"] },
      { slug: "game-dev",          name: "Game Development",             name_fr: "Développement de Jeux",                name_ar: "تطوير الألعاب",                        workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "embedded",          name: "Embedded & IoT",               name_fr: "Systèmes Embarqués et IoT",            name_ar: "الأنظمة المدمجة وإنترنت الأشياء",     workTypes: ["freelance", "fulltime", "internship"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  2. DESIGN & CREATIVE
  // ══════════════════════════════════════════════════════════
  {
    _id: "design",
    slug: "design",
    name: "Design & Creative",
    name_fr: "Design et Créatif",
    name_ar: "التصميم والإبداع",
    icon: "palette",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 92,
    featured: true,
    subcategories: [
      { slug: "graphic-design",    name: "Graphic Design",               name_fr: "Design Graphique",                     name_ar: "التصميم الجرافيكي",                    workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "logo-branding",     name: "Logo & Branding",              name_fr: "Logo et Identité Visuelle",             name_ar: "الشعارات والهوية البصرية",             workTypes: ["freelance", "fulltime"] },
      { slug: "video-editing",     name: "Video Editing",                name_fr: "Montage Vidéo",                         name_ar: "مونتاج الفيديو",                       workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "motion-graphics",   name: "Motion Graphics",              name_fr: "Motion Graphics",                      name_ar: "الموشن جرافيك",                        workTypes: ["freelance", "fulltime"] },
      { slug: "photography",       name: "Photography",                  name_fr: "Photographie",                         name_ar: "التصوير الفوتوغرافي",                  workTypes: ["freelance", "fulltime"] },
      { slug: "illustration",      name: "Illustration",                 name_fr: "Illustration",                         name_ar: "الرسم والتوضيح",                       workTypes: ["freelance", "fulltime"] },
      { slug: "3d-modeling",       name: "3D Modeling & Animation",      name_fr: "Modélisation 3D et Animation",          name_ar: "النمذجة ثلاثية الأبعاد والتحريك",     workTypes: ["freelance", "fulltime"] },
      { slug: "architecture",      name: "Architecture & Interior",      name_fr: "Architecture et Design Intérieur",      name_ar: "العمارة والتصميم الداخلي",             workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "fashion-design",    name: "Fashion Design",               name_fr: "Design de Mode",                       name_ar: "تصميم الأزياء",                        workTypes: ["freelance", "fulltime", "internship"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  3. EDUCATION & TRAINING
  // ══════════════════════════════════════════════════════════
  {
    _id: "education",
    slug: "education",
    name: "Education & Training",
    name_fr: "Éducation et Formation",
    name_ar: "التعليم والتدريب",
    icon: "graduation-cap",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: true,
    allowsRemote: true,
    popularityScore: 88,
    featured: true,
    subcategories: [
      { slug: "school-teaching",   name: "School Teaching",              name_fr: "Enseignement Scolaire",                name_ar: "التدريس المدرسي",                      workTypes: ["fulltime", "internship"] },
      { slug: "university",        name: "University Lecturing",         name_fr: "Cours Universitaires",                 name_ar: "التدريس الجامعي",                      workTypes: ["fulltime"] },
      { slug: "private-tutoring",  name: "Private Tutoring",             name_fr: "Cours Particuliers",                   name_ar: "الدروس الخصوصية",                      workTypes: ["freelance"] },
      { slug: "online-courses",    name: "Online Course Creation",       name_fr: "Création de Cours en Ligne",           name_ar: "إنشاء الدورات الإلكترونية",            workTypes: ["freelance"] },
      { slug: "corporate-training",name: "Corporate Training",           name_fr: "Formation Corporative",                name_ar: "التدريب المؤسسي",                      workTypes: ["freelance", "fulltime"] },
      { slug: "languages",         name: "Language Teaching",            name_fr: "Enseignement des Langues",             name_ar: "تعليم اللغات",                         workTypes: ["freelance", "fulltime"] },
      { slug: "coaching",          name: "Life & Career Coaching",       name_fr: "Coaching Personnel et Professionnel",  name_ar: "التدريب الشخصي والمهني",               workTypes: ["freelance"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  4. HEALTHCARE & MEDICINE
  // ══════════════════════════════════════════════════════════
  {
    _id: "healthcare",
    slug: "healthcare",
    name: "Healthcare & Medicine",
    name_fr: "Santé et Médecine",
    name_ar: "الصحة والطب",
    icon: "stethoscope",
    workTypes: ["fulltime", "internship"],
    requiresLicense: true,
    verifiedOnly: true,
    allowsRemote: false,
    popularityScore: 85,
    featured: true,
    note: "Regulated profession. Freelance is disabled for legal and safety reasons.",
    note_fr: "Profession réglementée. Le freelance est désactivé pour des raisons légales et de sécurité.",
    note_ar: "مهنة منظمة. العمل الحر معطل لأسباب قانونية وأمنية.",
    subcategories: [
      { slug: "general-medicine",  name: "General Medicine",             name_fr: "Médecine Générale",                    name_ar: "الطب العام",                           workTypes: ["fulltime", "internship"] },
      { slug: "surgery",           name: "Surgery",                      name_fr: "Chirurgie",                            name_ar: "الجراحة",                              workTypes: ["fulltime"] },
      { slug: "dentistry",         name: "Dentistry",                    name_fr: "Dentisterie",                          name_ar: "طب الأسنان",                           workTypes: ["fulltime"] },
      { slug: "pharmacy",          name: "Pharmacy",                     name_fr: "Pharmacie",                            name_ar: "الصيدلة",                              workTypes: ["fulltime", "internship"] },
      { slug: "nursing",           name: "Nursing",                      name_fr: "Infirmerie",                           name_ar: "التمريض",                              workTypes: ["fulltime", "internship"] },
      { slug: "physiotherapy",     name: "Physiotherapy",                name_fr: "Physiothérapie",                       name_ar: "العلاج الفيزيائي",                     workTypes: ["fulltime"] },
      { slug: "psychology",        name: "Psychology & Mental Health",   name_fr: "Psychologie et Santé Mentale",         name_ar: "علم النفس والصحة النفسية",             workTypes: ["fulltime"] },
      { slug: "radiology",         name: "Radiology & Lab",              name_fr: "Radiologie et Laboratoire",            name_ar: "الأشعة والمختبرات الطبية",             workTypes: ["fulltime", "internship"] },
      { slug: "veterinary",        name: "Veterinary Medicine",          name_fr: "Médecine Vétérinaire",                 name_ar: "الطب البيطري",                         workTypes: ["fulltime"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  5. LEGAL & COMPLIANCE
  // ══════════════════════════════════════════════════════════
  {
    _id: "legal",
    slug: "legal",
    name: "Legal & Compliance",
    name_fr: "Droit et Conformité",
    name_ar: "القانون والامتثال",
    icon: "scale-balanced",
    workTypes: ["fulltime", "internship"],
    requiresLicense: true,
    verifiedOnly: true,
    allowsRemote: false,
    popularityScore: 72,
    featured: false,
    note: "Practicing law requires a bar license. Freelance listings are disabled.",
    note_fr: "Exercer le droit nécessite un barreau. Les offres freelance sont désactivées.",
    note_ar: "ممارسة القانون تتطلب ترخيصاً من نقابة المحامين. العمل الحر معطل.",
    subcategories: [
      { slug: "lawyer",            name: "Lawyer / Attorney",            name_fr: "Avocat",                               name_ar: "محامي",                                workTypes: ["fulltime"] },
      { slug: "notary",            name: "Notary",                       name_fr: "Notaire",                              name_ar: "موثق",                                 workTypes: ["fulltime"] },
      { slug: "legal-consultant",  name: "Legal Consultant",             name_fr: "Consultant Juridique",                 name_ar: "مستشار قانوني",                        workTypes: ["fulltime"] },
      { slug: "compliance",        name: "Compliance Officer",           name_fr: "Responsable de la Conformité",         name_ar: "مسؤول الامتثال",                       workTypes: ["fulltime"] },
      { slug: "legal-intern",      name: "Legal Internship",             name_fr: "Stage Juridique",                      name_ar: "تربص قانوني",                          workTypes: ["internship"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  6. BUSINESS & MANAGEMENT
  // ══════════════════════════════════════════════════════════
  {
    _id: "business",
    slug: "business",
    name: "Business & Management",
    name_fr: "Affaires et Gestion",
    name_ar: "الأعمال والإدارة",
    icon: "briefcase",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 82,
    featured: true,
    subcategories: [
      { slug: "project-management", name: "Project Management",         name_fr: "Gestion de Projet",                    name_ar: "إدارة المشاريع",                       workTypes: ["freelance", "fulltime"] },
      { slug: "business-analysis",  name: "Business Analysis",          name_fr: "Analyse Métier",                       name_ar: "تحليل الأعمال",                        workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "hr",                 name: "Human Resources",            name_fr: "Ressources Humaines",                  name_ar: "الموارد البشرية",                      workTypes: ["fulltime", "internship"] },
      { slug: "accounting",         name: "Accounting & Finance",       name_fr: "Comptabilité et Finance",              name_ar: "المحاسبة والمالية",                    workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "consulting",         name: "Business Consulting",        name_fr: "Conseil en Entreprise",                name_ar: "الاستشارات التجارية",                  workTypes: ["freelance", "fulltime"] },
      { slug: "supply-chain",       name: "Supply Chain & Logistics",   name_fr: "Chaîne d'Approvisionnement et Logistique", name_ar: "سلسلة الإمداد واللوجستيك",        workTypes: ["fulltime", "internship"] },
      { slug: "entrepreneurship",   name: "Entrepreneurship Support",   name_fr: "Support à l'Entrepreneuriat",           name_ar: "دعم ريادة الأعمال",                   workTypes: ["freelance"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  7. MARKETING & SALES
  // ══════════════════════════════════════════════════════════
  {
    _id: "marketing",
    slug: "marketing",
    name: "Marketing & Sales",
    name_fr: "Marketing et Ventes",
    name_ar: "التسويق والمبيعات",
    icon: "bullhorn",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 91,
    featured: true,
    subcategories: [
      { slug: "social-media",      name: "Social Media Management",      name_fr: "Gestion des Réseaux Sociaux",          name_ar: "إدارة وسائل التواصل الاجتماعي",       workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "seo-sem",           name: "SEO / SEM",                    name_fr: "SEO / SEM",                            name_ar: "تحسين محركات البحث والإعلانات",        workTypes: ["freelance", "fulltime"] },
      { slug: "content-marketing", name: "Content Marketing",            name_fr: "Marketing de Contenu",                 name_ar: "تسويق المحتوى",                        workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "email-marketing",   name: "Email Marketing",              name_fr: "Email Marketing",                      name_ar: "التسويق عبر البريد الإلكتروني",        workTypes: ["freelance", "fulltime"] },
      { slug: "sales-rep",         name: "Sales Representative",         name_fr: "Représentant Commercial",              name_ar: "مندوب المبيعات",                       workTypes: ["fulltime", "internship"] },
      { slug: "media-buying",      name: "Media Buying & Ads",           name_fr: "Achat de Médias et Publicité",         name_ar: "شراء الوسائط والإعلانات",              workTypes: ["freelance", "fulltime"] },
      { slug: "copywriting",       name: "Copywriting",                  name_fr: "Rédaction Publicitaire",               name_ar: "كتابة الإعلانات التسويقية",            workTypes: ["freelance", "fulltime"] },
      { slug: "influencer",        name: "Influencer Marketing",         name_fr: "Marketing d'Influenceurs",             name_ar: "التسويق عبر المؤثرين",                 workTypes: ["freelance"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  8. WRITING & TRANSLATION
  // ══════════════════════════════════════════════════════════
  {
    _id: "writing",
    slug: "writing",
    name: "Writing & Translation",
    name_fr: "Rédaction et Traduction",
    name_ar: "الكتابة والترجمة",
    icon: "pen-nib",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 80,
    featured: false,
    subcategories: [
      { slug: "content-writing",   name: "Content Writing",              name_fr: "Rédaction de Contenu",                 name_ar: "كتابة المحتوى الرقمي",                 workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "translation",       name: "Translation",                  name_fr: "Traduction",                           name_ar: "الترجمة",                              workTypes: ["freelance", "fulltime"] },
      { slug: "proofreading",      name: "Proofreading & Editing",       name_fr: "Relecture et Édition",                 name_ar: "التدقيق اللغوي والتحرير",              workTypes: ["freelance"] },
      { slug: "technical-writing", name: "Technical Writing",            name_fr: "Rédaction Technique",                  name_ar: "الكتابة التقنية",                      workTypes: ["freelance", "fulltime"] },
      { slug: "journalism",        name: "Journalism",                   name_fr: "Journalisme",                          name_ar: "الصحافة والإعلام",                     workTypes: ["freelance", "fulltime"] },
      { slug: "scriptwriting",     name: "Scriptwriting",                name_fr: "Écriture de Scénarios",                name_ar: "كتابة السيناريو",                      workTypes: ["freelance"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  9. ENGINEERING & CONSTRUCTION
  // ══════════════════════════════════════════════════════════
  {
    _id: "engineering",
    slug: "engineering",
    name: "Engineering & Construction",
    name_fr: "Ingénierie et Construction",
    name_ar: "الهندسة والبناء",
    icon: "hard-hat",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: true,
    verifiedOnly: true,
    allowsRemote: false,
    popularityScore: 78,
    featured: false,
    subcategories: [
      { slug: "civil-eng",         name: "Civil Engineering",            name_fr: "Génie Civil",                          name_ar: "الهندسة المدنية",                      workTypes: ["fulltime", "internship"] },
      { slug: "mechanical-eng",    name: "Mechanical Engineering",       name_fr: "Génie Mécanique",                      name_ar: "الهندسة الميكانيكية",                  workTypes: ["fulltime", "internship"] },
      { slug: "electrical-eng",    name: "Electrical Engineering",       name_fr: "Génie Électrique",                     name_ar: "الهندسة الكهربائية",                   workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "construction-mgmt", name: "Construction Management",      name_fr: "Gestion de la Construction",           name_ar: "إدارة البناء والمشاريع الإنشائية",     workTypes: ["fulltime"] },
      { slug: "surveying",         name: "Surveying & Topography",       name_fr: "Arpentage et Topographie",             name_ar: "المساحة والطبوغرافيا",                 workTypes: ["freelance", "fulltime"] },
      { slug: "interior-fitout",   name: "Interior Fit-out",             name_fr: "Finitions Intérieures",                name_ar: "التشطيبات الداخلية",                   workTypes: ["freelance", "fulltime"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  10. HOSPITALITY & TOURISM
  // ══════════════════════════════════════════════════════════
  {
    _id: "hospitality",
    slug: "hospitality",
    name: "Hospitality & Tourism",
    name_fr: "Hôtellerie et Tourisme",
    name_ar: "الضيافة والسياحة",
    icon: "hotel",
    workTypes: ["fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: false,
    popularityScore: 70,
    featured: false,
    note: "Physical-presence roles. Freelance is disabled.",
    note_fr: "Rôles nécessitant une présence physique. Freelance désactivé.",
    note_ar: "مهن تستلزم الحضور الفعلي. العمل الحر معطل.",
    subcategories: [
      { slug: "hotel-reception",   name: "Hotel Reception",              name_fr: "Réception d'Hôtel",                    name_ar: "استقبال الفندق",                       workTypes: ["fulltime", "internship"] },
      { slug: "hotel-management",  name: "Hotel Management",             name_fr: "Gestion d'Hôtel",                      name_ar: "إدارة الفنادق",                        workTypes: ["fulltime"] },
      { slug: "chef-cooking",      name: "Chef & Cooking",               name_fr: "Chef et Cuisine",                      name_ar: "الطبخ والمطبخ",                        workTypes: ["fulltime", "internship"] },
      { slug: "tour-guide",        name: "Tour Guide",                   name_fr: "Guide Touristique",                    name_ar: "مرشد سياحي",                           workTypes: ["fulltime"] },
      { slug: "travel-agency",     name: "Travel Agency",                name_fr: "Agence de Voyages",                    name_ar: "وكالة السفر والسياحة",                 workTypes: ["fulltime", "internship"] },
      { slug: "event-management",  name: "Event Management",             name_fr: "Gestion d'Événements",                 name_ar: "تنظيم الفعاليات والمناسبات",           workTypes: ["freelance", "fulltime"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  11. FINANCE & BANKING
  // ══════════════════════════════════════════════════════════
  {
    _id: "finance",
    slug: "finance",
    name: "Finance & Banking",
    name_fr: "Finance et Banque",
    name_ar: "المالية والمصرفية",
    icon: "landmark",
    workTypes: ["fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: true,
    allowsRemote: false,
    popularityScore: 74,
    featured: false,
    subcategories: [
      { slug: "banking-ops",       name: "Banking Operations",           name_fr: "Opérations Bancaires",                 name_ar: "العمليات المصرفية",                    workTypes: ["fulltime", "internship"] },
      { slug: "audit",             name: "Audit & Control",              name_fr: "Audit et Contrôle",                    name_ar: "التدقيق والمراقبة المالية",            workTypes: ["fulltime", "internship"] },
      { slug: "financial-analysis",name: "Financial Analysis",           name_fr: "Analyse Financière",                   name_ar: "التحليل المالي",                       workTypes: ["fulltime", "internship"] },
      { slug: "tax-consulting",    name: "Tax Consulting",               name_fr: "Conseil Fiscal",                       name_ar: "الاستشارات الضريبية والجبائية",        workTypes: ["freelance", "fulltime"] },
      { slug: "insurance",         name: "Insurance",                    name_fr: "Assurance",                            name_ar: "التأمين",                              workTypes: ["fulltime"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  12. CUSTOMER SERVICE
  // ══════════════════════════════════════════════════════════
  {
    _id: "customer-service",
    slug: "customer-service",
    name: "Customer Service",
    name_fr: "Service à la Clientèle",
    name_ar: "خدمة العملاء",
    icon: "headset",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 76,
    featured: false,
    subcategories: [
      { slug: "call-center",       name: "Call Center Agent",            name_fr: "Agent de Centre d'Appels",             name_ar: "موظف مركز الاتصال",                    workTypes: ["fulltime", "internship"] },
      { slug: "live-chat",         name: "Live Chat Support",            name_fr: "Support par Chat en Direct",           name_ar: "الدعم عبر الدردشة الفورية",            workTypes: ["freelance", "fulltime"] },
      { slug: "technical-support", name: "Technical Support",            name_fr: "Support Technique",                    name_ar: "الدعم التقني للعملاء",                 workTypes: ["freelance", "fulltime", "internship"] },
      { slug: "community-manager", name: "Community Manager",            name_fr: "Gestionnaire Communautaire",           name_ar: "مدير المجتمع الرقمي",                  workTypes: ["freelance", "fulltime"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  13. MEDIA & PRODUCTION
  // ══════════════════════════════════════════════════════════
  {
    _id: "media",
    slug: "media",
    name: "Media & Production",
    name_fr: "Médias et Production",
    name_ar: "الإعلام والإنتاج",
    icon: "clapperboard",
    workTypes: ["freelance", "fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: true,
    popularityScore: 77,
    featured: false,
    subcategories: [
      { slug: "tv-radio",          name: "TV & Radio Broadcasting",      name_fr: "Diffusion TV et Radio",                name_ar: "البث التلفزيوني والإذاعي",             workTypes: ["fulltime", "internship"] },
      { slug: "podcast",           name: "Podcasting",                   name_fr: "Podcasting",                           name_ar: "البودكاست",                            workTypes: ["freelance"] },
      { slug: "film-production",   name: "Film & Video Production",      name_fr: "Production de Films et Vidéos",        name_ar: "إنتاج الأفلام والمحتوى المرئي",        workTypes: ["freelance", "fulltime"] },
      { slug: "sound-engineering", name: "Sound Engineering",            name_fr: "Ingénierie du Son",                    name_ar: "هندسة الصوت والتسجيل",                 workTypes: ["freelance", "fulltime"] },
      { slug: "voiceover",         name: "Voiceover",                    name_fr: "Narration Voix",                       name_ar: "التعليق الصوتي",                       workTypes: ["freelance"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  14. SKILLED TRADES & LABOUR
  // ══════════════════════════════════════════════════════════
  {
    _id: "trades",
    slug: "trades",
    name: "Skilled Trades & Labour",
    name_fr: "Métiers Spécialisés et Main-d'Œuvre",
    name_ar: "الحرف والعمالة الماهرة",
    icon: "wrench",
    workTypes: ["freelance", "fulltime"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: false,
    popularityScore: 65,
    featured: false,
    subcategories: [
      { slug: "electrician",       name: "Electrician",                  name_fr: "Électricien",                          name_ar: "كهربائي",                              workTypes: ["freelance", "fulltime"] },
      { slug: "plumber",           name: "Plumber",                      name_fr: "Plombier",                             name_ar: "سباك",                                 workTypes: ["freelance", "fulltime"] },
      { slug: "carpenter",         name: "Carpenter",                    name_fr: "Menuisier",                            name_ar: "نجار",                                 workTypes: ["freelance", "fulltime"] },
      { slug: "painter",           name: "Painter",                      name_fr: "Peintre",                              name_ar: "دهان",                                 workTypes: ["freelance", "fulltime"] },
      { slug: "mechanic",          name: "Auto Mechanic",                name_fr: "Mécanicien Automobile",                name_ar: "ميكانيكي سيارات",                      workTypes: ["freelance", "fulltime"] },
      { slug: "ac-technician",     name: "AC & Refrigeration Tech",      name_fr: "Technicien Climatisation et Réfrigération", name_ar: "تقني التكييف والتبريد",         workTypes: ["freelance", "fulltime"] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  15. AGRICULTURE & ENVIRONMENT
  // ══════════════════════════════════════════════════════════
  {
    _id: "agriculture",
    slug: "agriculture",
    name: "Agriculture & Environment",
    name_fr: "Agriculture et Environnement",
    name_ar: "الزراعة والبيئة",
    icon: "leaf",
    workTypes: ["fulltime", "internship"],
    requiresLicense: false,
    verifiedOnly: false,
    allowsRemote: false,
    popularityScore: 55,
    featured: false,
    subcategories: [
      { slug: "agronomy",          name: "Agronomy",                     name_fr: "Agronomie",                            name_ar: "الزراعة والمحاصيل",                    workTypes: ["fulltime", "internship"] },
      { slug: "livestock",         name: "Livestock & Breeding",         name_fr: "Élevage et Reproduction",              name_ar: "تربية الحيوانات والمواشي",             workTypes: ["fulltime"] },
      { slug: "environmental-eng", name: "Environmental Engineering",    name_fr: "Ingénierie Environnementale",           name_ar: "الهندسة البيئية",                      workTypes: ["fulltime", "internship"] },
      { slug: "water-resources",   name: "Water Resources",              name_fr: "Ressources en Eau",                    name_ar: "الموارد المائية",                      workTypes: ["fulltime"] },
    ],
  },

];

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n🔗 Connected to MongoDB at ${MONGO_URI}\n`);

    const col = client.db("mihna").collection("categories");

    await col.deleteMany({});
    console.log("🧹 Cleared existing documents in mihna.categories");

    // Indexes
    await col.createIndex({ slug: 1 },              { unique: true });
    await col.createIndex({ workTypes: 1 });
    await col.createIndex({ popularityScore: -1 });
    await col.createIndex({ featured: 1 });
    await col.createIndex({ "subcategories.slug": 1 });
    await col.createIndex({ requiresLicense: 1 });
    // Text search across all three languages
    await col.createIndex({ name: "text", name_fr: "text", name_ar: "text",
                            "subcategories.name": "text", "subcategories.name_fr": "text", "subcategories.name_ar": "text" });
    console.log("✔  Indexes created on mihna.categories");

    const result =     const fixed = categories.map((c) => ({ ...c, label: c.name, isActive: true }));
    await col.insertMany(fixed, { ordered: false });
    console.log(`✅ Inserted ${result.insertedCount} categories into mihna.categories\n`);

    // Summary
    const freelanceCount  = categories.filter(c => c.workTypes.includes("freelance")).length;
    const fulltimeCount   = categories.filter(c => c.workTypes.includes("fulltime")).length;
    const internshipCount = categories.filter(c => c.workTypes.includes("internship")).length;
    const licensed        = categories.filter(c => c.requiresLicense).length;
    const remote          = categories.filter(c => c.allowsRemote).length;
    const totalSubs       = categories.reduce((acc, c) => acc + c.subcategories.length, 0);

    console.log("📊 Summary:");
    console.log(`   Total categories       : ${categories.length}`);
    console.log(`   Total subcategories    : ${totalSubs}`);
    console.log(`   Support Freelance      : ${freelanceCount}`);
    console.log(`   Support Full-time      : ${fulltimeCount}`);
    console.log(`   Support Internship     : ${internshipCount}`);
    console.log(`   Requires License       : ${licensed}`);
    console.log(`   Allows Remote Work     : ${remote}`);
    console.log(`\n🌐 Languages: English (name) · French (name_fr) · Arabic (name_ar)`);
    console.log(`ℹ️  _id = slug → use categorySlug in jobs/announcements for $lookup joins\n`);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();