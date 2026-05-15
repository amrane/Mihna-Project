import bcrypt from "bcryptjs";
import cors from "cors";
import crypto from "node:crypto";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist", "client");
const SERVER_DIST_DIR = path.join(ROOT_DIR, "dist", "server");
const ZBI_PATH = path.join(ROOT_DIR, "zbi.json");

const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "mihna-development-secret";
const MONGO_URI = process.env.MONGO_URI;

let memoryMongoServer = null;
let mongoMode = "memory";

const createId = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

const logoForSeed = (seed) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=004225,960018,1f2937`;

const readSeedData = () => {
  if (!fs.existsSync(ZBI_PATH)) return { categories: {}, wilayas: [], jobs: {}, stats: {}, skills: {} };
  return JSON.parse(fs.readFileSync(ZBI_PATH, "utf8"));
};

const buildClientShell = () => {
  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(SERVER_DIST_DIR)) {
    return null;
  }

  const clientAssetsDir = path.join(DIST_DIR, "assets");
  const serverAssetsDir = path.join(SERVER_DIST_DIR, "assets");

  if (!fs.existsSync(clientAssetsDir) || !fs.existsSync(serverAssetsDir)) {
    return null;
  }

  const styleFile = fs
    .readdirSync(clientAssetsDir)
    .find((fileName) => fileName.startsWith("styles-") && fileName.endsWith(".css"));
  const startManifestFile = fs
    .readdirSync(serverAssetsDir)
    .find((fileName) => fileName.startsWith("_tanstack-start-manifest_v-"));

  if (!startManifestFile) {
    return null;
  }

  const startManifest = fs.readFileSync(path.join(serverAssetsDir, startManifestFile), "utf8");
  const clientEntryMatch = startManifest.match(/clientEntry:\s*"([^"]+)"/);
  const clientEntry = clientEntryMatch?.[1];

  if (!clientEntry) {
    return null;
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mihna</title>
    ${styleFile ? `<link rel="stylesheet" href="/assets/${styleFile}" />` : ""}
  </head>
  <body>
    <script type="module">
      import(${JSON.stringify(clientEntry)});
    </script>
  </body>
</html>`;
};

const formatPostedAgo = (input) => {
  if (!input) return "Recently";

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
};

const sanitizeEmail = (email) => email.trim().toLowerCase();
const normalizeUsername = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);

const createToken = (userId) =>
  jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

const categoriesById = new Map();

const baseSchemaOptions = {
  versionKey: false,
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    _id: String,
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    username: { type: String, required: true, index: true },
    location: String,
    age: Number,
    gender: String,
    avatar: String,
    profession: String,
    bio: String,
    phone: String,
    website: String,
    whatsapp: String,
    telegram: String,
    linkedin: String,
    cvFileName: String,
    cvDataUrl: String,
    acceptedRules: Boolean,
    acceptedRulesAt: String,
    workPreference: String,
    companyName: String,
    savedJobIds: { type: [String], default: [] },
    appliedJobIds: { type: [String], default: [] },
    accountType: {
      type: String,
      enum: ["candidate", "employer"],
      default: "candidate",
    },
  },
  baseSchemaOptions,
);

const jobSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    company: String,
    companyName: String,
    companyLogo: String,
    type: { type: String, required: true },
    typeLabel: String,
    category: String,
    categoryId: String,
    location: String,
    locationLabel: String,
    wilayaName: String,
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: "DZD" },
    salaryPeriod: { type: String, default: "monthly" },
    postedAgo: String,
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, default: "published" },
    employerId: String,
    employerEmail: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
  },
  {
    ...baseSchemaOptions,
    strict: false,
  },
);

const categorySchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    label: String,
    icon: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

const tagSchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    category: String,
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

const locationSchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

const announcementSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: String,
    authorAvatar: String,
    authorEmail: String,
    authorRole: String,
    announcementType: { type: String, default: "jobseeking" },
    professionalTitle: String,
    category: String,
    workPreference: String,
    preferredLocation: String,
    experienceLevel: String,
    yearsExperience: Number,
    expectedSalary: Number,
    salaryPeriod: String,
    availability: String,
    portfolioUrl: String,
    contactEmail: String,
    contactPhone: String,
    contactWhatsapp: String,
    contactTelegram: String,
    skills: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    attachments: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

