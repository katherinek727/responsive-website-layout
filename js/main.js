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
     CONTACT FORM — custom checkbox toggle
     ========================================================================= */
  document.querySelectorAll('.contact__checkbox').forEach(function (box) {
    function toggle() {
      const checked = box.getAttribute('aria-checked') === 'true';
      box.setAttribute('aria-checked', String(!checked));
    }
    box.addEventListener('click', toggle);
    box.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
  });

  /* =========================================================================
     FAQ ACCORDION
     ========================================================================= */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq__item--open');

      // Close all
      faqItems.forEach(function (el) {
        el.classList.remove('faq__item--open');
        const b = el.querySelector('.faq__question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('faq__item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================================================================
     CASES SECTION — carousel with arrows and dots
     ========================================================================= */
  (function () {
    const track   = document.getElementById('casesTrack');
    const dotsWrap = document.getElementById('casesDots');
    if (!track || !dotsWrap) return;

    const cards = Array.from(track.querySelectorAll('.cases__card'));
    const prevBtn = track.closest('.cases__slider-wrap') && track.closest('.cases__slider-wrap').querySelector('.cases__arrow--prev');
    const nextBtn = track.closest('.cases__slider-wrap') && track.closest('.cases__slider-wrap').querySelector('.cases__arrow--next');

    // Build dots
    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'cases__dot' + (i === 0 ? ' cases__dot--active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Кейс ' + (i + 1));
      dot.setAttribute('aria-selected', String(i === 0));
      dot.dataset.index = i;
      dotsWrap.appendChild(dot);
    });

    function getVisibleCount() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }

    function scrollToIndex(idx) {
      const cardWidth = cards[0].offsetWidth + 20; // gap
      track.scrollTo({ left: cardWidth * idx, behavior: 'smooth' });
    }

    function updateDots(idx) {
      dotsWrap.querySelectorAll('.cases__dot').forEach(function (d, i) {
        const active = i === idx;
        d.classList.toggle('cases__dot--active', active);
        d.setAttribute('aria-selected', String(active));
      });
    }

    let currentIdx = 0;

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentIdx = Math.max(0, currentIdx - 1);
        scrollToIndex(currentIdx);
        updateDots(currentIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentIdx = Math.min(cards.length - getVisibleCount(), currentIdx + 1);
        scrollToIndex(currentIdx);
        updateDots(currentIdx);
      });
    }

    dotsWrap.addEventListener('click', function (e) {
      const dot = e.target.closest('.cases__dot');
      if (!dot) return;
      currentIdx = parseInt(dot.dataset.index, 10);
      scrollToIndex(currentIdx);
      updateDots(currentIdx);
    });

    track.addEventListener('scroll', function () {
      const cardWidth = cards[0].offsetWidth + 20;
      currentIdx = Math.round(track.scrollLeft / cardWidth);
      updateDots(currentIdx);
    }, { passive: true });
  }());

  /* =========================================================================
     WHO SECTION — mobile slider dots
     ========================================================================= */
  const whoCards = document.getElementById('whoCards');
  const whoDots  = document.querySelectorAll('.who__dot');

  if (whoCards && whoDots.length) {
    // Dot click → scroll to card
    whoDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(dot.dataset.index, 10);
        const cardWidth = whoCards.offsetWidth;
        whoCards.scrollTo({ left: cardWidth * idx, behavior: 'smooth' });
      });
    });

    // Scroll → update active dot
    whoCards.addEventListener('scroll', function () {
      const idx = Math.round(whoCards.scrollLeft / whoCards.offsetWidth);
      whoDots.forEach(function (d, i) {
        d.classList.toggle('who__dot--active', i === idx);
        d.setAttribute('aria-selected', String(i === idx));
      });
    }, { passive: true });
  }

  /* =========================================================================
     CLOSE MOBILE NAV on resize back to desktop
     ========================================================================= */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      closeMobileNav();
    }
  });

})();
