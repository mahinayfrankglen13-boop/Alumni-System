/* ==========================================================================
   MSU-MCEST ALUMNI PORTAL - COURSE MANAGEMENT UI
   ========================================================================== */

function openAddCourseModal() {
  const modal = document.getElementById('add-course-modal');
  if (modal) modal.classList.add('active');
}

function closeAddCourseModal() {
  const modal = document.getElementById('add-course-modal');
  if (modal) modal.classList.remove('active');
}

function openEditCourseModal(button) {
  const modal = document.getElementById('edit-course-modal');
  const form = document.getElementById('edit-course-form');
  if (!modal || !form || !button) return;

  document.getElementById('edit-course-code').value = button.dataset.code || '';
  document.getElementById('edit-course-name').value = button.dataset.name || '';

  form.action = `/alumni/courses/${button.dataset.id}?_method=PUT`;
  modal.classList.add('active');
}

function closeEditCourseModal() {
  const modal = document.getElementById('edit-course-modal');
  if (modal) modal.classList.remove('active');
}

// Close on backdrop click
document.addEventListener('click', function (event) {
  const addModal = document.getElementById('add-course-modal');
  const editModal = document.getElementById('edit-course-modal');
  if (event.target === addModal) closeAddCourseModal();
  if (event.target === editModal) closeEditCourseModal();
});

document.addEventListener('DOMContentLoaded', function () {

  // Add course
  const addBtn = document.getElementById('add-course-btn');
  if (addBtn) addBtn.addEventListener('click', openAddCourseModal);

  // Close add course
  const closeAdd = document.getElementById('close-add-course-btn');
  const cancelAdd = document.getElementById('cancel-add-course-btn');
  if (closeAdd) closeAdd.addEventListener('click', closeAddCourseModal);
  if (cancelAdd) cancelAdd.addEventListener('click', closeAddCourseModal);

  // Open edit — delegated on .open-edit-course-btn
  document.querySelectorAll('.open-edit-course-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { openEditCourseModal(btn); });
  });

  // Close edit course
  const closeEdit = document.getElementById('close-edit-course-btn');
  const cancelEdit = document.getElementById('cancel-edit-course-btn');
  if (closeEdit) closeEdit.addEventListener('click', closeEditCourseModal);
  if (cancelEdit) cancelEdit.addEventListener('click', closeEditCourseModal);

  // Delete confirmation
  document.querySelectorAll('form.delete-confirm-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const msg = form.dataset.confirm || 'Are you sure?';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  if (window.lucide) lucide.createIcons();
});