const applicationSchema = new mongoose.Schema(
  {
    _id: String,
    jobId: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true },
    employerId: { type: String, required: true, index: true },
    applicantId: { type: String, required: true, index: true },
    applicantName: String,
    applicantEmail: String,
    applicantAvatar: String,
    applicantProfession: String,
    applicantLocation: String,
    applicantPhone: String,
    applicantWhatsapp: String,
    applicantTelegram: String,
    applicantWebsite: String,
    applicantLinkedin: String,
    primaryContact: String,
    secondaryContact: String,
    note: String,
    status: { type: String, default: "new" },
  },
  baseSchemaOptions,
);

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const notificationSchema = new mongoose.Schema(
  {
    _id: String,
    userId: { type: String, required: true, index: true },
    type: { type: String, default: "info" },
    title: { type: String, required: true },
    description: String,
    link: String,
    isRead: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

const statsSchema = new mongoose.Schema(
  {
    _id: String,
    totalJobs: { type: Number, default: 0 },
    totalCandidates: { type: Number, default: 0 },
    totalCompanies: { type: Number, default: 0 },
  },
  {
    ...baseSchemaOptions,
    timestamps: false,
  },
);

const UserModel = mongoose.model("User", userSchema, "users");
const JobModel = mongoose.model("Job", jobSchema, "jobs");
const CategoryModel = mongoose.model("Category", categorySchema, "categories");
const LocationModel = mongoose.model("Location", locationSchema, "locations");
const AnnouncementModel = mongoose.model("Announcement", announcementSchema, "announcements");
const TagModel = mongoose.model("Tag", tagSchema, "tags");
const StatsModel = mongoose.model("Stats", statsSchema, "stats");
const ApplicationModel = mongoose.model("Application", applicationSchema, "applications");
const NotificationModel = mongoose.model("Notification", notificationSchema, "notifications");

const prettifyType = (type) => {
  const value = `${type || ""}`.toLowerCase();
  if (value.includes("freelance")) return "Freelance";
  if (value.includes("part")) return "Part-time";
  if (value.includes("intern")) return "Internship";
  if (value.includes("full")) return "Full-time";
  return type || "Full-time";
};

const mapSkillName = (skillId, skillLookup) => skillLookup.get(skillId) || skillId;

const toClientUser = (user) => ({
  id: user._id,
  uid: user._id,
  fullName: user.fullName,
  displayName: user.fullName,
  username: user.username,
  email: user.email,
  location: user.location || "",
  age: user.age,
  gender: user.gender || "",
  avatar: user.avatar || "",
  photoURL: user.avatar || "",
  profession: user.profession || "",
  bio: user.bio || "",
  phone: user.phone || "",
  website: user.website || "",
  whatsapp: user.whatsapp || "",
  telegram: user.telegram || "",
  linkedin: user.linkedin || "",
  cvFileName: user.cvFileName || "",
  cvDataUrl: user.cvDataUrl || "",
  acceptedRules: Boolean(user.acceptedRules),
  acceptedRulesAt: user.acceptedRulesAt || "",
  workPreference: user.workPreference,
  companyName: user.companyName || "",
  savedJobIds: Array.isArray(user.savedJobIds) ? user.savedJobIds : [],
  appliedJobIds: Array.isArray(user.appliedJobIds) ? user.appliedJobIds : [],
  accountType: user.accountType,
  role: user.accountType === "employer" ? "employer" : "jobseeker",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const toClientJob = (job) => ({
  id: job._id,
  title: job.title,
  company: job.company || job.companyName || "",
  companyName: job.companyName || job.company || "",
  companyLogo: job.companyLogo || logoForSeed(job.companyName || job.company || job.title),
  type: job.type,
  typeLabel: job.typeLabel || prettifyType(job.type),
  category:
    job.category ||
    categoriesById.get(job.categoryId)?.name ||
    categoriesById.get(job.categoryId)?.label ||
    "Other",
  categoryId: job.categoryId || "",
  location: job.location || job.locationLabel || job.wilayaName || "Anywhere",
  locationLabel: job.locationLabel || job.location || job.wilayaName || "Anywhere",
  wilayaName: job.wilayaName || job.location || job.locationLabel || "Anywhere",
  salaryMin: Number(job.salaryMin || 0),
  salaryMax: Number(job.salaryMax || 0),
  salaryCurrency: job.salaryCurrency || "DZD",
  salaryPeriod: job.salaryPeriod || "monthly",
  postedAgo: job.postedAgo || formatPostedAgo(job.createdAt),
  description: job.description || "",
  responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
  requirements: Array.isArray(job.requirements) ? job.requirements : [],
  skills: Array.isArray(job.skills) ? job.skills.flatMap(s => typeof s === "string" ? s.split(/[\n,]+/).map(x => x.trim()).filter(Boolean) : s) : [],
  tags: Array.isArray(job.tags) ? job.tags : [],
  status: job.status || "published",
  employerId: job.employerId || "",
  employerEmail: job.employerEmail || "",
  isActive: job.isActive !== false,
  isFeatured: Boolean(job.isFeatured),
  isUrgent: Boolean(job.isUrgent),
  viewCount: Number(job.viewCount || 0),
  applicationCount: Number(job.applicationCount || 0),
  savedCount: Number(job.savedCount || 0),
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

const toClientCategory = (category) => ({
  id: category._id,
  name: category.name,
  label: category.label || category.name,
  icon: category.icon || "",
  order: category.order || 0,
  workTypes: category.workTypes || [],
});

const toClientLocation = (location) => ({
  id: location._id,
  name: location.name,
  isRemote: Boolean(location.isRemote),
  order: location.order || 0,
});

const toClientAnnouncement = (announcement) => ({
  id: announcement._id,
  title: announcement.title,
  content: announcement.content,
  authorId: announcement.authorId,
  authorName: announcement.authorName || "User",
  authorAvatar: announcement.authorAvatar || "",
  authorEmail: announcement.authorEmail || "",
  authorRole: announcement.authorRole || "candidate",
  announcementType: announcement.announcementType || "jobseeking",
  professionalTitle: announcement.professionalTitle || "",
  category: announcement.category || "",
  workPreference: announcement.workPreference || "",
  preferredLocation: announcement.preferredLocation || "",
  experienceLevel: announcement.experienceLevel || "",
  yearsExperience: Number(announcement.yearsExperience || 0),
  expectedSalary: Number(announcement.expectedSalary || 0),
  salaryPeriod: announcement.salaryPeriod || "",
  availability: announcement.availability || "",
  portfolioUrl: announcement.portfolioUrl || "",
  contactEmail: announcement.contactEmail || "",
  contactPhone: announcement.contactPhone || "",
  contactWhatsapp: announcement.contactWhatsapp || "",
  contactTelegram: announcement.contactTelegram || "",
    tags: Array.isArray(announcement.tags) ? announcement.tags : [],
  skills: Array.isArray(announcement.skills) ? announcement.skills : [],
  attachments: Array.isArray(announcement.attachments) ? announcement.attachments : [],
  isActive: announcement.isActive !== false,
  createdAt: announcement.createdAt,
  updatedAt: announcement.updatedAt,
});

const toClientApplication = (application) => ({
  id: application._id,
  jobId: application.jobId,
  jobTitle: application.jobTitle,
  employerId: application.employerId,
  applicantId: application.applicantId,
  applicantName: application.applicantName || "Applicant",
  applicantEmail: application.applicantEmail || "",
  applicantAvatar: application.applicantAvatar || "",
  applicantProfession: application.applicantProfession || "",
  applicantLocation: application.applicantLocation || "",
  applicantPhone: application.applicantPhone || "",
  applicantWhatsapp: application.applicantWhatsapp || "",
  applicantTelegram: application.applicantTelegram || "",
  applicantWebsite: application.applicantWebsite || "",
  applicantLinkedin: application.applicantLinkedin || "",
  primaryContact: application.primaryContact || "",
  secondaryContact: application.secondaryContact || "",
  note: application.note || "",
  status: application.status || "new",
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
});

const toClientNotification = (notification) => ({
  id: notification._id,
  userId: notification.userId,
  type: notification.type,
  title: notification.title,
  description: notification.description || "",
  link: notification.link || "",
  isRead: Boolean(notification.isRead),
  createdAt: notification.createdAt,
  updatedAt: notification.updatedAt,
});

const toClientStats = (stats) => ({
  id: stats._id,
  totalJobs: Number(stats.totalJobs || 0),
  totalCandidates: Number(stats.totalCandidates || 0),
  totalCompanies: Number(stats.totalCompanies || 0),
});

const allowedOrderFields = {
  jobs: new Set(["createdAt", "updatedAt", "salaryMin", "salaryMax", "title", "location", "type"]),
  categories: new Set(["order", "name"]),
  locations: new Set(["order", "name"]),
  announcements: new Set(["createdAt", "updatedAt", "title"]),
};

const allowedFilterFields = {
  jobs: new Set(["type", "category", "categoryId", "location", "employerId", "isActive"]),
  categories: new Set(["isActive"]),
  locations: new Set(["isRemote"]),
  announcements: new Set(["authorId", "isActive", "announcementType"]),
};

const getCollectionConfig = (collectionName) => {
  switch (collectionName) {
    case "jobs":
      return {
        model: JobModel,
        mapper: toClientJob,
        defaultSort: { createdAt: -1 },
        defaultFilter: { isActive: true },
      };
    case "categories":
      return {
        model: CategoryModel,
        mapper: toClientCategory,
        defaultSort: { order: 1, name: 1 },
        defaultFilter: { isActive: true },
      };
    case "locations":
      return {
        model: LocationModel,
        mapper: toClientLocation,
        defaultSort: { order: 1, name: 1 },
        defaultFilter: {},
      };
    case "announcements":
      return {
        model: AnnouncementModel,
        mapper: toClientAnnouncement,
        defaultSort: { createdAt: -1 },
        defaultFilter: { isActive: true },
      };
    default:
      return null;
  }
};

const parseFilterValue = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const sendError = (res, status, code, message) =>
  res.status(status).json({
    error: {
      code,
      message,
    },
  });

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return sendError(res, 401, "UNAUTHORIZED", "Please log in to continue.");
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload.sub).lean();

    if (!user) {
      return sendError(res, 401, "UNAUTHORIZED", "Your session is no longer valid.");
    }

    req.user = user;
    next();
  } catch {
    return sendError(res, 401, "UNAUTHORIZED", "Your session is no longer valid.");
  }
};

const refreshCategoryLookup = async () => {
  categoriesById.clear();
  const categories = await CategoryModel.find().lean();
  for (const category of categories) {
    categoriesById.set(category._id, category);
  }
};

const ensureSeedData = async () => {
  const seed = readSeedData();
  const skillLookup = new Map(
    Object.values(seed.skills || {}).map((skill) => [skill.id, skill.name]),
  );

  if ((await CategoryModel.countDocuments()) === 0) {
    const categories = Object.values(seed.categories || {}).map((category, index) => ({
      _id: category.id,
      name: category.name,
      label: category.name,
      icon: category.icon || "",
      order: index + 1,
      isActive: true,
    }));
    await CategoryModel.insertMany(categories);
  }

  await refreshCategoryLookup();

  if ((await LocationModel.countDocuments()) === 0) {
    const wilayas = Object.values(seed.wilayas || {});
    const locations = [
      {
        _id: "location_anywhere",
        name: "Anywhere",
        isRemote: false,
        order: 0,
      },
      {
        _id: "location_remote",
        name: "Remote",
        isRemote: true,
        order: 1,
      },
      ...wilayas
        .filter((wilaya) => wilaya.name !== "Remote")
        .map((wilaya) => ({
          _id: `location_${wilaya.code}`,
          name: wilaya.name,
          isRemote: Boolean(wilaya.isRemote),
          order: Number(wilaya.order || 0) + 1,
        })),
    ];
    await LocationModel.insertMany(locations);
  }

  if ((await TagModel.countDocuments()) === 0) {
    const TAG_LIST = [
      "React", "Node.js", "TypeScript", "Python", "JavaScript", "Java", "PHP", "Laravel",
      "UI/UX", "Figma", "Photoshop", "Illustrator", "Canva", "SEO", "Google Ads",
      "Content Writing", "Blog Writing", "Translation", "English", "French", "Arabic",
      "Video Editing", "Premiere Pro", "After Effects", "CapCut", "Social Media",
      "Instagram", "Facebook", "TikTok", "LinkedIn", "Email Marketing",
      "Data Entry", "Excel", "Word", "PowerPoint", "Customer Service", "Sales",
      "Accounting", "QuickBooks", "Sage", "Project Management", "Trello", "Asana",
      "Technical Support", "IT Support", "Networking", "Graphic Design",
      "Web Development", "Mobile Development", "Flutter", "React Native",
      "Copywriting", "Photography", "Administrative", "Hospitality",
      "Construction", "Teaching", "Healthcare", "Nursing", "Driving",
      "Shopify", "WooCommerce", "WordPress", "HTML/CSS", "Git",
      "Docker", "Kubernetes", "AWS", "Azure", "DevOps", "CI/CD",
      "Machine Learning", "Data Science", "AI", "Deep Learning", "TensorFlow",
      "Angular", "Vue.js", "Next.js", "Express.js", "MongoDB", "PostgreSQL",
      "Redis", "GraphQL", "REST API", "Microservices", "Agile", "Scrum",
      "Public Speaking", "Leadership", "Negotiation", "Copy Editing",
      "Proofreading", "Technical Writing", "Script Writing", "Voice Over",
      "Animator", "3D Modeling", "Blender", "AutoCAD", "Revit", "Civil Engineering",
      "Electrical Engineering", "Mechanical Engineering", "PLC", "SCADA",
      "Digital Marketing", "Content Strategy", "Brand Strategy", "Market Research",
      "Business Development", "CRM", "HubSpot", "Salesforce", "Zoho",
      "Human Resources", "Recruitment", "Training", "Payroll", "Labor Law",
      "Logistics", "Supply Chain", "Procurement", "Inventory Management",
      "Quality Control", "Food Safety", "HACCP", "Cooking", "Baking",
      "Housekeeping", "Cleaning", "Security", "Surveillance", "First Aid",
    ];
    const tags = TAG_LIST.map((name, index) => ({
      _id: `tag_${index + 1}`,
      name,
      isActive: true,
    }));
    await TagModel.insertMany(tags);
  }

  if ((await JobModel.countDocuments()) === 0) {
    const jobs = Object.values(seed.jobs || {}).map((job) => {
      const category = categoriesById.get(job.categoryId);
      const createdAt = job.createdAt ? new Date(job.createdAt) : new Date();
      const updatedAt = job.updatedAt ? new Date(job.updatedAt) : createdAt;
      return {
        _id: job.id || createId("job"),
        title: job.title,
        company: job.companyName,
        companyName: job.companyName,
        companyLogo: job.companyLogo || logoForSeed(job.companyName || job.title),
        type: job.type || "full-time",
        typeLabel: prettifyType(job.type),
        category: category?.name || "Other",
        categoryId: job.categoryId || "",
        location: job.locationLabel || (job.isRemote ? "Remote" : "Anywhere"),
        locationLabel: job.locationLabel || (job.isRemote ? "Remote" : "Anywhere"),
        wilayaName: job.locationLabel || (job.isRemote ? "Remote" : "Anywhere"),
        salaryMin: Number(job.salaryMin || 0),
        salaryMax: Number(job.salaryMax || 0),
        salaryCurrency: job.salaryCurrency || "DZD",
        salaryPeriod: job.salaryPeriod || "monthly",
        postedAgo: formatPostedAgo(createdAt),
        description: job.description || "",
  responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.flatMap(s => typeof s === "string" ? s.split("\n").map(x => x.trim()).filter(Boolean) : s) : [],
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        skills: Array.isArray(job.skills)
          ? job.skills.map((skillId) => mapSkillName(skillId, skillLookup))
          : [],
        tags: Array.isArray(job.tags) ? job.tags : [],
        status: job.status || "published",
        employerId: job.postedByUserId || "",
        employerEmail: job.applicationEmail || "",
        isActive: job.status !== "archived",
        isFeatured: Boolean(job.isFeatured),
        isUrgent: Boolean(job.isUrgent),
        viewCount: Number(job.viewCount || 0),
        applicationCount: Number(job.applicationCount || 0),
        savedCount: Number(job.savedCount || 0),
        createdAt,
        updatedAt,
      };
    });
    await JobModel.insertMany(jobs);
  }

  const stats = seed.stats?.global;
  if (!(await StatsModel.findById("main").lean())) {
    await StatsModel.create({
      _id: "main",
      totalJobs: Number(stats?.totalJobs || 0),
      totalCandidates: Number(stats?.totalUsers || 0),
      totalCompanies: Number(stats?.totalCompanies || 0),
    });
  }
};

const incrementStats = async (updates) => {
  await StatsModel.findByIdAndUpdate(
    "main",
    {
      $inc: updates,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

const connectToDatabase = async () => {
  if (MONGO_URI) {
    try {
      mongoMode = "external";
      await mongoose.connect(MONGO_URI);
      return;
    } catch (err) {
      console.warn("External MongoDB unavailable, falling back to in-memory MongoDB:", err.message);
    }
  }

  memoryMongoServer = await MongoMemoryServer.create();
  mongoMode = "memory";
  await mongoose.connect(memoryMongoServer.getUri(), {
    dbName: "mihna",
  });
};

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json({ limit: "20mb" }));

app.get("/api/health", async (_req, res) => {
  const stats = await StatsModel.findById("main").lean();
  res.json({
    ok: true,
    mongoMode,
    stats: stats ? toClientStats(stats) : null,
  });
});

app.get("/api/tags", async (_req, res) => {
  try {
    const tags = await TagModel.find({ isActive: true }).lean();
    res.json(tags.map((t) => t.name));
  } catch (error) {
    console.error("Loading tags failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load tags.");
  }
});

app.get("/api/stats/counts", async (_req, res) => {
  try {
    const [jobs, candidates, companies] = await Promise.all([
      JobModel.countDocuments({}),
      UserModel.countDocuments({ accountType: "candidate" }),
      UserModel.countDocuments({ accountType: "employer" }),
    ]);

    res.json({
      jobs,
      candidates,
      companies,
    });
  } catch (error) {
    console.error("Loading live stats failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load live stats.");
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const email = sanitizeEmail(req.body.email || "");
    const password = `${req.body.password || ""}`;
    const fullName = `${req.body.fullName || ""}`.trim();
    const accountType = req.body.accountType === "employer" ? "employer" : "candidate";
    const usernameInput = `${req.body.username || email.split("@")[0] || ""}`;
    const username = normalizeUsername(usernameInput);

    if (!email || !password || !fullName || !username) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Full name, email, username, and password are required.",
      );
    }

    if (password.length < 8) {
      return sendError(res, 400, "WEAK_PASSWORD", "Password must be at least 8 characters long.");
    }

    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return sendError(
        res,
        409,
        "EMAIL_IN_USE",
        "This email is already registered. Try logging in instead.",
      );
    }

    const userId = createId("user");
    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await UserModel.create({
      _id: userId,
      email,
      passwordHash,
      fullName,
      username,
      location: req.body.location || "",
      age: req.body.age,
      gender: req.body.gender || "",
      avatar: req.body.avatar || "",
      profession: req.body.profession || "",
      bio: req.body.bio || "",
      phone: req.body.phone || "",
      website: req.body.website || "",
      whatsapp: req.body.whatsapp || "",
      telegram: req.body.telegram || "",
      linkedin: req.body.linkedin || "",
      cvFileName: req.body.cvFileName || "",
      cvDataUrl: req.body.cvDataUrl || "",
      acceptedRules: Boolean(req.body.acceptedRules),
      acceptedRulesAt: req.body.acceptedRulesAt || "",
      workPreference: req.body.workPreference || "",
      companyName: req.body.companyName || "",
      accountType,
    });

    await incrementStats({
      totalCandidates: 1,
      totalCompanies: accountType === "employer" ? 1 : 0,
    });

    res.status(201).json({
      token: createToken(createdUser._id),
      user: toClientUser(createdUser),
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Registration failed. Please try again.");
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = sanitizeEmail(req.body.email || "");
    const password = `${req.body.password || ""}`;

    if (!email || !password) {
      return sendError(res, 400, "VALIDATION_ERROR", "Email and password are required.");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendError(res, 401, "INVALID_CREDENTIALS", "Incorrect email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return sendError(res, 401, "INVALID_CREDENTIALS", "Incorrect email or password.");
    }

    res.json({
      token: createToken(user._id),
      user: toClientUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Login failed. Please try again.");
  }
});

app.get("/api/auth/exists", async (req, res) => {
  try {
    const email = sanitizeEmail(req.query.email || "");
    if (!email) {
      return sendError(res, 400, "VALIDATION_ERROR", "Email is required.");
    }

    const existingUser = await UserModel.findOne({ email }).lean();
    return res.json({ exists: Boolean(existingUser) });
  } catch (error) {
    console.error("Auth exists check failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to check email.");
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  res.json({
    user: toClientUser(req.user),
  });
});

app.patch("/api/users/me", requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "username",
      "email",
      "location",
      "age",
      "gender",
      "avatar",
      "profession",
      "bio",
      "phone",
      "website",
      "whatsapp",
      "telegram",
      "linkedin",
      "cvFileName",
      "cvDataUrl",
      "acceptedRules",
      "acceptedRulesAt",
      "workPreference",
      "companyName",
      "accountType",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.email) {
      updates.email = sanitizeEmail(updates.email);
      const duplicate = await UserModel.findOne({
        email: updates.email,
        _id: { $ne: req.user._id },
      }).lean();

      if (duplicate) {
        return sendError(
          res,
          409,
          "EMAIL_IN_USE",
          "That email address is already in use by another account.",
        );
      }
    }

    if (updates.username) {
      updates.username = normalizeUsername(`${updates.username}`);
    }

    if (updates.accountType && !["candidate", "employer"].includes(updates.accountType)) {
      delete updates.accountType;
    }

    const user = await UserModel.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    res.json({
      user: toClientUser(user),
    });
  } catch (error) {
    console.error("Updating profile failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Profile update failed. Please try again.");
  }
});

app.get("/api/users/by-uid/:uid", async (req, res) => {
  const user = await UserModel.findById(req.params.uid).lean();
  if (!user) {
    return sendError(res, 404, "NOT_FOUND", "User not found.");
  }

  res.json({
    user: toClientUser(user),
  });
});

app.get("/api/data/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;

    if (collection === "stats") {
      const stats = await StatsModel.findById(id).lean();
      if (!stats) {
        return sendError(res, 404, "NOT_FOUND", "Document not found.");
      }
      return res.json(toClientStats(stats));
    }

    const config = getCollectionConfig(collection);
    if (!config) {
      return sendError(res, 404, "UNKNOWN_COLLECTION", "Collection not supported.");
    }

    const document = await config.model.findById(id).lean();
    if (!document) {
      return sendError(res, 404, "NOT_FOUND", "Document not found.");
    }

    if (collection === "jobs") {
      await JobModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

    return res.json(config.mapper(document));
  } catch (error) {
    console.error("Failed to load document:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load the requested document.");
  }
});

app.get("/api/data/:collection", async (req, res) => {
  try {
    const { collection } = req.params;

    if (collection === "stats") {
      const stats = await StatsModel.findById("main").lean();
      return res.json(stats ? [toClientStats(stats)] : []);
    }

    const config = getCollectionConfig(collection);
    if (!config) {
      return sendError(res, 404, "UNKNOWN_COLLECTION", "Collection not supported.");
    }

    const filter = { ...config.defaultFilter };
    const { filterField, filterValue, orderField } = req.query;

    if (
      typeof filterField === "string" &&
      typeof filterValue === "string" &&
      allowedFilterFields[collection]?.has(filterField)
    ) {
      filter[filterField] = parseFilterValue(filterValue);
    }

    let sort = config.defaultSort;
    if (typeof orderField === "string" && allowedOrderFields[collection]?.has(orderField)) {
      sort = { [orderField]: 1 };
    }

    const documents = await config.model.find(filter).sort(sort).lean();
    res.json(documents.map(config.mapper));
  } catch (error) {
    console.error("Failed to load collection:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load the requested collection.");
  }
});

app.post("/api/jobs", requireAuth, async (req, res) => {
  try {
    if (req.user.accountType !== "employer") {
      return sendError(res, 403, "FORBIDDEN", "Only employer accounts can publish jobs.");
    }

    const title = `${req.body.title || ""}`.trim();
    const description = `${req.body.description || ""}`.trim();
    const category = `${req.body.category || ""}`.trim();
    const timeframe = `${req.body.timeframe || ""}`.trim();
    const contactInstructions = `${req.body.contactInstructions || ""}`.trim();

    if (!title || !description || !category) {
      return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Title, description, and category are required.",
      );
    }

    const job = await JobModel.create({
      _id: createId("job"),
      title,
      company: req.body.company || req.user.companyName || req.user.fullName,
      companyName: req.body.company || req.user.companyName || req.user.fullName,
      companyLogo:
        req.body.companyLogo ||
        req.user.avatar ||
        logoForSeed(req.user.companyName || req.user.fullName || title),
      type: req.body.type || "full-time",
      typeLabel: req.body.typeLabel || prettifyType(req.body.type),
      category,
      categoryId: req.body.categoryId || "",
      location: req.body.location || "Anywhere",
      locationLabel: req.body.location || "Anywhere",
      wilayaName: req.body.location || "Anywhere",
      salaryMin: Number(req.body.salaryMin || 0),
      salaryMax: Number(req.body.salaryMax || 0),
      salaryCurrency: req.body.salaryCurrency || "DZD",
      salaryPeriod: req.body.salaryPeriod || "monthly",
      timeframe,
      postedAgo: "Just now",
      description,
      responsibilities: Array.isArray(req.body.responsibilities) ? req.body.responsibilities : [],
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      contactInstructions,
      status: req.body.status || "published",
      employerId: req.user._id,
      employerEmail: req.user.email,
      isActive: req.body.isActive !== false,
      isFeatured: Boolean(req.body.isFeatured),
      isUrgent: Boolean(req.body.isUrgent),
      viewCount: 0,
      applicationCount: 0,
      savedCount: 0,
    });

    await incrementStats({ totalJobs: 1 });

    res.status(201).json({
      id: job._id,
      job: toClientJob(job),
    });
  } catch (error) {
    console.error("Creating job failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to create the job.");
  }
});

app.post("/api/jobs/:id/save", requireAuth, async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return sendError(res, 404, "NOT_FOUND", "Job not found.");
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return sendError(res, 401, "UNAUTHORIZED", "Your session is no longer valid.");
    }

    const savedJobIds = Array.isArray(user.savedJobIds) ? user.savedJobIds : [];
    const alreadySaved = savedJobIds.includes(job._id);

    user.savedJobIds = alreadySaved
      ? savedJobIds.filter((savedJobId) => savedJobId !== job._id)
      : [job._id, ...savedJobIds.filter((savedJobId) => savedJobId !== job._id)];

    job.savedCount = Math.max(0, Number(job.savedCount || 0) + (alreadySaved ? -1 : 1));

    await Promise.all([user.save(), job.save()]);

    res.json({
      saved: !alreadySaved,
      user: toClientUser(user),
    });
  } catch (error) {
    console.error("Saving job failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to update saved jobs.");
  }
});

