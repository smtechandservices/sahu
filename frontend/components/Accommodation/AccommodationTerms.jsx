import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Set `file` to the PDF's path in public/ once it's available; rows without one show "Coming soon".
const TERMS = [
  { type: 'Hostel', file: '/assets/hostel-terms.pdf', filename: 'Hostel-Terms-and-Conditions.pdf' },
  { type: 'Community Hall', file: null, filename: 'Community-Hall-Terms-and-Conditions.pdf' },
  { type: 'Guest Rooms', file: null, filename: 'Guest-Rooms-Terms-and-Conditions.pdf' },
  { type: 'Library', file: null, filename: 'Library-Terms-and-Conditions.pdf' },
];

const AccommodationTerms = () => {
  const { t, tv } = useLanguage();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
        <FileText size={16} className="text-primary" />
        {t('Terms & Conditions', 'नियम एवं शर्तें')}
      </h3>
      <ul className="space-y-3">
        {TERMS.map(({ type, file, filename }) => (
          <li key={type} className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-700">{tv(type)}</span>
            {file ? (
              <a
                href={file}
                download={filename}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors"
              >
                <Download size={14} />
                {t('PDF', 'PDF')}
              </a>
            ) : (
              <span className="shrink-0 text-[11px] font-semibold text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5">
                {t('Coming soon', 'जल्द उपलब्ध')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccommodationTerms;
