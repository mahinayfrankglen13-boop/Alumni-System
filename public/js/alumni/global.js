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
document.addEventListener('click', function (e) {
  const chip = document.getElementById('user-chip-btn');
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown && chip && !chip.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

// Wire sidebar and user dropdown via addEventListener — no onclick= in HTML
document.addEventListener('DOMContentLoaded', function () {

  // Sidebar toggle buttons (navbar + sidebar collapse)
  var sidebarToggle = document.getElementById('sidebar-toggle-btn');
  var sidebarCollapse = document.getElementById('sidebar-collapse-btn');
  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (sidebarCollapse) sidebarCollapse.addEventListener('click', toggleSidebar);

  // User dropdown chip
  var userChip = document.getElementById('user-chip-btn');
  if (userChip) userChip.addEventListener('click', function (e) {
    e.stopPropagation();
    var dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('active');
  });

  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();
});
