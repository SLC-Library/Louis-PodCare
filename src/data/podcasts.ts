import { PodcastItem } from '../types';

/**
 * Utility helper to extract YouTube Video ID from standard YouTube URLs or direct IDs
 */
export function extractYoutubeId(urlOrId?: string): string {
  if (!urlOrId) return '30bZ_1Z2e1A';
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
  
  // Auto YouTube thumbnail if not provided
  const imageUrl =
    item.imageUrl ||
    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80');

  const id =
    item.id ||
    (ytId ? `yt-${ytId}` : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

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
    description:
      item.description ||
      `Watch and listen to "${title}" curated by ${channel}. Available in high-definition video and audio streaming modes.`,
  };
}

// ==========================================
// 🌟 1. PODCAST OF THE WEEK (คลิปเด่นประจำสัปดาห์)
// ==========================================
export const FEATURED_PODCAST = createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=fts2xb0vd_c',
  title: 'เข้าใจ 3 ฮอร์โมนความสุข ก่อนจะเผลอติดกับดักความสุขแบบปลอม ๆ | On the way with Chom EP.37',
  category: 'Medical Tech',
  channel: 'SLC Medical',
  description: 'มาทำความเข้าใจกับ “พีระมิดแห่งความสุข” โดย “หมอกลาง นพ.ณัฐณกัณฑ์ พิชยะวงศ์ภัค” (ว. 44236) หรือ “พี่กลาง หอสมุดแห่งชาติ” ที่หลาย ๆ คนรู้จัก',
  duration: '35:53',
});

