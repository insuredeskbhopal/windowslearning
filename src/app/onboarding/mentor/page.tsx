"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, ShieldCheck, Clock, AlertCircle, MapPin, Briefcase, Languages, Plus, X } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

const COMPREHENSIVE_SKILL_TOPICS = [
  // 1. Food & Cooking
  { id: "home-cooking-recipes", label: "🍳 Home Cooking & Traditional Dishes", cat: "Food & Cooking" },
  { id: "cake-baking-pastry", label: "🎂 Cake Baking & Pastries", cat: "Food & Cooking" },
  { id: "street-food-snacks", label: "🥟 Chaat, Samosa & Street Snacks", cat: "Food & Cooking" },
  { id: "pickles-masalas-preserves", label: "🌶️ Homemade Pickles & Spices", cat: "Food & Cooking" },
  { id: "cloud-kitchen-home-baking", label: "👩‍🍳 Cloud Kitchen & Food Business", cat: "Food & Cooking" },

  // 2. Tailoring, Clothing & Fashion
  { id: "tailoring-dress-making", label: "✂️ Tailoring & Blouse Cutting", cat: "Tailoring & Fashion" },
  { id: "suit-salwar-dressmaking", label: "👗 Kurti, Suit & Salwar Stitching", cat: "Tailoring & Fashion" },
  { id: "aari-embroidery-crafts", label: "🪡 Aari Work & Hand Embroidery", cat: "Tailoring & Fashion" },
  { id: "saree-draping-styling", label: "🥻 Saree Draping & Fashion Styling", cat: "Tailoring & Fashion" },
  { id: "jewelry-making-beadwork", label: "💍 Handmade Jewelry & Beadwork", cat: "Tailoring & Fashion" },
  { id: "crochet-knitting-wool", label: "🧶 Crochet & Knitting", cat: "Tailoring & Fashion" },

  // 3. Academics, Science & Medical
  { id: "vedic-maths-fast-calculation", label: "📐 Vedic Maths & Speed Calculation", cat: "Academics & Science" },
  { id: "biology-human-body-basics", label: "🧬 Human Biology & Physiology", cat: "Academics & Science" },
  { id: "medical-nursing-first-aid", label: "🩺 First Aid, Home Nursing & Health", cat: "Academics & Science" },
  { id: "school-physics-chemistry", label: "🔬 Physics & Chemistry Experiments", cat: "Academics & Science" },
  { id: "exam-preparation-coaching", label: "📚 Competitive Exam Strategies", cat: "Academics & Science" },

  // 4. Languages & Public Speaking
  { id: "spoken-english-confidence", label: "🗣️ Spoken English & Fluency", cat: "Languages & Speaking" },
  { id: "public-speaking-personality", label: "🎙️ Public Speaking & Confidence", cat: "Languages & Speaking" },
  { id: "hindi-fluency-writing", label: "📖 Hindi Fluency & Literature", cat: "Languages & Speaking" },
  { id: "foreign-languages-french-german", label: "🌍 Foreign Languages (French / German)", cat: "Languages & Speaking" },

  // 5. Computers, Software & Tech
  { id: "computer-basics-ms-excel", label: "💻 Computer Basics & MS Excel", cat: "Tech & Computers" },
  { id: "smartphone-internet-skills", label: "📱 Smartphone, WhatsApp & Digital Pay", cat: "Tech & Computers" },
  { id: "canva-graphic-design", label: "🎨 Graphic Design with Canva & AI", cat: "Tech & Computers" },
  { id: "video-editing-reels", label: "🎬 Video Editing (CapCut/Premiere)", cat: "Tech & Computers" },
  { id: "web-development-coding", label: "⌨️ Web Development & Programming", cat: "Tech & Computers" },
  { id: "data-entry-typing-speed", label: "⌨️ Hindi/English Typing & Office Work", cat: "Tech & Computers" },

  // 6. Vocational, Repairs & Home Trades
  { id: "mobile-repairing-electronics", label: "🔧 Mobile & Smartphone Repair", cat: "Repairs & Trades" },
  { id: "laptop-computer-hardware", label: "💻 Laptop & Hardware Troubleshooting", cat: "Repairs & Trades" },
  { id: "home-electricals-wiring", label: "💡 Home Electricals & Appliance Repair", cat: "Repairs & Trades" },
  { id: "plumbing-home-maintenance", label: "🚰 Plumbing & Home DIY Repairs", cat: "Repairs & Trades" },
  { id: "carpentry-woodwork-craft", label: "🪚 Carpentry & Furniture Making", cat: "Repairs & Trades" },

  // 7. Health, Yoga & Fitness
  { id: "yoga-daily-fitness-diet", label: "🧘 Daily Yoga, Asanas & Pranayama", cat: "Health & Fitness" },
  { id: "home-workout-weightloss", label: "🏋️ Home Workouts & Weight Loss", cat: "Health & Fitness" },
  { id: "diet-nutrition-ayurveda", label: "🥗 Healthy Diet & Ayurvedic Nutrition", cat: "Health & Fitness" },
  { id: "physiotherapy-pain-relief", label: "💆 Joint & Back Pain Exercise Relief", cat: "Health & Fitness" },

  // 8. Business, Finance & Accounting
  { id: "small-business-accounts-tally", label: "📊 Business Accounts, Tally & GST", cat: "Business & Finance" },
  { id: "stock-market-investing-basics", label: "📈 Stock Market & Mutual Funds 101", cat: "Business & Finance" },
  { id: "retail-kirana-store-management", label: "🏪 Retail & Store Business Strategy", cat: "Business & Finance" },
  { id: "home-freelance-earning", label: "💼 Freelancing & Remote Work from Home", cat: "Business & Finance" },

  // 9. Beauty, Art, Crafts & Music
  { id: "mehndi-henna-design", label: "🌿 Bridal Mehndi & Henna Art", cat: "Beauty & Arts" },
  { id: "makeup-skincare-hairstyling", label: "💄 Bridal Makeup & Skincare Secrets", cat: "Beauty & Arts" },
  { id: "drawing-painting-sketching", label: "🖌️ Drawing, Sketching & Oil Painting", cat: "Beauty & Arts" },
  { id: "guitar-singing-harmonium", label: "🎸 Singing, Guitar & Harmonium", cat: "Beauty & Arts" },
  { id: "candle-soap-making", label: "🕯️ Handmade Soap & Scented Candles", cat: "Beauty & Arts" },
  { id: "organic-gardening-farming", label: "🌱 Terrace Gardening & Organic Farming", cat: "Beauty & Arts" },
  { id: "astrology-vastu-shastra", label: "🔮 Vedic Astrology & Vastu Shastra", cat: "Beauty & Arts" },
];

