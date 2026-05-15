export interface SubcategoryDef {
  id: string;
  name: string;
  icon: string;
  type: "child";
  alternateNames: string[];
}

export interface ParentCategoryDef {
  id: string;
  name: string;
  icon: string;
  type: "parent";
  description: string;
  subcategories: SubcategoryDef[];
}

export type PostKind = "freelance" | "full-time" | "business";

const RAW_TAXONOMY: { categories: ParentCategoryDef[] } = {
  categories: [
    {
      id: "tech_it",
      name: "Technology & IT",
      icon: "💻",
      type: "parent",
      description: "Technology, software development, and IT services",
      subcategories: [
        { id: "web_dev", name: "Web Development", icon: "🌐", type: "child", alternateNames: ["E-commerce Development", "Web Developer", "Web Developers"] },
        { id: "mobile_dev", name: "Mobile Development", icon: "📱", type: "child", alternateNames: ["Mobile Developer", "Mobile Developers"] },
        { id: "fullstack_dev", name: "Full-Stack Development", icon: "⚙️", type: "child", alternateNames: ["Full Stack Developer", "Software Developer"] },
        { id: "ui_ux", name: "UI/UX Design", icon: "✨", type: "child", alternateNames: ["UI/UX Designer", "UI/UX Designers", "UX Designer"] },
        { id: "graphic_design", name: "Graphic Design", icon: "🎨", type: "child", alternateNames: ["Graphic Designer", "Graphic Designers", "Designer", "Designers", "Design Services"] },
        { id: "game_dev", name: "Game Development", icon: "🎮", type: "child", alternateNames: ["Game Developer"] },
        { id: "it_support", name: "IT Support", icon: "🖥️", type: "child", alternateNames: ["IT Services", "Technical Support", "Network Administrator", "Technician", "Cybersecurity Specialist"] },
        { id: "data_science", name: "Data Science & Analytics", icon: "📈", type: "child", alternateNames: ["Data Analyst", "Data Engineer", "Data Entry"] },
      ],
    },
    {
      id: "creative_design",
      name: "Creative & Design",
      icon: "🎨",
      type: "parent",
      description: "Creative services, design, and visual content",
      subcategories: [
        { id: "illustration", name: "Illustration", icon: "✏️", type: "child", alternateNames: ["Illustrator"] },
        { id: "animation", name: "Animation", icon: "🎬", type: "child", alternateNames: ["Animator", "Motion Graphics"] },
        { id: "video_production", name: "Video Production", icon: "🎥", type: "child", alternateNames: ["Video Editor", "Video Editing", "Videographer", "Photography"] },
        { id: "logo_branding", name: "Logo & Brand Identity", icon: "🏷️", type: "child", alternateNames: ["Logo and Brand Identity", "Branding Designer", "Brand Designer"] },
        { id: "content_writing", name: "Content Writing", icon: "✍️", type: "child", alternateNames: ["Copywriter", "Copywriting", "Content Creator", "Content Creation", "Translation"] },
      ],
    },
    {
      id: "business_mgmt",
      name: "Business & Management",
      icon: "📊",
      type: "parent",
      description: "Business services, management, and consulting",
      subcategories: [
        { id: "hr_recruitment", name: "HR & Recruitment", icon: "👥", type: "child", alternateNames: ["HR Specialist", "Recruiter", "HR Services"] },
        { id: "business_consulting", name: "Business Consulting", icon: "📈", type: "child", alternateNames: ["Business Consultant", "Management Consulting"] },
        { id: "marketing_seo", name: "Marketing & SEO", icon: "📣", type: "child", alternateNames: ["SEO Specialist", "SEO Specialists", "SEO", "Marketing Specialist", "Marketing Team", "Digital Marketing", "Paid Ads"] },
        { id: "social_media", name: "Social Media Management", icon: "📱", type: "child", alternateNames: ["Social Media Team", "Social Media Manager", "Social Media Specialist"] },
        { id: "account_mgmt", name: "Account Management", icon: "🤝", type: "child", alternateNames: ["Account Manager", "Account Managers"] },
        { id: "sales", name: "Sales", icon: "📞", type: "child", alternateNames: ["Sales Team", "Sales Representative"] },
        { id: "project_mgmt", name: "Project Management", icon: "📋", type: "child", alternateNames: ["Project Manager"] },
      ],
    },
    {
      id: "finance_accounting",
      name: "Finance & Accounting",
      icon: "💰",
      type: "parent",
      description: "Financial and accounting services",
      subcategories: [
        { id: "financial_analyst", name: "Financial Analyst", icon: "📊", type: "child", alternateNames: ["Finance Analyst"] },
        { id: "accountant", name: "Accountant", icon: "💰", type: "child", alternateNames: ["Accounting Services", "Accounting Help"] },
        { id: "bookkeeping", name: "Bookkeeping", icon: "📒", type: "child", alternateNames: [] },
        { id: "tax_consultant", name: "Tax Consultant", icon: "🧾", type: "child", alternateNames: ["Tax Advisor"] },
      ],
    },
    {
      id: "legal_services",
      name: "Legal Services",
      icon: "⚖️",
      type: "parent",
      description: "Legal advice and services",
      subcategories: [
        { id: "lawyer", name: "Lawyer / Legal Advisor", icon: "⚖️", type: "child", alternateNames: ["Legal Advisor", "Attorney"] },
        { id: "legal_consulting", name: "Legal Consulting", icon: "⚖️", type: "child", alternateNames: ["Legal Consultant", "Legal Services"] },
      ],
    },
    {
      id: "engineering_construction",
      name: "Engineering & Construction",
      icon: "🏗️",
      type: "parent",
      description: "Engineering, construction, and skilled trades",
      subcategories: [
        { id: "engineering_design", name: "Engineering Design", icon: "⚙️", type: "child", alternateNames: ["Engineer", "Engineering Services", "Architecture Design"] },
        { id: "construction_worker", name: "Construction Worker", icon: "🏗️", type: "child", alternateNames: ["Construction Services", "Construction"] },
        { id: "electrician", name: "Electrician", icon: "⚡", type: "child", alternateNames: ["Electrical Work"] },
        { id: "plumber", name: "Plumber", icon: "🔧", type: "child", alternateNames: ["Plumbing Services"] },
        { id: "hvac_technician", name: "HVAC Technician", icon: "❄️", type: "child", alternateNames: ["Heating & Cooling", "HVAC Services"] },
        { id: "mechanic", name: "Mechanic", icon: "🔩", type: "child", alternateNames: ["Mechanical Services", "Auto Mechanic"] },
      ],
    },
    {
      id: "hospitality_food",
      name: "Hospitality & Food Service",
      icon: "🍽️",
      type: "parent",
      description: "Hotels, restaurants, and hospitality services",
      subcategories: [
        { id: "hotel_staff", name: "Hotel Staff", icon: "🏨", type: "child", alternateNames: ["Hotel Services"] },
        { id: "receptionist", name: "Receptionist", icon: "📞", type: "child", alternateNames: ["Front Desk"] },
        { id: "chef_cook", name: "Chef / Cook", icon: "👨‍🍳", type: "child", alternateNames: ["Cook", "Chef"] },
        { id: "restaurant_worker", name: "Restaurant Worker", icon: "🍽️", type: "child", alternateNames: ["Server", "Waiter"] },
        { id: "hospitality_staffing", name: "Hospitality Staffing", icon: "🏨", type: "child", alternateNames: ["Hospitality Services", "Hospitality"] },
      ],
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: "🏥",
      type: "parent",
      description: "Medical and healthcare services",
      subcategories: [
        { id: "doctor", name: "Doctor", icon: "🏥", type: "child", alternateNames: ["Physician", "Medical Doctor", "Doctors", "Doctor / Nurse"] },
        { id: "nurse", name: "Nurse", icon: "💉", type: "child", alternateNames: ["Nursing", "Registered Nurse", "Nurses"] },
        { id: "medical_staff", name: "Medical Staff", icon: "🔬", type: "child", alternateNames: ["Medical Services", "Medical Technician", "Pharmacist", "Dentist"] },
      ],
    },
    {
      id: "education_training",
      name: "Education & Training",
      icon: "🎓",
      type: "parent",
      description: "Teaching, tutoring, and educational services",
      subcategories: [
        { id: "professor", name: "Professor", icon: "🎓", type: "child", alternateNames: ["Academic Instructor"] },
        { id: "teacher", name: "Teacher", icon: "📚", type: "child", alternateNames: ["Educator", "Teacher / Trainer"] },
        { id: "tutor", name: "Tutor", icon: "📖", type: "child", alternateNames: ["Tutoring Services"] },
        { id: "training_education", name: "Training & Education", icon: "📚", type: "child", alternateNames: ["Instructor", "Educational Services"] },
      ],
    },
    {
      id: "transportation_logistics",
      name: "Transportation & Logistics",
      icon: "🚚",
      type: "parent",
      description: "Delivery, transportation, and logistics services",
      subcategories: [
        { id: "delivery_driver", name: "Delivery Driver", icon: "🚚", type: "child", alternateNames: ["Courier", "Delivery Services"] },
        { id: "driver", name: "Driver", icon: "🚗", type: "child", alternateNames: ["Taxi Driver", "Bus Driver"] },
        { id: "warehouse_worker", name: "Warehouse Worker", icon: "📦", type: "child", alternateNames: ["Warehouse Services", "Logistics Worker"] },
        { id: "logistics_delivery", name: "Logistics & Delivery", icon: "🚚", type: "child", alternateNames: ["Logistics Services"] },
      ],
    },
    {
      id: "retail_customer_service",
      name: "Retail & Customer Service",
      icon: "🛍️",
      type: "parent",
      description: "Retail, customer support, and sales",
      subcategories: [
        { id: "store_manager", name: "Store Manager", icon: "🏪", type: "child", alternateNames: ["Retail Manager"] },
        { id: "cashier", name: "Cashier", icon: "💳", type: "child", alternateNames: ["Checkout Staff"] },
        { id: "customer_support", name: "Customer Support", icon: "🎧", type: "child", alternateNames: ["Customer Service", "Call Center Agent"] },
      ],
    },
    {
      id: "administrative",
      name: "Administrative",
      icon: "📋",
      type: "parent",
      description: "Administrative and office support services",
      subcategories: [
        { id: "admin_assistant", name: "Administrative Assistant", icon: "📋", type: "child", alternateNames: ["Admin Support", "Office Assistant", "Administrative Support", "Administrative Help", "Virtual Assistant"] },
        { id: "hr_specialist", name: "HR Specialist", icon: "👥", type: "child", alternateNames: ["Human Resources Specialist"] },
      ],
    },
    {
      id: "security_safety",
      name: "Security & Safety",
      icon: "🔒",
      type: "parent",
      description: "Security and safety services",
      subcategories: [
        { id: "security_guard", name: "Security Guard", icon: "🛡️", type: "child", alternateNames: ["Security Services", "Security Officer"] },
      ],
    },
  ],
};

