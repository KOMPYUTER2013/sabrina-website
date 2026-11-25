export const defaultContent = {
  brand: "Sabrina U.",
  nav: [
    "Haqida",
    "Dars",
    "Afzalliklar",
    "Tajriba",
    "Ish reja",
    "Sinov",
    "Savollar",
    "Aloqa",
  ],
  hero: {
    badge: "🌸 Toyloq IT Park · IT oʻqituvchi",
    title: "Kompyuterni noldan oʻrganing, oddiy va tushunarli.",
    description:
      "Umurzoqova Sabrina Murusmonovna. Kompyuter savodxonligi oʻqituvchisi, 3 yillik tajriba va 500 dan ortiq oʻquvchi.",
    primaryButton: "Darsga yozilish",
    secondaryButton: "Tajriba",
  },
  about: {
    eyebrow: "Men haqimda",
    title: "Oʻquvchi uchun qulay darslar",
    description:
      "Men Toyloq IT Parkda kompyuter savodxonligidan dars beraman. Maqsadim har bir oʻquvchi kompyuterda ishonch bilan ishlashni oʻrganishi.",
    stats: [
      { value: "3 yil", label: "tajriba" },
      { value: "500+", label: "oʻquvchi" },
      { value: "2024", label: "dekabrdan Toyloq IT Parkda" },
    ],
  },
  services: {
    eyebrow: "Darslar",
    title: "Nimalarni oʻrgatadi",
    items: [
      {
        icon: "💻",
        title: "Kompyuter savodxonligi",
        description: "Kompyuterda ishlashning asosiy bilimlari noldan.",
      },
      {
        icon: "🌐",
        title: "Internetdan foydalanish",
        description: "Qidirish, pochta va xavfsiz ishlash.",
      },
      {
        icon: "📄",
        title: "Hujjatlar bilan ishlash",
        description: "Matn va jadval yaratish, saqlash va yuborish.",
      },
    ],
  },
  why: {
    eyebrow: "Afzalliklar",
    title: "Nega Sabrina ustoz",
    items: [
      {
        title: "⚡ Amaliy darslar",
        description: "Har mavzu kompyuter oldida mashq bilan oʻtiladi.",
      },
      {
        title: "🎯 Noldan boshlash",
        description: "Hech narsa bilmaydiganlar uchun ham tushunarli.",
      },
      {
        title: "🏆 Tajriba",
        description: "500 dan ortiq oʻquvchi bilan ishlagan.",
      },
    ],
  },
  path: {
    eyebrow: "Yoʻl",
    title: "Tajriba, taʼlim, sertifikat",
    items: [
      {
        date: "2024-yil dekabrdan hozirgacha",
        title: "IT oʻqituvchi",
        current: "hozir",
        description: "Toyloq IT Park. Kompyuter savodxonligi boʻyicha darslar.",
      },
      {
        date: "Universitet",
        title: "Samarqand davlat universiteti",
        current: "",
        description:
          "Sharof Rashidov nomidagi. Filologiya va tillarni oʻqitish (oʻzbek tili).",
      },
      {
        date: "18.04.2025 – 18.06.2025",
        title: "“Elegant Exclusive” diplomi",
        current: "",
        description: "“Uy hamshirasi” kursi, imtiyozli diplom.",
      },
    ],
  },
  plan: {
    eyebrow: "3 oylik amaliy dastur",
    title: "Kompyuter savodxonligi boʻyicha ish reja",
    stats: [
      { value: "12 hafta", label: "kurs davomiyligi" },
      { value: "36 ta", label: "mashgʻulot" },
      {
        value: "72 soat",
        label: "umumiy hajm · haftasiga 3 kun, 2 soatdan",
      },
    ],
    pdfTitle: "Toʻliq 12 haftalik ish reja",
    pdfDescription: "Dars mavzulari, amaliy topshiriqlar va baholash mezonlari",
    pdfAction: "PDF’ni ochish ↗",
    pdfUrl: "/ish-reja.pdf",
  },
  typing: {
    eyebrow: "Sinab koʻring",
    title: "Klaviaturada yozish tezligingiz",
    sample: "Har kuni mashq qilsangiz kompyuterda tez va xatosiz yozasiz.",
    placeholder: "Shu yerga yozishni boshlang",
    reset: "Qayta urinish",
    resultPrompt: "Tezroq yozishni oʻrganmoqchimisiz? Darsga yoziling.",
  },
  faq: {
    eyebrow: "Savollar",
    title: "Koʻp beriladigan savollar",
    items: [
      {
        question: "Kimlar uchun darslar?",
        answer:
          "Kompyuterda ishlashni oʻrganmoqchi boʻlgan har kim uchun. Darslar noldan boshlanadi.",
      },
      {
        question: "Darslar qayerda oʻtadi?",
        answer: "Toyloq IT Parkda, Samarqand viloyati, Toyloq tumani.",
      },
      {
        question: "Narx va dars vaqtini qayerdan bilaman?",
        answer:
          "Quyidagi forma orqali yoki Telegram botga yozing, tez orada javob beraman.",
      },
    ],
  },
  contact: {
    eyebrow: "Aloqa",
    title: "Darsga yozilish",
    locationTitle: "Toyloq IT Park",
    locationDescription: "Samarqand viloyati, Toyloq tumani.",
    telegramButton: "Telegram botga yozish",
    telegramUrl: "https://t.me/sabrina_xabar_bot",
    formTitle: "Savol yoki yozilish",
    namePlaceholder: "Ismingiz",
    phonePlaceholder: "Telefon raqamingiz",
    topicOptions: ["Darsga yozilish", "Savol", "Boshqa"],
    messagePlaceholder: "Savolingiz",
    submitButton: "Yuborish",
    sending: "Yuborilmoqda…",
    sent: "Yuborildi. Tez orada bogʻlanamiz.",
    failed: "Xabarni yuborib boʻlmadi.",
    botLinkText: "Telegram botga yozing",
  },
  footer: "© 2026 Sabrina Umurzoqova. Barcha huquqlar himoyalangan.",
};