app.post("/api/jobs/:id/apply", requireAuth, async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return sendError(res, 404, "NOT_FOUND", "Job not found.");
    }

    if (job.employerId === req.user._id) {
      return sendError(
        res,
        403,
        "OWN_JOB_APPLICATION",
        "You cannot apply to a job that you created.",
      );
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return sendError(res, 401, "UNAUTHORIZED", "Your session is no longer valid.");
    }

    const appliedJobIds = Array.isArray(user.appliedJobIds) ? user.appliedJobIds : [];
    const existingApplication = await ApplicationModel.findOne({
      jobId: job._id,
      applicantId: user._id,
    }).lean();
    const alreadyApplied = appliedJobIds.includes(job._id) || Boolean(existingApplication);

    if (!alreadyApplied) {
      await ApplicationModel.create({
        _id: createId("application"),
        jobId: job._id,
        jobTitle: job.title,
        employerId: job.employerId || "",
        applicantId: user._id,
        applicantName: user.fullName,
        applicantEmail: user.email,
        applicantAvatar: user.avatar || "",
        applicantProfession: user.profession || "",
        applicantLocation: user.location || "",
        applicantPhone: user.phone || "",
        applicantWhatsapp: user.whatsapp || "",
        applicantTelegram: user.telegram || "",
        applicantWebsite: user.website || "",
        applicantLinkedin: user.linkedin || "",
        primaryContact: `${req.body.primaryContact || ""}`.trim(),
        secondaryContact: `${req.body.secondaryContact || ""}`.trim(),
        note: `${req.body.note || ""}`.trim(),
        status: "new",
      });
      user.appliedJobIds = [job._id, ...appliedJobIds];
      job.applicationCount = Math.max(0, Number(job.applicationCount || 0) + 1);
      await Promise.all([user.save(), job.save()]);

      if (job.employerId) {
        await NotificationModel.create({
          _id: createId("notif"),
          userId: job.employerId,
          type: "application",
          title: `New applicant for "${job.title}"`,
          description: `${user.fullName} has applied to your job posting "${job.title}".`,
          link: "/profile",
        }).catch((err) => console.error("Failed to create notification:", err));
      }
    }

    res.json({
      applied: !alreadyApplied,
      alreadyApplied,
      user: toClientUser(user),
    });
  } catch (error) {
    console.error("Applying to job failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to apply to the job.");
  }
});

