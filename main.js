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

  // 7. COACHING QUALIFICATION APPLICATION FORM SUBMISSION (WEB3FORMS)
  const appForm = document.getElementById('coaching-application-form');
  const appSubmitBtn = document.getElementById('app-submit-btn');
  const appErrorMsg = document.getElementById('app-form-error');
  const appSuccessMsg = document.getElementById('app-form-success');
  const dateInput = document.getElementById('app-submission-date');
  const accessKeyInput = document.getElementById('web3forms-access-key');

  if (appForm) {
    let isSubmitting = false;

    // Load Web3Forms Access Key from Vite environment variables
    const getAccessKey = () => {
      return (import.meta.env && import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) || (accessKeyInput ? accessKeyInput.value : '');
    };

    // Set submission date when opening modal or on page load
    const updateSubmissionDate = () => {
      if (dateInput) {
        dateInput.value = new Date().toLocaleString('en-GB', {
          dateStyle: 'full',
          timeStyle: 'long',
          timeZone: 'Europe/London'
        });
      }
    };
    updateSubmissionDate();

    // Reset messages when modal triggers are clicked
    const contactTrigger = document.getElementById('btn-open-contact-modal');
    if (contactTrigger) {
      contactTrigger.addEventListener('click', () => {
        updateSubmissionDate();
        if (appErrorMsg) appErrorMsg.hidden = true;
      });
    }

    appForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      // Clear previous notices
      if (appErrorMsg) {
        appErrorMsg.hidden = true;
        appErrorMsg.textContent = '';
      }
      if (appSuccessMsg) {
        appSuccessMsg.hidden = true;
        appSuccessMsg.textContent = '';
      }

      // Honeypot check (Web3Forms spam protection)
      const botcheck = appForm.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) {
        console.warn('Spam submission detected by honeypot.');
        return;
      }

      // Validate required text / textarea fields
      const requiredInputs = [
        { el: document.getElementById('app-email'), name: 'Email Address' },
        { el: document.getElementById('app-name'), name: 'Full Name' },
        { el: document.getElementById('app-instagram'), name: 'Instagram Handle' },
        { el: document.getElementById('app-work'), name: 'Current Work' },
        { el: document.getElementById('app-situation'), name: 'Current Situation' },
        { el: document.getElementById('app-outcome'), name: 'Desired Outcome' },
        { el: document.getElementById('app-why'), name: 'Why Now' }
      ];

      for (const item of requiredInputs) {
        if (!item.el || !item.el.value.trim()) {
          showError(`Please fill in your ${item.name}.`);
          if (item.el) item.el.focus();
          return;
        }
      }

      // Basic email pattern check
      const emailVal = document.getElementById('app-email').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        showError('Please enter a valid email address.');
        document.getElementById('app-email').focus();
        return;
      }

      // Validate required radio groups
      const requiredRadioGroups = [
        { name: 'Previous Attempts', label: 'Have you tried to work through this before?' },
        { name: 'Commitment Level', label: 'How serious are you about making this change now?' },
        { name: 'Investment Level', label: 'Level of investment' },
        { name: 'Payment Preference', label: 'Payment option preference' }
      ];

      for (const group of requiredRadioGroups) {
        const checked = appForm.querySelector(`input[name="${group.name}"]:checked`);
        if (!checked) {
          showError(`Please select an option for: "${group.label}".`);
          const firstRadio = appForm.querySelector(`input[name="${group.name}"]`);
          if (firstRadio) firstRadio.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }

      // Update date right before sending
      updateSubmissionDate();

      // Lock UI
      isSubmitting = true;
      if (appSubmitBtn) {
        appSubmitBtn.disabled = true;
        const btnText = appSubmitBtn.querySelector('.btn-text');
        if (btnText) {
          btnText.textContent = 'Submitting Application...';
        } else {
          appSubmitBtn.textContent = 'Submitting Application...';
        }
      }

      const currentKey = getAccessKey();
      const formData = new FormData(appForm);

      // Set Web3Forms configuration fields
      formData.set('access_key', currentKey);
      formData.set('replyto', emailVal);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && (data.success === true || data.success === 'true')) {
          // Success
          if (appSuccessMsg) {
            appSuccessMsg.innerHTML = `
              <strong>Application Received</strong>
              <p>Thank you for taking the time to share your situation. Moksh will review your application carefully and reach out to you shortly.</p>
            `;
            appSuccessMsg.hidden = false;
            appSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          appForm.reset();

          if (appSubmitBtn) {
            appSubmitBtn.disabled = true;
            const btnText = appSubmitBtn.querySelector('.btn-text');
            if (btnText) {
              btnText.textContent = 'Application Submitted ✓';
            } else {
              appSubmitBtn.textContent = 'Application Submitted ✓';
            }
          }
        } else {
          const errMsg = data.message || 'Unable to submit your application at this time. Please try again.';
          throw new Error(errMsg);
        }
      } catch (err) {
        console.error('Submission error:', err);
        const userFacingErr = (err.message && err.message.toLowerCase().includes('access key'))
          ? 'Form submission is currently being configured with the access key. Please email hello@mokshpatterns.com directly.'
          : 'There was an issue submitting your application. Please check your connection and try again, or email hello@mokshpatterns.com directly.';

        showError(userFacingErr);

        if (appSubmitBtn) {
          appSubmitBtn.disabled = false;
          const btnText = appSubmitBtn.querySelector('.btn-text');
          if (btnText) {
            btnText.textContent = 'Submit Application';
          } else {
            appSubmitBtn.textContent = 'Submit Application';
          }
        }
      } finally {
        isSubmitting = false;
      }
    });

    function showError(msg) {
      if (appErrorMsg) {
        appErrorMsg.textContent = msg;
        appErrorMsg.hidden = false;
        appErrorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  console.log('Moksh Patterns Editorial Web App Initialized');
});