// ==========================================
// 📋 2. รายการวิดีโอ/พอดแคสต์ทั่วไป (ชุดหลัก)
// ==========================================
export const PODCAST_CARDS: PodcastItem[] = [
  createPodcast({
    id: 'genomic-sequencing',
    title: 'Advancements in Genomic Sequencing & Diagnostics',
    category: 'Medical Tech',
    institution: 'Mayo Clinic',
    duration: '12:30',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXPAkGM34_aBKxwrrxKO7bgCX5uQvYCcbT06oJ67gZFcf0Ad0zL1tyraNnMH0JJLLZ-x63m-7kNsjZ0af9ucDtcruF6pr1OEwDtArpkT6mrfoCOc3C7QEIJm0NsqiluuC9wi415MtMv62QQE9qOBOBSd0e0eKK5kTajfpe7RuveuFtMA7QPnJGGntLPlO_E83f1ekPcz7vZLa9WwAUjszekr-plCkzqabm5QubOyiD2DZ2EzxEyHkr',
    description: 'Exploring how long-read sequencing technologies are unlocking personalized therapies for rare inherited diseases.',
    youtubeId: 'YnZe2Gj_R_o',
  }),
  createPodcast({
    id: 'microbiome-mental-health',
    title: 'Microbiome Impact on Mental Health & Gut-Brain Axis',
    category: 'Nutrition',
    institution: 'Harvard Med',
    duration: '18:45',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzvKnXJPeL7Q8COUrXq20Qnyr6eTq4L1Obi_jJSj1r29zXKDjpLthQ9gwQYQj8p6GQ4MBs4miobA7KGPIrNVz0rItKCMG8Nw2UoGCfHfyaCElLyceG9LY_5oCB3XcuXdq7cOgXZRZX00pt9-TJjGee2BK7gpEQEzKPkSDtN-9fes3W5C96upkLJAHemInAq_vaM-gBwCnQRYM9_U5CbQm-kYVLeGMrRvl_Efcb4lmI77KROwyY4Is',
    description: 'New clinical insights into how the gut microbiota modulates neurochemistry, mood regulation, and cognitive resilience.',
    youtubeId: 'B9R148h0y_E',
  }),
  createPodcast({
    id: 'cognitive-behavioral-2024',
    title: 'Cognitive Behavioral Interventions in Digital Health',
    category: 'Psychology',
    institution: 'APA Journal',
    duration: '32:10',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWK89ryeqWTjNZmqkPBP22syw-zgdy0QqYXTAHeAaXV3B8t04pbOHxWcldzTjgsnjXBmh-F4Dqt5sVQdDsxH7L4A-x-pB_4hrDPX0HCQ9GRutzHcCEc7TKy-YGd-jplwrQ38VOyyzq9xyUUFQikcsfMbBilJmBgm1_cgHZz_PQHlBtyNce4q-kEHeGkny6_tCr7EO-OokvYfenIlPWyUDi45vl88sWeyJFnRH0Ld9LlGD-VXoP6vg',
    description: 'How digital CBT tools and mobile biofeedback empower patients dealing with generalized anxiety disorders.',
    youtubeId: 'W19Q3g1LDUo',
  }),
  createPodcast({
    id: 'patient-handoff-protocols',
    title: 'Optimizing Patient Handoff Protocols in Critical Care',
    category: 'Nursing',
    institution: 'Johns Hopkins',
    duration: '08:15',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBRovgBeCx59I1z68jVtE6P-YBO1DCrCYtA13y7z7NhbdCrDWCNKxIvlWF4kenk-daDrK7h3DttO0__UUyvRRqDMh32rw0boxarDA8uEPCateB6ukg_A9c2nAHfHh_Le_RihIIDyKu18UJEQhOvZ3W1Jv2Ep92mCCzgfdesK_Tm9ZtXpNRcHBNXcYvvgu9sHUwecydDTXiVaHmG-HlP5Wyr9HCebJqlq35XuHLhj-fozOPw1XJmrXv-',
    description: 'Standardized communication checklists that prevent diagnostic errors during emergency shift transitions.',
    youtubeId: 'v4E5oE1fF3M',
  }),
  createPodcast({
    id: 'immunotherapy-review',
    title: 'Targeted Immunotherapy: A Year in Review',
    category: 'Research',
    institution: 'Nature Medicine',
    duration: '55:00',
    description:
      'A comprehensive panel discussion with leading oncologists on the efficacy of recent CAR-T and checkpoint inhibitor trials.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB14NYz1oy7tUkjwU36q-U1nIlqVUcURgJdRRI7njfTXM46g-Rrf9rVUCKXS-t4Praq1ZTX86zmkST_z0F3qde2zUFVvFemLEIVZgSSNZ1PcmCwE7zZj2qY6dmkvKkA3gpa2HgfgMMpQel9JUwtIaz78b4pQwXuT7MAb20o6jdD2w8cB7N_W1O3AlTC_Ekapp7o_px5NAk-at5JHIHaMsw0qp7j-is646grg3b7Tt0DXIaDUGAKtuKK',
    span2: true,
    youtubeId: 'Ub_o06bQ8gE',
  }),
  createPodcast({
    id: 'arrhythmia-detection',
    title: 'Wearable Tech in Arrhythmia Detection & Prevention',
    category: 'Cardiology',
    institution: 'Cleveland Clinic',
    duration: '22:15',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAwpg57QloUdbhWVwdpOhswYuswt6zq-3Ts5eWD5VJV2Ia9y_HC-IJD2jGTbCFSXlamRSUBUFlwLMEpbbPo6dull6wKLIqV2FkdBYfl-l5hYqHniM1LW1qNquWZL9OKQBACVj8i3pD_WTAIFUw7hUyGrI8D0J7ucEJLLqgVORhIKvReqKbZueGjY9Xjlpkk517VnIttQttibrM8QKNxkuBTW8HO4ZpRlc12C1i_TO9lX657aZqBZod',
    description: 'Continuous smartwatch ECG monitoring and its impact on early atrial fibrillation diagnosis in outpatient care.',
    youtubeId: 'e8v3m32eMko',
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
  'Nutrition',
  'Psychology',
  'Medical Tech',
  'Nursing',
  'Research',
  'Oncology',
  'Cardiology',
];

export const LOGO_DARK =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBw-CRwoIgv7KsGLNjnVGRkpg-mNLqJ1EQgrkaC24oShondd0K-mrUdqOJ8inFZmstjbHO5TZ96IlLu143u2xeCGwqiryuSTBtocpVfuTKEqQMNNJkbbH7G1XsG3fN0Tx1iSupRrh1etmjDzrE31AufUT09o18--C-5QKCSD-SqmNS5vGGaKvFx3jSfwNgvJR1UjAxkYlYTyjyqdfJtr7OQT4vfVoA3WsDTpkpsJBcPMFuhey0b0pji1qV78raXP4E5w';

export const LOGO_LIGHT =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHcVAMeV1LWL7VHS1bSVDa3ZhZmATsAQ0UvC7cgeo6Qrlz08fdZ66Yz1rjtHu6A_zDC2OwxvTLFjY40rITno2LMGmQdb8HU2Rtu9OkhBc78WODqvwAHB3PfrTRCm8He6gqYhB2rS6K1jRsNxwSxf8ynx1IISlEowItVa-XyrC1tMIog6gCceGfc-pow_jzNjmHa24_yIB499_-3pBmui3qoLPmHpsv3MceLmejbbkYqM4O8T14trkBL9cIcIYypyd6Pg';
