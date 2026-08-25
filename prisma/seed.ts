import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const SEED_SKILLS = [
  // 1. COOKING & FOOD
  {
    id: "skill-indian-cooking",
    slug: "home-cooking-recipes",
    title: "Daily Home Cooking & Authentic Indian Recipes",
    category: "cooking",
    categoryLabel: "Cooking & Food",
    difficulty: "Beginner",
    description: "Learn easy daily Indian curries, spices balance, quick snacks, roti making, and restaurant-style gravies from experienced home chefs.",
    detailedOverview: "Learn step-by-step cooking right from your kitchen: how to use everyday spices, master soft rotis, prepare healthy vegetarian meals, delicious biryanis, and special festival dishes.",
    modulesCount: 10,
    labsCount: 25,
    durationHours: 20,
    mentorsCount: 45,
    rating: 4.94,
    studentsEnrolled: 4200,
    tags: JSON.stringify(["Cooking", "Home Food", "Indian Recipes", "Baking", "Healthy Diet", "Snacks"]),
    prerequisites: JSON.stringify(["Basic kitchen utensils and curiosity to cook"]),
    featured: true,
  },
  {
    id: "skill-cake-baking",
    slug: "cake-baking-pastry",
    title: "Cake Baking, Pastry & Home Bakery Business",
    category: "cooking",
    categoryLabel: "Cooking & Food",
    difficulty: "Intermediate",
    description: "Bake soft sponge cakes, pastries, cookies, and learn how to start your own home bakery from scratch.",
    detailedOverview: "Master oven baking without egg or with egg, whipping cream decorations, chocolate making, cake pricing, and selling homemade cakes locally.",
    modulesCount: 8,
    labsCount: 20,
    durationHours: 16,
    mentorsCount: 32,
    rating: 4.91,
    studentsEnrolled: 3100,
    tags: JSON.stringify(["Baking", "Cakes", "Pastry", "Home Business", "Desserts", "Cooking"]),
    prerequisites: JSON.stringify(["An oven or simple pressure cooker"]),
    featured: false,
  },

  // 2. TAILORING & FASHION
  {
    id: "skill-tailoring-dress-making",
    slug: "tailoring-dress-making",
    title: "Complete Tailoring, Sewing & Blouse Cutting",
    category: "tailoring",
    categoryLabel: "Tailoring & Fashion",
    difficulty: "Beginner",
    description: "Learn sewing machine basics, cloth cutting, suit and kurti stitching, blouse neck designs, and custom fitting.",
    detailedOverview: "Start stitching with confidence: body measurements, fabric cutting, stitching designer blouses, salwar suits, frocks, alteration techniques, and starting a boutique.",
    modulesCount: 12,
    labsCount: 30,
    durationHours: 24,
    mentorsCount: 50,
    rating: 4.96,
    studentsEnrolled: 5400,
    tags: JSON.stringify(["Tailoring", "Sewing", "Blouse Cutting", "Fashion Design", "Boutique", "Stitching"]),
    prerequisites: JSON.stringify(["Basic sewing machine and measuring tape"]),
    featured: true,
  },

  // 3. MATHS & SCIENCE
  {
    id: "skill-vedic-maths",
    slug: "vedic-maths-fast-calculation",
    title: "Vedic Maths & Fast Mental Calculations",
    category: "academics",
    categoryLabel: "Maths & Science",
    difficulty: "Beginner",
    description: "Do huge multiplications, square roots, and percentages in 5 seconds in your mind. Great for school and competitive exams.",
    detailedOverview: "Learn ancient and modern fast calculation tricks: 2-digit to 4-digit rapid multiplication, division shortcuts, mental additions, and solving exam papers 3x faster.",
    modulesCount: 10,
    labsCount: 28,
    durationHours: 18,
    mentorsCount: 38,
    rating: 4.92,
    studentsEnrolled: 3800,
    tags: JSON.stringify(["Maths", "Vedic Math", "Speed Math", "School Exams", "Mental Calculation"]),
    prerequisites: JSON.stringify(["Basic tables from 1 to 9"]),
    featured: true,
  },
  {
    id: "skill-biology-medical-basics",
    slug: "biology-human-body-basics",
    title: "Human Biology, Anatomy & Pre-Medical Basics",
    category: "academics",
    categoryLabel: "Maths & Science",
    difficulty: "Intermediate",
    description: "Understand human organ systems, heart & brain functioning, genetics, cell biology, and pre-medical concepts with doctors and biology teachers.",
    detailedOverview: "Clear, visual explanations of the human body: circulatory system, digestive health, genetics, immune defense, and foundational biology for school and exam prep.",
    modulesCount: 14,
    labsCount: 35,
    durationHours: 30,
    mentorsCount: 26,
    rating: 4.95,
    studentsEnrolled: 2600,
    tags: JSON.stringify(["Biology", "Human Anatomy", "Medical Basics", "Science", "NEET Prep", "Health"]),
    prerequisites: JSON.stringify(["Class 9/10 basic science knowledge"]),
    featured: true,
  },

  // 4. LANGUAGES & COMMUNICATION
  {
    id: "skill-spoken-english",
    slug: "spoken-english-confidence",
    title: "Spoken English & Daily Conversation Confidence",
    category: "languages",
    categoryLabel: "Languages & Speaking",
    difficulty: "Beginner",
    description: "Overcome fear of speaking English in public, job interviews, office meetings, and daily friendly conversations with 1-on-1 speaking practice.",
    detailedOverview: "Practice real talking with patient mentors: daily sentence structures, correct pronunciation, removing hesitation, polite phrases, and interview self-introduction.",
    modulesCount: 10,
    labsCount: 40,
    durationHours: 25,
    mentorsCount: 60,
    rating: 4.97,
    studentsEnrolled: 6200,
    tags: JSON.stringify(["Spoken English", "Communication", "Public Speaking", "Confidence", "Interviews", "Fluency"]),
    prerequisites: JSON.stringify(["Desire to speak without fear"]),
    featured: true,
  },

  // 5. COMPUTERS & DIGITAL SKILLS
  {
    id: "skill-computer-basics-excel",
    slug: "computer-basics-ms-excel",
    title: "Computer Basics, MS Excel & Daily Office Work",
    category: "computers",
    categoryLabel: "Computers & Mobile",
    difficulty: "Beginner",
    description: "Master Windows, typing, internet browsing, email writing, and MS Excel formulas (SUM, VLOOKUP, Pivot Tables) for office jobs.",
    detailedOverview: "From opening your laptop to becoming comfortable in office work: file folders management, shortcut keys, preparing Excel bills, creating Word letters, and internet safety.",
    modulesCount: 12,
    labsCount: 32,
    durationHours: 22,
    mentorsCount: 42,
    rating: 4.9,
    studentsEnrolled: 4900,
    tags: JSON.stringify(["Computers", "Excel", "MS Office", "Typing", "Internet", "Job Skills"]),
    prerequisites: JSON.stringify(["Access to any laptop or desktop"]),
    featured: true,
  },
  {
    id: "skill-mobile-repairing",
    slug: "mobile-repairing-electronics",
    title: "Smartphone Repairing & Electronics Practical",
    category: "practical",
    categoryLabel: "Practical Crafts & Repair",
    difficulty: "Beginner",
    description: "Learn how to replace phone screens, repair charging ports, battery testing, soldering, and basic software flashing.",
    detailedOverview: "Hands-on vocational trade skill: mobile hardware disassembly, multimeter testing, IC soldering basics, water damage fixes, and setting up your own repair counter.",
    modulesCount: 10,
    labsCount: 24,
    durationHours: 20,
    mentorsCount: 22,
    rating: 4.88,
    studentsEnrolled: 2100,
    tags: JSON.stringify(["Mobile Repair", "Electronics", "Hardware", "Soldering", "Shop Business", "Vocational"]),
    prerequisites: JSON.stringify(["Interest in hands-on gadget repairing"]),
    featured: false,
  },

  // 6. HEALTH, YOGA & FITNESS
  {
    id: "skill-yoga-fitness",
    slug: "yoga-daily-fitness-diet",
    title: "Daily Yoga Asanas, Pranayama & Healthy Living",
    category: "fitness",
    categoryLabel: "Health & Fitness",
    difficulty: "Beginner",
    description: "Learn daily Surya Namaskar, breathing exercises, back pain relief stretches, stress management, and natural home diet habits.",
    detailedOverview: "Live 1-on-1 guided posture correction, morning breathing routines for high energy, simple meditation, weight management, and posture alignment.",
    modulesCount: 8,
    labsCount: 20,
    durationHours: 15,
    mentorsCount: 35,
    rating: 4.93,
    studentsEnrolled: 3400,
    tags: JSON.stringify(["Yoga", "Pranayama", "Fitness", "Health", "Stress Relief", "Diet"]),
    prerequisites: JSON.stringify(["A simple yoga mat or floor space"]),
    featured: true,
  },

  // 7. BUSINESS & SMALL ACCOUNTS
  {
    id: "skill-small-business-accounts",
    slug: "small-business-accounts-tally",
    title: "Small Business Bookkeeping, GST & Tally Prime",
    category: "business",
    categoryLabel: "Business & Accounts",
    difficulty: "Beginner",
    description: "Learn daily bill making, GST billing basics, shop accounts, debit/credit tracking, and Tally Prime software.",
    detailedOverview: "Clear accounting for shopkeepers, freelancers, and small business owners: sales & purchase entry, bank reconciliation, GST filing basics, and profit/loss calculation.",
    modulesCount: 11,
    labsCount: 28,
    durationHours: 22,
    mentorsCount: 28,
    rating: 4.89,
    studentsEnrolled: 2300,
    tags: JSON.stringify(["Accounts", "Tally", "GST", "Small Business", "Finance", "Shop Management"]),
    prerequisites: JSON.stringify(["Basic addition and subtraction"]),
    featured: false,
  },
];

