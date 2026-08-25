import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

export interface SeedMentor {
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
}

const SEED_MENTORS: SeedMentor[] = [
  {
    id: "mentor-chef-ananya",
    slug: "chef-ananya-sharma",
    name: "Ananya Sharma",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    role: "Home Chef & Cake Baker",
    company: "Bake Studio & Cooking Mentor",
    bio: "Teaching traditional Indian dishes, daily quick gravies, soft rotis, and eggless sponge cakes with easy kitchen tricks. Taught 450+ home cooks.",
    rating: 4.98,
    reviewsCount: 142,
    studentsMentored: 460,
    hourlyRate: 250,
    isFreeCommunity: false,
    availability: "Available Today",
    timezone: "IST (India)",
    experienceYears: 8,
    skills: ["home-cooking-recipes", "cake-baking-pastry"],
    skillsLabels: ["Indian Cooking", "Cake Baking", "Pastries", "Healthy Snacks"],
    featured: true,
  },
  {
    id: "mentor-sunita-devi",
    slug: "sunita-devi-tailor",
    name: "Sunita Devi",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    role: "Master Tailor & Boutique Owner",
    company: "Sunita Designer Boutique",
    bio: "15+ years experience in designer blouse cutting, suits stitching, dress alteration, and teaching women how to earn from home with a sewing machine.",
    rating: 4.96,
    reviewsCount: 128,
    studentsMentored: 520,
    hourlyRate: 200,
    isFreeCommunity: false,
    availability: "Available Today",
    timezone: "IST (India)",
    experienceYears: 15,
    skills: ["tailoring-dress-making"],
    skillsLabels: ["Blouse Cutting", "Suit Stitching", "Dress Alteration", "Boutique Business"],
    featured: true,
  },
  {
    id: "mentor-rajesh-kumar",
    slug: "prof-rajesh-kumar-maths",
    name: "Prof. Rajesh Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    role: "Vedic Maths & Speed Calculation Coach",
    company: "Bright Minds Academy",
    bio: "Helping students remove maths fear. Learn quick multiplication, mental arithmetic, and fast calculations for school and competitive exams.",
    rating: 4.95,
    reviewsCount: 110,
    studentsMentored: 390,
    hourlyRate: 200,
    isFreeCommunity: false,
    availability: "This Week",
    timezone: "IST (India)",
    experienceYears: 12,
    skills: ["vedic-maths-fast-calculation"],
    skillsLabels: ["Vedic Maths", "Fast Calculation", "School Maths", "Exam Tricks"],
    featured: true,
  },
  {
    id: "mentor-dr-neha-verma",
    slug: "dr-neha-verma-biology",
    name: "Dr. Neha Verma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    role: "Medical Educator & Biology Mentor",
    company: "Health & Science Foundation",
    bio: "Teaching human body organs, heart & brain anatomy, biology concepts, and medical basics in simple everyday language. Free community guidance slots available.",
    rating: 4.99,
    reviewsCount: 95,
    studentsMentored: 310,
    hourlyRate: 0,
    isFreeCommunity: true,
    availability: "Available Today",
    timezone: "IST (India)",
    experienceYears: 7,
    skills: ["biology-human-body-basics"],
    skillsLabels: ["Human Biology", "Anatomy", "NEET Basics", "Medical Concepts"],
    featured: true,
  },
  {
    id: "mentor-pooja-iyer",
    slug: "pooja-iyer-spoken-english",
    name: "Pooja Iyer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    role: "Spoken English & Fluency Coach",
    company: "Speak With Confidence",
    bio: "Learn to speak English easily without fear or hesitation. 1-on-1 friendly conversation practice for students, job seekers, and homemakers.",
    rating: 4.97,
    reviewsCount: 164,
    studentsMentored: 680,
    hourlyRate: 200,
    isFreeCommunity: false,
    availability: "Available Today",
    timezone: "IST (India)",
    experienceYears: 9,
    skills: ["spoken-english-confidence"],
    skillsLabels: ["Spoken English", "Interview Prep", "Confidence Building", "Daily Conversation"],
    featured: true,
  },
  {
    id: "mentor-amit-patel",
    slug: "amit-patel-mobile-repair",
    name: "Amit Patel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    role: "Smartphone Repairing & Hardware Expert",
    company: "Patel Electronics Hub",
    bio: "Learn practical phone display replacement, charging point repair, battery testing, and setting up your own phone repair shop.",
    rating: 4.89,
    reviewsCount: 78,
    studentsMentored: 240,
    hourlyRate: 300,
    isFreeCommunity: false,
    availability: "This Week",
    timezone: "IST (India)",
    experienceYears: 10,
    skills: ["mobile-repairing-electronics"],
    skillsLabels: ["Mobile Repairing", "Screen Replacement", "Soldering", "Electronics"],
    featured: false,
  },
  {
    id: "mentor-meera-joshi",
    slug: "meera-joshi-yoga",
    name: "Meera Joshi",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400",
    role: "Certified Yoga & Daily Health Guide",
    company: "Daily Harmony Yoga",
    bio: "Daily morning yoga postures, breathing exercises for stress relief, back pain stretches, and healthy eating habits tailored for busy people.",
    rating: 4.94,
    reviewsCount: 88,
    studentsMentored: 340,
    hourlyRate: 0,
    isFreeCommunity: true,
    availability: "Available Today",
    timezone: "IST (India)",
    experienceYears: 9,
    skills: ["yoga-daily-fitness-diet"],
    skillsLabels: ["Yoga Asanas", "Pranayama", "Back Pain Relief", "Daily Fitness"],
    featured: true,
  },
  {
    id: "mentor-rohan-mehta",
    slug: "rohan-mehta-computer-excel",
    name: "Rohan Mehta",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    role: "Computer Basics & MS Excel Trainer",
    company: "Digital Skills For All",
    bio: "Simple, easy training for computer beginners: typing, Excel billing, Word documents, internet use, and job-ready computer skills.",
    rating: 4.91,
    reviewsCount: 102,
    studentsMentored: 410,
    hourlyRate: 200,
    isFreeCommunity: false,
    availability: "This Week",
    timezone: "IST (India)",
    experienceYears: 6,
    skills: ["computer-basics-ms-excel", "small-business-accounts-tally"],
    skillsLabels: ["MS Excel", "Computer Basics", "Word", "Tally Basics", "Office Work"],
    featured: false,
  },
];

