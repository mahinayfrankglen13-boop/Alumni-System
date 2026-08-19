function openViewProfileModal(name, course, year, bio, imageUrl) {
    const avatarEl = document.getElementById('modal-alumni-avatar');
    const imgSrc = imageUrl || 'https://res.cloudinary.com/fad0iwxm/image/upload/v1786894165/defaul-prof_ryln3w.jpg';
    avatarEl.innerHTML = `<img src="${imgSrc}" alt="${name || 'Alumni'}" style="width:100%;height:100%;object-fit:cover;">`;
    document.getElementById('modal-alumni-name').textContent = name || 'Alumni';
    document.getElementById('modal-alumni-degree').textContent = `${course || 'N/A'} • Batch ${year || 'N/A'}`;
    document.getElementById('modal-alumni-name-detail').textContent = name || 'N/A';
    document.getElementById('modal-alumni-course').textContent = course || 'N/A';
    document.getElementById('modal-alumni-year').textContent = year || 'N/A';
    document.getElementById('modal-alumni-bio').textContent = bio || 'No bio provided.';

    document.getElementById('view-profile-modal').classList.add('active');
}

function closeViewProfileModal() {
    document.getElementById('view-profile-modal').classList.remove('active');
}

document.addEventListener('click', function (event) {
    const modal = document.getElementById('view-profile-modal');

    if (event.target === modal) {
        closeViewProfileModal();
    }

    const btn = event.target.closest('.view-profile-btn');
    if (btn) {
        const name = btn.dataset.name;
        const course = btn.dataset.course;
        const year = btn.dataset.year;
        const bio = btn.dataset.bio;
        const image = btn.dataset.image;
        openViewProfileModal(name, course, year, bio, image);
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const closeBtn = document.getElementById('close-view-profile-btn');
    const cancelBtn = document.getElementById('cancel-view-profile-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeViewProfileModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeViewProfileModal);

    // Delete confirmation for alumni delete forms
    document.querySelectorAll('form.delete-confirm-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            const msg = form.dataset.confirm || 'Are you sure?';
            if (!confirm(msg)) e.preventDefault();
        });
    });
});