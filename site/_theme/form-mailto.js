/* Contact form without a server (2026-11-01).
   The mirrored Contact Form 7 posts to WordPress, which a static host does not have, so a
   submission would fail silently. Until a form service is connected, a valid submission opens
   the visitor's mail app with every field filled in, addressed to sales@songtah.com.tw.
   Loaded on pages that carry a .wpcf7-form (see _build/tools/conversion.py). */
(function () {
  var TO = 'sales@songtah.com.tw';
  var LABELS = {
    'your-name': '姓名', 'your-role': '身分', 'your-phone': '電話', 'your-email': 'Email',
    'your-product': '詢問產品', 'your-subject': '主旨', 'your-message': '需求內容'
  };

  function say(form, text, bad) {
    var out = form.querySelector('.wpcf7-response-output');
    if (!out) return;
    out.textContent = text;
    out.setAttribute('aria-hidden', 'false');
    out.setAttribute('role', 'status');
    out.style.display = 'block';
    out.classList.toggle('st-form-bad', !!bad);
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches || !form.matches('form.wpcf7-form')) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    var fields = form.querySelectorAll('input:not([type=hidden]):not([type=submit]), select, textarea');
    var lines = [], missing = null;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var val = (f.value || '').trim();
      var required = f.required || f.getAttribute('aria-required') === 'true';
      f.removeAttribute('aria-invalid');
      if (required && !val) {
        f.setAttribute('aria-invalid', 'true');
        if (!missing) missing = f;
        continue;
      }
      if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        f.setAttribute('aria-invalid', 'true');
        if (!missing) missing = f;
        continue;
      }
      if (val) lines.push((LABELS[f.name] || f.name) + '：' + val);
    }
    if (missing) {
      say(form, '請填寫標示必填的欄位，並確認 Email 格式正確。', true);
      missing.focus();
      return;
    }
    var get = function (n) { var x = form.querySelector('[name="' + n + '"]'); return x ? x.value.trim() : ''; };
    var subject = '官網詢問' + (get('your-product') ? '｜' + get('your-product') : get('your-subject') ? '｜' + get('your-subject') : '');
    var body = lines.join('\n') + '\n\n（由崧達官網表單送出）';
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    say(form, '已為您開啟郵件程式，確認內容後按下寄出即可。若沒有自動開啟，請來電 02-2703-6465 或寄信至 ' + TO + '。', false);
    if (window.gtag) window.gtag('event', 'form_submit', { method: 'mailto' });
  }, true);
})();
