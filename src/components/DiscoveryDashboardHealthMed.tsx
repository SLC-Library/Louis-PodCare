import React, { useState, useEffect } from 'react';
import {
  CATEGORIES,
  FEATURED_PODCAST,
  isAudioOnlyPodcast,
  LOGO_LIGHT,
} from '../data/podcasts';
import { MediaMode, PodcastItem, TabId, TransitionType } from '../types';
import { SaintLouisCommunityHub } from './SaintLouisCommunityHub';
import { Footer } from './Footer';

interface DiscoveryDashboardHealthMedProps {
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

export const DiscoveryDashboardHealthMed: React.FC<DiscoveryDashboardHealthMedProps> = ({
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
    <div id="discovery-dashboard-healthmed" className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* TopNavBar */}
      <nav id="healthmed-navbar" className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 shadow-sm w-full backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-16">
          {/* Brand */}
          <div
            id="healthmed-brand-logo-container"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('Browse')}
            title="Louis PodCare Discovery • โดย SLC Library วิทยาลัยเซนต์หลุยส์"
          >
            <img
              alt="Louis PodCare Logo"
              className="h-10 w-10 object-contain rounded-full ring-2 ring-blue-600/20 group-hover:ring-blue-600/50 transition-all"
              src={LOGO_LIGHT}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[20px] sm:text-[22px] leading-tight font-bold text-blue-600 tracking-tight group-hover:text-blue-700 transition-colors">
                  Louis PodCare
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  SLC Library
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                โดย ห้องสมุด วิทยาลัยเซนต์หลุยส์
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div id="healthmed-nav-links" className="hidden md:flex items-center gap-8 h-full">
            <a
              id="healthmed-nav-browse"
              aria-current={activeTab === 'Browse' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Browse'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-blue-600'
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
              id="healthmed-nav-library"
              aria-current={activeTab === 'Library' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Library'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-blue-600'
              }`}
              href="#library"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('Library');
              }}
            >
              Library
              {bookmarkedItems.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] bg-blue-100 text-blue-700 font-bold border border-blue-200">
                  {bookmarkedItems.length}
                </span>
              )}
            </a>
            <a
              id="healthmed-nav-community"
              aria-current={activeTab === 'Community' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Community'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-blue-600'
              }`}
              href="#community"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('Community');
              }}
            >
              Community
            </a>
          </div>

          {/* Search, Admin & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                id="healthmed-search-input"
                className="pl-10 pr-4 h-10 bg-slate-100 border border-slate-200 rounded-full text-[14px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent w-48 lg:w-64 transition-all outline-none"
                placeholder={activeTab === 'Library' ? "ค้นหาใน Library..." : "ค้นหาตอน, หัวข้อ, ช่อง..."}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Admin Panel Button */}
            <button
              id="healthmed-admin-btn"
              onClick={onOpenAdmin}
              className="h-10 px-3.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="เปิดแผงควบคุม Admin จัดการตอนพอดแคสต์"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="font-bold">Admin</span>
            </button>

            {/* Toggle to Dark Mode */}
            <button
              id="healthmed-mode-toggle-btn"
              onClick={() => onNavigate('dark', 'none')}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Switch to Dark Mode"
              aria-label="Switch to Dark Mode"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                dark_mode
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 pb-24">
        {/* ================= LIBRARY VIEW (LIGHT) ================= */}
        {activeTab === 'Library' && (
          <div id="healthmed-library-view" className="flex flex-col gap-6">
            {/* Library Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bookmark
                  </span>
                  <h1 className="text-[26px] md:text-[30px] font-bold text-slate-900 tracking-tight">
                    Your Library
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 ml-2">
                    {bookmarkedItems.length} Saved {bookmarkedItems.length === 1 ? 'Episode' : 'Episodes'}
                  </span>
                </div>
                <p className="text-[15px] text-slate-600">
                  รายการวิดีโอและพอดแคสต์ทางการแพทย์ที่คุณได้กด Bookmark บันทึกไว้เพื่อศึกษาและรับชมย้อนหลัง
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onTabChange('Browse')}
                  className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium text-[13px] flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span>Explore More</span>
                </button>
              </div>
            </div>

            {/* Filter Chips for Library */}
            {bookmarkedItems.length > 0 && (
              <section
                id="healthmed-library-filter-chips"
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
                      id={`healthmed-library-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => onCategoryChange(cat)}
                      className={`snap-start flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200'
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
              <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm my-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">bookmark_border</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">ยังไม่มีรายการที่บันทึกไว้</h3>
                <p className="text-slate-500 max-w-md mb-6 text-sm">
                  คุณสามารถกดที่ไอคอน Bookmark บนวิดีโอหรือพอดแคสต์ที่น่าสนใจในหน้าค้นพบ เพื่อบันทึกมาไว้ดูในคลังความรู้ส่วนตัวของคุณ
                </p>
                <button
                  onClick={() => onTabChange('Browse')}
                  className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span>ค้นหาวิดีโอและพอดแคสต์</span>
                </button>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium">ไม่พบรายการที่ตรงกับการค้นหา "{searchQuery}"</p>
                <button
                  onClick={() => {
                    onSearchQueryChange('');
                    onCategoryChange('All');
                  }}
                  className="mt-3 text-sm text-blue-600 underline font-medium"
                >
                  ล้างตัวกรองการค้นหา
                </button>
              </div>
            ) : (
              /* Bookmarked Grid (Light) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((card) => {
                  const isAudio = isAudioOnlyPodcast(card);

                  return (
                    <article
                      key={card.id}
                      id={`healthmed-library-card-${card.id}`}
                      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 group transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40"
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
                        <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white px-2.5 py-1 rounded-md text-[12px] font-medium backdrop-blur-sm">
                          {card.duration}
                        </div>
                        {/* Media Format Badge */}
                        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[12px] backdrop-blur-sm border font-semibold shadow-xs flex items-center gap-1 max-w-[75%] truncate ${
                          isAudio
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white/95 text-red-600 border-slate-200'
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
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'play_arrow'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียง (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow gap-2">
                        <h3
                          onClick={() => onPlayEpisode(card)}
                          className="text-[19px] font-bold leading-[26px] text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                        >
                          {card.title}
                        </h3>

                        {card.description && (
                          <p className="text-[14px] text-slate-600 line-clamp-2 mt-1">
                            {card.description}
                          </p>
                        )}

                        {/* Single Action Button */}
                        <div className="mt-2">
                          <button
                            onClick={() => onPlayEpisode(card)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                              isAudio
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'movie'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียงพอดแคสต์ (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                            <span className="material-symbols-outlined text-[16px] text-blue-600">
                              {card.institutionIcon}
                            </span>
                            <span className="text-slate-700 font-medium">{card.category}</span>
                          </div>
                          <button
                            aria-label={`Remove ${card.title} from library`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(card.id);
                            }}
                            className="p-1.5 rounded-full transition-colors text-blue-600 bg-blue-50 hover:bg-red-50 hover:text-red-600"
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

        {/* ================= COMMUNITY & SAINT LOUIS ARTICLES VIEW (LIGHT) ================= */}
        {activeTab === 'Community' && (
          <SaintLouisCommunityHub
            theme="light"
            onExplorePodcasts={() => onTabChange('Browse')}
          />
        )}

        {/* ================= BROWSE VIEW (LIGHT) ================= */}
        {activeTab === 'Browse' && (
          <>
            {/* Hero Section: Featured Podcast */}
            <section
              id="healthmed-hero-section"
              className="Hero Section relative w-full rounded-2xl overflow-hidden shadow-xl bg-white border border-slate-200 flex flex-col md:flex-row group transition-all duration-300 hover:border-blue-400"
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
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-red-600/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </div>
                </div>

                {/* Hover Overlay: Shows Video Selection */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    id="healthmed-hero-play-video-button"
                    aria-label="Play Featured Video"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayEpisode(FEATURED_PODCAST);
                    }}
                    className="h-14 sm:h-16 px-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-red-500/30 font-bold text-base"
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

                <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white flex items-center gap-1.5 border border-red-300/40 shadow-md z-10">
                  <span className="material-symbols-outlined text-[16px]">smart_display</span>
                  <span>Featured YouTube Episode</span>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center gap-4 bg-white">
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] text-emerald-700 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">podcasts</span>
                    <span>Podcast & Video of the Week</span>
                  </span>
                  <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-bold text-slate-900 tracking-tight">
                    {FEATURED_PODCAST.title}
                  </h1>
                </div>

                <p className="text-[15px] leading-[24px] text-slate-600 line-clamp-3">
                  {FEATURED_PODCAST.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-slate-500 text-[13px] font-medium">
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
                        : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
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
              {dynamicCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`healthmed-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onCategoryChange(cat)}
                    className={`snap-start flex-shrink-0 px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </section>

            {/* Content Grid */}
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">search_off</span>
                <h3 className="text-lg font-bold text-slate-800 mb-1">ไม่พบรายการพอดแคสต์ที่ตรงกับเงื่อนไข</h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นหารายการที่ต้องการ
                </p>
                <button
                  onClick={() => {
                    onCategoryChange('All');
                    onSearchQueryChange('');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-xs"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <section
                id="healthmed-content-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayedCards.map((card) => {
                  const isBookmarked = bookmarks.has(card.id);
                  const isAudio = isAudioOnlyPodcast(card);

                  return (
                    <article
                      key={card.id}
                      id={`healthmed-card-${card.id}`}
                      className={`flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 group transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 ${
                        card.span2 ? 'lg:col-span-2' : ''
                      }`}
                    >
                      <div
                        className={`relative w-full cursor-pointer overflow-hidden ${card.span2 ? 'h-48 md:h-64' : 'aspect-video'}`}
                        onClick={() => onPlayEpisode(card)}
                      >
                        {isAudio ? (
                          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            {/* Ambient blurred backdrop for Spotify podcast */}
                            <img
                              className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-35"
                              src={card.imageUrl}
                              alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                            {/* Complete square cover art presented in natural proportion */}
                            <img
                              className="relative z-10 h-full max-w-full aspect-square object-contain rounded-md shadow-xl group-hover:scale-105 transition-transform duration-500"
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
                        <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white px-2.5 py-1 rounded-md text-[12px] font-medium backdrop-blur-sm z-10">
                          {card.duration}
                        </div>
                        
                        {/* Media Format Badge */}
                        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[12px] backdrop-blur-sm border font-semibold shadow-xs flex items-center gap-1 max-w-[75%] truncate z-10 ${
                          isAudio
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
                            : 'bg-white/95 text-red-600 border-slate-200'
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
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'play_arrow'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียง (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow gap-2">
                        <h3
                          onClick={() => onPlayEpisode(card)}
                          className="text-[20px] font-bold leading-[28px] text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                        >
                          {card.title}
                        </h3>

                        {card.description && (
                          <p className="text-[14px] text-slate-600 line-clamp-2 mt-1">
                            {card.description}
                          </p>
                        )}

                        {/* Single Clear Action Button */}
                        <div className="mt-2">
                          <button
                            onClick={() => onPlayEpisode(card)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                              isAudio
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isAudio ? 'headphones' : 'movie'}
                            </span>
                            <span>{isAudio ? 'ฟังเสียงพอดแคสต์ (Spotify)' : 'ดูวิดีโอ (YouTube)'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                            <span className="material-symbols-outlined text-[16px] text-blue-600">
                              {card.institutionIcon}
                            </span>
                            <span className="text-slate-700 font-medium">{card.category}</span>
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
                                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
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
                    id="healthmed-load-more-btn"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] transition-all duration-300 flex items-center gap-2 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:scale-102 active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[20px]">expand_circle_down</span>
                    <span>
                      โหลดเพิ่มเติม (แสดงอีก {Math.min(PAGE_SIZE, filteredCards.length - visibleCount)} จาก {filteredCards.length} ตอน)
                    </span>
                  </button>
                ) : filteredCards.length > PAGE_SIZE ? (
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span>แสดงครบทั้งหมด {filteredCards.length} ตอนแล้ว</span>
                    <button
                      onClick={() => setVisibleCount(PAGE_SIZE)}
                      className="ml-2 text-blue-600 hover:underline font-semibold"
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
      <Footer theme="light" />
    </div>
  );
};
