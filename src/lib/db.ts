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
  category: string;
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
  skills: string[];
  skillsLabels: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string | null;
  avatarUrl?: string | null;
  roles: string[];
  activeRole: string;
  emailVerified: boolean;
  learnerOnboardingComplete: boolean;
  mentorOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbLearnerProfile {
  id: string;
  userId: string;
  interestedSkills: string[];
  primaryGoal: string;
  experienceLevel: string;
  lookingFor: string;
  timeCommitment: string;
}

export interface DbMentorProfile {
  id: string;
  userId: string;
  title: string;
  bio: string;
  location: string;
  teachingSkills: string[];
  experienceYears: number;
  hourlyRate: number;
  isFreeCommunity: boolean;
  availability: string;
  preferredLanguage: string;
  isPublished: boolean;
  rating: number;
  reviewsCount: number;
}

export interface DbBooking {
  id: string;
  learnerId: string;
  mentorId: string;
  skillSlug: string;
  topic: string;
  scheduledDate: Date;
  timeSlot: string;
  status: string;
  notes?: string | null;
  createdAt: Date;
  mentorName?: string;
  mentorAvatar?: string;
}

// ----------------------------------------------------
// Database Query Functions
// ----------------------------------------------------

export async function getSkillsFromDb(filters?: {
  category?: string;
  difficulty?: string;
  search?: string;
  featured?: boolean;
}): Promise<DbSkill[]> {
  const db = getDbPool();
  let query = 'SELECT * FROM windowslearning."Skill" WHERE 1=1';
  const values: any[] = [];

  if (filters?.category && filters.category !== "all") {
    values.push(filters.category);
    query += ` AND ("category" = $${values.length})`;
  }

  if (filters?.difficulty && filters.difficulty !== "all") {
    values.push(filters.difficulty);
    query += ` AND (LOWER("difficulty") = LOWER($${values.length}))`;
  }

  if (filters?.search && filters.search.trim()) {
    values.push(`%${filters.search.trim()}%`);
    query += ` AND ("title" ILIKE $${values.length} OR "description" ILIKE $${values.length} OR "categoryLabel" ILIKE $${values.length})`;
  }

  if (filters?.featured !== undefined) {
    values.push(filters.featured);
    query += ` AND ("featured" = $${values.length})`;
  }

  query += ' ORDER BY "featured" DESC, "rating" DESC;';

  const res = await db.query(query, values);
  return res.rows.map((row) => ({
    ...row,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags || [],
    prerequisites:
      typeof row.prerequisites === "string"
        ? JSON.parse(row.prerequisites)
        : row.prerequisites || [],
  }));
}

export async function getAllSkillsFromDb(): Promise<DbSkill[]> {
  return getSkillsFromDb();
}

