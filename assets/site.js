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
});
