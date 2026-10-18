'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Home, Calendar, BookOpen,
  Users, Briefcase, Settings, LogOut, Heart, Newspaper, Images, HandCoins
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Home, label: 'Accommodations', href: '/accommodation' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: BookOpen, label: 'Magazine', href: '/magazine' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Heart, label: 'Matrimonial', href: '/matrimonial' },
  { icon: Briefcase, label: 'Careers', href: '/career' },
  { icon: Images, label: 'Gallery', href: '/gallery' },
  { icon: HandCoins, label: 'Donations', href: '/donations' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Settings, label: 'Site Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-[#1a120b] text-white flex flex-col fixed inset-y-0 z-50">
      <div className="p-4">
        <Link href="/" className="block px-1 py-2">
          <Image src="/assets/logo-sahu.png" alt="Sahu Sabha Logo" width={1365} height={410} className="w-full h-auto opacity-90" priority />
        </Link>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary transition-colors'} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-500 truncate">Administrator</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
