import { PodcastItem } from '../types';

export const FEATURED_PODCAST: PodcastItem = {
  id: 'featured-ai-surgery',
  title: 'The Future of AI in Modern Surgery',
  category: 'Medical Tech',
  categorySlug: 'medical-tech',
  institution: 'Johns Hopkins / SLC Medical',
  institutionIcon: 'podcasts',
  duration: '45 mins',
  date: 'Oct 12, 2023',
  description:
    'Dr. Sarah Chen discusses how machine learning algorithms are revolutionizing robotic-assisted surgeries, reducing recovery times, and predicting postoperative complications with unprecedented accuracy.',
  imageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHYhv6PjmKisaZb3T9tBeGn2d48CC8a-UkZIM887de4ZvZHGB4KMy0VZhFLU79rAK3FKSegu2aeNNDnjD1bUb9cH2TKLgDDJo5wSLz4z4hJw4W1NwBYYGNKdiOB7U3aY9Ai6UUzCh6zi756jWF992fiDOXTfAxqEswJ_oK9-8OTphKpPdqhdf51LmPvE1sBxCjgRD300OmRuEp4cJ_KaHgsaZFrpZiTGlO_xhRqzTCvajTa1DR0tH0',
  imageAlt:
    'A highly cinematic, wide-angle shot of a glowing holographic brain floating above a sleek, modern surgical operating table. The room is dark, illuminated by the bright, electric blue glow of the hologram and subtle green LED indicators from surrounding medical tech equipment.',
};

