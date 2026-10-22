"use client";
import { useLanguage } from '../../context/LanguageContext';

export default function Pagination({ currentPage, totalPages, total, perPage, onChange }) {
  const { lang, t } = useLanguage();
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      <p className="text-sm text-gray-400">
        {lang === 'hi' ? (
          <>कुल <span className="font-bold text-gray-700">{total}</span> में से <span className="font-bold text-gray-700">{from}–{to}</span> परिणाम</>
        ) : (
          <>Showing <span className="font-bold text-gray-700">{from}–{to}</span> of <span className="font-bold text-gray-700">{total}</span> results</>
        )}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(currentPage - 1)}
          aria-label={t('Previous page', 'पिछला पृष्ठ')}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                p === currentPage
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/25'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-primary hover:text-primary'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(currentPage + 1)}
          aria-label={t('Next page', 'अगला पृष्ठ')}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
