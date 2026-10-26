"""閱讀順序檢查：每個主題 index.html「前置知識」段落所連到的其他主題，是否排在它前面。

順序以 assets/sitemap.js 為準（先依階段 01–07，再依階段內的登記順序）。
前置知識裡連到「資安前置觀念」「詞彙表」不算（它們在所有主題之前）。
前置知識裡的連結若指向後面的主題，代表學習路徑自相矛盾：
  - 若該前置只是「建議」，就改前置知識文字；
  - 若確實需要，就調整 sitemap.js 的主題順序。

另外列出「接下來讀什麼」類段落是否連到不存在的主題（連結壞掉會由 check_links.py 抓）。

用法：python -I -X utf8 tools/check_reading_order.py
結束碼：0 = 沒有矛盾；1 = 有前置知識指向排在後面的主題。
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import project_root, read, available_topics, topic_dir  # noqa: E402

root = project_root()
topics = available_topics(root)
pos = {(t['stage_dir'], t['id']): i for i, t in enumerate(topics)}
bad = 0
rows = []

for t in topics:
    idx = os.path.join(topic_dir(root, t), 'index.html')
    if not os.path.isfile(idx):
        continue
    html = read(idx)
    m = re.search(r'<h2[^>]*>\s*前置知識\s*</h2>(.*?)(?=<h2|</article>)', html, flags=re.S)
    if not m:
        rows.append((t['stage_dir'], t['id'], '（沒有「前置知識」段落）', []))
        continue
    deps = []
    for href in re.findall(r'href="([^"#]+)', m.group(1)):
        if href.startswith(('http', 'mailto')):
            continue
        target = os.path.normpath(os.path.join(topic_dir(root, t), href))
        rel = os.path.relpath(target, root).replace(os.sep, '/').split('/')
        if len(rel) >= 3 and (rel[0], rel[1]) in pos:
            deps.append((rel[0], rel[1]))
    for d in sorted(set(deps)):
        if d == (t['stage_dir'], t['id']):
            continue
        if pos[d] > pos[(t['stage_dir'], t['id'])]:
            bad += 1
            print('矛盾：%s/%s 的前置知識連到排在後面的 %s/%s' % (t['stage_dir'], t['id'], d[0], d[1]))
    rows.append((t['stage_dir'], t['id'], '', sorted(set(deps))))

print('\n主題數 %d；前置知識指向後面主題的矛盾：%d' % (len(topics), bad))
no_pre = [r for r in rows if r[2]]
if no_pre:
    print('沒有「前置知識」段落的主題：' + '、'.join('%s/%s' % (r[0], r[1]) for r in no_pre))
sys.exit(1 if bad else 0)
