'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Calendar,
  CalendarDays,
  Clock,
  ClipboardList,
  UserCog,
  BookOpen,
  BarChart3,
  Megaphone,
  Bell,
  User,
  LogOut,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const {
    currentRole,
    currentPage,
    currentUser,
    navigate,
    logout,
    notifications,
    appointments,
    sidebarOpen,
    setSidebarOpen,
  } = useConsultHub();

  const unreadNotifs = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length
    : 0;

  const pendingBookingsCount =
    currentRole === 'lecturer' && currentUser
      ? appointments.filter((a) => a.lecturerId === currentUser.id && a.status === 'pending').length
      : 0;

  const studentUpcomingCount =
    currentRole === 'student' && currentUser
      ? appointments.filter((a) => a.studentId === currentUser.id && a.status === 'confirmed').length
      : 0;

  const getNavItems = () => {
    if (currentRole === 'student') {
      return [
        { section: 'Main' },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'browse-lecturers', label: 'Browse Lecturers', icon: Users },
        { id: 'my-bookings', label: 'My Bookings', icon: Calendar, badge: studentUpcomingCount || null },
        { section: 'Account' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs || null },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    } else if (currentRole === 'lecturer') {
      return [
        { section: 'Main' },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-schedule', label: 'My Schedule', icon: CalendarDays },
        { id: 'set-availability', label: 'Set Availability', icon: Clock },
        { id: 'manage-bookings', label: 'Manage Bookings', icon: ClipboardList, badge: pendingBookingsCount || null },
        { section: 'Account' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs || null },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    } else {
      return [
        { section: 'Main' },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'user-management', label: 'User Management', icon: UserCog },
        { id: 'all-bookings', label: 'All Bookings', icon: BookOpen },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { section: 'Account' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs || null },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div
            className="sidebar-brand"
            onClick={() => navigate('dashboard')}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon-sm">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text">
              <span className="sidebar-title">ConsultHub</span>
              <span className="sidebar-subtitle">FSKTM Portal</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            if (item.section) {
              return (
                <div key={`section-${index}`} className="nav-section-label">
                  {item.section}
                </div>
              );
            }
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div
            className="sidebar-user"
            onClick={() => navigate('profile')}
            role="button"
            tabIndex={0}
          >
            <UTHMAvatar user={currentUser} size={36} />
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">
                {currentUser ? currentUser.name.split(' ').slice(0, 2).join(' ') : 'Guest'}
              </span>
              <span className="sidebar-user-role">
                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
