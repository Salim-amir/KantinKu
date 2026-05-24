import React from 'react';

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page } = meta;

  const getPages = () => {
    let pages = [];
    let start = Math.max(1, current_page - 2);
    let end = Math.min(last_page, current_page + 2);

    if (current_page <= 3) end = Math.min(5, last_page);
    if (current_page >= last_page - 2) start = Math.max(1, last_page - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-fade-up">
      <button
        onClick={() => onPageChange(current_page - 1)}
        disabled={current_page === 1}
        className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPages().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300
            ${current_page === page
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200'
              : 'bg-white border border-zinc-200/80 text-zinc-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(current_page + 1)}
        disabled={current_page === last_page}
        className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
