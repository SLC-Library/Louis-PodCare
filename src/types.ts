export type ScreenId = 'dark' | 'healthmed';

export type TabId = 'Browse' | 'Library' | 'Community';

export type TransitionType = 'push' | 'push_back' | 'slide_up' | 'none';

export type MediaMode = 'video' | 'audio';

export interface PodcastItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  institution: string;
  institutionIcon: string;
  duration: string;
  date?: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  span2?: boolean;
  audioUrl?: string;
  youtubeId?: string;
  youtubeUrl?: string;
}

