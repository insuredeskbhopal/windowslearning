import { getDbPool } from "../src/lib/db";
import * as dotenv from "dotenv";

dotenv.config();

async function seedSamples() {
  const db = getDbPool();
  console.log("Seeding sample teaching sessions and learning gigs...");

  // 1. Fetch first mentor user
  const mentorUserRes = await db.query(`
    SELECT u.id, u.name FROM windowslearning."User" u
    JOIN windowslearning."MentorProfile" mp ON u.id = mp."userId"
    LIMIT 1;
  `);

  if (mentorUserRes.rows.length > 0) {
    const mentorId = mentorUserRes.rows[0].id;
    console.log("Found mentor user:", mentorUserRes.rows[0].name);

    await db.query(`
      INSERT INTO windowslearning."TeachingSession" (
        "id", "mentorId", "title", "description", "learningOutcomes", "skillSlug", "durationMinutes", "price", "level", "format", "isPublished"
      ) VALUES 
      (
        'sess_node_perf',
        $1,
        'Node.js & Backend Architecture — 1:1 Live Deep-Dive',
        'Learn how to design scalable REST APIs, structure database queries with Prisma & PostgreSQL, implement JWT authentication, and debug performance bottlenecks live.',
        '["Architecting robust micro-services & APIs", "PostgreSQL query optimization & connection pooling", "JWT & Role-based authentication security", "Live debugging of your real-world backend project"]',
        'node-js',
        60,
        600,
        'Intermediate',
        '1:1 Live Online',
        true
      )
      ON CONFLICT ("id") DO NOTHING;
    `, [mentorId]);
  }

  // 2. Fetch first learner user
  const learnerUserRes = await db.query(`
    SELECT id, name FROM windowslearning."User" LIMIT 1;
  `);

  if (learnerUserRes.rows.length > 0) {
    const learnerId = learnerUserRes.rows[0].id;
    console.log("Found learner user:", learnerUserRes.rows[0].name);

    await db.query(`
      INSERT INTO windowslearning."LearningGig" (
        "id", "learnerId", "title", "description", "skillSlug", "level", "durationMinutes", "budget", "preferredTime", "status"
      ) VALUES 
      (
        'gig_nextjs_help',
        $1,
        'Need 1:1 help mastering Next.js App Router & Auth',
        'I am building a fullstack web application and need an experienced guide to help me understand Server Components, Server Actions, and secure session management with hands-on examples.',
        'next-js',
        'Beginner',
        60,
        450,
        'Evening (7:00 PM – 9:00 PM)',
        'OPEN'
      )
      ON CONFLICT ("id") DO NOTHING;
    `, [learnerId]);
  }

  console.log("✅ Seed samples created successfully!");
  process.exit(0);
}

seedSamples().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
