import React, { useState } from 'react';
import {
  CATEGORIES,
  FEATURED_PODCAST,
  LOGO_LIGHT,
  MORE_PODCAST_CARDS,
  PODCAST_CARDS,
} from '../data/podcasts';
import { PodcastItem, TransitionType } from '../types';

interface DiscoveryDashboardHealthMedProps {
  onNavigate: (to: 'healthmed' | 'dark', transition: TransitionType) => void;
  onPlayEpisode: (podcast: PodcastItem) => void;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export const DiscoveryDashboardHealthMed: React.FC<DiscoveryDashboardHealthMedProps> = ({
  onNavigate,
  onPlayEpisode,
  bookmarks,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'Browse' | 'Library' | 'Community'>('Library');

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
    <div
      id="discovery-dashboard-healthmed"
      className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased selection:bg-blue-600 selection:text-white"
    >
      {/* TopNavBar */}
      <nav
        id="healthmed-navbar"
        className="sticky top-0 z-40 bg-white border-b border-[#c3c6d7]/60 shadow-sm w-full backdrop-blur-md bg-opacity-95"
      >
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-16">
          {/* Brand - Parent of img[@alt='Louis PodCare Logo'] */}
          <div
            id="healthmed-brand-logo-container"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('dark', 'none')}
            title="Click to return to Dark Mode (none transition)"
          >
            <img
              alt="Louis PodCare Logo"
              className="h-10 w-10 object-contain rounded-full ring-2 ring-blue-600/20 group-hover:ring-blue-600/50 transition-all"
              src={LOGO_LIGHT}
            />
            <span className="text-[24px] leading-[32px] font-bold text-[#004ac6] hidden sm:block tracking-tight group-hover:text-blue-700 transition-colors">
              Louis PodCare
            </span>
          </div>

          {/* Navigation Links (Centered) */}
          <div id="healthmed-nav-links" className="hidden md:flex items-center gap-8 h-full">
            {/* Browse link -> Navigates to Dark Mode with push_back transition */}
            <a
              id="healthmed-nav-browse"
              className="h-full flex items-center text-[#434655] hover:text-[#004ac6] transition-colors font-semibold text-[14px] px-1 border-b-2 border-transparent hover:border-[#004ac6]"
              href="#browse"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('dark', 'push_back');
              }}
            >
              Browse
            </a>
            <a
              id="healthmed-nav-library"
              aria-current={activeTab === 'Library' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Library'
                  ? 'text-[#004ac6] border-[#004ac6]'
                  : 'text-[#434655] border-transparent hover:text-[#004ac6]'
              }`}
              href="#library"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('Library');
              }}
            >
              Library
            </a>
            <a
              id="healthmed-nav-community"
              className="h-full flex items-center text-[#434655] hover:text-[#004ac6] transition-colors font-semibold text-[14px] px-1 border-b-2 border-transparent hover:border-[#004ac6]"
              href="#community"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('Community');
              }}
            >
              Community
            </a>
          </div>

          {/* Search & Theme Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
                search
              </span>
              <input
                id="healthmed-search-input"
                className="pl-10 pr-4 h-10 bg-[#f2f4f6] border border-[#c3c6d7]/60 rounded-full text-[14px] text-[#191c1e] placeholder:text-[#737686] focus:ring-2 focus:ring-[#004ac6] focus:border-transparent w-60 lg:w-72 transition-all outline-none"
                placeholder="Search insights..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Switch to Dark Mode indicator */}
            <button
              id="healthmed-dark-mode-btn"
              onClick={() => onNavigate('dark', 'push_back')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition-colors"
              title="Return to Dark Mode (push_back)"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">dark_mode</span>
              <span className="hidden sm:inline">Dark View</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 pb-24">
        {/* Hero Section: Featured Podcast */}
        <section
          id="healthmed-hero-section"
          className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-[#c3c6d7]/60 flex flex-col md:flex-row group transition-all duration-300 hover:shadow-md"
        >
          {/* Thumbnail Side */}
          <div className="w-full md:w-3/5 h-64 md:h-[420px] relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt={FEATURED_PODCAST.imageAlt}
              style={{ backgroundImage: `url('${FEATURED_PODCAST.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/85 via-black/40 to-transparent flex items-end md:items-center p-6 md:p-8">
              <button
                id="healthmed-hero-play-button"
                aria-label="Play Featured Podcast"
                onClick={() => onPlayEpisode(FEATURED_PODCAST)}
                className="h-16 w-16 bg-[#004ac6] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-700 transition-all duration-200 ring-4 ring-blue-500/20 group-hover:ring-blue-500/40"
              >
                <span
                  className="material-symbols-outlined ml-1"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '32px' }}
                >
                  play_arrow
                </span>
              </button>
            </div>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-[#004ac6] flex items-center gap-1.5 border border-[#c3c6d7]/60 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-amber-500">star</span>
              <span>Featured</span>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center gap-4 bg-white">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-[#006c49] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">podcasts</span>
                <span>Podcast of the Week</span>
              </span>
              <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-bold text-[#191c1e] tracking-tight">
                {FEATURED_PODCAST.title}
              </h1>
            </div>

            <p className="text-[15px] leading-[24px] text-[#434655] line-clamp-3">
              {FEATURED_PODCAST.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e0e3e5]">
              <div className="flex items-center gap-4 text-[#46566c] text-[13px] font-medium">
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
                id="healthmed-hero-bookmark-btn"
                aria-label="Bookmark featured episode"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(FEATURED_PODCAST.id);
                }}
                className={`p-2 rounded-full transition-colors ${
                  bookmarks.has(FEATURED_PODCAST.id)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-[#434655] hover:text-[#004ac6] hover:bg-slate-100'
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
          id="healthmed-filter-chips"
          aria-label="Category filters"
          className="w-full flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`healthmed-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start flex-shrink-0 px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#004ac6] text-white shadow-sm font-semibold'
                    : 'bg-[#e0e3e5] hover:bg-blue-50 text-[#191c1e] hover:text-[#004ac6] border border-transparent hover:border-blue-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Content Grid */}
        <section
          id="healthmed-content-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCards.map((card) => {
            const isBookmarked = bookmarks.has(card.id);

            return (
              <article
                key={card.id}
                id={`healthmed-card-${card.id}`}
                onClick={() => onPlayEpisode(card)}
                className={`flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#c3c6d7]/60 group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
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
                  <div className="absolute bottom-2.5 right-2.5 bg-[#2d3133]/90 text-[#eff1f3] px-2.5 py-1 rounded-md text-[12px] font-medium backdrop-blur-sm">
                    {card.duration}
                  </div>
                  <div className="absolute top-2.5 left-2.5 bg-white/95 text-[#004ac6] px-2.5 py-1 rounded-md text-[12px] backdrop-blur-sm border border-[#c3c6d7]/50 font-semibold shadow-sm">
                    {card.category}
                  </div>
                  <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white drop-shadow text-[44px]">
                      play_circle
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow gap-2">
                  <h3 className="text-[20px] font-bold leading-[28px] text-[#191c1e] group-hover:text-[#004ac6] transition-colors line-clamp-2">
                    {card.title}
                  </h3>

                  {card.description && (
                    <p className="text-[14px] text-[#434655] line-clamp-2 mt-1">
                      {card.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e0e3e5]">
                    <div className="flex items-center gap-2 text-[#46566c] text-[13px] font-medium">
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
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-[#434655] hover:text-[#004ac6] hover:bg-slate-100'
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
            id="healthmed-load-more-btn"
            onClick={() => setShowMore((prev) => !prev)}
            className="px-8 py-3 rounded-full border border-[#004ac6] text-[#004ac6] font-semibold text-[14px] hover:bg-[#004ac6] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm"
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
