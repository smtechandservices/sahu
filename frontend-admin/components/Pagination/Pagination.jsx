'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Page numbers to show, with gaps, e.g. [1, 'gap-4', 4, 5, 6, 'gap-13', 13]
function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, pageSize, totalCount, onPageChange, disabled = false, className = '' }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const firstShown = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastShown = Math.min(page * pageSize, totalCount);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <p className="text-xs font-medium text-gray-400">
        Showing <span className="font-bold text-gray-700">{firstShown}–{lastShown}</span> of{' '}
        <span className="font-bold text-gray-700">{totalCount}</span>
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || disabled}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {pageList(page, totalPages).map(p =>
            typeof p === 'string' ? (
              <span key={p} className="px-1 text-gray-300 text-sm">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                disabled={disabled}
                className={`min-w-9 h-9 px-2 rounded-lg text-sm font-bold transition-all ${
                  p === page ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || disabled}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
