'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';

const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function ManageBookings() {
  const {
    currentUser,
    appointments,
    users,
    approveAppointment,
    rejectAppointment,
    markAttendance,
  } = useConsultHub();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const lecturerId = currentUser?.id || 'L001';
  const myBookings = appointments.filter((a) => a.lecturerId === lecturerId);

  const filtered = myBookings.filter((app) => {
    const matchesTab =
      activeTab === 'All' || app.status.toLowerCase() === activeTab.toLowerCase();
    const student = users.students.find((s) => s.id === app.studentId);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      student?.name.toLowerCase().includes(q) ||
      student?.matric.toLowerCase().includes(q) ||
      app.purpose.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Manage Student Bookings</h2>
          <p>Review incoming consultation requests, approve slots, and record attendance outcomes.</p>
        </div>
      </div>

      <div className="filter-search-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by student name, matric, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs-bar">
          {TABS.map((tab) => {
            const count =
              tab === 'All'
                ? myBookings.length
                : myBookings.filter((a) => a.status.toLowerCase() === tab.toLowerCase()).length;

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
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Calendar size={40} className="empty-icon text-muted" />
          <h4>No Bookings Found</h4>
          <p>No consultation records matched the selected criteria.</p>
        </div>
      ) : (
        <div className="table-responsive-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Consultation Date</th>
                <th>Time & Location</th>
                <th>Topic / Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const student = users.students.find((s) => s.id === item.studentId);
                const isVirtual = item.location.toLowerCase().includes('online');

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="table-user-cell">
                        <UTHMAvatar user={student} size={32} className="avatar-sm" />
                        <div>
                          <span className="table-user-name">{student?.name || 'Student'}</span>
                          <span className="table-user-sub">
                            {student?.matric} • Year {student?.year}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="table-date-cell">
                        <span className="font-medium">{item.date}</span>
                        <span className="text-muted text-xs">{item.day}</span>
                      </div>
                    </td>

                    <td>
                      <div className="table-meta-cell">
                        <span className="text-xs font-medium">
                          {item.start} - {item.end}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          {isVirtual ? <Video size={12} /> : <MapPin size={12} />}
                          {item.location}
                        </span>
                      </div>
                    </td>

                    <td>
                      <p className="table-purpose-text" title={item.purpose}>
                        {item.purpose}
                      </p>
                    </td>

                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions-cell">
                        {item.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-xs btn-success"
                              onClick={() => approveAppointment(item.id)}
                              title="Approve consultation"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-secondary text-danger"
                              onClick={() => rejectAppointment(item.id)}
                              title="Decline consultation"
                            >
                              <X size={14} />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {item.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-xs btn-success"
                              onClick={() => markAttendance(item.id, 'attended')}
                            >
                              <CheckCircle2 size={13} />
                              <span>Attended</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-secondary text-danger"
                              onClick={() => markAttendance(item.id, 'no-show')}
                            >
                              <XCircle size={13} />
                              <span>No-Show</span>
                            </button>
                          </>
                        )}

                        {item.status === 'completed' && (
                          <span
                            className={`text-xs font-medium ${
                              item.attendance === 'attended' ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {item.attendance === 'attended' ? 'Attended' : 'No-Show Recorded'}
                          </span>
                        )}

                        {item.status === 'cancelled' && (
                          <span className="text-xs text-muted">Cancelled</span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="text-xs text-danger">Declined</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
