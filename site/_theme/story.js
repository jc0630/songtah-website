/* 崧達歷程 (_build/tools/story.py): cards tilt toward a fine pointer; the chapter index marks the chapter in view
   and scrolls to a chapter when picked. Nothing runs until the visitor acts. */
(function () {
  var root = document.querySelector('.st-tl');
  if (!root) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (fine && !still) {
    Array.prototype.forEach.call(root.querySelectorAll('.st-tl-card'), function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', ((x - .5) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  var links = Array.prototype.slice.call(root.querySelectorAll('.st-tl-nav a'));
  var chapters = Array.prototype.slice.call(root.querySelectorAll('.st-tl-ch'));
  function mark(id) {
    links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'); });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
      mark(target.id);
      if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
    });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) mark(en.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    chapters.forEach(function (c) { io.observe(c); });
  }
  if (chapters[0]) mark(chapters[0].id);
})();
