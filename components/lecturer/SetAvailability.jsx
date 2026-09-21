'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  MapPin,
  Video,
  CheckCircle2,
} from 'lucide-react';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SetAvailability() {
  const { currentUser, availability, addAvailabilitySlot, removeAvailabilitySlot } =
    useConsultHub();

  const lecturerId = currentUser?.id || 'L001';
  const myDays = availability[lecturerId] || [];

  const [formDay, setFormDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [locationType, setLocationType] = useState('physical');
  const [roomLocation, setRoomLocation] = useState('Room 3.12');
  const [virtualPlatform, setVirtualPlatform] = useState('Google Meet');

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    const finalLocation =
      locationType === 'physical' ? roomLocation : `Online (${virtualPlatform})`;

    addAvailabilitySlot(lecturerId, formDay, {
      start: startTime,
      end: endTime,
      location: finalLocation,
    });
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Consultation Availability Hours</h2>
          <p>Define regular weekly consultation slots available for student bookings.</p>
        </div>
      </div>

      <div className="availability-layout">
        {/* Current Availability List */}
        <div className="availability-list-panel">
          <div className="panel-header">
            <h3>Current Weekly Slots</h3>
            <span className="count-text">
              {myDays.reduce((total, d) => total + d.slots.length, 0)} total slots
            </span>
          </div>

          <div className="days-slots-wrapper">
            {WEEKDAYS.map((dayName) => {
              const dayObj = myDays.find((d) => d.day.toLowerCase() === dayName.toLowerCase());
              const slots = dayObj?.slots || [];

              return (
                <div key={dayName} className="day-slot-card">
                  <div className="day-slot-header">
                    <h4>{dayName}</h4>
                    <span className="slot-count-badge">{slots.length} slots</span>
                  </div>

                  {slots.length === 0 ? (
                    <p className="no-slots-note">No consultation hours configured.</p>
                  ) : (
                    <div className="slot-chips-grid">
                      {slots.map((slot, index) => {
                        const isVirtual = slot.location.toLowerCase().includes('online');
                        return (
                          <div key={index} className="slot-chip">
                            <div className="slot-chip-main">
                              <span className="slot-chip-time">
                                <Clock size={13} />
                                {slot.start} - {slot.end}
                              </span>
                              <span className="slot-chip-location">
                                {isVirtual ? <Video size={13} /> : <MapPin size={13} />}
                                {slot.location}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="chip-delete-btn"
                              onClick={() => removeAvailabilitySlot(lecturerId, dayName, index)}
                              title="Delete time slot"
                              aria-label="Delete time slot"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Slot Form */}
        <div className="add-slot-panel">
          <div className="panel-header">
            <h3>Add New Time Slot</h3>
          </div>

          <form onSubmit={handleAddSlotSubmit} className="add-slot-form">
            <div className="form-group">
              <label htmlFor="slot-day">Day of Week</label>
              <div className="input-icon">
                <Calendar size={18} className="input-icon-svg" />
                <select
                  id="slot-day"
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value)}
                >
                  {WEEKDAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="start-time">Start Time</label>
                <div className="input-icon">
                  <Clock size={18} className="input-icon-svg" />
                  <input
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="end-time">End Time</label>
                <div className="input-icon">
                  <Clock size={18} className="input-icon-svg" />
                  <input
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Location Type</label>
              <div className="radio-pills">
                <button
                  type="button"
                  className={`radio-pill ${locationType === 'physical' ? 'active' : ''}`}
                  onClick={() => setLocationType('physical')}
                >
                  <MapPin size={15} />
                  <span>Physical Office</span>
                </button>
                <button
                  type="button"
                  className={`radio-pill ${locationType === 'online' ? 'active' : ''}`}
                  onClick={() => setLocationType('online')}
                >
                  <Video size={15} />
                  <span>Virtual Link</span>
                </button>
              </div>
            </div>

            {locationType === 'physical' ? (
              <div className="form-group">
                <label htmlFor="room-loc">Room / Office Location</label>
                <div className="input-icon">
                  <MapPin size={18} className="input-icon-svg" />
                  <input
                    type="text"
                    id="room-loc"
                    placeholder="e.g. Block N28, Room 3.12"
                    value={roomLocation}
                    onChange={(e) => setRoomLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="virtual-platform">Virtual Platform</label>
                <div className="input-icon">
                  <Video size={18} className="input-icon-svg" />
                  <select
                    id="virtual-platform"
                    value={virtualPlatform}
                    onChange={(e) => setVirtualPlatform(e.target.value)}
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full">
              <Plus size={18} />
              <span>Add Consultation Slot</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
