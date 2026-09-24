/* Beauty of Beaches — feedback page interactions */
(function () {
  var form = document.getElementById('feedbackForm');
  var rating = 0;
  var stars = form ? form.querySelectorAll('.star') : [];

  function updateStars() {
    stars.forEach(function (star) {
      var active = Number(star.getAttribute('data-value')) <= rating;
      star.classList.toggle('active', active);
      star.setAttribute('aria-checked', active && Number(star.getAttribute('data-value')) === rating ? 'true' : 'false');
    });
  }

  stars.forEach(function (star) {
    star.addEventListener('mouseenter', function () {
      var preview = Number(star.getAttribute('data-value'));
      stars.forEach(function (item) {
        item.classList.toggle('active', Number(item.getAttribute('data-value')) <= preview);
      });
    });
    star.addEventListener('focus', function () {
      star.dispatchEvent(new Event('mouseenter'));
    });
    star.addEventListener('click', function () {
      rating = Number(star.getAttribute('data-value'));
      updateStars();
    });
  });

  var ratingWrap = form ? form.querySelector('.star-rating') : null;
  if (ratingWrap) ratingWrap.addEventListener('mouseleave', updateStars);

  function setFieldState(input, valid, message) {
    var error = input.parentElement.querySelector('.field-error');
    input.classList.toggle('is-valid', valid);
    input.classList.toggle('is-invalid', !valid);
    if (error) error.textContent = valid ? '' : message;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    var DEFINITIONS = [
      { id: 'fbName',    label: 'Your name',        kind: 'text',  problem: 'Your name: at least 2 letters.' },
      { id: 'fbEmail',   label: 'Email address',    kind: 'email', problem: 'Email address: use a real address like you@example.com.' },
      { id: 'fbCountry', label: 'Where you are from', kind: 'text', problem: 'Where you are from: tell us your country or city.' },
      { id: 'fbBeach',   label: 'Beach you mean',   kind: 'text',  problem: 'Beach you mean: name at least one beach.' },
      { id: 'fbMessage', label: 'Your feedback',    kind: 'long',  problem: 'Your feedback: at least 10 characters.' }
    ];
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var check = window.BobForms.validate(form, DEFINITIONS);
      var problems = check.problems.slice();
      var ratingError = form.querySelector('.rating-error');
      if (!rating) {
        if (ratingError) ratingError.textContent = 'Please choose a star rating.';
        problems.push({ text: 'Star rating: tap a star from 1 to 5.' });
      } else if (ratingError) {
        ratingError.textContent = '';
      }
      if (problems.length) {
        window.BobForms.notify('fix', 'Not sent yet', 'Please fix these ' + problems.length + ' ' +
          (problems.length === 1 ? 'field' : 'fields') + ' and send it again:',
          problems.map(function (p) { return p.text; }));
        window.BobForms.focusFirst(check.problems[0]);
        return;
      }
      window.BobForms.store('bob_feedback', {
        name: document.getElementById('fbName').value.trim(),
        email: document.getElementById('fbEmail').value.trim(),
        country: document.getElementById('fbCountry').value.trim(),
        beach: document.getElementById('fbBeach').value.trim(),
        rating: rating,
        message: document.getElementById('fbMessage').value.trim()
      });
      form.reset();
      rating = 0;
      updateStars();
      window.BobForms.clear(form);
      var toast = document.getElementById('feedbackSuccess');
      if (toast) {
        toast.classList.add('show');
        window.setTimeout(function () { toast.classList.remove('show'); }, 5000);
      }
      window.BobForms.notify('ok', 'Thank you - your feedback is in',
        'It is saved on this device, and it goes straight into the notes we use to improve the guide.');
    });
  }

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
  document.querySelectorAll('.js-year').forEach(function (year) { year.textContent = new Date().getFullYear(); });
  var backTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function () {
    if (backTop) backTop.classList.toggle('show', window.scrollY > 450);
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var viewer = document.getElementById('commentsViewer');
  if (viewer) {
    viewer.classList.add('is-live');
      var commentCards = viewer.querySelectorAll('.comment-card');
    var count = document.querySelector('.comments-count');
    if (count) count.textContent = commentCards.length + ' notes from travelers - tap the arrows or the dots';
    var commentDots = viewer.querySelectorAll('.comment-dot');
    var currentComment = 0;
    var commentTimer;

    function showComment(index) {
      currentComment = (index + commentCards.length) % commentCards.length;
      commentCards.forEach(function (card, cardIndex) {
        var active = cardIndex === currentComment;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-hidden', String(!active));
      });
      commentDots.forEach(function (dot, dotIndex) {
        var active = dotIndex === currentComment;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    }

    function restartCommentTimer() {
      window.clearInterval(commentTimer);
      commentTimer = window.setInterval(function () { showComment(currentComment + 1); }, 6500);
    }

    viewer.querySelector('[data-comment-prev]').addEventListener('click', function () {
      showComment(currentComment - 1);
      restartCommentTimer();
    });
    viewer.querySelector('[data-comment-next]').addEventListener('click', function () {
      showComment(currentComment + 1);
      restartCommentTimer();
    });
    commentDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showComment(Number(dot.getAttribute('data-comment-go')));
        restartCommentTimer();
      });
    });
    viewer.addEventListener('mouseenter', function () { window.clearInterval(commentTimer); });
    viewer.addEventListener('mouseleave', restartCommentTimer);
    viewer.addEventListener('focusin', function () { window.clearInterval(commentTimer); });
    viewer.addEventListener('focusout', function (event) {
      if (!viewer.contains(event.relatedTarget)) restartCommentTimer();
    });
    restartCommentTimer();
  }
})();