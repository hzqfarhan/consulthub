/* =========================================================================
   ConsultHub - Faculty of Computer Science and Information Technology (FSKTM)
   Data Layer & Initial Application State
   ========================================================================= */

import FSKTM_LECTURERS_RAW from '../data/lecturers.json';

/**
 * Normalizes scraped FSKTM records into application-ready lecturer objects.
 */
export const FSKTM_LECTURERS = FSKTM_LECTURERS_RAW.map((lec, index) => {
  const staffId = lec.staffId || `0${1200 + index}`;
  const cleanName = lec.cleanName || lec.name.replace(/^(PROF\.|MADYA|ASSOC\.|TS\.|DR\.|IR\.|PUAN|ENCIK)\s+/gi, '').trim();
  const nameParts = cleanName.split(' ').filter(Boolean);
  const avatar = nameParts.length >= 2 
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : cleanName.slice(0, 2).toUpperCase();

  const office = lec.roomLocation && lec.roomLocation !== '-' ? lec.roomLocation : 'PB-101-01';
  const specialization = (lec.specialities && lec.specialities.length > 0)
    ? lec.specialities[0]
    : 'Computer Science & Software Engineering';

  return {
    ...lec,
    office,
    roomLocation: office,
    staffId,
    avatar,
    specialization,
  };
});

// Helper to generate realistic weekly consultation hours for any FSKTM lecturer
function buildAvailabilityForLecturer(lec) {
  const room = lec.roomLocation || lec.office || 'PB-101-01';
  return [
    {
      day: 'Monday',
      slots: [
        { start: '09:00', end: '10:00', location: room },
        { start: '14:00', end: '15:00', location: room },
        { start: '15:00', end: '16:00', location: 'Online (Google Meet)' },
      ],
    },
    {
      day: 'Wednesday',
      slots: [
        { start: '10:00', end: '11:00', location: room },
        { start: '11:00', end: '12:00', location: room },
        { start: '14:00', end: '15:00', location: 'Online (Google Meet)' },
      ],
    },
    {
      day: 'Thursday',
      slots: [
        { start: '10:00', end: '11:00', location: room },
        { start: '14:00', end: '15:00', location: room },
      ],
    },
    {
      day: 'Friday',
      slots: [
        { start: '09:00', end: '10:00', location: room },
        { start: '10:00', end: '11:00', location: 'Online (Zoom)' },
      ],
    },
  ];
}

// Build availability map for all scraped FSKTM lecturers
const initialAvailability = {};
FSKTM_LECTURERS.forEach((lec) => {
  initialAvailability[lec.id] = buildAvailabilityForLecturer(lec);
});

// Primary reference lecturers for initial sample bookings
const primaryLec1 = FSKTM_LECTURERS[0]; // Prof. Ts. Dr. Mohd Farhan
const primaryLec2 = FSKTM_LECTURERS.find((l) => l.name.toLowerCase().includes('suziyanti')) || FSKTM_LECTURERS[1];
const primaryLec3 = FSKTM_LECTURERS.find((l) => l.name.toLowerCase().includes('shahreen')) || FSKTM_LECTURERS[2];
const primaryLec4 = FSKTM_LECTURERS.find((l) => l.name.toLowerCase().includes('zubaile')) || FSKTM_LECTURERS[3];

// Backward-compatibility aliases for L001 - L005
if (primaryLec1) initialAvailability['L001'] = initialAvailability[primaryLec1.id];
if (primaryLec2) initialAvailability['L002'] = initialAvailability[primaryLec2.id];
if (primaryLec3) initialAvailability['L003'] = initialAvailability[primaryLec3.id];
if (primaryLec4) initialAvailability['L004'] = initialAvailability[primaryLec4.id];

