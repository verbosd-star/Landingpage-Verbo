/**
 * Verbo Taller – Admin Panel Logic
 * Handles: auth guard, tab navigation, content editor,
 *          section reordering, statistics, settings.
 */
(function () {
  'use strict';

  // ─── Constants ──────────────────────────────────────────────────────────────
  var AUTH_KEY         = 'verbo_admin_auth';
  var PASS_KEY         = 'verbo_admin_password';
  var CONTENT_KEY      = 'verbo_content';
  var ORDER_KEY        = 'verbo_section_order';
  var STATS_KEY        = 'verbo_stats';
  var POSTS_KEY        = 'verbo_portfolio_posts';
  var DEFAULT_PASS     = 'verbo2024';
  var SESSION_DURATION = 8 * 60 * 60 * 1000;

  var DEFAULT_ORDER = [
    'inicio', 'servicios', 'nosotros', 'proceso',
    'portafolio', 'clientes', 'cta', 'contacto'
  ];

  var SECTION_LABELS = {
    'inicio':    'Hero / Inicio',
    'servicios': 'Servicios',
    'nosotros':  'Nosotros',
    'proceso':   'Proceso',
    'portafolio':'Portafolio',
    'clientes':  'Clientes / Testimonios',
    'cta':       'Llamada a la Acción',
    'contacto':  'Contacto'
  };

  var DEFAULT_CONTENT = {
    hero: {
      badge:       'Agencia Creativa · Marketing Digital',
      titleLine1:  'Ideas que',
      titleAccent: 'mueven',
      titleLine2:  'marcas.',
      description: 'En Verbo Taller convertimos estrategia, diseño y creatividad en resultados reales. Somos el equipo que tu marca necesita para hablar fuerte en un mundo ruidoso.',
      btn1:        'Explorar servicios',
      btn2:        'Ver nuestro trabajo',
      stat1Number: '+50',
      stat1Label:  'Marcas impactadas',
      stat2Number: '5+',
      stat2Label:  'Años de experiencia',
      stat3Number: '98%',
      stat3Label:  'Clientes satisfechos'
    },
    services: {
      badge:    'Lo que hacemos',
      title:    'Nuestros Servicios',
      subtitle: 'Ofrecemos soluciones integrales de marketing para que tu marca crezca con intención y estilo.'
    },
    about: {
      badge:        'Quiénes somos',
      title:        'Donde la Acción se Convierte en Marca',
      accentNumber: '10+',
      accentText:   'Años transformando marcas',
      lead:         'En el año 2014, nació Verbo Taller con un propósito claro: darle acción y dinamismo a cada propuesta de comunicación, redes sociales y marketing. No buscábamos solo diseñar campañas, sino conectar con las personas desde la autenticidad y las ideas bien pensadas.',
      text1:        'Todo comenzó en una pequeña oficina, con una sola secretaria —una pasante entusiasta— que nos ayudó a poner orden en aquellos primeros pasos llenos de ilusión. Nuestros primeros clientes fueron amigos cercanos, visionarios que confiaron en nosotros cuando todo era apenas un proyecto. Hoy, una década después, siguen siendo parte de nuestra historia, acompañándonos y creyendo en lo que hacemos.',
      text2:        'Con el tiempo, la vida nos llevó por diferentes caminos. Pero las buenas ideas siempre encuentran su voz. Y así, con más experiencia, más propósito y el mismo espíritu creativo, Verbo Taller volvió a renacer —ahora como una agencia de Marketing Digital y 360°, lista para asumir nuevos retos y evolucionar junto a las marcas que confían en nosotros.',
      pillar1Title: 'Acción y autenticidad',
      pillar1Text:  'Conectamos con las personas desde ideas bien pensadas y comunicación genuina.',
      pillar2Title: 'Fidelidad y confianza',
      pillar2Text:  'Construimos relaciones duraderas; nuestros primeros clientes siguen siendo parte de nuestra historia.',
      pillar3Title: 'Evolución constante',
      pillar3Text:  'Renacemos con más experiencia y propósito, listos para los retos del marketing 360°.'
    },
    process: {
      badge:      'Cómo trabajamos',
      title:      'Nuestro Proceso',
      subtitle:   'Un método probado que convierte tu visión en resultados concretos.',
      step1Title: 'Diagnóstico',
      step1Text:  'Escuchamos, investigamos y entendemos tu marca, tu mercado y tus objetivos a fondo.',
      step2Title: 'Estrategia',
      step2Text:  'Construimos un plan de acción creativo, alineado con tus metas y audiencia.',
      step3Title: 'Ejecución',
      step3Text:  'Producimos, lanzamos y activamos cada pieza con excelencia y atención al detalle.',
      step4Title: 'Medición',
      step4Text:  'Analizamos resultados, aprendemos y optimizamos para maximizar el impacto.'
    },
    portfolio: {
      badge:    'Nuestro trabajo',
      title:    'Casos de Éxito',
      subtitle: 'Proyectos que demuestran que la creatividad + estrategia = resultados.'
    },
    testimonials: {
      badge:    'Lo que dicen',
      title:    'Clientes que confían en nosotros',
      subtitle: 'Las marcas que han trabajado con Verbo Taller hablan por sí solas.',
      t1Quote:  'Verbo Taller entendió nuestra visión desde el primer día. Transformaron nuestra presencia digital por completo — más que una agencia, son parte de nuestro equipo.',
      t1Name:   'María Castro',
      t1Role:   'CEO · TechStart Colombia',
      t2Quote:  'La estrategia de contenidos que diseñaron para nosotros multiplicó nuestro alcance orgánico por 5 en solo cuatro meses. Los resultados hablan.',
      t2Name:   'Andrés Ruiz',
      t2Role:   'Director de Marketing · Grupo Éxito',
      t3Quote:  'El rebranding que hicieron con nuestra empresa superó todas las expectativas. Profesionalismo, creatividad y resultados. Todo en un mismo equipo.',
      t3Name:   'Laura Moreno',
      t3Role:   'Fundadora · Marca Propia Studio',
      t4Quote:  'Nunca pensé que una campaña publicitaria podría cambiar tanto las métricas de mi negocio. Verbo Taller lo hizo posible con creatividad y datos.',
      t4Name:   'Jorge Peña',
      t4Role:   'Gerente Comercial · Retail Plus'
    },
    cta: {
      title: '¿Listo para que tu marca hable más fuerte?',
      text:  'Cuéntanos tu proyecto. Nos encanta empezar con una buena conversación.',
      btn:   'Empezar ahora'
    },
    contact: {
      badge: 'Hablemos',
      title: 'Contáctanos',
      text:  'Estamos listos para escuchar tu proyecto y encontrar la mejor forma de hacerlo realidad. No importa el tamaño de tu marca — cada historia merece ser contada bien.'
    },
    footer: {
      tagline: 'Ideas que mueven marcas.'
    }
  };

  var DEFAULT_POSTS = [
    { id: 1, tag: 'Branding',     title: 'Identidad de Marca Completa',  text: 'Rediseño integral de identidad visual, sistema de marca y comunicación para empresa de tecnología.',           body: 'El proyecto comenzó con un diagnóstico profundo de la marca existente. Identificamos sus fortalezas, debilidades y oportunidades en el mercado.\n\nDiseñamos un nuevo sistema visual coherente: logotipo, paleta de colores, tipografías y aplicaciones. Cada elemento fue creado para comunicar innovación y confianza.\n\nEl resultado fue una identidad que unificó todas las comunicaciones de la empresa y fortaleció su posición en el sector tecnológico.',                               date: '2024-03-10', image: '' },
    { id: 2, tag: 'Social Media', title: 'Campaña 360°',                 text: 'Estrategia y ejecución multicanal que triplicó el engagement en 3 meses.',                                    body: 'Desarrollamos una estrategia 360° integrando Instagram, Facebook, LinkedIn y TikTok con un calendario editorial unificado.\n\nCreamos contenido nativo para cada plataforma, adaptando el mensaje sin perder la coherencia de marca. Combinamos publicaciones orgánicas con campañas pagadas segmentadas.\n\nEn 90 días el engagement aumentó un 312%, los seguidores crecieron un 85% y las consultas directas se triplicaron.',                                date: '2024-01-22', image: '' },
    { id: 3, tag: 'Contenido',    title: 'Producción Audiovisual',        text: 'Serie de videos institucionales y reels que posicionaron la marca en el top de su categoría.',               body: 'La marca necesitaba contenido audiovisual que conectara emocionalmente con su audiencia y diferenciara sus servicios.\n\nProducimos una serie de 12 videos institucionales y 30 reels optimizados para redes sociales. Cada pieza contó con guion, dirección de arte, filmación y postproducción profesional.\n\nLos videos alcanzaron más de 2 millones de visualizaciones orgánicas en el primer mes, posicionando la marca como referente en su categoría.',     date: '2023-11-15', image: '' },
    { id: 4, tag: 'Publicidad',   title: 'Campaña Meta Ads',             text: 'ROAS de 4.5x con estrategia de segmentación avanzada y creativos de alto impacto.',                           body: 'El cliente buscaba maximizar el retorno de su inversión publicitaria en Meta (Facebook e Instagram) para su línea de productos premium.\n\nDiseñamos una estrategia de segmentación por capas: audiencias frías con contenido educativo, retargeting de interesados y audiencias similares de compradores. Creamos sets de creativos con pruebas A/B sistemáticas.\n\nLogramos un ROAS promedio de 4.5x durante 3 meses consecutivos, con un costo por adquisición 40% menor al benchmark del sector.',                    date: '2023-09-05', image: '' },
    { id: 5, tag: 'Estrategia',   title: 'Plan Anual de Comunicación',   text: 'Hoja de ruta completa de contenidos y campañas para marca de consumo masivo.',                               body: 'Desarrollamos el plan de comunicación anual para una marca de consumo masivo con presencia en tres países.\n\nEl plan incluyó: auditoría de comunicaciones, definición de pilares de contenido, calendario editorial de 52 semanas, planificación de campañas estacionales y presupuesto por canal.\n\nLa ejecución del plan resultó en un crecimiento del 67% en reconocimiento de marca y un aumento del 43% en ventas atribuibles a acciones de marketing.',     date: '2023-07-01', image: '' }
  ];

  // ─── Auth Guard ──────────────────────────────────────────────────────────────
  function isAuthenticated() {
    try {
      var session = JSON.parse(localStorage.getItem(AUTH_KEY));
      return session && session.expires > Date.now();
    } catch (e) {
      return false;
    }
  }

  if (!isAuthenticated()) {
    window.location.replace('index.html');
    return;
  }

  // ─── Data helpers ────────────────────────────────────────────────────────────
  function loadContent() {
    try {
      var raw = localStorage.getItem(CONTENT_KEY);
      return raw ? JSON.parse(raw) : deepClone(DEFAULT_CONTENT);
    } catch (e) {
      return deepClone(DEFAULT_CONTENT);
    }
  }

  function saveContent(c) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(c));
  }

  function loadOrder() {
    try {
      var raw = localStorage.getItem(ORDER_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_ORDER.slice();
    } catch (e) {
      return DEFAULT_ORDER.slice();
    }
  }

  function saveOrder(o) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(o));
  }

  function loadStats() {
    try {
      var raw = localStorage.getItem(STATS_KEY);
      return raw ? JSON.parse(raw) : {
        totalVisits: 0, sectionViews: {},
        contactSubmissions: 0, lastVisit: null, visitHistory: []
      };
    } catch (e) {
      return { totalVisits: 0, sectionViews: {}, contactSubmissions: 0, lastVisit: null, visitHistory: [] };
    }
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadPosts() {
    try {
      var raw = localStorage.getItem(POSTS_KEY);
      return raw ? JSON.parse(raw) : deepClone(DEFAULT_POSTS);
    } catch (e) {
      return deepClone(DEFAULT_POSTS);
    }
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function nextPostId(posts) {
    var max = 0;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].id > max) max = posts[i].id;
    }
    return max + 1;
  }

  // ─── Toast notification ──────────────────────────────────────────────────────
  var toastContainer = document.getElementById('toast-container');

  function showToast(message, type) {
    type = type || 'success';
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML =
      (type === 'success' ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>' :
       type === 'error'   ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/></svg>' :
       '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>') +
      '<span>' + escHtml(message) + '</span>';
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Tab navigation ──────────────────────────────────────────────────────────
  var navItems   = document.querySelectorAll('.nav-item[data-tab]');
  var tabPanels  = document.querySelectorAll('.tab-panel');
  var topbarTitle = document.getElementById('topbar-title');

  var TAB_TITLES = {
    overview:    'Resumen',
    content:     'Editor de Contenido',
    sections:    'Orden de Secciones',
    statistics:  'Estadísticas',
    settings:    'Configuración'
  };

  function switchTab(tabId) {
    navItems.forEach(function (n) { n.classList.toggle('active', n.dataset.tab === tabId); });
    tabPanels.forEach(function (p) { p.classList.toggle('active', p.id === 'tab-' + tabId); });
    if (topbarTitle) topbarTitle.textContent = TAB_TITLES[tabId] || tabId;
    // Lazy-render stats when switching to stats tab
    if (tabId === 'statistics') renderStats();
    if (tabId === 'overview')   renderOverview();
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      switchTab(item.dataset.tab);
      closeSidebar();
    });
  });

  // Quick-action nav from overview cards
  document.querySelectorAll('[data-goto-tab]').forEach(function (el) {
    el.addEventListener('click', function () { switchTab(el.dataset.gotoTab); });
  });

  // ─── Mobile sidebar ──────────────────────────────────────────────────────────
  var sidebar        = document.getElementById('sidebar');
  var sidebarOverlay = document.getElementById('sidebar-overlay');
  var menuToggle     = document.getElementById('menu-toggle');

  function openSidebar()  { sidebar.classList.add('open'); sidebarOverlay.classList.add('visible'); }
  function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('visible'); }

  if (menuToggle) menuToggle.addEventListener('click', openSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  var logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem(AUTH_KEY);
      window.location.replace('index.html');
    });
  }

  // ─── Overview Tab ────────────────────────────────────────────────────────────
  function renderOverview() {
    var stats   = loadStats();
    var content = loadContent();
    var order   = loadOrder();

    var el = function (id) { return document.getElementById(id); };

    var v = el('ov-visits');
    if (v) v.textContent = stats.totalVisits || 0;

    var f = el('ov-forms');
    if (f) f.textContent = stats.contactSubmissions || 0;

    var s = el('ov-sections');
    if (s) s.textContent = order.length;

    var lu = el('ov-last-update');
    if (lu) lu.textContent = stats.lastVisit ? formatDate(stats.lastVisit) : 'Nunca';

    // Today visits
    var today     = new Date().toISOString().split('T')[0];
    var todayData = (stats.visitHistory || []).find(function (v) { return v.date === today; });
    var ot = el('ov-today');
    if (ot) ot.textContent = todayData ? todayData.count : 0;
  }

  // ─── Content Editor Tab ──────────────────────────────────────────────────────
  var editorPanels   = document.querySelectorAll('.editor-panel');
  var sectionNavBtns = document.querySelectorAll('.section-nav__item');

  function switchEditorSection(sectionId) {
    sectionNavBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.section === sectionId);
    });
    editorPanels.forEach(function (p) {
      p.classList.toggle('active', p.dataset.section === sectionId);
    });
  }

  sectionNavBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { switchEditorSection(btn.dataset.section); });
  });

  // Populate all editor forms with current content
  function populateEditors() {
    var c = loadContent();
    document.querySelectorAll('[data-field]').forEach(function (input) {
      var key   = input.getAttribute('data-field');
      var parts = key.split('.');
      var val   = c;
      for (var i = 0; i < parts.length; i++) {
        if (val == null) { val = null; break; }
        val = val[parts[i]];
      }
      if (val != null) input.value = val;
    });
  }

  // Save a section's editor form
  function saveSection(sectionId) {
    var c = loadContent();
    var panel = document.querySelector('.editor-panel[data-section="' + sectionId + '"]');
    if (!panel) return;

    panel.querySelectorAll('[data-field]').forEach(function (input) {
      var key   = input.getAttribute('data-field');
      var parts = key.split('.');
      var obj   = c;
      for (var i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] == null) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = input.value;
    });

    saveContent(c);
    showToast('Sección guardada exitosamente ✓', 'success');
  }

  // Attach save buttons in editor panels
  document.querySelectorAll('[data-save-section]').forEach(function (btn) {
    btn.addEventListener('click', function () { saveSection(btn.dataset.saveSection); });
  });

  // ─── Section Order Tab ───────────────────────────────────────────────────────
  var sortableList  = document.getElementById('sortable-list');
  var currentOrder  = loadOrder();
  var dragSrcIndex  = null;

  function renderSortableList() {
    sortableList.innerHTML = '';
    currentOrder.forEach(function (id, idx) {
      var li = document.createElement('li');
      li.className = 'sortable-item';
      li.setAttribute('draggable', 'true');
      li.setAttribute('data-id', id);
      li.innerHTML =
        '<span class="sortable-item__handle">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
            '<line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>' +
            '<line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>' +
            '<line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>' +
            '<line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
            '<line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
            '<line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
          '</svg>' +
        '</span>' +
        '<span class="sortable-item__num">' + (idx + 1) + '</span>' +
        '<span class="sortable-item__label">' + escHtml(SECTION_LABELS[id] || id) + '</span>' +
        '<span class="sortable-item__id">#' + escHtml(id) + '</span>';

      li.addEventListener('dragstart', function () {
        dragSrcIndex = currentOrder.indexOf(id);
        li.classList.add('dragging');
      });
      li.addEventListener('dragend', function () { li.classList.remove('dragging'); });
      li.addEventListener('dragover', function (e) {
        e.preventDefault();
        document.querySelectorAll('.sortable-item').forEach(function (i) {
          i.classList.remove('drag-over');
        });
        li.classList.add('drag-over');
      });
      li.addEventListener('dragleave', function () { li.classList.remove('drag-over'); });
      li.addEventListener('drop', function (e) {
        e.preventDefault();
        li.classList.remove('drag-over');
        var targetIndex = currentOrder.indexOf(id);
        if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
          var moved = currentOrder.splice(dragSrcIndex, 1)[0];
          currentOrder.splice(targetIndex, 0, moved);
          renderSortableList();
        }
      });

      sortableList.appendChild(li);
    });
  }

  renderSortableList();

  var saveOrderBtn  = document.getElementById('save-order-btn');
  var resetOrderBtn = document.getElementById('reset-order-btn');

  if (saveOrderBtn) {
    saveOrderBtn.addEventListener('click', function () {
      saveOrder(currentOrder);
      showToast('Orden de secciones guardado ✓', 'success');
    });
  }

  if (resetOrderBtn) {
    resetOrderBtn.addEventListener('click', function () {
      currentOrder = DEFAULT_ORDER.slice();
      renderSortableList();
      showToast('Orden restablecido al predeterminado', 'info');
    });
  }

  // ─── Statistics Tab ──────────────────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('es-DO', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return iso; }
  }

  function formatDateShort(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('es-DO', { month: 'short', day: 'numeric' });
    } catch (e) { return iso; }
  }

  function renderStats() {
    var stats = loadStats();

    // Summary cards
    var sv = document.getElementById('st-total');
    if (sv) sv.textContent = stats.totalVisits || 0;

    var sf = document.getElementById('st-forms');
    if (sf) sf.textContent = stats.contactSubmissions || 0;

    var today     = new Date().toISOString().split('T')[0];
    var todayData = (stats.visitHistory || []).find(function (v) { return v.date === today; });
    var st = document.getElementById('st-today');
    if (st) st.textContent = todayData ? todayData.count : 0;

    var slv = document.getElementById('st-last-visit');
    if (slv) slv.textContent = formatDate(stats.lastVisit);

    // Section views bar chart
    var barChart = document.getElementById('section-bar-chart');
    if (barChart) {
      var views   = stats.sectionViews || {};
      var maxView = Math.max.apply(null, Object.values(views).concat([1]));
      barChart.innerHTML = '';
      DEFAULT_ORDER.forEach(function (id) {
        var count = views[id] || 0;
        var pct   = Math.round((count / maxView) * 100);
        var div   = document.createElement('div');
        div.className = 'bar-item';
        div.innerHTML =
          '<span class="bar-item__label">' + escHtml(SECTION_LABELS[id] || id) + '</span>' +
          '<div class="bar-item__track"><div class="bar-item__fill" style="width:' + pct + '%"></div></div>' +
          '<span class="bar-item__count">' + count + '</span>';
        barChart.appendChild(div);
      });
    }

    // Visit history mini chart
    var histChart = document.getElementById('visit-history-chart');
    if (histChart) {
      var history = stats.visitHistory || [];
      var maxCount = Math.max.apply(null, history.map(function (v) { return v.count; }).concat([1]));
      histChart.innerHTML = '';
      history.forEach(function (entry) {
        var heightPct = Math.max(4, Math.round((entry.count / maxCount) * 100));
        var bar = document.createElement('div');
        bar.className = 'visit-bar';
        bar.style.height = heightPct + '%';
        bar.setAttribute('data-tooltip', entry.date + ': ' + entry.count);
        histChart.appendChild(bar);
      });
      if (history.length === 0) {
        histChart.innerHTML = '<p style="color:var(--admin-text-dim);font-size:0.8rem;text-align:center;padding:1rem 0">Sin datos aún</p>';
      }
    }

    // Visit dates labels (first/last)
    var history    = stats.visitHistory || [];
    var firstLabel = document.getElementById('hist-first');
    var lastLabel  = document.getElementById('hist-last');
    if (firstLabel) firstLabel.textContent = history.length ? formatDateShort(history[0].date) : '';
    if (lastLabel)  lastLabel.textContent  = history.length ? formatDateShort(history[history.length - 1].date) : '';
  }

  // ─── Settings Tab ────────────────────────────────────────────────────────────

  // Change password
  var changePassForm = document.getElementById('change-pass-form');
  if (changePassForm) {
    changePassForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var current = document.getElementById('current-pass').value;
      var next1   = document.getElementById('new-pass').value;
      var next2   = document.getElementById('new-pass-confirm').value;
      var errEl   = document.getElementById('pass-error');
      var okEl    = document.getElementById('pass-success');

      errEl.classList.remove('visible');
      okEl.classList.remove('visible');

      if (!current || !next1 || !next2) {
        errEl.textContent = 'Todos los campos son obligatorios.';
        errEl.classList.add('visible');
        return;
      }
      if (next1 !== next2) {
        errEl.textContent = 'Las nuevas contraseñas no coinciden.';
        errEl.classList.add('visible');
        return;
      }
      if (next1.length < 8) {
        errEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        errEl.classList.add('visible');
        return;
      }

      try {
        var storedHash  = localStorage.getItem(PASS_KEY) || await hashPassword(DEFAULT_PASS);
        var currentHash = await hashPassword(current);
        if (currentHash !== storedHash) {
          errEl.textContent = 'La contraseña actual es incorrecta.';
          errEl.classList.add('visible');
          return;
        }
        var newHash = await hashPassword(next1);
        localStorage.setItem(PASS_KEY, newHash);
        changePassForm.reset();
        okEl.classList.add('visible');
        showToast('Contraseña cambiada exitosamente ✓', 'success');
      } catch (err) {
        errEl.textContent = 'Error al cambiar la contraseña.';
        errEl.classList.add('visible');
      }
    });
  }

  // Reset content to defaults
  var resetContentBtn = document.getElementById('reset-content-btn');
  if (resetContentBtn) {
    resetContentBtn.addEventListener('click', function () {
      if (!confirm('¿Estás seguro de que deseas restablecer todo el contenido (incluyendo publicaciones del portafolio) a los valores predeterminados? Esta acción no se puede deshacer.')) return;
      localStorage.removeItem(CONTENT_KEY);
      localStorage.removeItem(POSTS_KEY);
      populateEditors();
      renderPostsList();
      showToast('Contenido restablecido a los valores predeterminados', 'info');
    });
  }

  // Reset section order
  var resetOrderSettingsBtn = document.getElementById('reset-order-settings-btn');
  if (resetOrderSettingsBtn) {
    resetOrderSettingsBtn.addEventListener('click', function () {
      if (!confirm('¿Restablecer el orden de las secciones al predeterminado?')) return;
      localStorage.removeItem(ORDER_KEY);
      currentOrder = DEFAULT_ORDER.slice();
      renderSortableList();
      showToast('Orden restablecido', 'info');
    });
  }

  // Clear statistics
  var clearStatsBtn = document.getElementById('clear-stats-btn');
  if (clearStatsBtn) {
    clearStatsBtn.addEventListener('click', function () {
      if (!confirm('¿Eliminar todas las estadísticas? Esta acción no se puede deshacer.')) return;
      localStorage.removeItem(STATS_KEY);
      renderStats();
      renderOverview();
      showToast('Estadísticas eliminadas', 'info');
    });
  }

  // Export data
  var exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var data = {
        content:  loadContent(),
        order:    loadOrder(),
        stats:    loadStats(),
        posts:    loadPosts(),
        exported: new Date().toISOString()
      };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href   = url;
      a.download = 'verbo-admin-backup-' + new Date().toISOString().split('T')[0] + '.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Datos exportados ✓', 'success');
    });
  }

  // ─── Password hash helper ────────────────────────────────────────────────────
  async function hashPassword(pw) {
    var data   = new TextEncoder().encode(pw);
    var buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  // ─── Portfolio Posts Manager ─────────────────────────────────────────────────
  var postsList    = document.getElementById('posts-list');
  var addPostBtn   = document.getElementById('add-post-btn');
  var newPostTag   = document.getElementById('new-post-tag');
  var newPostTitle = document.getElementById('new-post-title');
  var newPostDate  = document.getElementById('new-post-date');
  var newPostText  = document.getElementById('new-post-text');
  var newPostBody  = document.getElementById('new-post-body');
  var newPostImage = document.getElementById('new-post-image');
  var newPostPreview    = document.getElementById('new-post-preview');
  var newPostPreviewImg = document.getElementById('new-post-preview-img');
  var pendingPostImage  = '';

  function renderPostsList() {
    if (!postsList) return;
    var posts = loadPosts();
    if (posts.length === 0) {
      postsList.innerHTML = '<p style="color:var(--admin-text-dim);font-size:0.85rem;text-align:center;padding:0.75rem 0">Sin publicaciones. Agrega la primera abajo.</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < posts.length; i++) {
      var p = posts[i];
      var thumb = p.image
        ? '<img src="' + escHtml(p.image) + '" alt="" style="width:52px;height:52px;object-fit:cover;border-radius:6px;flex-shrink:0;" />'
        : '<div style="width:52px;height:52px;border-radius:6px;background:var(--admin-border);flex-shrink:0;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.5"/></svg></div>';
      html +=
        '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0;border-bottom:1px solid var(--admin-border);">' +
        thumb +
        '<div style="flex:1;min-width:0;">' +
        '<p style="font-size:0.82rem;font-weight:600;color:var(--admin-text);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(p.title) + '</p>' +
        '<p style="font-size:0.75rem;color:var(--admin-text-muted);margin:2px 0 0;">' + escHtml(p.tag) + (p.date ? ' · ' + escHtml(p.date) : '') + '</p>' +
        '</div>' +
        '<button class="btn btn-danger btn-sm" data-delete-post="' + p.id + '" style="flex-shrink:0;">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        'Eliminar' +
        '</button>' +
        '</div>';
    }
    postsList.innerHTML = html;

    postsList.querySelectorAll('[data-delete-post]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id   = parseInt(btn.getAttribute('data-delete-post'), 10);
        var psts = loadPosts();
        var idx  = -1;
        for (var k = 0; k < psts.length; k++) {
          if (psts[k].id === id) { idx = k; break; }
        }
        if (idx > -1) {
          psts.splice(idx, 1);
          savePosts(psts);
          renderPostsList();
          showToast('Publicación eliminada ✓', 'success');
        }
      });
    });
  }

  if (newPostImage) {
    newPostImage.addEventListener('change', function () {
      var file = newPostImage.files[0];
      if (!file) { pendingPostImage = ''; newPostPreview.style.display = 'none'; return; }
      if (file.size > 2 * 1024 * 1024) {
        showToast('La imagen supera 2 MB. Elige una imagen más pequeña.', 'error');
        newPostImage.value = '';
        pendingPostImage = '';
        newPostPreview.style.display = 'none';
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        pendingPostImage = e.target.result;
        newPostPreviewImg.src = pendingPostImage;
        newPostPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  if (addPostBtn) {
    addPostBtn.addEventListener('click', function () {
      var tag   = newPostTag   ? newPostTag.value.trim()   : '';
      var title = newPostTitle ? newPostTitle.value.trim() : '';
      var date  = newPostDate  ? newPostDate.value.trim()  : '';
      var text  = newPostText  ? newPostText.value.trim()  : '';
      var body  = newPostBody  ? newPostBody.value.trim()  : '';
      if (!title) {
        showToast('El título es obligatorio', 'error');
        return;
      }
      var posts = loadPosts();
      posts.push({
        id:    nextPostId(posts),
        tag:   tag,
        title: title,
        date:  date,
        text:  text,
        body:  body,
        image: pendingPostImage
      });
      savePosts(posts);
      renderPostsList();
      if (newPostTag)   newPostTag.value   = '';
      if (newPostTitle) newPostTitle.value = '';
      if (newPostDate)  newPostDate.value  = '';
      if (newPostText)  newPostText.value  = '';
      if (newPostBody)  newPostBody.value  = '';
      if (newPostImage) newPostImage.value = '';
      pendingPostImage = '';
      if (newPostPreview) newPostPreview.style.display = 'none';
      showToast('Publicación agregada ✓', 'success');
    });
  }

  // ─── About Logo Manager ──────────────────────────────────────────────────────
  var aboutLogoUrl        = document.getElementById('about-logo-url');
  var aboutLogoFile       = document.getElementById('about-logo-file');
  var aboutLogoPreview    = document.getElementById('about-logo-preview');
  var aboutLogoPreviewImg = document.getElementById('about-logo-preview-img');
  var saveAboutLogoBtn    = document.getElementById('save-about-logo-btn');
  var pendingAboutLogo    = '';

  // Populate the about logo URL field
  (function () {
    var c = loadContent();
    if (aboutLogoUrl && c.about && c.about.logoUrl) {
      aboutLogoUrl.value = c.about.logoUrl;
    }
  })();

  if (aboutLogoFile) {
    aboutLogoFile.addEventListener('change', function () {
      var file = aboutLogoFile.files[0];
      if (!file) { pendingAboutLogo = ''; aboutLogoPreview.style.display = 'none'; return; }
      if (file.size > 2 * 1024 * 1024) {
        showToast('La imagen supera 2 MB. Elige una imagen más pequeña.', 'error');
        aboutLogoFile.value = '';
        pendingAboutLogo = '';
        aboutLogoPreview.style.display = 'none';
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        pendingAboutLogo = e.target.result;
        aboutLogoPreviewImg.src = pendingAboutLogo;
        aboutLogoPreview.style.display = 'block';
        if (aboutLogoUrl) aboutLogoUrl.value = '';
      };
      reader.readAsDataURL(file);
    });
  }

  if (saveAboutLogoBtn) {
    saveAboutLogoBtn.addEventListener('click', function () {
      var logoSrc = pendingAboutLogo || (aboutLogoUrl ? aboutLogoUrl.value.trim() : '');
      var c = loadContent();
      if (!c.about) c.about = {};
      c.about.logoUrl = logoSrc;
      saveContent(c);
      showToast('Logo guardado ✓', 'success');
    });
  }

  // ─── Init ────────────────────────────────────────────────────────────────────
  populateEditors();
  renderOverview();
  renderPostsList();

})();
