(function () {
  'use strict';

  var COUNT_KEY = 'bob_visitor_count';
  var SEEN_KEY = 'bob_visitor_seen';

  function render(text) {
    document.querySelectorAll('.js-visitor-count').forEach(function (el) {
      el.textContent = text;
    });
  }

  var store = null;
  try {
    store = window.localStorage;
    store.getItem(COUNT_KEY); /* Safari private mode throws on write, not read */
    store.setItem('bob_probe', '1');
    store.removeItem('bob_probe');
  } catch (error) {
    store = null;
  }

  if (!store) { /* storage blocked: the visit still reads as one visitor */
    render('1');
    return;
  }

  var counted = store.getItem(SEEN_KEY);
  var count = parseInt(store.getItem(COUNT_KEY), 10);

  if (!counted || isNaN(count)) {
    count = counted ? Math.max(count, 1) : 1;
    store.setItem(COUNT_KEY, String(count));
    store.setItem(SEEN_KEY, new Date().toISOString().slice(0, 10));
  }

  render(count.toLocaleString('en-US'));
})();
