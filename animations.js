/**
 * VIJAYA CLINIC - GSAP + ScrollTrigger Animation Orchestration
 * Bespoke entrance choreography, magnetic button physics, and count-up stats
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Running in standard CSS mode.');
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero Headline & Content Stagger Entrance
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

  heroTimeline
    .from('.hero-badge-reveal', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.3
    })
    .from('.hero-title-reveal', {
      opacity: 0,
      y: 35,
      duration: 1.1
    }, '-=0.5')
    .from('.hero-desc-reveal', {
      opacity: 0,
      y: 25,
      duration: 0.9
    }, '-=0.7')
    .from('.hero-cta-reveal', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-canvas-container', {
      opacity: 0,
      scale: 0.94,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=1.0');

  // 2. Animated Count-Up Numbers with ScrollTrigger
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((statEl) => {
    const targetValue = parseFloat(statEl.getAttribute('data-target') || '0');
    const prefix = statEl.getAttribute('data-prefix') || '';
    const suffix = statEl.getAttribute('data-suffix') || '';
    const decimals = parseInt(statEl.getAttribute('data-decimals') || '0', 10);

    const counterObj = { val: 0 };

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: statEl,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(counterObj, {
            val: targetValue,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              const formattedVal = decimals > 0 
                ? counterObj.val.toFixed(decimals)
                : Math.floor(counterObj.val).toLocaleString();
              statEl.textContent = `${prefix}${formattedVal}${suffix}`;
            }
          });
        }
      });
    } else {
      statEl.textContent = `${prefix}${targetValue}${suffix}`;
    }
  });

  // 3. Staggered Service Cards Reveal
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.from('.service-card-reveal', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 78%'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // 4. Doctor Section Reveal
    gsap.from('.doctor-reveal-image', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%'
      },
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.doctor-reveal-content', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%'
      },
      x: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    // 5. Booking Section Card Reveal
    gsap.from('.booking-section-card', {
      scrollTrigger: {
        trigger: '#book',
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });

    // 6. Floating Background Parallax SVGs
    gsap.to('.floating-bg-icon', {
      y: '-=40',
      rotation: '+=8',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    });
  }

  // 7. Magnetic Button Hover Effect
  const magneticButtons = document.querySelectorAll('.btn-magnetic');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1.1, 0.4)'
      });
    });
  });

  // 8. 3D Card Tilt Effect on Mouse Move
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
