import { PodcastItem } from '../types';

/**
 * Utility helper to extract YouTube Video ID from standard YouTube URLs or direct IDs
 */
export function extractYoutubeId(urlOrId?: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  // If already an ID (11 chars without slash)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  // Try matching standard YouTube URL patterns
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : trimmed;
}

/**
 * Utility helper to extract Spotify Embed URL, Type, and ID from any format:
 * - Standard Web URL: https://open.spotify.com/episode/5wXPC18ZP8Ztn5VZ1XOghv
 * - Embed URL: https://open.spotify.com/embed/episode/5wXPC18ZP8Ztn5VZ1XOghv
 * - Full <iframe> Code: <iframe src="https://open.spotify.com/embed/episode/5wXPC18ZP8Ztn5VZ1XOghv..." ...></iframe>
 * - Spotify URI: spotify:episode:5wXPC18ZP8Ztn5VZ1XOghv
 */
export function extractSpotifyInfo(input?: string): {
  type?: 'episode' | 'show' | 'track' | 'playlist';
  id?: string;
  embedUrl?: string;
  webUrl?: string;
} | null {
  if (!input) return null;
  const raw = input.trim();

  // If iframe code, extract src attribute
  let target = raw;
  const srcMatch = raw.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    target = srcMatch[1];
  }

  // Regex matching episode, show, track, playlist
  const match = target.match(
    /(?:open\.spotify\.com\/(?:embed\/)?|spotify:)(episode|show|track|playlist)[/:]([a-zA-Z0-9]+)/i
  );

  if (match && match[1] && match[2]) {
    const type = match[1].toLowerCase() as 'episode' | 'show' | 'track' | 'playlist';
    const id = match[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`,
      webUrl: `https://open.spotify.com/${type}/${id}`,
    };
  }

  // If it's a genre or general spotify url
  if (target.includes('spotify.com')) {
    return {
      webUrl: target,
    };
  }

  return null;
}

/**
 * Auto-select an appropriate Material Symbol icon based on the category name
 */
export function getCategoryIcon(category?: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('cardio') || cat.includes('heart')) return 'monitor_heart';
  if (cat.includes('nutri') || cat.includes('food') || cat.includes('diet')) return 'restaurant';
  if (cat.includes('psycho') || cat.includes('mental') || cat.includes('brain')) return 'psychology';
  if (cat.includes('nurs') || cat.includes('care')) return 'health_and_safety';
  if (cat.includes('onco') || cat.includes('cancer')) return 'biotech';
  if (cat.includes('research') || cat.includes('science')) return 'science';
  if (cat.includes('surg') || cat.includes('robot') || cat.includes('tech')) return 'precision_manufacturing';
  if (cat.includes('hospital') || cat.includes('clinic')) return 'local_hospital';
  if (cat.includes('general') || cat.includes('health') || cat.includes('disease')) return 'medical_services';
  return 'podcasts';
}

/**
 * ⚡ Smart Podcast Creator / Normalizer
 * ให้คุณใส่ข้อมูลเพียงเล็กน้อย เช่น YouTube URL, Title, Category, Channel
 * ระบบจะเติม ID, รูปปกจาก YouTube (HQ), วันที่, ไอคอน และค่าอื่นๆ ให้อัตโนมัติ!
 */
