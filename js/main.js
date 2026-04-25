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
     CASES SECTION — infinite looping carousel (clone-based)
     ========================================================================= */
  (function () {
    const track    = document.getElementById('casesTrack');
    const dotsWrap = document.getElementById('casesDots');
    if (!track || !dotsWrap) return;

    const sliderWrap = track.closest('.cases__slider-wrap');
    const prevBtn = sliderWrap && sliderWrap.querySelector('.cases__arrow--prev');
    const nextBtn = sliderWrap && sliderWrap.querySelector('.cases__arrow--next');

    // Original cards
    const origCards = Array.from(track.querySelectorAll('.cases__card'));
    const total     = origCards.length;

    // Find which original card starts as active
    let activeOrig = origCards.findIndex(function (c) {
      return c.classList.contains('cases__card--active');
    });
    if (activeOrig < 0) activeOrig = 1;

    // Remove active class from all originals — we'll manage it ourselves
    origCards.forEach(function (c) { c.classList.remove('cases__card--active'); });

    // Clone last N and first N cards and prepend/append for infinite feel
    // We clone all cards on each side so any jump distance is covered
    const clonesBefore = origCards.map(function (c) {
      const cl = c.cloneNode(true);
      cl.setAttribute('aria-hidden', 'true');
      cl.dataset.clone = 'before';
      return cl;
    });
    const clonesAfter = origCards.map(function (c) {
      const cl = c.cloneNode(true);
      cl.setAttribute('aria-hidden', 'true');
      cl.dataset.clone = 'after';
      return cl;
    });

    // Build final order: [clonesBefore..., originals..., clonesAfter...]
    track.innerHTML = '';
    clonesBefore.forEach(function (c) { track.appendChild(c); });
    origCards.forEach(function (c) { track.appendChild(c); });
    clonesAfter.forEach(function (c) { track.appendChild(c); });

    // All rendered cards (clones + originals)
    const allCards = Array.from(track.children);
    // The real cards start at index `total` (after the clonesBefore block)
    const offset = total; // index in allCards where originals begin

    // Current position in allCards
    let pos = offset + activeOrig;

    // Build dots (one per original)
    origCards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'cases__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Кейс ' + (i + 1));
      dot.dataset.index = i;
      dotsWrap.appendChild(dot);
    });

    const GAP = 18;

    function setCardWidths() {
      const clipWidth = track.parentElement.offsetWidth;
      // 3 cards + 2 gaps fill the clip exactly
      const cardW = (clipWidth - GAP * 2) / 3;
      allCards.forEach(function (c) {
        c.style.width = cardW + 'px';
        c.style.flexShrink = '0';
      });
      return cardW;
    }

    function getCardWidth() {
      return allCards[0].offsetWidth + GAP;
    }

    function translateTo(index, animate) {
      const cardW     = getCardWidth();
      const clipWidth = track.parentElement.offsetWidth;
      const shift     = (clipWidth / 2) - (index * cardW) - (cardW / 2) + GAP / 2;

      if (!animate) {
        track.style.transition = 'none';
        track.style.transform  = 'translateX(' + shift + 'px)';
        track.getBoundingClientRect(); // force reflow
        track.style.transition = '';
      } else {
        track.style.transform = 'translateX(' + shift + 'px)';
      }
    }

    function updateActiveClass(index) {
      allCards.forEach(function (c, i) {
        c.classList.toggle('cases__card--active', i === index);
      });
    }

    function updateDots(origIndex) {
      dotsWrap.querySelectorAll('.cases__dot').forEach(function (d, i) {
        const active = i === origIndex;
        d.classList.toggle('cases__dot--active', active);
        d.setAttribute('aria-selected', String(active));
      });
    }

    function origIndexOf(allIndex) {
      return ((allIndex - offset) % total + total) % total;
    }

    function go(newPos) {
      pos = newPos;
      updateActiveClass(pos);
      updateDots(origIndexOf(pos));
      translateTo(pos, true);
    }

    // After transition ends, silently jump from clone to real card
    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform') return;

      let jumped = false;

      if (pos < offset) {
        pos = pos + total;
        jumped = true;
      } else if (pos >= offset + total) {
        pos = pos - total;
        jumped = true;
      }

      if (jumped) {
        // Apply active class first so the card is already at scale(1) before we move
        updateActiveClass(pos);
        // Freeze card transitions so the scale doesn't re-animate
        allCards.forEach(function (c) { c.style.transition = 'none'; });
        translateTo(pos, false);
        // Restore card transitions on next frame
        requestAnimationFrame(function () {
          allCards.forEach(function (c) { c.style.transition = ''; });
        });
      }
    });

    // Click on any card
    allCards.forEach(function (card, i) {
      card.addEventListener('click', function () {
        if (i !== pos) go(i);
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { go(pos - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(pos + 1); });

    dotsWrap.addEventListener('click', function (e) {
      const dot = e.target.closest('.cases__dot');
      if (!dot) return;
      go(offset + parseInt(dot.dataset.index, 10));
    });

    // Initial render — no animation
    setCardWidths();
    updateActiveClass(pos);
    updateDots(activeOrig);
    translateTo(pos, false);

    window.addEventListener('resize', function () {
      setCardWidths();
      translateTo(pos, false);
    });
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
