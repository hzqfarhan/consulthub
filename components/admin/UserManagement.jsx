'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
import {
  Users,
  Search,
  Mail,
  Phone,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

const ROLES = ['All', 'Students', 'Lecturers', 'Admins'];

export default function UserManagement() {
  const { users } = useConsultHub();
  const [activeRole, setActiveRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allUsers = [
    ...users.students.map((s) => ({ ...s, role: 'Student' })),
    ...users.lecturers.map((l) => ({ ...l, role: 'Lecturer' })),
    ...users.admins.map((a) => ({ ...a, role: 'Admin' })),
  ];

  const filtered = allUsers.filter((u) => {
    const matchesRole =
      activeRole === 'All' ||
      (activeRole === 'Students' && u.role === 'Student') ||
      (activeRole === 'Lecturers' && u.role === 'Lecturer') ||
      (activeRole === 'Admins' && u.role === 'Admin');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.matric && u.matric.toLowerCase().includes(q)) ||
      (u.staffId && u.staffId.toLowerCase().includes(q));

    return matchesRole && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>User Directory & Access Management</h2>
          <p>View and manage all faculty students, lecturers, and system administrators.</p>
        </div>
      </div>

      <div className="filter-search-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, matric, or staff ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs-bar">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              className={`filter-tab-btn ${activeRole === r ? 'active' : ''}`}
              onClick={() => setActiveRole(r)}
            >
              <span>{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>ID / Matric</th>
              <th>Department / Programme</th>
              <th>Contact Details</th>
              <th>Status / Record</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="table-user-cell">
                    <UTHMAvatar user={user} size={32} className="avatar-sm" />
                    <div>
                      <span className="table-user-name">{user.name}</span>
                      <span className="table-user-sub">{user.email}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={`role-pill role-pill-${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <span className="font-mono text-xs">{user.matric || user.staffId || '-'}</span>
                </td>

                <td>
                  <span className="text-xs">{user.programme || user.department || 'Administration'}</span>
                </td>

                <td>
                  <div className="table-meta-cell">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Phone size={12} />
                      {user.phone || 'N/A'}
                    </span>
                  </div>
                </td>

                <td>
                  {user.noShows > 0 ? (
                    <span className="no-show-warning-pill">
                      <AlertTriangle size={12} />
                      <span>{user.noShows} No-Shows</span>
                    </span>
                  ) : (
                    <span className="text-xs text-success font-medium">Good Standing</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