app.get("/api/employer/applications", requireAuth, async (req, res) => {
  try {
    if (req.user.accountType !== "employer") {
      return sendError(res, 403, "FORBIDDEN", "Only employer accounts can view applicants.");
    }

    const applications = await ApplicationModel.find({ employerId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      applications: applications.map(toClientApplication),
    });
  } catch (error) {
    console.error("Loading employer applications failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load applicants.");
  }
});

app.get("/api/candidate/applications", requireAuth, async (req, res) => {
  try {
    if (req.user.accountType !== "candidate") {
      return sendError(res, 403, "FORBIDDEN", "Only candidates can view their applications.");
    }

    const applications = await ApplicationModel.find({ applicantId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      applications: applications.map(toClientApplication),
    });
  } catch (error) {
    console.error("Loading candidate applications failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load applications.");
  }
});

app.patch("/api/applications/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return sendError(res, 400, "VALIDATION_ERROR", "Status must be 'accepted' or 'rejected'.");
    }

    const application = await ApplicationModel.findById(req.params.id);
    if (!application) {
      return sendError(res, 404, "NOT_FOUND", "Application not found.");
    }

    if (application.employerId !== req.user._id) {
      return sendError(res, 403, "FORBIDDEN", "You can only update your own job applications.");
    }

    application.status = status;
    await application.save();

    const notifTitle =
      status === "accepted"
        ? `Your application for "${application.jobTitle}" has been accepted!`
        : `Your application for "${application.jobTitle}" has been declined.`;
    const notifDesc =
      status === "accepted"
        ? "The employer is interested in your profile. They will contact you soon."
        : "The employer has decided to move forward with other candidates.";

    await NotificationModel.create({
      _id: createId("notif"),
      userId: application.applicantId,
      type: status === "accepted" ? "success" : "info",
      title: notifTitle,
      description: notifDesc,
      link: "/profile?tab=applied",
    });

    res.json({ application: toClientApplication(application) });
  } catch (error) {
    console.error("Updating application status failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to update application status.");
  }
});

