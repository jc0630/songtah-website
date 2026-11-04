/* 浮凸 card effect (2026-11-01). Tags every card on the page with .st-fx; cards-apple.css
   gives them a resting relief shadow and, on hover, lifts them with a deeper shadow.
   On a fine pointer the card also tilts a few degrees toward the cursor.
   Nothing moves on load: only pointer hover triggers motion. Loaded by _build/tools/conversion.py. */
(function () {
  var CARDS = [
    // Elementor cards that link as a whole (home categories, brand index, product overview tiles, help centre)
    '[data-eael-wrapper-link]:not([data-id="dd1e2df"]):not([data-id="222be35"]):not([data-id="1f59c74"]):not([data-id="af9a821"]):not([data-id="762d74c"])',
    // listing cards: category / brand products, news, cases
    ':is([data-id="917f340"],[data-id="438672d"],[data-id="7fad719"]) > .e-con-inner',
    // home
    '.home [data-id="3a9896d"] > .elementor-widget > .elementor-widget-container',
    '.home [data-id="676bbaf"] > .elementor-widget > .elementor-widget-container',
    '.st-points .elementor-icon-list-item',
    '.st-brand-tile', '.st-news-card', '.st-pair-card', '.st-en-card',
    '.home :is([data-id="613edb5"],[data-id="05b7d75"])',
    // courses
    '.st-course .elementor-post__card', '.st-past-card', '.st-topic', '.st-plan-card', '.st-warranty-card', '.st-about-brand', '.st-doc-card',
    // product pages
    '.st-pd-point', '.st-pd-feat', '.st-pd-rel',
    // panels on services, help centre, courses intro
    ':is([data-id="ef444fb"],[data-id="a139c3a"],[data-id="1b4d68b"],[data-id="9fe6a82"],[data-id="62e0be4"],[data-id="c82cbce"],[data-id="ced8c83"],[data-id="01ce972"],[data-id="b968146"],[data-id="0aafbab"],[data-id="b810438"])',
    ':is([data-id="ef444fb"],[data-id="a139c3a"]) .elementor-widget-icon-box > .elementor-widget-container',
    // products overview: 導入流程 points
    '[data-id="b2831ef"] .elementor-widget-icon-box > .elementor-widget-container',
    // brand pages: 三大特色
    '[data-id="ff5d5a5"] > .elementor-widget > .elementor-widget-container',
    // downloads, licences
    '[data-id="fa7235b"] > .e-con', '[data-id="fa7235b"] > .e-con-inner > .e-con',
    '[data-id="c812c27"] .gallery-item'
  ].join(',');

  function tag() {
    var list = document.querySelectorAll(CARDS);
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.closest('.swiper-slide')) continue;          // carousels clip anything that rises
      el.classList.add('st-fx');
      if (el.closest('.home [data-id="676bbaf"]')) el.classList.add('st-fx--dark');
    }
  }

  // every card in a group gets the height of the tallest one (groups = nearest ancestor holding 2+ cards)
  function equalize() {
    var cards = document.querySelectorAll('.st-fx'), groups = [], keys = [];
    for (var i = 0; i < cards.length; i++) {
      var a = cards[i].parentElement;
      while (a && a.querySelectorAll('.st-fx').length < 2) a = a.parentElement;
      if (!a) continue;
      var k = keys.indexOf(a);
      if (k < 0) { keys.push(a); groups.push([]); k = groups.length - 1; }
      groups[k].push(cards[i]);
    }
    groups.forEach(function (g) {
      g.forEach(function (c) { c.style.minHeight = ''; });
      // feature grids where some cards carry a picture: match heights within each row only,
      // so a row of text-only cards is not stretched to the picture cards' height
      var byRow = keys[groups.indexOf(g)].querySelector('.st-pd-feat-art'), rows = {};
      g.forEach(function (c) { var r = byRow ? Math.round(c.offsetTop) : 0; (rows[r] = rows[r] || []).push(c); });
      Object.keys(rows).forEach(function (r) {
        var max = 0;
        rows[r].forEach(function (c) { if (c.offsetWidth) max = Math.max(max, c.getBoundingClientRect().height); });
        rows[r].forEach(function (c) { if (c.offsetWidth) c.style.minHeight = Math.ceil(max) + 'px'; });
      });
    });
  }
  var timer;
  function later() { clearTimeout(timer); timer = setTimeout(equalize, 120); }

  function tilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var current = null;
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest ? e.target.closest('.st-fx') : null;
      if (current && current !== card) reset(current);
      current = card;
      if (!card) return;
      var r = card.getBoundingClientRect();
      var k = Math.min(1, 380 / r.width) * 5;                // wide panels tilt less
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--fx-rx', (-y * k).toFixed(2) + 'deg');
      card.style.setProperty('--fx-ry', (x * k).toFixed(2) + 'deg');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { if (current) reset(current); current = null; });
  }
  function reset(card) { card.style.removeProperty('--fx-rx'); card.style.removeProperty('--fx-ry'); }

  // real buttons (filled or outlined, not text links) get rounder corners, a lift and a light sweep on hover
  function buttons() {
    var list = document.querySelectorAll('a.elementor-button, button.elementor-button, .st-pd-btn, .st-inq-btn, .wpcf7-submit, input[type="submit"]');
    for (var i = 0; i < list.length; i++) {
      var s = getComputedStyle(list[i]);
      var filled = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
      var framed = parseFloat(s.borderTopWidth) > 0;
      if (filled || framed) list[i].classList.add('st-btn');
    }
  }

  function start() {
    buttons(); tag(); tilt(); equalize();
    window.addEventListener('resize', later);
    window.addEventListener('load', later);                 // images and web fonts change heights
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
