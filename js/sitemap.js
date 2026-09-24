/* Beauty of Beaches — site map navigation and search */
(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainNav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.nav-dropdown > button').forEach(function (button) {
    button.addEventListener('click', function () {
      var parent = button.parentElement;
      var open = parent.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  var search = document.getElementById('siteSearch');
  var status = document.getElementById('searchStatus');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.map-card'));
  var zones = Array.prototype.slice.call(document.querySelectorAll('.zone-link'));
  if (search) {
    search.addEventListener('input', function () {
      var query = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var match = !query || (card.getAttribute('data-search') || '').indexOf(query) !== -1;
        card.classList.toggle('hidden', !match);
        if (match) visible += 1;
      });
      zones.forEach(function (zone) {
        var match = !query || (zone.getAttribute('data-search') || '').indexOf(query) !== -1;
        zone.classList.toggle('hidden', !match);
        if (match && query) visible += 1;
      });
      if (status) status.innerHTML = query ? '<strong>' + visible + '</strong> matching destinations' : 'Showing all destinations';
    });
  }

  document.querySelectorAll('.js-year').forEach(function (year) { year.textContent = new Date().getFullYear(); });
  var backTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function () {
    if (backTop) backTop.classList.toggle('show', window.scrollY > 450);
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();