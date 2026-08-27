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
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    new Set(['featured-ai-surgery', 'immunotherapy-review'])
  );

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
      return next;
    });
  };

  // Define transition animation variants based on transitionType
  const getVariants = () => {
    switch (transitionType) {
      case 'push':
        return {
          initial: { x: '100%', opacity: 1 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-30%', opacity: 0.7 },
          transition: { duration: 0.36, ease: [0.32, 0.72, 0, 1] },
        };
      case 'push_back':
        return {
          initial: { x: '-100%', opacity: 1 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0.7 },
          transition: { duration: 0.36, ease: [0.32, 0.72, 0, 1] },
        };
      case 'slide_up':
        return {
          initial: { y: '100%', opacity: 1 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '-15%', opacity: 0.8 },
          transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        };
      case 'none':
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
          transition: { duration: 0 },
        };
    }
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
