import { MongoClient } from "mongodb";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

// ─── ALL 58 WILAYAS OF ALGERIA ─────────────────────────────────────────────────
const wilayas = [
  { code: 1,  name: "Adrar",                name_ar: "أدرار",               region: "South" },
  { code: 2,  name: "Chlef",                name_ar: "الشلف",               region: "North" },
  { code: 3,  name: "Laghouat",             name_ar: "الأغواط",             region: "South" },
  { code: 4,  name: "Oum El Bouaghi",       name_ar: "أم البواقي",          region: "East"  },
  { code: 5,  name: "Batna",                name_ar: "باتنة",               region: "East"  },
  { code: 6,  name: "Béjaïa",               name_ar: "بجاية",               region: "East"  },
  { code: 7,  name: "Biskra",               name_ar: "بسكرة",               region: "South" },
  { code: 8,  name: "Béchar",               name_ar: "بشار",                region: "South" },
  { code: 9,  name: "Blida",                name_ar: "البليدة",             region: "North" },
  { code: 10, name: "Bouira",               name_ar: "البويرة",             region: "North" },
  { code: 11, name: "Tamanrasset",          name_ar: "تمنراست",             region: "South" },
  { code: 12, name: "Tébessa",              name_ar: "تبسة",                region: "East"  },
  { code: 13, name: "Tlemcen",              name_ar: "تلمسان",              region: "West"  },
  { code: 14, name: "Tiaret",               name_ar: "تيارت",               region: "West"  },
  { code: 15, name: "Tizi Ouzou",           name_ar: "تيزي وزو",            region: "East"  },
  { code: 16, name: "Alger",                name_ar: "الجزائر",             region: "North" },
  { code: 17, name: "Djelfa",               name_ar: "الجلفة",              region: "South" },
  { code: 18, name: "Jijel",                name_ar: "جيجل",                region: "East"  },
  { code: 19, name: "Sétif",                name_ar: "سطيف",                region: "East"  },
  { code: 20, name: "Saïda",                name_ar: "سعيدة",               region: "West"  },
  { code: 21, name: "Skikda",               name_ar: "سكيكدة",              region: "East"  },
  { code: 22, name: "Sidi Bel Abbès",       name_ar: "سيدي بلعباس",         region: "West"  },
  { code: 23, name: "Annaba",               name_ar: "عنابة",               region: "East"  },
  { code: 24, name: "Guelma",               name_ar: "قالمة",               region: "East"  },
  { code: 25, name: "Constantine",          name_ar: "قسنطينة",             region: "East"  },
  { code: 26, name: "Médéa",                name_ar: "المدية",              region: "North" },
  { code: 27, name: "Mostaganem",           name_ar: "مستغانم",             region: "West"  },
  { code: 28, name: "M'Sila",               name_ar: "المسيلة",             region: "East"  },
  { code: 29, name: "Mascara",              name_ar: "معسكر",               region: "West"  },
  { code: 30, name: "Ouargla",              name_ar: "ورقلة",               region: "South" },
  { code: 31, name: "Oran",                 name_ar: "وهران",               region: "West"  },
  { code: 32, name: "El Bayadh",            name_ar: "البيض",               region: "South" },
  { code: 33, name: "Illizi",               name_ar: "إليزي",               region: "South" },
  { code: 34, name: "Bordj Bou Arréridj",   name_ar: "برج بوعريريج",        region: "East"  },
  { code: 35, name: "Boumerdès",            name_ar: "بومرداس",             region: "North" },
  { code: 36, name: "El Tarf",              name_ar: "الطارف",              region: "East"  },
  { code: 37, name: "Tindouf",              name_ar: "تندوف",               region: "South" },
  { code: 38, name: "Tissemsilt",           name_ar: "تيسمسيلت",            region: "West"  },
  { code: 39, name: "El Oued",              name_ar: "الوادي",              region: "South" },
  { code: 40, name: "Khenchela",            name_ar: "خنشلة",               region: "East"  },
  { code: 41, name: "Souk Ahras",           name_ar: "سوق أهراس",           region: "East"  },
  { code: 42, name: "Tipaza",               name_ar: "تيبازة",              region: "North" },
  { code: 43, name: "Mila",                 name_ar: "ميلة",                region: "East"  },
  { code: 44, name: "Aïn Defla",            name_ar: "عين الدفلى",          region: "North" },
  { code: 45, name: "Naâma",                name_ar: "النعامة",             region: "South" },
  { code: 46, name: "Aïn Témouchent",       name_ar: "عين تموشنت",          region: "West"  },
  { code: 47, name: "Ghardaïa",             name_ar: "غرداية",              region: "South" },
  { code: 48, name: "Relizane",             name_ar: "غليزان",              region: "West"  },
  { code: 49, name: "Timimoun",             name_ar: "تيميمون",             region: "South" },
  { code: 50, name: "Bordj Badji Mokhtar",  name_ar: "برج باجي مختار",      region: "South" },
  { code: 51, name: "Ouled Djellal",        name_ar: "أولاد جلال",          region: "South" },
  { code: 52, name: "Béni Abbès",           name_ar: "بني عباس",            region: "South" },
  { code: 53, name: "In Salah",             name_ar: "عين صالح",            region: "South" },
  { code: 54, name: "In Guezzam",           name_ar: "عين قزام",            region: "South" },
  { code: 55, name: "Touggourt",            name_ar: "تقرت",                region: "South" },
  { code: 56, name: "Djanet",               name_ar: "جانت",                region: "South" },
  { code: 57, name: "El M'Ghair",           name_ar: "المغير",              region: "South" },
  { code: 58, name: "El Meniaa",            name_ar: "المنيعة",             region: "South" },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n🔗 Connected to MongoDB at ${MONGO_URI}\n`);

    // 1. Drop the location_dz database
    await client.db("location_dz").dropDatabase();
    console.log("🗑️  Dropped database: location_dz");

    // 2. Insert wilayas into mihna.locations
    const col = client.db("mihna").collection("locations");

    // Clear existing docs in locations first
    await col.deleteMany({});
    console.log("🧹 Cleared existing documents in mihna.locations");

    // Create indexes
    await col.createIndex({ code: 1 }, { unique: true });
    await col.createIndex({ name: 1 });
    await col.createIndex({ region: 1 });
    console.log("✔  Indexes created on mihna.locations");

    // Insert all 58 wilayas
    const result = await col.insertMany(wilayas, { ordered: false });
    console.log(`✅ Inserted ${result.insertedCount} wilayas into mihna.locations\n`);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
