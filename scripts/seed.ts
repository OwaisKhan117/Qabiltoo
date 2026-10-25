import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const now = Date.now();
const ago = (ms: number) => new Date(now - ms);

/* ──────────────────────────────────────────────────────────── */
/*  20 demo profiles — 10 brides / 10 grooms, IN + NRI          */
/* ──────────────────────────────────────────────────────────── */

const profiles: any[] = [
  // ═══════════ FEMALES ═══════════
  {
    fullName: "Ayesha Siddiqui",
    gender: "female",
    age: 26,
    height: "5 ft 3 in",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    education: "MSc Data Science, Mumbai University",
    profession: "UX Designer",
    income: "₹12–15 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, always",
    about:
      "Bismillah — I'm a Mumbai girl who finds joy in the little things: morning fajr with chai, weekend volunteering at our masjid, and sketching interfaces that people love. My family is close-knit and moderate; Sunday dinners at Dadi's are non-negotiable! I wear hijab with pride and seek someone who sees it as a crown, not a constraint. I love baking (my red velvet is famous in the family), Urdu poetry, and quiet evenings with a good book.",
    partnerPreference:
      "Looking for a kind, deen-conscious groom aged 26–32 who prays regularly and treats his mother with respect. Education matters but character matters more. Mumbai-based preferred since I'm close to my parents — though I can relocate for the right person, insha'Allah.",
    familyInfo:
      "Father is a retired bank manager, mother a school teacher. One elder brother (married, in Dubai) and a younger sister in college. We are a religious, educated, close-knit family from a respected Mumbai family.",
    image: "/images/profile-f1.png",
    photos: ["/images/profile-f1.png"],
    email: "ayesha@demo.qabiltoo.in",
    phone: "+919820012345",
    onBehalfOf: "self",
    verificationTier: "gold",
    trustScore: 96,
    tier: "Gold",
    waliName: "Mohammed Siddiqui",
    waliPhone: "+91 98200 11223",
    waliRelation: "Father",
    relocate: true,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Zoya Khan",
    gender: "female",
    age: 24,
    height: "5 ft 5 in",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    education: "BA LLB (Hons), National Law University",
    profession: "Junior Advocate, Delhi High Court",
    income: "₹9–12 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Yes, mostly",
    about:
      "I argue for a living and argue with love at home — my Abba says I was born with a lawyer's tongue and a poet's heart. I'm the eldest of three, half Delhiite, half Lucknowi tehzeeb. I enjoy qawwali nights at Nizamuddin Dargah and mentoring first-generation law students. Faith guides my compass; I pray, I fast, and I believe a marriage is a partnership of two growing souls.",
    partnerPreference:
      "A groom aged 24–30 with progressive thinking and rooted values. Should respect my career — I intend to keep practicing. A man who can discuss ideas over kebabs and still wake up for tahajjud occasionally. Delhi/NCR preferred.",
    familyInfo:
      "Father is a chartered accountant, mother a homemaker. Two younger brothers — one studying engineering, one in school. A warm, book-loving family with strong Lucknowi roots.",
    image: "/images/profile-f2.png",
    photos: ["/images/profile-f2.png"],
    email: "zoya@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "gold",
    trustScore: 88,
    tier: "Free",
    waliName: "Justice (Retd.) Ameer Khan",
    waliPhone: "+91 99100 45677",
    waliRelation: "Father",
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Fatima Rizvi",
    gender: "female",
    age: 28,
    height: "5 ft 2 in",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    education: "MBBS, MD (Paediatrics), Osmania",
    profession: "Paediatrician",
    income: "₹18–24 LPA",
    maritalStatus: "Never Married",
    sect: "Shia",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, always",
    about:
      "Children call me Dr. Fatu and give me drawings of me as a superhero — best salary supplement ever! I'm a Hyderabad doctor with Lucknowi roots, majalis-attending and biryani-defending (Hyderabadi > Lucknowi, come at me). Old City walks, Indo-Islamic history podcasts and teaching my little patients about germs fill my weeks. I believe in love that grows slowly and deeply — the kind that makes Allah smile.",
    partnerPreference:
      "Seeking a professional groom aged 27–33 (medicine preferred but not required), Shia, practicing, family-oriented. Someone patient — I have night duties! Hyderabadi spice tolerance is a bonus. My parents are lovely people; you'll enjoy meeting them.",
    familyInfo:
      "Father is a senior paediatrician, mother a homemaker with a green thumb. We are a well-known medical family of Old City Hyderabad with strong community ties.",
    image: "/images/profile-f3.png",
    photos: ["/images/profile-f3.png"],
    email: "fatima@demo.qabiltoo.in",
    onBehalfOf: "family",
    verificationTier: "gold",
    trustScore: 94,
    tier: "Silver",
    waliName: "Dr. Abbas Rizvi",
    waliPhone: "+91 90000 33445",
    waliRelation: "Father",
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Maryam Ansari",
    gender: "female",
    age: 25,
    height: "5 ft 4 in",
    city: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    education: "MA English Literature, AMU",
    profession: "Lecturer",
    income: "₹6–9 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, always",
    about:
      "A Lucknowi girl who believes adab is the real luxury. I teach English literature and spend my evenings in adaab-e-Lucknow: tehzeeb, tahzeebi khana, and long walks in Hazratganj. I memorised a portion of the Quran in my teens and still keep my daily tilawat. Family is everything to us — three generations under one roof, Alhamdulillah.",
    partnerPreference:
      "A groom 25–31, rooted in faith and family values, ideally from UP or nearby. Teachers, civil servants and professionals from respectable families preferred. Must respect elders — tehzeeb is non-negotiable.",
    familyInfo:
      "Grandfather was a noted Urdu poet; father runs a publishing house; mother teaches at a girls' school. Two siblings. A traditional, cultured Awadhi family.",
    image: "/images/profile-f4.png",
    photos: ["/images/profile-f4.png"],
    email: "maryam@demo.qabiltoo.in",
    onBehalfOf: "family",
    verificationTier: "green",
    trustScore: 82,
    tier: "Free",
    waliName: "Iqbal Ansari",
    waliPhone: "+91 94150 78900",
    waliRelation: "Father",
    relocate: true,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Khadija Farooqui",
    gender: "female",
    age: 27,
    height: "5 ft 6 in",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    education: "B.Tech Computer Science, VTU",
    profession: "Software Engineer",
    income: "₹15–25 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Yes, mostly",
    about:
      "Code by day, crochet by night. I'm a Bengaluru software engineer who moved here for college and stayed for the weather (and the filter coffee). I take my deen seriously but quietly — jummah, Ramadan, charity — and I believe a good marriage is built on kindness and shared laughter. Weekend trekker, amateur biryani experimenter, and the family's unofficial tech support.",
    partnerPreference:
      "A professional aged 26–33 who is grounded, prayerful and family-oriented. Someone who balances ambition with contentment. Bengaluru or willing to relocate here. A sense of humour is a must.",
    familyInfo:
      "Father is a civil engineer in Hyderabad; mother a homemaker. One younger sister studying design. A progressive, educated family with traditional values.",
    image: "/images/profile-f5.png",
    photos: ["/images/profile-f5.png"],
    email: "khadija@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 78,
    tier: "Free",
    waliName: "Farooqui Ahmed",
    waliPhone: "+91 98450 12399",
    waliRelation: "Father",
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Sana Malik",
    gender: "female",
    age: 23,
    height: "5 ft 3 in",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    education: "BBA, Symbiosis",
    profession: "Boutique Owner",
    income: "₹5–10 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Sometimes",
    quranLevel: "Learning",
    hijabBeard: "Yes, mostly",
    about:
      "I run a small modest-fashion boutique in Pune — stitching dreams one dupatta at a time. I'm the youngest of four and the most stubborn, according to my siblings. I am growing in my deen at my own pace and would love a partner who grows with me, not one who judges the journey. Chai lover, late-night sketcher, family's little sun.",
    partnerPreference:
      "A kind, patient groom aged 24–30, preferably in business or a stable job. Someone who supports my boutique and my deen journey. Pune/Mumbai preferred.",
    familyInfo:
      "Father owns a hardware business; mother a homemaker. Three elder siblings — all married and settled. A large, loving, business-minded family.",
    image: "/images/profile-f6.png",
    photos: ["/images/profile-f6.png"],
    email: "sana@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "blue",
    trustScore: 64,
    tier: "Free",
    waliName: "Rafiq Malik",
    waliPhone: "+91 98220 64512",
    waliRelation: "Father",
    relocate: true,
    idVerified: false,
    verificationStatus: "pending",
  },
  {
    fullName: "Rumana Haque",
    gender: "female",
    age: 29,
    height: "5 ft 2 in",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    education: "PhD Urdu Literature, Calcutta University",
    profession: "Assistant Professor",
    income: "₹9–12 LPA",
    maritalStatus: "Divorced",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Hafiz",
    hijabBeard: "Yes, always",
    about:
      "A Hafiza, a professor, and a survivor of a brief early marriage that taught me more about sabr than any book. I have no children. Life has made me gentler and stronger simultaneously. I love Rabindranath as much as Ghalib, Park Street mornings, and teaching my students that faith and intellect are friends.",
    partnerPreference:
      "A mature, kind man aged 30–40 who values companionship over superficiality. Widowers and divorcees welcome. Must be prayerful and respectful of my career. Kolkata preferred.",
    familyInfo:
      "Mother is a retired headmistress; father passed away in 2019, rahimahullah. One elder brother in Kolkata who is very supportive. A small, educated, resilient family.",
    image: "/images/profile-f7.png",
    photos: ["/images/profile-f7.png"],
    email: "rumana@demo.qabiltoo.in",
    onBehalfOf: "family",
    verificationTier: "gold",
    trustScore: 91,
    tier: "Silver",
    waliName: "Adeel Haque",
    waliPhone: "+91 98300 55221",
    waliRelation: "Brother",
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Hafsa Sheikh",
    gender: "female",
    age: 24,
    height: "5 ft 4 in",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    education: "BDS, Gujarat University",
    profession: "Dentist",
    income: "₹9–12 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "Regularly",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, always",
    about:
      "I make people smile for a living — literally. A dentist in Ahmedabad with a clinic day full of nervous aunties and brave kids. I love sunnah fasting on Mondays and Thursdays, my grandmother's undhiyu recipe, and organising community dental camps. I want a home filled with deen, laughter and guests.",
    partnerPreference:
      "A groom aged 25–31, established or in a respected profession, who prays and keeps good company. Gujarat-based preferred. A man whose family welcomes their bahu like a daughter.",
    familyInfo:
      "Father is a jeweller; mother a homemaker. One elder sister married in Surat, one younger brother in commerce. A religious Gujarati Muslim family known for community service.",
    image: "/images/profile-f8.png",
    photos: ["/images/profile-f8.png"],
    email: "hafsa@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 85,
    tier: "Free",
    waliName: "Iqbal Sheikh",
    waliPhone: "+91 98250 88334",
    waliRelation: "Father",
    relocate: true,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Amira Rahman",
    gender: "female",
    age: 26,
    height: "5 ft 6 in",
    city: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates",
    education: "MBA Marketing, University of Wollongong Dubai",
    profession: "Brand Manager",
    income: "AED 25–30k/month",
    maritalStatus: "Never Married",
    sect: "Just Muslim",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Yes, mostly",
    about:
      "Born in Chennai, raised in Dubai — I'm a third-culture kid who makes the meanest sambar and the best marketing decks. I pray, keep my fasts, and drive to the desert on weekends to watch the sunset and just breathe. Family is back home in Chennai; I video-call Ammi every single day without fail.",
    partnerPreference:
      "A groom aged 26–33, based in UAE or willing to relocate there, professionally established. Deen-conscious with a global outlook. Someone who respects that I'm close to my roots even from far away.",
    familyInfo:
      "Father is a retired merchant navy captain; mother a homemaker in Chennai. One younger brother studying in Canada. A warm, travel-loving Tamil Muslim family.",
    image: "/images/profile-f9.png",
    photos: ["/images/profile-f9.png"],
    email: "amira@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "gold",
    trustScore: 89,
    tier: "Gold",
    waliName: "Capt. Kabir Rahman",
    waliPhone: "+971 50 123 4567",
    waliRelation: "Father",
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Lubna Qureshi",
    gender: "female",
    age: 31,
    height: "5 ft 5 in",
    city: "London",
    state: "Greater London",
    country: "United Kingdom",
    education: "MPharm, UCL School of Pharmacy",
    profession: "Pharmacist (NHS)",
    income: "£48–55k/year",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Yes, always",
    about:
      "A Londoner with Gujarati roots and a deep love for both Earl Grey and masala chai. I work for the NHS, volunteer at our local food bank, and spend Sundays with my parents over Sunday roast — halal, obviously. My faith keeps me grounded in a fast city. I am ready for marriage built on friendship, deen and lots of laughter.",
    partnerPreference:
      "A groom aged 29–36 based in the UK, professionally settled, who is kind, prayerful and family-inclusive. My parents are my world — a partner who embraces them wins my heart.",
    familyInfo:
      "Parents migrated from Gujarat in the 80s; father ran a textile shop, now retired. One married sister in Leicester. A close, hospitable British-Asian family.",
    image: "/images/profile-f10.png",
    photos: ["/images/profile-f10.png"],
    email: "lubna@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 80,
    tier: "Platinum",
    waliName: "Yusuf Qureshi",
    waliPhone: "+44 7700 900123",
    waliRelation: "Father",
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },

  // ═══════════ MALES ═══════════
  {
    fullName: "Zaid Ahmed",
    gender: "male",
    age: 28,
    height: "5 ft 9 in",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    education: "M.Tech, IIT Bombay",
    profession: "Senior Software Engineer",
    income: "₹25–50 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, always",
    about:
      "Alhamdulillah, I've been blessed with a career I love at a product company in Mumbai, and a deen I love even more. I lead a small halaqah at our local masjid on Fridays, play cricket badly on Sundays, and cook a genuinely good nihari. I am the eldest son — my parents live with me, and caring for them is a joy, not a duty. Looking for a partner to build a home of barakah with.",
    partnerPreference:
      "A bride aged 23–29 who values deen and family, education preferred but character above all. Someone warm, patient and prayerful. Mumbai-based or willing to make it home. My mother will be your biggest ally, insha'Allah.",
    familyInfo:
      "Father is a retired railways officer; mother a homemaker. One younger sister studying medicine. A religious, middle-class, respected family from central Mumbai.",
    image: "/images/profile-m1.png",
    photos: ["/images/profile-m1.png"],
    email: "zaid@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "gold",
    trustScore: 93,
    tier: "Gold",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Imran Siddique",
    gender: "male",
    age: 30,
    height: "5 ft 8 in",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    education: "CA, ICAI",
    profession: "Chartered Accountant (Own Practice)",
    income: "₹18–24 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Reads regularly",
    hijabBeard: "Yes, always",
    about:
      "I run my own CA practice in Delhi — numbers by profession, nihari by passion. I try to live simply and give quietly; my khidmat of choice is teaching accounts to madrasa students who dream of commerce degrees. I want a home where the Quran is heard every morning and guests are never turned away.",
    partnerPreference:
      "A bride aged 23–29, educated and grounded in deen, from a respectable family. Delhi/NCR preferred. Someone who finds joy in small things and strength in faith.",
    familyInfo:
      "Father is a retired government school principal; mother a homemaker. Two younger sisters, both married. A scholarly, modest family from Old Delhi with strong community ties.",
    image: "/images/profile-m2.png",
    photos: ["/images/profile-m2.png"],
    email: "imran@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 86,
    tier: "Silver",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Arman Hussain",
    gender: "male",
    age: 27,
    height: "5 ft 10 in",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    education: "MBBS, MD (Cardiology, pursuing)",
    profession: "Cardiology Resident",
    income: "₹12–15 LPA",
    maritalStatus: "Never Married",
    sect: "Shia",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, mostly",
    about:
      "Third-generation doctor, first-generation dreamer. I'm finishing my cardiology residency in Hyderabad and yes, the hours are brutal — but the heart (both kinds) is worth it. I attend majalis regularly, play football to decompress, and make my Ammi's shammi kebabs exactly the way she does. Almost.",
    partnerPreference:
      "A bride aged 24–29, Shia, educated, family-oriented. Medicine or any noble profession. Someone understanding of medical life. Hyderabad or open to moving for the right match.",
    familyInfo:
      "Father is an orthopaedic surgeon; mother a gynaecologist — yes, dinner conversations are very medical. One elder sister married in Bengaluru. A distinguished Shia medical family of Hyderabad.",
    image: "/images/profile-m3.png",
    photos: ["/images/profile-m3.png"],
    email: "arman@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 83,
    tier: "Free",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: true,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Yusuf Patel",
    gender: "male",
    age: 26,
    height: "5 ft 7 in",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    education: "B.Tech, NIT Surathkal",
    profession: "Product Manager",
    income: "₹15–25 LPA",
    maritalStatus: "Never Married",
    sect: "Just Muslim",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Sometimes",
    about:
      "I build products by day and rebuild my intention to be a better Muslim by night — it's a journey and I'm on it. Bengaluru startup life taught me hustle; my Nani taught me dua. I love long cycling rides, historical fiction, and my mother's dhokla. Looking for a partner to grow with — in deen, dreams and daily life.",
    partnerPreference:
      "A bride aged 23–28, kind-hearted and open-minded, with a personal relationship with her faith. Profession any. Bengaluru preferred; relocation possible in a couple of years.",
    familyInfo:
      "Father is a businessman in Ahmedabad; mother a homemaker. One elder brother married with kids. A close-knit Gujarati Muslim family, modern in outlook and traditional at heart.",
    image: "/images/profile-m4.png",
    photos: ["/images/profile-m4.png"],
    email: "yusuf@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "blue",
    trustScore: 71,
    tier: "Free",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Bilal Mirza",
    gender: "male",
    age: 32,
    height: "5 ft 8 in",
    city: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    education: "B.Com, Lucknow University",
    profession: "Textile Business Owner",
    income: "₹25–50 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    quranLevel: "Hafiz",
    hijabBeard: "Yes, always",
    about:
      "A Hafiz-e-Quran who runs our family's 60-year-old textile house in Lucknow. Business is in my blood; deen is my backbone. I sponsor three orphan girls' education through a local trust — quietly, for the sake of Allah alone. I enjoy shayari, sherwani design (family perk), and hosting Friday lunch for whoever walks in.",
    partnerPreference:
      "A bride aged 24–29, Hafiza or deeply connected to the Quran preferred, from a family of good akhlaq. Lucknow/UP preferred. Ready to be part of a large joint family with love and barakah.",
    familyInfo:
      "The Mirzas of Chowk — a well-known textile family. Father is the patriarch; mother manages the home and everyone's hearts. Four siblings, big Sunday gatherings, and a haveli that's seen four generations.",
    image: "/images/profile-m5.png",
    photos: ["/images/profile-m5.png"],
    email: "bilal@demo.qabiltoo.in",
    onBehalfOf: "family",
    verificationTier: "gold",
    trustScore: 90,
    tier: "Platinum",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Omar Faruqi",
    gender: "male",
    age: 29,
    height: "5 ft 9 in",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    education: "PhD Data Science, IIT Madras",
    profession: "Research Scientist",
    income: "₹15–25 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "Regularly",
    quranLevel: "Reads with Tajweed",
    hijabBeard: "Yes, mostly",
    about:
      "I研究 climate data at a research lab in Chennai — saving the planet one model at a time, with Allah's help. Tamil Muslim roots, Sufi-leaning heart, and a bookshelf that overflows into two rooms. I find masjid Fridays and marine-drives equally meditative. Seeking a companion for the long, beautiful road of ibadah and life.",
    partnerPreference:
      "A bride aged 24–30, educated, reflective and kind. Chennai preferred or open to it. Someone who'd love quiet evenings, deep conversations and shared volunteering.",
    familyInfo:
      "Father is a retired professor of Arabic; mother teaches Quran to children in our neighbourhood. One younger sister in medical school. A humble, scholarly family of Triplicane.",
    image: "/images/profile-m6.png",
    photos: ["/images/profile-m6.png"],
    email: "omar@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 84,
    tier: "Free",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: true,
    idVerified: true,
    verificationStatus: "approved",
  },
  {
    fullName: "Hamza Ali",
    gender: "male",
    age: 25,
    height: "5 ft 6 in",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    education: "B.Com, Pune University",
    profession: "Bank Officer",
    income: "₹5–10 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Sometimes",
    quranLevel: "Learning",
    hijabBeard: "Yes, mostly",
    about:
      "A banker by job and a footballer by heart. I'm honest about where I stand in my deen — I pray, I'm learning the Quran properly now, and I'm getting better each Ramadan, Alhamdulillah. I want a wife who's my teammate: we push each other toward Jannah, split the dishes, and save for umrah together.",
    partnerPreference:
      "A bride aged 22–27, simple, cheerful and patient. Working or not is her choice. Pune-based preferred. Someone as excited about growing together as I am.",
    familyInfo:
      "Father is a bus conductor with the proudest pension story; mother stitches clothes for neighbours. Two younger sisters. A modest, hardworking, genuinely good family.",
    image: "/images/profile-m7.png",
    photos: ["/images/profile-m7.png"],
    email: "hamza@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "blue",
    trustScore: 58,
    tier: "Free",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: false,
    verificationStatus: "pending",
  },
  {
    fullName: "Tariq Mahmood",
    gender: "male",
    age: 31,
    height: "5 ft 11 in",
    city: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates",
    education: "B.Tech Aerospace, Anna University",
    profession: "Aerospace Engineer",
    income: "AED 35–40k/month",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Yes, always",
    about:
      "I help build aircraft that connect the world, and I believe marriage is the connection that matters most. Dubai has been home for eight years — JLT walks, desert rides, and Friday prayers at the masjid down my street. Hyderabad is home-home; Ammi still ships me her pickle quarterly. Jazakallah, Ammi.",
    partnerPreference:
      "A bride aged 24–30, educated, adaptable and warm. Must be comfortable in the UAE or open to moving here; frequent India trips guaranteed. Deen matters, laughter matters more.",
    familyInfo:
      "Parents live in Hyderabad; father a retired BHEL engineer. One elder sister in Saudi Arabia. A small, loving family that gathers every December without fail.",
    image: "/images/profile-m8.png",
    photos: ["/images/profile-m8.png"],
    email: "tariq@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "green",
    trustScore: 77,
    tier: "Gold",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: false,
    verificationStatus: "pending",
  },
  {
    fullName: "Nabeel Aslam",
    gender: "male",
    age: 33,
    height: "5 ft 9 in",
    city: "Toronto",
    state: "Ontario",
    country: "Canada",
    education: "CPA, Canada",
    profession: "Finance Manager",
    income: "CAD 110–130k/year",
    maritalStatus: "Widowed",
    sect: "Just Muslim",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Learning",
    hijabBeard: "Sometimes",
    about:
      "Life tested me early — I lost my first wife to illness three years ago, may Allah grant her the highest Jannah. No children. Grief taught me what matters: deen, family, kindness. I've rebuilt quietly in Toronto — good career, small home with a big prayer mat, and a heart ready to try again with someone patient and gentle.",
    partnerPreference:
      "A sister aged 27–35, kind and family-oriented; widows and divorcees are most welcome. Must be open to life in Canada. Someone who believes second chances are a sunnah.",
    familyInfo:
      "Parents in Bengaluru; father a retired professor. One younger sister married in Dubai. A supportive, educated family that stood by me through everything.",
    image: "/images/profile-m9.png",
    photos: ["/images/profile-m9.png"],
    email: "nabeel@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "blue",
    trustScore: 69,
    tier: "Silver",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: false,
    idVerified: false,
    verificationStatus: "pending",
  },
  {
    fullName: "Sameer Khan",
    gender: "male",
    age: 27,
    height: "5 ft 8 in",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    education: "MBA, Jamia Millia Islamia",
    profession: "Marketing Lead",
    income: "₹10–15 LPA",
    maritalStatus: "Never Married",
    sect: "Shia",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    quranLevel: "Reads regularly",
    hijabBeard: "Sometimes",
    about:
      "Marketing lead at a D2C brand, shayari enthusiast, and the guy who cries at every nikah — including ones I'm just catering. Delhi is my playground: Nizamuddin evenings, purani Dilli kebab runs, Majlis on Muharram. I'm looking for my barakah partner — someone dua-strong and drama-light.",
    partnerPreference:
      "A bride aged 23–29, Shia or open to it, warm and faith-filled. Delhi/NCR preferred. Someone with her own passions who lets me have mine.",
    familyInfo:
      "Father is a travel agency owner; mother a homemaker. Only child, but raised with eleven cousins — so effectively eleven siblings. A fun, food-loving Delhi family.",
    image: "/images/profile-m10.png",
    photos: ["/images/profile-m10.png"],
    email: "sameer@demo.qabiltoo.in",
    onBehalfOf: "self",
    verificationTier: "blue",
    trustScore: 66,
    tier: "Free",
    waliName: null,
    waliPhone: null,
    waliRelation: null,
    relocate: true,
    idVerified: true,
    verificationStatus: "approved",
  },
];

