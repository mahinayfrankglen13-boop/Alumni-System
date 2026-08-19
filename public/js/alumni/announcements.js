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

document.addEventListener('click', (event) => {
  const postModal = document.getElementById('post-announcement-modal');
  const editModal = document.getElementById('edit-announcement-modal');

  if (event.target === postModal) closePostAnnouncementModal();
  if (event.target === editModal) closeEditAnnouncementModal();
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});
