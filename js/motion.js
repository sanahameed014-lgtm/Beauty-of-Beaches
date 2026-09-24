(function () {
  'use strict';

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* zone cards flip instead of tilting, so they are not in this list */
  var TILT = '.beach-card, .travel-card, .video-card, .map-card, .download-panel';

  /* ---------- 3D tilt: the card turns toward the pointer, max ~7 degrees ---------- */
  if (fine && !calm && 'forEach' in NodeList.prototype) {
    document.addEventListener('pointermove', function (event) {
      var card = event.target.closest ? event.target.closest(TILT) : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (event.clientX - r.left) / r.width - 0.5;
      var py = (event.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (py * -6).toFixed(2) + 'deg');
    }, { passive: true });

    document.addEventListener('pointerout', function (event) {
      var card = event.target.closest ? event.target.closest(TILT) : null;
      if (!card || (card.contains && card.contains(event.relatedTarget))) return;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    }, { passive: true });
  }
  var zoneCols = document.querySelectorAll('.zone-col');
  if (zoneCols.length && fine) {
    zoneCols.forEach(function (col) {
      var card = col.querySelector('.zone-card');
      if (!card) return;
      function turn(on) {
        if (col._turned === on) return;
        col._turned = on;
        col.classList.toggle('is-turned', on);
      }
      col.addEventListener('pointerenter', function () { turn(true); });
      col.addEventListener('pointerleave', function () { turn(false); });
      card.addEventListener('focusin', function () { turn(true); });
      card.addEventListener('focusout', function () { turn(false); });
    });
  }

  /* ---------- Reveals for cards injected after main.js has run ---------- */
  var revealHosts = [document.getElementById('featuredBeaches'), document.getElementById('zoneBeachGrid')];
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 25% 0px' });

    revealHosts.forEach(function (host) {
      if (!host) return;
      host.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) { io.observe(el); });
    });
  }

  /* ---------- Hero light: the headline drifts against the video ---------- */
  var hero = document.querySelector('.hero');
  var heroContent = document.querySelector('.hero-content');
  if (hero && heroContent && fine && !calm) {
    hero.addEventListener('pointermove', function (event) {
      var x = (event.clientX / window.innerWidth - 0.5) * 10;
      var y = (event.clientY / window.innerHeight - 0.5) * 10;
      heroContent.style.transform = 'translate3d(' + (-x) + 'px,' + (-y) + 'px,0)';
    });
    hero.addEventListener('pointerleave', function () { heroContent.style.transform = ''; });
  }
})();