async function main() {
  console.log("🧹 Clearing existing data...");
  await prisma.report.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.message.deleteMany();
  await prisma.profileView.deleteMany();
  await prisma.savedProfile.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.successStory.deleteMany();
  await prisma.profile.deleteMany();

  console.log("👤 Creating 20 profiles...");
  const created: Record<string, any> = {};
  for (const p of profiles) {
    const row = await prisma.profile.create({
      data: {
        ...p,
        photos: JSON.stringify(p.photos ?? [p.image]),
        lastActive: ago(Math.floor(Math.random() * 3 * DAY)),
        createdAt: ago(Math.floor(Math.random() * 60 * DAY) + 2 * DAY),
      },
    });
    created[p.fullName] = row;
  }
  const A = created["Ayesha Siddiqui"];
  const Z = created["Zaid Ahmed"];
  const IM = created["Imran Siddique"];
  const AR = created["Arman Hussain"];
  const YU = created["Yusuf Patel"];
  const BI = created["Bilal Mirza"];
  const OM = created["Omar Faruqi"];
  const TA = created["Tariq Mahmood"];

  console.log("💌 Creating proposals (interests)...");
  const mkInterest = async (from: any, to: any, message: string | null, status: string, hoursAgo: number) =>
    prisma.interest.create({
      data: { fromId: from.id, toId: to.id, message, status, createdAt: ago(hoursAgo * HOUR) },
    });

  // Ayesha's world
  await mkInterest(Z, A, "Assalamu Alaikum Ayesha. Your profile resonated deeply — may Allah write what is best for both of us.", "accepted", 52);
  await mkInterest(A, Z, "Wa Alaikum Assalam. Jazak Allah khair for your kind words. I would be happy for our families to connect.", "accepted", 40);
  await mkInterest(IM, A, "Assalamu Alaikum. I admire your balance of deen and career. I'd be honoured to connect respectfully.", "pending", 30);
  await mkInterest(AR, A, "Salam! Your volunteering at the masjid caught my eye — I teach first-aid camps myself. Perhaps we match?", "pending", 22);
  await mkInterest(YU, A, "Hi Ayesha, your profile made me smile. Open to a respectful family-first conversation?", "pending", 9);
  await mkInterest(BI, A, "Assalamu Alaikum. A Hafiz's dua for a Tajweed reciter — our families are from the same City, perhaps it's a sign.", "pending", 5);
  await mkInterest(A, OM, "Assalamu Alaikum Omar. Your work sounds fascinating and your intentions purer. Would love our families to connect.", "pending", 14);

  // Among others (for realism)
  await mkInterest(created["Zoya Khan"], created["Hamza Ali"], null, "pending", 20);
  await mkInterest(created["Khadija Farooqui"], created["Omar Faruqi"], "Salam Omar — two nerds, one planet. Worth a chat?", "accepted", 60);
  await mkInterest(OM, created["Khadija Farooqui"], "Wa alaikum assalam — indeed. Jazak Allah khair for reaching out.", "accepted", 58);
  await mkInterest(created["Maryam Ansari"], created["Nabeel Aslam"], null, "pending", 44);
  await mkInterest(created["Rumana Haque"], created["Bilal Mirza"], "Assalamu Alaikum. Your trust work with orphans moved me. Barakallahu feek.", "accepted", 72);
  await mkInterest(BI, created["Rumana Haque"], "Wa alaikum assalam. Yours is a profile of substance. I have requested my family to connect with yours.", "accepted", 70);
  await mkInterest(created["Hafsa Sheikh"], created["Tariq Mahmood"], null, "pending", 18);
  await mkInterest(created["Amira Rahman"], TA, "Salam Tariq — fellow Dubai soul with Hyderabad roots? The universe is funny.", "pending", 12);
  await mkInterest(created["Sana Malik"], created["Sameer Khan"], null, "pending", 26);
  await mkInterest(created["Sameer Khan"], created["Sana Malik"], "Salam Sana! My cousins swear by your boutique. Small world, big smiles.", "declined", 24);

  console.log("💬 Creating chat messages (Ayesha ↔ Zaid, mutual match)...");
  const threadKey = [A.id, Z.id].sort().join(":");
  const mkMsg = async (from: any, to: any, body: string, hoursAgo: number, readByTo: boolean) =>
    prisma.message.create({
      data: {
        threadKey,
        fromId: from.id,
        toId: to.id,
        body,
        readAt: readByTo ? ago(hoursAgo * HOUR - 20 * 60_000) : null,
        createdAt: ago(hoursAgo * HOUR),
      },
    });

  await mkMsg(Z, A, "Assalamu Alaikum Ayesha. Alhamdulillah our families have agreed to connect — I wanted to greet you respectfully first.", 26, true);
  await mkMsg(A, Z, "Wa Alaikum Assalam wa Rahmatullah, Zaid. Jazak Allah khair — that's a thoughtful way to begin. How was your Friday halaqah?", 25, true);
  await mkMsg(Z, A, "Alhamdulillah, we studied Surah Kahf — the lesson was about barakah in time, very fitting for this week. And yours? The volunteer work at the masjid?", 24, true);
  await mkMsg(A, Z, "We packed ramzan ration kits for the Old Age Home in Bandra. 200 families, MashaAllah. My favourite Sunday of the month.", 23, true);
  await mkMsg(Z, A, "MashaAllah, that's beautiful. My mother asked me to pass her salaam — she says a girl who bakes red velvet 'must be kept'. 😄 Forgive the humour, but she meant it warmly.", 8, true);
  await mkMsg(A, Z, "Haha, please tell Aunty I accept the challenge — I'll bake for the family once we meet properly, insha'Allah.", 7, true);
  await mkMsg(Z, A, "Insha'Allah. My parents would like to arrange a call with your father after Maghrib this weekend, if convenient?", 4, false);
  await mkMsg(A, Z, "That works well, Alhamdulillah. My father is usually free after Asr. I'll inform him today.", 2, false);

  console.log("👀 Creating profile views...");
  const mkView = async (viewer: any, target: any, hoursAgo: number) =>
    prisma.profileView.create({
      data: { viewerId: viewer.id, profileId: target.id, createdAt: ago(hoursAgo * HOUR) },
    });
  await mkView(Z, A, 50);
  await mkView(IM, A, 29);
  await mkView(AR, A, 21);
  await mkView(YU, A, 8);
  await mkView(TA, A, 3);
  await mkView(A, Z, 49);
  await mkView(A, OM, 13);
  await mkView(A, IM, 28);
  await mkView(created["Khadija Farooqui"], OM, 61);
  await mkView(OM, created["Khadija Farooqui"], 59);

  console.log("💾 Creating saved profiles (Ayesha's bookmarks)...");
  await prisma.savedProfile.create({ data: { fromId: A.id, toId: OM.id, createdAt: ago(13 * HOUR) } });
  await prisma.savedProfile.create({ data: { fromId: A.id, toId: AR.id, createdAt: ago(20 * HOUR) } });

  console.log("🔔 Creating notifications for Ayesha...");
  const mkNotif = async (profileId: string, type: string, title: string, body: string | null, hoursAgo: number, read: boolean) =>
    prisma.notification.create({
      data: { profileId, type, title, body, read, createdAt: ago(hoursAgo * HOUR) },
    });
  await mkNotif(A.id, "proposal", "New proposal from Imran S.", "A chartered accountant from New Delhi expressed interest in your profile.", 30, false);
  await mkNotif(A.id, "match", "It's a match with Zaid A.", "You both accepted each other's proposals. A respectful conversation has been unlocked.", 40, true);
  await mkNotif(A.id, "view", "Your profile was viewed 5 times this week", "Includes views from Dubai and New Delhi.", 6, false);
  await mkNotif(A.id, "message", "Zaid A. sent you a message", "My parents would like to arrange a call with your father after Maghrib…", 4, false);
  await mkNotif(A.id, "system", "Assalamu Alaikum, Ayesha", "Your Gold verification is complete. Trust score: 96. Your profile is featured this week.", 100, true);

  console.log("🪪 Creating verification requests (admin queue)...");
  await prisma.verificationRequest.createMany({
    data: [
      { profileId: created["Sana Malik"].id, docType: "Aadhaar Card", docRef: "XXXX XXXX 4821", status: "pending", createdAt: ago(26 * HOUR) },
      { profileId: created["Hamza Ali"].id, docType: "Passport", docRef: "Z•••• 7789", status: "pending", createdAt: ago(15 * HOUR) },
      { profileId: TA.id, docType: "Aadhaar Card", docRef: "XXXX XXXX 9930", status: "pending", createdAt: ago(9 * HOUR) },
      { profileId: created["Nabeel Aslam"].id, docType: "Driving Licence", docRef: "ON ••• ••881", status: "pending", createdAt: ago(3 * HOUR) },
      { profileId: A.id, docType: "Aadhaar Card", docRef: "XXXX XXXX 1122", status: "approved", createdAt: ago(80 * DAY), reviewedAt: ago(79 * DAY) },
      { profileId: Z.id, docType: "Passport", docRef: "Z•••• 4410", status: "approved", createdAt: ago(70 * DAY), reviewedAt: ago(69 * DAY) },
    ],
  });

  console.log("🚩 Creating reports (moderation queue)...");
  await prisma.report.createMany({
    data: [
      { reporterName: "Rumana H.", profileId: TA.id, reason: "Inappropriate request", details: "Requested photos outside the platform guidelines in his first message.", status: "open", action: "none", createdAt: ago(11 * HOUR) },
      { reporterName: "Zoya K.", profileId: created["Sameer Khan"].id, reason: "Suspected inaccuracy", details: "Claimed ₹50L+ income which contradicts his listed ₹10–15 LPA.", status: "open", action: "none", createdAt: ago(30 * HOUR) },
      { reporterName: "Hafsa S.", profileId: AR.id, reason: "Spam messages", details: "Copy-pasted the same message to her cousin's profile.", status: "resolved", action: "warned", createdAt: ago(5 * DAY), resolvedAt: ago(4 * DAY) },
    ],
  });

  console.log("💍 Creating success stories...");
  await prisma.successStory.createMany({
    data: [
      {
        coupleNames: "Mariam & Junaid",
        title: "We found barakah in the most unexpected place",
        quote: "Ammi saw Mariam's profile first. Three months later, we were married — with both families' blessings.",
        story:
          "Junaid, a civil services aspirant from Mumbai, and Mariam, a schoolteacher, were matched by Qabiltoo's family-first approach in 2023. His mother initiated the proposal, the families met over chai and dates, and within three months the nikah was fixed. They credit the platform's guardian tools for making everything transparent and dignified from the very first step. Today they lead a young couples' halaqah together in their community.",
        image: "/images/success-couple-1.png",
        city: "Mumbai",
        country: "India",
        marriedAt: "November 2023",
        featured: true,
        approved: true,
      },
      {
        coupleNames: "Sara & Imran",
        title: "Our families spoke first — and it changed everything",
        quote: "The wali contact card removed all the awkwardness. Our fathers spoke before we even saw each other's full photos.",
        story:
          "Sara, a physiotherapist from Hyderabad, and Imran, a banker, connected through Qabiltoo's guardian-approved proposals in early 2024. With the wali feature, both families were involved from day one — no secrecy, no misunderstandings. A respectful video call, a family meeting in Ramadan, and a beautiful nikah in March. They now mentor new couples on the platform and insist 'family-first' is the only way.",
        image: "/images/success-couple-2.png",
        city: "Hyderabad",
        country: "India",
        marriedAt: "March 2024",
        featured: true,
        approved: true,
      },
      {
        coupleNames: "Zara & Fahad",
        title: "From two cities, one dua",
        quote: "8,000 kilometres apart, one mutual acceptance — and an unboxing of barakah we never expected.",
        story:
          "Zara, an architect in Dubai, and Fahad, a fintech analyst in Bengaluru, matched across borders in late 2023. Qabiltoo's verified profiles and NRI filters made long-distance trust possible: ID-verified profiles, family-inclusive chats, and clear intentions from the start. After six months of family-supervised conversations and two visits, Fahad moved to Dubai. Their walima was exactly what dua looks like when it's answered.",
        image: "/images/success-couple-3.png",
        city: "Dubai",
        country: "United Arab Emirates",
        marriedAt: "January 2025",
        featured: true,
        approved: true,
      },
      {
        coupleNames: "Aisha & Rehan",
        title: "The wali feature won my mother's heart",
        quote: "My mother said, 'Finally, an app where your brother can see everything.' That trust made all the difference.",
        story:
          "Aisha, a GP trainee in London, was wary of every matrimonial site — until her brother used Qabiltoo's guardian dashboard to shortlist Rehan, a cybersecurity consultant from Birmingham. Transparent verification badges, respectful communication and guardian-approved proposals later, their families met at a neutral family event in Leicester. Married in June 2024, they say the platform felt 'like a trusted family friend, not an app'.",
        image: "/images/success-couple-4.png",
        city: "London",
        country: "United Kingdom",
        marriedAt: "June 2024",
        featured: false,
        approved: true,
      },
      {
        coupleNames: "Nikhat & Adnan",
        title: "A modest photo, a genuine connection",
        quote: "He messaged about my volunteer work, not my photo. That told me everything about his intentions.",
        story:
          "Nikhat, a nutritionist from Delhi, and Adnan, a lawyer, matched in 2024 over a shared passion for community service — his first message asked about her Ramadan food-drive, not her appearance. With blurred-photo privacy settings, they conversed with dignity until families were ready. The nikah was held in Delhi with both communities present. They now run a monthly charity drive together — and still message through the app that introduced them.",
        image: "/images/success-couple-5.png",
        city: "New Delhi",
        country: "India",
        marriedAt: "February 2025",
        featured: true,
        approved: true,
      },
    ],
  });

  console.log("✅ Seed complete!");
  const counts = {
    profiles: await prisma.profile.count(),
    interests: await prisma.interest.count(),
    messages: await prisma.message.count(),
    stories: await prisma.successStory.count(),
    views: await prisma.profileView.count(),
    notifications: await prisma.notification.count(),
    verifications: await prisma.verificationRequest.count(),
    reports: await prisma.report.count(),
  };
  console.log(counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