function buildFlatSubcategoryList(): SubcategoryDef[] {
  const result: SubcategoryDef[] = [];
  for (const parent of RAW_TAXONOMY.categories) {
    for (const sub of parent.subcategories) {
      result.push(sub);
    }
  }
  return result;
}

function buildCanonicalNameSet(): Set<string> {
  return new Set(buildFlatSubcategoryList().map((s) => s.name));
}

function buildAlternateNameMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const parent of RAW_TAXONOMY.categories) {
    for (const sub of parent.subcategories) {
      map.set(sub.name.toLowerCase(), sub.name);
      for (const alt of sub.alternateNames) {
        map.set(alt.toLowerCase(), sub.name);
      }
    }
  }
  return map;
}

const ALL_SUBCATEGORIES = buildFlatSubcategoryList();
const CANONICAL_NAMES = buildCanonicalNameSet();
const ALT_NAME_MAP = buildAlternateNameMap();

export function getAllCategoryNames(): string[] {
  return ALL_SUBCATEGORIES.map((s) => s.name);
}

export function getAllSubcategories(): SubcategoryDef[] {
  return [...ALL_SUBCATEGORIES];
}

export function getParentCategories(): ParentCategoryDef[] {
  return [...RAW_TAXONOMY.categories];
}

export function getCategoryEmoji(name: string): string {
  const sub = ALL_SUBCATEGORIES.find((s) => s.name === name);
  return sub?.icon || "💼";
}

