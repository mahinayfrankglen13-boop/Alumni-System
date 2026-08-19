/* ==========================================================================
   MSU-MCEST ALUMNI PORTAL - JOBS PAGE UI INTERACTIONS
   ========================================================================== */

function openPostJobModal() {
  const modal = document.getElementById('post-job-modal');
  if (modal) modal.classList.add('active');
}

function closePostJobModal() {
  const modal = document.getElementById('post-job-modal');
  if (modal) modal.classList.remove('active');
}

function openEditJobModal(button) {
  const modal = document.getElementById('edit-job-modal');
  const form = document.getElementById('edit-job-form');
  if (!modal || !form || !button) return;

  document.getElementById('edit-title').value = button.dataset.title || '';
  document.getElementById('edit-company').value = button.dataset.company || '';
  document.getElementById('edit-description').value = button.dataset.description || '';
  document.getElementById('edit-location').value = button.dataset.location || '';
  document.getElementById('edit-application-url').value = button.dataset.applicationUrl || '';

  form.action = `/alumni/jobs/${button.dataset.id}?_method=PUT`;
  modal.classList.add('active');
}

function closeEditJobModal() {
  const modal = document.getElementById('edit-job-modal');
  if (modal) modal.classList.remove('active');
}

// Close modal on backdrop click
document.addEventListener('click', function (event) {
  const postModal = document.getElementById('post-job-modal');
  const editModal = document.getElementById('edit-job-modal');
  if (event.target === postModal) closePostJobModal();
  if (event.target === editModal) closeEditJobModal();
});

document.addEventListener('DOMContentLoaded', function () {

  // Post job
  const postBtn = document.getElementById('post-job-btn');
  if (postBtn) postBtn.addEventListener('click', openPostJobModal);

  // Close post job
  const closePost = document.getElementById('close-post-job-btn');
  const cancelPost = document.getElementById('cancel-post-job-btn');
  if (closePost) closePost.addEventListener('click', closePostJobModal);
  if (cancelPost) cancelPost.addEventListener('click', closePostJobModal);

  // Open edit job — delegated on .open-edit-job-btn
  document.querySelectorAll('.open-edit-job-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { openEditJobModal(btn); });
  });

  // Close edit job
  const closeEdit = document.getElementById('close-edit-job-btn');
  const cancelEdit = document.getElementById('cancel-edit-job-btn');
  if (closeEdit) closeEdit.addEventListener('click', closeEditJobModal);
  if (cancelEdit) cancelEdit.addEventListener('click', closeEditJobModal);

  // Delete confirmation
  document.querySelectorAll('form.delete-confirm-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const msg = form.dataset.confirm || 'Are you sure?';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  if (window.lucide) lucide.createIcons();
});
