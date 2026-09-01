import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DiscoveryDashboardDark } from './components/DiscoveryDashboardDark';
import { DiscoveryDashboardHealthMed } from './components/DiscoveryDashboardHealthMed';
import { AudioPlayer } from './components/AudioPlayer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { MediaMode, PodcastItem, ScreenId, TabId, TransitionType } from './types';
import {
  loadSavedEpisodes,
  saveEpisodesToStorage,
  resetEpisodesToDefault,
} from './utils/podcastStorage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dark');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [activeTab, setActiveTab] = useState<TabId>('Browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);
  const [activeMediaMode, setActiveMediaMode] = useState<MediaMode>('video');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Dynamic podcasts stored in localStorage
  const [podcasts, setPodcasts] = useState<PodcastItem[]>(() => loadSavedEpisodes());

  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('louis_podcare_bookmarks');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
    return new Set(['featured-ai-surgery', 'immunotherapy-review']);
  });

  const handleNavigate = (to: ScreenId, transition: TransitionType = 'none') => {
    setTransitionType(transition);
    setCurrentScreen(to);
  };

  const handlePlayEpisode = (podcast: PodcastItem, mode: MediaMode = 'video') => {
    setActiveMediaMode(mode);
    setActivePodcast(podcast);
  };

  const handleSaveEpisodes = (newEpisodes: PodcastItem[]) => {
    setPodcasts(newEpisodes);
    saveEpisodesToStorage(newEpisodes);
  };

  const handleResetDefault = () => {
    const defaults = resetEpisodesToDefault();
    setPodcasts(defaults);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('louis_podcare_bookmarks', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Clean, gentle fade transition between Dark and Light mode
  const getVariants = () => {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.16, ease: 'easeInOut' },
    };
  };

  const currentVariant = getVariants();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0f172a]">
      {/* Interactive Screen Container with Smooth Transitions */}
      <AnimatePresence mode="wait" initial={false}>
        {currentScreen === 'dark' ? (
          <motion.div
            key="screen-dark"
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={currentVariant.transition}
            className="w-full min-h-screen"
          >
            <DiscoveryDashboardDark
              onNavigate={handleNavigate}
              onPlayEpisode={handlePlayEpisode}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              podcasts={podcasts}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="screen-healthmed"
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={currentVariant.transition}
            className="w-full min-h-screen"
          >
            <DiscoveryDashboardHealthMed
              onNavigate={handleNavigate}
              onPlayEpisode={handlePlayEpisode}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              podcasts={podcasts}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        podcasts={podcasts}
        onSaveEpisodes={handleSaveEpisodes}
        onResetDefault={handleResetDefault}
        isDark={currentScreen === 'dark'}
      />

      {/* Persistent Media Player (Video / Audio) if an episode is selected */}
      {activePodcast && (
        <AudioPlayer
          podcast={activePodcast}
          initialMode={activeMediaMode}
          onClose={() => setActivePodcast(null)}
          isDark={currentScreen === 'dark'}
        />
      )}
    </div>
  );
}
