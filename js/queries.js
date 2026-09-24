/* Beauty of Beaches — queries page interactions */
(function () {
  var queryForm = document.getElementById('queryForm');
  if (queryForm) {
    var DEFINITIONS = [
      { id: 'qName',    label: 'Name',            kind: 'text',  problem: 'Name: at least 2 letters.' },
      { id: 'qEmail',   label: 'Email',           kind: 'email', problem: 'Email: use a real address like you@example.com.' },
      { id: 'qSubject', label: 'Subject',         kind: 'text',  problem: 'Subject: what is the question about?' },
      { id: 'qMessage', label: 'Your question',   kind: 'long',  problem: 'Your question: at least 10 characters.' }
    ];
    queryForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var check = window.BobForms.validate(queryForm, DEFINITIONS);
      if (!check.ok) {
        window.BobForms.notify('fix', 'Query not sent', 'Please fix these ' + check.problems.length +
          ' ' + (check.problems.length === 1 ? 'field' : 'fields') + ' and try again:',
          check.problems.map(function (p) { return p.text; }));
        window.BobForms.focusFirst(check.problems[0]);
        return;
      }
      window.BobForms.store('bob_queries', {
        name: document.getElementById('qName').value.trim(),
        email: document.getElementById('qEmail').value.trim(),
        subject: document.getElementById('qSubject').value.trim(),
        message: document.getElementById('qMessage').value.trim()
      });
      queryForm.reset();
      window.BobForms.clear(queryForm);
      var success = document.getElementById('querySuccess');
      if (success) {
        success.classList.add('show');
        window.setTimeout(function () { success.classList.remove('show'); }, 5000);
      }
      window.BobForms.notify('ok', 'Query sent',
        'Saved on this device. A real reply lands in your inbox within a working day.');
    });
  }

  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.parentElement;
      var answer = item.querySelector('.faq-answer p');
      var opening = !item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('open', opening);
      question.setAttribute('aria-expanded', String(opening));
      if (opening && answer && answer.getAttribute('data-answer')) {
        var text = answer.getAttribute('data-answer');
        answer.textContent = '';
        var cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        answer.appendChild(cursor);
        var index = 0;
        (function typeNext() {
          if (!item.classList.contains('open') || index >= text.length) return;
          cursor.insertAdjacentText('beforebegin', text.charAt(index++));
          window.setTimeout(typeNext, 13);
        })();
      }
    });
  });

  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainNav');
  if (navToggle && nav) navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-dropdown > button').forEach(function (button) {
    button.addEventListener('click', function () {
      var parent = button.parentElement;
      var open = parent.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.js-year').forEach(function (year) { year.textContent = new Date().getFullYear(); });
  var backTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function () { if (backTop) backTop.classList.toggle('show', window.scrollY > 450); }, { passive: true });
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();