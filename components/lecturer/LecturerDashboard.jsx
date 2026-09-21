'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Users,
  Check,
  X,
  MapPin,
  Video,
  ArrowRight,
} from 'lucide-react';

export default function LecturerDashboard() {
  const {
    currentUser,
    appointments,
    users,
    navigate,
    approveAppointment,
    rejectAppointment,
  } = useConsultHub();

  const lecturerId = currentUser?.id || 'L001';
  const myBookings = appointments.filter((a) => a.lecturerId === lecturerId);

  const pendingRequests = myBookings.filter((a) => a.status === 'pending');
  const confirmedSessions = myBookings.filter((a) => a.status === 'confirmed');
  const completedSessions = myBookings.filter((a) => a.status === 'completed');

  return (
    <div className="dashboard-layout">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome, {currentUser?.name || 'Lecturer'}</h2>
          <p>
            You have {pendingRequests.length} pending consultation requests requiring your review.
          </p>
        </div>
        <div className="banner-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('set-availability')}
          >
            <Clock size={16} />
            <span>Manage Availability</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('manage-bookings')}
          >
            <CalendarCheck size={16} />
            <span>All Bookings</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{pendingRequests.length}</span>
            <span className="stat-label">Pending Requests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <CalendarCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{confirmedSessions.length}</span>
            <span className="stat-label">Confirmed Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedSessions.length}</span>
            <span className="stat-label">Completed Consultations</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{myBookings.length}</span>
            <span className="stat-label">Total Appointments</span>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        {/* Pending Requests Queue */}
        <div className="dashboard-section main-col">
          <div className="section-header">
            <h3>Pending Consultation Requests</h3>
            <span className="count-pill">{pendingRequests.length}</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={40} className="empty-icon text-success" />
              <h4>All Caught Up</h4>
              <p>You have responded to all incoming consultation requests.</p>
            </div>
          ) : (
            <div className="pending-requests-list">
              {pendingRequests.map((item) => {
                const student = users.students.find((s) => s.id === item.studentId);
                const isVirtual = item.location.toLowerCase().includes('online');

                return (
                  <div key={item.id} className="pending-request-card">
                    <div className="request-student-info">
                      <div className="avatar">{student?.avatar || 'S'}</div>
                      <div className="student-name-col">
                        <h4>{student?.name || 'Student'}</h4>
                        <span className="student-meta">
                          {student?.matric} • Year {student?.year} • {student?.programme}
                        </span>
                      </div>
                    </div>

                    <div className="request-details">
                      <p className="request-purpose">{item.purpose}</p>
                      <div className="request-meta-row">
                        <span className="meta-badge">
                          <Calendar size={14} />
                          {item.day}, {item.date}
                        </span>
                        <span className="meta-badge">
                          <Clock size={14} />
                          {item.start} - {item.end}
                        </span>
                        <span className="meta-badge">
                          {isVirtual ? <Video size={14} /> : <MapPin size={14} />}
                          {item.location}
                        </span>
                      </div>
                    </div>

                    <div className="request-actions">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => approveAppointment(item.id)}
                      >
                        <Check size={16} />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm text-danger"
                        onClick={() => rejectAppointment(item.id)}
                      >
                        <X size={16} />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmed Sessions Schedule */}
        <div className="dashboard-section side-col">
          <div className="section-header">
            <h3>Upcoming Schedule</h3>
            <button
              type="button"
              className="link-btn text-primary font-medium"
              onClick={() => navigate('my-schedule')}
            >
              Calendar View
            </button>
          </div>

          {confirmedSessions.length === 0 ? (
            <div className="empty-state">
              <Calendar size={36} className="empty-icon text-muted" />
              <p>No confirmed appointments scheduled.</p>
            </div>
          ) : (
            <div className="mini-schedule-list">
              {confirmedSessions.slice(0, 4).map((item) => {
                const student = users.students.find((s) => s.id === item.studentId);
                return (
                  <div key={item.id} className="mini-schedule-item">
                    <div className="schedule-time-box">
                      <span className="schedule-time">{item.start}</span>
                      <span className="schedule-day">{item.day.slice(0, 3)}</span>
                    </div>
                    <div className="schedule-info">
                      <h5>{student?.name || 'Student'}</h5>
                      <span className="schedule-sub">{item.purpose}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
