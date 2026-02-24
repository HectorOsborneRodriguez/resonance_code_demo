(function () {
  const root = document.querySelector('[data-vid-demo]');
  if (!root) return;

  const video = root.querySelector('[data-vid-element]');
  const status = root.querySelector('[data-vid-status]');

  if (!video) return;

  function setStatus(message) {
    if (!status) return;
    status.textContent = message;
  }

  // ── Enforce no-autoplay ──
  // Even if an autoplay attribute is accidentally added, pause immediately.
  if (!video.paused) {
    video.pause();
    video.currentTime = 0;
  }

  // Guard against programmatic autoplay attempts
  video.removeAttribute('autoplay');

  // ── Status announcements for assistive technology ──
  video.addEventListener('play', function () {
    setStatus('Video is now playing.');
  });

  video.addEventListener('pause', function () {
    setStatus('Video is now paused.');
  });

  video.addEventListener('ended', function () {
    setStatus('Video playback has ended.');
  });

  video.addEventListener('volumechange', function () {
    if (video.muted) {
      setStatus('Video is muted.');
    } else {
      var pct = Math.round(video.volume * 100);
      setStatus('Volume set to ' + pct + '%.');
    }
  });
})();
