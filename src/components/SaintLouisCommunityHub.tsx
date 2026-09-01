import React, { useState, useMemo, useEffect } from 'react';
import {
  SAINT_LOUIS_CONTACT,
} from '../data/articles';
import { ArticleItem } from '../types';
import { fetchSaintLouisArticles, FetchArticlesResult } from '../services/saintLouisApi';

interface SaintLouisCommunityHubProps {
  theme: 'dark' | 'light';
  onExplorePodcasts?: () => void;
}

export const SaintLouisCommunityHub: React.FC<SaintLouisCommunityHubProps> = ({
  theme,
  onExplorePodcasts,
}) => {
  const [dataState, setDataState] = useState<FetchArticlesResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticleModal, setSelectedArticleModal] = useState<ArticleItem | null>(null);

  const isDark = theme === 'dark';

  // Load articles on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const res = await fetchSaintLouisArticles(false);
      if (isMounted) {
        setDataState(res);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Manual refresh trigger
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const res = await fetchSaintLouisArticles(true);
    setDataState(res);
    setIsRefreshing(false);
  };

  const featured = dataState?.featured;
  const articles = dataState?.articles || [];
  const categories = dataState?.categories || ['ทั้งหมด', 'สาระสุขภาพ', 'ข่าวสาร'];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCat =
        selectedCategory === 'ทั้งหมด' || article.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div
      id="saint-louis-community-hub"
      className="flex flex-col gap-8 animate-fadeIn"
    >
      {/* 🌟 1. Official Header & Portal Banner */}
      <div
        className={`relative overflow-hidden p-6 md:p-8 rounded-3xl border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#0a1226] via-[#0f1d3a] to-[#060e20] border-[#1e293b] text-white shadow-xl'
            : 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 border-blue-200 text-white shadow-lg'
        }`}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 flex-1 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
              </span>
              <span className="text-xs md:text-sm font-semibold tracking-wider text-blue-200 uppercase">
                Saint Louis Hospital • Knowledge & Community Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/30 text-[11px] font-medium text-blue-200 shadow-xs">
                <span className="material-symbols-outlined text-[15px] text-amber-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_library
                </span>
                <span>รวบรวมและจัดทำโดย SLC Library</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-bold tracking-tight text-white leading-tight">
              คลังบทความและสาระสุขภาพ
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              รวบรวมสาระความรู้ทางการแพทย์ การดูแลสุขภาพเชิงป้องกัน และนวัตกรรมการรักษา
              <br className="hidden sm:inline" />{' '}
              จากคณะแพทย์และศูนย์การรักษาเฉพาะทาง โรงพยาบาลเซนต์หลุยส์ (saintlouis.or.th)
            </p>

            {/* Live Sync Status Pill */}
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-400/30 text-[11px] sm:text-xs text-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {dataState?.source === 'live'
                    ? `Live Sync: saintlouis.or.th (อัปเดต ${dataState.lastUpdated} น.)`
                    : dataState?.source === 'cache'
                    ? `ซิงค์อัตโนมัติ: saintlouis.or.th (ข้อมูลล่าสุด ${dataState.lastUpdated} น.)`
                    : 'เชื่อมต่อคลังความรู้สุขภาพ รพ.เซนต์หลุยส์'}
                </span>
              </span>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                title="กดเพื่อดึงบทความล่าสุดจากเว็บ รพ.เซนต์หลุยส์"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs transition-all border border-white/20 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${isRefreshing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isRefreshing ? 'กำลังซิงค์...' : 'รีเฟรช'}</span>
              </button>
            </div>
          </div>

          {/* Quick Action to Official Saint Louis Hospital Contents */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              id="slh-official-portal-btn"
              href={SAINT_LOUIS_CONTACT.contentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30"
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span>เข้าสู่หน้า saintlouis.or.th/contents</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>

            <div className="flex items-center justify-between sm:justify-start gap-4 px-3 py-1.5 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">verified</span>
                บทความสุขภาพรับรอง
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-amber-300">call</span>
                โทร: {SAINT_LOUIS_CONTACT.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 2. Search & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x w-full md:w-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : isDark
                    ? 'bg-[#131b2e] hover:bg-[#1e293b] text-slate-300 border border-[#334155]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative shrink-0 w-full md:w-72">
          <span
            className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            search
          </span>
          <input
            type="text"
            placeholder="ค้นหาบทความสาระสุขภาพ, อาการ, การรักษา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-9 py-2 rounded-full text-xs sm:text-[13px] transition-all outline-none ${
              isDark
                ? 'bg-[#131b2e] border border-[#334155] text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 shadow-xs'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className={`h-64 rounded-3xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
          <div className={`h-64 rounded-3xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-200'}`} />
        </div>
      )}

      {/* 🌟 3. Featured Article Highlight */}
      {!isLoading && featured && !searchQuery && selectedCategory === 'ทั้งหมด' && (
        <div
          className={`relative rounded-3xl overflow-hidden border transition-all ${
            isDark
              ? 'bg-[#060e20] border-[#1e293b] hover:border-blue-500/40 shadow-xl'
              : 'bg-white border-slate-200 hover:border-blue-300 shadow-md'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Banner */}
            <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[260px] overflow-hidden group">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />

              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">star</span>
                บทความแนะนำจาก รพ.เซนต์หลุยส์
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="px-2.5 py-1 rounded-md font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {featured.category}
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    • {featured.readTime}
                  </span>
                  {featured.date && (
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      • {featured.date}
                    </span>
                  )}
                </div>

                <h2
                  className={`text-xl sm:text-2xl font-bold leading-snug cursor-pointer transition-colors ${
                    isDark
                      ? 'text-white hover:text-blue-400'
                      : 'text-slate-900 hover:text-blue-600'
                  }`}
                  onClick={() => setSelectedArticleModal(featured)}
                >
                  {featured.title}
                </h2>

                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {featured.summary}
                </p>

                {/* Department Info */}
                <div
                  className={`flex items-center gap-2 text-xs font-medium pt-1 ${
                    isDark ? 'text-blue-300' : 'text-blue-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">domain</span>
                  <span>{featured.department}</span>
                </div>

                {/* Tags */}
                {featured.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                          isDark
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
                <button
                  onClick={() => setSelectedArticleModal(featured)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">article</span>
                  <span>อ่านสรุปในแอป</span>
                </button>

                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors border ${
                    isDark
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>อ่านบนเว็บ รพ.เซนต์หลุยส์</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 4. Articles Grid & Sidebar Layout */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Article Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-blue-500">feed</span>
                <span>
                  บทความสาระความรู้ล่าสุด {selectedCategory !== 'ทั้งหมด' && `(${selectedCategory})`}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                  {filteredArticles.length} รายการ
                </span>
              </h3>

              <a
                href={SAINT_LOUIS_CONTACT.contentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
              >
                <span>ดูบทความทั้งหมดบนเว็บ รพ.</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

            {filteredArticles.length === 0 ? (
              <div
                className={`p-12 text-center rounded-2xl border ${
                  isDark
                    ? 'bg-[#060e20] border-[#1e293b] text-slate-400'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                  find_in_page
                </span>
                <p className="font-medium text-base">ไม่พบบทความสาระความรู้ที่ตรงกับคำค้นหา</p>
                <p className="text-xs mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ทั้งหมด');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className={`group rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      isDark
                        ? 'bg-[#060e20] border-[#1e293b] hover:border-blue-500/40'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div>
                      {/* Image */}
                      <div
                        className="relative h-44 overflow-hidden cursor-pointer bg-slate-800"
                        onClick={() => setSelectedArticleModal(article)}
                      >
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop';
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                          {article.category}
                        </div>
                        {article.readTime && (
                          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                            {article.readTime}
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{article.date}</span>
                          <span className="text-blue-400 font-medium truncate max-w-[140px]">
                            {article.department.split(' ')[0]}
                          </span>
                        </div>

                        <h4
                          onClick={() => setSelectedArticleModal(article)}
                          className={`font-bold text-[16px] sm:text-[17px] leading-[24px] line-clamp-2 cursor-pointer transition-colors ${
                            isDark
                              ? 'text-slate-100 group-hover:text-blue-400'
                              : 'text-slate-900 group-hover:text-blue-600'
                          }`}
                        >
                          {article.title}
                        </h4>

                        <p
                          className={`text-[13px] line-clamp-2 leading-[21px] ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    {/* Footer Links */}
                    <div
                      className={`px-4 sm:px-5 pb-4 pt-3 border-t flex items-center justify-between text-xs ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedArticleModal(article)}
                        className="font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1"
                      >
                        <span>อ่านสรุปในแอป</span>
                        <span className="material-symbols-outlined text-[14px]">
                          chevron_right
                        </span>
                      </button>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 transition-colors ${
                          isDark
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="เปิดอ่านบนเว็บไซต์โรงพยาบาลเซนต์หลุยส์"
                      >
                        <span>เว็บ รพ.</span>
                        <span className="material-symbols-outlined text-[13px]">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right 1 Column: Specialized Health Knowledge Centers & Learning Resources */}
          <div className="flex flex-col gap-6">
            {/* Specialized Medical Centers Knowledge Box */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark
                  ? 'bg-[#060e20] border-[#1e293b] shadow-md'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="material-symbols-outlined text-blue-500 text-2xl">
                  menu_book
                </span>
                <h4
                  className={`font-bold text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  ศูนย์ความรู้เฉพาะทาง
                </h4>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  {
                    name: 'ศูนย์หัวใจและหลอดเลือด',
                    desc: 'ความรู้โรคหัวใจ & CT Calcium Score',
                    icon: 'favorite',
                    color: 'text-red-500',
                    category: 'สาระสุขภาพ',
                  },
                  {
                    name: 'ศูนย์เบาหวานและโภชนาการ',
                    desc: 'การดูแลระดับน้ำตาล & ปรับอาหาร',
                    icon: 'nutrition',
                    color: 'text-emerald-500',
                    category: 'โภชนาการและไลฟ์สไตล์',
                  },
                  {
                    name: 'ศูนย์ศัลยกรรมส่องกล้อง (MIS)',
                    desc: 'นวัตกรรมผ่าตัดแผลเล็กฟื้นตัวไว',
                    icon: 'biotech',
                    color: 'text-blue-500',
                    category: 'นวัตกรรมทางการแพทย์',
                  },
                  {
                    name: 'ศูนย์เวชศาสตร์เชิงป้องกัน & วัคซีน',
                    desc: 'คู่มือวัคซีน & ตรวจคัดกรองตามวัย',
                    icon: 'vaccines',
                    color: 'text-purple-500',
                    category: 'เวชศาสตร์เชิงป้องกัน',
                  },
                  {
                    name: 'ศูนย์เวชศาสตร์ฟื้นฟู & กายภาพ',
                    desc: 'สรีรศาสตร์โต๊ะทำงาน & Office Syndrome',
                    icon: 'accessibility_new',
                    color: 'text-amber-500',
                    category: 'ศูนย์เฉพาะทาง',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(item.category);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500 text-slate-200 hover:text-white'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`material-symbols-outlined ${item.color} text-lg`}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-xs font-bold">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence-Based Knowledge Quality Card */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark
                  ? 'bg-[#060e20] border-[#1e293b] text-slate-300'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="material-symbols-outlined text-blue-500 text-xl">
                  verified
                </span>
                <h4
                  className={`font-bold text-sm ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  มาตรฐานคลังความรู้สุขภาพ
                </h4>
              </div>

              <p className="text-xs leading-relaxed mb-3">
                บทความวิชาการและสื่อการเรียนรู้สุขภาพทั้งหมดได้รับการกลั่นกรองและตรวจทานโดยคณะแพทย์และบุคลากรทางการแพทย์ผู้เชี่ยวชาญ โรงพยาบาลเซนต์หลุยส์ เพื่อให้ข้อมูลมีความถูกต้องตามหลักวิชาการแพทย์
              </p>

              <a
                href={SAINT_LOUIS_CONTACT.contentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                <span>เปิดคลังบทความ saintlouis.or.th/contents</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </a>
            </div>

            {/* Quick Podcast Link */}
            {onExplorePodcasts && (
              <div
                className={`p-5 rounded-2xl border ${
                  isDark
                    ? 'bg-gradient-to-br from-blue-950/40 to-slate-900 border-blue-900/40 text-slate-300'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-slate-700'
                }`}
              >
                <h5
                  className={`font-bold text-sm mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  🎧 พอดแคสต์ & สื่อวิดีโอทางการแพทย์
                </h5>
                <p className="text-xs mb-3 text-slate-400">
                  รับฟังรายการพอดแคสต์สุขภาพและคลิปสัมภาษณ์แพทย์ผู้เชี่ยวชาญ
                </p>
                <button
                  onClick={onExplorePodcasts}
                  className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>ไปที่คลังพอดแคสต์ (Browse)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🌟 5. Article Preview Modal (อ่านสรุปในแอป) */}
      {selectedArticleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedArticleModal(null)}
        >
          <div
            className={`relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border max-h-[90vh] flex flex-col ${
              isDark
                ? 'bg-[#0a1226] border-[#1e293b] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 w-full shrink-0 bg-slate-800">
              <img
                src={selectedArticleModal.imageUrl}
                alt={selectedArticleModal.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedArticleModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="px-2.5 py-1 rounded-md bg-blue-600 font-semibold shadow-xs">
                  {selectedArticleModal.category}
                </span>
                <span>{selectedArticleModal.date}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex flex-col gap-4">
              <h3 className="text-xl md:text-2xl font-bold leading-snug">
                {selectedArticleModal.title}
              </h3>

              <div
                className={`flex items-center gap-2 text-xs font-semibold ${
                  isDark ? 'text-blue-300' : 'text-blue-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span>{selectedArticleModal.department}</span>
              </div>

              <div
                className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <p className="font-semibold text-xs text-blue-400 mb-2 uppercase tracking-wide">
                  บทสรุปสาระสำคัญ:
                </p>
                <p>{selectedArticleModal.summary}</p>
              </div>

              {selectedArticleModal.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedArticleModal.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-3 py-1 rounded-full ${
                        isDark
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 sm:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
                isDark ? 'border-slate-800 bg-[#060e20]' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">
                  verified
                </span>
                <span>เผยแพร่โดย โรงพยาบาลเซนต์หลุยส์</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedArticleModal(null)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  ปิดหน้าต่าง
                </button>
                <a
                  href={selectedArticleModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all hover:scale-105"
                >
                  <span>อ่านฉบับเต็มบนเว็บ รพ.</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
