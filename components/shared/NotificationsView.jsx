'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Bell,
  CheckCircle2,
  CalendarCheck,
  Clock,
  UserPlus,
  XCircle,
  BarChart3,
  CheckCheck,
} from 'lucide-react';

export default function NotificationsView() {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useConsultHub();

  const userNotifs = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : [];

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return <CalendarCheck size={18} className="text-success" />;
      case 'booking_pending':
        return <Clock size={18} className="text-warning" />;
      case 'reminder':
        return <Bell size={18} className="text-info" />;
      case 'completed':
        return <CheckCircle2 size={18} className="text-success" />;
      case 'new_booking':
        return <UserPlus size={18} className="text-primary" />;
      case 'cancelled':
        return <XCircle size={18} className="text-danger" />;
      default:
        return <BarChart3 size={18} className="text-info" />;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Notifications & Updates</h2>
          <p>Review system alerts, consultation request updates, and appointment reminders.</p>
        </div>
        {userNotifs.some((n) => !n.read) && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={markAllNotificationsAsRead}
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {userNotifs.length === 0 ? (
        <div className="empty-state">
          <Bell size={40} className="empty-icon text-muted" />
          <h4>No Notifications</h4>
          <p>You have no recent notification alerts.</p>
        </div>
      ) : (
        <div className="notifications-container-list">
          {userNotifs.map((n) => (
            <div
              key={n.id}
              className={`notification-item-card ${!n.read ? 'unread' : ''}`}
              onClick={() => markNotificationAsRead(n.id)}
            >
              <div className="notif-icon-box">{getNotifIcon(n.type)}</div>
              <div className="notif-content-box">
                <div className="notif-header-line">
                  <h4>{n.title}</h4>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p>{n.message}</p>
              </div>
              {!n.read && <span className="unread-dot" title="Unread" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