const POPULAR_CITIES = [
  "Bhopal, Madhya Pradesh, India",
  "Indore, Madhya Pradesh, India",
  "Delhi, NCR, India",
  "Mumbai, Maharashtra, India",
  "Pune, Maharashtra, India",
  "Nagpur, Maharashtra, India",
  "Bengaluru, Karnataka, India",
  "Hyderabad, Telangana, India",
  "Jaipur, Rajasthan, India",
  "Jodhpur, Rajasthan, India",
  "Udaipur, Rajasthan, India",
  "Lucknow, Uttar Pradesh, India",
  "Kanpur, Uttar Pradesh, India",
  "Varanasi, Uttar Pradesh, India",
  "Agra, Uttar Pradesh, India",
  "Kolkata, West Bengal, India",
  "Ahmedabad, Gujarat, India",
  "Surat, Gujarat, India",
  "Vadodara, Gujarat, India",
  "Patna, Bihar, India",
  "Ranchi, Jharkhand, India",
  "Chandigarh, Punjab, India",
  "Ludhiana, Punjab, India",
  "Amritsar, Punjab, India",
  "Chennai, Tamil Nadu, India",
  "Coimbatore, Tamil Nadu, India",
  "Madurai, Tamil Nadu, India",
  "Kochi, Kerala, India",
  "Thiruvananthapuram, Kerala, India",
  "Guwahati, Assam, India",
  "Dehradun, Uttarakhand, India",
  "Bhubaneswar, Odisha, India",
  "Raipur, Chhattisgarh, India",
  "Gwalior, Madhya Pradesh, India",
  "Jabalpur, Madhya Pradesh, India",
];

