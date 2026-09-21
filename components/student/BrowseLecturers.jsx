'use client';

import React, { useState, useMemo } from 'react';
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
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Users,
  ArrowUpDown,
} from 'lucide-react';

const DEPARTMENT_FILTERS = [
  { id: 'All', label: 'All Departments' },
  { id: 'Software Engineering', label: 'Software Engineering' },
  { id: 'Information Security', label: 'InfoSec & Web Tech' },
  { id: 'Multimedia', label: 'Multimedia Computing' },
  { id: 'Dean', label: "Dean's Office" },
  { id: 'Postgraduate', label: 'Postgraduate Studies' },
];

const POPULAR_COURSES = [
  { code: 'BIT34503', label: 'Data Science' },
  { code: 'BIC21102', label: 'Professional Ethics' },
  { code: 'BIW33103', label: 'Distributed Database' },
  { code: 'BIS10103', label: 'Information Security' },
  { code: 'BIE33103', label: 'Dotnet Programming' },
];

export default function BrowseLecturers() {
  const { users, availability, navigate } = useConsultHub();
  const [selectedDept, setSelectedDept] = useState('All');
  const [teachingOnly, setTeachingOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const lecturers = users.lecturers || [];

  // Calculate dynamic department counts
  const deptCounts = useMemo(() => {
    const counts = { All: lecturers.length };
    DEPARTMENT_FILTERS.forEach((dept) => {
      if (dept.id !== 'All') {
        counts[dept.id] = lecturers.filter((l) =>
          (l.department || '').toLowerCase().includes(dept.id.toLowerCase())
        ).length;
      }
    });
    return counts;
  }, [lecturers]);

  const getSlotCount = (lecturerId) => {
    const days = availability[lecturerId] || [];
    return days.reduce((total, d) => total + (d.slots ? d.slots.length : 0), 0);
  };

  // Filter and sort lecturers
  const filteredLecturers = useMemo(() => {
    let result = lecturers.filter((lecturer) => {
      // Department filter
      const matchesDept =
        selectedDept === 'All' ||
        (lecturer.department &&
          lecturer.department.toLowerCase().includes(selectedDept.toLowerCase()));

      if (!matchesDept) return false;

      // Teaching courses filter
      if (teachingOnly) {
        const hasSubjects = lecturer.currentSubjects && lecturer.currentSubjects.length > 0;
        if (!hasSubjects) return false;
      }

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const matchesName = lecturer.name?.toLowerCase().includes(q);
      const matchesCleanName = lecturer.cleanName?.toLowerCase().includes(q);
      const matchesRoom = (lecturer.office || lecturer.roomLocation || '').toLowerCase().includes(q);
      const matchesDeptName = (lecturer.department || '').toLowerCase().includes(q);
      const matchesRole = (lecturer.role || '').toLowerCase().includes(q);
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
        matchesName ||
        matchesCleanName ||
        matchesRoom ||
        matchesDeptName ||
        matchesRole ||
        matchesSpec ||
        matchesSubjects
      );
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') {
        const nameA = a.cleanName || a.name;
        const nameB = b.cleanName || b.name;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'slots-desc') {
        return getSlotCount(b.id) - getSlotCount(a.id);
      }
      if (sortBy === 'subjects-desc') {
        const subsA = a.currentSubjects ? a.currentSubjects.length : 0;
        const subsB = b.currentSubjects ? b.currentSubjects.length : 0;
        return subsB - subsA;
      }
      if (sortBy === 'department') {
        return (a.department || '').localeCompare(b.department || '');
      }
      return 0;
    });

    return result;
  }, [lecturers, selectedDept, teachingOnly, searchQuery, sortBy, availability]);

  const activeTeachingLecturersCount = useMemo(() => {
    return lecturers.filter((l) => l.currentSubjects && l.currentSubjects.length > 0).length;
  }, [lecturers]);

  const resetFilters = () => {
    setSelectedDept('All');
    setTeachingOnly(false);
    setSearchQuery('');
    setSortBy('name-asc');
  };

  const isFiltered = selectedDept !== 'All' || teachingOnly || searchQuery !== '' || sortBy !== 'name-asc';

  return (
    <div className="page-container browse-page-wrapper">
      {/* Refined Academic Hero Banner */}
      <div className="faculty-hero-banner">
        <div className="faculty-hero-content">
          <div className="faculty-badge-pill">
            <ShieldCheck size={14} />
            <span>Official Faculty Directory (FID 19)</span>
          </div>
          <h2>Faculty of Computer Science and Information Technology</h2>
          <p>
            Connect with 106 verified FSKTM academic staff. View authoritative office room numbers,
            active teaching allocations for Session 2026/2027 Semester 1, and schedule consultations.
          </p>
        </div>

        <div className="faculty-hero-stats">
          <div className="hero-stat-box">
            <span className="hero-stat-number">{lecturers.length}</span>
            <span className="hero-stat-label">Faculty Staff</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-box">
            <span className="hero-stat-number">{activeTeachingLecturersCount}</span>
            <span className="hero-stat-label">Active in Sem 1</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-box">
            <span className="hero-stat-number">PB & PC</span>
            <span className="hero-stat-label">Faculty Blocks</span>
          </div>
        </div>
      </div>

      {/* Main Search and Control Bar */}
      <div className="browse-controls-card">
        {/* Search row */}
        <div className="search-input-wrapper">
          <Search size={19} className="search-input-icon" />
          <input
            type="text"
            className="browse-search-field"
            placeholder="Search by lecturer name, office room (e.g. PB-101-06), course code (e.g. BIT34503), or research topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Popular course shortcuts */}
        <div className="quick-courses-row">
          <span className="quick-courses-label">
            <BookOpen size={13} />
            <span>Quick Course Search:</span>
          </span>
          <div className="quick-chips-list">
            {POPULAR_COURSES.map((course) => {
              const isActive = searchQuery.toLowerCase().includes(course.code.toLowerCase());
              return (
                <button
                  key={course.code}
                  type="button"
                  className={`course-quick-chip ${isActive ? 'active' : ''}`}
                  onClick={() => setSearchQuery(isActive ? '' : course.code)}
                >
                  <span className="chip-code">{course.code}</span>
                  <span className="chip-name">{course.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Department Filters Bar */}
        <div className="departments-filter-bar">
          <div className="dept-tabs-scroll">
            {DEPARTMENT_FILTERS.map((dept) => {
              const count = deptCounts[dept.id] || 0;
              const isActive = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  className={`dept-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDept(dept.id)}
                >
                  <span>{dept.label}</span>
                  <span className="dept-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-toolbar: Active Semester Toggle, Sort, View Mode */}
        <div className="sub-toolbar-row">
          <div className="sub-toolbar-left">
            <button
              type="button"
              className={`toggle-teaching-btn ${teachingOnly ? 'active' : ''}`}
              onClick={() => setTeachingOnly(!teachingOnly)}
            >
              <CheckCircle2 size={15} />
              <span>Teaching Sem 1 Only</span>
              <span className="teaching-count-pill">{activeTeachingLecturersCount}</span>
            </button>

            <span className="results-count-text">
              Showing <strong>{filteredLecturers.length}</strong> of {lecturers.length} staff
            </span>

            {isFiltered && (
              <button
                type="button"
                className="reset-filters-link"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="sub-toolbar-right">
            {/* Sort selector */}
            <div className="sort-dropdown-box">
              <ArrowUpDown size={14} className="text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name-asc">Sort: Name (A - Z)</option>
                <option value="slots-desc">Sort: Most Slots Available</option>
                <option value="subjects-desc">Sort: Most Teaching Courses</option>
                <option value="department">Sort: Department</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zero Results Empty State */}
      {filteredLecturers.length === 0 ? (
        <div className="empty-state-refined">
          <div className="empty-icon-circle">
            <GraduationCap size={40} />
          </div>
          <h3>No FSKTM Faculty Found</h3>
          <p>
            No staff members matched your current search <strong>&quot;{searchQuery}&quot;</strong> or
            filters.
          </p>
          <div className="empty-suggestions">
            <span className="suggestion-title">Suggestions:</span>
            <ul>
              <li>Check course code syntax (e.g., <code>BIT34503</code>, <code>BIC21102</code>).</li>
              <li>Search by authoritative office room number (e.g., <code>PB-101</code> or <code>PB-601</code>).</li>
              <li>Search by lecturer clean surname without titles.</li>
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={resetFilters}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="lecturers-grid-refined">
          {filteredLecturers.map((lecturer) => {
            const slotsCount = getSlotCount(lecturer.id);
            const subjects = lecturer.currentSubjects || [];
            const roomNumber = lecturer.roomLocation || lecturer.office || 'FSKTM Complex';
            const roleText = lecturer.role || 'Lecturer';

            return (
              <div
                key={lecturer.id}
                className="refined-lecturer-card"
                onClick={() => navigate('lecturer-detail', lecturer.id)}
              >
                {/* Header with Avatar & Identity */}
                <div className="card-top-row">
                  <div className="avatar-wrapper-refined">
                    <UTHMAvatar user={lecturer} size={60} className="avatar-refined" />
                  </div>
                  <div className="lecturer-title-group">
                    <h3 className="lecturer-name-heading" title={lecturer.name}>
                      {lecturer.name}
                    </h3>
                    <div className="role-and-dept">
                      <span className="role-chip">{roleText}</span>
                      <span className="dept-name-muted">{lecturer.department}</span>
                    </div>
                  </div>
                </div>

                {/* Authoritative Room & Contact Badges */}
                <div className="contact-and-room-bar">
                  <div className="room-highlight-badge" title="Authoritative Office Room">
                    <MapPin size={13} />
                    <span>{roomNumber}</span>
                  </div>
                  <div className="contact-pill-item" title={lecturer.email}>
                    <Mail size={13} />
                    <span>{lecturer.email}</span>
                  </div>
                  <div className="contact-pill-item" title={lecturer.phone}>
                    <Phone size={13} />
                    <span>{lecturer.phone}</span>
                  </div>
                </div>

                {/* Specialization Quote */}
                {lecturer.specialization && (
                  <div className="specialization-summary">
                    <span className="spec-label">Specialization:</span>
                    <p className="spec-text">{lecturer.specialization}</p>
                  </div>
                )}

                {/* Active Teaching Courses (Semester 1 2026/2027) */}
                <div className="card-teaching-block">
                  <div className="teaching-block-header">
                    <BookOpen size={13} />
                    <span>Sem 1 2026/2027 Allocation:</span>
                  </div>

                  {subjects.length > 0 ? (
                    <div className="subjects-pill-list">
                      {subjects.slice(0, 2).map((sub) => (
                        <div
                          key={sub.code}
                          className="course-badge-pill"
                          title={`${sub.code} - ${sub.name}`}
                        >
                          <span className="course-code-box">{sub.code}</span>
                          <span className="course-name-label">{sub.name}</span>
                        </div>
                      ))}
                      {subjects.length > 2 && (
                        <span className="course-more-badge">
                          +{subjects.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="non-teaching-notice">
                      Research & Postgraduate Supervision
                    </span>
                  )}
                </div>

                {/* Card Footer */}
                <div className="card-bottom-actions">
                  <div className="availability-pulse-badge">
                    <span className="pulse-dot" />
                    <span>{slotsCount} slots available</span>
                  </div>

                  <button
                    type="button"
                    className="book-cta-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('lecturer-detail', lecturer.id);
                    }}
                  >
                    <span>Book Session</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW */
        <div className="lecturers-list-refined">
          <div className="list-table-header">
            <span className="col-staff">Staff Member</span>
            <span className="col-dept">Department & Role</span>
            <span className="col-room">Office Room</span>
            <span className="col-courses">Active Teaching</span>
            <span className="col-slots">Slots</span>
            <span className="col-action">Action</span>
          </div>

          <div className="list-table-body">
            {filteredLecturers.map((lecturer) => {
              const slotsCount = getSlotCount(lecturer.id);
              const subjects = lecturer.currentSubjects || [];
              const roomNumber = lecturer.roomLocation || lecturer.office || 'FSKTM';

              return (
                <div
                  key={lecturer.id}
                  className="list-table-row"
                  onClick={() => navigate('lecturer-detail', lecturer.id)}
                >
                  <div className="col-staff staff-cell">
                    <UTHMAvatar user={lecturer} size={42} className="avatar-sm" />
                    <div className="staff-meta">
                      <strong className="staff-fullname">{lecturer.name}</strong>
                      <span className="staff-email-small">{lecturer.email}</span>
                    </div>
                  </div>

                  <div className="col-dept">
                    <span className="role-tag-small">{lecturer.role || 'Lecturer'}</span>
                    <span className="dept-tag-small">{lecturer.department}</span>
                  </div>

                  <div className="col-room">
                    <span className="room-pill-list">
                      <MapPin size={12} />
                      <strong>{roomNumber}</strong>
                    </span>
                  </div>

                  <div className="col-courses">
                    {subjects.length > 0 ? (
                      <div className="list-courses-chips">
                        {subjects.slice(0, 2).map((s) => (
                          <span key={s.code} className="code-chip-mini" title={s.name}>
                            {s.code}
                          </span>
                        ))}
                        {subjects.length > 2 && (
                          <span className="more-chip-mini">+{subjects.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Research
                      </span>
                    )}
                  </div>

                  <div className="col-slots">
                    <span className="slots-counter-pill">{slotsCount}</span>
                  </div>

                  <div className="col-action">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('lecturer-detail', lecturer.id);
                      }}
                    >
                      <span>Book</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
