'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import { 
  Users, Calendar, Home, BookOpen, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const data = [
  { name: 'Jan', members: 400, bookings: 240 },
  { name: 'Feb', members: 300, bookings: 139 },
  { name: 'Mar', members: 200, bookings: 980 },
  { name: 'Apr', members: 278, bookings: 390 },
  { name: 'May', members: 189, bookings: 480 },
  { name: 'Jun', members: 239, bookings: 380 },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    members: 0,
    bookings: 0,
    events: 0,
    matrimonials: 0
  });

  useEffect(() => {
    if (!authLoading && user) {
        fetchStats();
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
        // In a real app, you'd have a specific stats endpoint
        const [bookings, events, matrimonials] = await Promise.all([
            fetchApi('/bookings/'),
            fetchApi('/events/'),
            fetchApi('/matrimonial/')
        ]);
        setStats({
            members: 1240, // Mocked for now
            bookings: bookings.length,
            events: events.length,
            matrimonials: matrimonials.length
        });
    } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
    }
  };

  if (authLoading) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={<Users className="text-blue-500" />} 
            label="Total Members" 
            value={stats.members.toLocaleString()} 
            trend="+12%" 
            isUp={true} 
        />
        <StatCard 
            icon={<Home className="text-orange-500" />} 
            label="Bookings" 
            value={stats.bookings.toString()} 
            trend="+5%" 
            isUp={true} 
        />
        <StatCard 
            icon={<Calendar className="text-green-500" />} 
            label="Active Events" 
            value={stats.events.toString()} 
            trend="-2%" 
            isUp={false} 
        />
        <StatCard 
            icon={<Heart className="text-pink-500" />} 
            label="Matrimonial Profiles" 
            value={stats.matrimonials.toString()} 
            trend="+18%" 
            isUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Engagement Overview</h3>
                    <p className="text-sm text-gray-400">Community activity over the last 6 months</p>
                </div>
                <select className="bg-gray-50 border-none rounded-lg text-xs font-bold px-3 py-2 outline-none">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                </select>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="members" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6 flex-1 overflow-auto max-h-[400px] pr-2 scrollbar-hide">
                <ActivityItem 
                    icon={<Users size={16} />} 
                    color="bg-blue-100 text-blue-600"
                    title="New Member Joined"
                    desc="Amit Sahu completed registration"
                    time="2m ago"
                />
                <ActivityItem 
                    icon={<Home size={16} />} 
                    color="bg-orange-100 text-orange-600"
                    title="Room Booked"
                    desc="Booking confirmed for Guest Room #2"
                    time="15m ago"
                />
                <ActivityItem 
                    icon={<Heart size={16} />} 
                    color="bg-pink-100 text-pink-600"
                    title="Profile Approval"
                    desc="New Matrimonial profile needs review"
                    time="1h ago"
                />
                <ActivityItem 
                    icon={<Calendar size={16} />} 
                    color="bg-green-100 text-green-600"
                    title="Event Updated"
                    desc="Cultural Fest details modified"
                    time="3h ago"
                />
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                View All Activity
            </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, isUp }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <p className="text-sm font-bold text-gray-400 mb-1">{label}</p>
            <h4 className="text-2xl font-black text-gray-900">{value}</h4>
        </motion.div>
    );
}

function ActivityItem({ icon, color, title, desc, time }) {
    return (
        <div className="flex gap-4">
            <div className={`shrink-0 w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                {icon}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{title}</p>
                <p className="text-xs text-gray-400 truncate">{desc}</p>
                <p className="text-[10px] text-gray-300 mt-1 font-bold">{time}</p>
            </div>
        </div>
    );
}
