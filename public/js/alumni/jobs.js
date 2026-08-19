/* ==========================================================================
   MSU-MCEST ALUMNI PORTAL - JOBS PAGE UI INTERACTIONS
   ========================================================================== */

/* =====================================================
   POST JOB MODAL
   ===================================================== */

function openPostJobModal() {
  const modal = document.getElementById('post-job-modal');

  if (modal) {
    modal.classList.add('active');
  }
}

function closePostJobModal() {
  const modal = document.getElementById('post-job-modal');

  if (modal) {
    modal.classList.remove('active');
  }
}

/* =====================================================
   EDIT JOB MODAL
   ===================================================== */

function openEditJobModal(button) {
  const modal = document.getElementById('edit-job-modal');
  const form = document.getElementById('edit-job-form');

  if (!modal || !form || !button) {
    return;
  }

  // Get the job values from the button
  const jobId = button.dataset.id;
  const title = button.dataset.title;
  const company = button.dataset.company;
  const description = button.dataset.description;
  const location = button.dataset.location;
  const applicationUrl = button.dataset.applicationUrl;

  // Put the values into the form
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-company').value = company;
  document.getElementById('edit-description').value = description;
  document.getElementById('edit-location').value = location;
  document.getElementById('edit-application-url').value = applicationUrl;

  // Change form action to the selected job
  form.action = `/alumni/jobs/${jobId}?_method=PUT`;
  // Open modal
  modal.classList.add('active');
}

function closeEditJobModal() {
  const modal = document.getElementById('edit-job-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/* =====================================================
   CLOSE MODAL WHEN CLICKING BACKDROP
   ===================================================== */

document.addEventListener('click', function (event) {
  const postModal = document.getElementById('post-job-modal');
  const editModal = document.getElementById('edit-job-modal');

  if (event.target === postModal) {
    closePostJobModal();
  }

  if (event.target === editModal) {
    closeEditJobModal();
  }
});

/* =====================================================
   LUCIDE ICONS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});
