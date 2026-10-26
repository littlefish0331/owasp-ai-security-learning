// 以極簡「假 DOM」載入 assets/app.js 與 assets/sitemap.js：
//  - 啟動不丟例外；localStorage 全部丟例外時仍能啟動（規格要求）
//  - 每個 available 主題的章節頁：全站目錄、麵包屑、上一頁／下一頁正確
//  - 根目錄首頁的學習地圖列出 01–07，且 available 主題都有連結
//
// 用法：node tools/check_app_boot.js
// 結束碼：0 = 全部通過；1 = 有問題。
//
// 限制：假 DOM 不會解析 innerHTML，所以【不能】證明點選互動、Mermaid 繪圖或版面正確。
// 那些要用 Playwright（見 tools/README.md）。這支只負責「共用 JS 沒有壞」。
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const appSrc = fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8');
const siteSrc = fs.readFileSync(path.join(root, 'assets', 'sitemap.js'), 'utf8');

function makeEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(), children: [], attrs: {}, style: {}, _html: '', _text: '',
    hidden: false, disabled: false, value: '', checked: false, _listeners: {},
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); }, remove(...c) { c.forEach(x => this._s.delete(x)); },
      toggle(c, f) { const on = f === undefined ? !this._s.has(c) : f; if (on) this._s.add(c); else this._s.delete(c); return on; },
      contains(c) { return this._s.has(c); }
    },
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
    hasAttribute(k) { return k in this.attrs; }, removeAttribute(k) { delete this.attrs[k]; },
    appendChild(c) { this.children.push(c); return c; }, insertBefore(c) { this.children.push(c); return c; }, removeChild() {},
    addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
    querySelector(sel) {
      const m = /^#([\w-]+)$/.exec(sel || ''), k = /^\.([\w-]+)$/.exec(sel || '');
      if (m && this._html.indexOf('id="' + m[1] + '"') >= 0) return makeEl('div');
      if (k && new RegExp('class="[^"]*\\b' + k[1] + '\\b').test(this._html)) return makeEl('div');
      return null;
    },
    querySelectorAll() { return []; }, closest() { return null; }, focus() {}, scrollIntoView() {},
    get parentNode() { return { insertBefore() {}, appendChild() {}, querySelector() { return null; }, removeChild() {} }; },
    get nextSibling() { return null; }, get nextElementSibling() { return null; }
  };
  Object.defineProperty(el, 'innerHTML', { get() { return this._html; }, set(v) { this._html = v; } });
  Object.defineProperty(el, 'textContent', { get() { return this._text || this._html.replace(/<[^>]+>/g, ''); }, set(v) { this._text = v; } });
  Object.defineProperty(el, 'className', { get() { return [...this.classList._s].join(' '); }, set(v) { this.classList._s = new Set(String(v).split(/\s+/).filter(Boolean)); } });
  return el;
}

function run(bodyAttrs, storage) {
  const body = makeEl('body');
  Object.keys(bodyAttrs).forEach(k => body.setAttribute(k, bodyAttrs[k]));
  const byId = {};
  ['site-header', 'breadcrumb', 'site-nav', 'pager', 'topic-progress', 'home-map', 'page-toc', 'theme-btn', 'font-btn', 'nav-toggle']
    .forEach(i => { byId[i] = makeEl('div'); });
  const doc = {
    readyState: 'complete', body, documentElement: makeEl('html'), title: 'T', createElement: makeEl, addEventListener() {},
    querySelector: sel => (sel[0] === '#' ? (byId[sel.slice(1)] || null) : null), querySelectorAll: () => []
  };
  const mem = {};
  const localStorage = storage === 'ok'
    ? { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } }
    : { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceeded'); }, removeItem() { throw new Error('x'); } };
  const win = { localStorage, matchMedia: () => ({ matches: false, addEventListener() {} }), getComputedStyle: () => ({ fontFamily: 'x' }), confirm: () => true, addEventListener() {} };
  win.window = win;
  const ctx = { window: win, document: doc, console, JSON, Date, Math, Object, Array, String, Number, parseInt, setTimeout };
  vm.createContext(ctx);
  vm.runInContext(siteSrc, ctx);
  vm.runInContext(appSrc, ctx);
  return { byId, mem, site: ctx.window.OWASP_SITE };
}

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } else console.log('PASS ' + m); };

// 1) 根目錄首頁：學習地圖
let r = run({ 'data-root': '', 'data-page': 'index.html' }, 'ok');
const site = r.site;
const map = r.byId['home-map'].innerHTML;
ok(site.stages.length === 7, 'sitemap has 7 stages');
site.stages.forEach(st => ok(map.indexOf(st.id + ' ' + st.title) >= 0, 'home map lists stage ' + st.id + ' ' + st.title));
const available = [];
site.stages.forEach(st => st.topics.forEach(tp => { if (tp.status === 'available') available.push({ st, tp }); }));
available.forEach(({ st, tp }) => ok(map.indexOf(st.dir + '/' + tp.id + '/index.html') >= 0, 'home map links available topic ' + tp.id));
site.stages.forEach(st => st.topics.forEach(tp => { if (tp.status !== 'available') ok(map.indexOf(st.dir + '/' + tp.id + '/') < 0, 'planned topic not linked: ' + tp.id); }));

// 2) 每個 available 主題的每個頁面：啟動、目錄、麵包屑、上下頁；localStorage 壞掉也能啟動
available.forEach(({ st, tp }) => {
  tp.pages.forEach((pg, i) => {
    const attrs = { 'data-root': '../../', 'data-stage': st.dir, 'data-topic': tp.id, 'data-page': pg.file };
    let threw = null, rr;
    try { rr = run(attrs, 'ok'); } catch (e) { threw = e; }
    ok(!threw, tp.id + '/' + pg.file + ' boots' + (threw ? ' :: ' + threw.message : ''));
    if (threw) return;
    ok(rr.byId['site-nav'].innerHTML.indexOf('aria-current="page"') >= 0, tp.id + '/' + pg.file + ' nav marks current page');
    ok(rr.byId['breadcrumb'].innerHTML.indexOf(tp.title) >= 0, tp.id + '/' + pg.file + ' breadcrumb has topic title');
    const hasPrev = i > 0, hasNext = i < tp.pages.length - 1;
    const pager = rr.byId['pager'].innerHTML;
    ok(!hasPrev || pager.indexOf('rel="prev"') >= 0, tp.id + '/' + pg.file + ' pager prev');
    ok(pager.indexOf('rel="next"') >= 0 || !hasNext && pager.indexOf('index.html') >= 0, tp.id + '/' + pg.file + ' pager next/home');
    let t2 = null; try { run(attrs, 'broken'); } catch (e) { t2 = e; }
    ok(!t2, tp.id + '/' + pg.file + ' boots with throwing localStorage');
  });
});
console.log(fails ? '\n' + fails + ' FAILED' : '\nALL PASSED');
process.exit(fails ? 1 : 0);
