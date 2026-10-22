"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { useLanguage } from '../../context/LanguageContext';

const ADS = [
  {
    name: "Kaamlee",
    url: "https://kaamlee.in",
    domain: "kaamlee.in",
    logo: "/assets/kaamlee-logo.png",
    headline: ["Job applying is a job.", "नौकरी के लिए आवेदन करना भी एक काम है।"],
    tagline: ["Let kaamlee make that easy.", "kaamlee इसे आसान बनाता है।"],
  },
  // {
  //   name: "befin",
  //   url: "https://befin.in",
  //   domain: "befin.in",
  //   logo: "/assets/befin-logo.png",
  //   headline: "Learn better. Pay smarter. Grow faster.",
  //   tagline: "Learn, save, pay & invest with befin.",
  // },
  // {
  //   name: "Commhawk",
  //   url: "https://commhawk.in",
  //   domain: "commhawk.in",
  //   logo: "/assets/commhawk-logo.png",
  //   headline: ["Engineering digital excellence.", "डिजिटल उत्कृष्टता का निर्माण।"],
  //   tagline: ["Scalable, secure, high-performance digital products and AI solutions.", "स्केलेबल, सुरक्षित और उच्च-प्रदर्शन वाले डिजिटल उत्पाद एवं AI समाधान।"],
  // },
];

const ROTATE_MS = 6000;
const STORAGE_KEY = "careerAdsDismissedAt"; // { [ad name]: timestamp }
const HIDE_FOR_MS = 2 * 60 * 1000; // 2 minutes

// Dismissals live in localStorage; this tiny store lets React re-render when they change.
// dismissedInMemory covers browsers where localStorage throws (e.g. private mode).
const listeners = new Set();
const dismissedInMemory = {};

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const readDismissed = () => {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {}
  return { ...stored, ...dismissedInMemory };
};

// Returns the visible ad names as a string so the snapshot compares by value
const getSnapshot = () => {
  const dismissed = readDismissed();
  const now = Date.now();
  return ADS.filter((ad) => now - (dismissed[ad.name] || 0) > HIDE_FOR_MS)
    .map((ad) => ad.name)
    .join(",");
};

// Nothing during server render so a dismissed ad never flashes in
const getServerSnapshot = () => "";

const dismiss = (name) => {
  dismissedInMemory[name] = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readDismissed()));
  } catch {}
  notify();
  // Bring it back on its own once the hide period ends, if the page is still open
  setTimeout(notify, HIDE_FOR_MS + 50);
};

const AdCarousel = ({ className = "" }) => {
  const visibleNames = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ads = ADS.filter((ad) => visibleNames.split(",").includes(ad.name));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();
  const current = ads.length ? active % ads.length : 0;

  useEffect(() => {
    if (ads.length < 2 || paused) return;
    const id = setInterval(() => setActive((i) => i + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, [ads.length, paused]);

  if (!ads.length) return null;

  return (
    <aside
      aria-label={t('Sponsored', 'प्रायोजित')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-50 via-white to-amber-50 ${className}`}
    >
      <button
        type="button"
        onClick={() => dismiss(ads[current].name)}
        aria-label={t(`Hide ${ads[current].name} ad`, `${ads[current].name} विज्ञापन छिपाएँ`)}
        className="absolute top-2 right-3 z-10 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="bg-primary text-white px-6 py-3 pr-12 text-sm font-bold uppercase tracking-wider">
        {t('For more jobs', 'अधिक नौकरियों के लिए')}
      </h3>

      {/* All slides share one grid cell so the card keeps the tallest slide's height */}
      <div className="grid">
        {ads.map((ad, i) => (
          <a
            key={ad.name}
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={i !== current}
            inert={i !== current}
            className={`group [grid-area:1/1] flex flex-col px-6 pt-5 ${ads.length > 1 ? 'pb-10' : 'pb-6'} transition-opacity duration-500 motion-reduce:transition-none ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <Image
                src={ad.logo}
                alt={`${ad.name} logo`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-base font-semibold text-gray-700">{ad.name}</span>
            </div>

            <p className="text-lg font-semibold text-gray-800 leading-snug mb-1">{t(...ad.headline)}</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{t(...ad.tagline)}</p>

            <span className="mt-auto inline-flex items-center justify-center gap-1.5 w-full bg-white border border-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg group-hover:border-gray-300 group-hover:text-gray-900 transition-colors">
              {t('Visit', 'देखें:')} {ad.domain}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </a>
        ))}
      </div>

      {/* Dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
          {ads.map((ad, i) => (
            <button
              key={ad.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t(`Show ${ad.name}`, `${ad.name} दिखाएँ`)}
              aria-current={i === current}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === current ? "w-5 bg-gray-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </aside>
  );
};

export default AdCarousel;
