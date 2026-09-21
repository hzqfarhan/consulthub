'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import UTHMAvatar from '@/components/ui/UTHMAvatar';
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
} from 'lucide-react';

export default function AuthView() {
  const { login, showToast, users } = useConsultHub();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state (Matric Number for student, Staff ID for lecturer/admin)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');

  const cleanIdentifier = (identifier || '').trim().toUpperCase();
  const matchedUser =
    selectedRole === 'student'
      ? users?.students?.find((s) => s.matric.toUpperCase() === cleanIdentifier)
      : selectedRole === 'lecturer'
      ? users?.lecturers?.find((l) => l.staffId.toUpperCase() === cleanIdentifier)
      : users?.admins?.find((a) => a.staffId.toUpperCase() === cleanIdentifier);

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
      {/* Left Branding Showcase */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">
            <GraduationCap size={32} />
          </div>
          <h1>ConsultHub</h1>
          <p>FSKTM Student Consultation Booking System</p>
        </div>

        <div className="auth-illustration">
          <div className="floating-card fc1">
            <CalendarCheck size={18} className="fc-icon" />
            <span>Instant Slot Booking</span>
          </div>
          <div className="floating-card fc2">
            <Clock size={18} className="fc-icon" />
            <span>Mon - Fri Schedule</span>
          </div>
          <div className="floating-card fc3">
            <ShieldCheck size={18} className="fc-icon" />
            <span>Verified FSKTM Faculty</span>
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2>{isRegister ? 'Create an Account' : 'Welcome to ConsultHub'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Join ConsultHub to book and manage consultations'
              : 'Sign in to access your consultation schedule'}
          </p>

          {/* Role selector tabs */}
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

          {!isRegister ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-identifier">
                  {selectedRole === 'student' ? 'Matric Number' : 'Staff Identification ID'}
                </label>
                <div className="input-icon">
                  <Fingerprint size={18} className="input-icon-svg" />
                  <input
                    type="text"
                    id="login-identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. AI220123'
                        : selectedRole === 'lecturer'
                        ? 'e.g. 01234'
                        : 'e.g. H5678'
                    }
                    required
                  />
                </div>

                {cleanIdentifier && (
                  <div className="id-live-preview">
                    <UTHMAvatar
                      idNumber={cleanIdentifier}
                      role={selectedRole}
                      size={42}
                      className="id-live-avatar"
                    />
                    <div className="id-live-details">
                      <span className="id-live-name">
                        {matchedUser
                          ? matchedUser.name
                          : selectedRole === 'student'
                          ? `Student ${cleanIdentifier}`
                          : selectedRole === 'lecturer'
                          ? `Lecturer ${cleanIdentifier}`
                          : `Admin ${cleanIdentifier}`}
                      </span>
                      <div className="id-live-meta">
                        <span className="id-live-role-badge">
                          {selectedRole === 'student' ? 'Matric Verified' : 'Staff ID Verified'}
                        </span>
                        <span className="id-live-source">community.uthm.edu.my</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-icon">
                  <Lock size={18} className="input-icon-svg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <span>Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                <ArrowRight size={18} />
              </button>

              <p className="auth-footer">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="link-btn text-primary font-medium"
                  onClick={() => setIsRegister(true)}
                >
                  Create account
                </button>
              </p>
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
                      placeholder="Full Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-id">
                    {selectedRole === 'student' ? 'Matric No' : 'Staff ID'}
                  </label>
                  <div className="input-icon">
                    <Fingerprint size={18} className="input-icon-svg" />
                    <input
                      type="text"
                      id="reg-id"
                      placeholder={selectedRole === 'student' ? 'e.g. AI220123' : 'e.g. 01234'}
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <div className="input-icon">
                  <Mail size={18} className="input-icon-svg" />
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="your@email.com"
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
                    {selectedRole === 'student' ? 'Programme' : 'Department'}
                  </label>
                  <div className="input-icon">
                    <Building2 size={18} className="input-icon-svg" />
                    <input
                      type="text"
                      id="reg-dept"
                      placeholder="Software Engineering"
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      required
                    />
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
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
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

              <button type="submit" className="btn btn-primary btn-full">
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </button>

              <p className="auth-footer">
                Already have an account?{' '}
                <button
                  type="button"
                  className="link-btn text-primary font-medium"
                  onClick={() => setIsRegister(false)}
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
