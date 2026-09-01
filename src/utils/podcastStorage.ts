import { PodcastItem } from '../types';
import { createPodcast, FEATURED_PODCAST, PODCAST_CARDS } from '../data/podcasts';

const STORAGE_KEY = 'louis_podcare_custom_podcasts_v2';

export const INITIAL_EPISODES: PodcastItem[] = [
  ...PODCAST_CARDS,
];

/**
 * Load episodes from localStorage, or return default initial list
 */
export function loadSavedEpisodes(): PodcastItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => createPodcast(item));
      }
    }
  } catch (err) {
    console.error('Error loading custom podcasts from localStorage:', err);
  }
  return INITIAL_EPISODES.map((item) => createPodcast(item));
}

/**
 * Save episodes to localStorage
 */
export function saveEpisodesToStorage(episodes: PodcastItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
  } catch (err) {
    console.error('Error saving custom podcasts to localStorage:', err);
  }
}

/**
 * Reset episodes back to system defaults
 */
export function resetEpisodesToDefault(): PodcastItem[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing custom podcasts from localStorage:', err);
  }
  return INITIAL_EPISODES.map((item) => createPodcast(item));
}
