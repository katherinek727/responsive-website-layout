/**
 * main.js — Битроид IT company
 * Handles: burger menu, desktop dropdowns, mobile dropdowns
 */

(function () {
  'use strict';

  /* =========================================================================
     BURGER MENU — toggle mobile nav overlay
     ========================================================================= */
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileNav  = document.getElementById('mobileNav');

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('mobile-nav--open');

      // Toggle states
      mobileNav.classList.toggle('mobile-nav--open', !isOpen);
      burgerBtn.classList.toggle('burger--active', !isOpen);
      burgerBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.setAttribute('aria-hidden', String(isOpen));

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile nav on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    if (!mobileNav || !burgerBtn) return;
    mobileNav.classList.remove('mobile-nav--open');
    burgerBtn.classList.remove('burger--active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* =========================================================================
     DESKTOP DROPDOWNS — open/close on click, close on outside click
     ========================================================================= */
  const dropdownItems = document.querySelectorAll('[data-dropdown]');

  dropdownItems.forEach(function (item) {
    const trigger = item.querySelector('.nav__link');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = item.classList.contains('nav__item--open');

      // Close all other dropdowns first
      closeAllDropdowns();

      // Toggle current
      if (!isOpen) {
        item.classList.add('nav__item--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function () {
    closeAllDropdowns();
  });

  // Close dropdowns on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  function closeAllDropdowns() {
    dropdownItems.forEach(function (item) {
      item.classList.remove('nav__item--open');
      const trigger = item.querySelector('.nav__link');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  /* =========================================================================
     MOBILE DROPDOWNS — accordion-style toggle inside mobile nav
     ========================================================================= */
  const mobileDropdownItems = document.querySelectorAll('[data-mobile-dropdown]');

  mobileDropdownItems.forEach(function (item) {
    const trigger = item.querySelector('.mobile-nav__link');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('mobile-nav__item--open');

      // Close all other mobile dropdowns
      mobileDropdownItems.forEach(function (el) {
        el.classList.remove('mobile-nav__item--open');
        const t = el.querySelector('.mobile-nav__link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('mobile-nav__item--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================================================================
     CLOSE MOBILE NAV on resize back to desktop
     ========================================================================= */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });

})();
