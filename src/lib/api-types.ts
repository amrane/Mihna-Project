 export interface Job {
  id?: string;
  title: string;
  company?: string;
  companyName?: string;
  companyLogo: string;
  type: string;
  typeLabel?: string;
  category?: string;
  categoryId?: string;
  location?: string;
  locationLabel?: string;
  wilayaName?: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  timeframe?: string;
  postedAgo?: string;
  description: string;
  responsibilities: string[];
  requirements?: string[];
  skills: string[];
  tags: string[];
  contactInstructions?: string;
  status?: string;
  employerId?: string;
  employerEmail?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
  viewCount?: number;
  applicationCount?: number;
  savedCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  uid: string;
  email: string;
  fullName?: string;
  displayName: string;
  username?: string;
  photoURL?: string;
  avatar?: string;
  role: "jobseeker" | "employer" | "admin";
  phone?: string;
  location?: string;
  bio?: string;
  profession?: string;
  website?: string;
  whatsapp?: string;
  telegram?: string;
  facebook?: string;
  companyName?: string;
  savedJobIds?: string[];
  appliedJobIds?: string[];
  accountType?: "candidate" | "employer";
  createdAt?: string;
  updatedAt?: string;
}

export interface PopularJob {
  id: string;
  name: string;
  count: number;
  icon: string;
  type: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  label?: string;
  icon?: string;
  order?: number;
  workTypes?: string[];
}

export interface LocationItem {
  id: string;
  name: string;
  isRemote?: boolean;
  order: number;
}

export interface WilayaItem {
  id: string;
  name: string;
  code: string;
  nameAr?: string;
  isRemote?: boolean;
}

export interface DairaItem {
  id: string;
  name: string;
  wilayaCode: string;
  wilayaName: string;
}

export interface TrustedByItem {
  id: string;
  name: string;
  logo: string;
}

export interface StatsItem {
  id: string;
  totalJobs: number;
  totalCandidates: number;
  totalCompanies: number;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  authorEmail?: string;
  authorRole?: string;
  announcementType?: "jobseeking" | "general";
  professionalTitle?: string;
  category?: string;
  workPreference?: "freelance" | "full-time" | "both" | "";
  preferredLocation?: string;
  location?: string;
  experienceLevel?: string;
  yearsExperience?: number;
  expectedSalary?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  availability?: string;
  portfolioUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactTelegram?: string;
  tags?: string[];
  skills?: string[];
  attachments?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  description?: string;
  link?: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id?: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  applicantId: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantAvatar?: string;
  applicantProfession?: string;
  applicantLocation?: string;
  applicantPhone?: string;
  applicantWhatsapp?: string;
  applicantTelegram?: string;
  applicantWebsite?: string;
  applicantFacebook?: string;
  primaryContact?: string;
  secondaryContact?: string;
  note?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
