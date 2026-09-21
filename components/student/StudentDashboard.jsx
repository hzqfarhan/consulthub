'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Plus,
  Clock,
  MapPin,
  Megaphone,
  AlertCircle,
  Info,
  ChevronRight,
} from 'lucide-react';

export default function StudentDashboard() {
  const {
    currentUser,
    appointments,
    announcements,
    users,
    navigate,
    openModal,
    closeModal,
    cancelAppointment,
  } = useConsultHub();

  const studentAppointments = appointments.filter((a) => a.studentId === currentUser?.id);
  const upcomingAppointments = studentAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );
  const completedAppointments = studentAppointments.filter((a) => a.status === 'completed');
  const attendedCount = completedAppointments.filter((a) => a.attendance === 'attended').length;
  const attendanceRate =
    completedAppointments.length > 0
      ? Math.round((attendedCount / completedAppointments.length) * 100)
      : 100;

  const handleCancelClick = (appointment) => {
    openModal(
      'Cancel Consultation',
      <div className="modal-content-wrapper">
        <p>
          Are you sure you want to cancel your consultation on <strong>{appointment.date}</strong> at{' '}
          <strong>{appointment.start}</strong>?
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Keep Booking
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              cancelAppointment(appointment.id);
              closeModal();
            }}
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Hello, {currentUser?.name || 'Student'}</h2>
          <p>You have {upcomingAppointments.length} upcoming consultation sessions scheduled.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('browse-lecturers')}
        >
          <Plus size={18} />
          <span>Book Consultation</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{studentAppointments.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <CalendarCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{upcomingAppointments.length}</span>
            <span className="stat-label">Upcoming / Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedAppointments.length}</span>
            <span className="stat-label">Completed Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-accent">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{attendanceRate}%</span>
            <span className="stat-label">Attendance Rate</span>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        {/* Upcoming Consultations */}
        <div className="dashboard-section main-col">
          <div className="section-header">
            <h3>Upcoming Consultations</h3>
            <button
              type="button"
              className="link-btn text-primary font-medium"
              onClick={() => navigate('my-bookings')}
            >
              View All ({studentAppointments.length})
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <Calendar size={40} className="empty-icon text-muted" />
              <h4>No Upcoming Consultations</h4>
              <p>You have no scheduled consultations. Browse our lecturers to book a session.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate('browse-lecturers')}
              >
                Browse Lecturers
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {upcomingAppointments.slice(0, 3).map((item) => {
                const lecturer = users.lecturers.find((l) => l.id === item.lecturerId);
                return (
                  <div key={item.id} className="appointment-card">
                    <div className="app-date-badge">
                      <span className="date-month">{item.day.slice(0, 3).toUpperCase()}</span>
                      <span className="date-day">{item.date.split('-')[2]}</span>
                    </div>

                    <div className="app-details">
                      <div className="app-header-row">
                        <h4>{lecturer?.name || 'Lecturer'}</h4>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="app-purpose">{item.purpose}</p>
                      <div className="app-meta">
                        <span className="meta-item">
                          <Clock size={14} />
                          {item.start} - {item.end}
                        </span>
                        <span className="meta-item">
                          <MapPin size={14} />
                          {item.location}
                        </span>
                      </div>
                    </div>

                    <div className="app-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCancelClick(item)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Announcements & Quick Tips */}
        <div className="dashboard-section side-col">
          <div className="section-header">
            <h3>Faculty Notices</h3>
            <Megaphone size={18} className="text-muted" />
          </div>

          <div className="announcements-list">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className={`announcement-card ann-${ann.type}`}>
                <div className="ann-header">
                  {ann.type === 'warning' ? (
                    <AlertCircle size={16} className="ann-icon text-warning" />
                  ) : (
                    <Info size={16} className="ann-icon text-info" />
                  )}
                  <h5>{ann.title}</h5>
                </div>
                <p>{ann.message}</p>
                <span className="ann-date">{ann.date}</span>
              </div>
            ))}
          </div>

          <div className="consultation-tips-card">
            <h5>Consultation Guidelines</h5>
            <ul>
              <li>Arrive 5 minutes before your scheduled slot.</li>
              <li>Prepare your assignment questions and notes in advance.</li>
              <li>Cancel at least 2 hours prior if you cannot attend.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
