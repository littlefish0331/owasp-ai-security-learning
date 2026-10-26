"""內部連結、錨點、資源路徑、sitemap 登記、data-root 的靜態檢查。

用法：python -I -X utf8 tools/check_links.py
結束碼：0 = 全部通過；1 = 有問題。
"""
import os
import re
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import project_root, read, html_pages, available_topics, topic_dir  # noqa: E402

root = project_root()
pages = html_pages(root)
id_cache = {}
problems = 0
checked = 0


def ids_of(path):
    if path not in id_cache:
        id_cache[path] = set(re.findall(r'\sid="([^"]+)"', read(path)))
    return id_cache[path]


for p in pages:
    t = read(p)
    scan = re.sub(r'<pre class="mermaid".*?</pre>', '', t, flags=re.S)
    refs = re.findall(r'(?:href|src)="([^"]+)"', scan)
    refs += re.findall(r"href:\s*'([^']+)'", t)  # 測驗 refs: { href: '...' }
    for r in refs:
        if re.match(r'^(https?:|mailto:|javascript:|data:)', r):
            continue
        path, _, frag = r.partition('#')
        target = p if path == '' else os.path.normpath(os.path.join(os.path.dirname(p), urllib.parse.unquote(path)))
        checked += 1
        rel = os.path.relpath(p, root)
        if not os.path.exists(target):
            print('MISSING FILE  ', rel, '->', r)
            problems += 1
            continue
        if frag and target.endswith('.html') and frag not in ids_of(target):
            print('MISSING ANCHOR', rel, '->', r)
            problems += 1

print(f'pages={len(pages)} refs-checked={checked} problems={problems}')

# sitemap 登記的頁面都存在；反過來，主題資料夾內的 html 都有登記
miss = 0
for t in available_topics(root):
    d = topic_dir(root, t)
    registered = {pg['file'] for pg in t['pages']}
    for pg in t['pages']:
        if not os.path.exists(os.path.join(d, pg['file'])):
            print('SITEMAP page missing on disk:', os.path.relpath(os.path.join(d, pg['file']), root))
            miss += 1
    if os.path.isdir(d):
        for f in sorted(os.listdir(d)):
            if f.endswith('.html') and f not in registered:
                print('NOT REGISTERED in sitemap:', os.path.relpath(os.path.join(d, f), root))
                miss += 1
print('sitemap problems:', miss)
problems += miss

# data-root 必須等於「到專案根目錄的相對路徑」
bad_root = 0
for p in pages:
    depth = os.path.relpath(p, root).count(os.sep)
    exp = '../' * depth
    m = re.search(r'data-root="([^"]*)"', read(p))
    if not m or m.group(1) != exp:
        print('data-root mismatch', os.path.relpath(p, root), 'has', m.group(1) if m else None, 'expected', repr(exp))
        bad_root += 1
print('data-root problems:', bad_root)
problems += bad_root

sys.exit(1 if problems else 0)
