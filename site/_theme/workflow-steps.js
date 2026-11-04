/* 牙科產品「依流程搭配設備與材料」: four numbered steps, one open at a time (2026-11-01).
   Desktop shows the steps in a row with the open step's panel underneath; phones get an accordion.
   Same markup either way, built by _build/tools/content_fixes.workflow(). */
(function () {
  function setup(root) {
    var items = root.querySelectorAll('.st-wf-item');
    function open(target, focus) {
      items.forEach(function (it) {
        var on = it === target;
        var tab = it.querySelector('.st-wf-tab');
        it.classList.toggle('is-open', on);
        tab.setAttribute('aria-expanded', on ? 'true' : 'false');
        it.querySelector('.st-wf-panel').hidden = !on;
        it.querySelector('.st-wf-hint').textContent = on ? '目前顯示' : '點選查看';
      });
      if (focus) target.querySelector('.st-wf-tab').focus();
      if (window.matchMedia('(max-width: 767px)').matches) {
        var top = target.getBoundingClientRect().top;
        if (top < 70) window.scrollBy({ top: top - 90, behavior: 'smooth' });
      }
    }
    items.forEach(function (it, i) {
      var tab = it.querySelector('.st-wf-tab');
      tab.addEventListener('click', function () {
        var phone = window.matchMedia('(max-width: 767px)').matches;
        if (phone && it.classList.contains('is-open')) {        // accordion: tapping the open step folds it
          it.classList.remove('is-open');
          tab.setAttribute('aria-expanded', 'false');
          it.querySelector('.st-wf-panel').hidden = true;
          it.querySelector('.st-wf-hint').textContent = '點選查看';
          return;
        }
        open(it, false);
      });
      tab.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        open(items[(i + n + items.length) % items.length], true);
      });
    });
  }
  function start() { document.querySelectorAll('[data-st-wf]').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