export const INITIAL_DATA = {
  users: {
    students: [
      { id: 'S001', name: 'Muhammad Haziq', email: 'haziq@student.uthm.edu.my', phone: '+60 12-345 6789', programme: 'Software Engineering', year: 2, matric: 'AI220123', avatar: 'MH', noShows: 0 },
      { id: 'S002', name: 'Nur Aisyah Binti Rahman', email: 'aisyah@student.uthm.edu.my', phone: '+60 13-456 7890', programme: 'Software Engineering', year: 1, matric: 'AI220045', avatar: 'NA', noShows: 1 },
      { id: 'S003', name: 'Ahmad Irfan', email: 'irfan@student.uthm.edu.my', phone: '+60 14-567 8901', programme: 'Information Security', year: 3, matric: 'BI210088', avatar: 'AI', noShows: 0 },
      { id: 'S004', name: 'Siti Fatimah', email: 'fatimah@student.uthm.edu.my', phone: '+60 15-678 9012', programme: 'Software Engineering', year: 2, matric: 'AI220199', avatar: 'SF', noShows: 2 },
      { id: 'S005', name: 'Lee Wei Jie', email: 'weijie@student.uthm.edu.my', phone: '+60 16-789 0123', programme: 'Multimedia Computing', year: 4, matric: 'CI200032', avatar: 'LW', noShows: 0 },
      { id: 'S006', name: 'Priya Nair', email: 'priya@student.uthm.edu.my', phone: '+60 17-890 1234', programme: 'Software Engineering', year: 1, matric: 'AI230015', avatar: 'PN', noShows: 0 },
    ],
    lecturers: FSKTM_LECTURERS,
    admins: [
      { id: 'A001', name: 'Puan Mollyza Binti Abd Majid', email: 'mollyza@uthm.edu.my', phone: '07-950 8875', staffId: '01890', avatar: 'MM', office: 'PB-101-05A', role: 'Setiausaha Pejabat, FSKTM' },
    ],
  },
  availability: initialAvailability,
  appointments: [
    {
      id: 'BK001',
      studentId: 'S001',
      lecturerId: primaryLec1?.id || 'L001',
      date: '2026-09-22',
      day: 'Monday',
      start: '09:00',
      end: '10:00',
      location: primaryLec1?.roomLocation || 'PB-101-06',
      purpose: 'BIC21102 Professional Ethics consultation and project review',
      status: 'confirmed',
      createdAt: '2026-09-20',
    },
    {
      id: 'BK002',
      studentId: 'S001',
      lecturerId: primaryLec2?.id || 'L002',
      date: '2026-09-23',
      day: 'Tuesday',
      start: '10:00',
      end: '11:00',
      location: primaryLec2?.roomLocation || 'PB-601-08',
      purpose: 'BIT34503 Data Science Lab 1 consultation and questions',
      status: 'pending',
      createdAt: '2026-09-21',
    },
    {
      id: 'BK003',
      studentId: 'S002',
      lecturerId: primaryLec1?.id || 'L001',
      date: '2026-09-22',
      day: 'Monday',
      start: '14:00',
      end: '15:00',
      location: primaryLec1?.roomLocation || 'PB-101-06',
      purpose: 'Project proposal feedback and research scoping',
      status: 'confirmed',
      createdAt: '2026-09-19',
    },
    {
      id: 'BK004',
      studentId: 'S003',
      lecturerId: primaryLec3?.id || 'L003',
      date: '2026-09-24',
      day: 'Wednesday',
      start: '14:00',
      end: '15:00',
      location: primaryLec3?.roomLocation || 'PB-101-08',
      purpose: 'BIW33103 Distributed Database schema review',
      status: 'confirmed',
      createdAt: '2026-09-18',
    },
    {
      id: 'BK005',
      studentId: 'S004',
      lecturerId: primaryLec2?.id || 'L002',
      date: '2026-09-19',
      day: 'Friday',
      start: '09:00',
      end: '10:00',
      location: primaryLec2?.roomLocation || 'PB-601-08',
      purpose: 'BIT34503 Data Science assignment consultation',
      status: 'completed',
      createdAt: '2026-09-17',
      attendance: 'attended',
    },
  ],
  notifications: [
    {
      id: 'N001',
      userId: 'S001',
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: `Your consultation with ${primaryLec1?.name || 'Prof. Ts. Dr. Mohd Farhan'} on Monday at 9:00 AM has been confirmed.`,
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'N002',
      userId: 'S001',
      type: 'booking_pending',
      title: 'Booking Submitted',
      message: `Your consultation request with ${primaryLec2?.name || 'Ts. Dr. Suziyanti'} on Tuesday at 10:00 AM is pending approval.`,
      time: '1 hour ago',
      read: false,
    },
    {
      id: 'N003',
      userId: primaryLec1?.id || 'L001',
      type: 'new_booking',
      title: 'New Booking Request',
      message: 'Muhammad Haziq has requested a consultation on Monday, Sep 22 at 9:00 AM.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'N004',
      userId: 'A001',
      type: 'system',
      title: 'FSKTM System Report',
      message: `Faculty directory synchronised: ${FSKTM_LECTURERS.length} FSKTM lecturers actively registered.`,
      time: 'Just now',
      read: false,
    },
  ],
  announcements: [
    {
      id: 'AN001',
      title: 'FSKTM Consultation Guidelines (Semester 1 2026/2027)',
      message: 'Consultation slots for Semester 1 are now officially published. Please verify room locations (PB/PC blocks) before visiting faculty members.',
      date: '2026-09-21',
      type: 'info',
    },
    {
      id: 'AN002',
      title: 'System Maintenance Notice',
      message: 'ConsultHub will undergo scheduled maintenance on Oct 1, 2026 from 12:00 AM to 6:00 AM.',
      date: '2026-09-20',
      type: 'warning',
    },
  ],
};