async function main() {
  console.log("Connecting to PostgreSQL Neon database to seed mentors across all practical skills...");

  await pool.query('CREATE SCHEMA IF NOT EXISTS windowslearning;');
  await pool.query('SET search_path TO windowslearning, public;');

  for (const m of SEED_MENTORS) {
    const query = `
      INSERT INTO windowslearning."Mentor" (
        "id", "slug", "name", "avatar", "role", "company", "bio",
        "rating", "reviewsCount", "studentsMentored", "hourlyRate",
        "isFreeCommunity", "availability", "timezone", "experienceYears",
        "skills", "skillsLabels", "featured"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "name" = EXCLUDED."name",
        "avatar" = EXCLUDED."avatar",
        "role" = EXCLUDED."role",
        "company" = EXCLUDED."company",
        "bio" = EXCLUDED."bio",
        "rating" = EXCLUDED."rating",
        "reviewsCount" = EXCLUDED."reviewsCount",
        "studentsMentored" = EXCLUDED."studentsMentored",
        "hourlyRate" = EXCLUDED."hourlyRate",
        "isFreeCommunity" = EXCLUDED."isFreeCommunity",
        "availability" = EXCLUDED."availability",
        "timezone" = EXCLUDED."timezone",
        "experienceYears" = EXCLUDED."experienceYears",
        "skills" = EXCLUDED."skills",
        "skillsLabels" = EXCLUDED."skillsLabels",
        "featured" = EXCLUDED."featured",
        "updatedAt" = CURRENT_TIMESTAMP;
    `;

    await pool.query(query, [
      m.id,
      m.slug,
      m.name,
      m.avatar,
      m.role,
      m.company,
      m.bio,
      m.rating,
      m.reviewsCount,
      m.studentsMentored,
      m.hourlyRate,
      m.isFreeCommunity,
      m.availability,
      m.timezone,
      m.experienceYears,
      JSON.stringify(m.skills),
      JSON.stringify(m.skillsLabels),
      m.featured,
    ]);
  }

  const res = await pool.query('SELECT COUNT(*) FROM windowslearning."Mentor";');
  console.log(`Successfully seeded ${res.rows[0].count} mentors in PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error("Error seeding mentors:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
