import React from 'react';
import { LOGO_DARK, LOGO_LIGHT } from '../data/podcasts';

interface FooterProps {
  theme: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <footer
      id="slc-library-footer"
      className={`w-full mt-16 border-t transition-colors ${
        isDark
          ? 'bg-[#050b18] border-[#1e293b] text-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 text-center lg:text-left">
        {/* Left: SLC Library Branding & Credits */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 max-w-2xl">
          {/* Logo matching the top-left navbar logo style and standard size */}
          <div className="relative shrink-0">
            <img
              alt="SLC Library & Louis PodCare Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full ring-2 ring-blue-500/30 shadow-md bg-white p-0.5 transition-transform hover:scale-105"
              src={isDark ? LOGO_DARK : LOGO_LIGHT}
            />
          </div>

          <div className="flex flex-col gap-1 text-center sm:text-left">
            <div className="text-[11px] font-bold tracking-wider text-blue-500 uppercase">
              จัดทำและรวบรวมข้อมูลโดย
            </div>

            <h3
              className={`font-bold text-base sm:text-lg tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              ห้องสมุด วิทยาลัยเซนต์หลุยส์ (SLC Library)
            </h3>

            <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              งานวิทยบริการและวารสารวิชาการ
            </p>

            <div className="text-xs flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 pt-1">
              <span className="flex items-center gap-1.5">
                <span>📍</span>
                <span>วิทยาลัยเซนต์หลุยส์ สาทรใต้ กรุงเทพฯ</span>
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <a
                href="https://library.slc.ac.th"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:text-blue-400 font-semibold transition-colors"
              >
                <span>🌐</span>
                <span className="underline decoration-blue-500/40 underline-offset-2">library.slc.ac.th</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Quick Links & Affiliation */}
        <div className="flex flex-col sm:flex-row items-center lg:items-end justify-center gap-4 sm:gap-6 text-xs">
          <div className="flex flex-col items-center lg:items-end gap-1">
            <span
              className={`font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Louis PodCare Discovery Platform
            </span>
            <span className="text-[11px] text-slate-500">
              Saint Louis College & Saint Louis Hospital Community Network
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.slc.ac.th"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                isDark
                  ? 'border-slate-800 bg-[#0a1226] text-slate-300 hover:text-white hover:border-slate-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              เว็บวิทยาลัย (SLC)
            </a>
            <a
              href="https://library.slc.ac.th"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>เข้าสู่ SLC Library</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div
        className={`w-full py-4 text-center text-[11px] border-t ${
          isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}
      >
        © {new Date().getFullYear()} SLC Library, Saint Louis College. All rights reserved. • พัฒนาเพื่อการศึกษาและบริการวิชาการแก่ชุมชน
      </div>
    </footer>
  );
};
