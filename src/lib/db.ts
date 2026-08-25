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
  let mentors = res.rows.map((row) => ({
    ...row,
    skills: typeof row.skills === "string" ? JSON.parse(row.skills) : row.skills || [],
    skillsLabels:
      typeof row.skillsLabels === "string"
        ? JSON.parse(row.skillsLabels)
        : row.skillsLabels || [],
  }));

  if (filters?.skill && filters.skill !== "all") {
    const s = filters.skill.toLowerCase();
    mentors = mentors.filter(
      (m) =>
        m.skills.some((sk: string) => sk.toLowerCase().includes(s)) ||
        m.skillsLabels.some((sl: string) => sl.toLowerCase().includes(s))
    );
  }

  return mentors;
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

  // Ensure 'MENTOR' is in user.roles
  const currentRoles = new Set(user.roles);
  currentRoles.add("MENTOR");

  await updateUserRolesAndOnboarding(userId, {
    roles: Array.from(currentRoles),
    activeRole: "MENTOR",
    mentorOnboardingComplete: true,
  });
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
