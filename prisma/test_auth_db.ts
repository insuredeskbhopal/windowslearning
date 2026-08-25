import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

async function verifyAuthDb() {
  console.log("Checking PostgreSQL database connection and windowslearning.User table...");

  await pool.query('CREATE SCHEMA IF NOT EXISTS windowslearning;');
  await pool.query('SET search_path TO windowslearning, public;');

  // Check table structure
  const tableCheck = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'windowslearning' AND table_name = 'User';
  `);

  console.log("Columns in windowslearning.User:", tableCheck.rows.map(r => r.column_name));

  // Check if test user exists or create one
  const testEmail = "learner@windowslearning.com";
  const existing = await pool.query('SELECT * FROM windowslearning."User" WHERE "email" = $1', [testEmail]);

  if (existing.rows.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);
    await pool.query(`
      INSERT INTO windowslearning."User" (
        "id", "name", "email", "passwordHash", "roles", "activeRole", "emailVerified", "learnerOnboardingComplete", "mentorOnboardingComplete"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `, [
      "usr_test_demo_01",
      "Abhishek Sharma",
      testEmail,
      passwordHash,
      '["LEARNER"]',
      "LEARNER",
      true,
      true,
      false,
    ]);
    console.log("Created real test user in PostgreSQL: learner@windowslearning.com (password: password123)");
  } else {
    console.log("Existing test user found in PostgreSQL:", existing.rows[0].email);
  }

  // Count total users in database
  const countRes = await pool.query('SELECT COUNT(*) FROM windowslearning."User";');
  console.log(`Total real users in PostgreSQL database: ${countRes.rows[0].count}`);
}

verifyAuthDb()
  .catch((err) => {
    console.error("Database check failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
