/**
 * VIJAYA CLINIC - Standalone Form Handler & Client-Side Data Engine
 * 100% Frontend / No Backend API required. Uses localStorage for persistence.
 */

// Initial Seed Datasets
const DEFAULT_REVIEWS = [
  {
    id: "rev-101",
    patientName: "Ananya Sundaram",
    verified: true,
    rating: 5,
    treatment: "Comprehensive Cardiac & Lipid Evaluation",
    comment: "Dr. Vijaya Lakshmi's diagnostic thoroughness is exceptional. She took 45 minutes to explain every parameter in my 2D Echo and blood work, creating an actionable lifestyle & medication protocol. The clinic atmosphere feels calm, warm, and distinctly non-commercial.",
    date: "2026-08-14",
    doctorName: "Dr. Vijaya Lakshmi, MD",
    location: "Indiranagar, Bangalore"
  },
  {
    id: "rev-102",
    patientName: "Raghavan Nambiar",
    verified: true,
    rating: 5,
    treatment: "Hypertension & Diabetes Management",
    comment: "I have been consulting Dr. Rajesh and Dr. Vijaya for over 6 years. Their integrated approach helped me reduce my HbA1c from 9.2 to 6.3 safely. Their in-house digital lab provides same-day turnaround, and the nursing staff is compassionate and courteous.",
    date: "2026-08-02",
    doctorName: "Dr. V. Rajesh, MS",
    location: "Koramangala"
  },
  {
    id: "rev-103",
    patientName: "Meera Venkatesh",
    verified: true,
    rating: 5,
    treatment: "Preventive Women's Health & Thyroid",
    comment: "A breath of fresh air compared to chaotic multi-speciality corporate hospitals. You get personal attention, zero unnecessary lab tests, and genuine empathy. Booking online was effortless, and the digital consultation pass made the check-in instantaneous.",
    date: "2026-07-28",
    doctorName: "Dr. Vijaya Lakshmi, MD",
    location: "Jayanagar"
  },
  {
    id: "rev-104",
    patientName: "Vikramaditya Roy",
    verified: true,
    rating: 5,
    treatment: "Post-Viral Recovery & Pulmonary Check",
    comment: "Superlative medical standard. The sterile environment, high-end diagnostic equipment, and precise clinical guidance saved my father from severe respiratory complications. Highly recommend Vijaya Clinic to any family seeking gold-standard medical care.",
    date: "2026-07-15",
    doctorName: "Dr. Vijaya Lakshmi, MD",
    location: "HSR Layout"
  },
  {
    id: "rev-105",
    patientName: "Dr. S. K. Narayanan (Retd. Prof)",
    verified: true,
    rating: 5,
    treatment: "Geriatric Health & Joint Care",
    comment: "As a retired academician, I appreciate doctors who practice evidence-based medicine without commercial bias. Vijaya Clinic upholds the highest ethical standards of patient-centric clinical practice.",
    date: "2026-06-30",
    doctorName: "Dr. V. Rajesh, MS",
    location: "Malleswaram"
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: "APT-2026-9041",
    name: "Pooja Hegde",
    phone: "+91 98451 90876",
    email: "pooja.hegde@example.com",
    service: "Preventive Cardiology & 2D Echo",
    doctor: "Dr. Vijaya Lakshmi, MD (Internal Medicine & Cardiology)",
    preferredDate: "2026-09-22",
    preferredTime: "10:30 AM",
    message: "Routine annual cardiac and lipid profile review with family history of hypertension.",
    status: "Confirmed",
    submittedAt: "2026-09-17T09:15:22.000Z"
  },
  {
    id: "APT-2026-8732",
    name: "Karthik Subramanian",
    phone: "+91 99002 44512",
    email: "karthik.subramanian@example.com",
    service: "Diabetes & Endocrine Protocol",
    doctor: "Dr. Vijaya Lakshmi, MD",
    preferredDate: "2026-09-23",
    preferredTime: "05:00 PM",
    message: "Quarterly HbA1c review and medication titration consultation.",
    status: "Confirmed",
    submittedAt: "2026-09-16T14:40:10.000Z"
  },
  {
    id: "APT-2026-7619",
    name: "Nalini Sundaresan",
    phone: "+91 97410 88231",
    email: "nalini.sundaresan@example.com",
    service: "In-House Ultrasound & Pathology",
    doctor: "Dr. V. Rajesh, MS",
    preferredDate: "2026-09-24",
    preferredTime: "09:00 AM",
    message: "Fasting abdominal ultrasound and thyroid panel.",
    status: "Confirmed",
    submittedAt: "2026-09-15T11:20:00.000Z"
  }
];

// Storage Helpers
function getStoredData(key, defaultData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultData;
  }
}

