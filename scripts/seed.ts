import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const profiles = [
  // ================= FEMALES =================
  {
    fullName: "Ayesha Siddiqui",
    gender: "female",
    age: 26,
    height: "5 ft 3 in",
    city: "Mumbai",
    state: "Maharashtra",
    education: "MSc Data Science, Mumbai University",
    profession: "UX Designer",
    income: "₹12–15 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    about:
      "Bismillah — I'm a Mumbai girl who finds joy in the little things: morning fajr with chai, weekend volunteering at our masjid, and sketching interfaces that people love. My family is close-knit and moderate; Sunday dinners at Dadi's are non-negotiable! I wear hijab with pride and seek someone who sees it as a crown, not a constraint. I love baking (my red velvet is famous in the family), Urdu poetry, and quiet evenings with a good book.",
    partnerPreference:
      "Looking for a kind, deen-conscious groom aged 26–32 who prays regularly and treats his mother with respect. Education matters but character matters more. Mumbai-based preferred since I'm close to my parents — though I can relocate for the right person, insha'Allah.",
    image: "/images/profile-f1.png",
    email: "ayesha@demo.qabiltoo.in",
  },
  {
    fullName: "Zoya Khan",
    gender: "female",
    age: 24,
    height: "5 ft 5 in",
    city: "New Delhi",
    state: "Delhi",
    education: "BA LLB (Hons), National Law University",
    profession: "Junior Advocate, Delhi High Court",
    income: "₹9–12 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "I argue for a living and argue with love at home — my Abba says I was born with a lawyer's tongue and a poet's heart. I'm the eldest of three, half Delhiite, half Lucknowi tehzeeb. I enjoy long drives on India Gate loops, fee qigong... no wait, that's qigong — I mean qawwali nights at Nizamuddin Dargah, and mentoring first-generation law students. Faith guides my compass; I pray, I fast, and I believe a marriage is a partnership of two growing souls.",
    partnerPreference:
      "A groom aged 24–30 with progressive thinking and rooted values. Should respect my career — I intend to keep practicing. A man who can discuss ideas over kebabs and still wake up for tahajjud occasionally. Delhi/NCR preferred.",
    image: "/images/profile-f2.png",
    email: "zoya@demo.qabiltoo.in",
  },
  {
    fullName: "Fatima Rizvi",
    gender: "female",
    age: 28,
    height: "5 ft 2 in",
    city: "Hyderabad",
    state: "Telangana",
    education: "MBBS, MD (Paediatrics), Osmania",
    profession: "Paediatrician",
    income: "₹18–24 LPA",
    maritalStatus: "Never Married",
    sect: "Shia",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    about:
      "Children call me Dr. Fatu and give me drawings of me as a superhero — best salary supplement ever! I'm a Hyderabad doctor with Lucknowi roots, majalis-attending, biryani-defending (Hyderabadi > Lucknowi, come at me). Old City walks, Indo-Islamic history podcasts and teaching my little patients about germs fill my weeks. My family is respected, religious and warm. I believe in love that grows slowly and deeply — the kind that makes Allah smile.",
    partnerPreference:
      "Seeking a professional groom aged 27–33 (medicine preferred but not required), Shia, practicing, family-oriented. Someone patient — I have night duties! Hyderabadi spice tolerance is a bonus. My parents are lovely people; you'll enjoy meeting them.",
    image: "/images/profile-f3.png",
    email: "fatima@demo.qabiltoo.in",
  },
  {
    fullName: "Maryam Ansari",
    gender: "female",
    age: 25,
    height: "5 ft 4 in",
    city: "Lucknow",
    state: "Uttar Pradesh",
    education: "MA English Literature, AMU",
    profession: "Lecturer",
    income: "₹6–9 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    about:
      "Lucknow born and raised — my world is chikan kurtas, Gomti evening walks and Adaab-style etiquette. I teach English literature and secretly translate Ghalib for my students to prove Urdu is not 'old'. I observe pardah from the heart: hijab outdoors, warmth within. I memorized 10 juz of Quran and continue my hifz journey. My ideal evening? Mehfil with family, laughing over Abbu's ancient jokes and Ammi's legendary kebabs.",
    partnerPreference:
      "A gentle, Allah-fearing groom aged 25–31 who values family, can lead a household with compassion (not commands), and won't mind a wife who quotes Faiz Ahmed Faiz at dinner. Lucknow/Kanpur preferred.",
    image: "/images/profile-f4.png",
    email: "maryam@demo.qabiltoo.in",
  },
  {
    fullName: "Khadija Sheikh",
    gender: "female",
    age: 27,
    height: "5 ft 6 in",
    city: "Bengaluru",
    state: "Karnataka",
    education: "B.Tech CSE, NIT Surathkal",
    profession: "Software Engineer at a product company",
    income: "₹24–30 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "Code by day, crochet by night — I once built a wedding-app for my cousin's nikah RSVPs and it crashed under aunty enthusiasm. I'm a Bengaluru techie from a middle-class family in Hubli; we save for Hajj like others save for cars. I'm into fitness (yes, hijabi gym-goers exist), South Indian filter coffee superiority, and weekend dawah literature reading circles. Balance is my mantra: ambitious at work, humble in worship.",
    partnerPreference:
      "Looking for a technically curious, emotionally mature groom aged 26–32. Must respect my career and share household loads — sunnah says he helped at home, so it's literally prophetic. Bengaluru or remote-friendly roles preferred.",
    image: "/images/profile-f1.png",
    email: "khadija@demo.qabiltoo.in",
  },
  {
    fullName: "Aaliya Qureshi",
    gender: "female",
    age: 29,
    height: "5 ft 1 in",
    city: "Chennai",
    state: "Tamil Nadu",
    education: "Chartered Accountant (CA)",
    profession: "Financial Analyst",
    income: "₹20–25 LPA",
    maritalStatus: "Divorced",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "Numbers don't lie, and neither will I: my first marriage ended amicably after two years — we were great people who made each other small. No children, no baggage, just wisdom. I'm a CA who loves balance sheets and beach walks on ECR. My family stood by me without a single 'we told you so'. I'm rebuilding gently: new surahs memorized, new countries travelled, new recipes mastered. I believe my best chapters are unwritten.",
    partnerPreference:
      "A groom aged 29–38 who is mature, kind and doesn't see divorce as a defect. Honesty over flattery, substance over show. Chennai preferred; I'd love a man who prays with me and laughs with me in equal measure.",
    image: "/images/profile-f2.png",
    email: "aaliya@demo.qabiltoo.in",
  },
  {
    fullName: "Hafsa Malik",
    gender: "female",
    age: 23,
    height: "5 ft 7 in",
    city: "Kolkata",
    state: "West Bengal",
    education: "B.Arch, Jadavpur University",
    profession: "Junior Architect",
    income: "₹6–8 LPA",
    maritalStatus: "Never Married",
    sect: "Just Muslim",
    religiousLevel: "Exploring",
    namaz: "Learning",
    about:
      "I design buildings and build IKEA furniture without the manual (mostly successfully). Kolkata raised me on rolly-polly fish and Para football. I'm on a sincere journey of faith — growing closer to Allah each year, at my own honest pace. I sketch mosques as a hobby; sometimes I think the dome talks to me. My family is easygoing, artistic and accepting. Looking for someone patient with my questions and genuine about growth.",
    partnerPreference:
      "A groom aged 24–30, open-minded and kind, who practices without preaching and won't rush my journey. Must love food adventures and old Kolkata charm. Any city works — architecture jobs are everywhere.",
    image: "/images/profile-f3.png",
    email: "hafsa@demo.qabiltoo.in",
  },

  // ================= MALES =================
  {
    fullName: "Faizan Ahmed",
    gender: "male",
    age: 28,
    height: "5 ft 9 in",
    city: "Hyderabad",
    state: "Telangana",
    education: "M.Tech, IIT Madras",
    profession: "Senior Software Engineer",
    income: "₹30–36 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    about:
      "Alhamdulillah — I'm a software engineer who takes his salah breaks as seriously as his sprint deadlines. Eldest son of a retired bank officer and a schoolteacher; I've been the 'family IT support' since age 12. I lead a quiet life: gym at 6, code at 9, Quran class twice a week at the local masjid. I cook a mean chicken 65 and make excellent chai (references available on request). Seeking a partner to build a home filled with laughter and taqwa.",
    partnerPreference:
      "Looking for a bride aged 23–28, practicing, with good manners and a warm heart. Education and career respected — I want her to be herself. Hyderabad-based or willing to move. Tall order: must tolerate my programming puns.",
    image: "/images/profile-m1.png",
    email: "faizan@demo.qabiltoo.in",
  },
  {
    fullName: "Arshad Hussain",
    gender: "male",
    age: 30,
    height: "5 ft 11 in",
    city: "Mumbai",
    state: "Maharashtra",
    education: "MBA Finance, JBIMS",
    profession: "Vice President, Investment Bank",
    income: "₹45+ LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "By profession I structure deals; by passion I structure Sunday breakfasts for my family. Marine Drive is my therapist, and my grandmother's Urdu novel collection is my inheritance. I've been blessed with career success and try to give back — I mentor young Muslims entering finance through a small weekend program. I fast Mondays, attend Jummah regularly, and I'm that guy who cries at nikah speeches. Ready for my own speech, insha'Allah.",
    partnerPreference:
      "Seeking a bride aged 25–30, well-educated, family-oriented, comfortable with Mumbai life. I admire women with ambitions and hobbies — bring your whole self. My family is progressive, warm and famously fun at weddings.",
    image: "/images/profile-m2.png",
    email: "arshad@demo.qabiltoo.in",
  },
  {
    fullName: "Imran Sheikh",
    gender: "male",
    age: 26,
    height: "5 ft 8 in",
    city: "New Delhi",
    state: "Delhi",
    education: "B.Tech CSE, DTU",
    profession: "Product Manager",
    income: "₹28–32 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "I turned a childhood obsession with organizing my pencil box into a product management career. Delhi boy with Bhopali roots — expect tehzeeb and occasional biryani opinions. I hit the gym five days a week, volunteer with a children's education NGO on Saturdays, and I'm slowly (painfully) learning tabla. My deen is my anchor: I pray, I fast, and I'm working on being better each Ramadan than the last.",
    partnerPreference:
      "Looking for a bride aged 23–27 with a good heart and light humor. Someone who'll be my teammate in deen and dunya. Delhi/NCR preferred. Bonus: appreciates street food adventures at Chandni Chowk.",
    image: "/images/profile-m3.png",
    email: "imran@demo.qabiltoo.in",
  },
  {
    fullName: "Zubair Siddiqui",
    gender: "male",
    age: 29,
    height: "5 ft 10 in",
    city: "Lucknow",
    state: "Uttar Pradesh",
    education: "MBBS, MS Orthopaedics, KGMU",
    profession: "Orthopaedic Surgeon",
    income: "₹36–42 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    about:
      "I fix bones; Allah fixes hearts. Third-generation doctor from an old Lucknow family — our house has more books than furniture. I practice medicine as an ibadah: free clinics every month in the old city, and I once treated a patient's fractured wrist during my own walima planning (long story). I love cricket, classical Urdu shayari, and my Ammi's nihari. A tablighi-inspired fazr walk before surgery keeps me centered.",
    partnerPreference:
      "Seeking a bride aged 24–29, preferably educated (medicine/teaching appreciated), who wants a family rooted in deen and service. Lucknow-based preferred. My parents are gentle souls; my sister says marrying me means inheriting the best samosa recipe in the city.",
    image: "/images/profile-m4.png",
    email: "zubair@demo.qabiltoo.in",
  },
  {
    fullName: "Tariq Jamil",
    gender: "male",
    age: 27,
    height: "5 ft 7 in",
    city: "Bengaluru",
    state: "Karnataka",
    education: "MSc Statistics, ISI Kolkata",
    profession: "Data Scientist",
    income: "₹26–30 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "I predict churn rates but could never predict I'd still be single at 27 (my Ammi reminds me weekly). Kolkata-trained, Bengaluru-based, Chennai-rooted — I speak Tamil at home, Bengali in dreams, and sarcasm fluently. Weekend cricket, Quran translation study circle, and a rising sourdough hobby define me. I believe love is data + dua: deliberate effort with sincere prayer.",
    partnerPreference:
      "Looking for a bride aged 23–28, kind and curious, who finds joy in small things. Career-friendly, family-loving. South India preferred. If you can explain cricket's DRS to me while I explain ML models, we might be soulmates.",
    image: "/images/profile-m1.png",
    email: "tariq@demo.qabiltoo.in",
  },
  {
    fullName: "Owais Farooqi",
    gender: "male",
    age: 31,
    height: "6 ft 0 in",
    city: "Chennai",
    state: "Tamil Nadu",
    education: "LLB, Madras Law College",
    profession: "Corporate Lawyer",
    income: "₹40+ LPA",
    maritalStatus: "Widowed",
    sect: "Sunni",
    religiousLevel: "Very Practicing",
    namaz: "5 times daily",
    about:
      "Life tested me early: I lost my wife to illness three years ago after a beautiful nikah. No children. I've rebuilt with sabr and a strong support system — my parents, my deen, and my purpose. I practice corporate law, teach weekend fiqh classes, and sponsor iftar for 100 families every Ramadan. I'm not broken; I'm seasoned. I have more love to give and believe marriage is written for me still, insha'Allah.",
    partnerPreference:
      "Seeking a bride aged 26–35, mature, compassionate, and sincere — widowhood/divorce on either side is no barrier for my family. Someone ready for a calm, deeply respectful partnership. Chennai preferred.",
    image: "/images/profile-m2.png",
    email: "owais@demo.qabiltoo.in",
  },
  {
    fullName: "Hamza Qadri",
    gender: "male",
    age: 25,
    height: "5 ft 8 in",
    city: "Pune",
    state: "Maharashtra",
    education: "B.Des, MIT Pune",
    profession: "UX Designer",
    income: "₹14–18 LPA",
    maritalStatus: "Never Married",
    sect: "Sunni",
    religiousLevel: "Moderate",
    namaz: "Regularly",
    about:
      "Designer by profession, calligrapher by obsession — my nasta'eeq has adorned three wedding cards and one very confused tattoo (I advised against it, gently). Pune-based with Lucknowi grandparents; I'm the family's blend of IT-city hustle and tehzeeb. I do Islamic calligraphy commissions on weekends and teach art to masjid Sunday-school kids. Faith is my aesthetic and my anchor. Chai enthusiast, chai snob actually.",
    partnerPreference:
      "Looking for a bride aged 22–27, creative soul preferred — teachers, designers, doctors, poets all welcome. Someone who values both deen and art. Pune/Mumbai preferred. Warning: my sketchbook contains 40 sketches of 'the perfect reading nook for our future home'.",
    image: "/images/profile-m3.png",
    email: "hamza@demo.qabiltoo.in",
  },
];

