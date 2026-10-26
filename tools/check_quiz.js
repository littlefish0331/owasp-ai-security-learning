// 題庫完整性檢查（對 sitemap.js 中所有 available 主題）。
// 只用 Node 內建模組；不連網；只讀。
//
// 用法：node tools/check_quiz.js [topic-id]     （省略 topic-id = 檢查全部 available 主題）
// 結束碼：0 = 全部通過；1 = 有問題。
//
// 這不是瀏覽器實測：只驗證「資料」正確，不驗證點選互動。互動用 Playwright（見 tools/README.md）。
//
// 檢查項目：
//  - 總測驗題數 = sitemap 的 quizTotal；三種題型都有；每個學習目標至少 2 題；
//    至少一半是情境判斷或配對題（應用／判斷）
//  - 每題有 id、lo、refs；單選題恰好一個正解且每個選項都有解析；情境題有 scenario 與 answer；
//    配對題每項的 answer 在 cats 內且有解析
//  - 章末檢核：每章 3–5 題
//  - 題目 refs 連結的章節檔存在且錨點存在
//  - 正解位置分佈（提示用，不算失敗）
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sitemapSrc = fs.readFileSync(path.join(root, 'assets', 'sitemap.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(sitemapSrc, sandbox);
const SITE = sandbox.window.OWASP_SITE;

const want = process.argv[2];
const topics = [];
SITE.stages.forEach(st => st.topics.forEach(tp => {
  if (tp.status === 'available' && (!want || tp.id === want)) topics.push({ dir: path.join(root, st.dir, tp.id), tp });
}));
if (!topics.length) { console.error('no available topic matched'); process.exit(2); }

function loadMounts(file) {
  const html = fs.readFileSync(file, 'utf8');
  const re = /<script>\n?([\s\S]*?)<\/script>/g;
  let m; const out = [];
  while ((m = re.exec(html))) {
    if (m[1].indexOf('OwaspQuiz.mount') < 0) continue;
    const ctx = { OwaspQuiz: { mount: (t, c) => out.push(c) }, window: {}, document: {} };
    vm.createContext(ctx);
    try { vm.runInContext(m[1], ctx); } catch (e) { console.log('  EVAL ERROR ' + path.basename(file) + ': ' + e.message); }
  }
  return out;
}
const idsCache = {};
function hasAnchor(file, frag) {
  if (!idsCache[file]) idsCache[file] = new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(x => x[1]));
  return idsCache[file].has(frag);
}

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('  FAIL ' + m); } return c; };

for (const { dir, tp } of topics) {
  console.log('== ' + tp.id);
  const quizFile = path.join(dir, 'quiz.html');
  if (!ok(fs.existsSync(quizFile), 'quiz.html missing')) continue;
  const fin = loadMounts(quizFile).filter(c => c.mode === 'final')[0];
  if (!ok(!!fin, 'quiz.html has no mode:"final" mount')) continue;
  const qs = fin.questions;
  if (tp.quizTotal != null) ok(qs.length === tp.quizTotal, 'final quiz has ' + qs.length + ' questions but sitemap quizTotal=' + tp.quizTotal);
  ok(qs.length >= 12 && qs.length <= 20, 'final quiz size ' + qs.length + ' outside 12-20');
  const types = {}; qs.forEach(q => { types[q.type] = (types[q.type] || 0) + 1; });
  ok(types.mc && types.scn && types.match, 'missing a question type ' + JSON.stringify(types));
  const loCount = {}; qs.forEach(q => (q.lo || []).forEach(n => { loCount[n] = (loCount[n] || 0) + 1; }));
  const loDefs = (fin.los || []).map(l => l.n);
  loDefs.forEach(n => ok((loCount[n] || 0) >= 2, 'LO' + n + ' has ' + (loCount[n] || 0) + ' questions (need >= 2)'));
  // 題目標了「測驗頁沒定義」的學習目標：成績報告只會逐一統計已定義的 LO，這題會悄悄不計入任何 LO
  qs.forEach(q => (q.lo || []).forEach(n => ok(loDefs.indexOf(n) >= 0, q.id + ' lo ' + n + ' is not defined in the quiz "los" list')));
  const applyN = (types.scn || 0) + (types.match || 0);
  ok(applyN * 2 >= qs.length, 'application/judgement questions ' + applyN + '/' + qs.length + ' (need >= half)');

  const pos = { A: 0, B: 0, C: 0, D: 0 };
  const seen = new Set();
  qs.forEach(q => {
    if (!ok(!seen.has(q.id), 'duplicate id ' + q.id)) return; seen.add(q.id);
    ok(q.lo && q.lo.length, q.id + ' has no lo');
    ok(q.refs && q.refs.length, q.id + ' has no refs');
    (q.refs || []).forEach(r => {
      const [f, frag] = r.href.split('#');
      const target = path.join(dir, f);
      if (ok(fs.existsSync(target), q.id + ' ref file missing: ' + r.href) && frag) ok(hasAnchor(target, frag), q.id + ' ref anchor missing: ' + r.href);
    });
    if (q.type === 'match') {
      const cids = q.cats.map(c => c.id);
      q.items.forEach((it, i) => { ok(cids.indexOf(it.answer) >= 0, q.id + ' item ' + i + ' answer not in cats'); ok(!!it.why, q.id + ' item ' + i + ' missing why'); });
    } else {
      ok(q.options.filter(o => o.correct).length === 1, q.id + ' needs exactly one correct option');
      q.options.forEach((o, i) => ok(!!o.why, q.id + ' option ' + i + ' missing why'));
      const ci = q.options.findIndex(o => o.correct); if (ci >= 0 && ci < 4) pos['ABCD'[ci]]++;
      if (q.type === 'scn') { ok(!!q.scenario, q.id + ' scn missing scenario'); ok(!!q.answer, q.id + ' scn missing answer'); }
    }
  });
  const total = pos.A + pos.B + pos.C + pos.D;
  const maxShare = total ? Math.max(pos.A, pos.B, pos.C, pos.D) / total : 0;
  console.log('  final: ' + qs.length + ' questions ' + JSON.stringify(types) + ' LO ' + JSON.stringify(loCount));
  console.log('  correct-answer positions (single-choice): ' + JSON.stringify(pos) + (maxShare > 0.5 ? '  <-- one position holds >50%: reshuffle options' : ''));

  const chapters = fs.readdirSync(dir).filter(f => /^\d\d-.*\.html$/.test(f)).sort();
  let chapterQ = 0;
  chapters.forEach(f => {
    loadMounts(path.join(dir, f)).forEach(c => {
      const n = c.questions.length; chapterQ += n;
      ok(n >= 3 && n <= 5, f + ' has ' + n + ' chapter-end questions (need 3-5)');
      c.questions.forEach(q => {
        if (q.type !== 'match') ok(q.options.filter(o => o.correct).length === 1, f + ' ' + q.id + ' needs exactly one correct option');
        (q.refs || []).forEach(r => { const [rf, frag] = r.href.split('#'); const target = path.join(dir, rf); if (ok(fs.existsSync(target), f + ' ' + q.id + ' ref file missing: ' + r.href) && frag) ok(hasAnchor(target, frag), f + ' ' + q.id + ' ref anchor missing: ' + r.href); });
      });
    });
  });
  console.log('  chapter-end questions: ' + chapterQ + ' across ' + chapters.length + ' chapter files');
}
console.log(fails ? '\n' + fails + ' problem(s)' : '\nALL PASSED');
process.exit(fails ? 1 : 0);
