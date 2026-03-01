const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const ROOT = path.resolve(__dirname, "..");
const XLSX_FILE = path.join(ROOT, "Outscraper-20260227140044s66.xlsx");
const OUT_FILE = path.join(ROOT, "lib", "activities.ts");

const DIRECTORY_BASE = process.env.NEXT_PUBLIC_DIRECTORY_URL || "https://forsythkidsguide.com";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function mapCategory(raw) {
  if (!raw) return "Other";
  const s = raw.toLowerCase();
  if (s.includes("dance") || s.includes("ballet")) return "Dance & Ballet";
  if (s.includes("karate") || s.includes("taekwondo") || s.includes("jiu-jitsu") || s.includes("martial")) return "Martial Arts & Self-Defense";
  if (s.includes("gymnast" ) || s.includes("cheer")) return "Gymnastics & Cheer";
  if (s.includes("music") || s.includes("piano")) return "Music Lessons";
  if (s.includes("art") || s.includes("pottery")) return "Art & Creative";
  if (s.includes("computer") || s.includes("coding") || s.includes("code")) return "STEM & Coding";
  if (s.includes("tutor") || s.includes("learning") || s.includes("education") || s.includes("kumon") || s.includes("mathnasium")) return "Tutoring & Academic";
  if (s.includes("swim")) return "Swim Lessons";
  if (s.includes("camp")) return "Summer Camps";
  if (s.includes("theater") || s.includes("drama")) return "Theater & Drama";
  if (s.includes("preschool") || s.includes("day care") || s.includes("kindergarten")) return "Preschool Enrichment";
  if (s.includes("baseball") || s.includes("basketball") || s.includes("soccer") || s.includes("football") || s.includes("sports")) return "Sports Training & Leagues";
  if (s.includes("fitness") || s.includes("climb") || s.includes("outdoor")) return "Outdoor & Adventure";
  if (s.includes("birthday") || s.includes("party") || s.includes("trampoline") || s.includes("entertainment")) return "Birthday Parties & Events";
  // fallback: try to detect by keywords in name
  return "Other";
}

const PERSONA_MAP = {
  "Dance & Ballet": ["creative", "social", "everything"],
  "Martial Arts & Self-Defense": ["athletic", "social", "everything"],
  "Gymnastics & Cheer": ["athletic", "social", "everything"],
  "Music Lessons": ["creative", "social", "everything"],
  "Art & Creative": ["creative", "academic", "everything"],
  "STEM & Coding": ["academic", "creative", "everything"],
  "Tutoring & Academic": ["academic", "everything"],
  "Swim Lessons": ["athletic", "social", "everything"],
  "Summer Camps": ["athletic", "creative", "social", "everything"],
  "Theater & Drama": ["creative", "social", "everything"],
  "Preschool Enrichment": ["social", "creative", "academic", "everything"],
  "Sports Training & Leagues": ["athletic", "social", "everything"],
  "Outdoor & Adventure": ["athletic", "everything"],
  "Birthday Parties & Events": ["athletic", "social", "everything"],
};

const INTEREST_MAP = {
  "Dance & Ballet": ["creative-expression", "individual"],
  "Martial Arts & Self-Defense": ["individual", "team-sports"],
  "Gymnastics & Cheer": ["individual", "team-sports"],
  "Music Lessons": ["creative-expression", "individual"],
  "Art & Creative": ["creative-expression", "individual"],
  "STEM & Coding": ["academic-enrichment", "individual"],
  "Tutoring & Academic": ["academic-enrichment", "individual"],
  "Swim Lessons": ["individual", "team-sports"],
  "Summer Camps": ["outdoor", "team-sports", "creative-expression"],
  "Theater & Drama": ["creative-expression"],
  "Preschool Enrichment": ["academic-enrichment", "creative-expression", "team-sports"],
  "Sports Training & Leagues": ["team-sports", "outdoor"],
  "Outdoor & Adventure": ["outdoor", "individual"],
  "Birthday Parties & Events": ["team-sports", "outdoor", "individual"],
};

const AGE_MAP = {
  "Preschool Enrichment": ["under-3", "3-5"],
  "Dance & Ballet": ["3-5", "6-8", "9-12"],
  "Music Lessons": ["3-5", "6-8", "9-12"],
  "Swim Lessons": ["3-5", "6-8", "9-12"],
  "Gymnastics & Cheer": ["under-3", "3-5", "6-8", "9-12"],
  "Sports Training & Leagues": ["3-5", "6-8", "9-12", "13+"],
  "Martial Arts & Self-Defense": ["3-5", "6-8", "9-12", "13+"],
  "Summer Camps": ["3-5", "6-8", "9-12", "13+"],
  "Tutoring & Academic": ["6-8", "9-12", "13+"],
  "STEM & Coding": ["6-8", "9-12", "13+"],
  "Art & Creative": ["6-8", "9-12", "13+"],
  "Theater & Drama": ["6-8", "9-12", "13+"],
  "Birthday Parties & Events": ["3-5", "6-8", "9-12", "13+"],
  "Outdoor & Adventure": ["3-5", "6-8", "9-12", "13+"],
};