export async function getMentorsFromDb(filters?: {
  skill?: string;
  availability?: string;
  freeOnly?: boolean;
  search?: string;
}): Promise<DbMentor[]> {
  const db = getDbPool();

  // 1. Fetch real onboarded mentors from MentorProfile + User
  const realMentorsRes = await db.query(`
    SELECT 
      mp."id",
      mp."userId",
      u."name",
      COALESCE(u."avatarUrl", 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150') as "avatar",
      mp."title" as "role",
      COALESCE(mp."location", 'India') as "company",
      mp."bio",
      COALESCE(mp."hourlyRate", 200) as "hourlyRate",
      COALESCE(mp."isFreeCommunity", false) as "isFreeCommunity",
      COALESCE(mp."availability", 'Available Today') as "availability",
      COALESCE(mp."experienceYears", 2) as "experienceYears",
      mp."teachingSkills" as "skills",
      mp."teachingSkills" as "skillsLabels",
      COALESCE(mp."preferredLanguage", 'Hindi / English') as "timezone",
      true as "featured",
      0 as "reviewsCount",
      5.0 as "rating",
      0 as "studentsMentored",
      mp."createdAt",
      mp."updatedAt"
    FROM windowslearning."MentorProfile" mp
    JOIN windowslearning."User" u ON mp."userId" = u."id"
    ORDER BY mp."updatedAt" DESC;
  `);

  const realMentors: DbMentor[] = realMentorsRes.rows.map((row) => ({
    id: row.userId || row.id,
    slug: (row.name || "mentor").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + (row.userId || row.id).substring(0, 5),
    name: row.name,
    avatar: row.avatar,
    role: row.role || "Verified Mentor",
    company: row.company || "India",
    bio: row.bio || "",
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviewsCount) || 0,
    studentsMentored: Number(row.studentsMentored) || 0,
    hourlyRate: Number(row.hourlyRate) || 0,
    isFreeCommunity: Boolean(row.isFreeCommunity),
    availability: (row.availability as any) || "Available Today",
    timezone: row.timezone || "India (IST)",
    experienceYears: Number(row.experienceYears) || 2,
    skills: typeof row.skills === "string" ? JSON.parse(row.skills) : row.skills || [],
    skillsLabels: typeof row.skillsLabels === "string" ? JSON.parse(row.skillsLabels) : row.skillsLabels || [],
    featured: true,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));

  // 2. Fetch seeded mentors from Mentor table
  let query = 'SELECT * FROM windowslearning."Mentor" WHERE 1=1';
  const values: any[] = [];

  if (filters?.availability && filters.availability !== "all") {
    values.push(filters.availability);
    query += ` AND ("availability" = $${values.length})`;
  }

  if (filters?.freeOnly) {
    query += ' AND ("isFreeCommunity" = true)';
  }

  if (filters?.search && filters.search.trim()) {
    values.push(`%${filters.search.trim()}%`);
    query += ` AND ("name" ILIKE $${values.length} OR "role" ILIKE $${values.length} OR "company" ILIKE $${values.length} OR "bio" ILIKE $${values.length})`;
  }

  query += ' ORDER BY "featured" DESC, "rating" DESC;';

  const res = await db.query(query, values);
  const seededMentors: DbMentor[] = res.rows.map((row) => ({
    ...row,
    skills: typeof row.skills === "string" ? JSON.parse(row.skills) : row.skills || [],
    skillsLabels:
      typeof row.skillsLabels === "string"
        ? JSON.parse(row.skillsLabels)
        : row.skillsLabels || [],
  }));

  // Combine real mentors first, followed by seeded mentors
  const realUserIds = new Set(realMentors.map((m) => m.name.toLowerCase()));
  const combined = [
    ...realMentors,
    ...seededMentors.filter((m) => !realUserIds.has(m.name.toLowerCase())),
  ];

  let filtered = combined;

  if (filters?.availability && filters.availability !== "all") {
    filtered = filtered.filter((m) => m.availability === filters.availability);
  }

  if (filters?.freeOnly) {
    filtered = filtered.filter((m) => m.isFreeCommunity);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q)
    );
  }

  if (filters?.skill && filters.skill !== "all") {
    const s = filters.skill.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.skills.some((sk: string) => sk.toLowerCase().includes(s)) ||
        m.skillsLabels.some((sl: string) => sl.toLowerCase().includes(s))
    );
  }

  return filtered;
}

export async function getAllMentorsFromDb(): Promise<DbMentor[]> {
  return getMentorsFromDb();
}

// ----------------------------------------------------
// User & Auth Functions
// ----------------------------------------------------

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const db = getDbPool();
  const res = await db.query(
    'SELECT * FROM windowslearning."User" WHERE LOWER("email") = LOWER($1) LIMIT 1;',
    [email.trim()]
  );
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    ...row,
    roles: typeof row.roles === "string" ? JSON.parse(row.roles) : row.roles || ["LEARNER"],
  };
}

export async function findUserById(id: string): Promise<DbUser | null> {
  const db = getDbPool();
  const res = await db.query('SELECT * FROM windowslearning."User" WHERE "id" = $1 LIMIT 1;', [
    id,
  ]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    ...row,
    roles: typeof row.roles === "string" ? JSON.parse(row.roles) : row.roles || ["LEARNER"],
  };
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  roles?: string[];
  activeRole?: string;
  emailVerified?: boolean;
  learnerOnboardingComplete?: boolean;
  mentorOnboardingComplete?: boolean;
}): Promise<DbUser> {
  const db = getDbPool();
  const id = "usr_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const roles = data.roles || ["LEARNER"];
  const activeRole = data.activeRole || "LEARNER";

  const res = await db.query(
    `INSERT INTO windowslearning."User" (
      "id", "name", "email", "passwordHash", "avatarUrl", "roles", "activeRole",
      "emailVerified", "learnerOnboardingComplete", "mentorOnboardingComplete"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;`,
    [
      id,
      data.name,
      data.email.toLowerCase().trim(),
      data.passwordHash || null,
      data.avatarUrl || null,
      JSON.stringify(roles),
      activeRole,
      data.emailVerified ?? false,
      data.learnerOnboardingComplete ?? false,
      data.mentorOnboardingComplete ?? false,
    ]
  );

  const row = res.rows[0];
  return {
    ...row,
    roles: typeof row.roles === "string" ? JSON.parse(row.roles) : row.roles || ["LEARNER"],
  };
}

