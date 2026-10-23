'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/api';
import {
  Users, Calendar, Home,
  ArrowUpRight, ArrowDownRight,
  Heart, IndianRupee, TrendingUp, Clock, XCircle, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend
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

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const shortInr = (n) => {
  const v = Number(n || 0);
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}k`;
  return `₹${v}`;
};

// One colour per payment type, shared by the chart and the breakdown
const TYPE_COLORS = { Donation: '#EAB308', Membership: '#3B82F6', Matrimonial: '#EC4899' };
const TX_STATUS_STYLES = {
  Success: 'bg-green-50 text-green-600',
  Initiated: 'bg-blue-50 text-blue-600',
  Pending: 'bg-amber-50 text-amber-600',
  Failed: 'bg-red-50 text-red-500',
  Refunded: 'bg-gray-100 text-gray-500',
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
  const [finance, setFinance] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchStats();
      fetchApi('/admin/finance-summary/').then(setFinance).catch((err) => console.error('Failed to fetch finance summary', err));
    }
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

      {/* Finance */}
      <FinanceSection finance={finance} />

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

function StatCard({ icon, label, value, sub, href }) {
    const card = (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl">
                    {icon}
                </div>
            </div>
            <p className="text-sm font-bold text-gray-400 mb-1">{label}</p>
            <h4 className="text-2xl font-black text-gray-900">{value}</h4>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </motion.div>
    );
    return href ? <Link href={href} className="block">{card}</Link> : card;
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

function FinanceSection({ finance }) {
  const change = finance && Number(finance.last_month) > 0
    ? Math.round(((Number(finance.this_month) - Number(finance.last_month)) / Number(finance.last_month)) * 100)
    : null;
  const openCount = finance ? finance.initiated.count + finance.pending.count : 0;
  const openAmount = finance ? Number(finance.initiated.amount) + Number(finance.pending.amount) : 0;
  const typeMax = Math.max(1, ...(finance?.by_type || []).map((t) => Number(t.amount)));
  const monthly = (finance?.monthly || []).map((m) => ({
    name: m.name, Donation: Number(m.Donation), Membership: Number(m.Membership), Matrimonial: Number(m.Matrimonial),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Finance</h2>
          <p className="text-sm text-gray-400">Donations, membership fees and matrimonial fees</p>
        </div>
        <Link href="/transactions" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          All transactions <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<IndianRupee className="text-green-500" />}
          label="Total Collected"
          value={finance ? inr(finance.total_collected) : '—'}
          sub={finance ? `${finance.success_count} successful payments` : ''}
        />
        <StatCard
          icon={<TrendingUp className="text-primary" />}
          label="This Month"
          value={finance ? inr(finance.this_month) : '—'}
          sub={finance ? (change === null ? `Last month ${inr(finance.last_month)}` : `${change >= 0 ? '+' : ''}${change}% vs last month (${inr(finance.last_month)})`) : ''}
        />
        <StatCard
          icon={<Clock className="text-blue-500" />}
          label="Open Payments"
          value={finance ? openCount.toLocaleString('en-IN') : '—'}
          sub={finance ? `${inr(openAmount)} initiated or pending` : ''}
          href="/transactions"
        />
        <StatCard
          icon={<XCircle className="text-red-400" />}
          label="Failed"
          value={finance ? finance.failed.count.toLocaleString('en-IN') : '—'}
          sub={finance ? `${inr(finance.failed.amount)} not collected` : ''}
          href="/transactions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-w-0 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Monthly Collections</h3>
          <p className="text-sm text-gray-400 mb-6">Successful payments over the last 12 months</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={shortInr} width={60} />
                <Tooltip
                  cursor={{ fill: '#FEF9C3', opacity: 0.5 }}
                  formatter={(v, name) => [inr(v), name]}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                {Object.entries(TYPE_COLORS).map(([type, color], i, all) => (
                  <Bar key={type} dataKey={type} stackId="total" fill={color} maxBarSize={40}
                    radius={i === all.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900">By Source</h3>
          <p className="text-sm text-gray-400 mb-6">Successful payments, all time</p>
          <div className="space-y-5">
            {(finance?.by_type || []).map((t) => (
              <div key={t.type}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">{t.type === 'Donation' ? 'Donations' : `${t.type} fees`}</span>
                  <span className="font-black text-gray-900">{inr(t.amount)}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(Number(t.amount) / typeMax) * 100}%`, background: TYPE_COLORS[t.type] }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{t.count} payment{t.count === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
          {finance && (
            <div className="grid grid-cols-2 gap-3 mt-auto pt-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Online</p>
                <p className="text-sm font-black text-gray-900">{inr(finance.online_amount)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Offline</p>
                <p className="text-sm font-black text-gray-900">{inr(finance.offline_amount)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <Link href="/transactions" className="text-sm font-bold text-primary hover:underline">View all</Link>
        </div>
        {!finance ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : finance.recent.length === 0 ? (
          <p className="text-sm text-gray-400">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {finance.recent.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: TYPE_COLORS[tx.type] }} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{tx.name} <span className="text-gray-400 font-medium">· {tx.description}</span></p>
                    <p className="text-xs text-gray-400">{tx.id} · {timeAgo(tx.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-black text-gray-900">{inr(tx.amount)}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${TX_STATUS_STYLES[tx.status] || 'bg-gray-100 text-gray-500'}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
