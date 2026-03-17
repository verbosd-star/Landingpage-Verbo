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
  var POSTS_KEY   = 'verbo_portfolio_posts';

  var GRADIENT_COLORS = [
    'linear-gradient(135deg, #1a0a00 0%, #FF3B00 60%, #FFB800 100%)',
    'linear-gradient(135deg, #000a1a 0%, #0047FF 100%)',
    'linear-gradient(135deg, #0a001a 0%, #8B00FF 100%)',
    'linear-gradient(135deg, #001a0a 0%, #00A651 100%)',
    'linear-gradient(135deg, #1a1000 0%, #FFB800 100%)'
  ];

  var DEFAULT_POSTS = [
    { id: 1, tag: 'Branding',     title: 'Identidad de Marca Completa',  text: 'Rediseño integral de identidad visual, sistema de marca y comunicación para empresa de tecnología.',           body: 'El proyecto comenzó con un diagnóstico profundo de la marca existente. Identificamos sus fortalezas, debilidades y oportunidades en el mercado.\n\nDiseñamos un nuevo sistema visual coherente: logotipo, paleta de colores, tipografías y aplicaciones. Cada elemento fue creado para comunicar innovación y confianza.\n\nEl resultado fue una identidad que unificó todas las comunicaciones de la empresa y fortaleció su posición en el sector tecnológico.',                               date: '2024-03-10', image: '' },
    { id: 2, tag: 'Social Media', title: 'Campaña 360°',                 text: 'Estrategia y ejecución multicanal que triplicó el engagement en 3 meses.',                                    body: 'Desarrollamos una estrategia 360° integrando Instagram, Facebook, LinkedIn y TikTok con un calendario editorial unificado.\n\nCreamos contenido nativo para cada plataforma, adaptando el mensaje sin perder la coherencia de marca. Combinamos publicaciones orgánicas con campañas pagadas segmentadas.\n\nEn 90 días el engagement aumentó un 312%, los seguidores crecieron un 85% y las consultas directas se triplicaron.',                                date: '2024-01-22', image: '' },
    { id: 3, tag: 'Contenido',    title: 'Producción Audiovisual',        text: 'Serie de videos institucionales y reels que posicionaron la marca en el top de su categoría.',               body: 'La marca necesitaba contenido audiovisual que conectara emocionalmente con su audiencia y diferenciara sus servicios.\n\nProducimos una serie de 12 videos institucionales y 30 reels optimizados para redes sociales. Cada pieza contó con guion, dirección de arte, filmación y postproducción profesional.\n\nLos videos alcanzaron más de 2 millones de visualizaciones orgánicas en el primer mes, posicionando la marca como referente en su categoría.',     date: '2023-11-15', image: '' },
    { id: 4, tag: 'Publicidad',   title: 'Campaña Meta Ads',             text: 'ROAS de 4.5x con estrategia de segmentación avanzada y creativos de alto impacto.',                           body: 'El cliente buscaba maximizar el retorno de su inversión publicitaria en Meta (Facebook e Instagram) para su línea de productos premium.\n\nDiseñamos una estrategia de segmentación por capas: audiencias frías con contenido educativo, retargeting de interesados y audiencias similares de compradores. Creamos sets de creativos con pruebas A/B sistemáticas.\n\nLogramos un ROAS promedio de 4.5x durante 3 meses consecutivos, con un costo por adquisición 40% menor al benchmark del sector.',                    date: '2023-09-05', image: '' },
    { id: 5, tag: 'Estrategia',   title: 'Plan Anual de Comunicación',   text: 'Hoja de ruta completa de contenidos y campañas para marca de consumo masivo.',                               body: 'Desarrollamos el plan de comunicación anual para una marca de consumo masivo con presencia en tres países.\n\nEl plan incluyó: auditoría de comunicaciones, definición de pilares de contenido, calendario editorial de 52 semanas, planificación de campañas estacionales y presupuesto por canal.\n\nLa ejecución del plan resultó en un crecimiento del 67% en reconocimiento de marca y un aumento del 43% en ventas atribuibles a acciones de marketing.',     date: '2023-07-01', image: '' }
  ];

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

  /** Read stored portfolio posts array */
  function getPosts() {
    try {
      var raw = localStorage.getItem(POSTS_KEY);
      if (!raw) return DEFAULT_POSTS;
      var parsed = JSON.parse(raw);
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : DEFAULT_POSTS;
    } catch (e) {
      return DEFAULT_POSTS;
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
   * Apply the about section logo URL if stored in content.
   */
  function applyAboutLogo(c) {
    var el = document.querySelector('[data-about-logo]');
    if (!el) return;
    var url = c && c.about && c.about.logoUrl ? c.about.logoUrl : '';
    if (url) el.src = url;
  }

  /** Format a YYYY-MM-DD date string to localised Spanish */
  function formatPostDate(dateStr) {
    if (!dateStr) return '';
    try {
      var parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  /**
   * Render portfolio posts as blog cards into #portfolio-posts-grid.
   */
  function renderPortfolioPosts() {
    var grid = document.getElementById('portfolio-posts-grid');
    if (!grid) return;
    var posts = getPosts();
    if (!posts || posts.length === 0) {
      grid.innerHTML = '<p class="blog-empty">Próximamente publicaciones. ¡Vuelve pronto!</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < posts.length; i++) {
      var post     = posts[i];
      var gradient = GRADIENT_COLORS[i % GRADIENT_COLORS.length];
      var imgHtml;
      if (post.image) {
        imgHtml =
          '<div class="blog-card__img-wrap">' +
          '<img src="' + escHtml(post.image) + '" alt="' + escHtml(post.title) + '" class="blog-card__img" loading="lazy" />' +
          '</div>';
      } else {
        imgHtml =
          '<div class="blog-card__img-wrap">' +
          '<div class="blog-card__img blog-card__img--gradient" style="background:' + gradient + '"></div>' +
          '</div>';
      }
      var dateStr = post.date ? formatPostDate(post.date) : '';
      html +=
        '<article class="blog-card" data-post-id="' + post.id + '" tabindex="0" role="button" aria-label="Leer m\u00e1s sobre ' + escHtml(post.title) + '">' +
        imgHtml +
        '<div class="blog-card__body">' +
        '<div class="blog-card__meta">' +
        (post.tag  ? '<span class="blog-card__tag">'  + escHtml(post.tag)  + '</span>' : '') +
        (dateStr   ? '<span class="blog-card__date">' + escHtml(dateStr)   + '</span>' : '') +
        '</div>' +
        '<h3 class="blog-card__title">' + escHtml(post.title) + '</h3>' +
        (post.text ? '<p class="blog-card__excerpt">' + escHtml(post.text) + '</p>' : '') +
        '<button class="blog-card__readmore" tabindex="-1" aria-hidden="true">' +
        'Leer más' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '<polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '</svg>' +
        '</button>' +
        '</div>' +
        '</article>';
    }
    grid.innerHTML = html;

    // Wire up card clicks (click anywhere on card, or Enter/Space on focused card)
    var cards = grid.querySelectorAll('.blog-card[data-post-id]');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function () {
        openBlogModal(parseInt(this.getAttribute('data-post-id'), 10));
      });
      cards[j].addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          openBlogModal(parseInt(this.getAttribute('data-post-id'), 10));
        }
        if (e.key === ' ') { e.preventDefault(); } // prevent page scroll
      });
      cards[j].addEventListener('keyup', function (e) {
        if (e.key === ' ') {
          openBlogModal(parseInt(this.getAttribute('data-post-id'), 10));
        }
      });
    }
  }

  /** Open the blog-post reading modal for a given post id */
  function openBlogModal(id) {
    var posts = getPosts();
    var post  = null;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].id === id) { post = posts[i]; break; }
    }
    if (!post) return;

    var modal        = document.getElementById('blog-modal');
    var modalTag     = document.getElementById('blog-modal-tag');
    var modalDate    = document.getElementById('blog-modal-date');
    var modalTitle   = document.getElementById('blog-modal-title');
    var modalImg     = document.getElementById('blog-modal-img');
    var modalImgWrap = document.getElementById('blog-modal-img-wrap');
    var modalBody    = document.getElementById('blog-modal-body');
    if (!modal) return;

    if (modalTag)   modalTag.textContent   = post.tag   || '';
    if (modalDate)  modalDate.textContent  = post.date  ? formatPostDate(post.date) : '';
    if (modalTitle) modalTitle.textContent = post.title || '';

    if (post.image) {
      if (modalImg)     { modalImg.src = post.image; modalImg.alt = post.title || ''; }
      if (modalImgWrap) modalImgWrap.style.display = '';
    } else {
      if (modalImgWrap) modalImgWrap.style.display = 'none';
    }

    if (modalBody) {
      var raw        = post.body || post.text || '';
      var paragraphs = raw.split(/\n+/);
      var bodyHtml   = '';
      for (var p = 0; p < paragraphs.length; p++) {
        var para = paragraphs[p].trim();
        if (para) bodyHtml += '<p>' + escHtml(para) + '</p>';
      }
      modalBody.innerHTML = bodyHtml || '<p>' + escHtml(post.text || '') + '</p>';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /** Close the blog-post reading modal */
  function closeBlogModal() {
    var modal = document.getElementById('blog-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /** Wire up modal close interactions (called once on init) */
  function initBlogModal() {
    var closeBtn  = document.getElementById('blog-modal-close');
    var backdrop  = document.getElementById('blog-modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeBlogModal);
    if (backdrop) backdrop.addEventListener('click', closeBlogModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeBlogModal();
    });
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
    applyAboutLogo(c);
    renderPortfolioPosts();
    initBlogModal();
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
