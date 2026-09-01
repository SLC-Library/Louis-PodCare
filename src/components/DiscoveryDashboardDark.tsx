import React, { useState, useEffect } from 'react';
import {
  CATEGORIES,
  FEATURED_PODCAST,
  isAudioOnlyPodcast,
  LOGO_DARK,
} from '../data/podcasts';
import { MediaMode, PodcastItem, TabId, TransitionType } from '../types';
import { SaintLouisCommunityHub } from './SaintLouisCommunityHub';
import { Footer } from './Footer';

interface DiscoveryDashboardDarkProps {
  onNavigate: (to: 'healthmed' | 'dark', transition: TransitionType) => void;
  onPlayEpisode: (podcast: PodcastItem, mode?: MediaMode) => void;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  podcasts: PodcastItem[];
  onOpenAdmin: () => void;
}

const PAGE_SIZE = 6;

export const DiscoveryDashboardDark: React.FC<DiscoveryDashboardDarkProps> = ({
  onNavigate,
  onPlayEpisode,
  bookmarks,
  onToggleBookmark,
  activeTab,
  onTabChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  podcasts,
  onOpenAdmin,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Reset pagination when category or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery]);

  // Dynamic categories including any custom ones added by admin
  const dynamicCategories = Array.from(
    new Set([
      'All',
      ...CATEGORIES.filter((c) => c !== 'All'),
      ...podcasts.map((p) => p.category).filter(Boolean),
    ])
  ) as string[];

  // All podcasts available for bookmarks/library
  const allAvailablePodcasts = [FEATURED_PODCAST, ...podcasts];

  // Bookmarked items list
  const bookmarkedItems = allAvailablePodcasts.filter((item) => item.id && bookmarks.has(item.id));

  // Filter bookmarked items
  const filteredBookmarks = bookmarkedItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((item.institution || item.channel || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter all cards (newest first from podcasts array)
  const filteredCards = podcasts.filter((card) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (card.category && card.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((card.institution || card.channel || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const displayedCards = filteredCards.slice(0, visibleCount);
  const hasMore = filteredCards.length > visibleCount;

  return (
    <div id="discovery-dashboard-dark" className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* TopNavBar */}
      <nav id="dark-navbar" className="sticky top-0 z-40 bg-[#060e20] border-b border-[#334155] shadow-md w-full backdrop-blur-md bg-opacity-95">
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-16">
          {/* Brand */}
          <div
            id="dark-brand-logo-container"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('Browse')}
            title="Louis PodCare Discovery • โดย SLC Library วิทยาลัยเซนต์หลุยส์"
          >
            <img
              alt="Louis PodCare Logo"
              className="h-10 w-10 object-contain rounded-full ring-2 ring-blue-500/20 group-hover:ring-blue-500/60 transition-all"
              src={LOGO_DARK}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[20px] sm:text-[22px] leading-tight font-bold text-[#3b82f6] tracking-tight group-hover:text-blue-400 transition-colors">
                  Louis PodCare
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  SLC Library
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
                โดย ห้องสมุด วิทยาลัยเซนต์หลุยส์
              </span>
            </div>
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
                onTabChange('Browse');
              }}
            >
              Browse
            </a>
            <a
              id="dark-nav-library"
              aria-current={activeTab === 'Library' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Library'
                  ? 'text-[#3b82f6] border-[#3b82f6]'
                  : 'text-[#cbd5e1] border-transparent hover:text-[#3b82f6]'
              }`}
              href="#library"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('Library');
              }}
            >
              Library
              {bookmarkedItems.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {bookmarkedItems.length}
                </span>
              )}
            </a>
            <a
              id="dark-nav-community"
              aria-current={activeTab === 'Community' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Community'
                  ? 'text-[#3b82f6] border-[#3b82f6]'
                  : 'text-[#cbd5e1] border-transparent hover:text-[#3b82f6]'
              }`}
              href="#health-articles"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('Community');
              }}
            >
              Health Articles
            </a>
          </div>

          {/* Search, Admin & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[20px]">
                search
              </span>
              <input
                id="dark-search-input"
                className="pl-10 pr-4 h-10 bg-[#131b2e] border border-[#334155] rounded-full text-[14px] text-[#f8fafc] placeholder:text-[#64748b] focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-48 lg:w-64 transition-all outline-none"
                placeholder={activeTab === 'Library' ? "ค้นหาใน Library..." : "ค้นหาตอน, หัวข้อ, ช่อง..."}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Admin Panel Button */}
            <button
              id="dark-admin-btn"
              onClick={onOpenAdmin}
              className="h-10 px-3.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="เปิดแผงควบคุม Admin จัดการตอนพอดแคสต์"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="font-bold">Admin</span>
            </button>

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
        {/* ================= LIBRARY VIEW (DARK) ================= */}
        {activeTab === 'Library' && (
          <div id="dark-library-view" className="flex flex-col gap-6">
            {/* Library Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#060e20] p-6 md:p-8 rounded-2xl border border-[#334155] shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bookmark
                  </span>
                  <h1 className="text-[26px] md:text-[30px] font-bold text-[#f8fafc] tracking-tight">
                    Your Library
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 ml-2">
                    {bookmarkedItems.length} Saved {bookmarkedItems.length === 1 ? 'Episode' : 'Episodes'}
                  </span>
                </div>
                <p className="text-[15px] text-[#cbd5e1]">
                  รายการวิดีโอและพอดแคสต์ทางการแพทย์ที่คุณได้กด Bookmark บันทึกไว้เพื่อศึกษาและรับชมย้อนหลัง
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onTabChange('Browse')}
                  className="px-4 py-2 rounded-full border border-blue-500 text-blue-400 hover:bg-blue-500/10 font-medium text-[13px] flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span>Explore More</span>
                </button>
              </div>
            </div>

            {/* Filter Chips for Library */}
            {bookmarkedItems.length > 0 && (
              <section
                id="dark-library-filter-chips"
                aria-label="Library category filters"
                className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x"
              >
                {CATEGORIES.map((cat) => {
                  const countInCat =
                    cat === 'All'
                      ? bookmarkedItems.length
                      : bookmarkedItems.filter((i) => i.category.toLowerCase() === cat.toLowerCase()).length;
                  if (cat !== 'All' && countInCat === 0) return null;
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      id={`dark-library-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => onCategoryChange(cat)}
                      className={`snap-start flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20 font-semibold'
                          : 'bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] hover:text-[#3b82f6] border border-[#334155]'
                      }`}
                    >
                      {cat} ({countInCat})
                    </button>
                  );
                })}
              </section>
            )}

            {/* Empty State */}
            {bookmarkedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 bg-[#060e20] rounded-2xl border border-[#334155] shadow-lg my-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">bookmark_border</span>
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">ยังไม่มีรายการที่บันทึกไว้</h3>
                <p className="text-slate-400 max-w-md mb-6 text-sm">
                  คุณสามารถกดที่ไอคอน Bookmark บนวิดีโอหรือพอดแคสต์ที่น่าสนใจในหน้าค้นพบ เพื่อบันทึกมาไว้ดูในคลังความรู้ส่วนตัวของคุณ
                </p>
                <button
                  onClick={() => onTabChange('Browse')}
                  className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span>ค้นหาวิดีโอและพอดแคสต์</span>
                </button>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="text-center p-12 bg-[#060e20] rounded-2xl border border-[#334155]">
                <p className="text-slate-300 font-medium">ไม่พบรายการที่ตรงกับการค้นหา "{searchQuery}"</p>
                <button
                  onClick={() => {
                    onSearchQueryChange('');
                    onCategoryChange('All');
                  }}
                  className="mt-3 text-sm text-blue-400 underline font-medium"
                >
                  ล้างตัวกรองการค้นหา
                </button>
              </div>
            ) : (
              /* Bookmarked Grid (Dark) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((card) => {
                  const isAudio = isAudioOnlyPodcast(card);

                  return (
                    <article
                      key={card.id}
                      id={`dark-library-card-${card.id}`}
                      className="flex flex-col bg-[#060e20] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-[#334155] group transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40"
                    >
                      <div
                        className="relative w-full aspect-video cursor-pointer"
                        onClick={() => onPlayEpisode(card)}
                      >
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-alt={card.imageAlt}
                          src={card.imageUrl}
                          alt={card.title}
                        />
                        <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white px-2.5 py-1 rounded-md text-[12px] font-medium backdrop-blur-sm">
                          {card.duration}
                        </div>
                        {/* Format Badge (YouTube vs Spotify) */}
                        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[12px] backdrop-blur-sm border font-semibold flex items-center gap-1 max-w-[80%] truncate ${
                          isAudio
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                            : 'bg-[#060e20]/90 text-red-300 border-red-500/30'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {isAudio ? 'podcasts' : 'smart_display'}
                          </span>
                          <span className="truncate">{isAudio ? 'Spotify Podcast' : (card.institution || card.channel)}</span>
                        </div>

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayEpisode(card);
                            }}
                            className={`px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transform hover:scale-105 transition-all ${
                              isAudio
                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/40'
                                : 'bg-red-600 hover:bg-red-500 shadow-red-600/40'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'play_arrow'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียง (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                        <div className="flex flex-col gap-2">
                          <h3
                            onClick={() => onPlayEpisode(card)}
                            className="text-[17px] sm:text-[18px] font-bold leading-[25px] text-[#f8fafc] group-hover:text-[#3b82f6] transition-colors line-clamp-2 cursor-pointer tracking-tight"
                          >
                            {card.title}
                          </h3>

                          {card.description && (
                            <p className="text-[13.5px] leading-[22px] text-[#94a3b8] line-clamp-2">
                              {card.description}
                            </p>
                          )}
                        </div>

                        {/* Dedicated Media Action Button */}
                        <div className="pt-1">
                          <button
                            onClick={() => onPlayEpisode(card)}
                            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                              isAudio
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'movie'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียงพอดแคสต์ (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#334155]/60 mt-auto">
                          <div className="flex items-center gap-2 text-[#94a3b8] text-[13px] font-medium">
                            <span className="material-symbols-outlined text-[16px] text-blue-400">
                              {card.institutionIcon}
                            </span>
                            <span className="text-slate-300 font-medium text-xs">{card.category}</span>
                          </div>
                          <button
                            aria-label={`Remove ${card.title} from library`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(card.id);
                            }}
                            className="p-1.5 rounded-full transition-colors text-blue-400 bg-blue-500/10 hover:bg-red-500/20 hover:text-red-400"
                            title="Remove from saved library"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              bookmark
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= COMMUNITY & SAINT LOUIS ARTICLES VIEW (DARK) ================= */}
        {activeTab === 'Community' && (
          <SaintLouisCommunityHub
            theme="dark"
            onExplorePodcasts={() => onTabChange('Browse')}
          />
        )}

        {/* ================= BROWSE VIEW (DARK) ================= */}
        {activeTab === 'Browse' && (
          <>
            {/* Hero Section: Featured Podcast */}
            <section
              id="dark-hero-section"
              className="Hero Section relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#060e20] border border-[#334155] flex flex-col md:flex-row group transition-all duration-300 hover:border-blue-500/50"
            >
              {/* Thumbnail Side */}
              <div
                className="w-full md:w-3/5 h-64 md:h-[420px] relative overflow-hidden cursor-pointer"
                onClick={() => onPlayEpisode(FEATURED_PODCAST)}
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  data-alt={FEATURED_PODCAST.imageAlt}
                  style={{ backgroundImage: `url('${FEATURED_PODCAST.imageUrl}')` }}
                />

                {/* Gentle Default Gradient & Subtle Play Hint when not hovered */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#060e20]/80 via-transparent to-transparent flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-red-600/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </div>
                </div>

                {/* Hover Overlay: Shows Video Selection */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    id="hero-play-video-button"
                    aria-label="Play Featured Video"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayEpisode(FEATURED_PODCAST);
                    }}
                    className="h-14 sm:h-16 px-8 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-red-500/30 font-bold text-base"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}
                    >
                      play_arrow
                    </span>
                    <span>ดูวิดีโอ (Watch on YouTube)</span>
                  </button>
                </div>

                <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white flex items-center gap-1.5 border border-red-400/40 z-10 shadow-lg">
                  <span className="material-symbols-outlined text-[16px]">smart_display</span>
                  <span>Featured YouTube Episode</span>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center gap-4 bg-[#060e20]">
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] text-[#34d399] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">podcasts</span>
                    <span>Podcast & Video of the Week</span>
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
              {dynamicCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`dark-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onCategoryChange(cat)}
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
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-[#060e20] rounded-2xl border border-slate-800 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">search_off</span>
                <h3 className="text-lg font-bold text-white mb-1">ไม่พบรายการพอดแคสต์ที่ตรงกับเงื่อนไข</h3>
                <p className="text-sm text-slate-400 max-w-md mb-4">
                  ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นหารายการที่ต้องการ
                </p>
                <button
                  onClick={() => {
                    onCategoryChange('All');
                    onSearchQueryChange('');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <section
                id="dark-content-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayedCards.map((card) => {
                  const isBookmarked = bookmarks.has(card.id);
                  const isAudio = isAudioOnlyPodcast(card);

                  return (
                    <article
                      key={card.id}
                      id={`dark-card-${card.id}`}
                      className={`flex flex-col bg-[#060e20] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-[#334155] group transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 ${
                        card.span2 ? 'lg:col-span-2' : ''
                      }`}
                    >
                      <div
                        className={`relative w-full cursor-pointer overflow-hidden ${card.span2 ? 'h-48 md:h-64' : 'aspect-video'}`}
                        onClick={() => onPlayEpisode(card)}
                      >
                        {isAudio ? (
                          <div className="relative w-full h-full bg-[#030712] flex items-center justify-center overflow-hidden">
                            {/* Ambient blurred backdrop for Spotify podcast */}
                            <img
                              className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-35"
                              src={card.imageUrl}
                              alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-black/40" />
                            {/* Complete square cover art presented in natural proportion */}
                            <img
                              className="relative z-10 h-full max-w-full aspect-square object-contain rounded-md shadow-2xl group-hover:scale-105 transition-transform duration-500"
                              data-alt={card.imageAlt}
                              src={card.imageUrl}
                              alt={card.title}
                            />
                          </div>
                        ) : (
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt={card.imageAlt}
                            src={card.imageUrl}
                            alt={card.title}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (card.youtubeId && !target.src.includes('hqdefault')) {
                                target.src = `https://img.youtube.com/vi/${card.youtubeId}/hqdefault.jpg`;
                              }
                            }}
                          />
                        )}
                        <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white px-2.5 py-1 rounded-md text-[12px] font-medium backdrop-blur-sm z-10">
                          {card.duration}
                        </div>
                        
                        {/* Format Badge (YouTube vs Spotify) */}
                        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[12px] backdrop-blur-sm border font-semibold flex items-center gap-1 max-w-[75%] truncate z-10 ${
                          isAudio
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-md'
                            : 'bg-[#060e20]/90 text-red-300 border-red-500/30'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {isAudio ? 'podcasts' : 'smart_display'}
                          </span>
                          <span className="truncate">{isAudio ? 'Spotify Podcast' : (card.institution || card.channel)}</span>
                        </div>

                        {/* Center Hover Action */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayEpisode(card);
                            }}
                            className={`px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transform hover:scale-105 transition-all ${
                              isAudio
                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/40'
                                : 'bg-red-600 hover:bg-red-500 shadow-red-600/40'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'play_arrow'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียง (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                        <div className="flex flex-col gap-2">
                          <h3
                            onClick={() => onPlayEpisode(card)}
                            className="text-[17px] sm:text-[18px] font-bold leading-[25px] text-[#f8fafc] group-hover:text-[#3b82f6] transition-colors line-clamp-2 cursor-pointer tracking-tight"
                          >
                            {card.title}
                          </h3>

                          {card.description && (
                            <p className="text-[13.5px] leading-[22px] text-[#94a3b8] line-clamp-2">
                              {card.description}
                            </p>
                          )}
                        </div>

                        {/* Single Clear Action Button */}
                        <div className="pt-1">
                          <button
                            onClick={() => onPlayEpisode(card)}
                            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                              isAudio
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'movie'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียงพอดแคสต์ (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#334155]/60 mt-auto">
                          <div className="flex items-center gap-2 text-[#94a3b8] text-[13px] font-medium">
                            <span className="material-symbols-outlined text-[16px] text-blue-400">
                              {card.institutionIcon}
                            </span>
                            <span className="text-slate-300 font-medium text-xs">{card.category}</span>
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
                                : 'text-[#cbd5e1] hover:text-[#3b82f6] hover:bg-[#1e293b]'
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
            )}

            {/* Pagination / Load More Button */}
            {filteredCards.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                {hasMore ? (
                  <button
                    id="dark-load-more-btn"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[14px] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-102 active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[20px]">expand_circle_down</span>
                    <span>
                      โหลดเพิ่มเติม (แสดงอีก {Math.min(PAGE_SIZE, filteredCards.length - visibleCount)} จาก {filteredCards.length} ตอน)
                    </span>
                  </button>
                ) : filteredCards.length > PAGE_SIZE ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#060e20] px-4 py-2 rounded-full border border-slate-800">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                    <span>แสดงครบทั้งหมด {filteredCards.length} ตอนแล้ว</span>
                    <button
                      onClick={() => setVisibleCount(PAGE_SIZE)}
                      className="ml-2 text-blue-400 hover:underline"
                    >
                      ย่อกลับ
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </main>

      {/* SLC Library & Saint Louis College Footer */}
      <Footer theme="dark" />
    </div>
  );
};
