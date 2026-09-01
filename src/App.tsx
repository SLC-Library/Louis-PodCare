import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DiscoveryDashboardDark } from './components/DiscoveryDashboardDark';
import { DiscoveryDashboardHealthMed } from './components/DiscoveryDashboardHealthMed';
import { AudioPlayer } from './components/AudioPlayer';
import { MediaMode, PodcastItem, ScreenId, TabId, TransitionType } from './types';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Louis PodCare ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-amber-400 text-5xl">warning</span>
            <h2 className="text-xl font-bold">เกิดข้อผิดพลาดในการโหลดหน้าเว็บ</h2>
            <p className="text-sm text-slate-300">
              {this.state.error?.message || 'ระบบกำลังกู้คืนข้อมูล กรุณากดปุ่มเพื่อรีเฟรชหน้า'}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('louis_podcare_bookmarks');
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg transition-all"
            >
              รีเฟรชและเริ่มใหม่
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dark');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [activeTab, setActiveTab] = useState<TabId>('Browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePodcast, setActivePodcast] = useState<PodcastItem | null>(null);
  const [activeMediaMode, setActiveMediaMode] = useState<MediaMode>('video');

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

  return (
    <ErrorBoundary>
      <div className={`relative min-h-screen overflow-x-hidden ${currentScreen === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        {/* Interactive Screen Container with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {currentScreen === 'dark' ? (
            <motion.div
              key="screen-dark"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.15 }}
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
              />
            </motion.div>
          ) : (
            <motion.div
              key="screen-healthmed"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.15 }}
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
              />
            </motion.div>
          )}
        </AnimatePresence>

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
    </ErrorBoundary>
  );
}