export function createPodcast(item: PodcastItem): PodcastItem {
  const ytId = extractYoutubeId(item.youtubeId || item.youtubeUrl);
  const title = item.title || 'Medical Episode';
  const category = item.category || 'Medical Tech';
  const channel = item.institution || item.channel || 'SLC Medical';
  
  // Extract Spotify Information if available
  const rawSpotify = item.spotifyEmbedUrl || item.spotifyUrl;
  const spotifyInfo = extractSpotifyInfo(rawSpotify);
  const spotifyEmbedUrl = item.spotifyEmbedUrl || spotifyInfo?.embedUrl;
  const spotifyUrl = item.spotifyUrl || spotifyInfo?.webUrl || rawSpotify;

  // Auto YouTube thumbnail if not provided (prefer maxresdefault for true 16:9 widescreen without black letterbox bars)
  const imageUrl =
    item.imageUrl ||
    (ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80');

  const id =
    item.id ||
    (ytId
      ? `yt-${ytId}`
      : spotifyInfo?.id
      ? `spotify-${spotifyInfo.id}`
      : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

  return {
    ...item,
    id,
    title,
    category,
    categorySlug: item.categorySlug || category.toLowerCase().replace(/\s+/g, '-'),
    institution: channel,
    channel: channel,
    institutionIcon: item.institutionIcon || getCategoryIcon(category),
    duration: item.duration || '20 mins',
    date: item.date || 'Latest',
    imageUrl,
    imageAlt: item.imageAlt || title,
    youtubeId: ytId,
    youtubeUrl: item.youtubeUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined),
    spotifyUrl,
    spotifyEmbedUrl,
    description:
      item.description ||
      `Watch and listen to "${title}" curated by ${channel}. Available in high-definition video and audio streaming modes.`,
  };
}

/**
 * Utility helper to determine if an item is a Spotify Audio Podcast
 */
export function isAudioOnlyPodcast(item: PodcastItem): boolean {
  return !item.youtubeId && (!item.youtubeUrl || item.youtubeUrl.length === 0) && (!!item.spotifyUrl || !!item.audioUrl);
}

// ==========================================
// 🌟 1. PODCAST OF THE WEEK (คลิปเด่นประจำสัปดาห์)
// ==========================================
export const FEATURED_PODCAST = createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=fts2xb0vd_c',
  title: 'เข้าใจ 3 ฮอร์โมนความสุข ก่อนจะเผลอติดกับดักความสุขแบบปลอม ๆ | On the way with Chom EP.37',
  category: 'Psychology',
  channel: 'LifeDot',
  description: 'มาทำความเข้าใจกับ “พีระมิดแห่งความสุข” โดย “หมอกลาง นพ.ณัฐณกัณฑ์ พิชยะวงศ์ภัค” (ว. 44236) หรือ “พี่กลาง หอสมุดแห่งชาติ” ที่หลาย ๆ คนรู้จัก',
  duration: '35:53',
  date: 'Nov 24, 2025',
});

