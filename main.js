/* ==========================================================================
   MOKSH PATTERNS — INTERACTIVE APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. STICKY HEADER ON SCROLL
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link or CTA inside mobile drawer
    document.querySelectorAll('.nav-link, .mobile-nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. MODAL HANDLERS
  const setupModal = (triggerId, modalId, closeId) => {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (trigger && modal) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  };

  setupModal('btn-explore-programme', 'modal-programme', 'modal-programme-close');
  setupModal('btn-open-story-modal', 'modal-story', 'modal-story-close');
  setupModal('btn-open-contact-modal', 'modal-contact', 'modal-contact-close');

  // Close modals via ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
  });

  // 4. INTERSECTION OBSERVER FOR FADE-IN REVEALS
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stage-card, .testimonial-card, .offer-card').forEach(el => {
    observer.observe(el);
  });

  // 5. CENTRALIZED WEBINAR REGISTRATION CONFIGURATION
  // Single source of truth for the client's webinar registration destination.
  const WEBINAR_REGISTRATION_URL = 'https://placeholder-systeme-io-webinar-registration.com';

  document.querySelectorAll('a[data-webinar-url], .btn-webinar-cta').forEach(link => {
    link.href = WEBINAR_REGISTRATION_URL;
  });

  // 6. VIDEO TESTIMONIAL PLAY/PAUSE CONTROLLER
  const video = document.getElementById('testimonial-video');
  const playBtn = document.getElementById('video-play-btn');
  const videoContainer = document.getElementById('video-container');

  if (video && playBtn && videoContainer) {
    const togglePlay = () => {
      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }
    };

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('play', () => {
      videoContainer.classList.add('is-playing');
      playBtn.setAttribute('aria-label', 'Pause Video');
    });

    video.addEventListener('pause', () => {
      videoContainer.classList.remove('is-playing');
      playBtn.setAttribute('aria-label', 'Play Video');
    });

    video.addEventListener('ended', () => {
      videoContainer.classList.remove('is-playing');
      playBtn.setAttribute('aria-label', 'Replay Video');
    });
  }

  console.log('Moksh Patterns Editorial Web App Initialized');
});
