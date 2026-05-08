'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Heart, 
  BookOpen, 
  Users, 
  Settings,
  LogOut,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/admin-panel', icon: LayoutDashboard },
  { name: 'Accommodations', path: '/admin-panel/accommodations', icon: Building2 },
  { name: 'Bookings', path: '/admin-panel/bookings', icon: CalendarCheck },
  { name: 'Jobs & Ads', path: '/admin-panel/jobs', icon: Briefcase },
  { name: 'Matrimonial', path: '/admin-panel/matrimonial', icon: Heart },
  { name: 'Magazine', path: '/admin-panel/articles', icon: BookOpen },
  { name: 'Users', path: '/admin-panel/users', icon: Users },
  { name: 'Site Settings', path: '/admin-panel/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  // If loading, show blank
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  // Simple protection check
  if (!user || !user.is_admin) {
    if (typeof window !== 'undefined' && pathname !== '/admin-panel/login') {
      window.location.href = '/admin-panel/login';
    }
  }

  if (pathname === '/admin-panel/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-yellow-500">Admin Panel</h2>
          <p className="text-gray-400 text-sm mt-1">Sahu Sabha</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin-panel');
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-yellow-500 text-gray-900 font-medium' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {menuItems.find(i => pathname === i.path || (pathname.startsWith(i.path) && i.path !== '/admin-panel'))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">{user?.name || 'Admin'}</span>
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