// ==========================================
// 📋 2. รายการวิดีโอ/พอดแคสต์ทั่วไป (ชุดหลัก)
// ==========================================
export const PODCAST_CARDS: PodcastItem[] = [
  
  createPodcast({
    youtubeUrl: 'https://www.youtube.com/watch?v=7geqNRcIpEI&t=713s',
    title: 'งดแป้ง งดน้ำตาล อาจทำให้สุขภาพพัง! เป็นมะเร็ง โรคไต ห้ามกินอะไรบ้าง I Doctor’s Talk EP.33',
    category: 'Nutrition & Diet',
    channel: 'Zerosick',
    description: 'Doctor’s Talk คือ Podcast ที่หมอและผู้เชี่ยวชาญทางด้านสุขภาพจะมาพูดคุยประเด็นสุขภาพต่างๆ ใน EP นี้ หมอจิมมี่ นพ. สุทธิพจน์ ภัทรมงคลกาล (ว.55103) และ พญ.วีรนุช โรจน์ยินดีเลิศ (ว.34250) อายุรแพทย์ชำนาญการด้านโภชนศาสตร์คลินิก จะมาให้ความรู้เกี่ยวกับความเชื่อที่หลายคนเข้าใจผิด กินคลีน กินน้ำมันมะพร้าว งดแป้ง งดน้ำตาล สุขภาพอาจพังไม่รู้ตัว เพราะจริงๆ แล้ว น้ำตาลดีต่อสุขภาพ ถ้าอยากแข็งแรง ไม่เสี่ยงมะเร็งต้องกินอะไร หรือถ้าเป็นมะเร็ง โรคไต ห้ามกินอะไรบ้าง EP นี้ ห้ามพลาด!',
    duration: '47:37',
    date: 'AUG 14, 2025',
  }),
  createPodcast({
    youtubeUrl: 'https://www.youtube.com/watch?v=PlJLsNmxyxY&t=4663s',
    title: 'หมอโอ๊ค Lifestyle Medicine 6 กฎสุขภาพดี | Health is the New Wealth EP.8',
    category: 'General Health',
    channel: 'THE SECRET SAUCE',
    description: 'Health is the New Wealth เอพิโสดนี้ ชวนหมอโอ๊ค-สมิทธิ์ อารยะสกุล มาอัปเดตเทรนด์การแพทย์เพื่อสุขภาพฉบับล่าสุดที่ส่งตรงจากฮาร์วาร์ด ‘Lifestyle Medicine’ 6 กฎการเปลี่ยนพฤติกรรม สร้างวิถีชีวิตใหม่ที่จะเปลี่ยนชีวิตให้ดีขึ้นตลอดกาล',
    duration: '1:31:59',
    date: 'JUN 9, 2024',
  }),
  createPodcast({
    youtubeUrl: 'https://www.youtube.com/watch?v=zlbDZPwpgBA',
    title: '8 วิธีดูแลใจให้สดใส ผ่านเรื่องราวใจร้าย ความคิดลบๆไปได้ไวขึ้น 💗 | Peanut Butter',
    category: 'Psychology',
    channel: 'Peanut Butter',
    description: 'Mental Health กับการที่เราต้องเจอ 1 วัน 1000 Situation 😂 ทั้งใจดีหรือใจร้ายหลากหลายเรื่องราวผสมกันไป เลยอยากมาออกกำลังทางใจเพื่อลดแรงปะทะค่ะ (ส่วนเราก็ไม่ได้เป็นคนใจ Tough ขนาดนั้น เป็นผู้หญิงใจบอบบางเหมือนกัน) จะฝึกไปด้วยกันนี้แหล่ะฮึบๆๆ',
    duration: '16:53',
    date: 'OCT 26, 2024',
  }),
  createPodcast({
    id: '001',
    title: 'เราจะรู้ว่าตับของเราเริ่มเสื่อมได้หรือไม่? | 6 Minute Health Talk EP.14',
    category: 'General Health',
    channel: '6 Minute Health Talk',
    description: 'วันนี้เป็น Ep. ที่มาจากคำถามบน Tiktok ที่มีคนถามเกี่ยวกับการทำงานของตับ เราสามารถรู้ได้หรือไม่ว่า ตับของเราเริ่มเสื่อม หรือทำงานได้น้อยลง ? มีสัญญาณหรืออาการเริ่มต้นอะไรบ้างไหมที่ให้เรารู้ตัวก่อน ? มาฟังคำตอบจากพี่หมอเอ้ว ใน 6 Minute Health Talk EP.14 กันค่ะ',
    duration: '06:03',
    spotifyUrl: 'https://open.spotify.com/episode/2ciyGBc1YPAGuI6lEAThUT',
    imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1f6658ce0ba0ebe3074a703940',
  }),
  createPodcast({
    id: '002',
    title: 'น้ําตาลในเลือดสูง อาการเป็นยังไง? | หมอแบงค์ Food Doctor',
    category: 'Nutrition & Diet',
    channel: 'หมอแบงค์ Food Doctor',
    description: 'น้ำตาลในเลือดสูง อาการเป็นยังไง | หมอแบงค์ food doctor',
    duration: '08:43',
    spotifyUrl: 'https://open.spotify.com/episode/38JiRhu1B8vY1VhE7b0rWH',
    imageUrl: 'https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1f5353bffe2566cbd5f328391e',
  }),
  createPodcast({
    id: '003',
    title: 'Living Well EP.25 | ทำความรู้จัก"นาฬิกาชีวิต"เคล็ดลับปรับสมดุลร่างกาย',
    category: 'General Health',
    channel: 'Living Well',
    description: 'รู้หรือไม่ว่า คนเราไม่ได้มีนาฬิกาบอกเวลาอยู่แค่บนข้อมือ หรือในอุปกรณ์อิเล็กทรอนิกส์ต่าง ๆ เท่านั้น แต่เรายังมีนาฬิกาชีวิตที่ติดตัวมาตั้งแต่กำเนิด ที่เป็นเครื่องบอกเวลาให้ร่างกายทำสิ่งต่าง ๆ ให้เป็นปกติได้ ไม่ว่าจะเป็นการตื่นนอน รับประทานอาหาร หรือนอนหลับพักผ่อน มากกว่านั้นยังมีส่วนสำคัญในการเสริมสร้างความแข็งแรงให้กับร่างกายอีกด้วย เมื่อนาฬิกาเรือนนี้มีความสำคัญอย่างมากในการดูแลและสร้างสมดุลให้กับร่างกายโดยรวมของเรา คุณหมอโง้ย พจ.จิดาภา ช่วยชู แพทย์แผนจีน โรงพยาบาลดีบุก อยากชวนทุกคนมาเช็กเวลาบนนาฬิกาชีวิต ได้ใน LIVING WELL PODCAST EP.25 มารับฟังไปพร้อม ๆ กันเลยค่ะ',
    duration: '05:40',
    spotifyUrl: 'https://open.spotify.com/episode/5wQUC3IYffBjoOkrT09msK',
    imageUrl: 'https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1f169cd8f34b8f7a6104527518',
  }),
];