export function migrateCategory(oldName: string): string {
  const canonical = ALT_NAME_MAP.get(oldName.trim().toLowerCase());
  return canonical || oldName.trim();
}

export function getParentForSubcategory(subcategoryName: string): ParentCategoryDef | undefined {
  return RAW_TAXONOMY.categories.find((p) =>
    p.subcategories.some((s) => s.name === subcategoryName),
  );
}

export function getCategoryById(id: string): SubcategoryDef | undefined {
  return ALL_SUBCATEGORIES.find((s) => s.id === id);
}

const ALL_NAMES = getAllCategoryNames();

export const CATEGORY_CONFIG: Record<PostKind, { popular: string[]; all: string[] }> = {
  freelance: {
    popular: [
      "Web Development",
      "Graphic Design",
      "Mobile Development",
      "Content Writing",
      "UI/UX Design",
      "Marketing & SEO",
    ],
    all: ALL_NAMES,
  },
  "full-time": {
    popular: [
      "Full-Stack Development",
      "Web Development",
      "Doctor",
      "Sales",
      "Accountant",
      "Delivery Driver",
    ],
    all: ALL_NAMES,
  },
  business: {
    popular: [
      "Web Development",
      "Graphic Design",
      "Marketing & SEO",
      "Medical Staff",
      "Sales",
      "Business Consulting",
    ],
    all: ALL_NAMES,
  },
};

export function getCategoryType(name: string): PostKind | "all" {
  for (const [kind, cfg] of Object.entries(CATEGORY_CONFIG) as [PostKind, { popular: string[]; all: string[] }][]) {
    if (cfg.all.includes(name)) return kind;
  }
  return "all";
}
