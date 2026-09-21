'use client';

import React, { useState } from 'react';
import { useConsultHub } from '@/lib/context';
import {
  Megaphone,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  Calendar,
} from 'lucide-react';

export default function Announcements() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useConsultHub();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  const handlePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    addAnnouncement({ title: title.trim(), message: message.trim(), type });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Faculty Notices & Announcements</h2>
          <p>Publish system-wide notifications and faculty consultation announcements.</p>
        </div>
      </div>

      <div className="availability-layout">
        <div className="availability-list-panel">
          <div className="panel-header">
            <h3>Active Announcements</h3>
            <span className="count-text">{announcements.length} published</span>
          </div>

          <div className="announcements-admin-list">
            {announcements.map((ann) => (
              <div key={ann.id} className={`announcement-card-admin ann-${ann.type}`}>
                <div className="ann-admin-header">
                  <div className="ann-title-group">
                    {ann.type === 'warning' ? (
                      <AlertCircle size={18} className="text-warning" />
                    ) : (
                      <Info size={18} className="text-info" />
                    )}
                    <h4>{ann.title}</h4>
                  </div>
                  <button
                    type="button"
                    className="chip-delete-btn"
                    onClick={() => deleteAnnouncement(ann.id)}
                    title="Delete announcement"
                    aria-label="Delete announcement"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="ann-admin-msg">{ann.message}</p>
                <div className="ann-admin-meta">
                  <Calendar size={13} />
                  <span>Posted on {ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="add-slot-panel">
          <div className="panel-header">
            <h3>Publish New Notice</h3>
          </div>

          <form onSubmit={handlePost} className="add-slot-form">
            <div className="form-group">
              <label htmlFor="ann-title">Notice Title</label>
              <input
                type="text"
                id="ann-title"
                placeholder="e.g. Mid-term Consultation Hours"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ann-type">Category</label>
              <select
                id="ann-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="info">General Information</option>
                <option value="warning">System Alert / Maintenance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ann-msg">Notice Body</label>
              <textarea
                id="ann-msg"
                rows={4}
                placeholder="Enter complete announcement details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              <Plus size={18} />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
