'use client';

import React, { createContext, useContext, useState } from 'react';
import { INITIAL_DATA, generateId } from './data';

const ConsultHubContext = createContext(null);

export function ConsultHubProvider({ children }) {
  // Users and Auth
  const [users, setUsers] = useState(INITIAL_DATA.users);
  const [currentUser, setCurrentUser] = useState(null); // null means on auth page
  const [currentRole, setCurrentRole] = useState('student');

  // Navigation
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageData, setPageData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data
  const [appointments, setAppointments] = useState(INITIAL_DATA.appointments);
  const [availability, setAvailability] = useState(INITIAL_DATA.availability);
  const [notifications, setNotifications] = useState(INITIAL_DATA.notifications);
  const [announcements, setAnnouncements] = useState(INITIAL_DATA.announcements);

  // Global UI: Toast & Modal
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', content: null });

  // Navigation helper
  const navigate = (page, data = null) => {
    setCurrentPage(page);
    setPageData(data);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast helper
  const showToast = (message, type = 'info') => {
    const id = generateId('toast_');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modal helpers
  const openModal = (title, content) => {
    setModal({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', content: null });
  };

  // Auth actions
  const login = (role, identifier = '') => {
    setCurrentRole(role);
    const cleanId = String(identifier || '').trim().toUpperCase();

    let user = null;

    if (role === 'student') {
      if (cleanId) {
        user = users.students.find(
          (s) =>
            s.matric.toUpperCase() === cleanId ||
            s.email.toLowerCase() === identifier.trim().toLowerCase()
        );
      }
      if (!user) {
        if (cleanId) {
          // Determine programme from matric prefix
          const prefix = cleanId.replace(/[0-9].*$/, '').toUpperCase();
          const programmeMap = {
            AI: 'Software Engineering',
            BI: 'Information Security',
            CI: 'Data Science',
            DI: 'Computer Science',
            BIT: 'Information Technology',
            BIP: 'Information Technology',
            BIS: 'Information Security',
            BIM: 'Multimedia Computing',
            BIW: 'Web Technology',
          };
          const programme = programmeMap[prefix] || 'Software Engineering';

          // Determine year from 2-digit intake year
          let year = 2;
          const yearMatch = cleanId.match(/\d{2}/);
          if (yearMatch) {
            const intakeYear = 2000 + parseInt(yearMatch[0], 10);
            const calculatedYear = 2026 - intakeYear + 1;
            year = Math.max(1, Math.min(4, calculatedYear));
          }

          // Dynamically instantiate student by entered matric number
          user = {
            id: generateId('S'),
            name: `Student ${cleanId}`,
            email: `${cleanId.toLowerCase()}@student.uthm.edu.my`,
            phone: '+60 12-345 6789',
            programme,
            year,
            matric: cleanId,
            avatar: cleanId.slice(0, 2),
            noShows: 0,
          };
          setUsers((prev) => ({
            ...prev,
            students: [user, ...prev.students],
          }));
        } else {
          user = users.students[0];
        }
      }
    } else if (role === 'lecturer') {
      if (cleanId) {
        user = users.lecturers.find(
          (l) =>
            l.staffId.toUpperCase() === cleanId ||
            l.email.toLowerCase() === identifier.trim().toLowerCase()
        );
      }
      if (!user) {
        if (cleanId) {
          // Dynamically instantiate lecturer by entered staff ID
          const newLecturerId = generateId('L');
          user = {
            id: newLecturerId,
            name: `Lecturer ${cleanId}`,
            email: `${cleanId.toLowerCase()}@uthm.edu.my`,
            phone: '+60 19-111 2222',
            department: 'Software Engineering',
            office: 'Block N28, Faculty of Computer Science & Information Technology',
            staffId: cleanId,
            avatar: cleanId.slice(0, 2),
            specialization: 'Faculty Advisor',
          };
          setUsers((prev) => ({
            ...prev,
            lecturers: [user, ...prev.lecturers],
          }));
          // Seed standard consultation availability for new lecturer
          setAvailability((prev) => ({
            ...prev,
            [newLecturerId]: [
              {
                day: 'Monday',
                slots: [
                  { start: '10:00', end: '11:00', location: 'Block N28, Room 3.12' },
                  { start: '14:00', end: '15:00', location: 'Online (Google Meet)' },
                ],
              },
              {
                day: 'Wednesday',
                slots: [
                  { start: '09:00', end: '10:00', location: 'Block N28, Room 3.12' },
                  { start: '11:00', end: '12:00', location: 'Block N28, Room 3.12' },
                ],
              },
              {
                day: 'Thursday',
                slots: [
                  { start: '14:00', end: '15:00', location: 'Online (Google Meet)' },
                ],
              },
            ],
          }));
        } else {
          user = users.lecturers[0];
        }
      }
    } else {
      // Admin
      if (cleanId) {
        user = users.admins.find(
          (a) =>
            a.staffId.toUpperCase() === cleanId ||
            a.id.toUpperCase() === cleanId ||
            a.email.toLowerCase() === identifier.trim().toLowerCase()
        );
      }
      if (!user) {
        if (cleanId) {
          user = {
            id: generateId('A'),
            name: `Admin ${cleanId}`,
            email: `${cleanId.toLowerCase()}@uthm.edu.my`,
            phone: '+60 19-999 0000',
            staffId: cleanId,
            avatar: cleanId.slice(0, 2),
          };
          setUsers((prev) => ({
            ...prev,
            admins: [user, ...prev.admins],
          }));
        } else {
          user = users.admins[0];
        }
      }
    }

    setCurrentUser(user);
    navigate('dashboard');
    showToast(`Signed in as ${user.name} (${user.matric || user.staffId}).`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setPageData(null);
    closeModal();
    showToast('Signed out successfully.', 'info');
  };

  // Appointment actions
  const bookAppointment = ({ studentId, lecturerId, date, day, start, end, location, purpose }) => {
    const newBooking = {
      id: generateId('BK'),
      studentId,
      lecturerId,
      date,
      day,
      start,
      end,
      location,
      purpose,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAppointments((prev) => [newBooking, ...prev]);

    // Send notification to lecturer
    const newNotif = {
      id: generateId('N'),
      userId: lecturerId,
      type: 'new_booking',
      title: 'New Consultation Request',
      message: `${currentUser?.name || 'A student'} has requested a consultation on ${date} at ${start}.`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Consultation request submitted successfully.', 'success');
    return newBooking;
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, status: 'cancelled' } : app))
    );
    showToast('Consultation cancelled.', 'info');
  };

  const rescheduleAppointment = (appointmentId, newDate, newDay, newStart, newEnd, newLocation) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointmentId
          ? {
              ...app,
              date: newDate,
              day: newDay,
              start: newStart,
              end: newEnd,
              location: newLocation,
              status: 'confirmed',
            }
          : app
      )
    );
    showToast('Consultation rescheduled successfully.', 'success');
  };

  const approveAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, status: 'confirmed' } : app))
    );
    showToast('Consultation request approved.', 'success');
  };

  const rejectAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, status: 'rejected' } : app))
    );
    showToast('Consultation request rejected.', 'info');
  };

  const markAttendance = (appointmentId, attendanceStatus) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointmentId
          ? { ...app, status: 'completed', attendance: attendanceStatus }
          : app
      )
    );
    showToast(`Attendance marked as ${attendanceStatus}.`, 'success');
  };

  // Availability actions
  const addAvailabilitySlot = (lecturerId, day, slot) => {
    setAvailability((prev) => {
      const lecturerSlots = prev[lecturerId] ? [...prev[lecturerId]] : [];
      const dayIndex = lecturerSlots.findIndex((d) => d.day.toLowerCase() === day.toLowerCase());

      if (dayIndex > -1) {
        lecturerSlots[dayIndex] = {
          ...lecturerSlots[dayIndex],
          slots: [...lecturerSlots[dayIndex].slots, slot],
        };
      } else {
        lecturerSlots.push({
          day,
          slots: [slot],
        });
      }

      return {
        ...prev,
        [lecturerId]: lecturerSlots,
      };
    });
    showToast('Time slot added successfully.', 'success');
  };

  const removeAvailabilitySlot = (lecturerId, day, slotIndex) => {
    setAvailability((prev) => {
      const lecturerSlots = prev[lecturerId] ? [...prev[lecturerId]] : [];
      const dayIndex = lecturerSlots.findIndex((d) => d.day.toLowerCase() === day.toLowerCase());

      if (dayIndex > -1) {
        const updatedSlots = lecturerSlots[dayIndex].slots.filter((_, idx) => idx !== slotIndex);
        if (updatedSlots.length === 0) {
          lecturerSlots.splice(dayIndex, 1);
        } else {
          lecturerSlots[dayIndex] = {
            ...lecturerSlots[dayIndex],
            slots: updatedSlots,
          };
        }
      }

      return {
        ...prev,
        [lecturerId]: lecturerSlots,
      };
    });
    showToast('Time slot removed.', 'info');
  };

  // Notification actions
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
    showToast('All notifications marked as read.', 'success');
  };

  // Announcement actions
  const addAnnouncement = ({ title, message, type = 'info' }) => {
    const newAnn = {
      id: generateId('AN'),
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      type,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Announcement published successfully.', 'success');
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted.', 'info');
  };

  // Profile actions
  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);

    setUsers((prev) => {
      const copy = { ...prev };
      if (currentRole === 'student') {
        copy.students = copy.students.map((s) => (s.id === updatedUser.id ? updatedUser : s));
      } else if (currentRole === 'lecturer') {
        copy.lecturers = copy.lecturers.map((l) => (l.id === updatedUser.id ? updatedUser : l));
      } else {
        copy.admins = copy.admins.map((a) => (a.id === updatedUser.id ? updatedUser : a));
      }
      return copy;
    });

    showToast('Profile updated successfully.', 'success');
  };

  const value = {
    users,
    currentUser,
    currentRole,
    currentPage,
    pageData,
    sidebarOpen,
    setSidebarOpen,
    appointments,
    availability,
    notifications,
    announcements,
    toasts,
    modal,
    navigate,
    showToast,
    removeToast,
    openModal,
    closeModal,
    login,
    logout,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    approveAppointment,
    rejectAppointment,
    markAttendance,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addAnnouncement,
    deleteAnnouncement,
    updateProfile,
  };

  return <ConsultHubContext.Provider value={value}>{children}</ConsultHubContext.Provider>;
}

export function useConsultHub() {
  const context = useContext(ConsultHubContext);
  if (!context) {
    throw new Error('useConsultHub must be used within a ConsultHubProvider');
  }
  return context;
}
