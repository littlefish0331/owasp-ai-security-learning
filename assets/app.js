/* app.js — 導覽、進度、Mermaid 載入、測驗引擎
   純 JavaScript：無框架、無 ES module、不使用 fetch，可直接以 file:// 開啟。
   各頁 <body> 需帶：
     data-root  到專案根目錄的相對路徑（根目錄頁面為空字串，主題頁為 "../../"）
     data-stage 階段資料夾名稱（例如 "01-overview"）；共用頁面省略
     data-topic 主題資料夾名稱（例如 "ai-exchange"）；共用頁面省略
     data-page  本頁檔名（例如 "01-position.html"）
   向下相容：新增主題只需在 sitemap.js 登記，不必修改本檔。 */
(function () {
  'use strict';

  var SITE = window.OWASP_SITE || { stages: [], shared: [] };
  var doc = document, body = doc.body, root = doc.documentElement;
  var ROOT = body.getAttribute('data-root') || '';
  var CUR = {
    stage: body.getAttribute('data-stage') || '',
    topic: body.getAttribute('data-topic') || '',
    page: body.getAttribute('data-page') || ''
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ---------- 進度儲存：localStorage 失敗時退回記憶體，不影響使用 ---------- */
  var Store = (function () {
    var KEY = 'owaspai-learning:v1', mem = {}, ok = false;
    try {
      var k = '__owaspai_probe__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      ok = true;
    } catch (e) { ok = false; }
    function read() {
      if (ok) {
        try {
          var s = window.localStorage.getItem(KEY);
          if (s) { var o = JSON.parse(s); if (o && typeof o === 'object') return o; }
        } catch (e) { /* 忽略 */ }
        return {};
      }
      return mem;
    }
    function write(o) {
      mem = o;
      if (ok) { try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { ok = false; } }
    }
    return {
      get: function (path, def) {
        var o = read();
        for (var i = 0; i < path.length; i++) {
          if (o === null || typeof o !== 'object' || !(path[i] in o)) return def;
          o = o[path[i]];
        }
        return o;
      },
      set: function (path, val) {
        var o = read(), c = o;
        for (var i = 0; i < path.length - 1; i++) {
          if (typeof c[path[i]] !== 'object' || c[path[i]] === null) c[path[i]] = {};
          c = c[path[i]];
        }
        c[path[path.length - 1]] = val;
        write(o);
      },
      persistent: function () { return ok; }
    };
  })();

  /* ---------- 外觀偏好（淺色／深色／字級） ---------- */
  function applyPrefs() {
    var t = Store.get(['pref', 'theme'], 'auto');
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    var f = Store.get(['pref', 'font'], 'm');
    if (f === 's' || f === 'l' || f === 'xl') root.setAttribute('data-font', f); else root.removeAttribute('data-font');
  }
  applyPrefs();

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    try { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; }
  }

  /* ---------- 站台資料輔助 ---------- */
  function topicHref(stage, topic, file) { return ROOT + stage.dir + '/' + topic.id + '/' + file; }
  function findCurrent() {
    for (var i = 0; i < SITE.stages.length; i++) {
      var st = SITE.stages[i];
      for (var j = 0; j < st.topics.length; j++) {
        if (st.dir === CUR.stage && st.topics[j].id === CUR.topic) return { stage: st, topic: st.topics[j] };
      }
    }
    return null;
  }
  function pageKey(stage, topic, file) { return stage.dir + '/' + topic.id + '/' + file; }
  function currentKey() {
    var c = findCurrent();
    return c ? pageKey(c.stage, c.topic, CUR.page) : CUR.page;
  }
  function isVisited(key) { return !!Store.get(['visited', key], false); }
  function pageTitleFor(c) {
    if (c) {
      for (var i = 0; i < c.topic.pages.length; i++) if (c.topic.pages[i].file === CUR.page) return c.topic.pages[i].title;
    } else {
      for (var j = 0; j < SITE.shared.length; j++) if (SITE.shared[j].file === CUR.page) return SITE.shared[j].title;
    }
    return doc.title;
  }

  /* ---------- 頁首 ---------- */
  function buildHeader() {
    var h = $('#site-header');
    if (!h) return;
    h.className = 'site-header';
    h.innerHTML =
      '<div class="bar">' +
      '<button type="button" id="nav-toggle" class="hbtn" aria-expanded="false" aria-controls="site-nav">目錄</button>' +
      '<a class="site-title" href="' + ROOT + 'index.html">' + esc(SITE.siteTitle || 'OWASP AI 資安學習教材') +
      '<small>' + esc(SITE.subtitle || '') + '</small></a>' +
      '<nav class="hlinks" aria-label="快速連結">' +
      '<a href="' + ROOT + 'index.html">首頁</a>' +
      '<a href="' + ROOT + 'primer-security-for-developers.html">前置觀念</a>' +
      '<a href="' + ROOT + 'glossary.html">詞彙表</a></nav>' +
      '<button type="button" id="theme-btn" class="hbtn" title="切換淺色／深色">外觀</button>' +
      '<button type="button" id="font-btn" class="hbtn" title="調整字級">字級</button>' +
      '</div>';
    var tb = $('#theme-btn'), fb = $('#font-btn'), nb = $('#nav-toggle');
    function themeLabel() {
      var t = Store.get(['pref', 'theme'], 'auto');
      tb.textContent = '外觀：' + (t === 'light' ? '淺色' : t === 'dark' ? '深色' : '自動');
    }
    function fontLabel() {
      var f = Store.get(['pref', 'font'], 'm');
      fb.textContent = '字級：' + ({ s: '小', m: '中', l: '大', xl: '特大' }[f] || '中');
    }
    themeLabel(); fontLabel();
    tb.addEventListener('click', function () {
      var order = ['auto', 'light', 'dark'], t = Store.get(['pref', 'theme'], 'auto');
      Store.set(['pref', 'theme'], order[(order.indexOf(t) + 1) % order.length]);
      applyPrefs(); themeLabel(); renderDiagrams();
    });
    fb.addEventListener('click', function () {
      var order = ['s', 'm', 'l', 'xl'], f = Store.get(['pref', 'font'], 'm');
      Store.set(['pref', 'font'], order[(order.indexOf(f) + 1) % order.length]);
      applyPrefs(); fontLabel();
    });
    nb.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      nb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- 頁尾署名（sitemap.js 有 author 才顯示；沒有 JavaScript 時，首頁與 README 有靜態版本） ---------- */
  function buildCredit() {
    if (!SITE.author) return;
    var inner = $('.site-footer .inner');
    if (!inner || $('.site-credit', inner)) return;
    var p = doc.createElement('p');
    p.className = 'site-credit';
    p.textContent = '作者：' + SITE.author + (SITE.updated ? '・' + SITE.updated : '');
    inner.appendChild(p);
  }

  /* ---------- 麵包屑 ---------- */
  function buildBreadcrumb() {
    var el = $('#breadcrumb');
    if (!el) return;
    var c = findCurrent(), items = [];
    items.push('<a href="' + ROOT + 'index.html">首頁</a>');
    if (c) {
      items.push('<span>' + esc(c.stage.id + ' ' + c.stage.title) + '</span>');
      if (CUR.page === 'index.html') {
        items.push('<span aria-current="page">' + esc(c.topic.title) + '</span>');
      } else {
        items.push('<a href="' + topicHref(c.stage, c.topic, 'index.html') + '">' + esc(c.topic.title) + '</a>');
        items.push('<span aria-current="page">' + esc(pageTitleFor(c)) + '</span>');
      }
    } else if (CUR.page !== 'index.html') {
      items.push('<span aria-current="page">' + esc(pageTitleFor(null)) + '</span>');
    }
    el.className = 'breadcrumb';
    el.setAttribute('aria-label', '麵包屑');
    el.innerHTML = '<ol><li>' + items.join('</li><li>') + '</li></ol>';
  }

  /* ---------- 全站目錄（依 01–07） ---------- */
  function buildNav() {
    var nav = $('#site-nav');
    if (!nav) return;
    var cur = findCurrent(), h = '';
    function cls(file, shared) { return (shared && CUR.page === file && !cur) ? ' aria-current="page"' : ''; }
    h += '<div class="nav-root"><a href="' + ROOT + 'index.html"' + cls('index.html', true) + '>首頁・學習地圖</a>';
    for (var s = 0; s < SITE.shared.length; s++) {
      var sh = SITE.shared[s];
      if (sh.file === 'index.html') continue;
      h += '<a href="' + ROOT + sh.file + '"' + cls(sh.file, true) + '>' + esc(sh.title) +
        (isVisited(sh.file) ? ' <span class="visited-mark" aria-label="已讀">✓</span>' : '') + '</a>';
    }
    h += '</div>';
    for (var i = 0; i < SITE.stages.length; i++) {
      var st = SITE.stages[i], open = cur && cur.stage === st;
      h += '<details' + (open ? ' open' : '') + '><summary>' + esc(st.id + ' ' + st.title) + '</summary><ul>';
      for (var j = 0; j < st.topics.length; j++) {
        var tp = st.topics[j];
        if (tp.status !== 'available' || !tp.pages) {
          h += '<li><span class="planned">' + esc(tp.title) + ' · 規劃中</span></li>';
          continue;
        }
        h += '<li><span class="nav-topic">' + esc(tp.title) + '</span><ol class="nav-pages">';
        for (var k = 0; k < tp.pages.length; k++) {
          var pg = tp.pages[k], key = pageKey(st, tp, pg.file);
          var here = cur && cur.topic === tp && CUR.page === pg.file;
          h += '<li><a href="' + topicHref(st, tp, pg.file) + '"' + (here ? ' aria-current="page"' : '') + '>' +
            esc(pg.title) + (isVisited(key) ? ' <span class="visited-mark" aria-label="已讀">✓</span>' : '') + '</a></li>';
        }
        h += '</ol></li>';
      }
      h += '</ul></details>';
    }
    nav.setAttribute('aria-label', '全站目錄');
    nav.innerHTML = h;
  }

  /* ---------- 本頁小節目錄 ---------- */
  function buildToc() {
    var art = $('article');
    if (!art) return;
    var hs = $$('h2[id], h3[id]', art).filter(function (n) { return !n.closest('.quiz-embedded-skip'); });
    var aside = $('#page-toc');
    if (hs.length < 2) {
      if (aside) aside.style.display = 'none';
      var lay = $('.layout'); if (lay) lay.classList.add('no-toc');
      return;
    }
    var li = hs.map(function (n) {
      return '<li class="' + (n.tagName === 'H3' ? 'l3' : 'l2') + '"><a href="#' + n.id + '">' + esc(n.textContent.replace(/^\s+|\s+$/g, '')) + '</a></li>';
    }).join('');
    if (aside) { aside.setAttribute('aria-label', '本頁小節目錄'); aside.innerHTML = '<h2>本頁小節</h2><ol>' + li + '</ol>'; }
    var h1 = $('h1', art);
    if (h1 && !$('.toc-inline', art)) {
      var d = doc.createElement('details');
      d.className = 'toc-inline';
      d.innerHTML = '<summary>本頁小節</summary><ol>' + hs.map(function (n) {
        return '<li><a href="#' + n.id + '">' + esc(n.textContent.replace(/^\s+|\s+$/g, '')) + '</a></li>';
      }).join('') + '</ol>';
      var anchor = h1.nextElementSibling;
      while (anchor && (anchor.classList.contains('meta-row') || anchor.classList.contains('lead'))) anchor = anchor.nextElementSibling;
      if (anchor) anchor.parentNode.insertBefore(d, anchor); else art.appendChild(d);
    }
    if (aside && 'IntersectionObserver' in window) {
      try {
        var links = {};
        $$('a', aside).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              $$('a.on', aside).forEach(function (x) { x.classList.remove('on'); });
              if (links[e.target.id]) links[e.target.id].classList.add('on');
            }
          });
        }, { rootMargin: '-10% 0px -80% 0px' });
        hs.forEach(function (n) { io.observe(n); });
      } catch (e) { /* 忽略 */ }
    }
  }

  /* ---------- 上一頁／下一頁 ---------- */
  function buildPager() {
    var el = $('#pager');
    if (!el) return;
    var c = findCurrent();
    if (!c || !c.topic.pages) return;
    var pages = c.topic.pages, idx = -1, i;
    for (i = 0; i < pages.length; i++) if (pages[i].file === CUR.page) idx = i;
    if (idx < 0) return;
    var h = '';
    if (idx > 0) {
      h += '<a class="prev" rel="prev" href="' + pages[idx - 1].file + '"><span class="dir">← 上一頁</span>' + esc(pages[idx - 1].title) + '</a>';
    }
    if (idx < pages.length - 1) {
      h += '<a class="next" rel="next" href="' + pages[idx + 1].file + '"><span class="dir">下一頁 →</span>' + esc(pages[idx + 1].title) + '</a>';
    } else {
      h += '<a class="next" href="' + ROOT + 'index.html"><span class="dir">回到</span>首頁・學習地圖</a>';
    }
    el.className = 'pager';
    el.setAttribute('aria-label', '上一頁／下一頁');
    el.innerHTML = h;
  }

  /* ---------- 已讀紀錄與進度顯示 ---------- */
  function markVisited() { Store.set(['visited', currentKey()], new Date().getTime()); }

  function quizRecord(topicId, qid) { return Store.get(['quiz', topicId, qid], null); }

  function renderTopicProgress() {
    var el = $('#topic-progress');
    if (!el) return;
    var c = findCurrent();
    if (!c) return;
    var done = 0, total = 0, rows = '';
    c.topic.pages.forEach(function (p) {
      total++;
      if (isVisited(pageKey(c.stage, c.topic, p.file))) done++;
    });
    $$('[data-quiz-id]', doc).forEach(function (n) {
      var r = quizRecord(c.topic.id, n.getAttribute('data-quiz-id'));
      n.textContent = r ? ('上次記錄：' + r.ok + ' / ' + r.total + ' 題答對') : '尚未作答';
    });
    var fin = quizRecord(c.topic.id, 'final');
    rows += '<li>已開啟頁面：' + done + ' / ' + total + '</li>';
    rows += '<li>總測驗：' + (fin ? ('最近一次 ' + fin.score + ' / ' + fin.total + '（' + Math.round(100 * fin.score / fin.total) + '%）') : '尚未完成') + '</li>';
    el.innerHTML = '<div class="progress-box"><strong>我的進度</strong><ul>' + rows + '</ul>' +
      '<p class="q-meta">' + (Store.persistent() ? '進度儲存在此瀏覽器的 localStorage。' :
        '此環境無法使用 localStorage，進度只在本次瀏覽期間保留；不影響閱讀與測驗。') + '</p></div>';
    $$('.p-state[data-file]').forEach(function (n) {
      var v = isVisited(pageKey(c.stage, c.topic, n.getAttribute('data-file')));
      n.textContent = v ? '✓ 已開啟' : '未開啟';
      n.className = 'p-state' + (v ? ' done' : '');
    });
  }

  function buildHomeMap() {
    var el = $('#home-map');
    if (!el) return;
    var h = '<div class="stage-grid">';
    SITE.stages.forEach(function (st) {
      h += '<section class="stage" aria-labelledby="st-' + st.id + '"><h3 id="st-' + st.id + '">' + esc(st.id + ' ' + st.title) +
        '</h3><p class="stage-desc">' + esc(st.desc) + '</p><ul class="topic-list">';
      st.topics.forEach(function (tp) {
        var avail = tp.status === 'available' && tp.pages;
        h += '<li' + (avail ? ' class="available"' : '') + '>';
        if (avail) {
          var done = 0;
          tp.pages.forEach(function (p) { if (isVisited(pageKey(st, tp, p.file))) done++; });
          var fin = quizRecord(tp.id, 'final');
          h += '<a class="t-title" href="' + topicHref(st, tp, 'index.html') + '">' + esc(tp.title) + '</a>' +
            '<span class="t-sum">' + esc(tp.summary) + '</span>' +
            '<span class="status available">可學習</span> <span class="t-sum">已開啟 ' + done + ' / ' + tp.pages.length + ' 頁' +
            (fin ? '・總測驗 ' + fin.score + ' / ' + fin.total : '') + '</span>';
        } else {
          h += '<span class="t-title">' + esc(tp.title) + '</span><span class="t-sum">' + esc(tp.summary) + '</span>' +
            '<span class="status planned">規劃中</span>';
        }
        h += '</li>';
      });
      h += '</ul></section>';
    });
    el.innerHTML = h + '</div>';
  }

  /* ---------- 詞彙表搜尋 ---------- */
  function wireGlossary() {
    var inp = $('#gl-filter'), rows = $$('#gl-table tbody tr');
    if (!inp || !rows.length) return;
    var cnt = $('#gl-count');
    function run() {
      var q = inp.value.replace(/^\s+|\s+$/g, '').toLowerCase(), n = 0;
      rows.forEach(function (r) {
        var hit = !q || r.textContent.toLowerCase().indexOf(q) >= 0;
        r.classList.toggle('hidden', !hit);
        if (hit) n++;
      });
      if (cnt) cnt.textContent = '顯示 ' + n + ' / ' + rows.length + ' 筆';
    }
    inp.addEventListener('input', run); run();
  }

  /* ---------- Mermaid（本地副本；缺少時顯示明確提示） ---------- */
  var mmdCounter = 0;
  function renderDiagrams() {
    var nodes = $$('pre.mermaid');
    if (!nodes.length) return;
    nodes.forEach(function (n) {
      if (!n.hasAttribute('data-src')) n.setAttribute('data-src', n.textContent);
      var old = n.parentNode.querySelector('.diagram-fallback');
      if (old) old.parentNode.removeChild(old);
    });
    if (!window.mermaid) {
      nodes.forEach(function (n) {
        var p = doc.createElement('p');
        p.className = 'diagram-fallback';
        p.textContent = '圖表無法顯示：未載入 assets/vendor/mermaid.min.js。請改讀圖下方的文字說明。';
        n.parentNode.insertBefore(p, n.nextSibling);
      });
      return;
    }
    try {
      window.mermaid.initialize({
        startOnLoad: false, securityLevel: 'strict', theme: isDark() ? 'dark' : 'neutral',
        fontFamily: window.getComputedStyle(body).fontFamily,
        flowchart: { htmlLabels: true, useMaxWidth: true, curve: 'basis' },
        sequence: { useMaxWidth: true }
      });
    } catch (e) { /* 忽略 */ }
    nodes.forEach(function (n) {
      var src = n.getAttribute('data-src'), id = 'mmd-' + (++mmdCounter);
      window.mermaid.render(id, src).then(function (r) {
        n.innerHTML = r.svg;
        n.setAttribute('data-processed', 'true');
        var alt = n.getAttribute('data-alt');
        n.setAttribute('role', 'img');
        if (alt) n.setAttribute('aria-label', alt);
      }).catch(function (err) {
        var p = doc.createElement('p');
        p.className = 'diagram-fallback';
        p.textContent = '此圖表轉譯失敗，請改讀圖下方的文字說明。（' + String(err && err.message ? err.message : err).slice(0, 120) + '）';
        n.parentNode.insertBefore(p, n.nextSibling);
      });
    });
  }

  /* =====================================================================
     測驗引擎
     題型：
       mc    選擇題＋即時回饋（單選；每個選項都有解析）
       scn   情境判斷題（單選；作答後顯示含推理的參考答案）
       match 配對／分類題（下拉選單；提交後逐項批改）
     ===================================================================== */
  var TYPE_NAME = { mc: '選擇題', scn: '情境判斷題', match: '配對題' };
  var KEYS = 'ABCDEFGH';

  function refsHtml(q) {
    return (q.refs || []).map(function (r) { return '<a href="' + esc(r.href) + '">' + esc(r.label) + '</a>'; }).join('、') || '—';
  }
  function loText(q) {
    return (q.lo && q.lo.length) ? q.lo.map(function (n) { return 'LO' + n; }).join('、') : '前置觀念';
  }

  var OwaspQuiz = {
    mount: function (target, cfg) {
      var host = typeof target === 'string' ? $(target) : target;
      if (!host) return;
      var mode = cfg.mode || 'chapter', topicId = cfg.topic || '';
      var state = {};           // qid -> { answered, firstOk }
      var qEls = {};
      var qs = cfg.questions;

      host.innerHTML = '';
      if (cfg.intro) { var intro = doc.createElement('div'); intro.innerHTML = cfg.intro; host.appendChild(intro); }

      var prog = doc.createElement('p');
      prog.className = 'quiz-summary';
      prog.setAttribute('aria-live', 'polite');
      host.appendChild(prog);

      qs.forEach(function (q, idx) {
        state[q.id] = { answered: false, firstOk: false };
        var el = doc.createElement('section');
        el.className = 'q';
        el.id = 'q-' + q.id;
        el.setAttribute('data-qid', q.id);
        qEls[q.id] = el;
        host.appendChild(el);
        renderQuestion(q, idx, el);
      });

      var footer = doc.createElement('div');
      footer.className = 'quiz-footer';
      host.appendChild(footer);
      var reportBox = doc.createElement('div');
      reportBox.setAttribute('aria-live', 'polite');
      host.appendChild(reportBox);

      if (mode === 'final') {
        footer.innerHTML = '<button type="button" class="qbtn" id="btn-report">查看成績與各學習目標掌握度</button> ' +
          '<button type="button" class="qbtn secondary" id="btn-reset">重新測驗</button>' +
          '<p class="q-meta">配對題需全部配對正確才算答對；成績以每題「第一次作答」計算，未作答視為未答對。</p>';
        $('#btn-report', footer).addEventListener('click', showReport);
        $('#btn-reset', footer).addEventListener('click', function () {
          if (window.confirm('確定要清除本次作答並重新開始嗎？')) {
            OwaspQuiz.mount(target, cfg);
            reportBox.innerHTML = '';
            host.scrollIntoView();
          }
        });
      }
      updateProgress();

      function counts() {
        var a = 0, ok = 0;
        qs.forEach(function (q) { if (state[q.id].answered) { a++; if (state[q.id].firstOk) ok++; } });
        return { answered: a, ok: ok, total: qs.length };
      }
      function updateProgress() {
        var c = counts();
        var prev = quizRecord(topicId, cfg.id);
        prog.textContent = '已作答 ' + c.answered + ' / ' + c.total + ' 題；答對 ' + c.ok + ' 題（以第一次作答計）。' +
          (prev && c.answered === 0 ? '　上次記錄：' + (prev.score !== undefined ? prev.score : prev.ok) + ' / ' + prev.total + '。' : '');
      }
      function record(q, ok) {
        var s = state[q.id];
        if (!s.answered) { s.answered = true; s.firstOk = ok; }
        var c = counts();
        if (mode === 'chapter') Store.set(['quiz', topicId, cfg.id], { ok: c.ok, answered: c.answered, total: c.total, t: new Date().getTime() });
        updateProgress();
      }

      function header(q, idx) {
        return '<p class="q-meta"><span>第 ' + (idx + 1) + ' 題</span><span>' + TYPE_NAME[q.type] + '</span>' +
          '<span>對應學習目標：' + loText(q) + '</span><span>教材段落：' + refsHtml(q) + '</span></p>';
      }

      function renderQuestion(q, idx, el) {
        if (q.type === 'match') return renderMatch(q, idx, el);
        var name = 'r-' + cfg.id + '-' + q.id;
        var h = header(q, idx) + '<fieldset class="q-set"><legend class="q-text">' + q.stem + '</legend>';
        if (q.scenario) h += '<div class="q-scenario"><strong>【虛構情境】</strong>' + q.scenario + '</div>';
        h += '<ul class="q-options">';
        q.options.forEach(function (o, i) {
          h += '<li data-k="' + KEYS.charAt(i) + '"><label class="opt"><input type="radio" name="' + name + '" value="' + i + '">' +
            '<span class="opt-key">' + KEYS.charAt(i) + '</span><span>' + o.text + '</span></label>' +
            '<p class="opt-why" hidden></p></li>';
        });
        h += '</ul></fieldset><div class="q-feedback" aria-live="polite"></div>';
        el.innerHTML = h;
        var inputs = $$('input', el), lis = $$('.q-options > li', el), fb = $('.q-feedback', el);
        inputs.forEach(function (inp) {
          inp.addEventListener('change', function () { answer(parseInt(inp.value, 10)); });
        });
        function answer(chosen) {
          var correctIdx = -1;
          q.options.forEach(function (o, i) { if (o.correct) correctIdx = i; });
          var ok = chosen === correctIdx;
          inputs.forEach(function (i2) { i2.disabled = true; });
          lis.forEach(function (li, i) {
            var o = q.options[i], why = $('.opt-why', li), mark;
            if (o.correct) { li.classList.add('is-correct'); mark = (i === chosen ? '✔ 正解（你選的）　' : '✔ 正解　'); }
            else if (i === chosen) { li.classList.add('is-wrong'); mark = '✘ 你選的（不正確）：'; }
            else { li.classList.add('is-other'); mark = '✘ 為什麼不選這個：'; }
            why.innerHTML = '<strong class="mark">' + mark + '</strong>' + (o.why || '');
            why.hidden = false;
          });
          var res = ok ? '<div class="q-result good">答對了。</div>' :
            '<div class="q-result bad">答錯了，正解是 ' + KEYS.charAt(correctIdx) + '。</div>';
          var extra = '';
          if (q.type === 'scn') {
            extra = '<div class="q-answer"><h5>參考答案與推理</h5>' + (q.answer || '') +
              '<p class="q-meta">回頭複習：' + refsHtml(q) + '</p></div>';
          } else if (q.summary) {
            extra = '<div class="q-summary"><strong>重點：</strong>' + q.summary + '</div>';
          }
          fb.innerHTML = res + extra;
          if (mode === 'chapter') {
            var b = doc.createElement('button');
            b.type = 'button'; b.className = 'qbtn secondary'; b.textContent = '重做此題';
            b.addEventListener('click', function () {
              inputs.forEach(function (i2) { i2.disabled = false; i2.checked = false; });
              lis.forEach(function (li) {
                li.classList.remove('is-correct', 'is-wrong', 'is-other');
                var w = $('.opt-why', li); w.hidden = true; w.innerHTML = '';
              });
              fb.innerHTML = '';
            });
            fb.appendChild(b);
          }
          record(q, ok);
        }
      }

      function renderMatch(q, idx, el) {
        var h = header(q, idx) + '<fieldset class="q-set"><legend class="q-text">' + q.stem + '</legend>';
        h += '<div class="m-cats"><strong>可選類別：</strong><ul>' + q.cats.map(function (c) {
          return '<li><strong>' + esc(c.label) + '</strong>' + (c.desc ? '：' + c.desc : '') + '</li>';
        }).join('') + '</ul></div><ul class="m-items">';
        q.items.forEach(function (it, i) {
          h += '<li><span class="m-text">' + it.text + '</span><select aria-label="第 ' + (i + 1) + ' 項的類別"><option value="">— 請選擇 —</option>' +
            q.cats.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.label) + '</option>'; }).join('') +
            '</select><div class="m-res" hidden></div></li>';
        });
        h += '</ul><p class="m-warn" role="alert" hidden></p><button type="button" class="qbtn m-submit">提交配對</button> ' +
          '</fieldset><div class="q-feedback" aria-live="polite"></div>';
        el.innerHTML = h;
        var sels = $$('select', el), lis = $$('.m-items > li', el), fb = $('.q-feedback', el),
          warn = $('.m-warn', el), sub = $('.m-submit', el);
        function catLabel(id) {
          for (var i = 0; i < q.cats.length; i++) if (q.cats[i].id === id) return q.cats[i].label;
          return id;
        }
        sub.addEventListener('click', function () {
          var blank = sels.filter(function (s) { return !s.value; });
          if (blank.length) {
            warn.hidden = false; warn.textContent = '還有 ' + blank.length + ' 項尚未選擇類別，請全部選完再提交。';
            blank[0].focus(); return;
          }
          warn.hidden = true;
          var right = 0;
          q.items.forEach(function (it, i) {
            var ok = sels[i].value === it.answer, res = $('.m-res', lis[i]);
            if (ok) right++;
            lis[i].classList.remove('is-correct', 'is-wrong');
            lis[i].classList.add(ok ? 'is-correct' : 'is-wrong');
            res.hidden = false;
            res.innerHTML = ok ? '<strong>✔ 正確：</strong>' + (it.why || '') :
              '<strong>✘ 你選的是「' + esc(catLabel(sels[i].value)) + '」，應為「' + esc(catLabel(it.answer)) + '」：</strong>' + (it.why || '');
            sels[i].disabled = true;
          });
          sub.disabled = true;
          var all = right === q.items.length;
          fb.innerHTML = '<div class="q-result ' + (all ? 'good' : right ? 'part' : 'bad') + '">' + right + ' / ' + q.items.length +
            ' 項配對正確' + (all ? '，本題答對。' : '，本題需全部正確才算答對。') + '</div>' +
            (q.summary ? '<div class="q-summary"><strong>重點：</strong>' + q.summary + '</div>' : '');
          if (mode === 'chapter') {
            var b = doc.createElement('button');
            b.type = 'button'; b.className = 'qbtn secondary'; b.textContent = '重做此題';
            b.addEventListener('click', function () {
              sels.forEach(function (s) { s.disabled = false; s.value = ''; });
              lis.forEach(function (li) { li.classList.remove('is-correct', 'is-wrong'); var r = $('.m-res', li); r.hidden = true; r.innerHTML = ''; });
              sub.disabled = false; fb.innerHTML = '';
            });
            fb.appendChild(b);
          }
          record(q, all);
        });
      }

      function levelOf(pct) { return pct >= 0.8 ? '掌握' : pct >= 0.5 ? '部分掌握' : '待加強'; }

      function showReport() {
        var c = counts(), los = cfg.los || [], h = '';
        var unanswered = c.total - c.answered;
        h += '<div class="result-box"><h3 id="result-heading">成績</h3><p class="score-big">' + c.ok + ' / ' + c.total +
          '　<small>(' + Math.round(100 * c.ok / c.total) + '%)</small></p>' +
          (unanswered ? '<p class="q-result part">尚有 ' + unanswered + ' 題未作答，已視為未答對。</p>' : '');
        h += '<h3>各學習目標掌握度</h3>';
        var byLO = {};
        los.forEach(function (lo) {
          var related = qs.filter(function (q) { return (q.lo || []).indexOf(lo.n) >= 0; });
          var okN = related.filter(function (q) { return state[q.id].answered && state[q.id].firstOk; }).length;
          var pct = related.length ? okN / related.length : 0;
          byLO[lo.n] = { ok: okN, total: related.length };
          h += '<div class="lo-row"><strong>LO' + lo.n + '</strong>' +
            '<div class="lo-bar" role="img" aria-label="LO' + lo.n + ' 答對 ' + okN + ' / ' + related.length + '"><span style="width:' + Math.round(pct * 100) + '%"></span></div>' +
            '<span class="lo-state">' + okN + ' / ' + related.length + '　' + levelOf(pct) + '</span>' +
            '<span class="lo-text">' + esc(lo.text) + '</span></div>';
        });
        var wrong = qs.filter(function (q) { return !(state[q.id].answered && state[q.id].firstOk); });
        if (wrong.length) {
          h += '<h3>建議回頭複習</h3><ul>' + wrong.map(function (q) {
            return '<li><a href="#q-' + q.id + '">第 ' + (qs.indexOf(q) + 1) + ' 題</a>（' + loText(q) + '，' +
              (state[q.id].answered ? '答錯' : '未作答') + '）→ ' + refsHtml(q) + '</li>';
          }).join('') + '</ul>';
        } else {
          h += '<p class="q-result good">全部答對。可以前往「接下來讀什麼」。</p>';
        }
        h += '<p class="q-meta">掌握度：80% 以上為「掌握」，50–79% 為「部分掌握」，低於 50% 為「待加強」。每個學習目標只有少數題目，這是自我檢視的參考，不是正式評量。</p></div>';
        reportBox.innerHTML = h;
        Store.set(['quiz', topicId, cfg.id], { score: c.ok, ok: c.ok, total: c.total, byLO: byLO, t: new Date().getTime() });
        var hd = $('#result-heading', reportBox);
        if (hd) { hd.setAttribute('tabindex', '-1'); hd.focus(); }
      }
    }
  };
  window.OwaspQuiz = OwaspQuiz;

  /* ---------- 啟動 ---------- */
  function init() {
    buildHeader();
    buildCredit();
    buildBreadcrumb();
    buildNav();
    buildToc();
    buildPager();
    markVisited();
    renderTopicProgress();
    buildHomeMap();
    wireGlossary();
    renderDiagrams();
    try {
      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var cb = function () { if (!root.getAttribute('data-theme')) renderDiagrams(); };
        if (mq.addEventListener) mq.addEventListener('change', cb);
      }
    } catch (e) { /* 忽略 */ }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
