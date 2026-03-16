/**
 * Verbo Taller – Content Loader & Statistics
 * Applies saved admin content from localStorage to the landing page,
 * applies section reordering, and tracks visit statistics.
 */
(function () {
  'use strict';

  var CONTENT_KEY = 'verbo_content';
  var ORDER_KEY   = 'verbo_section_order';
  var STATS_KEY   = 'verbo_stats';

  /** Safely escape HTML entities for safe innerHTML reconstruction */
  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Read stored content object; returns null if none saved */
  function getContent() {
    try {
      var raw = localStorage.getItem(CONTENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /** Read stored section order array; returns null if none saved */
  function getOrder() {
    try {
      var raw = localStorage.getItem(ORDER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Apply all [data-editable="section.key"] attributes.
   * Uses textContent to prevent XSS from admin-entered text.
   */
  function applyEditables(c) {
    if (!c) return;
    var els = document.querySelectorAll('[data-editable]');
    for (var i = 0; i < els.length; i++) {
      var el    = els[i];
      var key   = el.getAttribute('data-editable');
      var parts = key.split('.');
      var val   = c;
      for (var j = 0; j < parts.length; j++) {
        if (val == null) { val = null; break; }
        val = val[parts[j]];
      }
      if (val != null) {
        el.textContent = val;
      }
    }
  }

  /**
   * Special handling for the Hero <h1> title which contains a styled accent span.
   * Reconstructs innerHTML from three stored parts: titleLine1, titleAccent, titleLine2.
   */
  function applyHeroTitle(c) {
    if (!c || !c.hero) return;
    var h = c.hero;
    if (h.titleLine1 == null && h.titleAccent == null && h.titleLine2 == null) return;
    var el = document.querySelector('[data-hero-title]');
    if (!el) return;
    var line1  = h.titleLine1  != null ? h.titleLine1  : 'Ideas que';
    var accent = h.titleAccent != null ? h.titleAccent : 'mueven';
    var line2  = h.titleLine2  != null ? h.titleLine2  : 'marcas.';
    // Reconstruct the h1 innerHTML with the accent span; text parts are escaped.
    el.innerHTML =
      escHtml(line1) + ' <br />\n            ' +
      '<span class="hero__title--accent">' + escHtml(accent) + '</span>' +
      ' ' + escHtml(line2);
  }

  /**
   * Physically reorder <section> elements inside <main> according to the
   * saved order array (array of section IDs).
   */
  function applyOrder(order) {
    if (!order || !Array.isArray(order)) return;
    var main = document.querySelector('main');
    if (!main) return;
    for (var i = 0; i < order.length; i++) {
      var section = document.getElementById(order[i]);
      if (section) main.appendChild(section);
    }
  }

  // ─── Statistics ──────────────────────────────────────────────────────────

  function loadStats() {
    try {
      var raw = localStorage.getItem(STATS_KEY);
      return raw ? JSON.parse(raw) : {
        totalVisits:        0,
        sectionViews:       {},
        contactSubmissions: 0,
        lastVisit:          null,
        visitHistory:       []
      };
    } catch (e) {
      return {
        totalVisits:        0,
        sectionViews:       {},
        contactSubmissions: 0,
        lastVisit:          null,
        visitHistory:       []
      };
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) { /* quota exceeded or private mode */ }
  }

  /** Increment total visit counter and record daily history */
  function trackVisit() {
    var stats = loadStats();
    stats.totalVisits = (stats.totalVisits || 0) + 1;
    stats.lastVisit   = new Date().toISOString();

    var today = new Date().toISOString().split('T')[0];
    var found = false;
    for (var i = 0; i < stats.visitHistory.length; i++) {
      if (stats.visitHistory[i].date === today) {
        stats.visitHistory[i].count++;
        found = true;
        break;
      }
    }
    if (!found) {
      stats.visitHistory.push({ date: today, count: 1 });
    }
    // Keep only the last 30 days
    if (stats.visitHistory.length > 30) {
      stats.visitHistory = stats.visitHistory.slice(-30);
    }
    saveStats(stats);
  }

  /** Track how many times each section becomes visible (once per page load) */
  function trackSectionViews() {
    if (!('IntersectionObserver' in window)) return;
    var sections = document.querySelectorAll('section[id]');
    var counted  = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting && !counted[id]) {
          counted[id] = true;
          var stats = loadStats();
          stats.sectionViews        = stats.sectionViews || {};
          stats.sectionViews[id]    = (stats.sectionViews[id] || 0) + 1;
          saveStats(stats);
        }
      });
    }, { threshold: 0.3 });

    for (var i = 0; i < sections.length; i++) {
      observer.observe(sections[i]);
    }
  }

  /** Count contact-form submissions in stats */
  function trackContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function () {
      var stats = loadStats();
      stats.contactSubmissions = (stats.contactSubmissions || 0) + 1;
      saveStats(stats);
    });
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────

  function init() {
    var c     = getContent();
    var order = getOrder();
    applyEditables(c);
    applyHeroTitle(c);
    if (order) applyOrder(order);
    trackVisit();
    trackSectionViews();
    trackContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
