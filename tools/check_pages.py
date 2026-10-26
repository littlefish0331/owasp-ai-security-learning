"""每頁必備元素與 HTML 結構的靜態檢查。

檢查：lang、非官方聲明、頁尾授權行、「本章來源」區塊、單一 h1、viewport、
標題層級不跳級、每張圖都有 figcaption 與 data-alt、常見標籤成對。
另外檢查「中文 (English)」格式：不得有「中文（English）」（全形括弧包英文），
也不得有「中文(English)」（括弧前沒有空格）。

用法：python -I -X utf8 tools/check_pages.py
結束碼：0 = 全部通過；1 = 有問題。
"""
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import project_root, read, html_pages  # noqa: E402

DISCLAIMER = '本教材為非官方學習整理，非 OWASP 發布，內容以官方文件為準'

# 語言規則針對「專有名詞的英文對照」：必須是半形括弧「中文 (English)」。
# 全形括弧包住下列內容是允許的（它們本來就保持原文，不是術語對照）：
#   - 全大寫控制名稱（LEAST MODEL PRIVILEGE）、縮寫、學習目標（LO1）、條目編號（LLM01:2026、ASI02）、域名
#   - 已知的產品／文件／框架名稱（PRODUCT_NAMES）：產品名保持原文，括弧內是補充說明，不是術語的英文對照
# 只有「像一般英文詞」的內容（如 Prompt Injection、Least Privilege）被全形括弧包住才算違規。
# 新增主題若出現新的產品／文件名，把名稱加進 PRODUCT_NAMES 即可（這是刻意的人工清單，避免規則悄悄變鬆）。
PRODUCT_NAMES = {'AI Exchange', 'LLM Top 10', 'Rule of Two', 'GenAI Security Project', 'Solutions Landscape',
                 'Agentic Top 10', 'MCP Top 10', 'AI Security Matrix', 'Threat Defense COMPASS'}
FULLWIDTH_EN = re.compile(r'[一-鿿]（([A-Za-z][A-Za-z0-9 /\-,\.:&;]{2,40})）')
_EXEMPT_RE = re.compile(r'^(?:[A-Z0-9][A-Z0-9 /\-:&\.]*|LO\d|(?:LLM|ASI|MCP|ML)\d{2}(?::\d{2,4})?|[a-z0-9\-\.]+\.[a-z]{2,})$')


class _Exempt:
    @staticmethod
    def match(s):
        return s in PRODUCT_NAMES or bool(_EXEMPT_RE.match(s))


EXEMPT = _Exempt()
PAIRED = ['table', 'div', 'ul', 'ol', 'section', 'figure', 'dl', 'tbody', 'tr', 'p', 'details']
root = project_root()
issues = 0

for p in html_pages(root):
    t = read(p)
    rel = os.path.relpath(p, root)
    s = re.sub(r'<script.*?</script>', '', t, flags=re.S)
    s = re.sub(r'<pre class="mermaid".*?</pre>', '', s, flags=re.S)
    heads = [int(x) for x in re.findall(r'<h([1-6])[ >]', s)]
    figs = re.findall(r'<figure class="diagram">(.*?)</figure>', t, flags=re.S)
    unpaired = [f'{tag}:{len(re.findall("<" + tag + r"[\s>]", s))}/{len(re.findall("</" + tag + ">", s))}'
                for tag in PAIRED if len(re.findall('<' + tag + r'[\s>]', s)) != len(re.findall('</' + tag + '>', s))]
    plain = html.unescape(re.sub(r'<[^>]+>', '', s))
    checks = [
        ('lang=zh-Hant', 'lang="zh-Hant"' in t),
        ('非官方聲明', DISCLAIMER in t),
        ('頁尾授權行', bool(re.search(r'<footer.*?(CC0|CC BY-SA|CC BY-NC-SA).*?</footer>', t, flags=re.S))),
        ('來源區塊', 'class="sources"' in t),
        ('skip-link 與 main', 'class="skip-link"' in t and '<main' in t),
        ('單一 h1', len(re.findall(r'<h1[ >]', t)) == 1),
        ('viewport', 'name="viewport"' in t),
        ('標題不跳級', not any(b - a > 1 for a, b in zip(heads, heads[1:]))),
        ('圖有 figcaption 與 data-alt', all('<figcaption>' in f and 'data-alt=' in f for f in figs)),
        ('標籤成對', not unpaired),
        ('無全形括弧包英文術語', not [m for m in FULLWIDTH_EN.findall(plain) if not EXEMPT.match(m)]),
        ('括弧前有空格', not re.search(r'[一-鿿]\([A-Z][A-Za-z]', plain)),
    ]
    bad = [name for name, ok in checks if not ok]
    if bad:
        issues += 1
        print(rel, 'FAIL', bad, unpaired if unpaired else '')

print(f'pages checked={len(html_pages(root))} pages with issues={issues}')
sys.exit(1 if issues else 0)
