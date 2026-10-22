"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight, Briefcase, X } from "lucide-react";

const STORAGE_KEY = "kaamleeBannerDismissedAt";
const HIDE_FOR_MS = 2 * 60 * 1000; // 2 minutes

// Dismissal lives in localStorage; this tiny store lets React re-render when it changes.
// dismissedAtInMemory covers browsers where localStorage throws (e.g. private mode).
const listeners = new Set();
let dismissedAtInMemory = 0;

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  let dismissedAt = dismissedAtInMemory;
  try {
    dismissedAt = Math.max(dismissedAt, Number(localStorage.getItem(STORAGE_KEY)) || 0);
  } catch {}
  return Date.now() - dismissedAt > HIDE_FOR_MS;
};

// Hidden during server render so a dismissed banner never flashes in
const getServerSnapshot = () => false;

const dismiss = () => {
  dismissedAtInMemory = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, String(dismissedAtInMemory));
  } catch {}
  notify();
  // Bring it back on its own once the hide period ends, if the page is still open
  setTimeout(notify, HIDE_FOR_MS + 50);
};

const KaamleeBanner = () => {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!visible) return null;

  return (
    <div className="group flex items-center max-w-sm shrink-0 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-colors">
      <a
        href="https://kaamlee.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 pl-4 pr-2 py-3"
      >
        <Briefcase className="w-4 h-4 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="text-sm text-gray-600 leading-snug">
            Job applying is a job, let <span className="font-semibold text-gray-800">kaamlee</span> make that easy
          </p>
          <p className="text-xs text-gray-400 mt-0.5 inline-flex items-center gap-0.5">
            kaamlee.in
            <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
          </p>
        </div>
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide Kaamlee banner"
        className="self-start shrink-0 m-1.5 p-1.5 rounded-md text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default KaamleeBanner;
