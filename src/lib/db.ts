import { Pool } from "pg";

let pool: Pool | undefined;

export function getDbPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

export interface DbSkill {
  id: string;
  slug: string;
  title: string;
  category: "scripting" | "server" | "cloud" | "security" | "internals" | "networking";
  categoryLabel: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  detailedOverview: string;
  modulesCount: number;
  labsCount: number;
  durationHours: number;
  mentorsCount: number;
  rating: number;
  studentsEnrolled: number;
  tags: string[];
  prerequisites: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbMentor {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  studentsMentored: number;
  hourlyRate: number;
  isFreeCommunity: boolean;
  availability: "Available Today" | "This Week" | "Weekend Only";
  timezone: string;
  experienceYears: number;
  skills: string[]; // array of skill slugs e.g. ["active-directory-iam", "powershell-automation"]
  skillsLabels: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSkillsFromDb(options?: {
  category?: string;
  difficulty?: string;
  search?: string;
  featured?: boolean;
}): Promise<DbSkill[]> {
  const p = getDbPool();
  let query = 'SELECT * FROM windowslearning."Skill" WHERE 1=1';
  const params: any[] = [];
  let paramIdx = 1;

  if (options?.category && options.category !== "all") {
    query += ` AND "category" = $${paramIdx++}`;
    params.push(options.category);
  }

  if (options?.difficulty && options.difficulty !== "all") {
    query += ` AND LOWER("difficulty") = LOWER($${paramIdx++})`;
    params.push(options.difficulty);
  }

  if (options?.featured) {
    query += ` AND "featured" = true`;
  }

  if (options?.search && options.search.trim()) {
    query += ` AND ("title" ILIKE $${paramIdx} OR "description" ILIKE $${paramIdx} OR "tags" ILIKE $${paramIdx} OR "categoryLabel" ILIKE $${paramIdx})`;
    params.push(`%${options.search.trim()}%`);
    paramIdx++;
  }

  query += ' ORDER BY "studentsEnrolled" DESC';

  const res = await p.query(query, params);
  return res.rows.map((row: any) => ({
    ...row,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : row.tags,
    prerequisites: typeof row.prerequisites === "string" ? JSON.parse(row.prerequisites || "[]") : row.prerequisites,
  }));
}

export async function getMentorsFromDb(options?: {
  skill?: string;
  availability?: string;
  freeOnly?: boolean;
  search?: string;
}): Promise<DbMentor[]> {
  const p = getDbPool();
  let query = 'SELECT * FROM windowslearning."Mentor" WHERE 1=1';
  const params: any[] = [];
  let paramIdx = 1;

  if (options?.availability && options.availability !== "all") {
    query += ` AND "availability" = $${paramIdx++}`;
    params.push(options.availability);
  }

  if (options?.freeOnly) {
    query += ` AND "isFreeCommunity" = true`;
  }

  if (options?.search && options.search.trim()) {
    query += ` AND ("name" ILIKE $${paramIdx} OR "role" ILIKE $${paramIdx} OR "company" ILIKE $${paramIdx} OR "bio" ILIKE $${paramIdx} OR "skillsLabels" ILIKE $${paramIdx})`;
    params.push(`%${options.search.trim()}%`);
    paramIdx++;
  }

  if (options?.skill && options.skill !== "all") {
    query += ` AND ("skills" ILIKE $${paramIdx} OR "skillsLabels" ILIKE $${paramIdx})`;
    params.push(`%${options.skill}%`);
    paramIdx++;
  }

  query += ' ORDER BY "rating" DESC, "studentsMentored" DESC';

  const res = await p.query(query, params);
  return res.rows.map((row: any) => ({
    ...row,
    skills: typeof row.skills === "string" ? JSON.parse(row.skills || "[]") : row.skills,
    skillsLabels: typeof row.skillsLabels === "string" ? JSON.parse(row.skillsLabels || "[]") : row.skillsLabels,
  }));
}
