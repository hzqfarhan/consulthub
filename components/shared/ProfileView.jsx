'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
import {
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  CheckCircle2,
  Fingerprint,
  GraduationCap,
  Calendar,
  CalendarCheck,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

const FSKTM_PROGRAMMES = [
  'Software Engineering',
  'Computer Science',
  'Data Science',
  'Information Security',
  'Multimedia Computing',
  'Web Technology',
  'Information Technology',
];

export default function ProfileView() {
  const {
    currentUser,
    currentRole,
    appointments,
    users,
    updateProfile,
    showToast,
    navigate,
  } = useConsultHub();

  const isStudent = currentRole === 'student';
  const isLecturer = currentRole === 'lecturer';

  // Personal form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dept, setDept] = useState(
    currentUser?.programme || currentUser?.department || 'Software Engineering'
  );
  const [year, setYear] = useState(String(currentUser?.year || 2));

  // Password form state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Computed metrics
  const studentAppointments = isStudent
    ? appointments.filter((a) => a.studentId === currentUser?.id)
    : appointments.filter((a) => a.lecturerId === currentUser?.id);

  const upcomingCount = studentAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  ).length;

  const completedCount = studentAppointments.filter(
    (a) => a.status === 'completed'
  ).length;

  const noShows = currentUser?.noShows || 0;

  // Intake session parsing from matric number
  const intakeYearMatch = (currentUser?.matric || '').match(/\d{2}/);
  const startYear = intakeYearMatch
    ? 2000 + parseInt(intakeYearMatch[0], 10)
    : 2022;
  const sessionStr = `${startYear}/${startYear + 1}`;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updates = {
      name: name.trim(),
      phone: phone.trim(),
    };
    if (isStudent) {
      updates.programme = dept.trim();
      updates.year = parseInt(year, 10) || 2;
    } else {
      updates.department = dept.trim();
    }
    updateProfile(updates);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      showToast('New passwords do not match.', 'danger');
      return;
    }
    if (newPw.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }
    showToast('Password updated successfully.', 'success');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="page-container">
      {/* Refined Hero Banner Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-content">
          <div className="profile-hero-avatar-wrapper">
            <UTHMAvatar
              user={currentUser}
              size={92}
              className="avatar-xl profile-hero-avatar"
            />
            <div
              className="profile-hero-verified-dot"
              title="Official UTHM Record Verified"
            >
              <CheckCircle2 size={14} />
            </div>
          </div>

          <div className="profile-hero-meta">
            <div className="profile-hero-name-row">
              <h2 className="profile-hero-name">{currentUser?.name || 'User'}</h2>
              <span className="profile-role-tag">
                {isStudent
                  ? 'Student'
                  : isLecturer
                  ? 'Faculty Lecturer'
                  : 'Administrator'}
              </span>
            </div>

            <div className="profile-hero-email">
              <Mail size={15} />
              <span>{currentUser?.email || 'user@student.uthm.edu.my'}</span>
            </div>

            <div className="profile-hero-pills">
              <span className="profile-hero-pill">
                <Fingerprint size={14} />
                <span>{currentUser?.matric || currentUser?.staffId || '-'}</span>
              </span>

              {isStudent && (
                <>
                  <span className="profile-hero-pill">
                    <GraduationCap size={14} />
                    <span>Year {year} Undergraduate</span>
                  </span>
                  <span className="profile-hero-pill">
                    <Building2 size={14} />
                    <span>{dept}</span>
                  </span>
                  <span className="profile-hero-pill">
                    <Calendar size={14} />
                    <span>Session {sessionStr}</span>
                  </span>
                </>
              )}

              {isLecturer && (
                <>
                  <span className="profile-hero-pill">
                    <Building2 size={14} />
                    <span>{currentUser?.department || 'FSKTM'}</span>
                  </span>
                  <span className="profile-hero-pill">
                    <MapPin size={14} />
                    <span>{currentUser?.office || 'Block N28'}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Consultation & Standing Stats */}
      <div className="profile-stats-grid">
        <div className="profile-stat-box">
          <div className="profile-stat-icon primary">
            <Calendar size={22} />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">
              {studentAppointments.length}
            </span>
            <span className="profile-stat-label">Total Consultations</span>
          </div>
        </div>

        <div className="profile-stat-box">
          <div className="profile-stat-icon info">
            <CalendarCheck size={22} />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{upcomingCount}</span>
            <span className="profile-stat-label">Upcoming / Active</span>
          </div>
        </div>

        <div className="profile-stat-box">
          <div className="profile-stat-icon success">
            <CheckCircle2 size={22} />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">{completedCount}</span>
            <span className="profile-stat-label">Completed Sessions</span>
          </div>
        </div>

        <div className="profile-stat-box">
          <div className="profile-stat-icon accent">
            <ShieldCheck size={22} />
          </div>
          <div className="profile-stat-info">
            <span className="profile-stat-value">
              {noShows === 0 ? 'Good' : `${noShows} No-Show`}
            </span>
            <span className="profile-stat-label">
              {noShows === 0 ? 'Good Academic Standing' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Layout */}
      <div className="profile-layout-grid">
        {/* Left Column: Academic & Personal Details */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div>
              <h3>
                <User size={18} />
                <span>
                  {isStudent
                    ? 'Academic & Personal Details'
                    : 'Personal Information'}
                </span>
              </h3>
              <p className="profile-card-desc">
                Update your contact details and faculty academic information.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="prof-name">Full Name</label>
              <div className="input-icon">
                <User size={18} className="input-icon-svg" />
                <input
                  type="text"
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prof-id">
                {isStudent ? 'Matric Number' : 'Staff Identification ID'}
              </label>
              <div className="input-icon">
                <Fingerprint size={18} className="input-icon-svg" />
                <input
                  type="text"
                  id="prof-id"
                  value={currentUser?.matric || currentUser?.staffId || ''}
                  disabled
                  className="input-disabled"
                />
                <span className="verified-input-badge">Official Record</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prof-email">Official UTHM Email</label>
              <div className="input-icon">
                <Mail size={18} className="input-icon-svg" />
                <input
                  type="email"
                  id="prof-email"
                  value={currentUser?.email || ''}
                  disabled
                  className="input-disabled"
                />
                <span className="verified-input-badge">Primary</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prof-phone">Phone Number</label>
              <div className="input-icon">
                <Phone size={18} className="input-icon-svg" />
                <input
                  type="tel"
                  id="prof-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+60 12-345 6789"
                />
              </div>
            </div>

            {isStudent ? (
              <>
                <div className="form-group">
                  <label htmlFor="prof-dept">Academic Programme</label>
                  <div className="input-icon">
                    <Building2 size={18} className="input-icon-svg" />
                    <select
                      id="prof-dept"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                    >
                      {FSKTM_PROGRAMMES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prof-year">Year of Study</label>
                  <div className="input-icon">
                    <GraduationCap size={18} className="input-icon-svg" />
                    <select
                      id="prof-year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="1">Year 1 (First Year)</option>
                      <option value="2">Year 2 (Sophomore)</option>
                      <option value="3">Year 3 (Junior)</option>
                      <option value="4">Year 4 (Final Year / FYP)</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="prof-dept">Department / Faculty</label>
                <div className="input-icon">
                  <Building2 size={18} className="input-icon-svg" />
                  <input
                    type="text"
                    id="prof-dept"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Right Column: Security & Recent Consultations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Security Credentials */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h3>
                  <Lock size={18} />
                  <span>Security & Credentials</span>
                </h3>
                <p className="profile-card-desc">
                  Manage your account password and security credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="curr-pw">Current Password</label>
                <div className="input-icon">
                  <Lock size={18} className="input-icon-svg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="curr-pw"
                    placeholder="Enter current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new-pw">New Password</label>
                <div className="input-icon">
                  <Lock size={18} className="input-icon-svg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="new-pw"
                    placeholder="At least 6 characters"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-pw">Confirm New Password</label>
                <div className="input-icon">
                  <Lock size={18} className="input-icon-svg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirm-pw"
                    placeholder="Repeat new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-secondary">
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Recent Consultation Activity */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h3>
                  <CalendarCheck size={18} />
                  <span>Recent Consultation Activity</span>
                </h3>
                <p className="profile-card-desc">
                  Your recent consultations and booked sessions.
                </p>
              </div>
              <button
                type="button"
                className="link-btn text-primary font-medium"
                onClick={() =>
                  navigate(isStudent ? 'my-bookings' : 'manage-bookings')
                }
              >
                View All
              </button>
            </div>

            {studentAppointments.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem 0' }}>
                <Calendar size={36} className="empty-icon text-muted" />
                <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.85rem' }}>
                  No consultations recorded yet.
                </p>
                {isStudent && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('browse-lecturers')}
                  >
                    <span>Book a Session</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="profile-mini-activity-list">
                {studentAppointments.slice(0, 3).map((item) => {
                  const otherUser = isStudent
                    ? users.lecturers.find((l) => l.id === item.lecturerId)
                    : users.students.find((s) => s.id === item.studentId);

                  return (
                    <div key={item.id} className="profile-mini-item">
                      <UTHMAvatar
                        user={otherUser}
                        size={36}
                        className="avatar-sm"
                      />
                      <div className="profile-mini-details">
                        <div className="profile-mini-title">
                          {otherUser?.name ||
                            (isStudent ? 'Lecturer' : 'Student')}
                        </div>
                        <div className="profile-mini-meta">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>
                            {item.start} - {item.end}
                          </span>
                        </div>
                      </div>
                      <span className={`status-badge status-${item.status}`}>
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
