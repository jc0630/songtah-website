/* Course posters open on top of the page instead of navigating away (2026-11-01).
   Any link with data-st-poster="<image url>" shows that image in a dialog; Esc, the close
   button or a click outside the poster closes it and focus returns to the link.
   Loaded on pages that carry such links (see _build/tools/conversion.py). */
(function () {
  var box, img, closeBtn, opener;

  function build() {
    box = document.createElement('div');
    box.className = 'st-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', '課程海報');
    box.hidden = true;
    box.innerHTML = '<button type="button" class="st-lightbox-close" aria-label="關閉海報">×</button>' +
                    '<img class="st-lightbox-img" alt="">';
    document.body.appendChild(box);
    img = box.querySelector('img');
    closeBtn = box.querySelector('button');
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
  }

  function open(link) {
    if (!box) build();
    opener = link;
    img.src = link.getAttribute('data-st-poster');
    var label = link.getAttribute('aria-label') || link.textContent || '';
    img.alt = label.replace(/^查看\s*/, '').trim() || '課程海報';
    box.hidden = false;
    document.documentElement.classList.add('st-lightbox-on');
    closeBtn.focus();
  }

  function close() {
    if (!box || box.hidden) return;
    box.hidden = true;
    img.removeAttribute('src');
    document.documentElement.classList.remove('st-lightbox-on');
    if (opener) opener.focus();
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-st-poster]');
    if (!link) return;
    e.preventDefault();
    open(link);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && box && !box.hidden) { e.preventDefault(); closeBtn.focus(); }
  });
})();
