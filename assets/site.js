document.addEventListener('DOMContentLoaded', function () {
  // Inverting cursor dot — mix-blend-mode:difference flips the color of
  // whatever it passes over. Grows on plain links/buttons; on elements that
  // show the text badge below, it hides instead so the two never overlap.
  var hasFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cursor = null;
  if (hasFinePointer) {
    cursor = document.createElement('div');
    cursor.id = 'invert-cursor';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(function (el) {
      if (el.hasAttribute('data-cursor')) return;
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-active'); });
    });
  }

  // Scroll reveal — same spring-eased fade/slide used on the homepage.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(function (el) { io.observe(el); });

  // Custom cursor-follow badge — any element with data-cursor="label" gets it
  // instead of the inverting dot (the two never show at the same time).
  var badge = document.createElement('div');
  badge.id = 'cursor-badge';
  document.body.appendChild(badge);
  document.querySelectorAll('[data-cursor]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      badge.textContent = el.getAttribute('data-cursor');
      badge.classList.add('is-visible');
      if (cursor) cursor.classList.add('is-hidden');
    });
    el.addEventListener('mousemove', function (e) {
      badge.style.left = e.clientX + 'px';
      badge.style.top = e.clientY + 'px';
    });
    el.addEventListener('mouseleave', function () {
      badge.classList.remove('is-visible');
      if (cursor) cursor.classList.remove('is-hidden');
    });
  });

  // Click-to-zoom — small screenshot crops (project galleries, troubleshooting
  // evidence photos) are hard to read, so each gets a "+ Click" hint on hover
  // and opens a near-full-screen preview when clicked. Closes on click
  // (backdrop/image/✕) or Escape. Excludes .gallery.full (ERD/architecture
  // diagrams, already full-width) and .ev-compare (a text table, not a photo).
  var zoomTargets = [];
  document.querySelectorAll('.gallery:not(.full) figure, .ev-proof figure').forEach(function (fig) {
    var img = fig.querySelector('img');
    var cap = fig.querySelector('figcaption');
    if (img) zoomTargets.push({ img: img, capText: cap ? cap.textContent : '' });
  });
  document.querySelectorAll('.ev-body > img').forEach(function (img) {
    var capEl = img.parentNode.nextElementSibling;
    var capText = (capEl && capEl.classList.contains('ev-caption')) ? capEl.textContent : '';
    zoomTargets.push({ img: img, capText: capText });
  });

  if (zoomTargets.length) {
    var zoom = document.createElement('div');
    zoom.className = 'gallery-zoom';
    zoom.innerHTML = '<div class="gallery-zoom-frame"><img alt=""><figcaption></figcaption><button class="gallery-zoom-close" aria-label="Close">✕</button></div>';
    document.body.appendChild(zoom);
    var zoomImg = zoom.querySelector('img');
    var zoomCap = zoom.querySelector('figcaption');
    var closeZoom = function () { zoom.classList.remove('is-visible'); };
    zoom.addEventListener('click', closeZoom);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeZoom();
    });

    zoomTargets.forEach(function (t) {
      var img = t.img;
      var media = document.createElement('div');
      media.className = 'zoom-media';
      img.parentNode.insertBefore(media, img);
      media.appendChild(img);

      var hint = document.createElement('div');
      hint.className = 'zoom-hint';
      hint.innerHTML = '<span class="zoom-hint-icon">+</span><span class="zoom-hint-label">Click</span>';
      media.appendChild(hint);

      media.addEventListener('click', function () {
        zoomImg.src = img.src;
        zoomImg.alt = img.alt || '';
        zoomCap.textContent = t.capText || '';
        zoomCap.style.display = t.capText ? '' : 'none';
        zoom.classList.add('is-visible');
      });
    });
  }
});
