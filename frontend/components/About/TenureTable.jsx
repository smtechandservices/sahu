"use client";

import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Tenure list table: earlier terms scroll, the current term stays pinned at the bottom.
// Meant to sit in a flex column so it can fill the height its parent gives it on desktop.
const TenureTable = ({ terms }) => {
  const { t } = useLanguage();
  const tableRef = useRef(null);

  const earlierTerms = terms.filter((p) => !p.current);
  const currentTerm = terms.find((p) => p.current);

  // Open scrolled to the most recent terms
  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollTop = tableRef.current.scrollHeight;
  }, [terms]);

  return (
    <div ref={tableRef} className="max-h-[28rem] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-auto rounded-2xl border border-yellow-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="sticky top-0 z-10 bg-[#FFFBF7] text-xs font-bold text-gray-500 uppercase tracking-wider">
          <tr className="h-11">
            <th className="px-4 py-3 w-12">{t('No.', 'क्र.सं.')}</th>
            <th className="px-4 py-3">{t('Name', 'नाम')}</th>
            <th className="px-4 py-3">{t('Place', 'स्थान')}</th>
            <th className="px-4 py-3 whitespace-nowrap">{t('Tenure', 'अवधि')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-yellow-100">
          {earlierTerms.map((p, index) => (
            <tr key={index} className="hover:bg-[#FFFBF7] transition-colors">
              <td className="px-4 py-2.5 text-gray-400 font-semibold">{index + 1}</td>
              <td className="px-4 py-2.5 font-semibold text-gray-900">{t(...p.name)}</td>
              <td className="px-4 py-2.5 text-gray-600">{t(...p.place)}</td>
              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{p.term}</td>
            </tr>
          ))}
        </tbody>
        {/* Solid background so scrolled rows don't show through */}
        <tfoot className="sticky bottom-0 z-10 bg-[#FDF7E6] border-t-2 border-primary/30 text-base">
          <tr className="h-24">
            <td className="px-4 py-2.5 text-gray-400 font-semibold">{earlierTerms.length + 1}</td>
            <td className="px-4 py-2.5 text-lg font-bold text-gray-900">{t(...currentTerm.name)}</td>
            <td className="px-4 py-2.5 text-gray-600">{t(...currentTerm.place)}</td>
            <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">
              {currentTerm.term}
              <span className="ml-2 text-[10px] font-bold uppercase bg-primary text-white px-2 py-0.5 rounded-full">
                {t('Present', 'वर्तमान')}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TenureTable;
