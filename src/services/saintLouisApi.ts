import { ArticleItem } from '../types';
import { SAINT_LOUIS_ARTICLES, FEATURED_ARTICLE } from '../data/articles';

const BASE_API = 'https://public-api.saintlouis.or.th/user-api';
const CACHE_KEY = 'slh_contents_cache_v1';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface RawContentItem {
  id: number;
  topic_th: string;
  topic_en?: string;
  description_th?: string;
  description_en?: string;
  created_at: string;
  category?: {
    key: string;
    name_th: string;
    name_en?: string;
  };
  features?: Array<{ lang?: string; media_uri?: string }>;
  covers?: Array<{ lang?: string; media_uri?: string }>;
  clinics?: Array<{
    clinic?: { name_th?: string; name_en?: string };
    name_th?: string;
  }>;
  clinic?: { name_th?: string; name_en?: string };
  doctors?: Array<{ doctor_name_th?: string; doctor_name_en?: string }>;
}

function formatThaiDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const months = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear() + 543; // พ.ศ.
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

function transformRawToArticle(raw: RawContentItem, isFeatured = false): ArticleItem {
  const title = raw.topic_th || raw.topic_en || 'บทความสุขภาพ โรงพยาบาลเซนต์หลุยส์';
  const summary =
    raw.description_th ||
    raw.description_en ||
    'ข้อมูลสุขภาพและสาระความรู้ทางการแพทย์จากคณะแพทย์ โรงพยาบาลเซนต์หลุยส์';

  // Extract cover image
  const coverTh = raw.covers?.find((c) => c.lang === 'th')?.media_uri;
  const coverAny = raw.covers?.[0]?.media_uri;
  const featureTh = raw.features?.find((f) => f.lang === 'th')?.media_uri;
  const featureAny = raw.features?.[0]?.media_uri;

  const imageUrl =
    coverTh ||
    coverAny ||
    featureTh ||
    featureAny ||
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop';

  // Category name
  const catName = raw.category?.name_th || 'สาระสุขภาพ';

  // Department / Clinic name
  let department = 'โรงพยาบาลเซนต์หลุยส์ (Saint Louis Hospital)';
  if (raw.clinics && raw.clinics.length > 0) {
    const cName = raw.clinics[0]?.clinic?.name_th || raw.clinics[0]?.name_th;
    if (cName) department = `${cName} รพ.เซนต์หลุยส์`;
  } else if (raw.clinic?.name_th) {
    department = `${raw.clinic.name_th} รพ.เซนต์หลุยส์`;
  }

  // Generate official URL
  const slug = encodeURIComponent(title.replace(/\s+/g, '-'));
  const url = `https://www.saintlouis.or.th/contents/${slug}/${raw.id}`;

  return {
    id: `slh-live-${raw.id}`,
    title,
    category: catName,
    department,
    date: formatThaiDate(raw.created_at),
    readTime: '3-5 นาที',
    summary,
    imageUrl,
    url,
    featured: isFeatured,
    tags: [catName, 'รพ.เซนต์หลุยส์'],
  };
}

export interface FetchArticlesResult {
  featured: ArticleItem;
  articles: ArticleItem[];
  categories: string[];
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
}

export async function fetchSaintLouisArticles(forceRefresh = false): Promise<FetchArticlesResult> {
  // 1. Check client-side cache
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < CACHE_DURATION_MS && parsed.data?.articles?.length > 0) {
          return {
            ...parsed.data,
            source: 'cache',
          };
        }
      }
    } catch (err) {
      console.warn('Failed to read articles cache:', err);
    }
  }

  try {
    // 2. Fetch live data from Saint Louis Hospital public API
    const [contentsRes, recommendRes, catRes] = await Promise.all([
      fetch(`${BASE_API}/contents?page=1&limit=30`, {
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch(`${BASE_API}/recommend_contents`, {
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null),
      fetch(`${BASE_API}/content_categories`, {
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null),
    ]);

    if (!contentsRes.ok) {
      throw new Error(`API responded with status ${contentsRes.status}`);
    }

    const contentsJson = await contentsRes.json();
    const rawItems: RawContentItem[] = contentsJson.data || [];

    let rawRecommend: RawContentItem[] = [];
    if (recommendRes && recommendRes.ok) {
      const recJson = await recommendRes.json();
      rawRecommend = recJson.data || [];
    }

    let categoriesList = ['ทั้งหมด'];
    if (catRes && catRes.ok) {
      const catJson = await catRes.json();
      const rawCats: Array<{ name_th: string }> = catJson.data || [];
      const catNames = rawCats.map((c) => c.name_th).filter(Boolean);
      categoriesList = ['ทั้งหมด', ...catNames];
    } else {
      const uniqueCats = Array.from(
        new Set(rawItems.map((item) => item.category?.name_th).filter(Boolean) as string[])
      );
      categoriesList = ['ทั้งหมด', ...uniqueCats];
    }

    // Determine featured article
    let featuredItem: ArticleItem;
    if (rawRecommend.length > 0) {
      featuredItem = transformRawToArticle(rawRecommend[0], true);
    } else if (rawItems.length > 0) {
      featuredItem = transformRawToArticle(rawItems[0], true);
    } else {
      featuredItem = FEATURED_ARTICLE;
    }

    // Transform article list (skip the featured one if duplicate)
    const articlesList: ArticleItem[] = rawItems
      .filter((item) => !featuredItem || item.id.toString() !== featuredItem.id.replace('slh-live-', ''))
      .map((item) => transformRawToArticle(item, false));

    const result: FetchArticlesResult = {
      featured: featuredItem,
      articles: articlesList.length > 0 ? articlesList : SAINT_LOUIS_ARTICLES,
      categories: categoriesList.length > 1 ? categoriesList : ['ทั้งหมด', 'บทความสุขภาพ', 'ข่าวสาร'],
      lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      source: 'live',
    };

    // Save to localStorage cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: result,
          })
        );
      } catch (e) {
        console.warn('Failed to save articles to localStorage', e);
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching live Saint Louis Hospital contents:', error);
    // Fallback to local curated data
    return {
      featured: FEATURED_ARTICLE,
      articles: SAINT_LOUIS_ARTICLES,
      categories: ['ทั้งหมด', 'สาระสุขภาพ', 'ข่าวสารและกิจกรรม', 'นวัตกรรมทางการแพทย์', 'ศูนย์เฉพาะทาง', 'โภชนาการและไลฟ์สไตล์'],
      lastUpdated: 'ออฟไลน์ (ข้อมูลสำรอง)',
      source: 'fallback',
    };
  }
}
