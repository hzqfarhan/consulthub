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
} from 'lucide-react';

export default function ProfileView() {
  const { currentUser, currentRole, updateProfile, showToast } = useConsultHub();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dept, setDept] = useState(currentUser?.programme || currentUser?.department || '');

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updates = {
      name: name.trim(),
      phone: phone.trim(),
    };
    if (currentRole === 'student') {
      updates.programme = dept.trim();
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
      <div className="page-header-box">
        <div>
          <h2>Account Settings</h2>
          <p>Manage your profile details and security credentials.</p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Personal Details */}
        <div className="profile-card">
          <div className="panel-header">
            <h3>Personal Information</h3>
          </div>

          <div className="profile-avatar-header">
            <UTHMAvatar user={currentUser} size={80} className="avatar-xl" />
            <div className="profile-avatar-meta">
              <h4>{currentUser?.name}</h4>
              <span className="text-muted text-sm">{currentUser?.email}</span>
              <span className="role-pill-inline mt-1">
                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </span>
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
                {currentRole === 'student' ? 'Matric Number' : 'Staff Identification ID'}
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
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prof-dept">
                {currentRole === 'student' ? 'Academic Programme' : 'Department'}
              </label>
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

            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Security / Password */}
        <div className="profile-card">
          <div className="panel-header">
            <h3>Change Password</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="curr-pw">Current Password</label>
              <div className="input-icon">
                <Lock size={18} className="input-icon-svg" />
                <input
                  type="password"
                  id="curr-pw"
                  placeholder="Enter current password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-pw">New Password</label>
              <div className="input-icon">
                <Lock size={18} className="input-icon-svg" />
                <input
                  type="password"
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
                  type="password"
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
      </div>
    </div>
  );
}