app.get("/api/notifications", requireAuth, async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      notifications: notifications.map(toClientNotification),
    });
  } catch (error) {
    console.error("Loading notifications failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to load notifications.");
  }
});

app.post("/api/notifications/read-all", requireAuth, async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true },
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Marking all notifications as read failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to mark notifications as read.");
  }
});

app.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true },
    ).lean();

    if (!notification) {
      return sendError(res, 404, "NOT_FOUND", "Notification not found.");
    }

    res.json({ notification: toClientNotification(notification) });
  } catch (error) {
    console.error("Marking notification as read failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to mark notification as read.");
  }
});

app.patch("/api/jobs/:id", requireAuth, async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return sendError(res, 404, "NOT_FOUND", "Job not found.");
    }

    if (job.employerId !== req.user._id) {
      return sendError(res, 403, "FORBIDDEN", "You can only edit your own jobs.");
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({
      job: toClientJob(job),
    });
  } catch (error) {
    console.error("Updating job failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to update the job.");
  }
});

app.delete("/api/jobs/:id", requireAuth, async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id).lean();
    if (!job) {
      return sendError(res, 404, "NOT_FOUND", "Job not found.");
    }

    if (job.employerId !== req.user._id) {
      return sendError(res, 403, "FORBIDDEN", "You can only delete your own jobs.");
    }

    await Promise.all([
      JobModel.findByIdAndDelete(req.params.id),
      ApplicationModel.deleteMany({ jobId: req.params.id }),
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Deleting job failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to delete the job.");
  }
});

