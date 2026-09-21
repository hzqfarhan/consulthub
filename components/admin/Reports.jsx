'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Video,
  MapPin,
  TrendingUp,
  Download,
} from 'lucide-react';

export default function Reports() {
  const { appointments, users, showToast } = useConsultHub();

  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'completed');
  const attended = completed.filter((a) => a.attendance === 'attended').length;
  const noShow = completed.filter((a) => a.attendance === 'no-show').length;

  const virtualCount = appointments.filter((a) =>
    a.location.toLowerCase().includes('online')
  ).length;
  const physicalCount = total - virtualCount;

  const handleExport = () => {
    showToast('Consultation summary report exported successfully.', 'success');
  };

  return (
    <div className="page-container">
      <div className="page-header-box">
        <div>
          <h2>Consultation Reports & Faculty Analytics</h2>
          <p>Statistical breakdown of student consultations, attendance records, and room utilization.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleExport}>
          <Download size={16} />
          <span>Export CSV Summary</span>
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <BarChart3 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Appointments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{attended}</span>
            <span className="stat-label">Attended Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-danger">
            <XCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{noShow}</span>
            <span className="stat-label">No-Show Incidents</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {completed.length > 0 ? Math.round((attended / completed.length) * 100) : 100}%
            </span>
            <span className="stat-label">Completion Ratio</span>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="panel-header">
            <h3>Attendance Breakdown</h3>
          </div>
          <div className="attendance-breakdown-box">
            <div className="breakdown-stat-row">
              <div className="breakdown-label">
                <CheckCircle2 size={16} className="text-success" />
                <span>Student Attended</span>
              </div>
              <span className="font-semibold">{attended} sessions</span>
            </div>
            <div className="breakdown-stat-row">
              <div className="breakdown-label">
                <XCircle size={16} className="text-danger" />
                <span>Recorded No-Show</span>
              </div>
              <span className="font-semibold">{noShow} sessions</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="panel-header">
            <h3>Meeting Mode Distribution</h3>
          </div>
          <div className="attendance-breakdown-box">
            <div className="breakdown-stat-row">
              <div className="breakdown-label">
                <MapPin size={16} className="text-primary" />
                <span>Physical (Faculty Rooms)</span>
              </div>
              <span className="font-semibold">{physicalCount} sessions</span>
            </div>
            <div className="breakdown-stat-row">
              <div className="breakdown-label">
                <Video size={16} className="text-info" />
                <span>Virtual (Meet / Zoom / Teams)</span>
              </div>
              <span className="font-semibold">{virtualCount} sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
