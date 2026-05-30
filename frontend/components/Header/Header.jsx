"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

const aboutSections = [
  { href: '/about/', label: 'Sabha Overview' },
  { href: '/about#about-leadership', label: 'Leadership Team' },
  { href: '/about#about-executive', label: 'Executive Committee' },
  { href: '/about#about-stats', label: 'Our Impact' },
  { href: '/about#constitution', label: 'Constitution' },
];

const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false); // desktop About Us hover
  const [showMobileAbout, setShowMobileAbout] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Sabha', hasDropdown: true },
    { href: '/accommodation', label: 'Accommodation' },
    { href: '/events', label: 'Events' },
    { href: '/news', label: 'News' },
    { href: '/career', label: 'Opportunities' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/matrimonial', label: 'Matrimonial' },
    { href: '/magazine', label: 'Magazine' },
  ];

  const closeMobileMenu = () => { setShowMobileMenu(false); setShowMobileAbout(false); };

  return (
    <header className="bg-[#FFFBF7] shadow-sm">
      {/* Top Contact Banner */}
      <div className="w-full bg-[#f5b301] text-[#564337] text-sm py-2 px-4 flex items-center gap-2">
        &nbsp;
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="font-semibold">Contact us:</span>
        <span className="font-medium cursor-default select-text">+91 6122303994</span>
      </div>

      {/* Row 1: Logo + Actions */}
      <div className="pe-2 md:pe-4 flex justify-between items-center w-full h-22">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/assets/logo-sahu.png" alt="Sahu Sabha Logo" width={220} height={120} style={{ height: 'auto' }} priority />
        </Link>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
          <div className="flex gap-2">
            <Link href="/donate" className="btn-outline !py-2.5 !px-6 !text-base">Donate</Link>
            {!user && <Link href="/join" className="btn-primary !py-2.5 !px-6 !text-base whitespace-nowrap">Join Community</Link>}
          </div>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-full transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden">
                  {user.profile_photo ? (
                    <Image
                      src={`data:${user.profile_photo_mimetype || 'image/jpeg'};base64,${user.profile_photo}`}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon size={18} />
                  )}
                </div>
                <div className="hidden xl:block text-left cursor-pointer">
                  <p className="text-xs font-bold text-gray-900 leading-none mb-1">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider leading-none">Member</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                    <div className="px-4 py-2 border-b border-yellow-200 mb-1">
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.phone}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-all"
                    >
                      <Settings size={16} />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setShowDropdown(false); }}
                      className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all border-t border-gray-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-primary font-bold transition-colors text-base whitespace-nowrap">Login</Link>
          )}
        </div>

        {/* Mobile / Tablet Right: User avatar + Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden"
              >
                {user.profile_photo ? (
                  <Image
                    src={`data:${user.profile_photo_mimetype || 'image/jpeg'};base64,${user.profile_photo}`}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <UserIcon size={18} />
                )}
              </button>
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                    <div className="px-4 py-2 border-b border-yellow-200 mb-1">
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.phone}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => { setShowDropdown(false); closeMobileMenu(); }}
                      className="cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-all"
                    >
                      <Settings size={16} />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setShowDropdown(false); }}
                      className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all border-t border-gray-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors px-2">Login</Link>
          )}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Row 2: Desktop Nav */}
      <nav className="hidden lg:block border-t-2 border-yellow-200 bg-[#FFFBF7]">
        <ul className="flex justify-center gap-1 xl:gap-2 px-6 h-14">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.hasDropdown) {
              return (
                <li key={link.href} className="h-full relative"
                  onMouseEnter={() => setShowAboutDropdown(true)}
                  onMouseLeave={() => setShowAboutDropdown(false)}
                >
                  <Link
                    href={link.href}
                    className={`text-sm xl:text-base font-medium transition-colors h-full flex items-center gap-1 relative group whitespace-nowrap px-3 ${
                      isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <span className="relative py-1">
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}></span>
                    </span>
                    <ChevronDown size={14} className={`transition-transform mt-0.5 ${showAboutDropdown ? 'rotate-180' : ''}`} />
                  </Link>
                  {showAboutDropdown && (
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {aboutSections.map((section) => (
                        <Link
                          key={section.href}
                          href={section.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-all"
                        >
                          {section.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            }
            return (
              <li key={link.href} className="h-full">
                <Link
                  href={link.href}
                  className={`text-sm xl:text-base font-medium transition-colors h-full flex items-center relative group whitespace-nowrap px-3 ${
                    isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <span className="relative py-1">
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile / Tablet Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden bg-[#FFFBF7] border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-3">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.hasDropdown) {
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => setShowMobileAbout(!showMobileAbout)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={16} className={`transition-transform ${showMobileAbout ? 'rotate-180' : ''}`} />
                      </button>
                      {showMobileAbout && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {aboutSections.map((section) => (
                            <li key={section.href}>
                              <Link
                                href={section.href}
                                onClick={closeMobileMenu}
                                className="block px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors"
                              >
                                {section.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link href="/donate" onClick={closeMobileMenu} className="btn-outline text-center">Donate</Link>
            {!user && <Link href="/join" onClick={closeMobileMenu} className="btn-primary text-center">Join Community</Link>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
