
(function () {
  'use strict';

  var OPEN = null;

  function shell() {
    var host = document.getElementById('bobDialogHost');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'bobDialogHost';
    host.className = 'bob-dialog';
    host.hidden = true;
    host.innerHTML =
      '<div class="bob-dialog__backdrop" data-bob-close></div>' +
      '<div class="bob-dialog__card" role="dialog" aria-modal="true" aria-labelledby="bobDialogTitle">' +
        '<svg class="bob-dialog__crest" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true">' +
          '<path d="M0 30 Q 75 6 150 30 T 300 30 T 450 30 T 600 30 V60 H0 Z"></path>' +
        '</svg>' +
        '<span class="bob-dialog__mark" aria-hidden="true"></span>' +
        '<h3 id="bobDialogTitle"></h3>' +
        '<p id="bobDialogBody"></p>' +
        '<ul id="bobDialogList"></ul>' +
        '<button type="button" class="btn-wave" data-bob-close>Close</button>' +
      '</div>';
    (document.querySelector('main') || document.body).appendChild(host);
    host.addEventListener('click', function (event) {
      var closer = event.target.closest ? event.target.closest('[data-bob-close]') : null;
      if (closer) close();
    });
    return host;
  }

  function close() {
    var host = OPEN;
    if (!host) return;
    var back = host._returnTo;
    host.hidden = true;
    OPEN = null;
    if (back && back.focus) back.focus();
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && OPEN) close();
  });
   function notify(kind, title, body, lines) {
    var host;
    try {
      host = shell();
      var card = host.querySelector('.bob-dialog__card');
      host.querySelector('.bob-dialog__mark').textContent = kind === 'ok' ? '\u2713' : '!';
      host.querySelector('.bob-dialog__mark').dataset.state = kind === 'ok' ? 'ok' : 'fix';
      host.querySelector('#bobDialogTitle').textContent = title;
      host.querySelector('#bobDialogBody').textContent = body || '';
      var list = host.querySelector('#bobDialogList');
      list.textContent = '';
      (lines || []).forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });
      host.dataset.state = kind === 'ok' ? 'ok' : 'fix';
      host.hidden = false;
      OPEN = host;
      host._returnTo = document.activeElement;
      var button = host.querySelector('[data-bob-close]');
      if (button && button.focus) button.focus();
      window.clearTimeout(host._timer);
      if (kind === 'ok') host._timer = window.setTimeout(close, 7000);
      return true;
    } catch (error) {
      var text = title + (body ? ' — ' + body : '') +
        ((lines && lines.length) ? '\n• ' + lines.join('\n• ') : '');
      window.alert(text);
      return false;
    }
  }

  /* shared field rules, so all three forms ask for the same quality of answer */
  var RULES = {
    text: function (value) { return value.length >= 2; },
    email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value); },
    phone: function (value) { return /^[+]?[0-9\s()-]{7,18}$/.test(value); },
    long: function (value) { return value.length >= 10; }
  };
  function validate(form, defs) {
    var problems = [];
    defs.forEach(function (def) {
      var input = document.getElementById(def.id);
      if (!input) return;
      var value = (input.value || '').trim();
      var test = RULES[def.kind] || RULES.text;
      var ok = !!value && (def.min ? value.length >= def.min : test(value));
      var slot = input.parentElement && input.parentElement.querySelector('.field-error, .invalid-feedback, .error-message');
      input.classList.toggle('is-invalid', !ok);
      input.classList.toggle('is-valid', ok);
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (slot) slot.textContent = ok ? '' : (def.problem || (def.label + ' needs a real answer.'));
      if (!ok) problems.push({ id: def.id, text: def.problem || (def.label + ': please check this.'), input: input });
    });
    return { ok: problems.length === 0, problems: problems };
  }

  function clear(form) {
    form.querySelectorAll('.is-valid, .is-invalid').forEach(function (input) {
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.field-error, .invalid-feedback, .error-message').forEach(function (slot) {
      slot.textContent = '';
    });
  }

  function focusFirst(problem) {
    if (!problem || !problem.input) return;
    var field = problem.input;
    if (field.focus) field.focus();
    if (field.scrollIntoView) field.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function store(key, entry) {
    var rows = [];
    try { rows = JSON.parse(window.localStorage.getItem(key) || '[]'); } catch (error) { rows = []; }
    entry.date = new Date().toISOString();
    rows.push(entry);
    try { window.localStorage.setItem(key, JSON.stringify(rows)); } catch (error) { /* private mode */ }
    return rows.length;
  }

  window.BobForms = { notify: notify, validate: validate, clear: clear, focusFirst: focusFirst, store: store };
})();
