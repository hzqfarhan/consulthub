/**
 * UTHM Community Profile Image Retrieval Utilities
 * Conforms to photofetch.md specifications.
 */

/**
 * Resolves the UTHM profile image URL based on user email, ID number, and optional role.
 * Conforms to community.uthm.edu.my endpoint specification.
 * 
 * @param {string} email User email address (e.g., student@student.uthm.edu.my or staff@uthm.edu.my)
 * @param {string} idNumber Student Matric Number or Staff ID
 * @param {string} role Optional role hint ('student', 'lecturer', 'staff', 'admin')
 * @returns {string} Fully formatted HTTPS image URL or empty string
 */
export function getProfileImageUrl(email = '', idNumber = '', role = '') {
  if (!idNumber) return '';

  const cleanEmail = (email || '').toLowerCase().trim();
  const rawId = String(idNumber).split(',')[0].trim().toUpperCase();
  const cleanRole = (role || '').toLowerCase().trim();

  // 1. USER TYPE IDENTIFICATION:
  // - Student: Email ends with '@student.uthm.edu.my' OR ID matches a student matric number format
  // - Staff: Email ends with '@uthm.edu.my' OR ID matches a UTHM Staff ID
  let isStudent = false;

  if (cleanRole === 'student') {
    isStudent = true;
  } else if (cleanRole === 'lecturer' || cleanRole === 'staff' || cleanRole === 'admin') {
    isStudent = false;
  } else if (cleanEmail.includes('student') || cleanEmail.endsWith('@student.uthm.edu.my')) {
    isStudent = true;
  } else if (cleanEmail.endsWith('@uthm.edu.my')) {
    isStudent = false;
  } else if (/^\d{3,6}$/.test(rawId) || /^[A-Z]\d{4}$/.test(rawId)) {
    // Standard UTHM Staff ID (e.g. 01234 or H5678)
    isStudent = false;
  } else {
    // Matches student matric format e.g. AI220123, BIT21099, CN210045, CI200032
    isStudent = /^[A-Z]/.test(rawId);
  }

  // 2. STUDENT IMAGE ENDPOINT:
  // URL Pattern: https://community.uthm.edu.my/images/students/{SESSION}/{MATRIC}.jpg
  if (isStudent) {
    const matric = rawId;
    let session = '20252026'; // Default fallback session

    // Extract 2-digit intake year from the matric string (e.g., "AI220123" -> "22")
    const yearMatch = matric.match(/\d{2}/);
    if (yearMatch) {
      const startYear = 2000 + parseInt(yearMatch[0], 10);
      const endYear = startYear + 1;
      session = `${startYear}${endYear}`;
    }

    return `https://community.uthm.edu.my/images/students/${session}/${matric}.jpg`;
  }

  // 3. STAFF IMAGE ENDPOINT:
  // URL Pattern: https://community.uthm.edu.my/images/profiles/{STAFF_ID}.jpg
  return `https://community.uthm.edu.my/images/profiles/${rawId}.jpg`;
}