// ==========================================
// ➕ 3. รายการวิดีโอเพิ่มเติม (กด Load More)
// ==========================================
export const MORE_PODCAST_CARDS: PodcastItem[] = [
  createPodcast({
    id: 'crispr-therapeutics',
    title: 'CRISPR Therapeutics in Rare Pediatric Conditions',
    category: 'Research',
    institution: 'Stanford Health Care',
    duration: '28:40',
    imageUrl:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    description: 'How in-vivo gene editing is moving from clinical trials into approved first-line therapies for rare metabolic disorders.',
    youtubeId: 'UKbrwLDnNIY',
  }),
  createPodcast({
    id: 'neuroplasticity-rehab',
    title: 'Neuroplasticity Protocols in Post-Stroke Rehabilitation',
    category: 'Psychology',
    institution: 'Massachusetts General',
    duration: '35:20',
    imageUrl:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    description: 'Combining non-invasive brain stimulation with repetitive task training for motor recovery in stroke survivors.',
    youtubeId: 'ELpfYCZa87g',
  }),
  createPodcast({
    id: 'telehealth-pediatrics',
    title: 'Digital Diagnostics and Telehealth in Rural Pediatrics',
    category: 'Nursing',
    institution: 'Emory Healthcare',
    duration: '19:15',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    description: 'Deploying connected otoscopes, digital stethoscopes, and high-speed telemetry to rural community clinics.',
    youtubeId: '7R5_b8V3X_Q',
  }),
];

export const ALL_PODCASTS: PodcastItem[] = [
  FEATURED_PODCAST,
  ...PODCAST_CARDS,
  ...MORE_PODCAST_CARDS,
];

// ==========================================
// 🏷️ 4. หมวดหมู่สำหรับตัวกรอง (CATEGORIES)
// ==========================================
export const CATEGORIES = [
  'All',
  'Nutrition & Diet',
  'Psychology',
  'Medical Tech',
  'Nursing',
  'General Health',
  'Research',
  'Oncology',
  'Cardiology',
];

export const LOGO_DARK =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBw-CRwoIgv7KsGLNjnVGRkpg-mNLqJ1EQgrkaC24oShondd0K-mrUdqOJ8inFZmstjbHO5TZ96IlLu143u2xeCGwqiryuSTBtocpVfuTKEqQMNNJkbbH7G1XsG3fN0Tx1iSupRrh1etmjDzrE31AufUT09o18--C-5QKCSD-SqmNS5vGGaKvFx3jSfwNgvJR1UjAxkYlYTyjyqdfJtr7OQT4vfVoA3WsDTpkpsJBcPMFuhey0b0pji1qV78raXP4E5w';

export const LOGO_LIGHT =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHcVAMeV1LWL7VHS1bSVDa3ZhZmATsAQ0UvC7cgeo6Qrlz08fdZ66Yz1rjtHu6A_zDC2OwxvTLFjY40rITno2LMGmQdb8HU2Rtu9OkhBc78WODqvwAHB3PfrTRCm8He6gqYhB2rS6K1jRsNxwSxf8ynx1IISlEowItVa-XyrC1tMIog6gCceGfc-pow_jzNjmHa24_yIB499_-3pBmui3qoLPmHpsv3MceLmejbbkYqM4O8T14trkBL9cIcIYypyd6Pg';
