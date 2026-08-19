/* ==========================================================================
   MSU-MCEST ALUMNI PORTAL - ANNOUNCEMENTS PAGE UI INTERACTIONS
   ========================================================================== */

function openPostAnnouncementModal() {
  const modal = document.getElementById('post-announcement-modal');
  if (modal) modal.classList.add('active');
}

function closePostAnnouncementModal() {
  const modal = document.getElementById('post-announcement-modal');
  if (modal) modal.classList.remove('active');
}

function openEditAnnouncementModal(button) {
  const modal = document.getElementById('edit-announcement-modal');
  const form = document.getElementById('edit-announcement-form');
  if (!modal || !form || !button) return;

  const id = button.dataset.id;
  const title = button.dataset.title;
  const content = button.dataset.content;

  document.getElementById('edit-ann-title').value = title;
  document.getElementById('edit-ann-content').value = content;

  form.action = `/alumni/announcement/${id}?_method=PUT`;
  modal.classList.add('active');
}

function closeEditAnnouncementModal() {
  const modal = document.getElementById('edit-announcement-modal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', function (event) {
  const postModal = document.getElementById('post-announcement-modal');
  const editModal = document.getElementById('edit-announcement-modal');

  // Close on backdrop click
  if (event.target === postModal) closePostAnnouncementModal();
  if (event.target === editModal) closeEditAnnouncementModal();
});

document.addEventListener('DOMContentLoaded', function () {

  // Open post modal
  const postBtn = document.getElementById('post-announcement-btn');
  if (postBtn) postBtn.addEventListener('click', openPostAnnouncementModal);

  // Close post modal buttons
  const closePostBtn = document.getElementById('close-post-ann-btn');
  const cancelPostBtn = document.getElementById('cancel-post-ann-btn');
  if (closePostBtn) closePostBtn.addEventListener('click', closePostAnnouncementModal);
  if (cancelPostBtn) cancelPostBtn.addEventListener('click', closePostAnnouncementModal);

  // Open edit modal — delegated click on .open-edit-ann-btn
  document.querySelectorAll('.open-edit-ann-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { openEditAnnouncementModal(btn); });
  });

  // Close edit modal buttons
  const closeEditBtn = document.getElementById('close-edit-ann-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-ann-btn');
  if (closeEditBtn) closeEditBtn.addEventListener('click', closeEditAnnouncementModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditAnnouncementModal);

  // Delete confirmation — replace onsubmit with event listener
  document.querySelectorAll('form.delete-confirm-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const msg = form.dataset.confirm || 'Are you sure?';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  if (window.lucide) lucide.createIcons();
});