app.post("/api/announcements", requireAuth, async (req, res) => {
  try {
    if (req.user.accountType !== "candidate") {
      return sendError(
        res,
        403,
        "FORBIDDEN",
        "Jobseeking offers are available for candidate accounts only.",
      );
    }

    const title = `${req.body.title || ""}`.trim();
    const content = `${req.body.content || ""}`.trim();

    if (!title || !content) {
      return sendError(res, 400, "VALIDATION_ERROR", "Title and content are required.");
    }

    const announcement = await AnnouncementModel.create({
      _id: createId("announcement"),
      title,
      content,
      authorId: req.user._id,
      authorName: req.body.authorName || req.user.fullName,
      authorAvatar: req.user.avatar || "",
      authorEmail: req.user.email,
      authorRole: req.user.accountType,
      announcementType: req.body.announcementType || "jobseeking",
      professionalTitle: req.body.professionalTitle || req.user.profession || "",
      category: req.body.category || "",
      workPreference: req.body.workPreference || req.user.workPreference || "",
      preferredLocation: req.body.preferredLocation || req.user.location || "",
      experienceLevel: req.body.experienceLevel || "",
      yearsExperience: Number(req.body.yearsExperience || 0),
      expectedSalary: Number(req.body.expectedSalary || 0),
      salaryPeriod: req.body.salaryPeriod || "monthly",
      availability: req.body.availability || "",
      portfolioUrl: req.body.portfolioUrl || req.user.website || "",
      contactEmail: req.body.contactEmail || req.user.email,
      contactPhone: req.body.contactPhone || req.user.phone || "",
      contactWhatsapp: req.body.contactWhatsapp || req.user.whatsapp || "",
      contactTelegram: req.body.contactTelegram || req.user.telegram || "",
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      attachments: Array.isArray(req.body.attachments) ? req.body.attachments : [],
      isActive: true,
    });

    res.status(201).json({
      id: announcement._id,
      announcement: toClientAnnouncement(announcement),
    });
  } catch (error) {
    console.error("Creating announcement failed:", error);
    return sendError(res, 500, "SERVER_ERROR", "Failed to create the announcement.");
  }
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get(/^(?!\/api).*/, (_req, res) => {
    const htmlPath = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }

    const html = buildClientShell();
    if (!html) {
      return res
        .status(500)
        .send("Frontend build output is missing. Run `npm run build` before starting production.");
    }

    return res.status(200).type("html").send(html);
  });
}

const start = async () => {
  try {
    await connectToDatabase();
    await ensureSeedData();
    await refreshCategoryLookup();

    app.listen(PORT, () => {
      console.log(`Mihna API listening on http://localhost:${PORT} (${mongoMode} MongoDB)`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    if (memoryMongoServer) {
      await memoryMongoServer.stop();
    }
    process.exit(1);
  }
};

start();
