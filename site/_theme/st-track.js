/* Conversion events (see _build/docs/01-商業骨架表.md §四).
   Sends to gtag() or dataLayer when analytics is installed; otherwise does nothing. */
(function () {
  function send(name, params) {
    if (typeof window.gtag === 'function') { window.gtag('event', name, params); return; }
    if (Array.isArray(window.dataLayer)) { window.dataLayer.push(Object.assign({ event: name }, params)); }
  }
  function eventFor(a) {
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) return 'click_tel';
    if (h.indexOf('mailto:') === 0) return 'click_mail';
    if (/line\.me|lin\.ee/.test(h)) return 'click_line';
    if (/\.(pdf|zip|docx?|xlsx?|pptx?)(\?|$)/i.test(h)) return 'download';
    if (/^https?:/.test(h) && h.indexOf(location.host) === -1) return 'outbound_brand';
    if (/contact(\.html|\/)/.test(h)) return 'click_contact_cta';
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var name = eventFor(a);
    if (!name) return;
    send(name, { page: location.pathname, href: a.href, label: (a.textContent || '').trim().slice(0, 60) });
  }, true);
  var form = document.querySelector('form.wpcf7-form');
  if (form) form.addEventListener('submit', function () {
    var v = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
    send('form_submit', { page: location.pathname, product: v('your-product'), role: v('your-role') });
  });
})();
