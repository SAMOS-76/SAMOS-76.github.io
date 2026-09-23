/* Project-page images:
   - A paragraph holding only images becomes a figure (one image) or a grid (several).
   - The Markdown title ("caption" in ![alt](file.jpg "caption")) becomes a visible caption.
   - Clicking an image opens a lightbox: ← → to move, Esc to close, focus returns.
   Without JS, images simply show inline. */
(function () {
  var root = document.querySelector('[data-zoomable]');
  if (!root) return;

  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  each(root.querySelectorAll('p'), function (p) {
    var imgs = p.querySelectorAll('img');
    if (!imgs.length) return;
    var onlyImages = Array.prototype.every.call(p.childNodes, function (n) {
      return (n.nodeType === 3 && !n.textContent.trim()) || n.nodeName === 'IMG' || n.nodeName === 'BR';
    });
    if (!onlyImages) return;

    var wrap = document.createElement('div');
    wrap.className = imgs.length > 1 ? 'gallery' : 'figure-single';
    each(imgs, function (img) {
      var caption = img.getAttribute('title') || '';
      img.removeAttribute('title');
      var fig = document.createElement('figure');
      fig.className = 'gallery__item';
      var a = document.createElement('a');
      a.className = 'gallery__link';
      a.href = img.getAttribute('src');
      a.setAttribute('data-caption', caption);
      a.setAttribute('aria-label', 'Enlarge image' + (img.alt ? ': ' + img.alt : ''));
      a.appendChild(img);
      fig.appendChild(a);
      if (caption) {
        var fc = document.createElement('figcaption');
        fc.textContent = caption;
        fig.appendChild(fc);
      }
      wrap.appendChild(fig);
    });
    p.replaceWith(wrap);
  });

  var links = Array.prototype.slice.call(root.querySelectorAll('.gallery__link'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var icon = function (d) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="' + d + '"/></svg>';
  };
  var dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Image viewer');
  dlg.innerHTML =
    '<div class="lightbox__bar">' +
      '<span class="lightbox__counter" aria-live="polite"></span>' +
      '<button type="button" data-close aria-label="Close">' + icon('M6 6l12 12M18 6 6 18') + '</button>' +
    '</div>' +
    '<figure><img class="lightbox__img" alt=""><figcaption class="lightbox__caption"></figcaption></figure>' +
    '<div class="lightbox__nav">' +
      '<button type="button" data-prev aria-label="Previous image">' + icon('M15 18l-6-6 6-6') + '</button>' +
      '<button type="button" data-next aria-label="Next image">' + icon('M9 6l6 6-6 6') + '</button>' +
    '</div>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector('.lightbox__img');
  var cap = dlg.querySelector('.lightbox__caption');
  var counter = dlg.querySelector('.lightbox__counter');
  var nav = dlg.querySelector('.lightbox__nav');
  var index = 0, opener = null;

  function show(i) {
    index = (i + links.length) % links.length;
    var link = links[index], thumb = link.querySelector('img');
    img.src = link.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = link.getAttribute('data-caption') || '';
    counter.textContent = (index + 1) + ' / ' + links.length;
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      opener = link;
      nav.hidden = links.length < 2;
      show(i);
      dlg.showModal();
    });
  });

  dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
  dlg.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });
  // Clicking the dark area (not the image or buttons) closes.
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close();
  });
  dlg.addEventListener('close', function () {
    img.removeAttribute('src');
    if (opener) opener.focus();
  });
})();
