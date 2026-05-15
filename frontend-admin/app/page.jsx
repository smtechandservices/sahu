'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import {
  Users, Calendar, Home,
  ArrowUpRight, ArrowDownRight,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const ACTIVITY_ICONS = {
  member:      <Users size={16} />,
  booking:     <Home size={16} />,
  matrimonial: <Heart size={16} />,
  event:       <Calendar size={16} />,
};

const ACTIVITY_COLORS = {
  member:      'bg-blue-100 text-blue-600',
  booking:     'bg-orange-100 text-orange-600',
  matrimonial: 'bg-pink-100 text-pink-600',
  event:       'bg-green-100 text-green-600',
};

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ members: 0, bookings: 0, events: 0, matrimonials: 0 });
  const [chartData, setChartData] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!authLoading && user) fetchStats();
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const data = await fetchApi('/admin/dashboard-stats/');
      setStats({
        members: data.counts.members,
        bookings: data.counts.bookings,
        events: data.counts.events,
        matrimonials: data.counts.matrimonials,
      });
      setChartData(data.monthly_data);
      setActivity(data.recent_activity);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
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
        />
        <StatCard
            icon={<Home className="text-orange-500" />}
            label="Bookings"
            value={stats.bookings.toLocaleString()}
        />
        <StatCard
            icon={<Calendar className="text-green-500" />}
            label="Active Events"
            value={stats.events.toLocaleString()}
        />
        <StatCard
            icon={<Heart className="text-pink-500" />}
            label="Matrimonial Profiles"
            value={stats.matrimonials.toLocaleString()}
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
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="members" name="Members" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
                        <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6 flex-1 overflow-auto max-h-[400px] pr-2 scrollbar-hide">
                {activity.length === 0 ? (
                    <p className="text-sm text-gray-400">No recent activity.</p>
                ) : (
                    activity.map((item, i) => (
                        <ActivityItem
                            key={i}
                            icon={ACTIVITY_ICONS[item.type] ?? <Users size={16} />}
                            color={ACTIVITY_COLORS[item.type] ?? 'bg-gray-100 text-gray-600'}
                            title={item.title}
                            desc={item.desc}
                            time={timeAgo(item.timestamp)}
                        />
                    ))
                )}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                View All Activity
            </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl">
                    {icon}
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
