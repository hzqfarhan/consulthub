'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  GraduationCap,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Software Engineering',
  'Information Security & Web Technology',
  'Multimedia Computing',
  "Dean's Office",
  'Postgraduate Studies',
];

export default function BrowseLecturers() {
  const { users, availability, navigate } = useConsultHub();
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const lecturers = users.lecturers || [];

  const filteredLecturers = lecturers.filter((lecturer) => {
    const matchesDept =
      selectedDept === 'All' ||
      (lecturer.department &&
        lecturer.department.toLowerCase().includes(selectedDept.toLowerCase()));

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesDept;

    const matchesName = lecturer.name?.toLowerCase().includes(q);
    const matchesCleanName = lecturer.cleanName?.toLowerCase().includes(q);
    const matchesRoom = (lecturer.office || lecturer.roomLocation || '').toLowerCase().includes(q);
    const matchesDeptName = (lecturer.department || '').toLowerCase().includes(q);
    const matchesSpec =
      (lecturer.specialization && lecturer.specialization.toLowerCase().includes(q)) ||
      (lecturer.specialities &&
        lecturer.specialities.some((s) => s.toLowerCase().includes(q)));
    const matchesSubjects =
      lecturer.currentSubjects &&
      lecturer.currentSubjects.some(
        (sub) =>
          sub.code.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q)
      );

    return (
      matchesDept &&
      (matchesName ||
        matchesCleanName ||
        matchesRoom ||
        matchesDeptName ||
        matchesSpec ||
        matchesSubjects)
    );
  });

  const getSlotCount = (lecturerId) => {
    const days = availability[lecturerId] || [];
    return days.reduce((total, d) => total + (d.slots ? d.slots.length : 0), 0);
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>FSKTM Faculty Lecturer Directory</h2>
          <p>
            Official faculty directory for Universiti Tun Hussein Onn Malaysia. Search by name,
            office room, specialization, or course code (e.g. BIT34503).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by lecturer name, room (PB-xxx-xx), course code, or specialization..."
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
          <h4>No FSKTM Lecturers Found</h4>
          <p>No faculty members match your search criteria. Try adjusting your search query or department filter.</p>
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
            const subjects = lecturer.currentSubjects || [];
            const roomNumber = lecturer.roomLocation || lecturer.office || 'FSKTM Faculty';

            return (
              <div key={lecturer.id} className="lecturer-card">
                <div className="lecturer-card-header">
                  <UTHMAvatar user={lecturer} size={56} className="avatar-lg" />
                  <div className="lecturer-info">
                    <h3>{lecturer.name}</h3>
                    <div className="badge-row" style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
                      <span className="spec-badge">{lecturer.specialization}</span>
                      <span className="dept-text">{lecturer.department}</span>
                    </div>
                  </div>
                </div>

                <div className="lecturer-details-list">
                  <div className="detail-item">
                    <MapPin size={15} />
                    <span>{roomNumber}</span>
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

                {/* Active Teaching Subjects Preview */}
                {subjects.length > 0 && (
                  <div className="lecturer-subjects-preview">
                    <div className="subjects-preview-header">
                      <BookOpen size={13} className="text-muted" />
                      <span>Semester 1 2026/2027 Teaching:</span>
                    </div>
                    <div className="subjects-tags-row">
                      {subjects.slice(0, 2).map((sub) => (
                        <span key={sub.code} className="sub-tag" title={sub.name}>
                          <strong>{sub.code}</strong>
                          <span className="sub-tag-name">{sub.name}</span>
                        </span>
                      ))}
                      {subjects.length > 2 && (
                        <span className="sub-tag-more">+{subjects.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

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
