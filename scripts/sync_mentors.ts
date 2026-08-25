import { getDbPool } from "../src/lib/db";

async function main() {
  const db = getDbPool();
  console.log("Checking MentorProfile rows in database...");

  const profiles = await db.query(`
    SELECT mp.*, u.name, u."avatarUrl"
    FROM windowslearning."MentorProfile" mp
    JOIN windowslearning."User" u ON mp."userId" = u."id"
  `);

  console.log(`Found ${profiles.rows.length} mentor profile(s) in PostgreSQL.`);

  for (const row of profiles.rows) {
    console.log(`Syncing mentor: ${row.name} (${row.title})...`);
    const mentorSlug = (row.name || "mentor").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + row.userId.substring(0, 5);

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
        row.userId,
        mentorSlug,
        row.name,
        row.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        row.title,
        row.location || "India",
        row.bio,
        5.0,
        0,
        0,
        row.hourlyRate || 200,
        row.isFreeCommunity ?? false,
        row.availability || "Available Today",
        row.preferredLanguage || "Hindi / English",
        row.experienceYears || 2,
        typeof row.teachingSkills === "string" ? row.teachingSkills : JSON.stringify(row.teachingSkills || []),
        typeof row.teachingSkills === "string" ? row.teachingSkills : JSON.stringify(row.teachingSkills || []),
        true,
      ]
    );
  }

  console.log("Mentor sync completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
