import React, { useState } from 'react';
import {
  ALL_PODCASTS,
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
  initialTab?: 'Browse' | 'Library' | 'Community';
}

export const DiscoveryDashboardHealthMed: React.FC<DiscoveryDashboardHealthMedProps> = ({
  onNavigate,
  onPlayEpisode,
  bookmarks,
  onToggleBookmark,
  initialTab = 'Library',
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState<'Browse' | 'Library' | 'Community'>(initialTab);

  const allCards = showMore ? [...PODCAST_CARDS, ...MORE_PODCAST_CARDS] : PODCAST_CARDS;

  // Bookmarked items list
  const bookmarkedItems = ALL_PODCASTS.filter((item) => bookmarks.has(item.id));

  // Filter bookmarked items
  const filteredBookmarks = bookmarkedItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter regular browse items
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
              {bookmarkedItems.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] bg-blue-100 text-blue-800 font-bold">
                  {bookmarkedItems.length}
                </span>
              )}
            </a>
            <a
              id="healthmed-nav-community"
              aria-current={activeTab === 'Community' ? 'page' : undefined}
              className={`h-full flex items-center border-b-2 font-semibold text-[14px] px-1 transition-all ${
                activeTab === 'Community'
                  ? 'text-[#004ac6] border-[#004ac6]'
                  : 'text-[#434655] border-transparent hover:text-[#004ac6]'
              }`}
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
                placeholder={activeTab === 'Library' ? "Search saved library..." : "Search insights..."}
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

            {/* Toggle to Dark Mode */}
            <button
              id="healthmed-dark-mode-btn"
              onClick={() => onNavigate('dark', 'none')}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center border border-slate-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
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
        {/* ================= LIBRARY VIEW ================= */}
        {activeTab === 'Library' && (
          <div id="library-view" className="flex flex-col gap-6">
            {/* Library Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-[#c3c6d7]/60 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bookmark
                  </span>
                  <h1 className="text-[26px] md:text-[30px] font-bold text-[#191c1e] tracking-tight">
                    Your Library
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 ml-2">
                    {bookmarkedItems.length} Saved {bookmarkedItems.length === 1 ? 'Episode' : 'Episodes'}
                  </span>
                </div>
                <p className="text-[15px] text-[#434655]">
                  รายการวิดีโอและพอดแคสต์ทางการแพทย์ที่คุณได้กด Bookmark บันทึกไว้เพื่อศึกษาและรับชมย้อนหลัง
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onNavigate('dark', 'push_back');
                  }}
                  className="px-4 py-2 rounded-full border border-[#004ac6] text-[#004ac6] hover:bg-blue-50 font-medium text-[13px] flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span>Explore More</span>
                </button>
              </div>
            </div>

            {/* Filter Chips for Library */}
            {bookmarkedItems.length > 0 && (
              <section
                id="library-filter-chips"
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
                      id={`library-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`snap-start flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#004ac6] text-white shadow-sm font-semibold'
                          : 'bg-[#e0e3e5] hover:bg-blue-50 text-[#191c1e] hover:text-[#004ac6] border border-transparent hover:border-blue-200'
                      }`}
                    >
                      {cat} ({countInCat})
                    </button>
                  );
                })}
              </section>
            )}

            {/* Empty State if no bookmarks */}
            {bookmarkedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-sm my-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">bookmark_border</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">ยังไม่มีรายการที่บันทึกไว้</h3>
                <p className="text-slate-500 max-w-md mb-6 text-sm">
                  คุณสามารถกดที่ไอคอน Bookmark บนวิดีโอหรือพอดแคสต์ที่น่าสนใจในหน้าค้นพบ เพื่อบันทึกมาไว้ดูในคลังความรู้ส่วนตัวของคุณ
                </p>
                <button
                  onClick={() => onNavigate('dark', 'push_back')}
                  className="px-6 py-2.5 rounded-full bg-[#004ac6] text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
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
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-3 text-sm text-blue-600 underline font-medium"
                >
                  ล้างตัวกรองการค้นหา
                </button>
              </div>
            ) : (
              /* Bookmarked Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((card) => (
                  <article
                    key={card.id}
                    id={`library-card-${card.id}`}
                    onClick={() => onPlayEpisode(card)}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#c3c6d7]/60 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative w-full aspect-video">
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
                      <h3 className="text-[19px] font-bold leading-[26px] text-[#191c1e] group-hover:text-[#004ac6] transition-colors line-clamp-2">
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= COMMUNITY VIEW ================= */}
        {activeTab === 'Community' && (
          <div id="community-view" className="flex flex-col gap-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#c3c6d7]/60 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">
                  forum
                </span>
                <h1 className="text-[26px] md:text-[30px] font-bold text-[#191c1e] tracking-tight">
                  Medical & Clinical Community
                </h1>
              </div>
              <p className="text-[15px] text-[#434655]">
                Peer-to-peer discussions, clinical case questions, and multidisciplinary insights from verified practitioners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full">
                      Genomics Discussion
                    </span>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    Clinical applications of long-read sequencing in neonatal cardiac diagnostics?
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Looking for recent peer-reviewed feedback on integrating rapid whole-genome sequencing workflows in NICU settings with turnaround under 24 hours.
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3">
                    <span className="font-medium text-slate-700">Dr. Melissa Vance • Mayo Clinic</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span> 18 Replies
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
                      Oncology & Immunology
                    </span>
                    <span className="text-xs text-slate-400">5 hours ago</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    CAR-T cell persistence and secondary immune biomarker monitoring
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Sharing preliminary observational data regarding wearable biometric monitors detecting early neurotoxicity signs in lymphoma patients.
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3">
                    <span className="font-medium text-slate-700">Prof. Ethan Hayes • Johns Hopkins</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span> 24 Replies
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">trending_up</span>
                    Trending Medical Topics
                  </h4>
                  <ul className="flex flex-col gap-2 text-sm text-slate-700">
                    <li className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between">
                      <span>#GenomicTherapeutics</span>
                      <span className="text-xs text-slate-400">142 posts</span>
                    </li>
                    <li className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between">
                      <span>#RoboticSurgeryAI</span>
                      <span className="text-xs text-slate-400">98 posts</span>
                    </li>
                    <li className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between">
                      <span>#GutBrainAxis</span>
                      <span className="text-xs text-slate-400">86 posts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= BROWSE DISCOVERY VIEW ================= */}
        {activeTab === 'Browse' && (
          <>
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
          </>
        )}
      </main>
    </div>
  );
};

