/* ==========================================================================
   MSU-MCEST ALUMNI PORTAL - PROFILE PAGE UI INTERACTIONS
   ========================================================================== */

function openEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (!modal) return;
  modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function closeEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.classList.remove('active');
}

function triggerPhotoUpload() {
  openEditProfileModal();
  const input = document.getElementById('modal-file-input');
  if (input) input.click();
}

function handlePhotoSelect(event) {
  handleModalPhotoSelect(event);
}

function handleModalPhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.getElementById('profile-img-preview');
    const placeholder = document.getElementById('profile-img-placeholder');
    const modalImg = document.getElementById('modal-photo-preview');
    const modalPlaceholder = document.getElementById('modal-photo-placeholder');

    if (img) {
      img.src = e.target.result;
      img.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    if (modalImg) {
      modalImg.src = e.target.result;
      modalImg.style.display = 'block';
    }
    if (modalPlaceholder) modalPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function toggleProfilePrivacy(isPublic) {
  const value = isPublic ? 'public' : 'private';
  fetch('/alumni/profile/privacy', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileVisibility: value })
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to update privacy');
      updatePrivacyUI(isPublic);
    })
    .catch(function (error) {
      console.error(error);
      const toggle = document.getElementById('privacy-main-toggle');
      if (toggle) toggle.checked = !isPublic;
      alert('Unable to update profile privacy.');
    });
}

function updatePrivacyUI(isPublic) {
  const icon = document.getElementById('privacy-header-icon');
  const label = document.getElementById('privacy-header-label');
  const badge = document.getElementById('privacy-badge');

  if (isPublic) {
    if (icon) { icon.setAttribute('data-lucide', 'globe'); icon.style.color = '#FFFFFF'; }
    if (label) label.innerText = 'Public';
    if (badge) {
      badge.className = 'privacy-status-badge public';
      badge.innerHTML = '<i data-lucide="globe" style="width:14px;height:14px;"></i> Public Profile';
    }
  } else {
    if (icon) { icon.setAttribute('data-lucide', 'lock'); icon.style.color = 'rgba(255,255,255,0.7)'; }
    if (label) label.innerText = 'Private';
    if (badge) {
      badge.className = 'privacy-status-badge private';
      badge.innerHTML = '<i data-lucide="lock" style="width:14px;height:14px;"></i> Private Profile';
    }
  }

  if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', function () {

  // Profile avatar click → trigger photo upload
  var avatarUpload = document.getElementById('profile-avatar-upload');
  if (avatarUpload) avatarUpload.addEventListener('click', triggerPhotoUpload);

  // Profile photo file input
  var profilePhotoInput = document.getElementById('profile-photo-input');
  if (profilePhotoInput) profilePhotoInput.addEventListener('change', handlePhotoSelect);

  // Modal file input
  var modalFileInput = document.getElementById('modal-file-input');
  if (modalFileInput) modalFileInput.addEventListener('change', handleModalPhotoSelect);

  // Privacy toggle
  var privacyToggle = document.getElementById('privacy-main-toggle');
  if (privacyToggle) privacyToggle.addEventListener('change', function () {
    toggleProfilePrivacy(this.checked);
  });

  // Edit profile button
  var editBtn = document.getElementById('edit-profile-btn');
  if (editBtn) editBtn.addEventListener('click', openEditProfileModal);

  // Close/cancel edit profile
  var closeBtn = document.getElementById('close-edit-profile-btn');
  var cancelBtn = document.getElementById('cancel-edit-profile-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeEditProfileModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeEditProfileModal);

  // Close on backdrop click
  document.addEventListener('click', function (event) {
    var modal = document.getElementById('edit-profile-modal');
    if (event.target === modal) closeEditProfileModal();
  });

  if (window.lucide) lucide.createIcons();
});