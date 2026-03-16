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
      if (!confirm('¿Estás seguro de que deseas restablecer todo el contenido a los valores predeterminados? Esta acción no se puede deshacer.')) return;
      localStorage.removeItem(CONTENT_KEY);
      populateEditors();
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

  // ─── Init ────────────────────────────────────────────────────────────────────
  populateEditors();
  renderOverview();

})();