const POPULAR_TITLES = [
  "Master Tailor & Boutique Designer",
  "Home Chef & Traditional Recipe Expert",
  "Cake Baker & Pastry Designer",
  "Vedic Maths & Speed Calculation Coach",
  "Human Biology & Medical Science Teacher",
  "Spoken English & Communication Coach",
  "Computer Basics & MS Excel Trainer",
  "Smartphone & Electronics Repair Specialist",
  "Yoga & Daily Fitness Instructor",
  "Small Business Accounts & Tally Tutor",
  "Guitar & Classical Music Teacher",
  "Bridal Mehndi & Henna Artist",
  "Professional Makeup & Hair Stylist",
  "Electrician & Home Appliance Technician",
  "Plumbing & Home Maintenance Expert",
  "Terrace Gardening & Organic Plant Expert",
  "Drawing, Sketching & Acrylic Painting Artist",
  "Handmade Jewelry & Craft Designer",
  "Cloud Kitchen Chef & Food Entrepreneur",
  "Stock Market & Personal Finance Coach",
  "Handwriting & Calligraphy Instructor",
  "Astrology & Kundali Reading Guide",
];

const POPULAR_LANGUAGES = [
  "Hindi",
  "English",
  "Hindi & English (Bilingual)",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Urdu",
  "Assamese",
];

