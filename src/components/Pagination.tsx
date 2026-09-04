import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  currentDisplayCount: number;
  maxPageSize: number;
  canLoadMoreInPage: boolean;
  onLoadMoreInPage: () => void;
  theme?: 'dark' | 'light';
  targetScrollId?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  currentDisplayCount,
  maxPageSize,
  canLoadMoreInPage,
  onLoadMoreInPage,
  theme = 'dark',
  targetScrollId,
}) => {
  const isDark = theme === 'dark';

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (targetScrollId) {
      const el = document.getElementById(targetScrollId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Range calculation
  const startItem = (currentPage - 1) * maxPageSize + 1;
  const endItem = Math.min((currentPage - 1) * maxPageSize + currentDisplayCount, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-6 mt-8 pt-6 border-t w-full"
      style={{
        borderColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 1)',
      }}
    >
      {/* Load More Button (if current page shows 6 and can expand to 9) */}
      {canLoadMoreInPage && (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onLoadMoreInPage}
            className={`px-8 py-3 rounded-full font-semibold text-[14px] transition-all duration-300 flex items-center gap-2.5 shadow-lg active:scale-95 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-blue-600/35'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">expand_circle_down</span>
            <span>Load more</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-700/80 text-blue-100' : 'bg-blue-800/80 text-blue-50'}`}>
              +3
            </span>
          </button>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Expand current page from 6 to 9 episodes
          </span>
        </div>
      )}

      {/* Pagination Bar (when total items exceed 9 or totalPages > 1) */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination Navigation"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
        >
          {/* Information text in English */}
          <div className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Showing <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{startItem}–{endItem}</span> of{' '}
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalItems}</span> episodes
            <span className={`ml-2 text-xs opacity-75 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              (Page {currentPage} of {totalPages})
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 transition-all ${
                currentPage === 1
                  ? isDark
                    ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900/50 border border-slate-800'
                    : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 border border-slate-200'
                  : isDark
                  ? 'text-slate-200 bg-[#060e20] hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:text-white shadow-sm'
                  : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Numeric Page Buttons */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((p, idx) => {
                if (p === '...') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className={`w-8 h-9 flex items-center justify-center text-xs ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      •••
                    </span>
                  );
                }

                const pageNum = p as number;
                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageClick(pageNum)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                        : isDark
                        ? 'text-slate-300 bg-[#060e20] hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700'
                        : 'text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 transition-all ${
                currentPage === totalPages
                  ? isDark
                    ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900/50 border border-slate-800'
                    : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 border border-slate-200'
                  : isDark
                  ? 'text-slate-200 bg-[#060e20] hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:text-white shadow-sm'
                  : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
