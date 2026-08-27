import React, { useState } from 'react';
import {
  CATEGORIES,
  FEATURED_PODCAST,
  LOGO_DARK,
  MORE_PODCAST_CARDS,
  PODCAST_CARDS,
} from '../data/podcasts';
import { PodcastItem, TransitionType } from '../types';

interface DiscoveryDashboardDarkProps {
  onNavigate: (to: 'healthmed' | 'dark', transition: TransitionType) => void;
  onPlayEpisode: (podcast: PodcastItem) => void;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export const DiscoveryDashboardDark: React.FC<DiscoveryDashboardDarkProps> = ({
  onNavigate,
  onPlayEpisode,
  bookmarks,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'Browse' | 'Library' | 'Community'>('Browse');

  const allCards = showMore ? [...PODCAST_CARDS, ...MORE_PODCAST_CARDS] : PODCAST_CARDS;

  const filteredCards = allCards.filter((card) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      card.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="discovery-dashboard-dark" className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* TopNavBar */}
      <nav id="dark-navbar" className="sticky top-0 z-40 bg-[#060e20] border-b border-[#334155] shadow-md w-full backdrop-blur-md bg-opacity-95">
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-16">
          {/* Brand */}
          <div
            id="dark-brand-logo-container"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('dark', 'none')}
            title="Louis PodCare Discovery"
          >
            <img
              alt="Louis PodCare Logo"
              className="h-10 w-10 object-contain rounded-full ring-2 ring-blue-500/20 group-hover:ring-blue-500/60 transition-all"
              src={LOGO_DARK}
            />
            <span className="text-[24px] leading-[32px] font-bold text-[#3b82f6] hidden sm:block tracking-tight group-hover:text-blue-400 transition-colors">
              Louis PodCare
            </span>
          </div>

          {/* Navigation Links (Centered) */}
          <div id="dark-nav-links" className="hidden md:flex items-center gap-8 h-full">
            <a
              id="dark-nav-browse"
              aria-current={activeTab === 'Browse' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Browse'
                  ? 'text-[#3b82f6] border-[#3b82f6]'
                  : 'text-[#cbd5e1] border-transparent hover:text-[#3b82f6]'
              }`}
              href="#browse"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('Browse');
              }}
            >
              Browse
            </a>
            <a
              id="dark-nav-library"
              className="h-full flex items-center text-[#cbd5e1] hover:text-[#3b82f6] transition-colors font-semibold text-[14px] px-1 border-b-2 border-transparent"
              href="#library"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('healthmed', 'push');
              }}
            >
              Library
            </a>
            <a
              id="dark-nav-community"
              className="h-full flex items-center text-[#cbd5e1] hover:text-[#3b82f6] transition-colors font-semibold text-[14px] px-1 border-b-2 border-transparent"
              href="#community"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('healthmed', 'push');
              }}
            >
              Community
            </a>
          </div>

          {/* Search & Theme Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[20px]">
                search
              </span>
              <input
                id="dark-search-input"
                className="pl-10 pr-4 h-10 bg-[#131b2e] border border-[#334155] rounded-full text-[14px] text-[#f8fafc] placeholder:text-[#64748b] focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-60 lg:w-72 transition-all outline-none"
                placeholder="Search insights..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Toggle to Light Mode */}
            <button
              id="dark-mode-toggle-btn"
              onClick={() => onNavigate('healthmed', 'none')}
              className="w-10 h-10 rounded-full bg-[#1e293b] hover:bg-[#334155] text-amber-400 hover:text-amber-300 flex items-center justify-center border border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Switch to Light Mode"
              aria-label="Switch to Light Mode"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                light_mode
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 pb-24">
        {/* Hero Section: Featured Podcast */}
        <section
          id="dark-hero-section"
          className="Hero Section relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#060e20] border border-[#334155] flex flex-col md:flex-row group transition-all duration-300 hover:border-blue-500/50"
        >
          {/* Thumbnail Side */}
          <div className="w-full md:w-3/5 h-64 md:h-[420px] relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt={FEATURED_PODCAST.imageAlt}
              style={{ backgroundImage: `url('${FEATURED_PODCAST.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#060e20] via-[#060e20]/60 to-transparent flex items-end md:items-center p-6 md:p-8">
              {/* Play button that triggers slide_up navigation to HealthMed according to spec */}
              <button
                id="hero-play-button"
                aria-label="Play Featured Podcast"
                onClick={() => {
                  onPlayEpisode(FEATURED_PODCAST);
                  onNavigate('healthmed', 'slide_up');
                }}
                className="h-16 w-16 bg-primary bg-[#3b82f6] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-blue-500 transition-all duration-200 ring-4 ring-blue-500/30 group-hover:ring-blue-500/60"
              >
                <span
                  className="material-symbols-outlined ml-1"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '32px' }}
                >
                  play_arrow
                </span>
              </button>
            </div>
            <div className="absolute top-4 left-4 bg-[#0f172a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-[#3b82f6] flex items-center gap-1.5 border border-[#334155]">
              <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
              <span>Featured</span>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center gap-4 bg-[#060e20]">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-[#34d399] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">podcasts</span>
                <span>Podcast of the Week</span>
              </span>
              <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-bold text-[#f8fafc] tracking-tight">
                {FEATURED_PODCAST.title}
              </h1>
            </div>

            <p className="text-[15px] leading-[24px] text-[#cbd5e1] line-clamp-3">
              {FEATURED_PODCAST.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#334155]">
              <div className="flex items-center gap-4 text-[#94a3b8] text-[13px] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{FEATURED_PODCAST.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">today</span>
                  <span>{FEATURED_PODCAST.date}</span>
                </div>
              </div>
              <button
                id="hero-bookmark-btn"
                aria-label="Bookmark featured episode"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(FEATURED_PODCAST.id);
                }}
                className={`p-2 rounded-full transition-colors ${
                  bookmarks.has(FEATURED_PODCAST.id)
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-[#cbd5e1] hover:text-[#3b82f6] hover:bg-[#1e293b]'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: bookmarks.has(FEATURED_PODCAST.id)
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                >
                  {bookmarks.has(FEATURED_PODCAST.id) ? 'bookmark' : 'bookmark_add'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Filter Chips */}
        <section
          id="dark-filter-chips"
          aria-label="Category filters"
          className="w-full flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start flex-shrink-0 px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] hover:text-[#3b82f6] border border-[#334155]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Content Grid */}
        <section
          id="dark-content-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCards.map((card) => {
            const isGenomic = card.id === 'genomic-sequencing';
            const isBookmarked = bookmarks.has(card.id);

            return (
              <article
                key={card.id}
                id={`card-${card.id}`}
                onClick={() => {
                  if (isGenomic) {
                    // Specific navigation transition defined in spec
                    onNavigate('healthmed', 'push');
                  } else {
                    onPlayEpisode(card);
                  }
                }}
                className={`flex flex-col bg-[#060e20] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-[#334155] group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 ${
                  card.span2 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className={`relative w-full ${card.span2 ? 'h-48 md:h-64' : 'aspect-video'}`}>
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-alt={card.imageAlt}
                    src={card.imageUrl}
                    alt={card.title}
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white px-2.5 py-1 rounded-md text-[12px] font-medium backdrop-blur-sm">
                    {card.duration}
                  </div>
                  <div className="absolute top-2.5 left-2.5 bg-[#060e20]/90 px-2.5 py-1 rounded-md text-[12px] text-[#3b82f6] backdrop-blur-sm border border-[#334155] font-semibold">
                    {card.category}
                  </div>
                  <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white/90 drop-shadow text-[44px]">
                      play_circle
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow gap-2">
                  <h3 className="text-[20px] font-bold leading-[28px] text-[#f8fafc] group-hover:text-[#3b82f6] transition-colors line-clamp-2">
                    {card.title}
                  </h3>

                  {card.description && (
                    <p className="text-[14px] text-[#cbd5e1] line-clamp-2 mt-1">
                      {card.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#334155]">
                    <div className="flex items-center gap-2 text-[#94a3b8] text-[13px] font-medium">
                      <span className="material-symbols-outlined text-[16px]">
                        {card.institutionIcon}
                      </span>
                      <span>{card.institution}</span>
                    </div>
                    <button
                      aria-label={`Bookmark ${card.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(card.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        isBookmarked
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-[#94a3b8] hover:text-[#3b82f6] hover:bg-[#1e293b]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        {isBookmarked ? 'bookmark' : 'bookmark_add'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Load More Button */}
        <div className="flex justify-center mt-4">
          <button
            id="dark-load-more-btn"
            onClick={() => setShowMore((prev) => !prev)}
            className="px-8 py-3 rounded-full border border-[#3b82f6] text-[#3b82f6] font-semibold text-[14px] hover:bg-[#3b82f6] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25"
          >
            <span>{showMore ? 'Show Fewer Insights' : 'Load More Insights'}</span>
            <span
              className={`material-symbols-outlined text-[18px] transition-transform ${
                showMore ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};
