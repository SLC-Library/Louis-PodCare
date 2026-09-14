import { ArticleItem } from '../types';
import { SAINT_LOUIS_ARTICLES, FEATURED_ARTICLE } from '../data/articles';

const BASE_API = 'https://public-api.saintlouis.or.th/user-api';
const CACHE_KEY = 'slh_contents_cache_v3'; // เปลี่ยนเวอร์ชัน cache
const CACHE_DURATION_MS = 15 * 60 * 1000;

// ปรับคีย์เวิร์ดให้แคบลง Focus เฉพาะหัวข้อข่าวประกาศจริงๆ ไม่ตัดคำทั่วไปที่อาจเจอบ่อยในบทความ
const EXCLUDED_ANNOUNCEMENT_KEYWORDS = [
  'ปิดทำการ',
  'งดให้บริการ',
  'แจ้งปิด',
  'ประกาศปิด',
  'ตารางแพทย์งด',
  'วันหยุดราชการ',
  'ปิดบริการ',
  'ประกาศโรงพยาบาล',
  'ปิดระบบ',
  'งดรับ',
  'แจ้งเวลาเปิด-ปิด',
  'หยุดให้บริการ',
  'รับสมัครงาน',
  'ประกวดราคา',
  'จัดซื้อจัดจ้าง',
  'แจ้งย้ายแผนก',
  'แจ้งเปิดให้บริการ',
  'แจ้งหยุด',
  'ขออภัยในความไม่สะดวก'
];

