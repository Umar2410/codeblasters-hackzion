'use client';

import { useEffect, useState } from 'react';
import { getAllUsersData } from '@/app/actions';
import type { User } from '@/lib/db';
import { ShieldAlert, Users, Database } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsersData().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white-gradient text-slate-900 flex items-center justify-center">Loading database...</div>;
  }

  const userList = Object.values(users);

  return (
    <div className="min-h-screen bg-white-gradient text-text-main p-8 font-sans relative">
      <div className="absolute inset-0 noise-bg z-0" />
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight flex items-center gap-3 text-multicolor">
              <Database className="w-6 h-6 text-violet-500" />
              In-Memory Database
            </h1>
            <p className="text-text-muted mt-2">View stored user details. Delete this page before production.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-sm font-medium shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            Admin View Only
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="limitless-card p-6">
            <div className="text-text-muted text-sm mb-2 flex items-center gap-2 font-medium uppercase tracking-wider"><Users className="w-4 h-4 text-blue-500"/> Total Users</div>
            <div className="text-4xl font-light text-slate-900">{userList.length}</div>
          </div>
        </div>

        <div className="limitless-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Password</th>
                  <th className="px-6 py-4 font-medium">Mobile</th>
                  <th className="px-6 py-4 font-medium">Balance</th>
                  <th className="px-6 py-4 font-medium">Bank Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {userList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted">No users found in memory.</td>
                  </tr>
                ) : (
                  userList.map((user) => (
                    <tr key={user.email} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.email}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{user.password || '-'}</td>
                      <td className="px-6 py-4 font-mono text-slate-900">{user.mobile || '-'}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">₹{user.balance.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-slate-700">{user.bankDetails?.bankName || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