function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Appointment Booking Engine (Pure Client-Side)
  // =========================================================================
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentDateInput = document.getElementById('preferredDate');
  const timeSlotButtons = document.querySelectorAll('.time-slot-btn');
  const selectedTimeInput = document.getElementById('preferredTime');
  const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');

  // Set minimum booking date to today
  if (appointmentDateInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    appointmentDateInput.min = todayStr;
    if (!appointmentDateInput.value) {
      appointmentDateInput.value = todayStr;
    }
  }

  // Handle slot selection buttons
  timeSlotButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      timeSlotButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const timeVal = btn.getAttribute('data-time');
      if (selectedTimeInput) {
        selectedTimeInput.value = timeVal;
      }
    });
  });

  // Handle form submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!appointmentForm.checkValidity()) {
        e.stopPropagation();
        appointmentForm.classList.add('was-validated');
        showToast('Please fill out all required fields marked in red.', 'warning');
        return;
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const appointmentId = `APT-${new Date().getFullYear()}-${randomSuffix}`;

      const newAppointment = {
        id: appointmentId,
        name: document.getElementById('patientName')?.value.trim(),
        phone: document.getElementById('patientPhone')?.value.trim(),
        email: document.getElementById('patientEmail')?.value.trim() || '',
        service: document.getElementById('patientService')?.value,
        doctor: document.getElementById('patientDoctor')?.value || 'Dr. Vijaya Lakshmi, MD',
        preferredDate: document.getElementById('preferredDate')?.value,
        preferredTime: document.getElementById('preferredTime')?.value || '10:00 AM',
        message: document.getElementById('patientNotes')?.value.trim() || 'No additional notes provided.',
        status: 'Confirmed',
        submittedAt: new Date().toISOString()
      };

      // Button loading effect simulation
      const originalBtnHtml = bookingSubmitBtn.innerHTML;
      bookingSubmitBtn.disabled = true;
      bookingSubmitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Generating Digital Pass...
      `;

      setTimeout(() => {
        // Save to LocalStorage
        const currentAppointments = getStoredData('vijaya_appointments', DEFAULT_APPOINTMENTS);
        currentAppointments.unshift(newAppointment);
        saveStoredData('vijaya_appointments', currentAppointments);

        // Reset form
        appointmentForm.reset();
        appointmentForm.classList.remove('was-validated');
        bookingSubmitBtn.disabled = false;
        bookingSubmitBtn.innerHTML = originalBtnHtml;

        // Display digital appointment pass modal
        showAppointmentConfirmationModal(newAppointment);
        showToast('Appointment successfully scheduled! Your pass is ready.', 'success');
      }, 500);
    });
  }

  // =========================================================================
  // 2. Appointment Confirmation Modal Renderer
  // =========================================================================
  function showAppointmentConfirmationModal(data) {
    const modalEl = document.getElementById('appointmentSuccessModal');
    if (!modalEl) return;

    document.getElementById('ticketRefCode').textContent = data.id;
    document.getElementById('ticketPatientName').textContent = data.name;
    document.getElementById('ticketPhone').textContent = data.phone;
    document.getElementById('ticketService').textContent = data.service;
    document.getElementById('ticketDoctor').textContent = data.doctor;
    document.getElementById('ticketDateTime').textContent = `${data.preferredDate} at ${data.preferredTime}`;
    document.getElementById('ticketSubmittedAt').textContent = new Date(data.submittedAt).toLocaleString();

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  // =========================================================================
  // 3. Contact & General Inquiry Form Handler
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const contactEntry = {
        id: `MSG-${new Date().getFullYear()}-${randomSuffix}`,
        name: document.getElementById('contactName')?.value.trim(),
        email: document.getElementById('contactEmail')?.value.trim(),
        message: document.getElementById('contactMessage')?.value.trim(),
        submittedAt: new Date().toISOString()
      };

      const origBtn = contactSubmitBtn ? contactSubmitBtn.innerHTML : '';
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Sending...';
      }

      setTimeout(() => {
        const contacts = getStoredData('vijaya_contacts', []);
        contacts.unshift(contactEntry);
        saveStoredData('vijaya_contacts', contacts);

        contactForm.reset();
        contactForm.classList.remove('was-validated');

        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.innerHTML = origBtn;
        }

        showToast('Thank you! Your message has been received. Our clinic desk will get in touch shortly.', 'success');
      }, 400);
    });
  }

  // =========================================================================
  // 4. Testimonials / Reviews Dynamic Loading & Submissions
  // =========================================================================
  loadReviews();

  function loadReviews() {
    const reviewsTrack = document.getElementById('reviewsCarouselTrack');
    const reviewsIndicators = document.getElementById('reviewsCarouselIndicators');
    if (!reviewsTrack) return;

    const reviews = getStoredData('vijaya_reviews', DEFAULT_REVIEWS);

    if (Array.isArray(reviews) && reviews.length > 0) {
      reviewsTrack.innerHTML = '';
      if (reviewsIndicators) reviewsIndicators.innerHTML = '';

      reviews.forEach((rev, index) => {
        const isActive = index === 0 ? 'active' : '';

        // Indicator button
        if (reviewsIndicators) {
          const indBtn = document.createElement('button');
          indBtn.type = 'button';
          indBtn.setAttribute('data-bs-target', '#reviewsCarousel');
          indBtn.setAttribute('data-bs-slide-to', index.toString());
          if (index === 0) indBtn.classList.add('active');
          indBtn.setAttribute('aria-label', `Slide ${index + 1}`);
          reviewsIndicators.appendChild(indBtn);
        }

        // Stars string
        const rating = Math.min(5, Math.max(1, rev.rating || 5));
        const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        // Item slide
        const item = document.createElement('div');
        item.className = `carousel-item ${isActive}`;
        item.innerHTML = `
          <div class="testimonial-card">
            <div class="testimonial-quote-icon">“</div>
            <div class="star-rating">${starsHtml}</div>
            <p class="lead-text mb-4 text-dark fst-italic">"${escapeHtml(rev.comment)}"</p>
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-3 border-top border-light-subtle">
              <div>
                <h6 class="mb-0 fw-bold">${escapeHtml(rev.patientName)}</h6>
                <small class="text-muted">${escapeHtml(rev.treatment || 'Patient Review')} • ${escapeHtml(rev.location || 'Bangalore')}</small>
              </div>
              <div class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                ✓ Verified Patient
              </div>
            </div>
          </div>
        `;
        reviewsTrack.appendChild(item);
      });
    }
  }

  // Handle Review Submission
  const submitReviewForm = document.getElementById('submitReviewForm');
  if (submitReviewForm) {
    submitReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewPatientName')?.value.trim();
      const comment = document.getElementById('reviewComment')?.value.trim();
      const rating = document.querySelector('input[name="reviewRating"]:checked')?.value || 5;
      const treatment = document.getElementById('reviewTreatment')?.value.trim() || 'General Consultation';

      if (!name || !comment) {
        showToast('Please fill out your name and review experience.', 'warning');
        return;
      }

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const newReview = {
        id: `rev-${randomSuffix}`,
        patientName: name,
        verified: true,
        rating: parseInt(rating, 10),
        treatment: treatment,
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        doctorName: 'Dr. Vijaya Lakshmi, MD',
        location: 'Bangalore'
      };

      const reviews = getStoredData('vijaya_reviews', DEFAULT_REVIEWS);
      reviews.unshift(newReview);
      saveStoredData('vijaya_reviews', reviews);

      submitReviewForm.reset();
      const modalEl = document.getElementById('submitReviewModal');
      if (modalEl) {
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }

      showToast('Thank you! Your review has been published.', 'success');
      loadReviews(); // Reload carousel immediately
    });
  }

  // =========================================================================
  // 5. Admin Quick-View Modal (Live Bookings Inspection for Pitch/Demo)
  // =========================================================================
  window.openAdminBookingsDrawer = function () {
    const modalEl = document.getElementById('adminBookingsModal');
    const tableBody = document.getElementById('adminBookingsTableBody');
    const countBadge = document.getElementById('adminBookingsCount');

    if (!modalEl || !tableBody) return;

    const appointments = getStoredData('vijaya_appointments', DEFAULT_APPOINTMENTS);

    if (countBadge) countBadge.textContent = `${appointments.length} Total Bookings`;

    if (appointments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No appointments booked yet.</td></tr>`;
    } else {
      tableBody.innerHTML = appointments
        .map(
          (apt) => `
        <tr>
          <td class="font-monospace fw-bold text-success">${escapeHtml(apt.id)}</td>
          <td>
            <div class="fw-bold">${escapeHtml(apt.name)}</div>
            <small class="text-muted">${escapeHtml(apt.phone)}</small>
          </td>
          <td><span class="badge bg-light text-dark border">${escapeHtml(apt.service)}</span></td>
          <td>${escapeHtml(apt.doctor || 'Dr. Vijaya Lakshmi, MD')}</td>
          <td>
            <div>${escapeHtml(apt.preferredDate)}</div>
            <small class="text-muted">${escapeHtml(apt.preferredTime)}</small>
          </td>
          <td><span class="badge bg-success-subtle text-success border border-success-subtle">Confirmed</span></td>
        </tr>
      `
        )
        .join('');
    }

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  };

  // Helper function to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Toast Notification Helper
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      alert(message);
      return;
    }

    const toastId = 'toast-' + Date.now();
    const bgClass =
      type === 'success'
        ? 'bg-success text-white'
        : type === 'danger'
        ? 'bg-danger text-white'
        : type === 'warning'
        ? 'bg-warning text-dark'
        : 'bg-primary text-white';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${bgClass} border-0 shadow-lg`;
    toastEl.id = toastId;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-medium py-3 px-3">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }

  window.showToast = showToast;
});
