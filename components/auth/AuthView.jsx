'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  GraduationCap,
  CalendarCheck,
  Clock,
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Fingerprint,
  Phone,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Info,
  CheckCircle2,
} from 'lucide-react';

const FSKTM_PROGRAMMES = [
  'Software Engineering',
  'Information Security',
  'Multimedia Computing',
  'Web Technology',
  'Data Science',
  'Computer Science',
];

export default function AuthView() {
  const { login, showToast } = useConsultHub();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state (Matric Number for student, Staff ID for lecturer/admin)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDept, setRegDept] = useState('Software Engineering');
  const [regYear, setRegYear] = useState('2');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIdentifier('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, identifier, password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regPassword !== regPassword2) {
      showToast('Passwords do not match.', 'danger');
      return;
    }
    const cleanRegId = regId.trim().toUpperCase();
    const extraData = {
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      programme: regDept.trim(),
      department: regDept.trim(),
      year: regYear,
    };
    showToast('Account created successfully. Logging in...', 'success');
    setTimeout(() => {
      login(selectedRole, cleanRegId, extraData);
    }, 400);
  };

  return (
    <div className="auth-container">
      {/* Desktop Left Branding Showcase */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">
            <GraduationCap size={36} />
          </div>
          <h1>ConsultHub</h1>
          <p>FSKTM Student Consultation Booking System</p>
          <div className="auth-faculty-pill">
            <ShieldCheck size={14} />
            <span>Faculty ID 19 — Universiti Tun Hussein Onn Malaysia</span>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="floating-card fc1">
            <CalendarCheck size={18} className="fc-icon" />
            <span>Direct Slot Booking</span>
          </div>
          <div className="floating-card fc2">
            <Clock size={18} className="fc-icon" />
            <span>Authoritative PB/PC Rooms</span>
          </div>
          <div className="floating-card fc3">
            <ShieldCheck size={18} className="fc-icon" />
            <span>106 Verified FSKTM Staff</span>
          </div>
        </div>
      </div>

      {/* Right Form Card (Responsive on Mobile & Desktop) */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          {/* Mobile-Only Header */}
          <div className="auth-mobile-header">
            <div className="mobile-header-icon-box">
              <GraduationCap size={28} />
            </div>
            <div className="mobile-header-text">
              <div className="mobile-header-title-row">
                <h2>ConsultHub</h2>
                <span className="mobile-fid-badge">FID 19</span>
              </div>
              <p>FSKTM Student Consultation System</p>
            </div>
          </div>

          <div className="auth-headings-group">
            <h2 className="auth-form-title">
              {isRegister ? 'Create an Account' : 'Welcome to ConsultHub'}
            </h2>
            <p className="auth-subtitle">
              {isRegister
                ? 'Join ConsultHub to schedule consultations with FSKTM faculty'
                : 'Sign in to access your consultation schedule and bookings'}
            </p>
          </div>

          {/* Touch-Optimized Role Selector Tabs */}
          <div className="role-tabs-container">
            <label className="role-selector-label">Sign in as</label>
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${selectedRole === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleChange('student')}
              >
                <User size={16} />
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`role-tab ${selectedRole === 'lecturer' ? 'active' : ''}`}
                onClick={() => handleRoleChange('lecturer')}
              >
                <UserCheck size={16} />
                <span>Lecturer</span>
              </button>
              {!isRegister && (
                <button
                  type="button"
                  className={`role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('admin')}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>

          {!isRegister ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-identifier">
                  {selectedRole === 'student'
                    ? 'Student Matric Number'
                    : selectedRole === 'lecturer'
                    ? 'Staff ID or Username'
                    : 'Administrator ID'}
                </label>
                <div className="input-icon">
                  <Fingerprint size={19} className="input-icon-svg" />
                  <input
                    type="text"
                    id="login-identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. AI220123'
                        : selectedRole === 'lecturer'
                        ? 'e.g. 01364 or farhan'
                        : 'e.g. A001 or H5678'
                    }
                    autoCapitalize={selectedRole === 'student' ? 'characters' : 'none'}
                    autoCorrect="off"
                    spellCheck="false"
                    inputMode="text"
                    required
                  />
                </div>
                <span className="field-hint-text">
                  {selectedRole === 'student'
                    ? 'Format: e.g. AI220123, BI210088, CI200032'
                    : selectedRole === 'lecturer'
                    ? 'Staff ID (e.g. 01364), email username (e.g. farhan), or full email'
                    : 'System Administrator reference code'}
                </span>
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="login-password">Password</label>
                </div>
                <div className="input-icon">
                  <Lock size={19} className="input-icon-svg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pw-touch"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-row-mobile">
                <label className="checkbox-label-mobile">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="link-btn-mobile"
                  onClick={() =>
                    showToast('Password reset instructions sent to your registered UTHM email.', 'info')
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-auth-submit">
                <span>Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-footer-mobile">
                <span>Don&apos;t have an account?</span>
                <button
                  type="button"
                  className="link-btn-highlight"
                  onClick={() => setIsRegister(true)}
                >
                  Create account
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <div className="input-icon">
                    <User size={18} className="input-icon-svg" />
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="e.g. Muhammad Haziq"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-id">
                    {selectedRole === 'student' ? 'Matric Number' : 'Staff ID'}
                  </label>
                  <div className="input-icon">
                    <Fingerprint size={18} className="input-icon-svg" />
                    <input
                      type="text"
                      id="reg-id"
                      placeholder={selectedRole === 'student' ? 'e.g. AI220123' : 'e.g. 01364'}
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      autoCapitalize={selectedRole === 'student' ? 'characters' : 'none'}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Official UTHM Email</label>
                <div className="input-icon">
                  <Mail size={18} className="input-icon-svg" />
                  <input
                    type="email"
                    id="reg-email"
                    placeholder={
                      selectedRole === 'student'
                        ? 'yourname@student.uthm.edu.my'
                        : 'yourname@uthm.edu.my'
                    }
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="reg-phone">Phone Number</label>
                  <div className="input-icon">
                    <Phone size={18} className="input-icon-svg" />
                    <input
                      type="tel"
                      id="reg-phone"
                      placeholder="+60 12-345 6789"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-dept">
                    {selectedRole === 'student' ? 'Academic Programme' : 'Department'}
                  </label>
                  <div className="input-icon">
                    <Building2 size={18} className="input-icon-svg" />
                    <select
                      id="reg-dept"
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="form-select-touch"
                    >
                      {FSKTM_PROGRAMMES.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {selectedRole === 'student' && (
                <div className="form-group">
                  <label htmlFor="reg-year">Year of Study</label>
                  <div className="input-icon">
                    <Calendar size={18} className="input-icon-svg" />
                    <select
                      id="reg-year"
                      value={regYear}
                      onChange={(e) => setRegYear(e.target.value)}
                      className="form-select-touch"
                    >
                      <option value="1">Year 1 (Freshman)</option>
                      <option value="2">Year 2 (Sophomore)</option>
                      <option value="3">Year 3 (Junior)</option>
                      <option value="4">Year 4 (Senior / Final Year)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="reg-pw">Password</label>
                  <div className="input-icon">
                    <Lock size={18} className="input-icon-svg" />
                    <input
                      type="password"
                      id="reg-pw"
                      placeholder="Create password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-pw2">Confirm Password</label>
                  <div className="input-icon">
                    <Lock size={18} className="input-icon-svg" />
                    <input
                      type="password"
                      id="reg-pw2"
                      placeholder="Repeat password"
                      value={regPassword2}
                      onChange={(e) => setRegPassword2(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-auth-submit">
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-footer-mobile">
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="link-btn-highlight"
                  onClick={() => setIsRegister(false)}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* Mobile Footer Reassurance */}
          <div className="auth-reassurance-footer">
            <ShieldCheck size={14} className="text-muted" />
            <span>Faculty of Computer Science and Information Technology, UTHM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
