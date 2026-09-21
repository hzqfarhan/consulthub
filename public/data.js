/* ============================================
   ConsultHub — Mock Data
   ============================================ */

const MOCK_DATA = {
    // Current user (changes on login)
    currentUser: null,

    // Users
    users: {
        students: [
            { id: 'S001', name: 'Muhammad Haziq', email: 'haziq@student.fsktm.edu', phone: '+60 12-345 6789', programme: 'Software Engineering', year: 2, matric: 'A22CS0001', avatar: 'MH', noShows: 0 },
            { id: 'S002', name: 'Nur Aisyah Binti Rahman', email: 'aisyah@student.fsktm.edu', phone: '+60 13-456 7890', programme: 'Computer Science', year: 1, matric: 'A22CS0002', avatar: 'NA', noShows: 1 },
            { id: 'S003', name: 'Ahmad Irfan', email: 'irfan@student.fsktm.edu', phone: '+60 14-567 8901', programme: 'Data Science', year: 3, matric: 'A22CS0003', avatar: 'AI', noShows: 0 },
            { id: 'S004', name: 'Siti Fatimah', email: 'fatimah@student.fsktm.edu', phone: '+60 15-678 9012', programme: 'Software Engineering', year: 2, matric: 'A22CS0004', avatar: 'SF', noShows: 2 },
            { id: 'S005', name: 'Lee Wei Jie', email: 'weijie@student.fsktm.edu', phone: '+60 16-789 0123', programme: 'Information Security', year: 4, matric: 'A22CS0005', avatar: 'LW', noShows: 0 },
            { id: 'S006', name: 'Priya Nair', email: 'priya@student.fsktm.edu', phone: '+60 17-890 1234', programme: 'Computer Science', year: 1, matric: 'A22CS0006', avatar: 'PN', noShows: 0 },
        ],
        lecturers: [
            { id: 'L001', name: 'Dr. Ahmad Faisal', email: 'faisal@fsktm.edu', phone: '+60 19-111 2222', department: 'Software Engineering', office: 'Block N28, Room 3.12', staffId: 'FS0001', avatar: 'AF', specialization: 'Software Design' },
            { id: 'L002', name: 'Dr. Nurul Huda', email: 'huda@fsktm.edu', phone: '+60 19-222 3333', department: 'Computer Science', office: 'Block N28, Room 2.08', staffId: 'FS0002', avatar: 'NH', specialization: 'Artificial Intelligence' },
            { id: 'L003', name: 'Prof. Lim Chee Keong', email: 'ckli@fsktm.edu', phone: '+60 19-333 4444', department: 'Data Science', office: 'Block N28, Room 4.15', staffId: 'FS0003', avatar: 'LC', specialization: 'Machine Learning' },
            { id: 'L004', name: 'Dr. Rashid Ibrahim', email: 'rashid@fsktm.edu', phone: '+60 19-444 5555', department: 'Information Security', office: 'Block N28, Room 1.20', staffId: 'FS0004', avatar: 'RI', specialization: 'Cybersecurity' },
            { id: 'L005', name: 'Dr. Sarah Tan', email: 'sarah@fsktm.edu', phone: '+60 19-555 6666', department: 'Software Engineering', office: 'Block N28, Room 3.05', staffId: 'FS0005', avatar: 'ST', specialization: 'Web Technologies' },
        ],
        admins: [
            { id: 'A001', name: 'Puan Zainab', email: 'zainab@fsktm.edu', phone: '+60 19-999 0000', staffId: 'FA0001', avatar: 'PZ' },
        ]
    },

    // Availability (by lecturer id)
    availability: {
        'L001': [
            { day: 'Monday', slots: [{ start: '09:00', end: '10:00', location: 'Room 3.12' }, { start: '14:00', end: '15:00', location: 'Room 3.12' }, { start: '15:00', end: '16:00', location: 'Online (Google Meet)' }] },
            { day: 'Wednesday', slots: [{ start: '10:00', end: '11:00', location: 'Room 3.12' }, { start: '11:00', end: '12:00', location: 'Room 3.12' }] },
            { day: 'Friday', slots: [{ start: '09:00', end: '10:00', location: 'Room 3.12' }, { start: '14:00', end: '15:00', location: 'Online (Google Meet)' }] },
        ],
        'L002': [
            { day: 'Tuesday', slots: [{ start: '10:00', end: '11:00', location: 'Room 2.08' }, { start: '14:00', end: '15:00', location: 'Room 2.08' }] },
            { day: 'Thursday', slots: [{ start: '09:00', end: '10:00', location: 'Room 2.08' }, { start: '15:00', end: '16:00', location: 'Online (Zoom)' }] },
        ],
        'L003': [
            { day: 'Monday', slots: [{ start: '11:00', end: '12:00', location: 'Room 4.15' }] },
            { day: 'Wednesday', slots: [{ start: '14:00', end: '15:00', location: 'Room 4.15' }, { start: '15:00', end: '16:00', location: 'Room 4.15' }] },
            { day: 'Friday', slots: [{ start: '10:00', end: '11:00', location: 'Online (Teams)' }] },
        ],
        'L004': [
            { day: 'Tuesday', slots: [{ start: '09:00', end: '10:00', location: 'Room 1.20' }, { start: '11:00', end: '12:00', location: 'Room 1.20' }] },
            { day: 'Thursday', slots: [{ start: '14:00', end: '15:00', location: 'Room 1.20' }] },
        ],
        'L005': [
            { day: 'Monday', slots: [{ start: '10:00', end: '11:00', location: 'Room 3.05' }] },
            { day: 'Wednesday', slots: [{ start: '09:00', end: '10:00', location: 'Room 3.05' }, { start: '11:00', end: '12:00', location: 'Room 3.05' }] },
            { day: 'Thursday', slots: [{ start: '10:00', end: '11:00', location: 'Online (Google Meet)' }] },
        ],
    },

    // Appointments
    appointments: [
        { id: 'BK001', studentId: 'S001', lecturerId: 'L001', date: '2026-09-22', day: 'Monday', start: '09:00', end: '10:00', location: 'Room 3.12', purpose: 'Lab 1 consultation — Software Design questions', status: 'confirmed', createdAt: '2026-09-20' },
        { id: 'BK002', studentId: 'S001', lecturerId: 'L002', date: '2026-09-23', day: 'Tuesday', start: '10:00', end: '11:00', location: 'Room 2.08', purpose: 'AI assignment discussion', status: 'pending', createdAt: '2026-09-21' },
        { id: 'BK003', studentId: 'S002', lecturerId: 'L001', date: '2026-09-22', day: 'Monday', start: '14:00', end: '15:00', location: 'Room 3.12', purpose: 'Project proposal feedback', status: 'confirmed', createdAt: '2026-09-19' },
        { id: 'BK004', studentId: 'S003', lecturerId: 'L003', date: '2026-09-24', day: 'Wednesday', start: '14:00', end: '15:00', location: 'Room 4.15', purpose: 'Machine Learning model review', status: 'confirmed', createdAt: '2026-09-18' },
        { id: 'BK005', studentId: 'S004', lecturerId: 'L001', date: '2026-09-19', day: 'Friday', start: '09:00', end: '10:00', location: 'Room 3.12', purpose: 'UML diagram review', status: 'completed', createdAt: '2026-09-17', attendance: 'attended' },
        { id: 'BK006', studentId: 'S001', lecturerId: 'L005', date: '2026-09-18', day: 'Thursday', start: '10:00', end: '11:00', location: 'Online (Google Meet)', purpose: 'Web project code review', status: 'completed', createdAt: '2026-09-16', attendance: 'attended' },
        { id: 'BK007', studentId: 'S005', lecturerId: 'L004', date: '2026-09-16', day: 'Tuesday', start: '09:00', end: '10:00', location: 'Room 1.20', purpose: 'FYP security analysis discussion', status: 'completed', createdAt: '2026-09-14', attendance: 'no-show' },
        { id: 'BK008', studentId: 'S002', lecturerId: 'L002', date: '2026-09-25', day: 'Thursday', start: '15:00', end: '16:00', location: 'Online (Zoom)', purpose: 'Neural network assignment help', status: 'pending', createdAt: '2026-09-21' },
        { id: 'BK009', studentId: 'S006', lecturerId: 'L005', date: '2026-09-17', day: 'Wednesday', start: '09:00', end: '10:00', location: 'Room 3.05', purpose: 'Portfolio website review', status: 'cancelled', createdAt: '2026-09-15' },
        { id: 'BK010', studentId: 'S003', lecturerId: 'L001', date: '2026-09-26', day: 'Friday', start: '14:00', end: '15:00', location: 'Online (Google Meet)', purpose: 'Design patterns discussion', status: 'confirmed', createdAt: '2026-09-21' },
    ],

    // Notifications
    notifications: [
        { id: 'N001', userId: 'S001', type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your consultation with Dr. Ahmad Faisal on Monday, Sep 22 at 9:00 AM has been confirmed.', time: '2 hours ago', read: false, icon: 'event_available', iconColor: 'emerald' },
        { id: 'N002', userId: 'S001', type: 'booking_pending', title: 'Booking Submitted', message: 'Your consultation request with Dr. Nurul Huda on Tuesday, Sep 23 at 10:00 AM is pending approval.', time: '1 hour ago', read: false, icon: 'pending', iconColor: 'amber' },
        { id: 'N003', userId: 'S001', type: 'reminder', title: 'Upcoming Consultation', message: 'Reminder: You have a consultation with Dr. Ahmad Faisal tomorrow at 9:00 AM.', time: '30 min ago', read: false, icon: 'alarm', iconColor: 'blue' },
        { id: 'N004', userId: 'S001', type: 'completed', title: 'Consultation Completed', message: 'Your consultation with Dr. Sarah Tan has been marked as completed.', time: '3 days ago', read: true, icon: 'check_circle', iconColor: 'emerald' },
        { id: 'N005', userId: 'L001', type: 'new_booking', title: 'New Booking Request', message: 'Muhammad Haziq has requested a consultation on Monday, Sep 22 at 9:00 AM.', time: '2 hours ago', read: false, icon: 'person_add', iconColor: 'indigo' },
        { id: 'N006', userId: 'L001', type: 'new_booking', title: 'New Booking Request', message: 'Nur Aisyah has requested a consultation on Monday, Sep 22 at 2:00 PM.', time: '5 hours ago', read: false, icon: 'person_add', iconColor: 'indigo' },
        { id: 'N007', userId: 'L001', type: 'cancelled', title: 'Booking Cancelled', message: 'Ahmad Irfan has cancelled the consultation on Friday, Sep 19.', time: '1 day ago', read: true, icon: 'cancel', iconColor: 'rose' },
        { id: 'N008', userId: 'A001', type: 'system', title: 'System Report', message: 'Weekly usage report: 45 consultations booked, 3 no-shows recorded.', time: '6 hours ago', read: false, icon: 'analytics', iconColor: 'blue' },
    ],

    // Announcements
    announcements: [
        { id: 'AN001', title: 'System Maintenance', message: 'ConsultHub will be undergoing maintenance on Oct 1, 2026 from 12:00 AM to 6:00 AM.', date: '2026-09-21', type: 'warning' },
        { id: 'AN002', title: 'New Feature: Online Consultations', message: 'Lecturers can now add Google Meet, Zoom, or Teams links to their consultation slots.', date: '2026-09-20', type: 'info' },
    ],
};

// Helper to get user by id
function getUserById(id) {
    if (id.startsWith('S')) return MOCK_DATA.users.students.find(s => s.id === id);
    if (id.startsWith('L')) return MOCK_DATA.users.lecturers.find(l => l.id === id);
    if (id.startsWith('A')) return MOCK_DATA.users.admins.find(a => a.id === id);
    return null;
}

// Helper to get lecturer by id
function getLecturerById(id) {
    return MOCK_DATA.users.lecturers.find(l => l.id === id);
}

// Helper to get student by id
function getStudentById(id) {
    return MOCK_DATA.users.students.find(s => s.id === id);
}

// Helper to format date
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-MY', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function getDateParts(dateStr) {
    const d = new Date(dateStr);
    return {
        day: d.getDate(),
        month: d.toLocaleDateString('en-MY', { month: 'short' }).toUpperCase(),
        weekday: d.toLocaleDateString('en-MY', { weekday: 'short' }),
    };
}

// Generate unique ID
function generateId(prefix) {
    return prefix + String(Math.floor(Math.random() * 90000) + 10000);
}