async function main() {
  console.log("Connecting to PostgreSQL Neon database to seed universal skills...");

  await pool.query('CREATE SCHEMA IF NOT EXISTS windowslearning;');
  await pool.query('SET search_path TO windowslearning, public;');

  for (const item of SEED_SKILLS) {
    const query = `
      INSERT INTO windowslearning."Skill" (
        "id", "slug", "title", "category", "categoryLabel", "difficulty",
        "description", "detailedOverview", "modulesCount", "labsCount",
        "durationHours", "mentorsCount", "rating", "studentsEnrolled",
        "tags", "prerequisites", "featured"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "title" = EXCLUDED."title",
        "category" = EXCLUDED."category",
        "categoryLabel" = EXCLUDED."categoryLabel",
        "difficulty" = EXCLUDED."difficulty",
        "description" = EXCLUDED."description",
        "detailedOverview" = EXCLUDED."detailedOverview",
        "modulesCount" = EXCLUDED."modulesCount",
        "labsCount" = EXCLUDED."labsCount",
        "durationHours" = EXCLUDED."durationHours",
        "mentorsCount" = EXCLUDED."mentorsCount",
        "rating" = EXCLUDED."rating",
        "studentsEnrolled" = EXCLUDED."studentsEnrolled",
        "tags" = EXCLUDED."tags",
        "prerequisites" = EXCLUDED."prerequisites",
        "featured" = EXCLUDED."featured",
        "updatedAt" = CURRENT_TIMESTAMP;
    `;

    await pool.query(query, [
      item.id,
      item.slug,
      item.title,
      item.category,
      item.categoryLabel,
      item.difficulty,
      item.description,
      item.detailedOverview,
      item.modulesCount,
      item.labsCount,
      item.durationHours,
      item.mentorsCount,
      item.rating,
      item.studentsEnrolled,
      item.tags,
      item.prerequisites,
      item.featured,
    ]);
  }

  const res = await pool.query('SELECT COUNT(*) FROM windowslearning."Skill";');
  console.log(`Successfully seeded ${res.rows[0].count} universal skills in PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error("Error seeding skills:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
