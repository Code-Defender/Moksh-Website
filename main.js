/* ==========================================================================
   MOKSH PATTERNS — INTERACTIVE APPLICATION SCRIPT
   ========================================================================== */

import { CONFIG } from './config.js';

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
  setupModal('btn-open-workbook-offer', 'modal-workbook-offer', 'modal-workbook-offer-close');

  const workbookDismissBtn = document.getElementById('modal-workbook-offer-dismiss');
  if (workbookDismissBtn) {
    workbookDismissBtn.addEventListener('click', () => {
      const modal = document.getElementById('modal-workbook-offer');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

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

  // 5. CENTRALIZED EXTERNAL DESTINATIONS CONFIGURATION
  // Automatically sets destination URLs for all buttons & links across the page
  // 1. Free Webinar Registration
  document.querySelectorAll('a[data-webinar-url], .btn-webinar-cta').forEach(link => {
    link.href = CONFIG.WEBINAR_REGISTRATION_URL;
  });

  // 2. Explore the Programme
  document.querySelectorAll('a[data-explore-programme], #btn-explore-programme-link').forEach(link => {
    link.href = CONFIG.EXPLORE_PROGRAMME_URL;
  });

  // 3. Break One Pattern Workbook (£27 Paid Guide)
  const workbookLink = document.getElementById('btn-workbook-offer-link');
  if (workbookLink) {
    workbookLink.href = CONFIG.PAID_GUIDE_URL;
  }

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

  // ==========================================================================
  // 7. COACHING APPLICATION FORM SUBMISSION & CONDITIONAL REDIRECTS (WEB3FORMS)
  // ==========================================================================

  // Destination URLs are loaded from centralized CONFIG
  // 3. £27 Paid Programme / Guide URL
  const PAID_GUIDE_URL = CONFIG.PAID_GUIDE_URL;

  // 4. Calendly Booking URL
  const CALENDLY_URL = CONFIG.CALENDLY_URL;

  const appForm = document.getElementById('coaching-application-form');
  const appSubmitBtn = document.getElementById('app-submit-btn');
  const appErrorMsg = document.getElementById('app-form-error');
  const appSuccessMsg = document.getElementById('app-form-success');
  const dateInput = document.getElementById('app-submission-date');
  const accessKeyInput = document.getElementById('web3forms-access-key');

  if (appForm) {
    let isSubmitting = false;

    // Load Web3Forms Access Key from centralized CONFIG or fallback
    const getAccessKey = () => {
      return CONFIG.WEB3FORMS_ACCESS_KEY || (accessKeyInput ? accessKeyInput.value : '');
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

      // Extract answers to Q9 (Investment Level) and Q10 (Payment Preference)
      const q9Selected = appForm.querySelector('input[name="Investment Level"]:checked');
      const q10Selected = appForm.querySelector('input[name="Payment Preference"]:checked');
      const q9Value = q9Selected ? q9Selected.value.trim() : '';
      const q10Value = q10Selected ? q10Selected.value.trim() : '';

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

      // Dynamic Subject and Sender
      const nameInput = document.getElementById('app-name');
      const applicantName = nameInput ? nameInput.value.trim() : '';
      if (applicantName) {
        formData.set('subject', `${applicantName} fill coaching application`);
      }
      formData.set('from_name', 'private coaching form');

      // Web3Forms payload parameters
      formData.set('access_key', currentKey);
      formData.set('replyto', emailVal);

      const formObject = Object.fromEntries(formData.entries());
      const jsonBody = JSON.stringify(formObject);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: jsonBody
        });

        const data = await response.json().catch(() => ({}));

        // Strict validation: check HTTP status AND Web3Forms success flag
        const isSuccessful = response.ok && (data.success === true || data.success === 'true');

        if (isSuccessful) {
          // Determine redirect destination based on priority rules
          const cannotInvest = (q9Value === "I'm not currently in a position to invest");
          const notReadyFinancial = (q10Value === "I'm not ready to make a financial commitment");

          const isInvestmentReady = (q9Value === '£2,000–£3,000' || q9Value === '£3,000–£5,000');
          const isPaymentReady = (
            q10Value === 'Payment in full' ||
            q10Value === 'A payment plan' ||
            q10Value === "I'm open to discussing both"
          );

          // Priority rule: If not ready for commitment or cannot invest -> Guide URL
          let redirectDestination = 'DEFAULT';
          if (cannotInvest || notReadyFinancial) {
            redirectDestination = 'GUIDE';
          } else if (isInvestmentReady && isPaymentReady) {
            redirectDestination = 'CALENDLY';
          }

          // Redirection Success Message HTML
          const SUCCESS_MESSAGE_HTML = `
            <strong>Application Received</strong>
            <p>Thank you! We've received your application. Redirecting you to the next step...</p>
          `;

          // Handle redirection
          if (redirectDestination === 'CALENDLY') {
            if (appSuccessMsg) {
              appSuccessMsg.innerHTML = SUCCESS_MESSAGE_HTML;
              appSuccessMsg.hidden = false;
              appSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (appSubmitBtn) {
              const btnText = appSubmitBtn.querySelector('.btn-text');
              if (btnText) btnText.textContent = 'Redirecting to Calendar...';
              else appSubmitBtn.textContent = 'Redirecting to Calendar...';
            }

            appForm.reset();

            setTimeout(() => {
              window.location.href = CALENDLY_URL;
            }, 1200);

          } else if (redirectDestination === 'GUIDE') {
            const hasGuideUrl = Boolean(
              PAID_GUIDE_URL &&
              PAID_GUIDE_URL.trim() !== '' &&
              PAID_GUIDE_URL !== 'PASTE_CLIENT_GUIDE_URL_HERE'
            );

            // Close the contact application modal
            const contactModal = document.getElementById('modal-contact');
            if (contactModal) {
              contactModal.classList.remove('active');
              contactModal.setAttribute('aria-hidden', 'true');
            }

            // Restore submit button state
            if (appSubmitBtn) {
              appSubmitBtn.disabled = false;
              const btnText = appSubmitBtn.querySelector('.btn-text');
              if (btnText) btnText.textContent = 'Submit Application';
              else appSubmitBtn.textContent = 'Submit Application';
            }

            appForm.reset();

            // Open the Break One Pattern workbook offer modal
            const offerModal = document.getElementById('modal-workbook-offer');
            if (offerModal && hasGuideUrl) {
              setTimeout(() => {
                offerModal.classList.add('active');
                offerModal.setAttribute('aria-hidden', 'false');
              }, 250);
            } else if (hasGuideUrl) {
              window.location.href = PAID_GUIDE_URL;
            } else {
              // Guide URL is empty / not yet provided by client
              if (appSuccessMsg) {
                appSuccessMsg.innerHTML = SUCCESS_MESSAGE_HTML;
                appSuccessMsg.hidden = false;
                appSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

              if (appSubmitBtn) {
                appSubmitBtn.disabled = true;
                const btnText = appSubmitBtn.querySelector('.btn-text');
                if (btnText) btnText.textContent = 'Application Submitted ✓';
                else appSubmitBtn.textContent = 'Application Submitted ✓';
              }
            }

          } else {
            // General success fallback
            if (appSuccessMsg) {
              appSuccessMsg.innerHTML = SUCCESS_MESSAGE_HTML;
              appSuccessMsg.hidden = false;
              appSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (appSubmitBtn) {
              appSubmitBtn.disabled = true;
              const btnText = appSubmitBtn.querySelector('.btn-text');
              if (btnText) btnText.textContent = 'Application Submitted ✓';
              else appSubmitBtn.textContent = 'Application Submitted ✓';
            }

            appForm.reset();
          }

        } else {
          const errMsg = data.message || 'Unable to submit your application at this time. Please try again.';
          throw new Error(errMsg);
        }

      } catch (err) {
        console.error('Submission error:', err);
        showError('There was an issue submitting your application. Please check your connection and try again, or email hello@mokshpatterns.com directly.');

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