export const PODCAST_CARDS: PodcastItem[] = [
  {
    id: 'genomic-sequencing',
    title: 'Advancements in Genomic Sequencing',
    category: 'Medical Tech',
    categorySlug: 'medical-tech',
    institution: 'Mayo Clinic',
    institutionIcon: 'local_hospital',
    duration: '12:30',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXPAkGM34_aBKxwrrxKO7bgCX5uQvYCcbT06oJ67gZFcf0Ad0zL1tyraNnMH0JJLLZ-x63m-7kNsjZ0af9ucDtcruF6pr1OEwDtArpkT6mrfoCOc3C7QEIJm0NsqiluuC9wi415MtMv62QQE9qOBOBSd0e0eKK5kTajfpe7RuveuFtMA7QPnJGGntLPlO_E83f1ekPcz7vZLa9WwAUjszekr-plCkzqabm5QubOyiD2DZ2EzxEyHkr',
    imageAlt:
      'A macro photography shot of a DNA double helix model illuminated by bright, clean white and subtle deep blue lights.',
  },
  {
    id: 'microbiome-mental-health',
    title: 'Microbiome Impact on Mental Health',
    category: 'Nutrition',
    categorySlug: 'nutrition',
    institution: 'Harvard Med',
    institutionIcon: 'school',
    duration: '18:45',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzvKnXJPeL7Q8COUrXq20Qnyr6eTq4L1Obi_jJSj1r29zXKDjpLthQ9gwQYQj8p6GQ4MBs4miobA7KGPIrNVz0rItKCMG8Nw2UoGCfHfyaCElLyceG9LY_5oCB3XcuXdq7cOgXZRZX00pt9-TJjGee2BK7gpEQEzKPkSDtN-9fes3W5C96upkLJAHemInAq_vaM-gBwCnQRYM9_U5CbQm-kYVLeGMrRvl_Efcb4lmI77KROwyY4Is',
    imageAlt:
      'A minimalist flat lay of colorful, geometric nutritional supplements and fresh green leafy vegetables on a pristine white marble surface.',
  },
  {
    id: 'cognitive-behavioral-2024',
    title: 'Cognitive Behavioral Interventions in 2024',
    category: 'Psychology',
    categorySlug: 'psychology',
    institution: 'APA Journal',
    institutionIcon: 'psychology',
    duration: '32:10',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWK89ryeqWTjNZmqkPBP22syw-zgdy0QqYXTAHeAaXV3B8t04pbOHxWcldzTjgsnjXBmh-F4Dqt5sVQdDsxH7L4A-x-pB_4hrDPX0HCQ9GRutzHcCEc7TKy-YGd-jplwrQ38VOyyzq9xyUUFQikcsfMbBilJmBgm1_cgHZz_PQHlBtyNce4q-kEHeGkny6_tCr7EO-OokvYfenIlPWyUDi45vl88sWeyJFnRH0Ld9LlGD-VXoP6vg',
    imageAlt:
      "A close-up shot of a therapist's hands taking notes on a modern tablet with a stylus, while a patient sits comfortably in the background.",
  },
  {
    id: 'patient-handoff-protocols',
    title: 'Optimizing Patient Handoff Protocols',
    category: 'Nursing',
    categorySlug: 'nursing',
    institution: 'Johns Hopkins',
    institutionIcon: 'health_and_safety',
    duration: '08:15',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBRovgBeCx59I1z68jVtE6P-YBO1DCrCYtA13y7z7NhbdCrDWCNKxIvlWF4kenk-daDrK7h3DttO0__UUyvRRqDMh32rw0boxarDA8uEPCateB6ukg_A9c2nAHfHh_Le_RihIIDyKu18UJEQhOvZ3W1Jv2Ep92mCCzgfdesK_Tm9ZtXpNRcHBNXcYvvgu9sHUwecydDTXiVaHmG-HlP5Wyr9HCebJqlq35XuHLhj-fozOPw1XJmrXv-',
    imageAlt:
      'A dynamic shot of a modern hospital corridor bathed in natural sunlight. A nurse in crisp blue scrubs is looking at a digital chart.',
  },
  {
    id: 'immunotherapy-review',
    title: 'Targeted Immunotherapy: A Year in Review',
    category: 'Research',
    categorySlug: 'research',
    institution: 'Nature Medicine',
    institutionIcon: 'science',
    duration: '55:00',
    description:
      'A comprehensive panel discussion with leading oncologists on the efficacy of recent immunotherapy trials.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB14NYz1oy7tUkjwU36q-U1nIlqVUcURgJdRRI7njfTXM46g-Rrf9rVUCKXS-t4Praq1ZTX86zmkST_z0F3qde2zUFVvFemLEIVZgSSNZ1PcmCwE7zZj2qY6dmkvKkA3gpa2HgfgMMpQel9JUwtIaz78b4pQwXuT7MAb20o6jdD2w8cB7N_W1O3AlTC_Ekapp7o_px5NAk-at5JHIHaMsw0qp7j-is646grg3b7Tt0DXIaDUGAKtuKK',
    imageAlt:
      'A wide, stunning photograph of a state-of-the-art oncology research center with high-tech centrifuges.',
    span2: true,
  },
  {
    id: 'arrhythmia-detection',
    title: 'Wearable Tech in Arrhythmia Detection',
    category: 'Cardiology',
    categorySlug: 'cardiology',
    institution: 'Cleveland Clinic',
    institutionIcon: 'monitor_heart',
    duration: '22:15',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAwpg57QloUdbhWVwdpOhswYuswt6zq-3Ts5eWD5VJV2Ia9y_HC-IJD2jGTbCFSXlamRSUBUFlwLMEpbbPo6dull6wKLIqV2FkdBYfl-l5hYqHniM1LW1qNquWZL9OKQBACVj8i3pD_WTAIFUw7hUyGrI8D0J7ucEJLLqgVORhIKvReqKbZueGjY9Xjlpkk517VnIttQttibrM8QKNxkuBTW8HO4ZpRlc12C1i_TO9lX657aZqBZod',
    imageAlt:
      'An abstract, high-resolution rendering of a human heart constructed from luminous digital nodes and wireframes.',
  },
];

export const MORE_PODCAST_CARDS: PodcastItem[] = [
  {
    id: 'crispr-therapeutics',
    title: 'CRISPR Therapeutics in Rare Pediatric Conditions',
    category: 'Research',
    categorySlug: 'research',
    institution: 'Stanford Health Care',
    institutionIcon: 'biotech',
    duration: '28:40',
    imageUrl:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Biochemical laboratory analysis of genetic structures',
  },
  {
    id: 'neuroplasticity-rehab',
    title: 'Neuroplasticity Protocols in Post-Stroke Rehabilitation',
    category: 'Psychology',
    categorySlug: 'psychology',
    institution: 'Massachusetts General',
    institutionIcon: 'psychology',
    duration: '35:20',
    imageUrl:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Medical imaging scan depicting neural connectivity',
  },
  {
    id: 'telehealth-pediatrics',
    title: 'Digital Diagnostics and Telehealth in Rural Pediatrics',
    category: 'Nursing',
    categorySlug: 'nursing',
    institution: 'Emory Healthcare',
    institutionIcon: 'health_and_safety',
    duration: '19:15',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Pediatric specialist reviewing digital diagnostics',
  },
];

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