export async function updateUserRolesAndOnboarding(
  userId: string,
  data: {
    roles?: string[];
    activeRole?: string;
    learnerOnboardingComplete?: boolean;
    mentorOnboardingComplete?: boolean;
  }
): Promise<DbUser | null> {
  const db = getDbPool();
  const existing = await findUserById(userId);
  if (!existing) return null;

  const newRoles = data.roles || existing.roles;
  const newActiveRole = data.activeRole || existing.activeRole;
  const newLearnerOnboarding =
    data.learnerOnboardingComplete !== undefined
      ? data.learnerOnboardingComplete
      : existing.learnerOnboardingComplete;
  const newMentorOnboarding =
    data.mentorOnboardingComplete !== undefined
      ? data.mentorOnboardingComplete
      : existing.mentorOnboardingComplete;

  const res = await db.query(
    `UPDATE windowslearning."User" SET
      "roles" = $1,
      "activeRole" = $2,
      "learnerOnboardingComplete" = $3,
      "mentorOnboardingComplete" = $4,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = $5
    RETURNING *;`,
    [JSON.stringify(newRoles), newActiveRole, newLearnerOnboarding, newMentorOnboarding, userId]
  );

  const row = res.rows[0];
  return {
    ...row,
    roles: typeof row.roles === "string" ? JSON.parse(row.roles) : row.roles || ["LEARNER"],
  };
}

// ----------------------------------------------------
// Learner & Mentor Profile Handlers
// ----------------------------------------------------

export async function saveLearnerProfile(
  userId: string,
  data: {
    interestedSkills: string[];
    primaryGoal: string;
    experienceLevel: string;
    lookingFor: string;
    timeCommitment: string;
  }
) {
  const db = getDbPool();
  const id = "lrn_" + Math.random().toString(36).substring(2, 10);
  await db.query(
    `INSERT INTO windowslearning."LearnerProfile" (
      "id", "userId", "interestedSkills", "primaryGoal", "experienceLevel", "lookingFor", "timeCommitment"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT ("userId") DO UPDATE SET
      "interestedSkills" = EXCLUDED."interestedSkills",
      "primaryGoal" = EXCLUDED."primaryGoal",
      "experienceLevel" = EXCLUDED."experienceLevel",
      "lookingFor" = EXCLUDED."lookingFor",
      "timeCommitment" = EXCLUDED."timeCommitment",
      "updatedAt" = CURRENT_TIMESTAMP;`,
    [
      id,
      userId,
      JSON.stringify(data.interestedSkills),
      data.primaryGoal,
      data.experienceLevel,
      data.lookingFor,
      data.timeCommitment,
    ]
  );

  // Mark user learner onboarding complete
  await updateUserRolesAndOnboarding(userId, {
    learnerOnboardingComplete: true,
  });
}

