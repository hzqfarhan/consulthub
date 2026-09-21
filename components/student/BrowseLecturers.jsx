'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Filter,
  GraduationCap,
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Software Engineering',
  'Computer Science',
  'Data Science',
  'Information Security',
];

export default function BrowseLecturers() {
  const { users, availability, navigate } = useConsultHub();
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const lecturers = users.lecturers || [];

  const filteredLecturers = lecturers.filter((lecturer) => {
    const matchesDept = selectedDept === 'All' || lecturer.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lecturer.name.toLowerCase().includes(q) ||
      lecturer.specialization.toLowerCase().includes(q) ||
      lecturer.department.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  const getSlotCount = (lecturerId) => {
    const days = availability[lecturerId] || [];
    return days.reduce((total, d) => total + (d.slots ? d.slots.length : 0), 0);
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Browse Faculty Lecturers</h2>
          <p>Find lecturers by department or specialization to schedule a consultation.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, specialization, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dept-pills">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              className={`pill-btn ${selectedDept === dept ? 'active' : ''}`}
              onClick={() => setSelectedDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Lecturers Grid */}
      {filteredLecturers.length === 0 ? (
        <div className="empty-state">
          <GraduationCap size={44} className="empty-icon text-muted" />
          <h4>No Lecturers Found</h4>
          <p>No faculty members match your search criteria. Try adjusting your filters.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedDept('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="lecturers-grid">
          {filteredLecturers.map((lecturer) => {
            const slotsCount = getSlotCount(lecturer.id);
            return (
              <div key={lecturer.id} className="lecturer-card">
                <div className="lecturer-card-header">
                  <div className="avatar avatar-lg">{lecturer.avatar}</div>
                  <div className="lecturer-info">
                    <h3>{lecturer.name}</h3>
                    <span className="spec-badge">{lecturer.specialization}</span>
                    <span className="dept-text">{lecturer.department}</span>
                  </div>
                </div>

                <div className="lecturer-details-list">
                  <div className="detail-item">
                    <MapPin size={15} />
                    <span>{lecturer.office}</span>
                  </div>
                  <div className="detail-item">
                    <Mail size={15} />
                    <span>{lecturer.email}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={15} />
                    <span>{lecturer.phone}</span>
                  </div>
                </div>

                <div className="lecturer-card-footer">
                  <span className="slots-badge">
                    <Calendar size={14} />
                    <span>{slotsCount} slots available</span>
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('lecturer-detail', lecturer.id)}
                  >
                    <span>Book Session</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
