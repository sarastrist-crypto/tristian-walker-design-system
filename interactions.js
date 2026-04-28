/* =====================================================================
   Tristian Walker — interactions.js
   Cross-browser scroll-reveal fallback for [data-reveal] and
   .hairline-draw. The hidden state is set by CSS scoped to
   `html.js-reveal`, which is added by a tiny inline head script only
   when the JS path will actually run (no reduced-motion, no native
   animation-timeline). This script just toggles .is-visible as
   elements enter the viewport.
   No dependencies. ~30 lines.
   ===================================================================== */
(function () {
  'use strict';

  if (!document.documentElement.classList.contains('js-reveal')) return;
  if (typeof IntersectionObserver === 'undefined') {
    // Fail safe: drop the gate so content is visible.
    document.documentElement.classList.remove('js-reveal');
    return;
  }

  function bind() {
    var targets = document.querySelectorAll('[data-reveal], .hairline-draw');
    if (!targets.length) return;

    for (var i = 0; i < targets.length; i++) {
      var stagger = targets[i].getAttribute('data-reveal-stagger');
      if (stagger) targets[i].style.transitionDelay = stagger + 'ms';
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
