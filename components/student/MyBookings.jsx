'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Plus,
  Video,
} from 'lucide-react';

const FILTER_TABS = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

export default function MyBookings() {
  const {
    currentUser,
    appointments,
    users,
    navigate,
    openModal,
    closeModal,
    cancelAppointment,
    rescheduleAppointment,
    showToast,
  } = useConsultHub();

  const [activeTab, setActiveTab] = useState('All');

  const myAppointments = appointments.filter((a) => a.studentId === currentUser?.id);

  const filtered = myAppointments.filter((app) => {
    if (activeTab === 'All') return true;
    return app.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleCancelClick = (app) => {
    openModal(
      'Cancel Consultation',
      <div className="modal-content-wrapper">
        <p>
          Are you sure you want to cancel your consultation on <strong>{app.date}</strong> at{' '}
          <strong>{app.start}</strong>?
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Keep Appointment
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              cancelAppointment(app.id);
              closeModal();
            }}
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    );
  };

  const handleRescheduleClick = (app) => {
    let newDate = app.date;
    let newStart = app.start;
    let newEnd = app.end;

    openModal(
      'Reschedule Consultation',
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const d = new Date(newDate);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
          rescheduleAppointment(app.id, newDate, dayName, newStart, newEnd, app.location);
          closeModal();
        }}
        className="reschedule-form"
      >
        <p className="modal-desc">
          Select a new date and time for your consultation with{' '}
          <strong>{users.lecturers.find((l) => l.id === app.lecturerId)?.name}</strong>.
        </p>

        <div className="form-group">
          <label htmlFor="resched-date">New Consultation Date</label>
          <input
            type="date"
            id="resched-date"
            defaultValue={app.date}
            onChange={(e) => {
              newDate = e.target.value;
            }}
            required
          />
        </div>

        <div className="form-row-2col">
          <div className="form-group">
            <label htmlFor="resched-start">Start Time</label>
            <input
              type="time"
              id="resched-start"
              defaultValue={app.start}
              onChange={(e) => {
                newStart = e.target.value;
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="resched-end">End Time</label>
            <input
              type="time"
              id="resched-end"
              defaultValue={app.end}
              onChange={(e) => {
                newEnd = e.target.value;
              }}
              required
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Confirm Reschedule
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>My Consultations</h2>
          <p>Manage your booked consultation sessions, check approvals, or reschedule.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('browse-lecturers')}
        >
          <Plus size={18} />
          <span>New Consultation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-bar">
        {FILTER_TABS.map((tab) => {
          const count =
            tab === 'All'
              ? myAppointments.length
              : myAppointments.filter((a) => a.status.toLowerCase() === tab.toLowerCase()).length;

          return (
            <button
              key={tab}
              type="button"
              className={`filter-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              <span className="count-pill">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Calendar size={44} className="empty-icon text-muted" />
          <h4>No {activeTab === 'All' ? '' : activeTab} Consultations</h4>
          <p>
            {activeTab === 'All'
              ? "You haven't booked any consultation appointments yet."
              : `You have no appointments with status "${activeTab}".`}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('browse-lecturers')}
          >
            Browse Lecturers
          </button>
        </div>
      ) : (
        <div className="my-bookings-list">
          {filtered.map((item) => {
            const lecturer = users.lecturers.find((l) => l.id === item.lecturerId);
            const isVirtual = item.location.toLowerCase().includes('online');

            return (
              <div key={item.id} className="booking-item-card">
                <div className="booking-date-col">
                  <span className="booking-day">{item.day.slice(0, 3).toUpperCase()}</span>
                  <span className="booking-day-num">{item.date.split('-')[2]}</span>
                  <span className="booking-month-year">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>

                <div className="booking-content-col">
                  <div className="booking-title-row">
                    <div className="lecturer-name-group">
                      <h4>{lecturer?.name || 'Lecturer'}</h4>
                      <span className="booking-dept">{lecturer?.department}</span>
                    </div>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>

                  <p className="booking-purpose-text">{item.purpose}</p>

                  <div className="booking-meta-row">
                    <span className="meta-badge">
                      <Clock size={14} />
                      <span>
                        {item.start} - {item.end}
                      </span>
                    </span>
                    <span className="meta-badge">
                      {isVirtual ? <Video size={14} /> : <MapPin size={14} />}
                      <span>{item.location}</span>
                    </span>
                    {item.attendance && (
                      <span
                        className={`meta-badge ${
                          item.attendance === 'attended' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {item.attendance === 'attended' ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        <span>
                          {item.attendance === 'attended' ? 'Attended' : 'Marked No-Show'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="booking-actions-col">
                  {item.status !== 'cancelled' && item.status !== 'completed' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRescheduleClick(item)}
                      >
                        <RotateCcw size={14} />
                        <span>Reschedule</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm text-danger"
                        onClick={() => handleCancelClick(item)}
                      >
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  {item.status === 'completed' && (
                    <span className="completed-label">Session Concluded</span>
                  )}
                  {item.status === 'cancelled' && (
                    <span className="cancelled-label">Booking Cancelled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
