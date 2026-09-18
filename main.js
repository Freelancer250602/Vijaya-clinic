/**
 * VIJAYA CLINIC - Main App Controller (100% Standalone Client-Side)
 * Handles Preloader, Smooth Scrolling, Real-time Clinic Status, and Navbar Dynamics
 */

// Embedded Clinic Schedule Configuration (Pure Client-Side, No API Dependency)
const CLINIC_SCHEDULE_CONFIG = {
  clinicName: "Vijaya Clinic & Advanced Diagnostic Centre",
  emergencyAvailable: true,
  emergencyPhone: "+91 98450 12345",
  schedule: [
    {
      day: "Monday",
      dayIndex: 1,
      isOpen: true,
      morning: { open: "08:30", close: "13:30" },
      evening: { open: "16:30", close: "20:30" }
    },
    {
      day: "Tuesday",
      dayIndex: 2,
      isOpen: true,
      morning: { open: "08:30", close: "13:30" },
      evening: { open: "16:30", close: "20:30" }
    },
    {
      day: "Wednesday",
      dayIndex: 3,
      isOpen: true,
      morning: { open: "08:30", close: "13:30" },
      evening: { open: "16:30", close: "20:30" }
    },
    {
      day: "Thursday",
      dayIndex: 4,
      isOpen: true,
      morning: { open: "08:30", close: "13:30" },
      evening: { open: "16:30", close: "20:30" }
    },
    {
      day: "Friday",
      dayIndex: 5,
      isOpen: true,
      morning: { open: "08:30", close: "13:30" },
      evening: { open: "16:30", close: "20:30" }
    },
    {
      day: "Saturday",
      dayIndex: 6,
      isOpen: true,
      morning: { open: "08:30", close: "14:00" },
      evening: { open: "17:00", close: "20:00" }
    },
    {
      day: "Sunday",
      dayIndex: 0,
      isOpen: true,
      morning: { open: "09:00", close: "13:00" },
      evening: null,
      note: "Emergency & Priority Appointments Only in Evening"
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Branded Preloader Dismissal
  // =========================================================================
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.querySelector('.preloader-bar');

  if (preloader && preloaderBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 18;
      if (progress >= 100) {
        progress = 100;
        preloaderBar.style.width = '100%';
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('loaded');
        }, 300);
      } else {
        preloaderBar.style.width = progress + '%';
      }
    }, 50);
  }

  // =========================================================================
  // 2. Lenis Smooth Scroll Integration (if loaded via CDN)
  // =========================================================================
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger if present
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // =========================================================================
  // 3. Navbar Transparent-to-Solid Scroll Transition
  // =========================================================================
  const navbar = document.querySelector('.custom-navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Close mobile collapse on link click
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const navbarCollapse = document.getElementById('navbarMain');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // =========================================================================
  // 4. Real-time Live Clinic Status Engine (Morning/Evening/Closed) - Standalone
  // =========================================================================
  evaluateLiveClinicStatus();

  function evaluateLiveClinicStatus() {
    try {
      const schedule = CLINIC_SCHEDULE_CONFIG.schedule;
      const now = new Date();
      const currentDayIdx = now.getDay(); // 0 = Sunday, 1 = Monday, ...
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const currentTimeDec = currentHour + currentMin / 60;

      const todaySchedule = schedule.find((s) => s.dayIndex === currentDayIdx);
      const statusPills = document.querySelectorAll('.live-clinic-status-indicator');
      const tableRows = document.querySelectorAll('.schedule-row');

      // Highlight today's row in schedule table
      tableRows.forEach((row) => {
        const rowDay = parseInt(row.getAttribute('data-day-index'), 10);
        if (rowDay === currentDayIdx) {
          row.classList.add('today-highlight');
        } else {
          row.classList.remove('today-highlight');
        }
      });

      if (!todaySchedule || !todaySchedule.isOpen) {
        updatePills(statusPills, false, '🔴 Clinic Closed Today • Emergency on Call');
        return;
      }

      let isOpenNow = false;
      let statusText = '';

      // Parse Morning session
      let morningOpen = 0, morningClose = 0;
      if (todaySchedule.morning) {
        const [oh, om] = todaySchedule.morning.open.split(':').map(Number);
        const [ch, cm] = todaySchedule.morning.close.split(':').map(Number);
        morningOpen = oh + om / 60;
        morningClose = ch + cm / 60;
      }

      // Parse Evening session
      let eveningOpen = 0, eveningClose = 0;
      if (todaySchedule.evening) {
        const [oh, om] = todaySchedule.evening.open.split(':').map(Number);
        const [ch, cm] = todaySchedule.evening.close.split(':').map(Number);
        eveningOpen = oh + om / 60;
        eveningClose = ch + cm / 60;
      }

      if (todaySchedule.morning && currentTimeDec >= morningOpen && currentTimeDec < morningClose) {
        isOpenNow = true;
        statusText = `🟢 Open Now • Morning Consultations (Till ${todaySchedule.morning.close})`;
      } else if (todaySchedule.evening && currentTimeDec >= eveningOpen && currentTimeDec < eveningClose) {
        isOpenNow = true;
        statusText = `🟢 Open Now • Evening Consultations (Till ${todaySchedule.evening.close})`;
      } else if (todaySchedule.evening && currentTimeDec >= morningClose && currentTimeDec < eveningOpen) {
        isOpenNow = false;
        statusText = `🟡 Afternoon Break • Evening Session Opens at ${todaySchedule.evening.open}`;
      } else if (currentTimeDec < morningOpen) {
        isOpenNow = false;
        statusText = `🟡 Opens Today at ${todaySchedule.morning.open}`;
      } else {
        isOpenNow = false;
        statusText = `🔴 Closed for Today • Opens Tomorrow at 08:30 AM`;
      }

      updatePills(statusPills, isOpenNow, statusText);
    } catch (e) {
      console.warn('Could not compute real-time status:', e);
    }
  }

  function updatePills(pills, isOpen, text) {
    pills.forEach((pill) => {
      pill.innerHTML = text;
      pill.className = `live-status-pill ${isOpen ? 'status-open' : 'status-closed'}`;
    });
  }

  // =========================================================================
  // 5. Service Detail Modal Data Binder
  // =========================================================================
  const serviceDetails = {
    cardio: {
      title: "Comprehensive Preventive Cardiology & Lipidology",
      subtitle: "Led by Dr. Vijaya Lakshmi, MD",
      desc: "Advanced non-invasive cardiac evaluation including 12-lead digital resting ECG, 2D Transthoracic Echocardiography with Color Doppler, ambulatory blood pressure telemetry, and hs-CRP / ApoB lipid sub-fraction analysis.",
      prep: ["Fasting for 10-12 hours prior to lipid blood profiling", "Wear loose, comfortable cotton clothing", "Bring all prior cardiology reports and current prescription list"],
      duration: "45 - 60 mins comprehensive workup",
      doctor: "Dr. Vijaya Lakshmi, MD (Internal Medicine & Cardiology)"
    },
    diabetes: {
      title: "Diabetes, Endocrinology & Metabolic Health",
      subtitle: "Precision Glycemic Control & Complication Screening",
      desc: "Holistic protocol addressing Type 1 & 2 Diabetes, Gestational Diabetes, Pre-diabetes reversal, continuous glucose monitoring (CGM) sensor placement, diabetic neuropathy biothesiometry, and microalbuminuria screening.",
      prep: ["Morning fasting blood glucose (before breakfast)", "Post-prandial blood draw exactly 2 hours after meal", "List of current insulin / oral hypoglycemic dosages"],
      duration: "30 - 45 mins",
      doctor: "Dr. Vijaya Lakshmi, MD"
    },
    diagnostics: {
      title: "Advanced In-House Diagnostic Pathology & Imaging",
      subtitle: "NABL-Accredited Precision Equipment",
      desc: "Fully automated biochemistry and hematology analyzers providing same-day verified reports. Digital ultrasonography for abdomen, pelvis, thyroid, and carotid Doppler studies.",
      prep: ["Abdominal ultrasound requires 4-6 hours fasting + full bladder (drink 1L water 1 hr before)", "Blood sample collection available from 8:00 AM daily"],
      duration: "15 - 30 mins per procedure",
      doctor: "Dr. V. Rajesh, MS & Senior Radiologist"
    },
    family: {
      title: "Family Medicine & Preventive Health Checkups",
      subtitle: "Cradle-to-Retirement Comprehensive Primary Care",
      desc: "Annual executive wellness screenings, adult vaccinations (Flu, Pneumococcal, HPV, Hepatitis B), fever & infection triage, asthma management, and geriatric joint & cognitive health care.",
      prep: ["Bring immunization records for vaccinations", "Overnight fasting recommended for full executive panels"],
      duration: "30 - 45 mins",
      doctor: "Dr. Vijaya Lakshmi, MD & Dr. V. Rajesh, MS"
    },
    womens: {
      title: "Women's Wellness & Hormonal Balance Clinic",
      subtitle: "Dedicated, Empathetic Care for Every Life Stage",
      desc: "PCOS/PCOD metabolic protocols, perimenopause & menopause hormone balance, pelvic ultrasound imaging, thyroid disorder management, bone mineral density (DEXA) evaluation, and cancer prevention screenings.",
      prep: ["Consultation does not require fasting unless full hormone blood panel is co-scheduled"],
      duration: "30 - 45 mins",
      doctor: "Dr. Vijaya Lakshmi, MD"
    },
    minor: {
      title: "Minor Surgical Procedures & Day-Care Wound Clinic",
      subtitle: "Aseptic Day Procedure Suite",
      desc: "Minor excisions, sterile cyst drainage, diabetic foot ulcer debridement, sterile suture removal, ear syringing, and specialized advanced hydrocolloid wound dressings.",
      prep: ["Local anesthesia administered where indicated", "Informed consent taken prior to minor procedure"],
      duration: "20 - 40 mins",
      doctor: "Dr. V. Rajesh, MS (Surgery)"
    }
  };

  window.openServiceModal = function (serviceKey) {
    const data = serviceDetails[serviceKey];
    if (!data) return;

    document.getElementById('serviceModalTitle').textContent = data.title;
    document.getElementById('serviceModalSubtitle').textContent = data.subtitle;
    document.getElementById('serviceModalDesc').textContent = data.desc;
    document.getElementById('serviceModalDoctor').textContent = data.doctor;
    document.getElementById('serviceModalDuration').textContent = data.duration;

    const prepListEl = document.getElementById('serviceModalPrepList');
    prepListEl.innerHTML = data.prep.map((p) => `<li class="mb-2">✓ ${p}</li>`).join('');

    const modalEl = document.getElementById('serviceDetailModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  };
});