function MentorOnboardingContent() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [teachingSkills, setTeachingSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customSkills, setCustomSkills] = useState<{ id: string; label: string; cat: string }[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("All");

  const [experienceYears, setExperienceYears] = useState(1);
  const [hourlyRate, setHourlyRate] = useState<number | string>(200);
  const [isFreeCommunity, setIsFreeCommunity] = useState(false);
  const [availability, setAvailability] = useState("Available Today");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Suggestions state
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLangSuggestions, setShowLangSuggestions] = useState(false);

  const allSkillTopics = useMemo(() => {
    return [...customSkills, ...COMPREHENSIVE_SKILL_TOPICS];
  }, [customSkills]);

  const categoryList = useMemo(() => {
    const cats = new Set(COMPREHENSIVE_SKILL_TOPICS.map((s) => s.cat));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredSkillTopics = useMemo(() => {
    if (selectedCategoryTab === "All") return allSkillTopics;
    return allSkillTopics.filter((s) => s.cat === selectedCategoryTab);
  }, [allSkillTopics, selectedCategoryTab]);

  const filteredCities = useMemo(() => {
    if (!location.trim()) return [];
    const q = location.toLowerCase();
    return POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
  }, [location]);

  const filteredTitles = useMemo(() => {
    if (!title.trim()) return [];
    const q = title.toLowerCase();
    const matches = POPULAR_TITLES.filter((t) => t.toLowerCase().includes(q)).slice(0, 5);
    return matches;
  }, [title]);

  const filteredLanguages = useMemo(() => {
    if (!preferredLanguage.trim()) return [];
    const q = preferredLanguage.toLowerCase();
    return POPULAR_LANGUAGES.filter((l) => l.toLowerCase().includes(q)).slice(0, 5);
  }, [preferredLanguage]);

  const toggleSkill = (id: string) => {
    if (teachingSkills.includes(id)) {
      setTeachingSkills(teachingSkills.filter((s) => s !== id));
    } else {
      setTeachingSkills([...teachingSkills, id]);
    }
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    const id = clean.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newSkill = {
      id,
      label: `✨ ${clean}`,
      cat: "Custom Skills",
    };

    setCustomSkills((prev) => [newSkill, ...prev]);
    setTeachingSkills((prev) => [...prev, id]);
    setCustomSkillInput("");
  };

  const handleStep1Next = () => {
    setError("");
    if (!title.trim()) {
      setError("Please enter your professional title or what you teach.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter your city and state.");
      return;
    }
    if (!bio.trim()) {
      setError("Please enter a short bio describing your teaching experience.");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setError("");
    if (teachingSkills.length === 0) {
      setError("Please select at least one skill you want to teach.");
      return;
    }
    setStep(3);
  };

  const handlePublish = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          bio: bio.trim(),
          location: location.trim(),
          teachingSkills,
          experienceYears: Number(experienceYears) || 1,
          hourlyRate: isFreeCommunity ? 0 : Number(hourlyRate) || 0,
          isFreeCommunity,
          availability,
          preferredLanguage: preferredLanguage.trim() || "Hindi / English",
        }),
      });

      if (res.ok) {
        await refreshUser();
        router.push("/mentor/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save mentor profile.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mentorOnboardingPage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
        ]}
        ctaLabel="GET STARTED"
        ctaHref="/auth/login"
      />

      <div className={styles.card} style={{ maxWidth: step === 2 ? "760px" : "680px" }}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 3 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 4 ? styles.progressStepActive : ""}`} />
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <div className={styles.stepBadge}>Step 1 of 4 • Basic Profile</div>
            <h1 className={styles.title}>Tell us about your teaching profile</h1>
            <p className={styles.subtitle}>
              Enter any practical skill, trade, craft, or academic subject you want to mentor.
            </p>

            <div className={styles.formGrid}>
              {/* Professional Title with Autocomplete & Custom Addition */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Your Professional Title / Role</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setShowTitleSuggestions(true);
                    }}
                    onFocus={() => setShowTitleSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 200)}
                    placeholder="Type anything (e.g. Master Tailor, Home Baker, Electrician, Vedic Maths...)"
                    className={styles.input}
                    required
                  />

                  {showTitleSuggestions && title.trim().length > 0 && (
                    <div className={styles.suggestionsDropdown}>
                      {/* Option to use custom typed title */}
                      <div
                        className={styles.suggestionItem}
                        onMouseDown={() => {
                          setShowTitleSuggestions(false);
                        }}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#34d399", fontWeight: 600 }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Sparkles size={14} color="#34d399" />
                          <span>Use &ldquo;{title}&rdquo; as my custom title</span>
                        </div>
                        <span style={{ fontSize: "0.72rem" }}>Custom</span>
                      </div>

                      {filteredTitles.map((item, idx) => (
                        <div
                          key={idx}
                          className={styles.suggestionItem}
                          onMouseDown={() => {
                            setTitle(item);
                            setShowTitleSuggestions(false);
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Briefcase size={14} color="#34d399" />
                            <span>{item}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "rgba(226, 237, 231, 0.5)" }}>Select</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* City & State with Autocomplete */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>City & State</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                    placeholder="Type your city (e.g. Bhopal, Indore, Jaipur, Delhi...)"
                    className={styles.input}
                    required
                  />

                  {showCitySuggestions && location.trim().length > 0 && (
                    <div className={styles.suggestionsDropdown}>
                      <div
                        className={styles.suggestionItem}
                        onMouseDown={() => {
                          setShowCitySuggestions(false);
                        }}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#34d399", fontWeight: 600 }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <MapPin size={14} color="#34d399" />
                          <span>Use &ldquo;{location}&rdquo;</span>
                        </div>
                        <span style={{ fontSize: "0.72rem" }}>Custom</span>
                      </div>

                      {filteredCities.map((item, idx) => (
                        <div
                          key={idx}
                          className={styles.suggestionItem}
                          onMouseDown={() => {
                            setLocation(item);
                            setShowCitySuggestions(false);
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <MapPin size={14} color="#34d399" />
                            <span>{item}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "rgba(226, 237, 231, 0.5)" }}>Select</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Short Bio / What You Help People Learn</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your practical experience, techniques you teach, and how you guide learners step-by-step..."
                  className={styles.textarea}
                  required
                />
              </div>
            </div>

            <div className={styles.actionRow}>
              <div />
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleStep1Next}
              >
                <span>Continue to Skills</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Comprehensive Skills & Custom Skill Input */}
        {step === 2 && (
          <div>
            <div className={styles.stepBadge}>Step 2 of 4 • Skills & Expertise</div>
            <h1 className={styles.title}>What skills can you teach?</h1>
            <p className={styles.subtitle}>
              Pick from our universal categories, or type and add your own unique custom skill below!
            </p>

            {/* Custom Skill Input Box */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                placeholder="Type any unique skill (e.g. Pottery, Drone Flying, Chess, French)..."
                className={styles.input}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                style={{
                  background: "rgba(16, 185, 129, 0.18)",
                  border: "1px solid #34d399",
                  color: "#34d399",
                  borderRadius: "12px",
                  padding: "0 1.25rem",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryTab(cat)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: selectedCategoryTab === cat ? "#34d399" : "rgba(255,255,255,0.1)",
                    background: selectedCategoryTab === cat ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.03)",
                    color: selectedCategoryTab === cat ? "#ffffff" : "rgba(226, 237, 231, 0.7)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div
              className={styles.chipsGrid}
              style={{
                maxHeight: "260px",
                overflowY: "auto",
                paddingRight: "4px",
                marginBottom: "1.5rem",
              }}
            >
              {filteredSkillTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleSkill(topic.id)}
                  className={`${styles.chipBtn} ${
                    teachingSkills.includes(topic.id) ? styles.chipBtnSelected : ""
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    color={teachingSkills.includes(topic.id) ? "#34d399" : "rgba(255,255,255,0.2)"}
                  />
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>

            {/* Selected Skills Summary */}
            <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "1.25rem" }}>
              Selected ({teachingSkills.length}):{" "}
              <strong style={{ color: "#34d399" }}>
                {teachingSkills.length > 0 ? teachingSkills.join(", ") : "None"}
              </strong>
            </div>

            <div className={styles.fieldGroup} style={{ marginBottom: "1.5rem" }}>
              <label className={styles.label}>Years of Experience in this Skill</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                min={1}
                max={50}
                className={styles.input}
              />
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleStep2Next}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Availability */}
        {step === 3 && (
          <div>
            <div className={styles.stepBadge}>Step 3 of 4 • Fees & Times</div>
            <h1 className={styles.title}>Set your hourly fee & availability</h1>
            <p className={styles.subtitle}>
              You can change your pricing or availability anytime from your dashboard.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hourly Rate (₹ per hour)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  disabled={isFreeCommunity}
                  min={0}
                  step={50}
                  placeholder="e.g. 200"
                  className={styles.input}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="freeCommunity"
                  checked={isFreeCommunity}
                  onChange={(e) => setIsFreeCommunity(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#34d399" }}
                />
                <label htmlFor="freeCommunity" style={{ color: "rgba(226, 237, 231, 0.9)", fontSize: "0.88rem", cursor: "pointer" }}>
                  I want to offer Free Community Classes to help learners
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>When are you available?</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className={styles.input}
                  style={{ cursor: "pointer" }}
                >
                  <option value="Available Today">Available Today (Daily)</option>
                  <option value="This Week">This Week (Flexible Weekdays)</option>
                  <option value="Weekend Only">Weekends Only (Saturday & Sunday)</option>
                </select>
              </div>

              {/* Preferred Language with Autocomplete */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Languages You Teach In</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={preferredLanguage}
                    onChange={(e) => {
                      setPreferredLanguage(e.target.value);
                      setShowLangSuggestions(true);
                    }}
                    onFocus={() => setShowLangSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLangSuggestions(false), 200)}
                    placeholder="Type language (e.g. Hindi, English, Bengali, Tamil...)"
                    className={styles.input}
                  />

                  {showLangSuggestions && preferredLanguage.trim().length > 0 && (
                    <div className={styles.suggestionsDropdown}>
                      <div
                        className={styles.suggestionItem}
                        onMouseDown={() => {
                          setShowLangSuggestions(false);
                        }}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#34d399", fontWeight: 600 }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Languages size={14} color="#34d399" />
                          <span>Use &ldquo;{preferredLanguage}&rdquo;</span>
                        </div>
                        <span style={{ fontSize: "0.72rem" }}>Custom</span>
                      </div>

                      {filteredLanguages.map((item, idx) => (
                        <div
                          key={idx}
                          className={styles.suggestionItem}
                          onMouseDown={() => {
                            setPreferredLanguage(item);
                            setShowLangSuggestions(false);
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Languages size={14} color="#34d399" />
                            <span>{item}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "rgba(226, 237, 231, 0.5)" }}>Select</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(4)}
              >
                <span>Preview Profile</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Publish */}
        {step === 4 && (
          <div>
            <div className={styles.stepBadge}>Step 4 of 4 • Preview & Publish</div>
            <h1 className={styles.title}>Review & Publish Your Profile</h1>
            <p className={styles.subtitle}>
              Here is how learners will see your profile on the mentor directory.
            </p>

            <div className={styles.previewCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>
                      {user?.name || "Mentor Name"}
                    </span>
                    <ShieldCheck size={18} color="#34d399" />
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#34d399", marginTop: "0.2rem" }}>
                    {title || "Mentor Title"} • {location || "India"}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34d399" }}>
                    {isFreeCommunity ? "Free Class" : `₹${hourlyRate}/hr`}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)", display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
                    <Clock size={12} />
                    <span>{availability}</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.6", margin: "0 0 1rem 0" }}>
                {bio || "No bio provided."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {teachingSkills.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "0.75rem",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(52, 211, 153, 0.25)",
                      color: "#34d399",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    #{s.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                className={styles.nextBtn}
                onClick={handlePublish}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Publish Profile & Open Studio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MentorOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
      <MentorOnboardingContent />
    </Suspense>
  );
}