export async function saveMentorProfile(
  userId: string,
  data: {
    title: string;
    bio: string;
    location?: string;
    teachingSkills: string[];
    experienceYears: number;
    hourlyRate: number;
    isFreeCommunity?: boolean;
    availability?: string;
    preferredLanguage?: string;
  }
) {
  const db = getDbPool();
  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");

  const id = "mnt_" + Math.random().toString(36).substring(2, 10);
  await db.query(
    `INSERT INTO windowslearning."MentorProfile" (
      "id", "userId", "title", "bio", "location", "teachingSkills",
      "experienceYears", "hourlyRate", "isFreeCommunity", "availability", "preferredLanguage"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT ("userId") DO UPDATE SET
      "title" = EXCLUDED."title",
      "bio" = EXCLUDED."bio",
      "location" = EXCLUDED."location",
      "teachingSkills" = EXCLUDED."teachingSkills",
      "experienceYears" = EXCLUDED."experienceYears",
      "hourlyRate" = EXCLUDED."hourlyRate",
      "isFreeCommunity" = EXCLUDED."isFreeCommunity",
      "availability" = EXCLUDED."availability",
      "preferredLanguage" = EXCLUDED."preferredLanguage",
      "updatedAt" = CURRENT_TIMESTAMP;`,
    [
      id,
      userId,
      data.title,
      data.bio,
      data.location || "India",
      JSON.stringify(data.teachingSkills),
      data.experienceYears || 3,
      data.hourlyRate || 200,
      data.isFreeCommunity ?? false,
      data.availability || "Available Today",
      data.preferredLanguage || "Hindi / English",
    ]
  );

  // Also sync directly to Mentor directory table
  const mentorSlug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + userId.substring(0, 5);
  await db.query(
    `INSERT INTO windowslearning."Mentor" (
      "id", "slug", "name", "avatar", "role", "company", "bio",
      "rating", "reviewsCount", "studentsMentored", "hourlyRate",
      "isFreeCommunity", "availability", "timezone", "experienceYears",
      "skills", "skillsLabels", "featured"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    ON CONFLICT ("id") DO UPDATE SET
      "slug" = EXCLUDED."slug",
      "name" = EXCLUDED."name",
      "avatar" = EXCLUDED."avatar",
      "role" = EXCLUDED."role",
      "company" = EXCLUDED."company",
      "bio" = EXCLUDED."bio",
      "hourlyRate" = EXCLUDED."hourlyRate",
      "isFreeCommunity" = EXCLUDED."isFreeCommunity",
      "availability" = EXCLUDED."availability",
      "timezone" = EXCLUDED."timezone",
      "experienceYears" = EXCLUDED."experienceYears",
      "skills" = EXCLUDED."skills",
      "skillsLabels" = EXCLUDED."skillsLabels",
      "featured" = EXCLUDED."featured",
      "updatedAt" = CURRENT_TIMESTAMP;`,
    [
      userId,
      mentorSlug,
      user.name,
      user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      data.title,
      data.location || "India",
      data.bio,
      5.0,
      0,
      0,
      data.hourlyRate || 200,
      data.isFreeCommunity ?? false,
      data.availability || "Available Today",
      data.preferredLanguage || "Hindi / English",
      data.experienceYears || 2,
      JSON.stringify(data.teachingSkills),
      JSON.stringify(data.teachingSkills),
      true,
    ]
  );

  // Ensure 'MENTOR' is in user.roles
  const currentRoles = new Set(user.roles);
  currentRoles.add("MENTOR");

  await updateUserRolesAndOnboarding(userId, {
    roles: Array.from(currentRoles),
    activeRole: "MENTOR",
    mentorOnboardingComplete: true,
  });
}

export async function getMentorProfileByUserId(userId: string): Promise<DbMentorProfile | null> {
  const db = getDbPool();
  const res = await db.query(
    'SELECT * FROM windowslearning."MentorProfile" WHERE "userId" = $1 LIMIT 1;',
    [userId]
  );
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    ...row,
    teachingSkills: typeof row.teachingSkills === "string" ? JSON.parse(row.teachingSkills) : row.teachingSkills || [],
  };
}

// ----------------------------------------------------
// Bookings Handlers
// ----------------------------------------------------

export async function createBooking(data: {
  learnerId: string;
  mentorId: string;
  skillSlug: string;
  topic: string;
  scheduledDate: string;
  timeSlot: string;
  notes?: string;
}) {
  const db = getDbPool();
  const id = "bk_" + Math.random().toString(36).substring(2, 10);
  const res = await db.query(
    `INSERT INTO windowslearning."Booking" (
      "id", "learnerId", "mentorId", "skillSlug", "topic", "scheduledDate", "timeSlot", "status", "notes"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'CONFIRMED', $8)
    RETURNING *;`,
    [
      id,
      data.learnerId,
      data.mentorId,
      data.skillSlug,
      data.topic,
      new Date(data.scheduledDate),
      data.timeSlot,
      data.notes || null,
    ]
  );
  return res.rows[0];
}

export async function getBookingsForLearner(learnerId: string): Promise<DbBooking[]> {
  const db = getDbPool();
  const res = await db.query(
    `SELECT b.*, m.name as "mentorName", m.avatar as "mentorAvatar"
     FROM windowslearning."Booking" b
     LEFT JOIN windowslearning."Mentor" m ON m.id = b."mentorId" OR m.slug = b."mentorId"
     WHERE b."learnerId" = $1
     ORDER BY b."scheduledDate" ASC;`,
    [learnerId]
  );
  return res.rows;
}
