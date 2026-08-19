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

  const id = button.dataset.id;
  const code = button.dataset.code;
  const name = button.dataset.name;

  document.getElementById('edit-course-code').value = code;
  document.getElementById('edit-course-name').value = name;

  form.action = `/alumni/courses/${id}?_method=PUT`;
  modal.classList.add('active');
}

function closeEditCourseModal() {
  const modal = document.getElementById('edit-course-modal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', (event) => {
  const addModal = document.getElementById('add-course-modal');
  const editModal = document.getElementById('edit-course-modal');

  if (event.target === addModal) closeAddCourseModal();
  if (event.target === editModal) closeEditCourseModal();
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});
