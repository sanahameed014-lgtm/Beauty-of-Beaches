/* Beauty of Beaches — Bottom ticker: live date, time, location */
(function () {
  var track = document.getElementById('tickerTrack');
  if (!track) return;

  var dateEl = document.createElement('span');
  var timeEl = document.createElement('span');
  var locEl = document.createElement('span');
  locEl.textContent = 'Location: Locating…';

  function buildLine() {
    track.innerHTML = '';
    for (var i = 0; i < 12; i++) {
      var d = document.createElement('span');
      var t = document.createElement('span');
      var l = document.createElement('span');
      d.className = 'tk-date';
      t.className = 'tk-time';
      l.className = 'tk-loc';
      track.appendChild(d);
      track.appendChild(t);
      track.appendChild(l);
    }
  }
  buildLine();

  function pad(n) { return n < 10 ? '0' + n : n; }

  function updateClock() {
    var now = new Date();
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateStr = 'Date: ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    var hours = now.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var h12 = hours % 12 || 12;
    var timeStr = 'Time: ' + pad(h12) + ':' + pad(now.getMinutes()) + ' ' + ampm;

    document.querySelectorAll('.tk-date').forEach(function (el) { el.textContent = dateStr; });
    document.querySelectorAll('.tk-time').forEach(function (el) { el.textContent = timeStr; });
  }
  updateClock();
  setInterval(updateClock, 1000 * 30);

  function setLocation(text) {
    document.querySelectorAll('.tk-loc').forEach(function (el) { el.textContent = 'Location: ' + text; });
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude.toFixed(2);
        var lon = pos.coords.longitude.toFixed(2);
        setLocation(lat + ', ' + lon);
      },
      function () {
        setLocation('Karachi, PK'); 
      },
      { timeout: 6000 }
    );
  } else {
    setLocation('Karachi, PK');
  }
})();
