/* ============================================
   ConsultHub — Main Application Logic
   ============================================ */

// ── State ──
let currentRole = 'student';
let currentPage = 'dashboard';
let selectedLecturer = null;
let selectedSlot = null;
let bookingFilter = 'all';

// ── Init ──
function initConsultHub() {
    if (typeof setupAuth === 'function') setupAuth();
    if (typeof setupSidebarToggle === 'function') setupSidebarToggle();
}

if (typeof window !== 'undefined') {
    window.initConsultHub = initConsultHub;
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initConsultHub);
        } else {
            setTimeout(initConsultHub, 0);
        }
    }
}

// ============================================
// AUTH
// ============================================
function setupAuth() {
    // Role tabs
    document.querySelectorAll('.role-tabs').forEach(tabGroup => {
        tabGroup.querySelectorAll('.role-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabGroup.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentRole = tab.dataset.role;

                // Toggle student/lecturer fields in register
                if (tabGroup.id === 'register-role-tabs') {
                    const isStudent = currentRole === 'student';
                    document.querySelectorAll('.student-field').forEach(el => el.style.display = isStudent ? '' : 'none');
                    document.querySelectorAll('.lecturer-field').forEach(el => el.style.display = isStudent ? 'none' : '');
                }
            });
        });
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        loginAs(currentRole);
    });

    // Register form
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Account created successfully!', 'success');
        setTimeout(() => loginAs(currentRole === 'admin' ? 'student' : currentRole), 500);
    });

    // Switch auth pages
    document.getElementById('go-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('register-page').classList.add('active');
    });

    document.getElementById('go-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-page').classList.remove('active');
        document.getElementById('login-page').classList.add('active');
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function loginAs(role) {
    currentRole = role;
    let user;
    if (role === 'student') user = MOCK_DATA.users.students[0];
    else if (role === 'lecturer') user = MOCK_DATA.users.lecturers[0];
    else user = MOCK_DATA.users.admins[0];

    MOCK_DATA.currentUser = user;

    // Update UI
    document.getElementById('sidebar-avatar').textContent = user.avatar;
    document.getElementById('header-avatar').textContent = user.avatar;
    document.getElementById('sidebar-username').textContent = user.name.split(' ').slice(0, 2).join(' ');
    document.getElementById('sidebar-userrole').textContent = role.charAt(0).toUpperCase() + role.slice(1);

    // Update notification count
    const userNotifs = MOCK_DATA.notifications.filter(n => n.userId === user.id && !n.read);
    document.getElementById('notif-count').textContent = userNotifs.length;

    // Build sidebar navigation
    buildSidebar(role);

    // Switch to app
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');

    // Navigate to dashboard
    navigate('dashboard');
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
}

function logout() {
    MOCK_DATA.currentUser = null;
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('login-page').classList.add('active');
    document.getElementById('register-page').classList.remove('active');
    showToast('Logged out successfully', 'info');
}

