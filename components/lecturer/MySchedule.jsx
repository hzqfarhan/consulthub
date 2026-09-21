'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MySchedule() {
  const { currentUser, appointments, users, markAttendance } = useConsultHub();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const lecturerId = currentUser?.id || 'L001';
  const myAppointments = appointments.filter(
    (a) => a.lecturerId === lecturerId && (a.status === 'confirmed' || a.status === 'completed')
  );

  const dayAppointments = myAppointments.filter((a) => a.day === selectedDay);

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>My Consultation Schedule</h2>
          <p>Review confirmed consultation slots by day and record student attendance.</p>
        </div>
      </div>

      {/* Weekday Switcher */}
      <div className="day-tabs-container">
        <div className="day-tabs">
          {WEEKDAYS.map((day) => {
            const count = myAppointments.filter((a) => a.day === day).length;
            return (
              <button
                key={day}
                type="button"
                className={`day-tab ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <Calendar size={15} />
                <span>{day}</span>
                {count > 0 && <span className="count-badge">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Content */}
      <div className="schedule-content-box">
        <div className="schedule-box-header">
          <h3>Scheduled Sessions for {selectedDay}</h3>
          <span className="count-text">{dayAppointments.length} sessions</span>
        </div>

        {dayAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={40} className="empty-icon text-muted" />
            <h4>No Sessions on {selectedDay}</h4>
            <p>You have no confirmed consultations scheduled for this weekday.</p>
          </div>
        ) : (
          <div className="schedule-cards-list">
            {dayAppointments.map((item) => {
              const student = users.students.find((s) => s.id === item.studentId);
              const isVirtual = item.location.toLowerCase().includes('online');

              return (
                <div key={item.id} className="schedule-card">
                  <div className="schedule-time-badge">
                    <Clock size={16} />
                    <span>
                      {item.start} - {item.end}
                    </span>
                  </div>

                  <div className="schedule-student-details">
                    <UTHMAvatar user={student} size={44} className="avatar-md" />
                    <div className="student-text">
                      <h4>{student?.name || 'Student'}</h4>
                      <span className="student-sub">
                        {student?.matric} • {student?.programme} (Year {student?.year})
                      </span>
                    </div>
                  </div>

                  <div className="schedule-topic-box">
                    <div className="topic-header">
                      <FileText size={14} />
                      <span>Consultation Topic</span>
                    </div>
                    <p>{item.purpose}</p>
                  </div>

                  <div className="schedule-footer-row">
                    <div className="location-info">
                      {isVirtual ? <Video size={15} /> : <MapPin size={15} />}
                      <span>{item.location}</span>
                    </div>

                    <div className="attendance-action-group">
                      {item.attendance ? (
                        <span
                          className={`attendance-status-pill ${
                            item.attendance === 'attended' ? 'status-attended' : 'status-noshow'
                          }`}
                        >
                          {item.attendance === 'attended' ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            <XCircle size={15} />
                          )}
                          <span>
                            {item.attendance === 'attended' ? 'Attended' : 'No-Show Recorded'}
                          </span>
                        </span>
                      ) : (
                        <div className="attendance-buttons">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => markAttendance(item.id, 'attended')}
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark Attended</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary text-danger"
                            onClick={() => markAttendance(item.id, 'no-show')}
                          >
                            <XCircle size={14} />
                            <span>Mark No-Show</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
