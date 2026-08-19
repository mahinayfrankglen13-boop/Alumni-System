function openEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (!modal) return;

  modal.classList.add('active');

  if (window.lucide) {
    lucide.createIcons();
  }
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      profileVisibility: value
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update privacy');
      }
      updatePrivacyUI(isPublic);
    })
    .catch(error => {
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
    if (icon) {
      icon.setAttribute('data-lucide', 'globe');
      icon.style.color = '#FFFFFF';
    }

    if (label) label.innerText = 'Public';

    if (badge) {
      badge.className = 'privacy-status-badge public';
      badge.innerHTML = '<i data-lucide="globe" style="width:14px;height:14px;"></i> Public Profile';
    }
  } else {
    if (icon) {
      icon.setAttribute('data-lucide', 'lock');
      icon.style.color = 'rgba(255,255,255,0.7)';
    }

    if (label) label.innerText = 'Private';

    if (badge) {
      badge.className = 'privacy-status-badge private';
      badge.innerHTML = '<i data-lucide="lock" style="width:14px;height:14px;"></i> Private Profile';
    }
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});