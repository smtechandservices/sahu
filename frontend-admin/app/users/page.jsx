'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import {
  Users, Search, Edit, Trash2, X, Shield, CheckCircle, XCircle, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const EMPTY_FORM = {
  name: '',
  email: '',
  is_member: false,
  is_admin: false,
  is_active: true,
};

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await fetchApi('/users/');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (userId) => {
    setLoadingSessions(true);
    try {
      const data = await fetchApi(`/users/${userId}/sessions/`);
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      is_member: user.is_member ?? false,
      is_admin: user.is_admin ?? false,
      is_active: user.is_active ?? true,
    });
    setModalOpen(true);
    fetchSessions(user.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setSessions([]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi(`/users/${editingUser.id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          is_member: form.is_member,
          is_admin: form.is_admin,
          is_active: form.is_active,
        }),
      });
      await fetchUsers();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User updated successfully!',
        confirmButtonColor: '#3b82f6',
      });
      closeModal();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Save',
        text: err.message || 'Failed to save user',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, user) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete user "${user.name}" (${user.phone})? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(user.id);
        try {
          await fetchApi(`/users/${user.id}/`, { method: 'DELETE' });
          setUsers(prev => prev.filter(u => u.id !== user.id));
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to delete user.', 'error');
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const handleRevokeSession = async (sessionId) => {
    Swal.fire({
      title: 'Revoke Session?',
      text: 'This will log out the user from this device.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, revoke it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetchApi(`/users/${editingUser.id}/revoke-session/`, {
            method: 'POST',
            body: JSON.stringify({ session_id: sessionId })
          });
          Swal.fire('Revoked!', 'The session has been revoked.', 'success');
          fetchSessions(editingUser.id);
        } catch (err) {
          Swal.fire('Error', 'Failed to revoke session.', 'error');
        }
      }
    });
  };

  const handleRevokeAllSessions = async () => {
    Swal.fire({
      title: 'Revoke All Sessions?',
      text: 'This will log out the user from all devices.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, revoke all!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetchApi(`/users/${editingUser.id}/revoke-all-sessions/`, {
            method: 'POST'
          });
          Swal.fire('Revoked!', 'All sessions have been revoked.', 'success');
          fetchSessions(editingUser.id);
        } catch (err) {
          Swal.fire('Error', 'Failed to revoke sessions.', 'error');
        }
      }
    });
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.includes(searchQuery) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">User Management</h1>
          <p className="text-gray-500 font-medium">View, edit roles, and manage community members.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
          <Users size={18} className="text-primary" />
          <span className="text-sm font-bold text-gray-700">{users.length} Total Users</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-20 text-center">
          <Users size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        {user.email && <p className="text-xs text-gray-400">{user.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{user.phone}</td>
                  <td className="px-6 py-4">
                    {user.is_member
                      ? <CheckCircle size={18} className="text-green-500" />
                      : <XCircle size={18} className="text-gray-300" />}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_admin
                      ? <Shield size={18} className="text-primary" />
                      : <XCircle size={18} className="text-gray-300" />}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      user.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                    {new Date(user.date_joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, user)}
                        disabled={deletingId === user.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Edit User</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1 flex items-center gap-1">
                    <Phone size={12} /> {editingUser?.phone}
                  </p>
                </div>
                <button onClick={closeModal} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name <span className="text-red-400">*</span></label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  {[
                    { key: 'is_member', label: 'Member', desc: 'Has paid membership access' },
                    { key: 'is_admin', label: 'Administrator', desc: 'Full admin panel access' },
                    { key: 'is_active', label: 'Active', desc: 'Can log in to the platform' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{label}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${form[key] ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form[key] ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* ── Active Sessions ── */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Shield size={15} className="text-primary" />
                      Active Sessions
                      {sessions.length > 0 && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          {sessions.length} / 2
                        </span>
                      )}
                    </p>
                    {sessions.length > 0 && (
                      <button
                        type="button"
                        onClick={handleRevokeAllSessions}
                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        Revoke All
                      </button>
                    )}
                  </div>

                  {loadingSessions ? (
                    <div className="text-xs text-gray-400 italic py-4 text-center bg-gray-50 rounded-xl">
                      Loading sessions…
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-xs text-gray-400 italic py-4 text-center bg-gray-50 rounded-xl">
                      No active sessions found.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-start justify-between gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-800 truncate">
                              {session.device_name || (session.user_agent ? session.user_agent.slice(0, 50) : 'Unknown Device')}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              IP: {session.ip_address || '—'}&nbsp;·&nbsp;
                              {session.created_at
                                ? new Date(session.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                                : '—'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRevokeSession(session.id)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-white transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
