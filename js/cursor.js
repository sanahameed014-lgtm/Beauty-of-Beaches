(function () {
  if (!window.jQuery) return;
  $(function () {
  'use strict';
  
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  if (!window.jQuery) return;
  
  var $body = $('body');
  $body.append('<div class="custom-cursor" aria-hidden="true"></div>' +
  '<div class="cursor-ring" aria-hidden="true"></div>' +
  '<div class="cursor-ripple" aria-hidden="true"></div>');
  document.documentElement.classList.add('cursor-active');
  
  var $cursor = $('.custom-cursor'), $ring = $('.cursor-ring'), $ripple = $('.cursor-ripple');
  var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  
  $(document).on('mousemove.cursor', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  $cursor.css({ left: mouseX, top: mouseY });
  });
  
  (function followRing() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  $ring.css({ left: ringX, top: ringY });
  window.requestAnimationFrame(followRing);
  })();
  
  /* hover states are delegated: injected cards get them too */
  var states = {
  'a, button, .nav-link, .dropdown-item': 'hover-link',
  '.btn-wave, .btn-glass, .btn-outline-brand, .gallery-card__btn, .comment-arrow, .filter-btn': 'hover-button',
  'img, .gallery-item, .gallery-card, .video-card, .beach-card, .zone-card': 'hover-image'
  };
  $.each(states, function (selector, cls) {
  $body.on('mouseenter.cursor', selector, function () { $cursor.add($ring).addClass(cls); })
  .on('mouseleave.cursor', selector, function () { $cursor.add($ring).removeClass(cls); });
  });
  
  $body.on('click.cursor', function (e) {
  $ripple.css({ left: e.clientX, top: e.clientY }).removeClass('active');
  void $ripple[0].offsetWidth; /* restart the keyframe */
  $ripple.addClass('active');
  window.setTimeout(function () { $ripple.removeClass('active'); }, 640);
  });
  
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) { $ring.hide(); $ripple.hide(); }
  });
  })();
  