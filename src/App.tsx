import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DiscoveryDashboardDark } from './components/DiscoveryDashboardDark';
import { DiscoveryDashboardHealthMed } from './components/DiscoveryDashboardHealthMed';
import { AudioPlayer } from './components/AudioPlayer';
import { PodcastItem, ScreenId, TransitionType } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dark');
  const [transitionType, setTransitionType] = useState<TransitionType>('push');
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);
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

  const handleNavigate = (to: ScreenId, transition: TransitionType) => {
    setTransitionType(transition);
    setCurrentScreen(to);
    window.scrollTo({ top: 0, behavior: transition === 'none' ? 'instant' : 'smooth' });
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

  // Clean fade transition between Dark and Light mode
  const getVariants = () => {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.18, ease: 'easeInOut' },
    };
  };

  const currentVariant = getVariants();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0f172a]">
      {/* Interactive Screen Container with Smooth Framer/Motion Transitions */}
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
              onPlayEpisode={(podcast) => setActivePodcast(podcast)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
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
              onPlayEpisode={(podcast) => setActivePodcast(podcast)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Audio Player if an episode is selected */}
      {activePodcast && (
        <AudioPlayer
          podcast={activePodcast}
          onClose={() => setActivePodcast(null)}
          isDark={currentScreen === 'dark'}
        />
      )}
    </div>
  );
}
