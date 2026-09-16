import { useEffect, useState } from 'react';
import { Users, Shield, GraduationCap, Trash2, Loader2, Search, AlertCircle, UserPlus, X, Save, CheckCircle2 } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Notifications', to: '/admin/notifications' },
];

interface CreateUserForm {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'student';
}

const emptyCreateForm: CreateUserForm = {
  email: '',
  password: '',
  full_name: '',
  role: 'student',
};

export default function AdminUsers() {
  const { profile: myProfile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>(emptyCreateForm);
  const [creating, setCreating] = useState(false);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setUsers((data as Profile[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.full_name || '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccessMsg('');

    if (createForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setCreating(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      setError('Your session has expired. Please sign in again.');
      setCreating(false);
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: createForm.email,
          password: createForm.password,
          full_name: createForm.full_name,
          role: createForm.role,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || 'Failed to create user.');
      setCreating(false);
      return;
    }

    setSuccessMsg(`Account created for ${createForm.email}. They can now sign in.`);
    setCreateForm(emptyCreateForm);
    setShowCreateForm(false);
    setCreating(false);
    loadUsers();

    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'student') => {
    setUpdatingId(userId);
    setError('');
    const { error } = await supabase
      .rpc('admin_update_user_role', { target_user_id: userId, new_role: newRole });
    if (error) {
      setError(error.message);
    } else {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    }
    setUpdatingId(null);
  };

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (!confirm(`Remove ${user.full_name || user.email}? This will delete their account and all associated data.`)) return;

    setUpdatingId(userId);
    setError('');

    const { error: deleteError } = await supabase
      .rpc('admin_delete_user', { target_user_id: userId });

    if (deleteError) {
      setError(deleteError.message);
      setUpdatingId(null);
      return;
    }

    setUsers(users.filter((u) => u.id !== userId));
    setUpdatingId(null);
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const studentCount = users.filter((u) => u.role === 'student').length;

  return (
    <>
      <SEO title="Manage Users — Alyntis Admin" description="Manage user accounts and roles" />
      <PlatformNav links={adminLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Users</h1>
              <p className="mt-1 text-sm text-gray-400">
                Create accounts, change roles and manage users. {adminCount} admin{adminCount !== 1 ? 's' : ''},{' '}
                {studentCount} student{studentCount !== 1 ? 's' : ''}.
              </p>
            </div>
            <button
              onClick={() => { setShowCreateForm(true); setError(''); setSuccessMsg(''); }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl"
            >
              <UserPlus className="h-4 w-4" />
              Create User
            </button>
          </div>

          {successMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20">
                  <Users className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-gray-400">Total Users</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
                  <Shield className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{adminCount}</p>
                  <p className="text-xs text-gray-400">Admins</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-700">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentCount}</p>
                  <p className="text-xs text-gray-400">Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {loading ? (
            <LoadingState />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title={searchQuery ? 'No users found' : 'No users yet'}
              message={searchQuery ? 'Try adjusting your search.' : 'Create your first user account to get started.'}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-white sm:px-6">User</th>
                    <th className="hidden px-4 py-3 text-sm font-semibold text-white sm:table-cell sm:px-6">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold text-white sm:px-6">Role</th>
                    <th className="hidden px-4 py-3 text-sm font-semibold text-white lg:table-cell lg:px-6">Joined</th>
                    <th className="px-4 py-3 text-sm font-semibold text-white sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => {
                    const isMe = user.id === myProfile?.id;
                    return (
                      <tr key={user.id} className="bg-white/[0.02] transition-colors hover:bg-white/5">
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xs font-bold text-white">
                              {(user.full_name || user.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {user.full_name || 'Unnamed'}
                                {isMe && <span className="ml-2 text-xs text-teal-400">(You)</span>}
                              </p>
                              <p className="truncate text-xs text-gray-400 sm:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-sm text-gray-300 sm:table-cell sm:px-6">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <select
                            value={user.role}
                            disabled={isMe || updatingId === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'student')}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors disabled:opacity-60 ${
                              user.role === 'admin'
                                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                                : 'border-teal-500/30 bg-teal-500/10 text-teal-400'
                            }`}
                          >
                            <option value="student" className="bg-navy-900 text-white">Student</option>
                            <option value="admin" className="bg-navy-900 text-white">Admin</option>
                          </select>
                        </td>
                        <td className="hidden px-4 py-3 text-sm text-gray-400 lg:table-cell lg:px-6">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {isMe ? (
                            <span className="text-xs text-gray-600">—</span>
                          ) : updatingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          ) : (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                              title="Remove user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Create user form modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Create New User</h2>
                  </div>
                  <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Full Name *</label>
                    <input
                      type="text"
                      value={createForm.full_name}
                      onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                      required
                      placeholder="e.g. John Smith"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Email *</label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      required
                      placeholder="user@example.com"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Password *</label>
                    <input
                      type="text"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                      Set a temporary password. The user can change it after signing in.
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Role</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, role: 'student' })}
                        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          createForm.role === 'student'
                            ? 'border-teal-500/30 bg-teal-500/10 text-teal-400'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <GraduationCap className="mx-auto mb-1 h-5 w-5" />
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, role: 'admin' })}
                        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          createForm.role === 'admin'
                            ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Shield className="mx-auto mb-1 h-5 w-5" />
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
            <p className="text-xs leading-relaxed text-teal-300">
              <strong className="font-bold">Admin-only sign-up:</strong> Only administrators can
              create new accounts. Public sign-up is disabled. Created accounts are ready to use
              immediately — no email verification needed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
