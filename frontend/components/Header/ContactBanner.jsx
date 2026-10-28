"use client";

import { useLanguage, LanguageToggle } from '../../context/LanguageContext';

// Top contact strip — shared by the site header and the standalone login/join pages
const ContactBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#f5b301] text-[#564337] text-sm py-2 px-4 flex items-center gap-2 overflow-hidden">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span className="font-semibold whitespace-nowrap hidden sm:inline">{t('Contact us:', 'संपर्क करें:')}</span>
      <span className="font-medium whitespace-nowrap">+91 6122303994</span>
      <span className="mx-1 opacity-40">|</span>
      {/* Email: icon only on phones (no room for the address), full address from sm up */}
      <a href="mailto:sahusabha032@gmail.com" aria-label="sahusabha032@gmail.com" className="flex items-center gap-2 hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="font-medium whitespace-nowrap hidden sm:inline">sahusabha032@gmail.com</span>
      </a>
      <span className="mx-1 opacity-40 hidden lg:inline">|</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium whitespace-nowrap hidden lg:inline">{t('Mon – Sun', 'सोम – रवि')} &nbsp;·&nbsp; {t('10:00 AM – 5:00 PM', 'सुबह 10:00 – शाम 5:00')}</span>
      <LanguageToggle className="ml-auto" />
    </div>
  );
};

export default ContactBanner;
