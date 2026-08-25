import { getDbPool } from "../src/lib/db";
import * as dotenv from "dotenv";

dotenv.config();

async function createMarketplaceTables() {
  const db = getDbPool();
  console.log("Creating marketplace tables in windowslearning schema...");

  await db.query(`
    CREATE SCHEMA IF NOT EXISTS windowslearning;

    CREATE TABLE IF NOT EXISTS windowslearning."TeachingSession" (
      "id" TEXT PRIMARY KEY,
      "mentorId" TEXT NOT NULL REFERENCES windowslearning."User"("id") ON DELETE CASCADE,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "learningOutcomes" TEXT NOT NULL DEFAULT '[]',
      "skillSlug" TEXT NOT NULL,
      "durationMinutes" INTEGER NOT NULL DEFAULT 60,
      "price" INTEGER NOT NULL DEFAULT 500,
      "level" TEXT NOT NULL DEFAULT 'All Levels',
      "format" TEXT NOT NULL DEFAULT '1:1 Live Online',
      "isPublished" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS windowslearning."LearningGig" (
      "id" TEXT PRIMARY KEY,
      "learnerId" TEXT NOT NULL REFERENCES windowslearning."User"("id") ON DELETE CASCADE,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "skillSlug" TEXT NOT NULL,
      "level" TEXT NOT NULL DEFAULT 'Beginner',
      "durationMinutes" INTEGER NOT NULL DEFAULT 60,
      "budget" INTEGER NOT NULL DEFAULT 300,
      "preferredTime" TEXT NOT NULL DEFAULT 'Flexible / Evening',
      "status" TEXT NOT NULL DEFAULT 'OPEN',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS windowslearning."GigApplication" (
      "id" TEXT PRIMARY KEY,
      "gigId" TEXT NOT NULL REFERENCES windowslearning."LearningGig"("id") ON DELETE CASCADE,
      "mentorId" TEXT NOT NULL REFERENCES windowslearning."User"("id") ON DELETE CASCADE,
      "proposedPrice" INTEGER NOT NULL,
      "message" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS "idx_teaching_session_mentor" ON windowslearning."TeachingSession"("mentorId");
    CREATE INDEX IF NOT EXISTS "idx_teaching_session_skill" ON windowslearning."TeachingSession"("skillSlug");
    CREATE INDEX IF NOT EXISTS "idx_learning_gig_learner" ON windowslearning."LearningGig"("learnerId");
    CREATE INDEX IF NOT EXISTS "idx_learning_gig_status" ON windowslearning."LearningGig"("status");
    CREATE INDEX IF NOT EXISTS "idx_gig_application_gig" ON windowslearning."GigApplication"("gigId");
    CREATE INDEX IF NOT EXISTS "idx_gig_application_mentor" ON windowslearning."GigApplication"("mentorId");
  `);

  console.log("✅ TeachingSession, LearningGig, and GigApplication tables successfully created in windowslearning schema!");
  process.exit(0);
}

createMarketplaceTables().catch((err) => {
  console.error("❌ Table creation failed:", err);
  process.exit(1);
});
