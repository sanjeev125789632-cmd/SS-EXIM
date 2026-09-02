/**
 * SS EXIM - Main Interactive JavaScript Module
 * Handles navigation, gallery, analytics, contact form validation and spam protection.
 */

const SS_EXIM_CONFIG = {
  // REPLACE BEFORE PRODUCTION: Google Tag Manager container ID.
  gtmId: 'GTM-XXXXXXX',
  // REPLACE BEFORE PRODUCTION: Google Search Console verification token.
  searchConsoleVerification: 'SEARCH_CONSOLE_VERIFICATION_REPLACE_ME',
  // REPLACE BEFORE PRODUCTION: hCaptcha site key configured for ss-exim.com.
  hcaptchaSiteKey: 'HCAPTCHA_SITE_KEY_REPLACE_ME'
};

document.addEventListener('DOMContentLoaded', () => {
  initGlobalMetadata();
  initAnalyticsTracking();
  initMobileNav();
  initGalleryFilter();
  initLightboxModal();
  initContactForm();
  enhanceFooterLegalLinks();
});

function initGlobalMetadata() {
  // Keep the verified SVG logo and service-area wording consistent on legacy pages.
  document.querySelectorAll('img.logo-img').forEach((logo) => {
    logo.src = '/assets/img/logo.svg';
  });

  document.querySelectorAll('.top-locations, .footer-contact-item').forEach((element) => {
    element.innerHTML = element.innerHTML.replace(/Offices:/g, 'Service Areas:');
  });

  if (window.location.pathname === '/contact/' || window.location.pathname === '/contact/index.html') {
    const description = 'Contact SS Exim in Thane for electrical panels, switchgear, lighting and BMS enquiries. Mumbai, Pune and Bangalore are service areas.';
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (metaDescription) metaDescription.content = description;
    if (ogDescription) ogDescription.content = description;
    document.querySelectorAll('h2').forEach((heading) => {
      if (heading.textContent.trim() === 'Headquarters & Support') heading.textContent = 'Registered Address & Support';
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  if (SS_EXIM_CONFIG.gtmId !== 'GTM-XXXXXXX') {
    const gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(SS_EXIM_CONFIG.gtmId)}`;
    document.head.appendChild(gtm);
  }

  if (!document.querySelector('meta[name="google-site-verification"]')) {
    const verification = document.createElement('meta');
    verification.name = 'google-site-verification';
    verification.content = SS_EXIM_CONFIG.searchConsoleVerification;
    document.head.appendChild(verification);
  }

  if (!document.querySelector('link[rel~="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/jpeg';
    favicon.href = '/assets/img/logo.jpg';
    document.head.appendChild(favicon);
  }

  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/assets/img/logo.jpg';
    document.head.appendChild(appleTouchIcon);
  }

  if (!document.querySelector('link[href="/assets/css/fixes.css"]')) {
    const fixes = document.createElement('link');
    fixes.rel = 'stylesheet';
    fixes.href = '/assets/css/fixes.css';
    document.head.appendChild(fixes);
  }
}

function pushAnalyticsEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

function initAnalyticsTracking() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const label = (link.textContent || link.getAttribute('aria-label') || '').trim();

    if (href.startsWith('tel:')) {
      pushAnalyticsEvent('phone_click', { link_url: href, link_text: label });
    }

    if (href.includes('wa.me/') || href.includes('whatsapp.com/')) {
      pushAnalyticsEvent('whatsapp_click', { link_url: href, link_text: label });
    }

    if (/request\s+(a\s+)?(custom\s+)?quote/i.test(label)) {
      pushAnalyticsEvent('request_quote_click', { link_url: href, link_text: label });
    }
  });
}

function enhanceFooterLegalLinks() {
  const footer = document.querySelector('.site-footer, footer');
  if (!footer || footer.querySelector('.footer-legal-links')) return;

  const legal = document.createElement('p');
  legal.className = 'footer-legal-links';
  legal.innerHTML = '<a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms/">Terms &amp; Conditions</a>';

  const footerBottom = footer.querySelector('.footer-bottom, .footer-bottom-inner') || footer;
  footerBottom.appendChild(legal);

  footer.querySelectorAll('code').forEach((code) => {
    if (/27AVVPA9795L1ZG/i.test(code.textContent || '')) code.classList.add('footer-gstin');
  });
}

/** Mobile Navigation Drawer */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.drawer-close');
  const drawer = document.querySelector('.nav-mobile-drawer');
  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
}

/** Project Gallery Filtering */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const filterValue = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        item.classList.toggle('is-hidden', filterValue !== 'all' && itemCat !== filterValue);
      });
    });
  });
}

/** Accessible Lightbox */
function initLightboxModal() {
  const modal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxCat = document.querySelector('.lightbox-cat');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  if (!modal) return;

  let currentItems = [];
  let currentIndex = 0;
  let lastActiveElement = null;

  function updateItemsList() {
    currentItems = Array.from(document.querySelectorAll('.gallery-card:not(.is-hidden)'));
  }

  function showItem(index) {
    if (!currentItems.length) return;
    if (index < 0) index = currentItems.length - 1;
    if (index >= currentItems.length) index = 0;
    currentIndex = index;
    const item = currentItems[currentIndex];
    const image = item.querySelector('img');
    if (!image || !lightboxImg) return;
    lightboxImg.src = item.getAttribute('data-fullsrc') || image.currentSrc || image.src;
    lightboxImg.alt = item.querySelector('.gallery-title')?.textContent || image.alt || 'SS Exim project photo';
    if (lightboxTitle) lightboxTitle.textContent = lightboxImg.alt;
    if (lightboxCat) lightboxCat.textContent = item.querySelector('.gallery-cat')?.textContent || 'Gallery';
  }

  function openLightbox(item) {
    lastActiveElement = document.activeElement;
    updateItemsList();
    showItem(Math.max(currentItems.indexOf(item), 0));
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) lastActiveElement.focus();
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (card) { e.preventDefault(); openLightbox(card); }
  });
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeLightbox(); });
  if (prevBtn) prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showItem(currentIndex + 1));
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showItem(currentIndex - 1);
    if (e.key === 'ArrowRight') showItem(currentIndex + 1);
  });
}

/** Contact Form: Web3Forms + honeypot + hCaptcha + AJAX */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const feedback = document.querySelector('#form-feedback');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!form.querySelector('input[name="botcheck"]')) {
    const honeypot = document.createElement('input');
    honeypot.type = 'checkbox';
    honeypot.name = 'botcheck';
    honeypot.className = 'hidden';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    form.prepend(honeypot);
  }

  let captchaHost = form.querySelector('.h-captcha');
  if (!captchaHost) {
    captchaHost = document.createElement('div');
    captchaHost.className = 'h-captcha form-captcha';
    captchaHost.dataset.sitekey = SS_EXIM_CONFIG.hcaptchaSiteKey;
    captchaHost.dataset.callback = 'ssEximCaptchaSolved';
    captchaHost.setAttribute('data-expired-callback', 'ssEximCaptchaExpired');
    if (submitBtn) submitBtn.before(captchaHost);
  }

  if (!document.querySelector('script[src^="https://js.hcaptcha.com/1/api.js"]')) {
    const hcaptchaScript = document.createElement('script');
    hcaptchaScript.src = 'https://js.hcaptcha.com/1/api.js';
    hcaptchaScript.async = true;
    hcaptchaScript.defer = true;
    document.head.appendChild(hcaptchaScript);
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-disabled', 'true');
  }

  const consent = document.createElement('p');
  consent.className = 'form-consent';
  consent.innerHTML = 'By submitting this form, you consent to SS Exim processing your enquiry as described in our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/terms/">Terms &amp; Conditions</a>.';
  if (submitBtn && !form.querySelector('.form-consent')) submitBtn.after(consent);

  window.ssEximCaptchaSolved = () => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-disabled');
    }
  };

  window.ssEximCaptchaExpired = () => {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-disabled', 'true');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const message = form.querySelector('[name="message"]');
    const captchaToken = form.querySelector('[name="h-captcha-response"]')?.value || '';
    const isValid = Boolean(
      name?.value.trim() &&
      email?.value.trim() && email.value.includes('@') &&
      phone?.value.trim() &&
      message?.value.trim() &&
      captchaToken
    );

    if (!isValid) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = '#dc2626';
        feedback.textContent = captchaToken
          ? 'Please fill out all required fields with valid details.'
          : 'Please complete the anti-spam verification before submitting.';
      }
      return;
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.color = '#1f5fbf';
      feedback.textContent = 'Sending your enquiry...';
    }
    if (submitBtn) submitBtn.disabled = true;

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200 && json.success) {
          if (feedback) {
            feedback.style.color = '#16a34a';
            feedback.textContent = 'Thank you! Your enquiry has been sent successfully to SS Exim. Our team will contact you shortly.';
          }
          pushAnalyticsEvent('generate_lead', {
            form_id: 'contact-form',
            form_name: 'SS Exim Contact Form'
          });
          form.reset();
          if (window.hcaptcha) window.hcaptcha.reset();
        } else {
          if (feedback) {
            feedback.style.color = '#dc2626';
            feedback.textContent = json.message || 'Something went wrong. Please try again later.';
          }
        }
      })
      .catch(() => {
        if (feedback) {
          feedback.style.color = '#dc2626';
          feedback.textContent = 'Network error. Please check your connection and try again.';
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.setAttribute('aria-disabled', 'true');
        }
      });
  });
}
