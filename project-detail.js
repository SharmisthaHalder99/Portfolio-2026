/**
 * project-detail.js
 * Scroll-triggered fade-up animations for project case study pages.
 */

(function () {
  'use strict';

  const THRESHOLD = 0.15;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: THRESHOLD, rootMargin: '0px 0px -48px 0px' }
  );

  // Observe all fade-up elements once DOM is ready
  function init() {
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
