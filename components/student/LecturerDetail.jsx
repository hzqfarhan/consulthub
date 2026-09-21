'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
} from 'lucide-react';

export default function LecturerDetail() {
  const { pageData, users, availability, currentUser, bookAppointment, navigate, showToast } =
    useConsultHub();

  const lecturerId = pageData || 'L001';
  const lecturer = users.lecturers.find((l) => l.id === lecturerId) || users.lecturers[0];
  const lecturerAvailability = availability[lecturerId] || [];

  const [selectedDay, setSelectedDay] = useState(
    lecturerAvailability.length > 0 ? lecturerAvailability[0].day : 'Monday'
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState('');

  const currentDayData = lecturerAvailability.find((d) => d.day === selectedDay);
  const currentSlots = currentDayData?.slots || [];

  // Helper to generate a realistic date for the chosen weekday
  const getNextDateForDay = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = days.indexOf(dayName);
    const today = new Date();
    const currentDayIndex = today.getDay();
    let diff = targetDayIndex - currentDayIndex;
    if (diff <= 0) diff += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    return nextDate.toISOString().split('T')[0];
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      showToast('Please select a time slot.', 'warning');
      return;
    }
    if (!purpose.trim()) {
      showToast('Please provide the purpose for your consultation.', 'warning');
      return;
    }

    const bookingDate = getNextDateForDay(selectedDay);

    bookAppointment({
      studentId: currentUser?.id || 'S001',
      lecturerId: lecturer.id,
      date: bookingDate,
      day: selectedDay,
      start: selectedSlot.start,
      end: selectedSlot.end,
      location: selectedSlot.location,
      purpose: purpose.trim(),
    });

    navigate('my-bookings');
  };

  return (
    <div className="page-container">
      <div className="detail-top-nav">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('browse-lecturers')}
        >
          <ArrowLeft size={16} />
          <span>Back to Lecturers</span>
        </button>
      </div>

      <div className="lecturer-profile-banner">
        <div className="avatar avatar-xl">{lecturer.avatar}</div>
        <div className="profile-details">
          <h2>{lecturer.name}</h2>
          <div className="badge-row">
            <span className="spec-badge">{lecturer.specialization}</span>
            <span className="dept-badge">{lecturer.department}</span>
          </div>
          <div className="profile-contact-row">
            <span className="contact-item">
              <MapPin size={15} />
              {lecturer.office}
            </span>
            <span className="contact-item">
              <Mail size={15} />
              {lecturer.email}
            </span>
            <span className="contact-item">
              <Phone size={15} />
              {lecturer.phone}
            </span>
          </div>
        </div>
      </div>

      <div className="booking-card">
        <div className="booking-card-header">
          <h3>Select Consultation Slot</h3>
          <p>Choose an available day and time slot to book your session.</p>
        </div>

        {lecturerAvailability.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={36} className="text-warning empty-icon" />
            <h4>No Available Slots</h4>
            <p>This lecturer has not published any consultation hours yet.</p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            {/* Day Selector */}
            <div className="day-tabs-container">
              <label className="section-sublabel">Select Day</label>
              <div className="day-tabs">
                {lecturerAvailability.map((avail) => (
                  <button
                    key={avail.day}
                    type="button"
                    className={`day-tab ${selectedDay === avail.day ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDay(avail.day);
                      setSelectedSlot(null);
                    }}
                  >
                    <Calendar size={15} />
                    <span>{avail.day}</span>
                    <span className="count-badge">{avail.slots.length}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slots Grid */}
            <div className="slots-selection-container">
              <label className="section-sublabel">Available Slots for {selectedDay}</label>
              <div className="slots-picker-grid">
                {currentSlots.map((slot, index) => {
                  const isSelected =
                    selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                  const isVirtual = slot.location.toLowerCase().includes('online');

                  return (
                    <button
                      key={index}
                      type="button"
                      className={`slot-card-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="slot-time">
                        <Clock size={16} />
                        <span>
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                      <div className="slot-location">
                        {isVirtual ? <Video size={14} /> : <MapPin size={14} />}
                        <span>{slot.location}</span>
                      </div>
                      {isSelected && (
                        <div className="slot-selected-indicator">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purpose Input */}
            <div className="form-group booking-purpose-group">
              <label htmlFor="consultation-purpose">Purpose of Consultation</label>
              <textarea
                id="consultation-purpose"
                rows={3}
                placeholder="State your consultation topic, course code, and questions in detail..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>

            <div className="booking-submit-row">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!selectedSlot || !purpose.trim()}
              >
                <span>Confirm Consultation Booking</span>
                <CheckCircle2 size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
