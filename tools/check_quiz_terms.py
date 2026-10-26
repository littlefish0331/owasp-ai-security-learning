"""題目用到的專有名詞／編號／「引號詞」是否出現在「題目連結的章節」裡。

目的：落實「題目不得出現教材沒教過的事實」。這是啟發式檢查，會有誤報，
請人工判斷旗標；但「教材未見」的條目通常代表要把該詞補進教材。

用法：python -I -X utf8 tools/check_quiz_terms.py [topic-id]
結束碼：0（只提示，不當作失敗）。
"""
import html
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import project_root, read, available_topics, topic_dir  # noqa: E402

root = project_root()
want = sys.argv[1] if len(sys.argv) > 1 else None

DUMP_JS = r'''
const fs=require('fs'),vm=require('vm');const out=[];
for(const f of process.argv.slice(1)){const html=fs.readFileSync(f,'utf8');
 const re=/<script>\n?([\s\S]*?)<\/script>/g;let m;
 while((m=re.exec(html))){if(m[1].indexOf('OwaspQuiz.mount')<0)continue;
  const ctx={OwaspQuiz:{mount:(t,c)=>(c.questions||[]).forEach(q=>out.push({f,q}))},window:{},document:{}};
  vm.createContext(ctx);try{vm.runInContext(m[1],ctx)}catch(e){}}}
console.log(JSON.stringify(out));'''

IGNORE = {'LLM', 'RAG', 'API', 'CIA', 'PDF', 'URL', 'HTML', 'JSON', 'NIST', 'MITRE', 'ISO', 'IEC',
          'OWASP', 'CVE', 'GRC', 'AI', 'EU', 'XSS', 'SQL', 'CSRF', 'RCE', 'SSRF', 'LO', 'GenAI', 'The'}


def article_text(path):
    t = read(path)
    a, b = t.find('<article'), t.find('</article>')
    body = t[a:b]
    body = re.sub(r'<section class="quiz".*?</section>', '', body, flags=re.S)  # 不用題目證明題目
    body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body))).lower()


def terms(text):
    text = re.sub(r'<[^>]+>', ' ', html.unescape(text))
    out = set()
    for m in re.finditer(r'\b(?:LLM|ASI|MCP|ML)\d{2}(?::\d{2,4})?\b|\bAML\.[TM]\d+(?:\.\d+)?\b|'
                         r'\b[A-Z][A-Z0-9]{2,}(?: [A-Z][A-Z0-9]{2,}){0,3}\b|\b[A-Z][A-Za-z]+(?: [A-Z&][A-Za-z\-]+){1,4}\b', text):
        out.add(m.group(0))
    for m in re.finditer(r'「([^」]{2,16})」', text):
        out.add(m.group(1))
    return out


total_flag = 0
for t in available_topics(root):
    if want and t['id'] != want:
        continue
    d = topic_dir(root, t)
    chapter_files = sorted(f for f in os.listdir(d) if re.match(r'^\d\d-.*\.html$', f))
    corpus = {f: article_text(os.path.join(d, f)) for f in chapter_files}
    prim = os.path.join(root, 'primer-security-for-developers.html')
    if os.path.exists(prim):
        corpus['primer'] = article_text(prim)
    alltext = ' '.join(corpus.values())
    files = [os.path.join(d, f) for f in chapter_files] + [os.path.join(d, 'quiz.html')]
    r = subprocess.run(['node', '-e', DUMP_JS] + files, capture_output=True, text=True, encoding='utf-8')
    if r.returncode != 0:
        print('node failed:', r.stderr[:200])
        continue
    qs = json.loads(r.stdout)
    print('==', t['id'], f'({len(qs)} questions)')
    flagged = 0
    for it in qs:
        q = it['q']
        blob = ' '.join([q.get('stem', ''), q.get('scenario', ''), q.get('summary', ''), q.get('answer', '')]
                        + [o['text'] + ' ' + o.get('why', '') for o in q.get('options', [])]
                        + [i['text'] + ' ' + i.get('why', '') for i in q.get('items', [])]
                        + [c['label'] + ' ' + c.get('desc', '') for c in q.get('cats', [])])
        src = set()
        for rf in q.get('refs', []):
            m = re.match(r'(\d\d-[^#]*\.html)', rf['href'])
            if m and m.group(1) in corpus:
                src.add(m.group(1))
            elif 'primer' in rf['href']:
                src.add('primer')
        ref_text = ' '.join(corpus[s] for s in src) or alltext
        missing = []
        for term in sorted(terms(blob)):
            if term in IGNORE or len(term) < 4:
                continue
            tl = term.lower()
            if tl in ref_text:
                continue
            missing.append((term, '其他章節有' if tl in alltext else '教材未見'))
        missing = [m for m in missing if m[1] == '教材未見']
        if missing:
            flagged += len(missing)
            print(f"  [{os.path.basename(it['f'])} {q['id']}] 連結章節={sorted(src)}")
            for term, why in missing:
                print('      教材未見:', repr(term))
    print(f'  flagged terms: {flagged}（人工判斷：多數是題目自己的措辭；若是事實或名稱，請補進對應章節）')
    total_flag += flagged
print('total flagged:', total_flag)
