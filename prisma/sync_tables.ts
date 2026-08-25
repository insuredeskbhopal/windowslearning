import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

async function syncTables() {
  console.log("Syncing all tables into PostgreSQL windowslearning schema...");

  await pool.query('CREATE SCHEMA IF NOT EXISTS windowslearning;');
  await pool.query('SET search_path TO windowslearning, public;');

  // 1. User table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS windowslearning."User" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "passwordHash" TEXT,
      "avatarUrl" TEXT,
      "roles" TEXT NOT NULL DEFAULT '["LEARNER"]',
      "activeRole" TEXT NOT NULL DEFAULT 'LEARNER',
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      "learnerOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
      "mentorOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. LearnerProfile table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS windowslearning."LearnerProfile" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT UNIQUE NOT NULL REFERENCES windowslearning."User"("id") ON DELETE CASCADE,
      "interestedSkills" TEXT NOT NULL DEFAULT '[]',
      "primaryGoal" TEXT NOT NULL DEFAULT 'personal',
      "experienceLevel" TEXT NOT NULL DEFAULT 'Beginner',
      "lookingFor" TEXT NOT NULL DEFAULT 'mentor',
      "timeCommitment" TEXT NOT NULL DEFAULT '3-5 hours/week',
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. MentorProfile table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS windowslearning."MentorProfile" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT UNIQUE NOT NULL REFERENCES windowslearning."User"("id") ON DELETE CASCADE,
      "title" TEXT NOT NULL,
      "bio" TEXT NOT NULL,
      "location" TEXT NOT NULL DEFAULT 'India',
      "teachingSkills" TEXT NOT NULL DEFAULT '[]',
      "experienceYears" INTEGER NOT NULL DEFAULT 3,
      "hourlyRate" INTEGER NOT NULL DEFAULT 200,
      "isFreeCommunity" BOOLEAN NOT NULL DEFAULT false,
      "availability" TEXT NOT NULL DEFAULT 'Available Today',
      "preferredLanguage" TEXT NOT NULL DEFAULT 'Hindi / English',
      "isPublished" BOOLEAN NOT NULL DEFAULT true,
      "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
      "reviewsCount" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Booking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS windowslearning."Booking" (
      "id" TEXT PRIMARY KEY,
      "learnerId" TEXT NOT NULL REFERENCES windowslearning."User"("id") ON DELETE CASCADE,
      "mentorId" TEXT NOT NULL,
      "skillSlug" TEXT NOT NULL,
      "topic" TEXT NOT NULL,
      "scheduledDate" TIMESTAMP NOT NULL,
      "timeSlot" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "notes" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("All tables (User, LearnerProfile, MentorProfile, Booking) synced successfully!");
}

syncTables()
  .catch((err) => {
    console.error("Error syncing tables:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