// ============================================
// SIDEBAR
// ============================================
function buildSidebar(role) {
    const nav = document.getElementById('sidebar-nav');
    let items = [];

    if (role === 'student') {
        items = [
            { section: 'Main' },
            { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
            { id: 'browse-lecturers', icon: 'people', label: 'Browse Lecturers' },
            { id: 'my-bookings', icon: 'calendar_month', label: 'My Bookings', badge: '2' },
            { section: 'Account' },
            { id: 'notifications', icon: 'notifications', label: 'Notifications', badge: '3' },
            { id: 'profile', icon: 'person', label: 'Profile' },
        ];
    } else if (role === 'lecturer') {
        items = [
            { section: 'Main' },
            { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
            { id: 'my-schedule', icon: 'calendar_month', label: 'My Schedule' },
            { id: 'set-availability', icon: 'edit_calendar', label: 'Set Availability' },
            { id: 'manage-bookings', icon: 'book_online', label: 'Manage Bookings', badge: '2' },
            { section: 'Account' },
            { id: 'notifications', icon: 'notifications', label: 'Notifications', badge: '2' },
            { id: 'profile', icon: 'person', label: 'Profile' },
        ];
    } else {
        items = [
            { section: 'Main' },
            { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
            { id: 'user-management', icon: 'manage_accounts', label: 'User Management' },
            { id: 'all-bookings', icon: 'book_online', label: 'All Bookings' },
            { id: 'reports', icon: 'analytics', label: 'Reports' },
            { id: 'announcements', icon: 'campaign', label: 'Announcements' },
            { section: 'Account' },
            { id: 'notifications', icon: 'notifications', label: 'Notifications', badge: '1' },
            { id: 'profile', icon: 'person', label: 'Profile' },
        ];
    }

    nav.innerHTML = items.map(item => {
        if (item.section) return `<div class="nav-section-label">${item.section}</div>`;
        return `
            <a class="nav-item ${item.id === currentPage ? 'active' : ''}" data-page="${item.id}" onclick="navigate('${item.id}')">
                <span class="material-icons-round">${item.icon}</span>
                <span>${item.label}</span>
                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </a>
        `;
    }).join('');
}

function setupSidebarToggle() {
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

// ============================================
// ROUTER
// ============================================
function navigate(page, data) {
    currentPage = page;
    selectedSlot = null;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');

    // Page titles
    const titles = {
        'dashboard': 'Dashboard',
        'browse-lecturers': 'Browse Lecturers',
        'my-bookings': 'My Bookings',
        'lecturer-detail': data ? `Book with ${getLecturerById(data)?.name || 'Lecturer'}` : 'Lecturer',
        'booking-confirmation': 'Booking Confirmed',
        'my-schedule': 'My Schedule',
        'set-availability': 'Set Availability',
        'manage-bookings': 'Manage Bookings',
        'user-management': 'User Management',
        'all-bookings': 'All Bookings',
        'reports': 'Reports & Analytics',
        'announcements': 'Announcements',
        'notifications': 'Notifications',
        'profile': 'My Profile',
    };

    document.getElementById('page-title').textContent = titles[page] || 'Dashboard';

    // Render page
    const content = document.getElementById('page-content');
    content.scrollTop = 0;

    const renderers = {
        'dashboard': () => currentRole === 'student' ? renderStudentDashboard() : currentRole === 'lecturer' ? renderLecturerDashboard() : renderAdminDashboard(),
        'browse-lecturers': renderBrowseLecturers,
        'my-bookings': renderMyBookings,
        'lecturer-detail': () => renderLecturerDetail(data),
        'booking-confirmation': () => renderBookingConfirmation(data),
        'my-schedule': renderMySchedule,
        'set-availability': renderSetAvailability,
        'manage-bookings': renderManageBookings,
        'user-management': renderUserManagement,
        'all-bookings': renderAllBookings,
        'reports': renderReports,
        'announcements': renderAnnouncements,
        'notifications': renderNotifications,
        'profile': renderProfile,
    };

    content.innerHTML = (renderers[page] || renderers['dashboard'])();
}

// ============================================
// STUDENT PAGES
// ============================================
function renderStudentDashboard() {
    const user = MOCK_DATA.currentUser;
    const myBookings = MOCK_DATA.appointments.filter(a => a.studentId === user.id);
    const upcoming = myBookings.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const completed = myBookings.filter(a => a.status === 'completed');

    return `
        <div class="welcome-banner">
            <h1>Good morning, ${user.name.split(' ')[0]}! 👋</h1>
            <p>Ready to book your next consultation? Browse available lecturers and find a time that works for you.</p>
            <button class="btn" onclick="navigate('browse-lecturers')">
                <span class="material-icons-round">search</span> Find a Lecturer
            </button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon indigo"><span class="material-icons-round">calendar_month</span></div>
                <div class="stat-info">
                    <h4>${upcoming.length}</h4>
                    <p>Upcoming Bookings</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon emerald"><span class="material-icons-round">check_circle</span></div>
                <div class="stat-info">
                    <h4>${completed.length}</h4>
                    <p>Completed</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon amber"><span class="material-icons-round">pending</span></div>
                <div class="stat-info">
                    <h4>${myBookings.filter(a => a.status === 'pending').length}</h4>
                    <p>Pending Approval</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon rose"><span class="material-icons-round">person_off</span></div>
                <div class="stat-info">
                    <h4>${user.noShows}</h4>
                    <p>No-Shows</p>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Upcoming Consultations</h3>
                    <button class="btn btn-sm btn-secondary" onclick="navigate('my-bookings')">View All</button>
                </div>
                ${upcoming.length > 0 ? `<div class="booking-list">${upcoming.slice(0, 3).map(a => renderBookingItem(a, 'student')).join('')}</div>` : '<div class="empty-state"><span class="material-icons-round">event_busy</span><h3>No upcoming bookings</h3><p>Browse lecturers to book a consultation</p></div>'}
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div class="quick-actions">
                    <div class="quick-action" onclick="navigate('browse-lecturers')">
                        <div class="qa-icon" style="background:var(--primary-light);color:var(--primary)">
                            <span class="material-icons-round">person_search</span>
                        </div>
                        <span>Browse Lecturers</span>
                    </div>
                    <div class="quick-action" onclick="navigate('my-bookings')">
                        <div class="qa-icon" style="background:var(--success-light);color:var(--success)">
                            <span class="material-icons-round">event_note</span>
                        </div>
                        <span>My Bookings</span>
                    </div>
                    <div class="quick-action" onclick="navigate('notifications')">
                        <div class="qa-icon" style="background:var(--warning-light);color:var(--warning)">
                            <span class="material-icons-round">notifications_active</span>
                        </div>
                        <span>Notifications</span>
                    </div>
                    <div class="quick-action" onclick="navigate('profile')">
                        <div class="qa-icon" style="background:var(--accent-light);color:var(--accent)">
                            <span class="material-icons-round">settings</span>
                        </div>
                        <span>My Profile</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBrowseLecturers() {
    const lecturers = MOCK_DATA.users.lecturers;
    const departments = [...new Set(lecturers.map(l => l.department))];

    return `
        <div class="section-header">
            <h2>Find a Lecturer</h2>
            <div class="filter-bar">
                <div class="header-search" style="position:relative;display:flex;align-items:center">
                    <span class="material-icons-round" style="position:absolute;left:10px;font-size:20px;color:var(--text-muted)">search</span>
                    <input type="text" placeholder="Search by name or specialization..." 
                           style="width:280px;padding:0.5rem 0.75rem 0.5rem 2.5rem;border:1.5px solid var(--border);border-radius:var(--radius-full);background:var(--surface);font-size:0.85rem;color:var(--text);outline:none"
                           oninput="filterLecturers(this.value)" id="lecturer-search">
                </div>
            </div>
        </div>

        <div class="filter-bar" style="margin-bottom:1.25rem">
            <button class="filter-chip active" onclick="filterByDept(this, 'all')">All</button>
            ${departments.map(d => `<button class="filter-chip" onclick="filterByDept(this, '${d}')">${d}</button>`).join('')}
        </div>

        <div class="lecturers-grid" id="lecturers-grid">
            ${lecturers.map(l => {
                const availDays = MOCK_DATA.availability[l.id] || [];
                const totalSlots = availDays.reduce((sum, d) => sum + d.slots.length, 0);
                const bookedSlots = MOCK_DATA.appointments.filter(a => a.lecturerId === l.id && (a.status === 'confirmed' || a.status === 'pending')).length;
                return `
                <div class="lecturer-card" data-dept="${l.department}" data-name="${l.name.toLowerCase()}" data-spec="${l.specialization.toLowerCase()}" onclick="navigate('lecturer-detail', '${l.id}')">
                    <div class="lecturer-card-header">
                        <div class="avatar avatar-lg">${l.avatar}</div>
                        <div class="lecturer-card-info">
                            <h4>${l.name}</h4>
                            <p>${l.department}</p>
                        </div>
                    </div>
                    <div class="lecturer-card-meta">
                        <span class="meta-tag"><span class="material-icons-round">science</span> ${l.specialization}</span>
                        <span class="meta-tag"><span class="material-icons-round">location_on</span> ${l.office}</span>
                    </div>
                    <div class="lecturer-card-footer">
                        <span class="badge badge-available">
                            <span class="material-icons-round">event_available</span>
                            ${totalSlots - bookedSlots} slots available
                        </span>
                        <button class="btn btn-sm btn-primary">Book Now</button>
                    </div>
                </div>
            `;}).join('')}
        </div>
    `;
}

function filterLecturers(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.lecturer-card').forEach(card => {
        const name = card.dataset.name;
        const spec = card.dataset.spec;
        card.style.display = (name.includes(q) || spec.includes(q)) ? '' : 'none';
    });
}

function filterByDept(btn, dept) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.lecturer-card').forEach(card => {
        card.style.display = (dept === 'all' || card.dataset.dept === dept) ? '' : 'none';
    });
}

function renderLecturerDetail(lecturerId) {
    const l = getLecturerById(lecturerId);
    if (!l) return '<div class="empty-state"><h3>Lecturer not found</h3></div>';

    selectedLecturer = l;
    const avail = MOCK_DATA.availability[l.id] || [];
    const bookedSlots = MOCK_DATA.appointments.filter(a => a.lecturerId === l.id && (a.status === 'confirmed' || a.status === 'pending'));

    return `
        <button class="btn btn-ghost" onclick="navigate('browse-lecturers')" style="margin-bottom:1rem">
            <span class="material-icons-round">arrow_back</span> Back to Lecturers
        </button>

        <div class="card" style="margin-bottom:1.5rem">
            <div style="display:flex;align-items:center;gap:1.25rem">
                <div class="avatar avatar-xl">${l.avatar}</div>
                <div>
                    <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:0.25rem">${l.name}</h2>
                    <p style="color:var(--text-secondary);margin-bottom:0.5rem">${l.department} • ${l.specialization}</p>
                    <div style="display:flex;gap:1rem;flex-wrap:wrap">
                        <span class="meta-tag"><span class="material-icons-round">location_on</span> ${l.office}</span>
                        <span class="meta-tag"><span class="material-icons-round">email</span> ${l.email}</span>
                        <span class="meta-tag"><span class="material-icons-round">phone</span> ${l.phone}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Available Slots</h3>
                    <span class="badge badge-available">${avail.reduce((s, d) => s + d.slots.length, 0)} total</span>
                </div>
                ${avail.length === 0 ? '<p style="color:var(--text-muted)">No availability set</p>' : avail.map(dayAvail => {
                    return `
                        <div style="margin-bottom:1rem">
                            <h4 style="font-size:0.85rem;font-weight:700;color:var(--text-secondary);margin-bottom:0.5rem;display:flex;align-items:center;gap:0.4rem">
                                <span class="material-icons-round" style="font-size:16px">today</span> ${dayAvail.day}
                            </h4>
                            <div class="slots-grid">
                                ${dayAvail.slots.map(slot => {
                                    const isBooked = bookedSlots.some(b => b.day === dayAvail.day && b.start === slot.start);
                                    const slotId = `${dayAvail.day}-${slot.start}`;
                                    return `<button class="slot-btn ${isBooked ? 'booked' : ''}" 
                                                data-slot-id="${slotId}" data-day="${dayAvail.day}" data-start="${slot.start}" data-end="${slot.end}" data-location="${slot.location}"
                                                ${isBooked ? 'disabled' : `onclick="selectSlot(this, '${dayAvail.day}', '${slot.start}', '${slot.end}', '${slot.location}')"`}>
                                        ${slot.start} - ${slot.end}
                                        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px">${isBooked ? 'Booked' : slot.location.split(',')[0]}</div>
                                    </button>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="card" id="booking-form-card">
                <div class="card-header">
                    <h3>Book Consultation</h3>
                </div>
                <div id="booking-form-content">
                    <div class="empty-state" style="padding:2rem 1rem">
                        <span class="material-icons-round">touch_app</span>
                        <h3>Select a time slot</h3>
                        <p>Choose an available slot from the left to proceed</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectSlot(btn, day, start, end, location) {
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSlot = { day, start, end, location };

    // Calculate a future date for the selected day
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const today = new Date();
    const targetDay = days.indexOf(day);
    let diff = targetDay - today.getDay();
    if (diff <= 0) diff += 7;
    const bookDate = new Date(today);
    bookDate.setDate(today.getDate() + diff);
    const dateStr = bookDate.toISOString().split('T')[0];
    selectedSlot.date = dateStr;
    selectedSlot.dateFormatted = formatDate(dateStr);

    document.getElementById('booking-form-content').innerHTML = `
        <form onsubmit="submitBooking(event)">
            <div style="background:var(--primary-light);border-radius:var(--radius-md);padding:1rem;margin-bottom:1.25rem">
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">
                    <span class="material-icons-round" style="color:var(--primary);font-size:18px">event</span>
                    <strong style="font-size:0.9rem">${day}, ${selectedSlot.dateFormatted}</strong>
                </div>
                <div style="font-size:0.85rem;color:var(--text-secondary)">
                    🕐 ${start} - ${end} &nbsp;&bull;&nbsp; 📍 ${location}
                </div>
            </div>

            <div class="form-group" style="margin-bottom:1rem">
                <label for="booking-purpose">Consultation Purpose *</label>
                <div class="input-icon">
                    <span class="material-icons-round">subject</span>
                    <input type="text" id="booking-purpose" placeholder="e.g. Lab 1 consultation" required style="width:100%;padding:0.7rem 0.75rem 0.7rem 2.75rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);outline:none">
                </div>
            </div>

            <div class="form-group" style="margin-bottom:1rem">
                <label for="booking-notes">Additional Notes (Optional)</label>
                <textarea id="booking-notes" rows="3" placeholder="Any additional details..." style="width:100%;padding:0.7rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);resize:vertical;font-family:inherit;font-size:0.9rem;outline:none"></textarea>
            </div>

            <div class="form-group" style="margin-bottom:1.25rem">
                <label>Consultation Mode</label>
                <div style="display:flex;gap:0.5rem">
                    <label class="checkbox-label" style="flex:1;padding:0.6rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer">
                        <input type="radio" name="mode" value="in-person" checked> <span>In-Person</span>
                    </label>
                    <label class="checkbox-label" style="flex:1;padding:0.6rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);cursor:pointer">
                        <input type="radio" name="mode" value="online"> <span>Online</span>
                    </label>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full">
                <span class="material-icons-round">check_circle</span>
                Confirm Booking
            </button>
        </form>
    `;
}

function submitBooking(e) {
    e.preventDefault();
    const purpose = document.getElementById('booking-purpose').value;
    const newBooking = {
        id: generateId('BK'),
        studentId: MOCK_DATA.currentUser.id,
        lecturerId: selectedLecturer.id,
        date: selectedSlot.date,
        day: selectedSlot.day,
        start: selectedSlot.start,
        end: selectedSlot.end,
        location: selectedSlot.location,
        purpose: purpose,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
    };
    MOCK_DATA.appointments.push(newBooking);
    showToast('Booking submitted successfully!', 'success');
    navigate('booking-confirmation', newBooking);
}

function renderBookingConfirmation(booking) {
    if (!booking) return '<div class="empty-state"><h3>No booking data</h3></div>';
    const lecturer = getLecturerById(booking.lecturerId);
    return `
        <div class="card" style="max-width:560px;margin:2rem auto">
            <div class="confirmation-card">
                <div class="confirmation-icon">
                    <span class="material-icons-round">check_circle</span>
                </div>
                <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:0.5rem">Booking Submitted!</h2>
                <p style="color:var(--text-muted);font-size:0.95rem">Your consultation request has been sent to the lecturer for approval.</p>

                <div class="confirmation-details">
                    <div class="detail-row"><span class="detail-label">Booking ID</span><span class="detail-value">${booking.id}</span></div>
                    <div class="detail-row"><span class="detail-label">Lecturer</span><span class="detail-value">${lecturer?.name || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${booking.day}, ${formatDate(booking.date)}</span></div>
                    <div class="detail-row"><span class="detail-label">Time</span><span class="detail-value">${booking.start} - ${booking.end}</span></div>
                    <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${booking.location}</span></div>
                    <div class="detail-row"><span class="detail-label">Purpose</span><span class="detail-value">${booking.purpose}</span></div>
                    <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge badge-pending">Pending</span></span></div>
                </div>

                <div style="display:flex;gap:0.75rem;justify-content:center;margin-top:0.5rem">
                    <button class="btn btn-primary" onclick="navigate('my-bookings')">
                        <span class="material-icons-round">list</span> View My Bookings
                    </button>
                    <button class="btn btn-outline" onclick="navigate('dashboard')">
                        <span class="material-icons-round">home</span> Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderMyBookings() {
    const user = MOCK_DATA.currentUser;
    const myBookings = MOCK_DATA.appointments.filter(a => a.studentId === user.id);

    return `
        <div class="section-header">
            <h2>My Bookings</h2>
        </div>

        <div class="filter-bar" style="margin-bottom:1.25rem">
            <button class="filter-chip ${bookingFilter === 'all' ? 'active' : ''}" onclick="setBookingFilter(this,'all')">All (${myBookings.length})</button>
            <button class="filter-chip ${bookingFilter === 'confirmed' ? 'active' : ''}" onclick="setBookingFilter(this,'confirmed')">Confirmed (${myBookings.filter(a=>a.status==='confirmed').length})</button>
            <button class="filter-chip ${bookingFilter === 'pending' ? 'active' : ''}" onclick="setBookingFilter(this,'pending')">Pending (${myBookings.filter(a=>a.status==='pending').length})</button>
            <button class="filter-chip ${bookingFilter === 'completed' ? 'active' : ''}" onclick="setBookingFilter(this,'completed')">Completed (${myBookings.filter(a=>a.status==='completed').length})</button>
            <button class="filter-chip ${bookingFilter === 'cancelled' ? 'active' : ''}" onclick="setBookingFilter(this,'cancelled')">Cancelled (${myBookings.filter(a=>a.status==='cancelled').length})</button>
        </div>

        <div class="booking-list" id="bookings-list">
            ${renderFilteredBookings(myBookings, 'student')}
        </div>
    `;
}

function setBookingFilter(btn, filter) {
    bookingFilter = filter;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const user = MOCK_DATA.currentUser;
    const myBookings = MOCK_DATA.appointments.filter(a => {
        if (currentRole === 'student') return a.studentId === user.id;
        return true;
    });
    document.getElementById('bookings-list').innerHTML = renderFilteredBookings(myBookings, currentRole === 'student' ? 'student' : 'admin');
}

function renderFilteredBookings(bookings, viewAs) {
    let filtered = bookingFilter === 'all' ? bookings : bookings.filter(a => a.status === bookingFilter);
    if (filtered.length === 0) return '<div class="empty-state"><span class="material-icons-round">event_busy</span><h3>No bookings found</h3><p>No bookings match this filter.</p></div>';
    return filtered.map(a => renderBookingItem(a, viewAs)).join('');
}

function renderBookingItem(a, viewAs) {
    const dateParts = getDateParts(a.date);
    const otherUser = viewAs === 'student' ? getLecturerById(a.lecturerId) : getStudentById(a.studentId);
    const otherName = otherUser?.name || 'Unknown';
    const statusBadge = {
        'confirmed': 'badge-confirmed',
        'pending': 'badge-pending',
        'completed': 'badge-completed',
        'cancelled': 'badge-cancelled',
        'no-show': 'badge-noshow',
    };

    return `
        <div class="booking-item">
            <div class="booking-date-badge">
                <span class="day">${dateParts.day}</span>
                <span class="month">${dateParts.month}</span>
            </div>
            <div class="booking-details">
                <h4>${a.purpose}</h4>
                <p>${viewAs === 'student' ? 'with' : 'by'} ${otherName}</p>
                <div class="booking-meta">
                    <span><span class="material-icons-round">schedule</span> ${a.start} - ${a.end}</span>
                    <span><span class="material-icons-round">location_on</span> ${a.location}</span>
                </div>
            </div>
            <span class="badge ${statusBadge[a.status] || 'badge-info'}">${a.status}</span>
            <div class="booking-actions">
                ${a.status === 'confirmed' || a.status === 'pending' ? `
                    <button class="btn btn-sm btn-outline" onclick="rescheduleBooking('${a.id}')">
                        <span class="material-icons-round">edit_calendar</span> Reschedule
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelBooking('${a.id}')">
                        <span class="material-icons-round">close</span> Cancel
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function cancelBooking(bookingId) {
    const booking = MOCK_DATA.appointments.find(a => a.id === bookingId);
    if (booking) {
        openModal('Cancel Booking', `
            <p style="margin-bottom:1rem">Are you sure you want to cancel this booking?</p>
            <div style="background:var(--danger-light);border-radius:var(--radius-md);padding:1rem;margin-bottom:1.25rem">
                <strong>${booking.purpose}</strong><br>
                <span style="font-size:0.85rem;color:var(--text-secondary)">${booking.day}, ${booking.start} - ${booking.end}</span>
            </div>
            <div class="form-group" style="margin-bottom:1.25rem">
                <label>Reason for cancellation (optional)</label>
                <textarea rows="2" style="width:100%;padding:0.7rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);resize:vertical;font-family:inherit;font-size:0.9rem;outline:none" placeholder="Enter reason..."></textarea>
            </div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end">
                <button class="btn btn-outline" onclick="closeModal()">Keep Booking</button>
                <button class="btn btn-danger" onclick="confirmCancelBooking('${bookingId}')">Cancel Booking</button>
            </div>
        `);
    }
}

function confirmCancelBooking(bookingId) {
    const booking = MOCK_DATA.appointments.find(a => a.id === bookingId);
    if (booking) {
        booking.status = 'cancelled';
        closeModal();
        showToast('Booking cancelled successfully', 'success');
        navigate(currentPage);
    }
}

function rescheduleBooking(bookingId) {
    const booking = MOCK_DATA.appointments.find(a => a.id === bookingId);
    if (booking) {
        showToast('Redirecting to reschedule...', 'info');
        setTimeout(() => navigate('lecturer-detail', booking.lecturerId), 300);
    }
}

// ============================================
// LECTURER PAGES
// ============================================
function renderLecturerDashboard() {
    const user = MOCK_DATA.currentUser;
    const myBookings = MOCK_DATA.appointments.filter(a => a.lecturerId === user.id);
    const todayBookings = myBookings.filter(a => a.status === 'confirmed');
    const pendingBookings = myBookings.filter(a => a.status === 'pending');
    const avail = MOCK_DATA.availability[user.id] || [];
    const totalSlots = avail.reduce((s, d) => s + d.slots.length, 0);

    return `
        <div class="welcome-banner">
            <h1>Welcome, ${user.name}! 📚</h1>
            <p>You have ${pendingBookings.length} pending booking requests and ${todayBookings.length} confirmed consultations.</p>
            <button class="btn" onclick="navigate('manage-bookings')">
                <span class="material-icons-round">book_online</span> Manage Bookings
            </button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon indigo"><span class="material-icons-round">event_available</span></div>
                <div class="stat-info">
                    <h4>${totalSlots}</h4>
                    <p>Available Slots</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon amber"><span class="material-icons-round">pending_actions</span></div>
                <div class="stat-info">
                    <h4>${pendingBookings.length}</h4>
                    <p>Pending Requests</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon emerald"><span class="material-icons-round">check_circle</span></div>
                <div class="stat-info">
                    <h4>${todayBookings.length}</h4>
                    <p>Confirmed</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon rose"><span class="material-icons-round">event_busy</span></div>
                <div class="stat-info">
                    <h4>${myBookings.filter(a=>a.status==='completed').length}</h4>
                    <p>Completed</p>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <h3>Pending Requests</h3>
                    <button class="btn btn-sm btn-secondary" onclick="navigate('manage-bookings')">View All</button>
                </div>
                ${pendingBookings.length > 0 ? `<div class="booking-list">${pendingBookings.map(a => {
                    const student = getStudentById(a.studentId);
                    return `
                        <div class="booking-item">
                            <div class="avatar">${student?.avatar || '?'}</div>
                            <div class="booking-details">
                                <h4>${student?.name || 'Unknown Student'}</h4>
                                <p>${a.purpose}</p>
                                <div class="booking-meta">
                                    <span><span class="material-icons-round">schedule</span> ${a.day}, ${a.start}-${a.end}</span>
                                </div>
                            </div>
                            <div class="booking-actions">
                                <button class="btn btn-sm btn-success" onclick="approveBooking('${a.id}')">
                                    <span class="material-icons-round">check</span> Approve
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="rejectBooking('${a.id}')">
                                    <span class="material-icons-round">close</span> Reject
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}</div>` : '<div class="empty-state"><span class="material-icons-round">inbox</span><h3>No pending requests</h3></div>'}
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Today's Schedule</h3>
                </div>
                ${todayBookings.length > 0 ? `<div class="booking-list">${todayBookings.slice(0,3).map(a => renderBookingItem(a, 'lecturer')).join('')}</div>` : '<div class="empty-state"><span class="material-icons-round">event</span><h3>No consultations today</h3><p>Enjoy your free time!</p></div>'}
            </div>
        </div>
    `;
}

function renderMySchedule() {
    const user = MOCK_DATA.currentUser;
    const myBookings = MOCK_DATA.appointments.filter(a => a.lecturerId === user.id && (a.status === 'confirmed' || a.status === 'pending'));
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return `
        <div class="section-header">
            <h2>Weekly Schedule</h2>
            <div style="display:flex;gap:0.5rem">
                <button class="btn btn-outline btn-sm"><span class="material-icons-round">chevron_left</span></button>
                <button class="btn btn-secondary btn-sm">This Week (Sep 22 - Sep 28)</button>
                <button class="btn btn-outline btn-sm"><span class="material-icons-round">chevron_right</span></button>
            </div>
        </div>

        <div class="card">
            <div class="schedule-grid">
                ${days.map(d => `<div class="schedule-day-header">${d}</div>`).join('')}
                ${Array.from({length: 7}, (_, i) => {
                    const date = 22 + i;
                    const dayName = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i];
                    const dayBookings = myBookings.filter(a => a.day === dayName);
                    const isToday = i === 0;
                    return `
                        <div class="schedule-cell ${isToday ? 'today' : ''}">
                            <div class="date-num">${date}</div>
                            ${dayBookings.map(b => `<div class="schedule-event ${b.status}" title="${b.purpose}">${b.start} ${getStudentById(b.studentId)?.name?.split(' ')[0] || ''}</div>`).join('')}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <div class="card" style="margin-top:1.25rem">
            <div class="card-header"><h3>Upcoming Bookings</h3></div>
            <div class="booking-list">
                ${myBookings.map(a => renderBookingItem(a, 'lecturer')).join('') || '<div class="empty-state"><span class="material-icons-round">event</span><h3>No upcoming bookings</h3></div>'}
            </div>
        </div>
    `;
}

function renderSetAvailability() {
    const user = MOCK_DATA.currentUser;
    const avail = MOCK_DATA.availability[user.id] || [];
    const allDays = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

    return `
        <div class="section-header">
            <h2>Manage Your Availability</h2>
            <button class="btn btn-primary" onclick="openAddSlotModal()">
                <span class="material-icons-round">add</span> Add Slot
            </button>
        </div>

        <div id="availability-list">
            ${allDays.map(day => {
                const dayData = avail.find(a => a.day === day);
                const slots = dayData?.slots || [];
                return `
                    <div class="availability-day">
                        <div class="availability-day-header">
                            <h4><span class="material-icons-round" style="color:var(--primary);font-size:18px">today</span> ${day}</h4>
                            <button class="btn btn-sm btn-secondary" onclick="openAddSlotModal('${day}')">
                                <span class="material-icons-round">add</span> Add
                            </button>
                        </div>
                        <div class="availability-slots">
                            ${slots.length > 0 ? slots.map((s, idx) => `
                                <div class="avail-slot">
                                    <span class="material-icons-round" style="font-size:16px">schedule</span>
                                    ${s.start} - ${s.end}
                                    <span style="font-size:0.72rem;color:var(--text-muted)">(${s.location})</span>
                                    <span class="material-icons-round remove-slot" onclick="removeSlot('${day}', ${idx})">close</span>
                                </div>
                            `).join('') : '<span style="font-size:0.82rem;color:var(--text-muted)">No slots set</span>'}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function openAddSlotModal(day) {
    openModal('Add Availability Slot', `
        <form onsubmit="addNewSlot(event)">
            <div class="form-group" style="margin-bottom:1rem">
                <label>Day</label>
                <select id="slot-day" style="width:100%;padding:0.65rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;outline:none">
                    ${['Monday','Tuesday','Wednesday','Thursday','Friday'].map(d => `<option value="${d}" ${d===day?'selected':''}>${d}</option>`).join('')}
                </select>
            </div>
            <div class="form-row-2col" style="margin-bottom:1rem">
                <div class="form-group">
                    <label>Start Time</label>
                    <input type="time" id="slot-start" value="09:00" style="width:100%;padding:0.65rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;outline:none" required>
                </div>
                <div class="form-group">
                    <label>End Time</label>
                    <input type="time" id="slot-end" value="10:00" style="width:100%;padding:0.65rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;outline:none" required>
                </div>
            </div>
            <div class="form-group" style="margin-bottom:1.25rem">
                <label>Location</label>
                <input type="text" id="slot-location" value="${MOCK_DATA.currentUser?.office || ''}" placeholder="Room number or online link" style="width:100%;padding:0.65rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;outline:none" required>
            </div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary"><span class="material-icons-round">add</span> Add Slot</button>
            </div>
        </form>
    `);
}

function addNewSlot(e) {
    e.preventDefault();
    const day = document.getElementById('slot-day').value;
    const start = document.getElementById('slot-start').value;
    const end = document.getElementById('slot-end').value;
    const location = document.getElementById('slot-location').value;
    const userId = MOCK_DATA.currentUser.id;

    if (!MOCK_DATA.availability[userId]) MOCK_DATA.availability[userId] = [];
    let dayAvail = MOCK_DATA.availability[userId].find(a => a.day === day);
    if (!dayAvail) {
        dayAvail = { day, slots: [] };
        MOCK_DATA.availability[userId].push(dayAvail);
    }
    dayAvail.slots.push({ start, end, location });
    closeModal();
    showToast('Slot added successfully!', 'success');
    navigate('set-availability');
}

function removeSlot(day, idx) {
    const userId = MOCK_DATA.currentUser.id;
    const dayAvail = MOCK_DATA.availability[userId]?.find(a => a.day === day);
    if (dayAvail) {
        dayAvail.slots.splice(idx, 1);
        showToast('Slot removed', 'info');
        navigate('set-availability');
    }
}

function renderManageBookings() {
    const user = MOCK_DATA.currentUser;
    const myBookings = MOCK_DATA.appointments.filter(a => a.lecturerId === user.id);
    const pending = myBookings.filter(a => a.status === 'pending');
    const confirmed = myBookings.filter(a => a.status === 'confirmed');
    const completed = myBookings.filter(a => a.status === 'completed');

    return `
        <div class="tabs">
            <div class="tab active" onclick="switchTab(this, 'pending-tab')">Pending (${pending.length})</div>
            <div class="tab" onclick="switchTab(this, 'confirmed-tab')">Confirmed (${confirmed.length})</div>
            <div class="tab" onclick="switchTab(this, 'completed-tab')">Completed (${completed.length})</div>
            <div class="tab" onclick="switchTab(this, 'all-tab')">All (${myBookings.length})</div>
        </div>

        <div id="pending-tab" class="tab-content">
            ${pending.length > 0 ? `<div class="booking-list">${pending.map(a => {
                const student = getStudentById(a.studentId);
                return `
                    <div class="booking-item">
                        <div class="avatar">${student?.avatar || '?'}</div>
                        <div class="booking-details">
                            <h4>${student?.name || 'Unknown'}</h4>
                            <p>${a.purpose}</p>
                            <div class="booking-meta">
                                <span><span class="material-icons-round">schedule</span> ${a.day}, ${a.start} - ${a.end}</span>
                                <span><span class="material-icons-round">location_on</span> ${a.location}</span>
                            </div>
                        </div>
                        <div class="booking-actions">
                            <button class="btn btn-sm btn-success" onclick="approveBooking('${a.id}')"><span class="material-icons-round">check</span> Approve</button>
                            <button class="btn btn-sm btn-danger" onclick="rejectBooking('${a.id}')"><span class="material-icons-round">close</span> Reject</button>
                        </div>
                    </div>
                `;
            }).join('')}</div>` : '<div class="empty-state"><span class="material-icons-round">inbox</span><h3>No pending requests</h3></div>'}
        </div>

        <div id="confirmed-tab" class="tab-content" style="display:none">
            ${confirmed.length > 0 ? `<div class="booking-list">${confirmed.map(a => {
                const student = getStudentById(a.studentId);
                return `
                    <div class="booking-item">
                        <div class="avatar">${student?.avatar || '?'}</div>
                        <div class="booking-details">
                            <h4>${student?.name || 'Unknown'}</h4>
                            <p>${a.purpose}</p>
                            <div class="booking-meta">
                                <span><span class="material-icons-round">schedule</span> ${a.day}, ${a.start} - ${a.end}</span>
                                <span><span class="material-icons-round">location_on</span> ${a.location}</span>
                            </div>
                        </div>
                        <span class="badge badge-confirmed">Confirmed</span>
                        <div class="booking-actions">
                            <button class="btn btn-sm btn-success" onclick="markAttendance('${a.id}','attended')"><span class="material-icons-round">how_to_reg</span> Attended</button>
                            <button class="btn btn-sm btn-warning" onclick="markAttendance('${a.id}','no-show')"><span class="material-icons-round">person_off</span> No-Show</button>
                            <button class="btn btn-sm btn-outline" onclick="cancelBooking('${a.id}')"><span class="material-icons-round">close</span></button>
                        </div>
                    </div>
                `;
            }).join('')}</div>` : '<div class="empty-state"><span class="material-icons-round">event</span><h3>No confirmed bookings</h3></div>'}
        </div>

        <div id="completed-tab" class="tab-content" style="display:none">
            ${completed.length > 0 ? `<div class="booking-list">${completed.map(a => {
                const student = getStudentById(a.studentId);
                return `
                    <div class="booking-item">
                        <div class="avatar">${student?.avatar || '?'}</div>
                        <div class="booking-details">
                            <h4>${student?.name || 'Unknown'}</h4>
                            <p>${a.purpose}</p>
                            <div class="booking-meta">
                                <span><span class="material-icons-round">schedule</span> ${a.day}, ${a.start} - ${a.end}</span>
                            </div>
                        </div>
                        <span class="badge ${a.attendance === 'no-show' ? 'badge-noshow' : 'badge-completed'}">${a.attendance || 'completed'}</span>
                    </div>
                `;
            }).join('')}</div>` : '<div class="empty-state"><span class="material-icons-round">history</span><h3>No completed consultations</h3></div>'}
        </div>

        <div id="all-tab" class="tab-content" style="display:none">
            <div class="booking-list">
                ${myBookings.map(a => renderBookingItem(a, 'lecturer')).join('')}
            </div>
        </div>
    `;
}

function switchTab(btn, tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
    document.getElementById(tabId).style.display = '';
}

function approveBooking(bookingId) {
    const booking = MOCK_DATA.appointments.find(a => a.id === bookingId);
    if (booking) {
        booking.status = 'confirmed';
        showToast('Booking approved!', 'success');
        navigate(currentPage);
    }
}

function rejectBooking(bookingId) {
    openModal('Reject Booking', `
        <p style="margin-bottom:1rem">Are you sure you want to reject this booking?</p>
        <div class="form-group" style="margin-bottom:1.25rem">
            <label>Reason (optional)</label>
            <textarea rows="3" style="width:100%;padding:0.7rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);resize:vertical;font-family:inherit;font-size:0.9rem;outline:none" placeholder="Enter reason for rejection..."></textarea>
        </div>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end">
            <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
            <button class="btn btn-danger" onclick="confirmRejectBooking('${bookingId}')">Reject</button>
        </div>
    `);
}

function confirmRejectBooking(bookingId) {
    const booking = MOCK_DATA.appointments.find(a => a.id === bookingId);
    if (booking) {
        booking.status = 'cancelled';
        closeModal();
        showToast('Booking rejected', 'info');
        navigate(currentPage);
    }
}

function markAttendance(bookingId, status) {
    const booking = MOCK_DATA.appointments.find(a => a.id === bookingId);
    if (booking) {
        booking.status = 'completed';
        booking.attendance = status;
        if (status === 'no-show') {
            const student = getStudentById(booking.studentId);
            if (student) student.noShows++;
        }
        showToast(`Marked as ${status === 'attended' ? 'Attended' : 'No-Show'}`, status === 'attended' ? 'success' : 'warning');
        navigate(currentPage);
    }
}

// ============================================
// ADMIN PAGES
// ============================================
function renderAdminDashboard() {
    const totalStudents = MOCK_DATA.users.students.length;
    const totalLecturers = MOCK_DATA.users.lecturers.length;
    const totalBookings = MOCK_DATA.appointments.length;
    const totalNoShows = MOCK_DATA.appointments.filter(a => a.attendance === 'no-show').length;

    return `
        <div class="welcome-banner">
            <h1>Admin Dashboard 🛡️</h1>
            <p>System overview and management tools for the FSKTM Consultation Booking System.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon indigo"><span class="material-icons-round">people</span></div>
                <div class="stat-info">
                    <h4>${totalStudents}</h4>
                    <p>Students</p>
                    <div class="stat-trend up">↑ 12% this month</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon cyan"><span class="material-icons-round">co_present</span></div>
                <div class="stat-info">
                    <h4>${totalLecturers}</h4>
                    <p>Lecturers</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon emerald"><span class="material-icons-round">book_online</span></div>
                <div class="stat-info">
                    <h4>${totalBookings}</h4>
                    <p>Total Bookings</p>
                    <div class="stat-trend up">↑ 8% this week</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon rose"><span class="material-icons-round">person_off</span></div>
                <div class="stat-info">
                    <h4>${totalNoShows}</h4>
                    <p>No-Shows</p>
                    <div class="stat-trend down">↓ 5% vs last month</div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header"><h3>Bookings by Day</h3></div>
                <div class="bar-chart">
                    ${['Mon','Tue','Wed','Thu','Fri'].map((d, i) => {
                        const heights = [75, 45, 60, 30, 55];
                        const vals = [3, 2, 4, 1, 3];
                        return `<div class="bar-col">
                            <div class="bar-value">${vals[i]}</div>
                            <div class="bar" style="height:${heights[i]}%"></div>
                            <div class="bar-label">${d}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>Recent Activity</h3></div>
                <div class="booking-list">
                    ${MOCK_DATA.appointments.slice(0, 4).map(a => {
                        const student = getStudentById(a.studentId);
                        const lecturer = getLecturerById(a.lecturerId);
                        return `
                            <div class="booking-item" style="padding:0.85rem">
                                <div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${student?.avatar || '?'}</div>
                                <div class="booking-details">
                                    <h4 style="font-size:0.85rem">${student?.name || 'Unknown'} → ${lecturer?.name || 'Unknown'}</h4>
                                    <p>${a.purpose}</p>
                                </div>
                                <span class="badge badge-${a.status}">${a.status}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderUserManagement() {
    return `
        <div class="tabs">
            <div class="tab active" onclick="switchTab(this, 'students-tab')">Students (${MOCK_DATA.users.students.length})</div>
            <div class="tab" onclick="switchTab(this, 'lecturers-tab')">Lecturers (${MOCK_DATA.users.lecturers.length})</div>
        </div>

        <div id="students-tab" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3>Students</h3>
                    <button class="btn btn-sm btn-primary" onclick="showToast('Add student form - coming soon', 'info')"><span class="material-icons-round">person_add</span> Add Student</button>
                </div>
                <div style="overflow-x:auto">
                    <table class="data-table">
                        <thead><tr><th>Student</th><th>Matric</th><th>Programme</th><th>Year</th><th>No-Shows</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            ${MOCK_DATA.users.students.map(s => `
                                <tr>
                                    <td><div class="table-user"><div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${s.avatar}</div><div class="table-user-info"><span class="name">${s.name}</span><span class="sub">${s.email}</span></div></div></td>
                                    <td>${s.matric}</td>
                                    <td>${s.programme}</td>
                                    <td>Year ${s.year}</td>
                                    <td>${s.noShows > 0 ? `<span class="badge badge-danger">${s.noShows}</span>` : '<span class="badge badge-success">0</span>'}</td>
                                    <td><span class="badge badge-active">Active</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-ghost" onclick="showToast('Edit student profile', 'info')"><span class="material-icons-round">edit</span></button>
                                        <button class="btn btn-sm btn-ghost" onclick="showToast('Student deactivated', 'warning')"><span class="material-icons-round">block</span></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="lecturers-tab" class="tab-content" style="display:none">
            <div class="card">
                <div class="card-header">
                    <h3>Lecturers</h3>
                    <button class="btn btn-sm btn-primary" onclick="showToast('Add lecturer form - coming soon', 'info')"><span class="material-icons-round">person_add</span> Add Lecturer</button>
                </div>
                <div style="overflow-x:auto">
                    <table class="data-table">
                        <thead><tr><th>Lecturer</th><th>Staff ID</th><th>Department</th><th>Specialization</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            ${MOCK_DATA.users.lecturers.map(l => `
                                <tr>
                                    <td><div class="table-user"><div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${l.avatar}</div><div class="table-user-info"><span class="name">${l.name}</span><span class="sub">${l.email}</span></div></div></td>
                                    <td>${l.staffId}</td>
                                    <td>${l.department}</td>
                                    <td>${l.specialization}</td>
                                    <td><span class="badge badge-active">Active</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-ghost" onclick="showToast('Edit lecturer profile', 'info')"><span class="material-icons-round">edit</span></button>
                                        <button class="btn btn-sm btn-ghost" onclick="showToast('Lecturer deactivated', 'warning')"><span class="material-icons-round">block</span></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderAllBookings() {
    const bookings = MOCK_DATA.appointments;
    bookingFilter = 'all';

    return `
        <div class="section-header">
            <h2>All System Bookings</h2>
            <span style="font-size:0.85rem;color:var(--text-muted)">${bookings.length} total bookings</span>
        </div>

        <div class="filter-bar" style="margin-bottom:1.25rem">
            <button class="filter-chip active" onclick="setBookingFilter(this,'all')">All (${bookings.length})</button>
            <button class="filter-chip" onclick="setBookingFilter(this,'confirmed')">Confirmed</button>
            <button class="filter-chip" onclick="setBookingFilter(this,'pending')">Pending</button>
            <button class="filter-chip" onclick="setBookingFilter(this,'completed')">Completed</button>
            <button class="filter-chip" onclick="setBookingFilter(this,'cancelled')">Cancelled</button>
        </div>

        <div class="card">
            <div style="overflow-x:auto">
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Student</th><th>Lecturer</th><th>Date & Time</th><th>Purpose</th><th>Status</th></tr></thead>
                    <tbody id="bookings-list">
                        ${bookings.map(a => {
                            const student = getStudentById(a.studentId);
                            const lecturer = getLecturerById(a.lecturerId);
                            return `<tr class="booking-row" data-status="${a.status}">
                                <td><strong>${a.id}</strong></td>
                                <td><div class="table-user"><div class="avatar" style="width:28px;height:28px;font-size:0.65rem">${student?.avatar||'?'}</div><span class="name">${student?.name||'N/A'}</span></div></td>
                                <td>${lecturer?.name || 'N/A'}</td>
                                <td>${a.day}, ${a.start}-${a.end}</td>
                                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${a.purpose}">${a.purpose}</td>
                                <td><span class="badge badge-${a.status}">${a.status}</span></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderReports() {
    const bookings = MOCK_DATA.appointments;
    const completed = bookings.filter(a => a.status === 'completed').length;
    const noShows = bookings.filter(a => a.attendance === 'no-show').length;
    const cancelled = bookings.filter(a => a.status === 'cancelled').length;

    // Popular lecturers
    const lecturerCounts = {};
    bookings.forEach(b => {
        lecturerCounts[b.lecturerId] = (lecturerCounts[b.lecturerId] || 0) + 1;
    });

    return `
        <div class="section-header">
            <h2>Reports & Analytics</h2>
            <button class="btn btn-outline btn-sm" onclick="showToast('Report exported as PDF', 'success')">
                <span class="material-icons-round">download</span> Export Report
            </button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon emerald"><span class="material-icons-round">check_circle</span></div>
                <div class="stat-info"><h4>${completed}</h4><p>Completed Sessions</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon rose"><span class="material-icons-round">person_off</span></div>
                <div class="stat-info"><h4>${noShows}</h4><p>No-Shows</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon amber"><span class="material-icons-round">cancel</span></div>
                <div class="stat-info"><h4>${cancelled}</h4><p>Cancellations</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue"><span class="material-icons-round">percent</span></div>
                <div class="stat-info"><h4>${bookings.length > 0 ? Math.round((completed / bookings.length) * 100) : 0}%</h4><p>Completion Rate</p></div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header"><h3>Bookings by Day of Week</h3></div>
                <div class="bar-chart">
                    ${['Mon','Tue','Wed','Thu','Fri'].map(d => {
                        const fullDay = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday'}[d];
                        const count = bookings.filter(b => b.day === fullDay).length;
                        const maxCount = Math.max(...['Monday','Tuesday','Wednesday','Thursday','Friday'].map(fd => bookings.filter(b => b.day === fd).length), 1);
                        return `<div class="bar-col">
                            <div class="bar-value">${count}</div>
                            <div class="bar" style="height:${(count/maxCount)*100}%"></div>
                            <div class="bar-label">${d}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>Top Lecturers</h3></div>
                ${Object.entries(lecturerCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([lid, count], i) => {
                    const l = getLecturerById(lid);
                    const max = Object.values(lecturerCounts).reduce((a,b)=>Math.max(a,b), 1);
                    return `
                        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
                            <span style="font-size:0.85rem;font-weight:700;color:var(--text-muted);width:20px">#${i+1}</span>
                            <div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${l?.avatar||'?'}</div>
                            <div style="flex:1">
                                <div style="font-size:0.85rem;font-weight:600">${l?.name||'Unknown'}</div>
                                <div style="height:6px;background:var(--bg);border-radius:3px;margin-top:4px;overflow:hidden">
                                    <div style="height:100%;width:${(count/max)*100}%;background:linear-gradient(90deg,var(--primary),var(--primary-300));border-radius:3px;transition:width 0.6s var(--ease)"></div>
                                </div>
                            </div>
                            <span style="font-size:0.85rem;font-weight:700;color:var(--primary)">${count}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderAnnouncements() {
    return `
        <div class="section-header">
            <h2>System Announcements</h2>
            <button class="btn btn-primary" onclick="openAnnouncementModal()">
                <span class="material-icons-round">add</span> New Announcement
            </button>
        </div>

        ${MOCK_DATA.announcements.map(a => `
            <div class="announcement-card">
                <span class="material-icons-round">${a.type === 'warning' ? 'warning' : 'info'}</span>
                <div style="flex:1">
                    <h4>${a.title}</h4>
                    <p>${a.message}</p>
                    <span style="font-size:0.72rem;color:var(--text-muted)">${formatDate(a.date)}</span>
                </div>
                <button class="btn btn-sm btn-ghost" onclick="showToast('Announcement deleted', 'info')"><span class="material-icons-round">delete</span></button>
            </div>
        `).join('')}
    `;
}

function openAnnouncementModal() {
    openModal('New Announcement', `
        <form onsubmit="addAnnouncement(event)">
            <div class="form-group" style="margin-bottom:1rem">
                <label>Title</label>
                <input type="text" id="ann-title" placeholder="Announcement title" required style="width:100%;padding:0.65rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;outline:none">
            </div>
            <div class="form-group" style="margin-bottom:1rem">
                <label>Message</label>
                <textarea id="ann-message" rows="3" placeholder="Announcement message..." required style="width:100%;padding:0.7rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);resize:vertical;font-family:inherit;font-size:0.9rem;outline:none"></textarea>
            </div>
            <div class="form-group" style="margin-bottom:1.25rem">
                <label>Type</label>
                <select id="ann-type" style="width:100%;padding:0.65rem;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;outline:none">
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                </select>
            </div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary"><span class="material-icons-round">send</span> Publish</button>
            </div>
        </form>
    `);
}

function addAnnouncement(e) {
    e.preventDefault();
    MOCK_DATA.announcements.unshift({
        id: generateId('AN'),
        title: document.getElementById('ann-title').value,
        message: document.getElementById('ann-message').value,
        date: new Date().toISOString().split('T')[0],
        type: document.getElementById('ann-type').value,
    });
    closeModal();
    showToast('Announcement published!', 'success');
    navigate('announcements');
}

// ============================================
// SHARED PAGES
// ============================================
function renderNotifications() {
    const user = MOCK_DATA.currentUser;
    const notifs = MOCK_DATA.notifications.filter(n => n.userId === user.id);

    return `
        <div class="section-header">
            <h2>Notifications</h2>
            <button class="btn btn-sm btn-secondary" onclick="markAllRead()">
                <span class="material-icons-round">done_all</span> Mark All Read
            </button>
        </div>

        <div class="notif-list">
            ${notifs.length > 0 ? notifs.map(n => `
                <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotifRead('${n.id}')">
                    <div class="notif-icon stat-icon ${n.iconColor}">
                        <span class="material-icons-round">${n.icon}</span>
                    </div>
                    <div class="notif-content">
                        <h4>${n.title}</h4>
                        <p>${n.message}</p>
                    </div>
                    <div class="notif-time">${n.time}</div>
                </div>
            `).join('') : '<div class="empty-state"><span class="material-icons-round">notifications_off</span><h3>No notifications</h3><p>You\'re all caught up!</p></div>'}
        </div>
    `;
}

function markNotifRead(notifId) {
    const n = MOCK_DATA.notifications.find(n => n.id === notifId);
    if (n) {
        n.read = true;
        updateNotifCount();
        navigate('notifications');
    }
}

function markAllRead() {
    const user = MOCK_DATA.currentUser;
    MOCK_DATA.notifications.filter(n => n.userId === user.id).forEach(n => n.read = true);
    updateNotifCount();
    showToast('All notifications marked as read', 'success');
    navigate('notifications');
}

function updateNotifCount() {
    const user = MOCK_DATA.currentUser;
    const unread = MOCK_DATA.notifications.filter(n => n.userId === user.id && !n.read).length;
    const badge = document.getElementById('notif-count');
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
}

function renderProfile() {
    const user = MOCK_DATA.currentUser;
    const isStudent = currentRole === 'student';
    const isLecturer = currentRole === 'lecturer';

    return `
        <div class="profile-header">
            <div class="avatar">${user.avatar}</div>
            <div class="profile-header-info">
                <h2>${user.name}</h2>
                <p>${isStudent ? `${user.programme} • Year ${user.year}` : isLecturer ? `${user.department} • ${user.specialization}` : 'Faculty Administrator'}</p>
                <p style="font-size:0.82rem;opacity:0.75">${user.email}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Personal Information</h3>
                <button class="btn btn-sm btn-primary" onclick="showToast('Profile updated successfully!', 'success')">
                    <span class="material-icons-round">save</span> Save Changes
                </button>
            </div>

            <div class="profile-form">
                <div class="form-group">
                    <label>Full Name</label>
                    <div class="input-icon">
                        <span class="material-icons-round">badge</span>
                        <input type="text" value="${user.name}">
                    </div>
                </div>
                <div class="form-group">
                    <label>${isStudent ? 'Matric No' : 'Staff ID'}</label>
                    <div class="input-icon">
                        <span class="material-icons-round">fingerprint</span>
                        <input type="text" value="${user.matric || user.staffId || ''}" readonly style="background:var(--bg)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <div class="input-icon">
                        <span class="material-icons-round">email</span>
                        <input type="email" value="${user.email}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <div class="input-icon">
                        <span class="material-icons-round">phone</span>
                        <input type="tel" value="${user.phone}">
                    </div>
                </div>
                <div class="form-group">
                    <label>${isStudent ? 'Programme' : isLecturer ? 'Department' : 'Role'}</label>
                    <div class="input-icon">
                        <span class="material-icons-round">apartment</span>
                        <input type="text" value="${user.programme || user.department || 'Administrator'}">
                    </div>
                </div>
                ${isLecturer ? `
                <div class="form-group">
                    <label>Office Location</label>
                    <div class="input-icon">
                        <span class="material-icons-round">location_on</span>
                        <input type="text" value="${user.office}">
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        <div class="card" style="margin-top:1.25rem">
            <div class="card-header">
                <h3>Change Password</h3>
            </div>
            <div class="profile-form">
                <div class="form-group">
                    <label>Current Password</label>
                    <div class="input-icon">
                        <span class="material-icons-round">lock</span>
                        <input type="password" placeholder="••••••••">
                    </div>
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <div class="input-icon">
                        <span class="material-icons-round">lock</span>
                        <input type="password" placeholder="••••••••">
                    </div>
                </div>
                <div class="form-group full-width" style="align-items:flex-end">
                    <button class="btn btn-primary" onclick="showToast('Password changed successfully!', 'success')">
                        <span class="material-icons-round">vpn_key</span> Update Password
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// UTILITIES
// ============================================
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('.material-icons-round');
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
    }
}

// Modal
function openModal(title, bodyHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('modal-overlay').classList.add('hidden');
    document.body.style.overflow = '';
}

// Toast
function showToast(message, type = 'info') {
    const icons = { success: 'check_circle', danger: 'error', info: 'info', warning: 'warning' };
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="material-icons-round">${icons[type] || 'info'}</span>
        <span>${message}</span>
        <span class="material-icons-round toast-close" onclick="this.parentElement.remove()">close</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s var(--ease) forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Window global bindings for Next.js and inline handlers
if (typeof window !== 'undefined') {
    window.setupAuth = setupAuth;
    window.setupSidebarToggle = setupSidebarToggle;
    window.loginAs = loginAs;
    window.logout = logout;
    window.navigate = navigate;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.showToast = showToast;
    window.togglePassword = togglePassword;
    if (typeof selectTimeSlot !== 'undefined') window.selectTimeSlot = selectTimeSlot;
    if (typeof confirmBooking !== 'undefined') window.confirmBooking = confirmBooking;
    if (typeof cancelBooking !== 'undefined') window.cancelBooking = cancelBooking;
    if (typeof rescheduleBooking !== 'undefined') window.rescheduleBooking = rescheduleBooking;
    if (typeof approveBooking !== 'undefined') window.approveBooking = approveBooking;
    if (typeof rejectBooking !== 'undefined') window.rejectBooking = rejectBooking;
    if (typeof markAttendance !== 'undefined') window.markAttendance = markAttendance;
    if (typeof addAvailabilitySlot !== 'undefined') window.addAvailabilitySlot = addAvailabilitySlot;
    if (typeof removeAvailabilitySlot !== 'undefined') window.removeAvailabilitySlot = removeAvailabilitySlot;
    if (typeof filterLecturers !== 'undefined') window.filterLecturers = filterLecturers;
    if (typeof setBookingFilter !== 'undefined') window.setBookingFilter = setBookingFilter;
    if (typeof postAnnouncement !== 'undefined') window.postAnnouncement = postAnnouncement;
    if (typeof deleteAnnouncement !== 'undefined') window.deleteAnnouncement = deleteAnnouncement;
    if (typeof saveProfile !== 'undefined') window.saveProfile = saveProfile;
    if (typeof changePassword !== 'undefined') window.changePassword = changePassword;
}
