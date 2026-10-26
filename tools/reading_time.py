"""估算章節閱讀時間（不含章末檢核與「本章來源」區塊）。

算法：中文字數 + 其他字元數 * 0.5，除以 400 字/分鐘；每張 Mermaid 圖另加 0.5 分鐘。
這是粗估，用來避免章節超過規格（約 5 分鐘）太多；章首「預估閱讀」請寫此腳本的四捨五入值。

用法：python -I -X utf8 tools/reading_time.py [檔案...]    省略 = 所有 available 主題的章節頁
"""
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import project_root, read, available_topics, topic_dir  # noqa: E402


def estimate(path):
    t = read(path)
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)
    t = re.sub(r'<section class="(?:quiz|sources)".*?</section>', '', t, flags=re.S)
    nfig = len(re.findall(r'<pre class="mermaid"', t))
    t = re.sub(r'<pre class="mermaid".*?</pre>', '', t, flags=re.S)
    m = re.search(r'<article[^>]*>(.*?)</article>', t, flags=re.S)
    body = m.group(1) if m else t
    txt = re.sub(r'\s+', '', html.unescape(re.sub(r'<[^>]+>', ' ', body)))
    cjk = len(re.findall(r'[一-鿿]', txt))
    other = len(txt) - cjk
    return cjk, other, nfig, (cjk + other * 0.5) / 400 + nfig * 0.5


root = project_root()
files = sys.argv[1:]
if not files:
    for tp in available_topics(root):
        d = topic_dir(root, tp)
        files += [os.path.join(d, f) for f in sorted(os.listdir(d)) if re.match(r'^\d\d-.*\.html$', f)]

worst = 0.0
for f in files:
    cjk, other, nfig, mins = estimate(f)
    worst = max(worst, mins)
    flag = '  <-- 超過 10 分鐘，請拆章' if mins > 10 else ('  <-- 超過 8 分鐘' if mins > 8 else '')
    print(f'{os.path.relpath(f, root):62s} 中文 {cjk:5d} 其他 {other:5d} 圖 {nfig}  約 {mins:4.1f} 分鐘{flag}')
print(f'longest: {worst:.1f} min （規格約 5 分鐘；實務上 ≤ 8 分鐘可接受，見 prompt 第 4 節）')
