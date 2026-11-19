/**
 * ============================================================================
 * MOKSH PATTERNS — CENTRALIZED CONFIGURATION
 * ============================================================================
 * 
 * Manage all 4 external website links from this single configuration file.
 * You can update the URLs below directly, or set them in your `.env` file.
 * 
 * 1. Free Webinar Registration (TEMPORARY DUMMY URL)
 * 2. Explore the Programme (EXISTING REAL URL)
 * 3. £27 Paid Programme / Guide (TEMPORARY DUMMY URL)
 * 4. Calendly Booking (EXISTING REAL URL)
 */

export const CONFIG = {
  // 1. FREE WEBINAR REGISTRATION
  // [TEMPORARY DUMMY URL] — Replace with the actual webinar registration link when provided.
  WEBINAR_REGISTRATION_URL: 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WEBINAR_URL) || 
    'https://placeholder-systeme-io-webinar-registration.com',

  // 2. EXPLORE THE PROGRAMME
  // [EXISTING REAL URL] — Active sales & landing page for the self-paced programme.
  EXPLORE_PROGRAMME_URL: 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EXPLORE_PROGRAMME_URL) || 
    'https://mokshu21.systeme.io/who-taught-you-that',

  // 3. £27 PAID PROGRAMME / GUIDE
  // [TEMPORARY DUMMY URL] — Replace with client's actual £27 guide landing page URL when provided.
  PAID_GUIDE_URL: 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PAID_PROGRAMME_27_URL) || 
    'https://placeholder-systeme-io-27-guide.com',

  // 4. CALENDLY BOOKING
  // [EXISTING REAL URL] — Active 1:1 private clarity call booking calendar.
  CALENDLY_URL: 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CALENDLY_BOOKING_URL) || 
    'https://calendly.com/mokshtoolsee-coach/private-clarity-call',

  // FORM SUBMISSION (Web3Forms Access Key)
  WEB3FORMS_ACCESS_KEY: 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) || 
    'afa5335f-b72e-4cc0-9d0a-00e98ee46c3a'
};
