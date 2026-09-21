'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
  Megaphone,
  BookOpen,
  UserCog,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const { users, appointments, navigate } = useConsultHub();

  const totalUsers =
    users.students.length + users.lecturers.length + users.admins.length;
  const completed = appointments.filter((a) => a.status === 'completed');
  const attended = completed.filter((a) => a.attendance === 'attended').length;
  const attendanceRate =
    completed.length > 0 ? Math.round((attended / completed.length) * 100) : 100;

  // Department counts
  const deptCounts = {
    'Software Engineering': appointments.filter((a) => {
      const l = users.lecturers.find((lec) => lec.id === a.lecturerId);
      return l?.department === 'Software Engineering';
    }).length,
    'Computer Science': appointments.filter((a) => {
      const l = users.lecturers.find((lec) => lec.id === a.lecturerId);
      return l?.department === 'Computer Science';
    }).length,
    'Data Science': appointments.filter((a) => {
      const l = users.lecturers.find((lec) => lec.id === a.lecturerId);
      return l?.department === 'Data Science';
    }).length,
    'Information Security': appointments.filter((a) => {
      const l = users.lecturers.find((lec) => lec.id === a.lecturerId);
      return l?.department === 'Information Security';
    }).length,
  };

  return (
    <div className="dashboard-layout">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>FSKTM Administration Portal</h2>
          <p>Faculty-wide consultation scheduling overview and system management.</p>
        </div>
        <div className="banner-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('announcements')}
          >
            <Megaphone size={16} />
            <span>Post Notice</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('all-bookings')}
          >
            <BookOpen size={16} />
            <span>All Bookings</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalUsers}</span>
            <span className="stat-label">Registered Users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <CalendarCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{appointments.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{attendanceRate}%</span>
            <span className="stat-label">Faculty Attendance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-accent">
            <ShieldCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">Active</span>
            <span className="stat-label">System Health</span>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        {/* Department Utilization */}
        <div className="dashboard-section main-col">
          <div className="section-header">
            <h3>Consultations by Department</h3>
            <button
              type="button"
              className="link-btn text-primary font-medium"
              onClick={() => navigate('reports')}
            >
              Full Analytics
            </button>
          </div>

          <div className="department-stat-bars">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const percentage =
                appointments.length > 0
                  ? Math.round((count / appointments.length) * 100)
                  : 0;
              return (
                <div key={dept} className="dept-progress-item">
                  <div className="dept-progress-labels">
                    <span className="dept-name">{dept}</span>
                    <span className="dept-count">
                      {count} bookings ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links / System Actions */}
        <div className="dashboard-section side-col">
          <div className="section-header">
            <h3>System Shortcuts</h3>
          </div>

          <div className="quick-actions-menu">
            <button
              type="button"
              className="quick-action-item"
              onClick={() => navigate('user-management')}
            >
              <UserCog size={18} />
              <div>
                <h5>User Management</h5>
                <p>Manage {users.students.length} students and {users.lecturers.length} lecturers</p>
              </div>
            </button>

            <button
              type="button"
              className="quick-action-item"
              onClick={() => navigate('all-bookings')}
            >
              <BookOpen size={18} />
              <div>
                <h5>Consultation Registry</h5>
                <p>Review faculty consultation logs</p>
              </div>
            </button>

            <button
              type="button"
              className="quick-action-item"
              onClick={() => navigate('announcements')}
            >
              <Megaphone size={18} />
              <div>
                <h5>Faculty Notices</h5>
                <p>Broadcast system announcements</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
