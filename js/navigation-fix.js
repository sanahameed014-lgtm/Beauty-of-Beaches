(function () {
  'use strict';

  function init(dropdown) {
    var toggle = dropdown.querySelector('.zones-toggle');
    if (!toggle) return;
    var menuId = dropdown.querySelector('.zones-menu') ? dropdown.querySelector('.zones-menu').id : '';
    if (menuId) toggle.setAttribute('aria-controls', menuId);

    function setOpen(open) {
      dropdown.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!dropdown.classList.contains('open'));
    });

    document.addEventListener('click', function (event) {
      if (!dropdown.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && dropdown.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* hover intent, desktop only */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var timer;
      dropdown.addEventListener('mouseenter', function () {
        window.clearTimeout(timer);
        setOpen(true);
      });
      dropdown.addEventListener('mouseleave', function () {
        timer = window.setTimeout(function () { dropdown.classList.remove('open'); }, 240);
      });
    }
  }

  document.querySelectorAll('.zones-dropdown').forEach(init);
})();
