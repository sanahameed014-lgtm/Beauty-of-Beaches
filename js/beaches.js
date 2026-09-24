
(function () {
  /* home page: one row of three handpicked shores */
  var FEATURED_COUNT = 3;

  if (window.BEACHES_DATA) {
    renderAll(window.BEACHES_DATA);
  }

  function renderAll(data) {
    renderFeaturedBeaches(data.beaches);
    renderGallery(data.beaches);
    renderZoneBeaches(data.beaches, data.zones);
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

 
  function getImageSource(src, prefix) {
    var value = String(src || '');
    if (/^(?:https?:)?\/\//i.test(value) || value.indexOf('data:') === 0) return value;
    if (value.charAt(0) === '/') return encodeURI(value);
    return (prefix || '') + encodeURI(value);
  }

  function beachDetailsHTML(b) {
    var details = b.details || {};
    var rows = [
      ['Best for', details.bestFor],
      ['Water', details.water],
      ['Ideal time', details.idealTime]
    ];

    return '<ul class="beach-card-details">' +
      rows.map(function (row) {
        return '<li><span>' + escapeHTML(row[0]) + '</span><strong>' + escapeHTML(row[1] || 'Explore at your pace') + '</strong></li>';
      }).join('') +
    '</ul>';
  }

  function beachCardHTML(b, isZonePage) {
    var imageSource = getImageSource(b.image, isZonePage ? '../' : '');
    var action = isZonePage
      ? '<span class="beach-card-link">Zone highlight</span>'
      : '<a href="zones/' + encodeURIComponent(b.zone) + '.html" class="btn-outline-brand">Read More' +
          '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>';
    return (
      '<div class="' + (isZonePage ? 'col-6 col-md-4' : 'col-6 col-md-4') + ' reveal">' +
        '<div class="beach-card' + (isZonePage ? ' zone-beach-card' : '') + '">' +
          '<div class="beach-card-img">' +
            '<span class="beach-card-tag">' + escapeHTML(b.zone) + '</span>' +
            '<img src="' + escapeHTML(imageSource) + '" alt="' + escapeHTML(b.name) + '" loading="lazy">' +
          '</div>' +
          '<div class="beach-card-body">' +
            '<h3>' + escapeHTML(b.name) + '</h3>' +
            '<p class="country">' + escapeHTML(b.country) + '</p>' +
            '<p class="beach-card-description">' + escapeHTML(b.description) + '</p>' +
          '</div>' +
          '<div class="beach-card-hover-overlay">' +
            '<span class="beach-card-overlay-kicker">Beach details</span>' +
            '<h3>' + escapeHTML(b.name) + '</h3>' +
            '<p>' + escapeHTML(b.description) + '</p>' +
            beachDetailsHTML(b) +
            action +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderFeaturedBeaches(beaches) {
    var container = document.getElementById('featuredBeaches');
    if (!container) return;
    var featured = beaches.slice(0, FEATURED_COUNT);
    container.innerHTML = featured.map(function (b) { return beachCardHTML(b); }).join('');
  }

  function renderGallery(beaches) {
    var grid = document.getElementById('galleryGrid');
    
    if (!grid || grid.classList.contains('gallery-grid')) return;
    grid.innerHTML = beaches.map(function (b) {
      return (
        '<div class="col-sm-6 col-lg-3 gallery-cell" data-zone="' + b.zone + '">' +
        '<div class="gallery-item reveal">' +
            '<img src="' + escapeHTML(getImageSource(b.image)) + '" alt="' + escapeHTML(b.name + ', ' + b.country) + '" loading="lazy">' +
            '<div class="gallery-item-overlay">' + escapeHTML(b.name) + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var zone = btn.getAttribute('data-filter');
        document.querySelectorAll('.gallery-cell').forEach(function (cell) {
          var match = zone === 'all' || cell.getAttribute('data-zone') === zone;
          cell.style.display = match ? '' : 'none';
        });
      });
    });
  }

  function renderZoneBeaches(beaches, zones) {
    var container = document.getElementById('zoneBeachGrid');
    if (!container) return;
    var zoneKey = document.body.getAttribute('data-zone');
    if (!zoneKey) return;
    var list = beaches.filter(function (b) { return b.zone === zoneKey; });
    container.innerHTML = list.map(function (b) {
      return beachCardHTML(b, true);
    }).join('');

    var revealItems = container.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      revealItems.forEach(function (el) { io.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }
})();