const PRICE_MAP = {
  "Birthday Parties & Events": "under-50",
  "Outdoor & Adventure": "under-50",
  "Art & Creative": "50-100",
  "Theater & Drama": "50-100",
  "Swim Lessons": "50-100",
  "Dance & Ballet": "100-200",
  "Music Lessons": "100-200",
  "Martial Arts & Self-Defense": "100-200",
  "Gymnastics & Cheer": "100-200",
  "Sports Training & Leagues": "100-200",
  "Summer Camps": "100-200",
  "Tutoring & Academic": "200-plus",
  "STEM & Coding": "200-plus",
  "Preschool Enrichment": "200-plus",
};

function parseSchedule(hours) {
  if (!hours || !hours.toString().trim()) return ["weekday-afternoon", "weekends"];
  const s = hours.toLowerCase();
  const out = new Set();
  if (s.includes("sat") || s.includes("saturday") || s.includes("sun") || s.includes("sunday")) out.add("weekends");
  // naive time checks
  if (s.match(/\b(1[5-9]|[2-9][0-9]|[3-9]pm)[: ]/i) || s.includes("15:") || s.includes("3pm") || s.includes("4pm")) out.add("weekday-afternoon");
  if (s.includes("5pm") || s.includes("6pm") || s.includes("7pm") || s.includes("18:") || s.includes("19:")) out.add("weekday-evening");
  if (out.size === 0) return ["weekday-afternoon", "weekends"];
  return Array.from(out);
}

function deriveLocation(address) {
  if (!address) return "anywhere";
  const s = address.toLowerCase();
  if (s.includes("30028") || s.includes("dawsonville") || s.includes("north")) return "north";
  if (s.includes("30040") || s.includes("downtown cumming") || s.includes("cumming")) return "cumming";
  if (s.includes("30041") || s.includes("south") || s.includes("sugar hill") || s.includes("buford")) return "south";
  return "anywhere";
}

function safeNumber(v, def) {
  const n = Number(v);
  return Number.isFinite(n) && !Number.isNaN(n) ? n : def;
}

function rowToActivity(row, idx) {
  const name = (row.name || row.Name || row.business_name || row.title || "").toString().trim();
  const rawCat = (row.category || row.Category || row.type || "").toString().trim();
  const category = mapCategory(rawCat) === "Other" ? (row.name || row.business_name || "").toString().includes("Dance") ? "Dance & Ballet" : "Other" : mapCategory(rawCat);
  const website = (row.website || row.Website || "").toString().trim();
  const phone = (row.phone || row.Phone || "").toString().trim();
  const address = (row.address || row.Address || "").toString().trim();
  const descriptionRaw = (row.website_description || row.description || row.notes || "").toString().trim();
  const description = descriptionRaw || `${name} is a local ${category} offering programs for kids.`;
  const rating = safeNumber(row.rating || row.Rating, 4.5);
  const reviewCount = safeNumber(row.reviews || row.Reviews || row.reviewCount, 0);
  const hours = row.working_hours_csv_compatible || row.hours || row.working_hours || "";
  const scheduleOptions = parseSchedule(hours);
  const priceRange = PRICE_MAP[category] || "100-200";
  const ageRanges = AGE_MAP[category] || ["6-8", "9-12", "13+"];
  const personalityMatch = PERSONA_MAP[category] || ["everything"];
  const interestMatch = INTEREST_MAP[category] || ["individual"];
  const location = deriveLocation(address);

  const slug = slugify(name || `listing-${idx}`);

  return {
    id: String(idx),
    name,
    category,
    description,
    ageRanges,
    personalityMatch,
    interestMatch,
    scheduleOptions,
    priceRange,
    location,
    listingTier: "free",
    website,
    phone,
    address,
    imageUrl: "/images/placeholder.jpg",
    directoryUrl: `${DIRECTORY_BASE}/listing/${slug}/`,
    rating,
    reviewCount,
    badges: [],
  };
}

function generate() {
  if (!fs.existsSync(XLSX_FILE)) {
    console.error("XLSX file not found:", XLSX_FILE);
    process.exit(1);
  }

  const wb = XLSX.readFile(XLSX_FILE);
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

  // dedupe by normalized name + address if duplicates exist (keep first)
  const unique = [];
  const seen = new Set();
  for (const r of rows) {
    const nameVal = (r.name || r.Name || r.business_name || r.title || "").toString().trim();
    const addrVal = (r.address || r.Address || "").toString().trim();
    const key = (nameVal + "|" + addrVal).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
  }

  const activities = unique.map((r, i) => rowToActivity(r, i + 1));
  console.log(`Rows read: ${rows.length}. After dedupe: ${unique.length}`);

  // build TypeScript file content
  const header = `import { Activity } from "../lib/types";\n\nconst DIRECTORY_BASE = process.env.NEXT_PUBLIC_DIRECTORY_URL || "${DIRECTORY_BASE}";\n\nexport const activities: Activity[] = `;
  const body = JSON.stringify(activities, null, 2);

  const fileContent = header + body + ";\n";

  // Ensure lib folder exists
  const libDir = path.join(ROOT, "lib");
  if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

  fs.writeFileSync(OUT_FILE, fileContent, "utf8");
  console.log("Wrote", OUT_FILE, "with", activities.length, "entries");
}

generate();
