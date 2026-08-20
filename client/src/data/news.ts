export type NewsCategory = "press" | "social";

export type NewsLanguage = "en" | "ar";

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  source: string;
  externalUrl: string;
  category: NewsCategory;
  language: NewsLanguage;
  featured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "tadawul-news-en-jamila-handover",
    title: "J Communities begins delivering first batch of Jamila North Coast chalets to Egypt's National Football Team players",
    excerpt:
      "J Communities has launched the first phase of handing over hotel-style chalets to Egypt's national football team, honoring players and coaching staff for their outstanding performances.",
    publishedAt: "2026-08-01",
    source: "Tadawul News",
    externalUrl: "https://tadawulnews.net/archives/38007",
    category: "press",
    language: "en",
    featured: true,
  },
  {
    slug: "profayly-en-jamila-handover",
    title: "J Communities commences handover of complimentary chalets to Egypt's National Football Team heroes at Jamila North Coast",
    excerpt:
      "Eng. Girgis Youssef, Chairman of J Communities, confirmed the first batch of chalets has begun handover at company headquarters, with remaining units scheduled at Jamila on the North Coast.",
    publishedAt: "2026-08-01",
    source: "Profiley",
    externalUrl:
      "https://profayly.com/en/j-communities-commences-handover-of-complimentary-chalets-to-egypts-national-football-team-heroes-at-jamila-north-coast/",
    category: "press",
    language: "en",
    featured: true,
  },
  {
    slug: "tadawul-news-ar-jamila-handover",
    title: "شركة «J Communities» تبدأ تسليم الدفعة الأولى من شاليهات مشروع «Jamila» لعدد من لاعبي المنتخب الوطني",
    excerpt:
      "أعلنت شركة J Communities بدء المرحلة الأولى من تسليم الشاليهات الفندقية المهداة للاعبي المنتخب الوطني المصري، تقديرًا لإنجاز وطني يستحق الاحتفاء.",
    publishedAt: "2026-08-01",
    source: "Tadawul News",
    externalUrl: "https://tadawulnews.net/archives/38003",
    category: "press",
    language: "ar",
    featured: true,
  },
  {
    slug: "akhbarelyom-jamila-handover",
    title: "شركة «J Communities» تبدأ أولى تسليمات الشاليهات المهداة لأبطال المنتخب الوطني بمشروع Jamila",
    excerpt:
      "بدأت الشركة تسليم الدفعة الأولى من الشاليهات داخل مقرها الرئيسي، مع استكمال التسليمات خلال الأسبوع التالي داخل مشروع Jamila بالساحل الشمالي.",
    publishedAt: "2026-08-01",
    source: "أخبار اليوم",
    externalUrl:
      "https://akhbarelyom.com/news/NewDetails/4858519/1/%D8%B4%D8%B1%D9%83%D8%A9-%C2%ABJ-Communities%C2%BB-%D8%AA%D8%A8%D8%AF%D8%A3-%D8%A3%D9%88%D9%84%D9%89-%D8%AA%D8%B3%D9%84%D9%8A%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D8%B4%D8%A7%D9%84%D9%8A%D9%87%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D9%87%D8%AF%D8%A7",
    category: "press",
    language: "ar",
  },
  {
    slug: "ppregypt-jamila-handover",
    title: "J Communities تبدأ أولى تسليمات شاليهات Jamila لأبطال المنتخب الوطني بالساحل الشمالي",
    excerpt:
      "المبادرة تشمل لاعبي المنتخب والجهاز الفني تقديرًا لإنجازاتهم، مع استكمال تسليم باقي الوحدات خلال الأسبوع المقبل داخل مشروع Jamila.",
    publishedAt: "2026-08-01",
    source: "Professional Economy",
    externalUrl: "https://ppregypt.com/post/details/12901",
    category: "press",
    language: "ar",
  },
  {
    slug: "sada-elarab-jamila-handover",
    title: "شركة «J Communities» تبدأ أولى تسليمات الشاليهات المهداة لأبطال المنتخب بمشروع Jamila",
    excerpt:
      "أكد المهندس جرجس يوسف أن المبادرة تعكس مسؤولية الشركة المجتمعية ودعم النماذج الوطنية الناجحة في المحافل الرياضية.",
    publishedAt: "2026-07-31",
    source: "صدى العرب",
    externalUrl: "https://www.sada-elarab.com/814522",
    category: "press",
    language: "ar",
  },
  {
    slug: "tawasul24-jamila-handover",
    title: "شركة «J Communities» تبدأ تسليم الدفعة الأولى من شاليهات مشروع Jamila للمنتخب الوطني",
    excerpt:
      "تتضمن المبادرة إهداء شاليه فندقي فاخر بإطلالة مباشرة على البحر لكل لاعب، مع مزايا إضافية لأعضاء الجهاز الفني في مشروع Jura.",
    publishedAt: "2026-07-31",
    source: "Tawasul 24",
    externalUrl: "https://tawasul24.com/81620/",
    category: "press",
    language: "ar",
  },
  {
    slug: "alnafezah-jamila-handover",
    title: "J Communities تبدأ تسليم شاليهات Jamila المهداة لأبطال المنتخب الوطني",
    excerpt:
      "شملت الدفعة الأولى عددًا من نجوم المنتخب، على أن يتم استكمال تسليم باقي الوحدات داخل مشروع Jamila بالساحل الشمالي.",
    publishedAt: "2026-07-31",
    source: "النافذة",
    externalUrl: "https://alnafezah.com/2026/07/31/155343/",
    category: "press",
    language: "ar",
  },
  {
    slug: "elamwal-jamila-handover",
    title: "J Communities تبدأ أولى تسليمات الشاليهات المهداة لأبطال المنتخب بمشروع Jamila",
    excerpt:
      "مبادرة J Communities لتكريم أبطال المنتخب والجهاز الفني تقديرًا لأدائهم المميز أمام الجماهير المصرية.",
    publishedAt: "2026-07-31",
    source: "El Amwal",
    externalUrl:
      "https://www.elamwal.com/real-estate/egyptian-real-estate/%D8%B4%D8%B1%D9%83%D8%A9-j-communities-%D8%AA%D8%A8%D8%AF%D8%A3-%D8%A3%D9%88%D9%84%D9%89-%D8%AA%D8%B3%D9%84%D9%8A%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D8%B4%D8%A7%D9%84%D9%8A%D9%87%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D9%87%D8%AF%D8%A7%D8%A9-%D9%84%D8%A3%D8%A8%D8%B7%D8%A7%D9%84-%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AE%D8%A8-%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A-%D9%84%D9%83%D8%B1%D8%A9-%D8%A7%D9%84%D9%82%D8%AF%D9%85-%D8%A8%D9%85%D8%B4%D8%B1%D9%88%D8%B9-jamila-%D8%A8%D8%A7%D9%84%D8%B3%D8%A7%D8%AD%D9%84-%D8%A7%D9%84%D8%B4%D9%85%D8%A7%D9%84%D9%8A",
    category: "press",
    language: "ar",
  },
  {
    slug: "investoregy-jamila-handover",
    title: "J Communities تبدأ تسليم الدفعة الأولى من شاليهات Jamila لعدد من لاعبي المنتخب الوطني",
    excerpt:
      "أكد رئيس مجلس الإدارة أن الشركة حرصت على سرعة تنفيذ المبادرة وتحويلها إلى واقع ملموس يكرّم أصحاب الإنجازات.",
    publishedAt: "2026-07-31",
    source: "Investor Egypt",
    externalUrl:
      "https://investoregy.com/%D8%B4%D8%B1%D9%83%D8%A9-j-communities-%D8%AA%D8%A8%D8%AF%D8%A3-%D8%AA%D8%B3%D9%84%D9%8A%D9%85-%D8%A7%D9%84%D8%AF%D9%81%D8%B9%D8%A9-%D8%A7%D9%84%D8%A3%D9%88%D9%84%D9%89-%D9%85%D9%86-%D8%B4/",
    category: "press",
    language: "ar",
  },
  {
    slug: "nabd-investoregy-jamila-handover",
    title: "J Communities تبدأ تسليم شاليهات Jamila للاعبي المنتخب الوطني",
    excerpt:
      "تغطية إخبارية لمبادرة تكريم لاعبي المنتخب الوطني المصري والجهاز الفني بشاليهات فندقية في Jamila North Coast.",
    publishedAt: "2026-07-31",
    source: "Nabd",
    externalUrl: "https://nabd.cc/t/176076445",
    category: "press",
    language: "ar",
  },
  {
    slug: "businessmaser-jamila-handover-ar",
    title: "J Communities تبدأ تسليم الدفعة الأولى من شاليهات Jamila للمنتخب الوطني",
    excerpt:
      "تغطية إعلامية لمبادرة J Communities لتسليم الشاليهات الفندقية المهداة لأبطال المنتخب الوطني المصري.",
    publishedAt: "2026-07-31",
    source: "Business Maser",
    externalUrl: "https://businessmaser.com/33716/",
    category: "press",
    language: "ar",
  },
  {
    slug: "businessmaser-jamila-handover-en",
    title: "J Communities begins first Jamila chalet handovers to national team players",
    excerpt:
      "Press coverage of J Communities' initiative to gift hotel-style chalets at Jamila North Coast to Egypt's national football team.",
    publishedAt: "2026-07-31",
    source: "Business Maser",
    externalUrl: "https://businessmaser.com/33710/",
    category: "press",
    language: "en",
  },
  {
    slug: "instagram-jamila-handover",
    title: "J Communities celebrates Jamila handover on Instagram",
    excerpt:
      "Follow J Communities on Instagram for updates on Jamila North Coast and community initiatives across our destinations.",
    publishedAt: "2026-07-31",
    source: "Instagram",
    externalUrl: "https://www.instagram.com/p/DbdW9Z5CCQ_/",
    category: "social",
    language: "en",
  },
  {
    slug: "facebook-cairo24-jamila-handover",
    title: "Cairo 24 covers J Communities Jamila initiative for Egypt's national team",
    excerpt:
      "Social coverage highlighting J Communities' handover of Jamila North Coast chalets to national team players and coaching staff.",
    publishedAt: "2026-07-31",
    source: "Facebook · Cairo 24",
    externalUrl:
      "https://www.facebook.com/cairo24/posts/pfbid02PByeeeMtjV8sunJ3XDiLgpF4ywRiTjgtfUazFRRAhDzAZhcn32KSzVTVfo8tA3PVl",
    category: "social",
    language: "ar",
  },
];

const sortedArticles = [...newsArticles].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function getNewsArticles(): NewsArticle[] {
  return sortedArticles;
}

export function getNewsBySlug(slug: string | undefined): NewsArticle | undefined {
  if (!slug) return undefined;
  return newsArticles.find((article) => article.slug === slug);
}

export function getFeaturedNews(limit = 3): NewsArticle[] {
  const featured = sortedArticles.filter((article) => article.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return sortedArticles.slice(0, limit);
}

export function getRelatedNews(currentSlug: string, limit = 3): NewsArticle[] {
  return sortedArticles.filter((article) => article.slug !== currentSlug).slice(0, limit);
}