const field = (path, label) => ({ path, label });
const itemFieldLabels = {
  icon: "Belgi",
  title: "Sarlavha",
  description: "Tavsif",
  value: "Qiymat",
  label: "Izoh",
  date: "Davr",
  current: "Holat",
  question: "Savol",
  answer: "Javob",
};
const itemFields = (prefix, items, labels) =>
  items.flatMap((item, index) =>
    Object.keys(item).map((key) =>
      field(`${prefix}.${index}.${key}`, `${labels[index]} · ${itemFieldLabels[key] || key}`),
    ),
  );

export const contentSections = [
  {
    title: "Yuqori qism",
    fields: [
      field("brand", "Sayt nomi"),
      ...["badge", "title", "description", "primaryButton", "secondaryButton"].map(
        (key, index) =>
          field(`hero.${key}`, ["Belgi matni", "Sarlavha", "Tavsif", "Asosiy tugma", "Ikkinchi tugma"][index]),
      ),
      ...defaultContent.nav.map((_, index) =>
        field(`nav.${index}`, `Menyu ${index + 1}`),
      ),
    ],
  },
  {
    title: "Men haqimda",
    fields: [
      field("about.eyebrow", "Kichik sarlavha"),
      field("about.title", "Sarlavha"),
      field("about.description", "Tavsif"),
      ...itemFields("about.stats", defaultContent.about.stats, ["Statistika 1", "Statistika 2", "Statistika 3"]),
    ],
  },
  {
    title: "Darslar",
    fields: [
      field("services.eyebrow", "Kichik sarlavha"),
      field("services.title", "Sarlavha"),
      ...itemFields("services.items", defaultContent.services.items, ["Dars 1", "Dars 2", "Dars 3"]),
    ],
  },
  {
    title: "Afzalliklar",
    fields: [
      field("why.eyebrow", "Kichik sarlavha"),
      field("why.title", "Sarlavha"),
      ...itemFields("why.items", defaultContent.why.items, ["Afzallik 1", "Afzallik 2", "Afzallik 3"]),
    ],
  },
  {
    title: "Tajriba",
    fields: [
      field("path.eyebrow", "Kichik sarlavha"),
      field("path.title", "Sarlavha"),
      ...itemFields("path.items", defaultContent.path.items, ["Tajriba 1", "Tajriba 2", "Tajriba 3"]),
    ],
  },
  {
    title: "Ish reja",
    fields: [
      field("plan.eyebrow", "Kichik sarlavha"),
      field("plan.title", "Sarlavha"),
      ...itemFields("plan.stats", defaultContent.plan.stats, ["Statistika 1", "Statistika 2", "Statistika 3"]),
      field("plan.pdfTitle", "PDF sarlavhasi"),
      field("plan.pdfDescription", "PDF tavsifi"),
      field("plan.pdfAction", "PDF tugmasi"),
      field("plan.pdfUrl", "PDF havolasi"),
    ],
  },
  {
    title: "Yozish sinovi",
    fields: [
      ...["eyebrow", "title", "sample", "placeholder", "reset", "resultPrompt"].map(
        (key, index) =>
          field(`typing.${key}`, ["Kichik sarlavha", "Sarlavha", "Mashq matni", "Maydon yozuvi", "Qayta urinish tugmasi", "Natija matni"][index]),
      ),
    ],
  },
  {
    title: "Savol-javob",
    fields: [
      field("faq.eyebrow", "Kichik sarlavha"),
      field("faq.title", "Sarlavha"),
      ...itemFields("faq.items", defaultContent.faq.items, ["Savol 1", "Savol 2", "Savol 3"]),
    ],
  },
  {
    title: "Aloqa va forma",
    fields: [
      ...[
        "eyebrow",
        "title",
        "locationTitle",
        "locationDescription",
        "telegramButton",
        "telegramUrl",
        "formTitle",
        "namePlaceholder",
        "phonePlaceholder",
        "messagePlaceholder",
        "submitButton",
        "sending",
        "sent",
        "failed",
        "botLinkText",
      ].map((key, index) =>
        field(
          `contact.${key}`,
          [
            "Kichik sarlavha",
            "Sarlavha",
            "Joy nomi",
            "Manzil",
            "Telegram tugmasi",
            "Telegram havolasi",
            "Forma sarlavhasi",
            "Ism maydoni",
            "Telefon maydoni",
            "Savol maydoni",
            "Yuborish tugmasi",
            "Yuborilmoqda xabari",
            "Muvaffaqiyat xabari",
            "Xatolik xabari",
            "Telegram havolasi matni",
          ][index],
        ),
      ),
      ...defaultContent.contact.topicOptions.map((_, index) =>
        field(`contact.topicOptions.${index}`, `Murojaat turi ${index + 1}`),
      ),
    ],
  },
  { title: "Pastki qism", fields: [field("footer", "Mualliflik matni")] },
];
