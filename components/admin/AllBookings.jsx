'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Video,
  Clock,
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Software Engineering',
  'Computer Science',
  'Data Science',
  'Information Security',
];

const STATUSES = ['All Statuses', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function AllBookings() {
  const { appointments, users } = useConsultHub();
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = appointments.filter((app) => {
    const lecturer = users.lecturers.find((l) => l.id === app.lecturerId);
    const student = users.students.find((s) => s.id === app.studentId);

    const matchesDept =
      selectedDept === 'All Departments' || lecturer?.department === selectedDept;
    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      app.status.toLowerCase() === selectedStatus.toLowerCase();

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      student?.name.toLowerCase().includes(q) ||
      lecturer?.name.toLowerCase().includes(q) ||
      app.purpose.toLowerCase().includes(q);

    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Faculty Consultation Registry</h2>
          <p>Complete historical and scheduled consultation appointment records across FSKTM.</p>
        </div>
      </div>

      <div className="filter-search-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by student, lecturer, or consultation topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dropdown-filters-group">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="filter-select"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Lecturer</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const student = users.students.find((s) => s.id === item.studentId);
              const lecturer = users.lecturers.find((l) => l.id === item.lecturerId);
              const isVirtual = item.location.toLowerCase().includes('online');

              return (
                <tr key={item.id}>
                  <td>
                    <span className="font-mono text-xs text-muted">{item.id}</span>
                  </td>

                  <td>
                    <div className="table-user-cell">
                      <div className="avatar avatar-xs">{student?.avatar || 'S'}</div>
                      <div>
                        <span className="table-user-name text-xs">{student?.name || 'Student'}</span>
                        <span className="table-user-sub text-xs">{student?.matric}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="table-user-cell">
                      <div className="avatar avatar-xs">{lecturer?.avatar || 'L'}</div>
                      <div>
                        <span className="table-user-name text-xs">{lecturer?.name || 'Lecturer'}</span>
                        <span className="table-user-sub text-xs">{lecturer?.department}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="table-date-cell">
                      <span className="text-xs font-medium">{item.date}</span>
                      <span className="text-muted text-xs">
                        {item.start} - {item.end}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="text-xs flex items-center gap-1">
                      {isVirtual ? <Video size={12} /> : <MapPin size={12} />}
                      {item.location}
                    </span>
                  </td>

                  <td>
                    <p className="table-purpose-text text-xs" title={item.purpose}>
                      {item.purpose}
                    </p>
                  </td>

                  <td>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
