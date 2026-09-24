/* Beauty of Beaches — Main site behaviour */
(function () {
  'use strict';
  function revealWhatHasAlreadyBeenPassed() {
    var edge = window.innerHeight * 1.25;
    document.querySelectorAll('.reveal, .gallery-card').forEach(function (el) {
      if (el.classList.contains('gallery-card') ? !el.classList.contains('gallery-card--revealed') : !el.classList.contains('is-visible')) {
        if (el.getBoundingClientRect().top < edge) {
          if (el.classList.contains('gallery-card')) el.classList.add('gallery-card--revealed');
          else el.classList.add('is-visible');
        }
      }
    });
  }

  /* ---------- Navbar scroll state ---------- */
  var nav = document.querySelector('.navbar-beach');
  var ticking = false;
  var scrollTimer = null;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle('scrolled', y > 30);
      toggleBackToTop(y);
      document.body.classList.add('is-scrolling');
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(scrollSettled, 160);
    });
  }
  function scrollSettled() {
    document.body.classList.remove('is-scrolling');
    revealWhatHasAlreadyBeenPassed();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', revealWhatHasAlreadyBeenPassed, { passive: true });
  onScroll();

  /* ---------- Mobile menu: Bootstrap drives show/hide, we mirror the state ---------- */
  var toggler = document.querySelector('.navbar-toggler-beach');
  var collapseEl = document.getElementById('navbarMenu');
  if (toggler && collapseEl && window.bootstrap && bootstrap.Collapse) {
    collapseEl.addEventListener('shown.bs.collapse', function () {
      toggler.classList.add('open');
      toggler.setAttribute('aria-expanded', 'true');
    });
    collapseEl.addEventListener('hidden.bs.collapse', function () {
      toggler.classList.remove('open');
      toggler.setAttribute('aria-expanded', 'false');
    });
    collapseEl.querySelectorAll('a.nav-link-beach').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.getComputedStyle(collapseEl).display === 'none') return; /* desktop: no-op */
        bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
      });
    });
  } else if (toggler && collapseEl) {
    /* fallback when Bootstrap JS is unavailable (offline CDN) */
    toggler.addEventListener('click', function () {
      var open = collapseEl.classList.toggle('show');
      toggler.classList.toggle('open', open);
      toggler.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Active nav link ---------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link-beach[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });
  if (document.body.hasAttribute('data-zone')) {
    var zonesToggle = document.querySelector('.zones-toggle');
    if (zonesToggle) {
      zonesToggle.classList.add('active');
      zonesToggle.setAttribute('aria-current', 'page');
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 25% 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }
 /* ---------- Back to top ---------- */
  var backBtn = document.querySelector('.back-to-top');
  function toggleBackToTop(y) {
    if (!backBtn) return;
    backBtn.classList.toggle('show', (y === undefined ? window.scrollY : y) > 500);
  }
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  var hero = document.querySelector('.hero');
  var heroVideo = document.getElementById('heroVideo');
  function heroFallsBackToPoster() {
    if (!hero) return;
    if (heroVideo) heroVideo.style.display = 'none';
    hero.classList.add('hero-poster');
  }
  if (heroVideo && hero) {
    heroVideo.addEventListener('error', heroFallsBackToPoster);
    heroVideo.addEventListener('stalled', heroFallsBackToPoster);
    window.setTimeout(function () {
      if (heroVideo.readyState < 2) heroFallsBackToPoster(); /* nothing decoded in 5s */
    }, 5000);
  }
/* ---------- Hero subtle parallax on mouse move ---------- */
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia && hero) {
    hero.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 14;
      var y = (e.clientY / window.innerHeight - 0.5) * 14;
      heroMedia.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.06)';
    });
    hero.addEventListener('mouseleave', function () {
      heroMedia.style.transform = 'translate(0,0) scale(1.02)';
    });
  }

  /* ---------- Video modal ---------- */
  var videoModalEl = document.getElementById('videoModal');
  if (videoModalEl && window.bootstrap) {
    var videoModal = new bootstrap.Modal(videoModalEl);
    var modalFrame = document.getElementById('videoModalFrame');
    document.querySelectorAll('[data-video-src]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        modalFrame.src = trigger.getAttribute('data-video-src');
        videoModal.show();
      });
    });
    videoModalEl.addEventListener('hidden.bs.modal', function () {
      modalFrame.src = '';
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightboxEl = document.getElementById('lightboxModal');
  if (lightboxEl && window.bootstrap) {
    var lightbox = new bootstrap.Modal(lightboxEl);
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      var img = item.querySelector('img');
      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.getAttribute('alt') || '';
      lightboxCaption.textContent = img.getAttribute('alt') || '';
      lightbox.show();
    });
  }

  /* ---------- Download as PDF / DOC (front-end demo) ---------- */
  function getDownloadContent() {
    var title = 'Beauty of Beaches — Beach Guide';
    var lines = [
      title,
      '',
      'A curated summary of featured beaches, zones, and travel notes.',
      '',
      'EAST ZONE — Sunrise shores and calm turquoise coves',
      'WEST ZONE — Golden sunsets over rolling Atlantic surf',
      'NORTH ZONE — Rugged cliffs and cool, dramatic coastline',
      'SOUTH ZONE — Warm tropical bays and swaying palms',
      '',
      'Visit beautyofbeaches (demo site) for the full interactive gallery, zone pages, and travel booking links.',
      '',
      '© ' + new Date().getFullYear() + ' Beauty of Beaches'
    ];
    return lines.join('\n');
  }

  var pdfBtn = document.getElementById('downloadPdfBtn');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', function () {
      if (window.jspdf) {
        var doc = new window.jspdf.jsPDF();
        var text = getDownloadContent();
        var split = doc.splitTextToSize(text, 180);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(split, 15, 20);
        doc.save('Beauty-of-Beaches-Guide.pdf');
      } else {
        downloadTextFile('Beauty-of-Beaches-Guide.txt', getDownloadContent());
      }
    });
  }

  var docBtn = document.getElementById('downloadDocBtn');
  if (docBtn) {
    docBtn.addEventListener('click', function () {
      var header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Beach Guide</title></head><body>';
      var footer = '</body></html>';
      var content = '<pre style="font-family:Poppins,Arial,sans-serif;">' + getDownloadContent().replace(/\n/g, '<br>') + '</pre>';
      var blob = new Blob([header + content + footer], { type: 'application/msword' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Beauty-of-Beaches-Guide.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  function downloadTextFile(filename, text) {
    var blob = new Blob([text], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ---------- Dynamic year in footer ---------- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Anchor links: hand the jump to native smooth scrolling ---------- */
  if (window.jQuery) {
    jQuery(document).on('click', 'a[href^="#"]:not([href="#"])', function (e) {
      var target = jQuery(this.hash);
      if (!target.length) return;
      if (this.pathname.replace(/^\//, '') !== window.location.pathname.replace(/^\//, '')) return;
      e.preventDefault();
      /* scroll-padding-top on html keeps the heading clear of the navbar */
      target[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', this.hash);
    });
  }
})();
