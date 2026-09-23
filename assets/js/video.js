/* Card loops: play only while on screen, loop a few times then rest on the
   last frame (replays on hover/focus). Hero clips autoplay muted.
   Nothing autoplays if the visitor prefers reduced motion.
   YouTube: click-to-load privacy-friendly embed. */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAX_LOOPS = 3;

  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  /* ── Card loop videos ── */
  var loops = document.querySelectorAll('video[data-loop-video]');
  if (!reduced && loops.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.preload === 'none') { v.preload = 'auto'; }
          if ((v._plays || 0) < MAX_LOOPS) play(v);
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.4 });

    Array.prototype.forEach.call(loops, function (v) {
      v._plays = 0;
      v.addEventListener('ended', function () {
        v._plays++;
        if (v._plays < MAX_LOOPS) { v.currentTime = 0; play(v); }
      });
      var card = v.closest('.card');
      if (card) {
        var replay = function () { if (v.paused) { v._plays = MAX_LOOPS - 1; v.currentTime = 0; play(v); } };
        card.addEventListener('mouseenter', replay);
        card.addEventListener('focus', replay);
      }
      io.observe(v);
    });
  }

  /* ── Hero videos (have controls, so visitors can pause) ── */
  if (!reduced) {
    Array.prototype.forEach.call(document.querySelectorAll('video[data-autoplay]'), play);
  }

  /* ── YouTube lite embed ── */
  Array.prototype.forEach.call(document.querySelectorAll('[data-youtube]'), function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var id = a.getAttribute('data-youtube');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      iframe.title = a.getAttribute('data-title') || 'Video';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      var wrap = document.createElement('div');
      wrap.className = 'media media--youtube';
      wrap.appendChild(iframe);
      a.replaceWith(wrap);
      iframe.focus();
    });
  });
})();
