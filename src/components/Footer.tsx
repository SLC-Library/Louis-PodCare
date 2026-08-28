import React from 'react';

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
      <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
        {/* Left: SLC Library Branding & Responsibility */}
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span
              className={`p-2 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">local_library</span>
            </span>
            <div className="text-left">
              <div
                className={`font-bold text-sm sm:text-base ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                ห้องสมุด วิทยาลัยเซนต์หลุยส์ (SLC Library)
              </div>
              <div className="text-xs text-blue-500 font-medium">
                งานวิทยบริการและวารสารวิชาการ
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed mt-1">
            <strong>จัดทำและรวบรวมข้อมูลโดย:</strong> ห้องสมุด วิทยาลัยเซนต์หลุยส์ (SLC Library)
            <br />
            งานวิทยบริการและวารสารวิชาการ
          </p>

          <div className="text-xs flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-4 pt-1">
            <span className="flex items-center gap-1.5">
              <span>📍</span>
              <span>วิทยาลัยเซนต์หลุยส์ สาทรใต้ กรุงเทพฯ</span>
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <a
              href="https://library.slc.ac.th"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-400 font-medium transition-colors"
            >
              <span>🌐</span>
              <span className="underline decoration-blue-500/40 underline-offset-2">library.slc.ac.th</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Right: Quick Links & Affiliation */}
        <div className="flex flex-col sm:flex-row items-center md:items-end justify-center gap-4 sm:gap-6 text-xs">
          <div className="flex flex-col items-center md:items-end gap-1">
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
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
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
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
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
