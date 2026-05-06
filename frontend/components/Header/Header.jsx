"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/accommodation', label: 'Accommodation' },
    { href: '/matrimonial', label: 'Matrimonial' },
    { href: '/magazine', label: 'Magazine' },
  ];

  return (
    <header className="h-24 flex items-center bg-white shadow-sm sticky top-0 z-[1000]">
      <div className="px-12 flex justify-between items-center w-full h-full">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="Sahu Sabha Logo" width={120} height={60} priority />
        </Link>
        
        <nav className="hidden md:block h-full">
          <ul className="flex gap-8 h-full">
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
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-gray-600 hover:text-primary font-bold transition-colors">Login</Link>
          <div className="flex gap-4">
            <Link href="/donate" className="btn-outline !py-2">Donate</Link>
            <Link href="/join" className="btn-primary !py-2">Join Community</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
