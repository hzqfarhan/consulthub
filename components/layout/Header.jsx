'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import { Menu, Search, Bell } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  'browse-lecturers': 'Browse Lecturers',
  'my-bookings': 'My Bookings',
  'lecturer-detail': 'Book Consultation',
  'my-schedule': 'My Schedule',
  'set-availability': 'Set Availability',
  'manage-bookings': 'Manage Bookings',
  'user-management': 'User Management',
  'all-bookings': 'All Bookings',
  reports: 'Reports & Analytics',
  announcements: 'Faculty Announcements',
  notifications: 'Notifications',
  profile: 'My Profile',
};

export default function Header() {
  const { currentPage, currentUser, notifications, navigate, sidebarOpen, setSidebarOpen } = useConsultHub();

  const unreadCount = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length
    : 0;

  const title = PAGE_TITLES[currentPage] || 'Dashboard';

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="btn-icon mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-breadcrumb">
          <span className="page-title">{title}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search consultation, lecturer..."
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className="btn-icon notification-bell"
          onClick={() => navigate('notifications')}
          aria-label="View notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        <div
          className="header-avatar"
          onClick={() => navigate('profile')}
          title={currentUser ? currentUser.name : 'User Profile'}
          role="button"
          tabIndex={0}
        >
          <div className="avatar">{currentUser?.avatar || 'U'}</div>
        </div>
      </div>
    </header>
  );
}
