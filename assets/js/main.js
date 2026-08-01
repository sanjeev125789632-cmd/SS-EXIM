/**
 * SS EXIM - Main Interactive JavaScript Module
 * Handles Navigation, Mobile Menu, Gallery Filtering, Lightbox Modal, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initGalleryFilter();
  initLightboxModal();
  initContactForm();
});

/**
 * Mobile Navigation Drawer & Dropdown Handling
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.drawer-close');
  const drawer = document.querySelector('.nav-mobile-drawer');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * Project Gallery Filtering System
 */
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
        if (filterValue === 'all' || itemCat === filterValue) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });
}

/**
 * Accessible Lightbox Modal
 */
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
    const imgSrc = item.getAttribute('data-fullsrc') || item.querySelector('img').src;
    const title = item.querySelector('.gallery-title')?.textContent || 'SS Exim Project Photo';
    const category = item.querySelector('.gallery-cat')?.textContent || 'Gallery';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCat) lightboxCat.textContent = category;
  }

  function openLightbox(item) {
    lastActiveElement = document.activeElement;
    updateItemsList();
    const index = currentItems.indexOf(item);
    showItem(index >= 0 ? index : 0);

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
    if (card) {
      e.preventDefault();
      openLightbox(card);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showItem(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showItem(currentIndex - 1);
    if (e.key === 'ArrowRight') showItem(currentIndex + 1);
  });
}

/**
 * Contact Form Client-side Validation & Handling
 */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const message = form.querySelector('[name="message"]');

    if (!name || !name.value.trim()) isValid = false;
    if (!email || !email.value.trim() || !email.value.includes('@')) isValid = false;
    if (!phone || !phone.value.trim()) isValid = false;
    if (!message || !message.value.trim()) isValid = false;

    if (!isValid) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = '#dc2626';
        feedback.textContent = 'Please fill out all required fields with valid details.';
      }
      return;
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.color = '#1f5fbf';
      feedback.textContent = 'Sending your enquiry... Please wait.';
    }

    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      const json = await response.json();
      if (response.status === 200 && json.success) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#16a34a';
          feedback.textContent = 'Thank you! Your enquiry has been sent successfully to SS Exim. Our team will contact you shortly.';
        }
        form.reset();
      } else {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#dc2626';
          feedback.textContent = json.message || 'Something went wrong. Please try again later.';
        }
      }
    })
    .catch((error) => {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = '#dc2626';
        feedback.textContent = 'Network error. Please check your connection and try again.';
      }
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
  });
}

