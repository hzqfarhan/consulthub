'use client';

import React from 'react';
import { useConsultHub } from '@/lib/context';

// Layout & UI
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import Modal from './ui/Modal';
import ToastContainer from './ui/ToastContainer';

// Auth
import AuthView from './auth/AuthView';

// Student
import StudentDashboard from './student/StudentDashboard';
import BrowseLecturers from './student/BrowseLecturers';
import LecturerDetail from './student/LecturerDetail';
import MyBookings from './student/MyBookings';

// Lecturer
import LecturerDashboard from './lecturer/LecturerDashboard';
import MySchedule from './lecturer/MySchedule';
import SetAvailability from './lecturer/SetAvailability';
import ManageBookings from './lecturer/ManageBookings';

// Admin
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import AllBookings from './admin/AllBookings';
import Reports from './admin/Reports';
import Announcements from './admin/Announcements';

// Shared
import NotificationsView from './shared/NotificationsView';
import ProfileView from './shared/ProfileView';

export default function MainApp() {
  const { currentUser, currentRole, currentPage } = useConsultHub();

  if (!currentUser) {
    return (
      <>
        <AuthView />
        <ToastContainer />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (currentRole === 'student') return <StudentDashboard />;
        if (currentRole === 'lecturer') return <LecturerDashboard />;
        return <AdminDashboard />;

      case 'browse-lecturers':
        return <BrowseLecturers />;

      case 'lecturer-detail':
        return <LecturerDetail />;

      case 'my-bookings':
        return <MyBookings />;

      case 'my-schedule':
        return <MySchedule />;

      case 'set-availability':
        return <SetAvailability />;

      case 'manage-bookings':
        return <ManageBookings />;

      case 'user-management':
        return <UserManagement />;

      case 'all-bookings':
        return <AllBookings />;

      case 'reports':
        return <Reports />;

      case 'announcements':
        return <Announcements />;

      case 'notifications':
        return <NotificationsView />;

      case 'profile':
        return <ProfileView />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="app-layout-wrapper">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="page-content">{renderCurrentPage()}</main>
      </div>
      <Modal />
      <ToastContainer />
    </div>
  );
}