const DEMO_EMAIL = "ayesha@demo.qabiltoo.in";

async function seedInterests() {
  const ayesha = await prisma.profile.findUnique({ where: { email: DEMO_EMAIL } });
  if (!ayesha) return;

  const senders = await prisma.profile.findMany({
    where: { email: { in: ["arshad@demo.qabiltoo.in", "imran@demo.qabiltoo.in", "tariq@demo.qabiltoo.in", "zubair@demo.qabiltoo.in", "faizan@demo.qabiltoo.in", "hamza@demo.qabiltoo.in"] } },
  });
  const byEmail = Object.fromEntries(senders.map((s) => [s.email, s.id]));

  const received = [
    {
      fromId: byEmail["arshad@demo.qabiltoo.in"],
      toId: ayesha.id,
      status: "pending",
      message:
        "Assalamu Alaikum Ayesha! Your profile truly stood out — the volunteer work and the baking especially. My family would be honored to connect. JazakAllah khair for your time.",
    },
    {
      fromId: byEmail["imran@demo.qabiltoo.in"],
      toId: ayesha.id,
      status: "pending",
      message:
        "Assalamu Alaikum! I like how you think about design and deen together. I'm a product manager in Delhi — would love to know more about you, respectfully, with families involved from day one.",
    },
    {
      fromId: byEmail["tariq@demo.qabiltoo.in"],
      toId: ayesha.id,
      status: "accepted",
      message:
        "Salam Ayesha! A fellow South Indian Muslim who loves chai and good books — my Ammi would say the heavens aligned. I'd be delighted if our families could speak.",
    },
    {
      fromId: byEmail["zubair@demo.qabiltoo.in"],
      toId: ayesha.id,
      status: "pending",
      message:
        "Assalamu Alaikum. I'm an orthopaedic surgeon from Lucknow with old family values and a modern outlook. Your profile reflected sincerity, which I value most. Please consider connecting.",
    },
  ];

  const sent = [
    {
      fromId: ayesha.id,
      toId: byEmail["faizan@demo.qabiltoo.in"],
      status: "pending",
      message:
        "Assalamu Alaikum Faizan! Your balance of deen and career inspired me. I'm a designer in Mumbai — would be happy for our families to connect, insha'Allah.",
    },
    {
      fromId: ayesha.id,
      toId: byEmail["hamza@demo.qabiltoo.in"],
      status: "pending",
      message:
        "Salam Hamza! A calligrapher-designer — my kind of creative. Your Sunday-school work with kids is beautiful. Would love to connect through our families.",
    },
  ];

  for (const r of received) {
    await prisma.interest.create({ data: r });
  }
  for (const s of sent) {
    await prisma.interest.create({ data: s });
  }
  console.log(`Seeded ${received.length} received + ${sent.length} sent interests for ${DEMO_EMAIL}`);
}

async function main() {
  console.log("Clearing existing data…");
  await prisma.interest.deleteMany();
  await prisma.profile.deleteMany();

  console.log("Seeding profiles…");
  for (const p of profiles) {
    await prisma.profile.create({
      data: { ...p, isDemo: true, email: p.email!.toLowerCase() },
    });
  }
  console.log(`Seeded ${profiles.length} profiles.`);

  await seedInterests();
  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
