"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/accommodation', label: 'Accommodation' },
    { href: '/events', label: 'Events' },
    { href: '/matrimonial', label: 'Matrimonial' },
    { href: '/magazine', label: 'Magazine' },
  ];

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <header className="bg-[#FFFBF7] shadow-sm sticky top-0 z-[1000]">
      <div className="px-4 sm:px-8 md:px-12 flex justify-between items-center w-full h-20 md:h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/logo.png" alt="Sahu Sabha Logo" width={100} height={50} style={{ height: 'auto' }} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block h-full">
          <ul className="flex gap-6 lg:gap-8 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="h-full">
                  <Link
                    href={link.href}
                    className={`font-medium transition-colors h-full flex items-center relative group ${
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="flex gap-3">
            <Link href="/donate" className="btn-outline !py-2 !text-sm">Donate</Link>
            {!user && <Link href="/join" className="btn-primary !py-2 !text-sm">Join Community</Link>}
          </div>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-full transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden">
                  {user.profile_photo ? (
                    <Image
                      src={`data:${user.profile_photo_mimetype || 'image/jpeg'};base64,${user.profile_photo}`}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
                <div className="hidden lg:block text-left cursor-pointer">
                  <p className="text-xs font-bold text-gray-900 leading-none mb-1">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider leading-none">Member</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
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
            <Link href="/login" className="text-gray-600 hover:text-primary font-bold transition-colors text-sm">Login</Link>
          )}
        </div>

        {/* Mobile Right: User avatar + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
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
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
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

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#FFFBF7] border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-3">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
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