function isKnowledgeArticle(item: RawContentItem): boolean {
  // เช็คเฉพาะ หัวข้อ (Topic) และ ชื่อหมวดหมู่ พอครับ ไม่ต้องเช็ค description เพื่อป้องกันการกรองบทความสุขภาพดีๆ ทิ้ง
  const text = `${item.topic_th || ''} ${item.topic_en || ''} ${item.category?.name_th || ''}`.toLowerCase();
  
  for (const kw of EXCLUDED_ANNOUNCEMENT_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      return false;
    }
  }
  return true;
}

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
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = months[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

function transformRawToArticle(raw: RawContentItem, isFeatured = false): ArticleItem {
  const title = raw.topic_th || raw.topic_en || 'บทความสุขภาพ โรงพยาบาลเซนต์หลุยส์';
  const summary = raw.description_th || raw.description_en || 'ข้อมูลสุขภาพและสาระความรู้ทางการแพทย์จากคณะแพทย์ โรงพยาบาลเซนต์หลุยส์';

  const coverTh = raw.covers?.find((c) => c.lang === 'th')?.media_uri;
  const coverAny = raw.covers?.[0]?.media_uri;
  const featureTh = raw.features?.find((f) => f.lang === 'th')?.media_uri;
  const featureAny = raw.features?.[0]?.media_uri;

  const imageUrl = coverTh || coverAny || featureTh || featureAny || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop';

  const catName = raw.category?.name_th || 'สาระสุขภาพ';

  let department = 'โรงพยาบาลเซนต์หลุยส์ (Saint Louis Hospital)';
  if (raw.clinics && raw.clinics.length > 0) {
    const cName = raw.clinics[0]?.clinic?.name_th || raw.clinics[0]?.name_th;
    if (cName) department = `${cName} รพ.เซนต์หลุยส์`;
  } else if (raw.clinic?.name_th) {
    department = `${raw.clinic.name_th} รพ.เซนต์หลุยส์`;
  }

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
    const recommendPromise = fetch(`${BASE_API}/recommend_contents`, {
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null);
    
    const catPromise = fetch(`${BASE_API}/content_categories`, {
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null);

    // ดึงทีละ Batch แบบ Parallel (เช่น รอบละ 5 หน้า หน้าละ 50 รายการ = 250 รายการ/Batch)
    const PAGE_SIZE = 50; 
    const BATCH_SIZE = 5; 
    const MAX_PAGES = 15; // ดึงสูงสุด 15 หน้า (รวมเป็น 750 รายการ)

    const rawAllItems: RawContentItem[] = [];

    for (let p = 1; p <= MAX_PAGES; p += BATCH_SIZE) {
      const pagePromises = [];
      for (let offset = 0; offset < BATCH_SIZE && (p + offset) <= MAX_PAGES; offset++) {
        const pageNum = p + offset;
        pagePromises.push(
          fetch(`${BASE_API}/contents?page=${pageNum}&limit=${PAGE_SIZE}`, {
            headers: { 'Content-Type': 'application/json' },
          }).then(res => res.ok ? res.json() : { data: [] }).catch(() => ({ data: [] }))
        );
      }

      const pagesResults = await Promise.all(pagePromises);
      let reachedEnd = false;

      for (const res of pagesResults) {
        const items: RawContentItem[] = res.data || [];
        rawAllItems.push(...items);
        if (items.length < PAGE_SIZE) {
          reachedEnd = true;
        }
      }

      if (reachedEnd) break; // ถ้าเจอหน้าที่ข้อมูลไม่เต็ม แปลว่าหมดแล้ว สั่งหยุดลูปใหญ่ทันที
    }

    const [recommendRes, catRes] = await Promise.all([recommendPromise, catPromise]);

    // กรองข้อมูลบทความ
    const rawItems: RawContentItem[] = rawAllItems.filter(isKnowledgeArticle);

    let rawRecommend: RawContentItem[] = [];
    if (recommendRes && recommendRes.ok) {
      const recJson = await recommendRes.json();
      const rawRecAll: RawContentItem[] = recJson.data || [];
      rawRecommend = rawRecAll.filter(isKnowledgeArticle);
    }

    let categoriesList = ['ทั้งหมด'];
    if (catRes && catRes.ok) {
      const catJson = await catRes.json();
      const rawCats: Array<{ name_th: string }> = catJson.data || [];
      const catNames = rawCats
        .map((c) => c.name_th)
        .filter((name) => Boolean(name) && !['ข่าวสาร', 'ข่าวประชาสัมพันธ์', 'ประกาศ', 'กิจกรรม'].includes(name));
      categoriesList = ['ทั้งหมด', ...catNames];
    } else {
      const uniqueCats = Array.from(
        new Set(
          rawItems
            .map((item) => item.category?.name_th)
            .filter((name) => Boolean(name) && !['ข่าวสาร', 'ข่าวประชาสัมพันธ์', 'ประกาศ', 'กิจกรรม'].includes(name as string)) as string[]
        )
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

    // Transform article list (ตัดรายการที่ซ้ำกับ featured)
    const articlesList: ArticleItem[] = rawItems
      .filter((item) => !featuredItem || item.id.toString() !== featuredItem.id.replace('slh-live-', ''))
      .map((item) => transformRawToArticle(item, false));

    const result: FetchArticlesResult = {
      featured: featuredItem,
      articles: articlesList.length > 0 ? articlesList : SAINT_LOUIS_ARTICLES,
      categories: categoriesList.length > 1 ? categoriesList : ['ทั้งหมด', 'สาระสุขภาพ', 'นวัตกรรมทางการแพทย์', 'ศูนย์เฉพาะทาง', 'โภชนาการและไลฟ์สไตล์', 'เวชศาสตร์เชิงป้องกัน'],
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
    return {
      featured: FEATURED_ARTICLE,
      articles: SAINT_LOUIS_ARTICLES,
      categories: ['ทั้งหมด', 'สาระสุขภาพ', 'นวัตกรรมทางการแพทย์', 'ศูนย์เฉพาะทาง', 'โภชนาการและไลฟ์สไตล์', 'เวชศาสตร์เชิงป้องกัน'],
      lastUpdated: 'ออฟไลน์ (ข้อมูลสำรอง)',
      source: 'fallback',
    };
  }
}