/**
 * Resolves the UTHM profile image URL based on user email and ID number.
 * Conforms to community.uthm.edu.my endpoint specification.
 * 
 * @param {string} email User email address
 * @param {string} idNumber Student Matric Number or Staff ID
 * @returns {string} Fully formatted HTTPS image URL or empty string
 */
export function getProfileImageUrl(email = '', idNumber = '', role = '') {
  if (!idNumber) return '';

  const cleanEmail = (email || '').toLowerCase().trim();
  const rawId = String(idNumber).split(',')[0].trim().toUpperCase();
  const cleanRole = (role || '').toLowerCase().trim();

  // Determine if the user is a student
  let isStudent = false;
  if (cleanRole === 'student') {
    isStudent = true;
  } else if (cleanRole === 'lecturer' || cleanRole === 'staff' || cleanRole === 'admin') {
    isStudent = false;
  } else {
    isStudent =
      cleanEmail.includes('student') ||
      cleanEmail.endsWith('@student.uthm.edu.my') ||
      /^[A-Z]{2,4}\d{5,8}$/.test(rawId) ||
      /^[A-Z]\d{2}[A-Z]{2}\d{4}$/.test(rawId);
  }

  if (isStudent) {
    const matric = rawId;
    let session = '20252026'; // Fallback session
    
    // Extract 2-digit intake year from matric string
    const yearMatch = matric.match(/\d{2}/);
    if (yearMatch) {
      const startYear = 2000 + parseInt(yearMatch[0], 10);
      const endYear = startYear + 1;
      session = `${startYear}${endYear}`;
    }

    return `https://community.uthm.edu.my/images/students/${session}/${matric}.jpg`;
  }

  // Staff profile image endpoint
  return `https://community.uthm.edu.my/files/profile/${rawId}.jpeg`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-MY', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function getDateParts(dateStr) {
  if (!dateStr) return { day: '', month: '', weekday: '' };
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-MY', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-MY', { weekday: 'short' }),
  };
}

export function generateId(prefix = 'ID') {
  return prefix + String(Math.floor(Math.random() * 90000) + 10000);
}
