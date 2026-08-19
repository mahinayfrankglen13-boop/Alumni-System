/* ==========================================================================
   MSU-MCEST ALUMNI PORTAL - GLOBAL UI INTERACTION HANDLERS
   ========================================================================== */

// Sidebar Collapse Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('left-sidebar');
  if (sidebar) sidebar.classList.toggle('collapsed');
}

// User Profile Dropdown Toggle
function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) dropdown.classList.toggle('active');
}

// Close User Dropdown on Click Outside
document.addEventListener('click', () => {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) dropdown.classList.remove('active');
});

function handleLogout(e) {
  if (e) e.preventDefault();
  if (confirm('Are you sure you want to log out of the MSU-MCEST Alumni Portal?')) {
    alert('You have been logged out successfully.');
  }
}

// Initialize Vector Icons on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});
